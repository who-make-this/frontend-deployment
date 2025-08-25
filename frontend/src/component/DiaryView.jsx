import React from 'react';
import ReportCardFrame from '../assets/reportpage.svg';

export default function DiaryView({ diaryData }) {
    const tempImageUrl = "https://imagedelivery.net/5WSEhEr2fwGFdaEwZpmZ7g/a6f81405-86fa-4fad-6b7e-6adc2603c600/public";

    if (!diaryData || !diaryData.journalContent) {
        return (
            <div className="w-[349px] h-[542px] relative">
                <img src={ReportCardFrame} alt="리포트 배경" className="absolute inset-0 w-full h-full z-10" />
                <div className="relative z-30 p-6 flex justify-center items-center h-full">
                    <p className="text-center bg-white/50 p-4 rounded-md">작성된 일기가 없습니다.</p>
                </div>
            </div>
        );
    }

    const contentLines = diaryData.journalContent.split('\n');
    const title = contentLines.length > 0 ? contentLines.shift().replace('제목: ', '') : '';
    const content = contentLines.join('\n').replace('내용:', '').trim();


    return (
        <div className="w-[309px] h-[464px] relative">
            <img src={ReportCardFrame} alt="리포트 배경" className="absolute inset-0 w-full h-full z-10" />
            <div className="relative z-30 flex flex-col h-full ml-[10px] mt-2">
                <h2 className="text-[18px] font-[600] text-[#2B2B2B] mt-5 tracking-[-0.025em] ml-2" style={{ fontFamily: '"Noto Serif KR", serif' }} >{title}</h2>
                <p className=" text-[12px] font-extralight leading-[140%] tracking-[-0.025em] text-[#2B2B2BCC] ml-2 mt-1" style={{ fontFamily: '"Noto Serif KR", serif' }}>
                    {diaryData.explorationDate}
                </p>
                <img
                    src={diaryData.imageUrl}
                    alt="탐험 일기 사진"
                    className="w-[289px] h-[150px] object-cover mt-4 shadow-lg"
                />
                <p 
                    className="text-[#2B2B2B] text-[14px] mt-4 font-[400] flex-grow overflow-y-auto pr-[16px] leading-[150%] tracking-[-0.025em]" style={{ fontFamily: '"Noto Serif KR", serif' }}
                >
                    {content}
                </p>
            </div>
        </div>
    );
}
