export default function MissionStatus({ icon, label, value, onClick, bgColor = "bg-gray-100" }) {
  return (
    <div
      role="button"
      onClick={onClick}
      style={{ backgroundColor: bgColor }}
      className="h-[32px] flex items-center w-full p-1.5 rounded-lg hover:bg-gray-200 justify-between"
    >
      <img src={icon} alt={label} className="w-[28px] h-[28px] object-contain" />

      <div className="flex flex-col items-start">
        <span className="text-[14px] text-white">{label} ({value})</span>
      </div>
    </div>
  );
}
