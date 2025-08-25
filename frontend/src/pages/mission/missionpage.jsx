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

export default function MissionPage() {
  const marketId = 1;
  const navigate = useNavigate();

  const [selectedType, setSelectedType] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupActive, setPopupActive] = useState(false);
  const [cannotExitVisible, setCannotExitVisible] = useState(false);

  const [randomMission, setRandomMission] = useState(null);
  const [collectedMissions, setCollectedMissions] = useState([]);
  const [authResult, setAuthResult] = useState(null);
  const [authInProgress, setAuthInProgress] = useState(false);
  const hasFetched = useRef(false);

  const [refreshClicked, setRefreshClicked] = useState(false);
  const [refreshHovered, setRefreshHovered] = useState(false);

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

  // 초기 랜덤 미션 불러오기
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    (async () => {
      try {
        await createMission(marketId);
        await new Promise((resolve) => setTimeout(resolve, 300));
        const mission = await getRandomMission(marketId);
        setRandomMission(mission);
      } catch (err) {
        console.error("초기 미션 생성 또는 불러오기 실패:", err);
        setRandomMission({
          category: "감성형",
          missionNumbers: "1",
          title: "테스트 미션",
          description: "테스트 미션 설명입니다",
        });
      }
    })();
  }, []);

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

  const openPopup = () => {
    setPopupVisible(true);
    setTimeout(() => setPopupActive(true), 20);
  };

  const closePopup = () => {
    setPopupActive(false);
    setTimeout(() => setPopupVisible(false), 300);
    if (collectedMissions.length === 0) {
      setCannotExitVisible(true);
    }
  };

  const closeCannotExit = () => setCannotExitVisible(false);

  const handleRefreshClick = async () => {
    setRefreshClicked(true);
    try {
      const mission = await getRandomMission(marketId);
      setRandomMission(mission);
    } catch (err) {
      console.error("랜덤 미션 불러오기 실패:", err);
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
        const updatedMission = await authenticateMission(randomMission.id, file);

        setRandomMission(updatedMission);

        const completed = await getCompletedMissions(updatedMission.category);
        setCollectedMissions((prev) => {
          const filtered = prev.filter((m) => m.category !== updatedMission.category);
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
        console.error("미션 인증 요청 실패:", err.response?.data || err.message);
        const failureReason = err.response?.data?.failureReason || "인증 요청 중 오류가 발생했습니다.";
        setAuthResult({ type: "error", message: failureReason });
      } finally {
        setAuthInProgress(false);
      }
    };
  };

  useEffect(() => {
    document.body.style.overflow = popupVisible || cannotExitVisible ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [popupVisible, cannotExitVisible]);

  const selectedTypeColor = selectedType
    ? missionTypes.find((category) => category.category === selectedType)?.bgColor.slice(0, 7)
    : null;

  const gradientColor = selectedTypeColor ? `${selectedTypeColor}60` : "#2B2B2B80";

  const completedMissionsOfType = selectedType
    ? collectedMissions.filter((m) => m.category === selectedType)
    : [];

  return (
    <div className="w-[375px] h-[812px] flex min-h-screen bg-gray-100">
      <div className="fixed top-0 left-0 w-full z-50"><Logo /></div>

      <div className="bg-white shadow-sm relative flex items-center justify-center overflow-hidden ">
        <img src={MainPageImg} alt="Main Page" className="w-full h-full object-cover" />

        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 backdrop-blur-[10px]"
             style={{ backgroundColor: "#2B2B2BB2" }} />

        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10"
             style={{ background: `linear-gradient(to top right, transparent, 60%, ${gradientColor})` }} />

        <div className="absolute left-4 top-16 flex flex-row w-[330px] z-20 items-center">
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
                ${refreshHovered ? "bg-white/50" : "bg-white/20 hover:bg-white/50"}`}
              aria-label="미션 새로고침"
            >
              <img src={refreshHovered || refreshClicked ? refresh_black : refresh} alt="새로고침 아이콘" className="w-6 h-6" draggable={false} />
            </button>
          )}
        </div>

        <div className={`absolute flex flex-col items-center z-20 gap-4 px-4 overflow-auto h-[464px] max-w-[312px] hide-scrollbar ${selectedType ? "top-[120px] h-full" : "top-[160px] h-[464px]"}`}>
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
          <div className="absolute bottom-32 left-1/2 -translate-x-1/2 w-78 px-4 flex justify-between z-50">
            <button
              onClick={openPopup}
              className="w-33 h-[50px] flex items-center px-4 border border-white rounded-xl text-white duration-250 ease-in-out active:bg-[#ffffffb9]"
            >
              <img src={exit} className="w-[24px] h-[24px] object-contain" alt="탐험 종료" />
              <div className="ps-2 font-medium">탐험 종료</div>
            </button>

            <button
              onClick={handleAuthenticateClick}
              className="w-33 h-[50px] flex items-center px-4 border border-black rounded-xl text-black bg-white duration-250 ease-in-out active:bg-[#A47764] active:text-white active:font-bold"
            >
              <img src={vectorCamera} className="w-[24px] h-[24px] object-contain" alt="미션 인증" />
              <div className="ps-2 font-medium">미션 인증</div>
            </button>
          </div>
        )}

        {authInProgress && (
          <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/70">
            <img src={loading} alt="인증 중 로딩" className="w-16 h-16 animate-spin mb-4" />
            <div className="text-white text-xl font-semibold">이미지 검토 중...</div>
          </div>
        )}

        {authResult && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70">
            <div className="w-[349px] h-auto bg-white rounded-3xl p-8 flex flex-col justify-between">
              <div>
                <div className="text-2xl font-medium">{authResult.type === "success" ? "미션 성공!" : "미션 실패..."}</div>
                <div className="mt-3 mb-6">{authResult.type === "success" ? "미션을 성공적으로 완료했어요! 계속 탐험하며 다음 미션에 도전해보세요." : authResult.message}</div>
              </div>

              <div className="flex gap-3">
                {authResult.type === "error" && (
                  <button onClick={() => setAuthResult(null)} className="flex-1 py-3 rounded-full bg-gray-200 text-gray-800">취소</button>
                )}

                <button
                  className={`py-3 rounded-full bg-[#9A8C4F] text-white ${authResult.type === "success" ? "w-[50%] ml-auto" : "flex-1"}`}
                  onClick={async () => {
                    if (authResult.type === "success") {
                      const mission = await getRandomMission(marketId);
                      setRandomMission(mission);
                    } else if (authResult.type === "error") {
                      handleAuthenticateClick();
                    }
                    setAuthResult(null);
                  }}
                >
                  {authResult.type === "success" ? "다음 미션으로" : "다시 인증하기"}
                </button>
              </div>
            </div>
          </div>
        )}

        {popupVisible && (
          <>
            <div className={`absolute inset-0 z-40 transition-opacity duration-300 ${popupActive ? "opacity-100" : "opacity-0"}`} style={{ backgroundColor: "rgba(0,0,0,0.8)" }} onClick={closePopup} />
            <div role="dialog" aria-modal="true" className={`absolute bottom-0 left-0 w-full z-50 transform transition-transform duration-300 ease-out ${popupActive ? "translate-y-0" : "translate-y-full"}`}>
              <div className="bg-white rounded-t-2xl p-8 pb-16">
                <div className="text-2xl font-medium p-1">탐험 종료</div>
                <div className="p-1 mb-6">
                  하루에 한 번만 탐험이 가능합니다. 지금 탐험을 종료하면, 오늘은 더 이상 진행할 수 없어요.
                  <div className="text-[#9A8C4F]">( 해커톤 행사 기간엔 해당 없음 )</div>
                </div>
                <div className="flex gap-3">
                  <button
                    className="flex-1 py-3 rounded-full bg-gray-200 text-gray-800"
                    onClick={async () => {
                      const completedImages = await getCompletedImages();
                      console.log(completedImages);
                      try {
                        await endMission(marketId);
                        closePopup();
                        navigate("/reportentry");
                      } catch (err) {
                        setCannotExitVisible(true);
                      }
                    }}
                  >
                    그만하기
                  </button>
                  <button onClick={closePopup} className="flex-1 py-3 rounded-full bg-[#9A8C4F] text-white">탐험 계속하기</button>
                </div>
              </div>
            </div>
          </>
        )}

        {cannotExitVisible && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-3xl p-8 flex flex-col items-center">
              <div className="text-2xl font-medium p-1">탐험 종료 실패</div>
              <div className="p-1 mb-6">탐험을 종료할 수 없어요. 최소 한 개 이상의 미션을 완료해야 합니다.</div>
              <button className="py-3 px-8 rounded-full bg-[#9A8C4F] text-white" onClick={closeCannotExit}>확인</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
