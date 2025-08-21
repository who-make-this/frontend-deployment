import { useNavigate } from "react-router-dom";

export default function Moheom() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/mission");
  };
  return (
    <div className="relative w-[349px] h-[655px] mx-auto">
      <div className="absolute left-1/2 top-[356px] -translate-x-1/2 -translate-y-1/2 z-20 w-[349px] h-[72px] flex items-center justify-center">
        <span className="font-pretendard font-semibold text-white text-[30px] text-center leading-[140%] tracking-[-0.75px] w-full">
          새로운 탐험을 시작할 <br /> 준비됐나요?
        </span>
      </div>
      <div className="absolute left-1/2 top-[408px] -translate-x-1/2 z-20 w-[349px] h-[52px] flex items-center justify-center">
        <span className="text-white text-[15px] font-normal w-full text-center leading-[160%] tracking-[-0.5px]">
          점심 한 끼도, 늘 보던 골목길도 여기선 도전이 돼요. <br /> 익숙함에
          새로운 시선을 더하는 여정을 함께 하고 싶어요!
        </span>
      </div>
      <div className="absolute left-1/2 top-[485px] -translate-x-1/2 z-20 w-[125px] h-[53px] flex items-center justify-center">
        <button
          onClick={handleClick}
          className="bg-white rounded-[24px] text-black text-[18px] font-medium text-center w-full leading-[140%] tracking-[-1px] py-3 transition-all duration-250 ease-in-out active:scale-x-[1.088] active:scale-y-[1.132] active:bg-[#A47764] active:text-white"
        >
          탐험 시작
        </button>
      </div>
    </div>
  );
}
