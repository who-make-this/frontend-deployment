import React, { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

import ReportbgImg from "../../assets/reportbgimg.svg?react";
import Logo from "../../component/Logo";
import ReportContainer from '../../component/ReportContainer';
import { reportsData as mockReportsData } from "../../data/reports";

import rightArrowIcon from '../../assets/circle_arrow_right.svg';
import leftArrowIcon from '../../assets/circle_arrow_left.svg';

export default function ReportPage() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const swiperRef = useRef(null);

    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                await new Promise(resolve => setTimeout(resolve, 1000));
                setReports(mockReportsData);

                if (!mockReportsData || mockReportsData.length <= 1) {
                    setIsEnd(true);
                }
            } catch (error) {
                console.error("Failed to fetch reports:", error);
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

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">로딩 중...</div>;
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-[375px] h-[812px] bg-white shadow-sm relative overflow-hidden">
                <ReportbgImg 
                    className="absolute top-0 left-0 w-full h-full"
                    preserveAspectRatio="none"
                />
                <div
                    className="absolute top-0 left-0 w-full h-full pointer-events-none z-10"
                    style={{ backgroundColor: "#2B2B2B4D" }}
                />
                <Logo textColor="text-white" iconColor="white" />
                
                <div className="absolute top-[449px] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[650px] z-10">
                    
                    {reports.length > 0 ? (
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
                                            <ReportContainer report={report} />
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>

                            {!isBeginning && (
                                <button
                                    onClick={() => swiperRef.current?.slidePrev()}
                                    className="absolute top-1/2 left-4 -translate-y-[120%] z-20 transition-opacity"
                                    aria-label="이전 슬라이드"
                                >
                                    <img src={leftArrowIcon} alt="이전" className="w-10 h-10" />
                                </button>
                            )}
                            {!isEnd && (
                                <button
                                    onClick={() => swiperRef.current?.slideNext()}
                                    className="absolute top-1/2 right-4 -translate-y-[120%] z-20 transition-opacity"
                                    aria-label="다음 슬라이드"
                                >
                                    <img src={rightArrowIcon} alt="다음" className="w-10 h-10" />
                                </button>
                            )}
                        </>
                    ) : (
                        <div className="flex justify-center items-center -mt-5 h-full">
                            <p className="text-white text-lg font-[400]">
                                아직 기록된 일지가 없어요...
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
