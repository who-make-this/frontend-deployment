import React from 'react';

export default function ExchangeCompleteModal({ coupon, onCloseAll, isClosing }) {

  if (!coupon) return null;

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=GumiLoveCoupon-${coupon.value}-${Date.now()}`;

  return (
    <div 
      className={`absolute inset-0 flex justify-center pt-[152px] z-70
                  ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`}
    >
      <div 
        className="bg-[#FFFAFA] rounded-[20px] px-6 py-8 w-[349px] h-[542px] mx-4 flex flex-col" // text-center 제거
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-left ml-2 mt-[5px]">
          <h2 className="text-[#2B2B2B] font-semibold text-[25px] mb-2 tracking-[-1px]">
            {coupon.name} 발급
          </h2>
          <p className="text-[#2B2B2BCC] text-[16px] font-[500] leading-snug">
            구미사랑상품권 {coupon.name}을 발급했어요.
            <br />
            아래 qr코드를 저장해 간편하게 결제해보세요.
          </p>
        </div>

        <div className="flex justify-center mt-[8px]">
          <img 
            src={qrCodeUrl} 
            alt={`${coupon.name} QR Code`} 
            className="w-[289px] h-[289px]"
          />
        </div>

        <div className="flex justify-center mt-[25px]">
          <button 
            onClick={onCloseAll} 
            className="w-[289px] h-[50px] bg-[#9A8C4F] text-white font-semibold py-3 rounded-[40px] hover:bg-[#8a7c47] transition-colors"
          >
            QR코드 저장하기
          </button>
        </div>
      </div>
    </div>
  );
}