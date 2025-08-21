import React, { useState } from "react";
import Logo from "../../component/Logo";
import MyPageImg from "../../assets/mypageimg.svg";
import TicketImg from "../../assets/ticket.svg";
import CouponModal from "../../component/couponModal";
import ClocheIcon from '../../assets/typeeat.svg';
import TravelIcon from '../../assets/typetravel.svg';
import MoodIcon from '../../assets/typemood.svg';

export default function MyPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    const ticketData = {
        adventurer: "후메잌디스!!",
        place: "구미 새마을중앙시장",
        date: "16/08/2025",
        mainType: "감성형",
        explorations: 16,
        coupons: 0,
        cleared: 42,
    };

    const mileageData = {
        current: 16000, 
        max: 5000,
    };
    
    const progressPercentage = Math.min((mileageData.current / mileageData.max) * 100, 100);

    const handleCloseModal = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsModalOpen(false);
            setIsClosing(false); 
        }, 250);
    };

    // mainType에 따른 아이콘 매핑
    const typeIcons = {
        '먹보형': ClocheIcon,
        '모험형': TravelIcon,
        '감성형': MoodIcon,
    };
    const MainTypeIcon = typeIcons[ticketData.mainType];

    // mainType에 따른 그라데이션 색상 매핑
    const typeGradientColors = {
        '먹보형': 'to-[#D19B98]',
        '모험형': 'to-[#889F69]',
        '감성형': 'to-[#A792B9]',
    };
    const toColorClass = typeGradientColors[ticketData.mainType] || 'to-[#D19B98]';

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-[375px] h-[812px] bg-white shadow-sm relative overflow-hidden">
                <img src={MyPageImg} alt="MyPage Background" className="absolute top-0 left-0 w-full h-full object-cover" />
                <Logo textColor="text-black" iconColor="black" />
                <img src={TicketImg} alt="미션 인증" className="w-[355px] h-[655px] absolute top-[103px] left-1/2 -translate-x-1/2 object-contain" />
                
                <div className="absolute top-[102px] left-1/2 -translate-x-1/2 w-[355px] h-[655px] px-8 py-10 flex flex-col">
                    <div className="flex justify-between items-start ml-[10px] mt-10">
                        <div>
                            <p className="text-[#2B2B2B80] text-[15px] font-medium">Adventurer:</p>
                            <p className="text-[#2B2B2B] text-2xl font-[750] mt-0 leading-[140%] tracking-[-0.3px]">{ticketData.adventurer}</p>
                        </div>
                        {MainTypeIcon && (
                            <img src={MainTypeIcon} alt={ticketData.mainType} className="w-[70px] h-[70px] mr-3" />
                        )}
                    </div>

                    <div className="mt-[0px]">
                        <div className="w-[270px] h-[2px] mx-auto mt-[25px]" style={{ backgroundImage: "linear-gradient(to right, #9A8C4F 50%, transparent 50%)", backgroundSize: "18px 1.2px", backgroundRepeat: "repeat-x" }} ></div>
                        <div className="relative mt-[55px] h-12">
                            <div className="absolute left-[11px]"><p className="text-[15px] font-[400] text-[#2B2B2B80]">Place</p><p className="text-[16px] font-semibold">{ticketData.place}</p></div>
                            <div className="absolute right-3"><p className="text-[15px] font-[400] text-[#2B2B2B80]">Start Date</p><p className="text-[16px] font-semibold text-right">{ticketData.date}</p></div>
                        </div>
                        <div className="relative h-12 mt-6">
                            <div className="absolute left-[11px]"><p className="text-[15px] font-[400] text-[#2B2B2B80]">Explorations</p><p className="text-[16px] font-semibold">{ticketData.explorations}</p></div>
                            <div className="absolute right-[48px]"><p className="text-[15px] font-[400] text-[#2B2B2B80]">Cleared</p><p className="text-[16px] font-semibold text-start">{ticketData.cleared}</p></div>
                        </div>
                    </div>
                    
                    <hr className="w-[267px] mx-auto mt-[35px] border-t border-[1.1px] border-[#9A8C4F33]" />

                    <div className="flex flex-col w-[269px] mx-auto mt-[34px] space-y-[2px]">
                        <div className="flex justify-between items-center">
                            <p className="text-[15px] font-[400] text-[#2B2B2B80]">Mileage</p>
                            <button onClick={() => setIsModalOpen(true)} className="border-[0.7px] border-[#2B2B2B80] rounded-full px-[14px] py-[3px] text-[14px] font-semibold text-[#2B2B2B] tracking-[-0.1px]">
                                쿠폰 목록
                            </button>
                        </div>
                        <p className="text-[17px] font-bold text-gray-800 text-start">
                            {mileageData.current.toLocaleString()}
                        </p>
                        <div className="mt-5">
                            <div className="w-full bg-gray-200 rounded-full h-4">
                                <div 
                                    className={`bg-gradient-to-r from-[#A47764] ${toColorClass} h-4 rounded-full`} 
                                    style={{ width: `${progressPercentage}%` }}
                                ></div>
                            </div>
                            <div className="flex justify-between text-sm font-[400] text-[#2B2B2B80] mt-1 tracking-[-0.2px]">
                                <span>0</span>
                                <span>{mileageData.max.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <p className="mt-0">
                        <span className="flex justify-center mr-0 text-[12px] font-[400] text-[#2B2B2B80] tracking-[-0.4px]">월 최대 적립 마일리지는 5,000M 입니다.</span>
                    </p>
                </div>

                {isModalOpen && <CouponModal onClose={handleCloseModal} isClosing={isClosing} currentMileage={mileageData.current} />}
            </div>
        </div>
    );
}