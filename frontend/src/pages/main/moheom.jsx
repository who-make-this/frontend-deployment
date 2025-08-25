import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from 'js-cookie';

const BACK_URL = import.meta.env.VITE_BACKEND_URL;

export const checkMyReports = async () => {
  try {
    const token = Cookies.get("token");
    if (!token) throw new Error("로그인이 필요합니다.");

    const response = await axios.get(`${BACK_URL}/reports/my-reports`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("리포트 불러오기 실패:", error);
    throw error;
  }
};

export default function Moheom({ setIsMissionActive }) {
  const [isMissionLocked, setIsMissionLocked] = useState(false);
  const [reports, setReports] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
  const checkMissionStatus = async () => {
    try {
      const data = await checkMyReports();
      setReports(data);

      if (data.length > 0) {
        // 가장 최근 리포트 (내림차순 정렬 가정)
        const latestReport = data[0];
        const endTime = new Date(latestReport.endTime);
        const today = new Date();

        // endTime과 today를 날짜만 비교
        const isSameDay =
          endTime.getFullYear() === today.getFullYear() &&
          endTime.getMonth() === today.getMonth() &&
          endTime.getDate() === today.getDate();

        if (isSameDay) {
          setIsMissionLocked(true);
        }
      }
    } catch (error) {
      console.error("Failed to load reports:", error);
    }
  };

  checkMissionStatus();
}, []);

  const startMission = () => {
    // if (isMissionLocked) {
    //   alert("오늘은 이미 탐험을 완료했어요. 내일 다시 와주세요.");
    // } else {
      setIsMissionActive(true);
      navigate("/mission");
    // }
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
          onClick={startMission}
          className="bg-white rounded-[24px] text-black text-[18px] font-medium text-center w-full leading-[140%] tracking-[-1px] py-3 transition-all duration-250 ease-in-out active:scale-x-[1.088] active:scale-y-[1.132] active:bg-[#A47764] active:text-white"
        >
          탐험 시작
        </button>
      </div>
    </div>
  );
}
