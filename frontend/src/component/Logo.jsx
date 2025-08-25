import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
export default function Logo({
    textColor = 'text-white',
    iconColor = 'white',
    isMissionActive
}) {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const closeMenu = () => setMenuOpen(false);
    const menuIconSvg = (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.5 12H20.5" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3.5 5H20.5" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3.5 19H20.5" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );

    const closeIconSvg = (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.25 5.25L18.75 18.75" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5.25 18.75L18.75 5.25" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );

    const handleLogoClick = () => {
    if (isMissionActive) {
      navigate("/mission");
    } else {
      navigate("/");
    }
  };

    return (
        <header className={`fixed w-full z-20 transition-all duration-[250ms] overflow-hidden ${menuOpen ? "h-[215px]" : "h-[54px]"} backdrop-blur-[10px]`}>
            <div className="flex items-center h-[54px] w-full">
                <Link to="/" className="ml-[13px] py-4 pl-4">
                    <span
                        onClick={handleLogoClick}
                        className={textColor}
                        style={{
                            fontFamily: 'MuseumClassic, sans-serif',
                            fontWeight: 700,
                            fontSize: '25px',
                            lineHeight: '140%',
                            letterSpacing: '-0.625px',
                        }}
                    >
                        시장탐험대
                    </span>
                </Link>
                <button
                    className="ml-auto mr-[15px] transition-all duration-[250ms] relative w-6 h-6 flex items-center justify-center"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    <div className={`absolute transition-opacity duration-[250ms] ${menuOpen ? "opacity-0" : "opacity-100"}`}>
                        {menuIconSvg}
                    </div>
                    <div className={`absolute transition-opacity duration-[250ms] ${menuOpen ? "opacity-100" : "opacity-0"}`}>
                        {closeIconSvg}
                    </div>
                </button>
            </div>
            <div className={`w-full transition-all duration-[250ms] ${menuOpen ? "opacity-100 py-4" : "opacity-0 py-0"} flex flex-col items-start px-3 py-1 space-y-7`}>
                {menuOpen && (
                    <>
                        <Link to="/secret" className={`${textColor} text-[16px] font-bold`} onClick={closeMenu}>
                            시장의 비밀 이야기
                        </Link>
                        <Link to="/report" className={`${textColor} text-[16px] font-bold`} onClick={closeMenu}>
                            탐험 일지
                        </Link>
                        <Link to="/mypage" className={`${textColor} text-[16px] font-bold`} onClick={closeMenu}>
                            탐험가 정보
                        </Link>
                    </>
                )}
            </div>
        </header>
    );
}