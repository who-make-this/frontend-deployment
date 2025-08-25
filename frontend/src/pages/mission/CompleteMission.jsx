import React, { useState } from "react";
import MissionCard from "../../component/missionCard";
import filp_white from "../../assets/flip_white.svg";
import flip_black from "../../assets/flip_black.svg";

export default function CompleteMission({ missions }) {
  const [selectedMission, setSelectedMission] = useState(null);
  const [flipped, setFlipped] = useState(false);

  const handleClick = (mission) => {
    setSelectedMission(mission);
    setFlipped(false);
  };

  const closeOverlay = () => {
    setSelectedMission(null);
  };

  return (
    <div className="grid grid-cols-2 gap-4 px-2 no-scrollbar">
      {missions.map((mission, index) => (
        <button
          key={index}
          className="w-full text-left"
          onClick={() => handleClick(mission)}
        >
          <MissionCard {...mission} />
        </button>
      ))}

      {/* 카드 뒤집기 */}
      {selectedMission && (
        <div
          className="fixed inset-0 bg-black/70 flex flex-col items-center justify-center z-100 no-scrollbar"
          onClick={closeOverlay} // 뒷배경 클릭 닫기
        >
          <div
            className="rounded-2xl p-4 top-12 w-[90%] h-[70%] flex flex-col items-center justify-center shadow-xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 앞/뒷면 토글 */}
            <div className="h-[464px] w-[309px] flex-1 flex items-center justify-center">
              {flipped ? (
                selectedMission.imageUrl ? (
                  <img
                    src={selectedMission.imageUrl}
                    alt="미션 인증 이미지"
                    className="h-[464px] w-[309px] rounded-xl object-cover"
                  />
                ) : (
                  <div className="p-4 text-lg font-semibold text-white">
                    인증 이미지가 없습니다
                  </div>
                )
              ) : (
                <MissionCard {...selectedMission} />
              )}
            </div>

            {/* 카드 뒤집기 버튼 */}
            <button
              onClick={() => setFlipped(!flipped)}
              className={`w-full h-[53px] flex items-center gap-2 m-8 p-4 justify-center border border-white rounded-xl duration-250 ease-in-out active:bg-[#ffffffb9]"
              ${flipped ? "bg-white text-black" : "text-white"}`}
            >
              {flipped ? (
                <img
                  src={flip_black}
                  className="w-[24px] h-[24px] object-contain"
                  alt="카드 뒤집기"
                />
              ) : (
                <img
                  src={filp_white}
                  className="w-[24px] h-[24px] object-contain"
                  alt="카드 뒤집기"
                />
              )}
              카드 뒤집기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
