import React from 'react';
import CameraIcon from '../assets/camera.svg?react';
import loading1 from "../assets/loading.svg";

export default function JournalEntryForm({ 
    selectedImage, 
    onImageSelectClick, 
    onSubmit,
    isSubmitting
}) {
    const isButtonEnabled = selectedImage !== null;

    const dashedBorderSVG = `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='8' ry='8' stroke='%23FFFFFFAA' stroke-width='3.5' stroke-dasharray='12%2c 8' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e")`;

    return (
        <div className="relative z-20 px-3 py-4 flex flex-col h-full mt-30">
            <header className="flex mb-6 justify-center items-center">
                <h1 className="text-[28px] font-[500] text-white text-center tracking-[-0.75px] leading-[140%]">탐험 일지를<br/>기록해볼까요?</h1>
            </header>

            <main className="flex-grow flex flex-col">
                <div 
                    className="w-[349px] h-[181px] rounded-lg p-[2px] cursor-pointer mb-4" 
                    style={{ backgroundImage: dashedBorderSVG }}
                    onClick={onImageSelectClick}
                >
                    {selectedImage ? (
                        <img src={selectedImage} alt="Selected for journal" className="w-full h-full object-cover rounded-md" />
                    ) : (
                        <div className="w-full h-full rounded-md bg-[#FFFAFA4D] flex flex-col items-center justify-center text-center text-white/80">
                            <CameraIcon className="w-12 h-12 mx-auto" />
                            <p className="mt-2 text-[16px] text-[#FFFAFA]">탐험 일지에 사용될 이미지를<br/>선택해주세요</p>
                        </div>
                    )}
                </div>
            </main>
            <footer className="w-full flex justify-center mb-100">
               <button 
                    onClick={onSubmit}
                    disabled={!isButtonEnabled || isSubmitting}
                    className={`w-[121px] h-[53px] font-bold rounded-[25px] shadow-md transition-colors flex items-center justify-center 
                        ${isButtonEnabled 
                            ? 'bg-white text-[#2B2B2B] transition-all duration-250 ease-in-out active:scale-x-[1.088] active:scale-y-[1.132] active:bg-[#A47764] active:text-white' 
                            : 'bg-[#FFFAFA4D] border-[0.7px] border-[#FFFAFA] text-[#2B2B2B4D] cursor-not-allowed'
                        }
                        ${isSubmitting ?  <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/70">
                        <img
                            src={loading1}
                            alt="인증 중 로딩"
                            className="w-16 h-16 animate-spin mb-4"
                        />
                        <div className="text-white text-xl font-normal">
                            이미지 검토 중...
                        </div>
                    </div>  : ''}` 
                    }
                >
                    {isSubmitting ? ' 생성 중...': '기록하기'}
                </button>
            </footer>
        </div>
    );
}
