import React from 'react';
import ReportView from './ReportCard';
import DiaryView from './DiaryView';
import FlipWhite from '../assets/flip_white.svg';
import FlipBlack from '../assets/flip_black.svg'; 

// 1. activeView와 setActiveView를 props로 받습니다.
export default function ReportContainer({ report, activeView, setActiveView }) {
    
    // 2. 자체적으로 상태를 관리하던 useState를 삭제합니다.

    const buttonClass = activeView === 'report' 
        ? "bg-transparent border border-white text-white"
        : "bg-white text-black"; 

    return (
        <div className="flex flex-col items-center mt-10">
            {/* 3. props로 받은 activeView를 사용합니다. */}
            {activeView === 'report' ? (
                <ReportView reportData={report} />
            ) : (
                <DiaryView diaryData={report.diary} />
            )}
            <div className="mt-[30px] w-[309px]">
                <button 
                    // 4. props로 받은 setActiveView 함수를 호출합니다.
                    onClick={() => setActiveView(prev => prev === 'report' ? 'diary' : 'report')}
                    className={`w-full font-[600] py-3 text-[16px] px-4 rounded-lg shadow-md transition-colors flex items-center justify-center gap-x-2 ${buttonClass}`}
                >
                    <img 
                        src={activeView === 'report' ? FlipWhite : FlipBlack} 
                        alt="전환 아이콘" 
                        className="w-5 h-5"
                    />
                    <span>
                        {activeView === 'report' ? '탐험 일기' : '탐험 보고서'}
                    </span>
                </button>
            </div>
        </div>
    );
}
