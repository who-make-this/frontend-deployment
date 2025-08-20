import React, { useState } from 'react';
import ExchangeConfirmModal from './ExchangeConfirmModal';
import ExchangeCompleteModal from './ExchangeCompleteModal';

export default function CouponModal({ onClose, isClosing, currentMileage }) {
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [isConfirmClosing, setIsConfirmClosing] = useState(false);
  const [exchangeComplete, setExchangeComplete] = useState(false);

  const coupons = [
    { name: "1만원권", value: 10000 },
    { name: "3만원권", value: 30000 },
    { name: "5만원권", value: 50000 },
  ];
  
  const handleCloseConfirmModal = () => {
    setIsConfirmClosing(true);
    setTimeout(() => {
      setSelectedCoupon(null);
      setIsConfirmClosing(false);
    }, 250);
  };

  const handleConfirmExchange = () => {
    console.log(`${selectedCoupon.name} 교환 처리 완료!`);
    
    setIsConfirmClosing(true);
    setTimeout(() => {
      setIsConfirmClosing(false);
      setExchangeComplete(true);
    }, 250);
  };

  const isOverlayTransparent = selectedCoupon && !isConfirmClosing;

  return (
    <div className={`absolute inset-0 z-50 ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`}>
      <div
        className={`
          absolute inset-0 bg-[#2B2B2BE5]
          transition-opacity duration-250
          ${isOverlayTransparent ? 'opacity-0 pointer-events-none' : 'opacity-100'}
        `}
        onClick={onClose}
      />

      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[375px] h-[300px] bg-white rounded-t-2xl px-6 pt-6 pb-8"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-[24px] mt-3 ml-2 font-semibold mb-8 text-[#2B2B2B] tracking-[-0.75px]">구미사랑상품권</h2>
        <div className="space-y-5">
          {coupons.map((coupon, index) => {
            const isAvailable = currentMileage >= coupon.value;
            return (
              <div key={index} className="flex justify-between items-center ml-2">
                <p className="text-lg font-medium text-[#2B2B2B]">{coupon.name}</p>
                <button
                  onClick={() => setSelectedCoupon(coupon)}
                  disabled={!isAvailable}
                  className={`rounded-full px-5 py-2 mr-2 text-sm font-semibold transition-colors
                    ${isAvailable 
                      ? "bg-[#9A8C4F] text-white cursor-pointer" 
                      : "bg-[#9A8C4F4D] text-white cursor-not-allowed"
                    }`}
                >
                  교환하기
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <ExchangeConfirmModal 
        coupon={selectedCoupon}
        onConfirm={handleConfirmExchange}
        onCancel={handleCloseConfirmModal}
        isConfirmClosing={isConfirmClosing}
      />

      {exchangeComplete && (
        <ExchangeCompleteModal 
          coupon={selectedCoupon}
          onCloseAll={onClose} 
        />
      )}
    </div>
  );
}