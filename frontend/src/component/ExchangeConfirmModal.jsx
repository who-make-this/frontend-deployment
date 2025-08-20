import React from 'react';

export default function ExchangeConfirmModal({ coupon, onConfirm, onCancel, isConfirmClosing }) {
  if (!coupon) return null;

  return (
    <div 
      className={`absolute inset-0 bg-[#2B2B2BE5] flex justify-center pt-[263px] z-60
                  ${isConfirmClosing ? 'animate-fade-out' : 'animate-fade-in'}`}
    >
      <div 
        className="bg-white rounded-[20px] px-6 py-4 w-[349px] h-[302px] mx-4 flex flex-col justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-[#2B2B2B] mb-3">전자상품권 교환</h2>
        
        <p className="text-[#2B2B2BCC] mb-1 text-[16px] font-[500]">
          <span className="">{coupon.value.toLocaleString()} 마일리지</span>를 사용해 
          전자상품권으로 교환하시겠어요?
        </p>
        <p className="text-[16px] font-[500] text-[#2B2B2BCC] mb-6">
          이 상품권은 구미 지역에서만 사용 가능할 수 있으며, 교환 후에는 환불이나 취소가 불가능합니다.
        </p>

        <div className="flex justify-between space-x-4">
          <button 
            onClick={onCancel}
            className="w-full bg-[#2B2B2B1A] text-[gray-700] font-semibold py-3 rounded-[40px] cursor-pointer transition-colors"
          >
            취소
          </button>
          <button 
            onClick={onConfirm}
            className="w-full bg-[#9A8C4F] text-white font-semibold py-3 rounded-[40px] cursor-pointer transition-colors"
          >
            교환하기
          </button>
        </div>
      </div>
    </div>
  );
}