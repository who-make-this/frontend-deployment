import React, { useState } from 'react';
import ReportView from './ReportCard';
import DiaryView from './DiaryView';
import FlipWhite from '../assets/flip_white.svg';
import FlipBlack from '../assets/flip_black.svg'; 

export default function ReportContainer({ report }) {
    const [activeView, setActiveView] = useState('report');

    const buttonClass = activeView === 'report' 
        ? "bg-transparent border border-white text-white"
        : "bg-white text-black"; 

    return (
        <div className="flex flex-col items-center">
            {activeView === 'report' ? (
                <ReportView reportData={report} />
            ) : (
                <DiaryView diaryData={report.diary} />
            )}
            <div className="mt-6 w-[349px]">
                <button 
                    onClick={() => setActiveView(activeView === 'report' ? 'diary' : 'report')}
                    className={`w-full font-bold py-3 px-4 rounded-lg shadow-md transition-colors flex items-center justify-center gap-x-2 ${buttonClass}`}
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
