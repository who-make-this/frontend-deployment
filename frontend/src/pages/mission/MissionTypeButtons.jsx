import MissionStatus from "../../component/missionStatus";

export default function missionTypeButtons({
  missionTypesWithCount,
  selectedType,
  setSelectedType,
}) {
  // 버튼별 이동 거리(px) — index 기준
  const translateXValues = [220, 110, 0];

  return (
    <div className="relative flex items-center w-full">
      {/* 뒤로가기 버튼 */}
      <button
        onClick={() => setSelectedType(null)}
        className={`text-white text-xl transition-opacity duration-300 ${
          selectedType
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        aria-label="뒤로가기"
      >
        &lt;
      </button>

      {/* 타입 버튼 그룹 */}
      <div
        className="flex justify-between items-center"
        style={{ position: "relative", width: "100%" }}
      >
        {missionTypesWithCount.map((m, index) => {
          const isSelected = selectedType === m.type;

          return (
            <button
              key={index}
              onClick={() => !selectedType && setSelectedType(m.type)}
              className="whitespace-nowrap transition-transform duration-500 ease-in-out transition-opacity duration-300"
              style={{
                transform: isSelected
                  ? `translateX(${translateXValues[index]}px)`
                  : "translateX(0)",
                opacity: !selectedType || isSelected ? 1 : 0, // 선택 전엔 모두 보이게, 선택 후엔 선택된 버튼만 보임
                pointerEvents: !selectedType || isSelected ? "auto" : "none", // 선택 전엔 모두 클릭 가능, 선택 후엔 선택된 버튼만 가능
                position: "relative",
                zIndex: isSelected ? 20 : 0,
              }}
            >
              <MissionStatus
                icon={m.icon}
                label={m.type}
                value={m.count}
                bgColor={m.bgColor}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
