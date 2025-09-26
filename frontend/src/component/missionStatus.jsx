export default function MissionStatus({ icon, label, value, onClick, bgColor = "bg-gray-100" }) {
  return (
    <div
      role="button"
      onClick={onClick}
      style={{ backgroundColor: bgColor }}
      className="h-[32px] flex items-center w-full p-2 rounded-md hover:bg-gray-200 justify-between"
    >
      <img src={icon} alt={label} className="w-[22px] h-[22px] object-contain" />

      <div className="flex flex-col items-start">
        <span className="text-[12px] text-white ml-2.5 mr-1">{label} ({value})</span>
      </div>
    </div>
  );
}
