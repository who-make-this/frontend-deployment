import React, { useState, useEffect, useRef } from "react";
import MainPageImg from "../../assets/mainPage.svg";
import Logo from "../../component/Logo";
import MissionCard from "../../component/missionCard";
import CompleteMission from "./CompleteMission";
import MissionTypeButtons from "./MissionTypeButtons";
import typeEat from "../../assets/type_eat.png";
import typeMood from "../../assets/type_mood.png";
import typeTravel from "../../assets/type_travel.png";
import exit from "../../assets/exit.svg";
import vectorCamera from "../../assets/vectorCamera.svg";
import refresh from "../../assets/iconoir_refresh.svg";
import refresh_black from "../../assets/iconoir_refresh_black.svg";
import loading from "../../assets/loading.svg";
import { useNavigate } from "react-router-dom";
import {
  getRandomMission,
  createMission,
  getCompletedMissions,
  authenticateMission,
  endMission,
  getCompletedImages,
} from "./api/MissionApi";

export default function MissionPage({ setIsMissionActive }) {
  const marketId = 1;
  const navigate = useNavigate();

  // UI 상태 관리
  const [selectedType, setSelectedType] = useState(null);
  const [refreshHovered, setRefreshHovered] = useState(false);
  const [refreshClicked, setRefreshClicked] = useState(false);

  // 팝업 상태 관리
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupActive, setPopupActive] = useState(false);
  const [cannotExitVisible, setCannotExitVisible] = useState(false);
  const [exitStep, setExitStep] = useState("none");
  const [authResult, setAuthResult] = useState(null);
  const [authInProgress, setAuthInProgress] = useState(false);

  // 미션 관련 상태
  const [randomMission, setRandomMission] = useState(null);
  const [collectedMissions, setCollectedMissions] = useState([]);

  // 참조
  const hasFetched = useRef(false);

  const missionTypes = [
    { category: "감성형", count: 12, icon: typeMood, bgColor: "#A792B960" },
    { category: "먹보형", count: 8, icon: typeEat, bgColor: "#D19B9860" },
    { category: "모험형", count: 5, icon: typeTravel, bgColor: "#889F6960" },
  ];

  // 각 타입별 완료 미션 수 계산
  const missionTypesWithCount = missionTypes.map((m) => ({
    ...m,
    count: collectedMissions.filter((cm) => cm.category === m.category).length,
  }));

  // 팝업 관련 유틸리티 함수
  const openPopup = () => {
    setPopupVisible(true);
    setTimeout(() => setPopupActive(true), 20);
  };

  const closePopup = () => {
    setPopupActive(false);
    setTimeout(() => setPopupVisible(false), 300);
  };

  // 초기 랜덤 미션 불러오기
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    (async () => {
      try {
        console.log("초기 로딩: 랜덤 미션 요청 시작...");
        const mission = await getRandomMission(marketId);
        console.log("초기 로딩: 받은 미션 데이터:", mission);

        if (mission) {
          setRandomMission({
            category: mission.category || "감성형",
            missionNumbers: mission.missionNumbers || mission.id,
            missionTitle: mission.missionTitle || mission.title,
            content: mission.content || mission.description,
            id: mission.id,
            isLoading: false,
          });
        } else {
          throw new Error("미션 데이터를 받지 못했습니다");
        }
      } catch (err) {
        console.error("초기 미션 로딩 실패:", err);

        // 실패하면 createMission 시도
        try {
          console.log("createMission으로 재시도...");
          await createMission(marketId);
          await new Promise((resolve) => setTimeout(resolve, 1000));
          const mission = await getRandomMission(marketId);

          if (mission) {
            setRandomMission({
              category: mission.category || "감성형",
              missionNumbers: mission.missionNumbers || mission.id,
              missionTitle: mission.missionTitle || mission.title,
              content: mission.content || mission.description,
              id: mission.id,
              isLoading: false,
            });
          } else {
            throw new Error("재시도에서도 미션 데이터를 받지 못했습니다");
          }
        } catch (retryErr) {
          console.error("재시도도 실패:", retryErr);
          setRandomMission({
            category: "감성형",
            missionNumbers: "!",
            missionTitle: "로딩 실패",
            content: "페이지를 새로고침해보세요.",
            isLoading: false,
            isError: true,
          });
        }
      }
    })();
  }, []);

  // 완료된 미션 불러오기
  useEffect(() => {
    const fetchCompletedMissions = async () => {
      try {
        const allCompleted = await Promise.all(
          missionTypes.map((type) => getCompletedMissions(type.category))
        );
        setCollectedMissions(allCompleted.flat());
      } catch (error) {
        console.error("완료된 미션 불러오기 실패:", error);
      }
    };
    fetchCompletedMissions();
  }, []);

  // 스크롤 제어
  useEffect(() => {
    document.body.style.overflow =
      popupVisible || cannotExitVisible || authInProgress || authResult
        ? "hidden"
        : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [popupVisible, cannotExitVisible, authInProgress, authResult]);

  const handleRefreshClick = async () => {
    setRefreshClicked(true);

    try {
      console.log("새로고침: 랜덤 미션 요청 시작... marketId:", marketId);
      const mission = await getRandomMission(marketId);
      console.log("새로고침: 받은 미션 데이터:", mission);

      if (mission && (mission.missionTitle || mission.title)) {
        setRandomMission({
          ...mission,
          isLoading: false,
          // API 응답의 필드명을 정규화
          missionTitle: mission.missionTitle || mission.title,
          content:
            mission.content || mission.description || mission.missionContent,
        });
      } else {
        console.log("새로고침 - 미션 데이터 구조:", mission);
        throw new Error(
          `미션 데이터가 올바르지 않습니다: ${JSON.stringify(mission)}`
        );
      }
    } catch (err) {
      console.error("새로고침 미션 불러오기 실패:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        config: err.config,
      });

      // 400 에러의 경우 특별 처리
      let errorMessage = "다시 시도해주세요.";
      if (err.response?.status === 400) {
        errorMessage = "잘못된 요청입니다. 페이지를 새로고침해주세요.";
      } else if (err.response?.status === 401) {
        errorMessage = "로그인이 필요합니다.";
      } else if (err.response?.status === 403) {
        errorMessage = "권한이 없습니다.";
      } else if (err.response?.status >= 500) {
        errorMessage = "서버 오류입니다. 잠시 후 시도해주세요.";
      }

      setRandomMission({
        category: "감성형",
        missionNumbers: "!",
        missionTitle: "새로고침 실패",
        content: errorMessage,
        isLoading: false,
        isError: true,
      });
    } finally {
      setTimeout(() => setRefreshClicked(false), 1000);
    }
  };

  const handleAuthenticateClick = async () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.click();

    fileInput.onchange = async () => {
      const file = fileInput.files[0];
      if (!file) return;

      setAuthInProgress(true);

      try {
        const updatedMission = await authenticateMission(
          randomMission.id,
          file
        );
        setRandomMission(updatedMission);

        // 완료된 미션 목록 업데이트
        const completed = await getCompletedMissions(updatedMission.category);
        setCollectedMissions((prev) => {
          const filtered = prev.filter(
            (m) => m.category !== updatedMission.category
          );
          return [...filtered, ...completed];
        });

        if (updatedMission.completed) {
          setAuthResult({ type: "success" });
        } else {
          setAuthResult({
            type: "error",
            message: updatedMission.failureReason || "인증에 실패했습니다.",
          });
        }
      } catch (err) {
        console.error(
          "미션 인증 요청 실패:",
          err.response?.data || err.message
        );
        const failureReason =
          err.response?.data?.failureReason ||
          "인증 요청 중 오류가 발생했습니다.";
        setAuthResult({ type: "error", message: failureReason });
      } finally {
        setAuthInProgress(false);
      }
    };
  };

  // 스타일 계산
  const selectedTypeColor = selectedType
    ? missionTypes
        .find((category) => category.category === selectedType)
        ?.bgColor.slice(0, 7)
    : null;

  const gradientColor = selectedTypeColor
    ? `${selectedTypeColor}60`
    : "#2B2B2B80";

  const completedMissionsOfType = selectedType
    ? collectedMissions.filter((m) => m.category === selectedType)
    : [];

  return (
    <div className="w-[375px] h-[812px] flex min-h-screen bg-gray-100">
      <div className="fixed top-0 left-0 w-full z-50">
        <Logo />
      </div>

      <div className="bg-white shadow-sm relative flex items-center justify-center overflow-hidden">
        <img
          src={MainPageImg}
          alt="Main Page"
          className="w-full h-full object-cover"
        />

        <div
          className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 backdrop-blur-[10px]"
          style={{ backgroundColor: "#2B2B2BB2" }}
        />

        <div
          className="absolute top-0 left-0 w-full h-full pointer-events-none z-10"
          style={{
            background: `linear-gradient(to top right, transparent, 60%, ${gradientColor})`,
          }}
        />

        <div className="absolute left-2 top-16 flex flex-row w-[340px] z-20 items-center">
          <MissionTypeButtons
            missionTypesWithCount={missionTypesWithCount}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
          />
        </div>

        <div className="absolute top-[140px] right-8 z-30">
          {!selectedType && (
            <button
              onClick={handleRefreshClick}
              onMouseEnter={() => setRefreshHovered(true)}
              onMouseLeave={() => setRefreshHovered(false)}
              className={`w-10 h-10 flex items-center backdrop-blur-[4px] justify-center rounded-full transition
                ${
                  refreshHovered
                    ? "bg-white/50"
                    : "bg-white/20 hover:bg-white/50"
                }`}
              aria-label="미션 새로고침"
            >
              <img
                src={refreshHovered || refreshClicked ? refresh_black : refresh}
                alt="새로고침 아이콘"
                className="w-6 h-6"
                draggable={false}
              />
            </button>
          )}
        </div>

        <div
          className={`absolute flex flex-col items-center z-20 gap-4 px-4 overflow-y-auto max-w-[312px] hide-scrollbar
    ${selectedType ? "top-[120px] bottom-0" : "top-[160px] h-[464px]"}`}
        >
          {selectedType ? (
            completedMissionsOfType.length > 0 ? (
              <CompleteMission missions={completedMissionsOfType} />
            ) : (
              <div className="text-white text-center text-lg mt-50">
                아직 성공한 미션이 없어요...
              </div>
            )
          ) : (
            randomMission && <MissionCard {...randomMission} />
          )}
        </div>

        {!selectedType && (
          <div className="absolute bottom-30 left-1/2 -translate-x-1/2 w-78 px-4 flex justify-between z-50">
            <button
              onClick={openPopup}
              className="w-33 h-[50px] flex items-center p-6 border border-white rounded-xl text-white duration-250 ease-in-out active:bg-[#ffffffb9]"
            >
              <img
                src={exit}
                className="w-[17px] h-[18px] object-contain"
                alt="탐험 종료"
              />
              <div className="ps-2 font-medium text-sm">탐험 종료</div>
            </button>

            <button
              onClick={handleAuthenticateClick}
              className="w-33 h-[50px] flex items-center p-6 border border-black rounded-xl text-black bg-white duration-250 ease-in-out active:bg-[#A47764] active:text-white active:font-bold"
            >
              <img
                src={vectorCamera}
                className="w-[20px] h-[20px] object-contain"
                alt="미션 인증"
              />
              <div className="ps-2 font-medium text-sm">미션 인증</div>
            </button>
          </div>
        )}

        {/* 로딩 팝업 */}
        {authInProgress && (
          <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/70">
            <img
              src={loading}
              alt="인증 중 로딩"
              className="w-16 h-16 animate-spin mb-4"
            />
            <div className="text-white text-xl font-semibold">
              이미지 검토 중...
            </div>
          </div>
        )}

        {/* 인증 결과 팝업 */}
        {authResult && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70">
            <div className="w-[349px] h-auto bg-white rounded-3xl p-8 flex flex-col justify-between">
              <div>
                <div className="text-2xl font-medium">
                  {authResult.type === "success"
                    ? "미션 성공!"
                    : "미션 실패..."}
                </div>
                <div className="mt-3 mb-6">
                  {authResult.type === "success"
                    ? "미션을 성공적으로 완료했어요! 계속 탐험하며 다음 미션에 도전해보세요."
                    : authResult.message}
                </div>
              </div>

              <div className="flex gap-3">
                {authResult.type === "error" && (
                  <button
                    onClick={() => setAuthResult(null)}
                    className="flex-1 py-3 rounded-full bg-gray-200 text-gray-800"
                  >
                    취소
                  </button>
                )}

                <button
                  className={`py-3 rounded-full bg-[#9A8C4F] text-white ${
                    authResult.type === "success" ? "w-[50%] ml-auto" : "flex-1"
                  }`}
                  onClick={async () => {
                    if (authResult.type === "success") {
                      // 다음 미션 불러오는 중 표시
                      setRandomMission({
                        category: randomMission?.category || "감성형",
                        missionNumbers: "...",
                        missionTitle: "다음 미션 준비 중...",
                        content: "잠시만 기다려주세요.",
                        isLoading: true,
                      });

                      try {
                        console.log("다음 미션 요청 시작...");
                        const mission = await getRandomMission(marketId);
                        console.log("다음 미션 데이터:", mission);

                        if (mission) {
                          setRandomMission({
                            ...mission,
                            isLoading: false,
                            // API 응답의 필드명을 정규화
                            missionTitle: mission.missionTitle || mission.title,
                            content: mission.content || mission.description,
                          });
                        } else {
                          throw new Error("미션 데이터가 비어있습니다");
                        }
                      } catch (err) {
                        console.error("다음 미션 불러오기 실패:", {
                          message: err.message,
                          response: err.response?.data,
                          status: err.response?.status,
                        });

                        setRandomMission({
                          category: "감성형",
                          missionNumbers: "!",
                          missionTitle: "다음 미션 로딩 실패",
                          content: `오류: ${
                            err.response?.data?.message || err.message
                          }`,
                          isLoading: false,
                          isError: true,
                        });
                      }
                    } else if (authResult.type === "error") {
                      handleAuthenticateClick();
                    }
                    setAuthResult(null);
                  }}
                >
                  {authResult.type === "success"
                    ? "다음 미션으로"
                    : "다시 인증하기"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 탐험 종료 팝업 */}
        {popupVisible && (
          <>
            <div
              className={`fixed inset-0 z-40 transition-opacity duration-300 ${
                popupActive ? "opacity-100" : "opacity-0"
              }`}
              style={{ backgroundColor: "rgba(0,0,0,0.8)" }}
              onClick={() => setExitStep("none")}
            />
            <div
              role="dialog"
              aria-modal="true"
              className={`fixed bottom-0 left-0 w-full z-50 transform transition-all duration-300 ease-out 
                ${
                  popupActive
                    ? "translate-y-0 opacity-100"
                    : "translate-y-full opacity-0"
                }`}
              style={{ willChange: "transform, opacity" }}
            >
              <div className="bg-white rounded-t-2xl p-8 pb-16">
                <div className="text-2xl font-medium p-1">탐험 종료</div>
                <div className="p-1 mb-6">
                  하루에 한 번만 탐험이 가능합니다. 지금 탐험을 종료하면, 오늘은
                  더 이상 진행할 수 없어요.
                  <div className="text-[#9A8C4F]">
                    ( 해커톤 행사 기간엔 해당 없음 )
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    className="flex-1 py-3 rounded-full bg-gray-200 text-gray-800"
                    onClick={async () => {
                      if (collectedMissions.length === 0) {
                        setPopupActive(false);
                        setTimeout(() => {
                          setPopupVisible(false);
                          setExitStep("confirmExit");
                        }, 300);
                      } else {
                        // 완료된 미션이 하나라도 있으면 → 리포트 생성 로직 실행
                        const completedImages = await getCompletedImages();
                        console.log(completedImages);
                        try {
                          await endMission(marketId);
                          // 안전하게 팝업 닫기
                          setPopupActive(false);
                          setTimeout(() => setPopupVisible(false), 300);
                          navigate("/reportentry");
                        } catch (err) {
                          setCannotExitVisible(true);
                        }
                      }
                    }}
                  >
                    그만하기
                  </button>

                  <button
                    onClick={closePopup}
                    className="flex-1 py-3 rounded-full bg-[#9A8C4F] text-white"
                  >
                    탐험 계속하기
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* 확인 다이얼로그 */}
        {exitStep === "confirmExit" && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 transition-opacity duration-300"
            onClick={() => setExitStep("none")}
          >
            <div
              className="bg-white rounded-2xl p-6 w-[320px] text-center animate-fadeInUp"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-xl font-bold mb-4">
                정말 탐험을 그만하시겠습니까?
              </div>
              <div className="mb-4">
                종료하면 지금까지 진행했던 내용이 저장되지 않고 사라지게 돼요.
              </div>
              <div className="flex gap-3">
                <button
                  className="flex-1 py-2 rounded-full bg-gray-200 text-gray-800"
                  onClick={() => setIsMissionActive(false)}
                >
                  나가기
                </button>
                <button
                  className="flex-1 py-2 rounded-full bg-[#9A8C4F] text-white"
                  onClick={() => setExitStep("none")}
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 탐험 종료 불가 팝업 */}
        {(exitStep === "cannotExit" || cannotExitVisible) && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70">
            <div className="bg-white rounded-2xl p-6 w-[320px] text-center">
              <div className="text-xl font-bold mb-4">
                정말 탐험을 그만하시겠습니까?
              </div>
              <div className="mb-4">
                종료하면 지금까지 진행했던 내용이 저장되지 않고 사라지게 돼요.
              </div>
              <div className="flex gap-3">
                <button
                  className="flex-1 py-2 rounded-full bg-gray-200 text-gray-800"
                  onClick={() => setIsMissionActive(false)}
                >
                  나가기
                </button>
                <button
                  className="flex-1 py-2 rounded-full bg-[#9A8C4F] text-white"
                  onClick={() => {
                    setExitStep("none");
                    setCannotExitVisible(false);
                  }}
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
