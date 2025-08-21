import React from 'react';
import ReportCardFrame from '../assets/reportpage.svg';
import HeadphoneIcon from '../assets/gumilogo.svg';
import StampSuccess from '../assets/successStamp.svg';
import ReportGrid from '../assets/reportGrid.svg';
import ClocheIcon from '../assets/typeeat.svg';
import TravelIcon from '../assets/typetravel.svg';
import MoodIcon from '../assets/typemood.svg';

export default function ReportCard({ reportData }) {
    if (!reportData) return null;

    const typeIcons = {
        '먹보형': ClocheIcon,
        '모험형': TravelIcon,
        '감성형': MoodIcon,
    };

    const MainTypeIcon = typeIcons[reportData.mainType] || ClocheIcon;

    return (
        <div className="w-[349px] h-[542px] relative">
            <img src={ReportCardFrame} alt="리포트 배경" className="absolute inset-0 w-full h-full z-10" />
            <img src={ReportGrid} alt="리포트 그리드" className="absolute inset-0 w-full h-full z-20" />

            <div className="relative z-30 p-8 flex flex-col h-full "style={{ fontFamily: '"Noto Serif KR", serif' }}>
                <header className="flex justify-between items-start mt-1">
                    <h1 className="text-2xl font-bold text-gray-800">{reportData.marketName} <br/> 탐험</h1>
                    <img src={HeadphoneIcon} alt="아이콘" className="w-[60px] h-[60px]" />
                </header>

                <section className="flex h-[170px]">
                    <div className="flex flex-col items-center text-center w-[100px] h-[112px] pt-8 pr-1">
                        <img src={MainTypeIcon} alt="대표 유형" className="w-[87px] h-[87px]" />
                        <span className="-mt-2 text-sm font-[500] text-white  bg-black/30 w-[63px] h-[21px] rounded-2xl">{reportData.mainType}</span>
                    </div>
                    
                    <div className="relative flex-grow ">
                        <div className="absolute top-[22px] left-[20px]">
                            <p className="text-[16px] text-white">탐험 일시</p>
                        </div>
                        <div className="absolute top-[70px] font-[500] underline decoration-1 left-[20px] space-y-1">
                            <p className="text-[16px] text-[#2B2B2B] ">{reportData.date}</p>
                            <p className="text-[16px] mt-2 text-[#2B2B2B]">{reportData.timeRange}</p>
                        </div>
                    </div>
                </section>
                
                <section className="flex text-center -mt-[22px] w-[300px]">
                    <div className="w-[85px]">
                        <p className="text-sm text-white">감성형</p>
                        <p className="text-[23px] font-[500] text-black mt-1">{reportData.scores.sensitivity}</p>
                    </div>
                    <div className="w-[85px] ml-[15px]">
                        <p className="text-sm text-white">먹보형</p>
                        <p className="text-[23px] font-[500] text-black mt-1">{reportData.scores.foodie}</p>
                    </div>
                    <div className="w-[85px] ml-[15px]">
                        <p className="text-sm text-white">모험형</p>
                        <p className="text-[23px] font-[500] text-black mt-1">{reportData.scores.adventure}</p>
                    </div>
                </section>

                <footer className="mt-2 relative">
                    <p className="text-sm font-light text-gray-600 mb-2">결과</p>
                    <div className="space-y-3 text-black text-sm">
                        <div className="flex justify-between items-center border-b border-dashed font-semibold border-gray-400 pb-1"><span>점수 합계</span><span className="font-semibold">{reportData.results.totalScore}점</span></div>
                        <div className="flex justify-between items-center border-b border-dashed font-semibold border-gray-400 pb-1"><span>획득 마일리지</span><span className="font-semibold">{reportData.results.mileage}</span></div>
                        <div className="flex justify-between items-center font-semibold"><span>이번 달 까지</span><span className="font-semibold">{reportData.results.thisMonthTotal}</span></div>
                    </div>
                    {reportData.status === "성공" && (<img src={StampSuccess} alt="탐험 성공" className="absolute -bottom-[94px] -right-4 w-28 h-28" />)}
                </footer>
            </div>
        </div>
    );
}
