import React, { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import axios from 'axios';
import Cookies from 'js-cookie';

import ReportbgImg from "../../assets/reportbgimg.svg?react";
import Logo from "../../component/Logo";
import ReportContainer from '../../component/ReportContainer';
import loading from "../../assets/loading.svg";

import rightArrowIcon from '../../assets/circle_arrow_right.svg';
import leftArrowIcon from '../../assets/circle_arrow_left.svg';

const LoadingSpinner = () => (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/70">
        <img
            src={loading}
            alt="인증 중 로딩"
            className="w-16 h-16 animate-spin mb-4"
        />
        <div className="text-white text-xl font-normal">
            탐험 일지 불러 오는 중...
        </div>
    </div>
);

const formatDate = (isoString) => new Date(isoString).toLocaleDateString('ko-KR').replace(/\./g, '/').slice(0, -1);
const formatTime = (isoString) => new Date(isoString).toTimeString().slice(0, 5);

const formatDiaryDate = (isoString) => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    const period = hours < 12 ? '오전' : '오후';
    const formattedHours = String(hours).padStart(2, '0');

    return `${year}.${month}.${day} ${period} ${formattedHours}:${minutes}`;
};

export default function ReportPage() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const swiperRef = useRef(null);
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);
    
    // --- 1. 뷰 상태를 부모 컴포넌트에서 관리합니다 ---
    const [activeView, setActiveView] = useState('report');

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const token = Cookies.get('token');
                if (!token) throw new Error("No token found");
                const baseUrl = import.meta.env.VITE_BACKEND_URL || "";
                const response = await axios.get(`${baseUrl}/reports/my-reports`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                const transformedData = response.data.map(report => ({
                    id: report.id,
                    marketName: report.reportTitle.replace(' 탐험', ''),
                    date: formatDate(report.explorationDate),
                    timeRange: `${formatTime(report.startTime)} - ${formatTime(report.endTime)}`,
                    mainType: report.userType,
                    scores: {
                        sensitivity: report.completedMissionsByCategories["감성형"] || 0,
                        foodie: report.completedMissionsByCategories["먹보형"] || 0,
                        adventure: report.completedMissionsByCategories["모험형"] || 0,
                    },
                    results: {
                        totalScore: report.totalScore,
                        mileage: `${report.earnedMileage}M`,
                        thisMonthTotal: `${report.remainingMonthlyMileage}M`,
                    },
                    status: "성공",
                    diary: {
                        explorationDate: formatDiaryDate(report.explorationDate),
                        journalContent: report.journalContent,
                        imageUrl: report.mainImageUrl || ""
                    }
                }));

                setReports(transformedData);
                if (transformedData.length <= 1) {
                    setIsEnd(true);
                }
            } catch (error) {
                console.error("Failed to fetch reports:", error);
                setReports([]);
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, []);

    const handleSlideChange = (swiper) => {
        setIsBeginning(swiper.isBeginning);
        setIsEnd(swiper.isEnd);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-[375px] h-[812px] bg-white shadow-sm relative overflow-hidden">
                {loading && <LoadingSpinner />}
                <ReportbgImg className="absolute top-0 left-0 w-full h-full" preserveAspectRatio="none" />
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10" style={{ backgroundColor: "#2B2B2B4D" }} />
                <Logo textColor="text-white" iconColor="white" />
                
                <div className="absolute top-[449px] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[650px] z-10">
                    {!loading && reports.length > 0 ? (
                        <>
                            <Swiper
                                onSwiper={(swiper) => { swiperRef.current = swiper; }}
                                onSlideChange={handleSlideChange}
                                spaceBetween={50}
                                slidesPerView={1}
                            >
                                {reports.map((report) => (
                                    <SwiperSlide key={report.id}>
                                        <div className="flex justify-center">
                                            {/* --- 2. 뷰 상태와 상태 변경 함수를 props로 전달합니다 --- */}
                                            <ReportContainer 
                                                report={report} 
                                                activeView={activeView}
                                                setActiveView={setActiveView}
                                            />
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                            {!isBeginning && (
                                <button onClick={() => swiperRef.current?.slidePrev()} className="absolute top-74 left-4 -translate-y-[120%] z-20 transition-opacity" aria-label="이전 슬라이드">
                                    <img src={leftArrowIcon} alt="이전" className="w-10 h-10" />
                                </button>
                            )}
                            {!isEnd && (
                                <button onClick={() => swiperRef.current?.slideNext()} className="absolute top-74 right-4 -translate-y-[120%] z-20 transition-opacity" aria-label="다음 슬라이드">
                                    <img src={rightArrowIcon} alt="다음" className="w-10 h-10" />
                                </button>
                            )}
                        </>
                    ) : (
                        !loading && (
                            <div className="flex justify-center items-center h-full">
                                <p className="text-white text-[20px] font-[500]">
                                    아직 기록된 일지가 없어요...
                                </p>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}
