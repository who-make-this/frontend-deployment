import React from 'react';
import ReportCardFrame from '../assets/reportpage.svg';
import ReportGrid from '../assets/reportGrid.svg';

export default function DiaryView({ diaryData }) {
    if (!diaryData || !diaryData.journalContent) {
        return (
            <div className="w-[349px] h-[542px] relative">
                <img src={ReportCardFrame} alt="리포트 배경" className="absolute inset-0 w-full h-full z-10" />
                <img src={ReportGrid} alt="리포트 그리드" className="absolute inset-0 w-full h-full z-20" />
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
        <div className="w-[349px] h-[542px] relative">
            <img src={ReportCardFrame} alt="리포트 배경" className="absolute inset-0 w-full h-full z-10" />
            <div className="relative z-30 p-8 flex flex-col h-full">
                <h2 className="text-[17px] font-bold text-gray-800  mt-5 tracking-[-0.025em]"style={{ fontFamily: '"Noto Serif KR", serif' }} >{title}</h2>
                <p className=" text-[12px] font-extralight leading-[140%] tracking-[-0.025em] text-[#2B2B2BCC] mt-1"style={{ fontFamily: '"Noto Serif KR", serif' }}>
                    {diaryData.explorationDate}
                </p>
                <img
                    src={diaryData.imageUrl}
                    alt="탐험 일기 사진"
                    className="w-[289px] h-[150px] object-cover rounded-md mt-4 shadow-lg"
                    onError={(e) => { e.target.onerror = null; e.target.src=tempImageUrl; }}
                />
                <p 
                  className="text-gray-900 text-[15px] mt-5 leading-relaxed flex-grow overflow-y-auto pr-2"style={{ fontFamily: '"Noto Serif KR", serif' }}
                >
                    {content}
                </p>
            </div>
        </div>
    );
}