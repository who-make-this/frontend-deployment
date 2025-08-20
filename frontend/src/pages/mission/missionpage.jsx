import React, { useState, useEffect } from "react";
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
import { useNavigate } from "react-router-dom";

export default function MissionPage() {
  const navigate = useNavigate();

  const [popupVisible, setPopupVisible] = useState(false);
  const [popupActive, setPopupActive] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [randomMission, setRandomMission] = useState(null);
  const [cannotExitVisible, setCannotExitVisible] = useState(false);

  const [refreshClicked, setRefreshClicked] = useState(false);
  const [refreshHovered, setRefreshHovered] = useState(false);

  const missionTypes = [
    { type: "감성형", count: 12, icon: typeMood, bgColor: "#A792B960" },
    { type: "먹보형", count: 8, icon: typeEat, bgColor: "#D19B9860" },
    { type: "탐험형", count: 5, icon: typeTravel, bgColor: "#889F6960" },
  ];

  const currentMissions = [
    {
      type: "감성형",
      number: 5,
      title: "하늘 사진 찍기",
      description: "구름 포함",
    },
    {
      type: "먹보형",
      number: 1,
      title: "라면 먹기",
      description: "편의점에서",
    },
  ];

  const collectedMissions = [
    {
      type: "감성형",
      title: "벚꽃 사진",
      number: "2",
      description: "봄에 찍은 사진",
    },
    {
      type: "감성형",
      title: "노을 사진",
      number: "2",
      description: "해질 무렵",
    },
    {
      type: "먹보형",
      title: "햄버거 먹기",
      number: "2",
      description: "세트 메뉴",
    },
  ];

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

  const closeCannotExit = () => {
    setCannotExitVisible(false);
  };

  const missionTypesWithCount = missionTypes.map((m) => ({
    ...m,
    count: collectedMissions.filter((cm) => cm.type === m.type).length,
  }));

  const handleRefreshClick = () => {
    setRefreshClicked(true);
    const randomIndex = Math.floor(Math.random() * currentMissions.length);
    setRandomMission(currentMissions[randomIndex]);
    setTimeout(() => setRefreshClicked(false), 1000);
  };

  useEffect(() => {
    document.body.style.overflow = popupVisible || cannotExitVisible ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [popupVisible, cannotExitVisible]);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * currentMissions.length);
    setRandomMission(currentMissions[randomIndex]);
  }, []);

  const selectedTypeColor = selectedType
    ? missionTypes.find(type => type.type === selectedType)?.bgColor.slice(0, 7)
    : null;
    
  const gradientColor = selectedTypeColor ? `${selectedTypeColor}60` : "#2B2B2B80";

  // 선택된 타입에 해당하는 완료된 미션 목록
  const completedMissionsOfType = selectedType
    ? collectedMissions.filter(m => m.type === selectedType)
    : [];

  return (
    <div className="w-[375px] h-[812px] flex min-h-screen bg-gray-100">
      <div className="fixed top-0 left-0 w-full z-50">
        <Logo />
      </div>
      <div className="bg-white shadow-sm relative flex items-center justify-center overflow-hidden ">
        <img
          src={MainPageImg}
          alt="Main Page"
          className="w-full h-full object-cover"
        />

        {/* 배경 오버레이 */}
        <div
          className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 backdrop-blur-[10px]"
          style={{ backgroundColor: "#2B2B2BB2"}}
        />
        
        {/* 새로운 그라데이션 블러 오버레이 */}
        <div
          className="absolute top-0 left-0 w-full h-full pointer-events-none z-10"
          style={{
            background: `linear-gradient(to top right, transparent, 60%, ${gradientColor})`,
          }}
        />

        {/* 타입 버튼 영역 */}
        <div className="absolute left-4 top-16 flex flex-row w-[330px] z-20 items-center">
          <MissionTypeButtons
            missionTypesWithCount={missionTypesWithCount}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
          />
        </div>

        {/* 카드 영역 위에 새로고침 버튼 추가 */}
        <div className="absolute top-[140px] right-8 z-30">
          {!selectedType ? (
            <button
              onClick={handleRefreshClick}
              onMouseEnter={() => setRefreshHovered(true)}
              onMouseLeave={() => setRefreshHovered(false)}
              className={`w-10 h-10 flex items-center backdrop-blur-[4px] justify-center rounded-full transition
                ${refreshHovered ? "bg-white/50" : "bg-white/20 hover:bg-white/50"}`}
              aria-label="미션 새로고침"
            >
              <img
                src={refreshHovered || refreshClicked ? refresh_black : refresh}
                alt="새로고침 아이콘"
                className="w-6 h-6"
                draggable={false}
              />
            </button>
          ) : null}
        </div>

        {/* 기존 카드 영역 */}
        <div
          className={`absolute flex flex-col items-center z-20 gap-4 px-4 overflow-auto max-h-[464px] max-w-[309px] ${
            selectedType ? "top-[120px]" : "top-[160px]"
          }`}
        >
          {selectedType ? (
            completedMissionsOfType.length > 0 ? (
              <CompleteMission missions={completedMissionsOfType} />
            ) : (
              <div className="text-white  text-center text-lg mt-50">
                아직 성공한 미션이 없어요...
              </div>
            )
          ) : (
            randomMission && <MissionCard {...randomMission} />
          )}
        </div>

        {/* 하단 버튼 */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-[349px] px-4 flex justify-between z-50">
          <button
            onClick={openPopup}
            className="w-[145px] h-[53px] flex items-center gap-2 px-4 py-2 border border-white rounded-xl text-white duration-250 ease-in-out active:bg-[#ffffffb9]"
          >
            <img
              src={exit}
              className="w-[24px] h-[24px] object-contain"
              alt="탐험 종료"
            />
            <div className="ps-2">탐험 종료</div>
          </button>
          <button className="w-[145px] h-[53px] flex items-center gap-2 px-4 py-2 border border-black rounded-xl text-black bg-white duration-250 ease-in-out active:bg-[#A47764] active:text-white active:font-bold">
            <img
              src={vectorCamera}
              className="w-[24px] h-[24px] object-contain"
              alt="미션 인증"
            />
            <div className="ps-2">미션 인증</div>
          </button>
        </div>

        {/* 탐험 종료 팝업 */}
        {popupVisible && (
          <>
            <div
              className={`absolute inset-0 z-40 transition-opacity duration-300 ${
                popupActive ? "opacity-100" : "opacity-0"
              }`}
              style={{ backgroundColor: "rgba(0,0,0,0.8)" }}
              onClick={closePopup}
            />
            <div
              role="dialog"
              aria-modal="true"
              className={`absolute bottom-0 left-0 w-full z-50 transform transition-transform duration-300 ease-out ${
                popupActive ? "translate-y-0" : "translate-y-full"
              }`}
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
                    onClick={closePopup}
                  >
                    그만하기
                  </button>
                  <button
                    className="flex-1 py-3 rounded-full bg-[#9A8C4F] text-white"
                    onClick={closePopup}
                  >
                    탐험 계속하기
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* 탐험 종료 불가 팝업 */}
        {cannotExitVisible && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70">
            <div className="w-[349px] h-[236px] bg-white rounded-2xl p-8">
              <div className="text-2xl font-medium p-1">탐험 종료 불가</div>
              <div className="p-1 mb-6">
                아직 미션이 하나도 완료되지 않았어요! 미션 1개 이상 수행 후
                종료할 수 있어요.
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => navigate("/")}
                  className="flex-1 py-3 rounded-full bg-gray-200 text-gray-800"
                >
                  나가기
                </button>
                <button
                  onClick={closeCannotExit}
                  className="flex-1 py-3 rounded-full bg-[#9A8C4F] text-white"
                >
                  탐험 계속하기
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
