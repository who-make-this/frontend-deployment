import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const ExchangeConfirmModal = ({ coupon, onConfirm, onCancel, isConfirmClosing, isSubmitting }) => {
  if (!coupon) return null;

  return (
    <div
      className={`absolute inset-0 bg-[#2B2B2BE5] flex justify-center pt-[263px] z-60 ${
        isConfirmClosing ? 'animate-fade-out' : 'animate-fade-in'
      }`}
    >
      <div
        className="bg-white rounded-[20px] px-6 py-4 w-[349px] h-[302px] mx-4 flex flex-col justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-[#2B2B2B] mb-3">전자상품권 교환</h2>
        <p className="text-[#2B2B2BCC] mb-1 text-[16px] font-[500]">
          <span>{coupon.price.toLocaleString()} 마일리지</span>를 사용해 전자상품권으로 교환하시겠어요?
        </p>
        <p className="text-[16px] font-[500] text-[#2B2B2BCC] mb-6">
          이 상품권은 구미 지역에서만 사용 가능할 수 있으며, 교환 후에는 환불이나 취소가 불가능합니다.
        </p>
        <div className="flex justify-between space-x-4">
          <button
            onClick={onCancel}
            disabled={isSubmitting}
            className="w-full bg-[#2B2B2B1A] text-gray-700 font-semibold py-3 rounded-[40px] transition-colors"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            disabled={isSubmitting}
            className="w-full bg-[#9A8C4F] text-white font-semibold py-3 rounded-[40px] transition-colors flex justify-center items-center"
          >
            {isSubmitting ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : '교환하기'}
          </button>
        </div>
      </div>
    </div>
  );
};

const ExchangeCompleteModal = ({ coupon, pinCode, onCloseAll }) => {
  if (!coupon || !pinCode) return null;

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=289x289&data=${encodeURIComponent(pinCode)}`;

  const handleSaveQRCode = async () => {
    try {
      const response = await fetch(qrCodeUrl);
      if (!response.ok) throw new Error('QR 코드 이미지를 불러오는데 실패했습니다.');

      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `구미사랑상품권-${coupon.name}.png`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(link.href);
      onCloseAll(); // QR 코드 저장 후 상태 정리
    } catch (error) {
      console.error("QR 코드 저장 실패:", error);
      alert("QR 코드 저장에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="absolute inset-0 bg-[#2B2B2BE5] flex justify-center pt-[152px] z-100 animate-fade-in">
      <div
        className="bg-[#FFFAFA] rounded-[20px] px-6 py-8 w-[349px] h-[542px] mx-4 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-left ml-2 mt-[5px]">
          <h2 className="text-[#2B2B2B] font-semibold text-[25px] mb-2 tracking-[-1px]">{coupon.name} 발급</h2>
          <p className="text-[#2B2B2BCC] text-[16px] font-[500] leading-snug">
            구미사랑상품권 {coupon.name}을 발급했어요.
            <br />
            아래 qr코드를 저장해 간편하게 결제해보세요.
          </p>
        </div>
        <div className="flex justify-center mt-[8px]">
          <img src={qrCodeUrl} alt={`${coupon.name} QR Code`} className="w-[289px] h-[289px]" />
        </div>
        <div className="flex justify-center mt-auto">
          <button
            onClick={handleSaveQRCode}
            className="w-[289px] h-[50px] bg-[#9A8C4F] text-white font-semibold py-3 rounded-[40px] hover:bg-[#8a7c47] transition-colors"
          >
            QR코드 저장하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default function CouponModal({ onClose, isClosing, currentMileage, onMileageUpdate }) {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [isConfirmClosing, setIsConfirmClosing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [exchangeComplete, setExchangeComplete] = useState(false);
  const [pinCode, setPinCode] = useState(null);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const token = Cookies.get('token');
        if (!token) throw new Error("로그인이 필요합니다.");
        const baseUrl = import.meta.env.VITE_BACKEND_URL || "";
        const response = await axios.get(`${baseUrl}/coupons`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCoupons(response.data);
      } catch (err) {
        console.error("🚨 쿠폰 목록 조회 실패:", err);
        setError("쿠폰 목록을 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchCoupons();
  }, []);

  const handleCloseConfirmModal = () => {
    setIsConfirmClosing(true);
    setTimeout(() => {
      setIsConfirmClosing(false);
      setSelectedCoupon(null);
    }, 250);
  };

  const handleConfirmExchange = async () => {
    if (!selectedCoupon) return;
    setIsSubmitting(true);
    try {
      const token = Cookies.get('token');
      if (!token) throw new Error("로그인이 필요합니다.");
      const baseUrl = import.meta.env.VITE_BACKEND_URL || "";
      const url = `${baseUrl}/coupons/purchase/${selectedCoupon.id}`;

      const responsePin = await axios.post(url, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const receivedPinCode = responsePin.data[0]?.pinCode;
      if (!receivedPinCode) throw new Error("서버에서 pinCode를 찾을 수 없습니다.");

      setPinCode(receivedPinCode);
      setExchangeComplete(true);

      if (typeof onMileageUpdate === 'function') {
        onMileageUpdate();
      }
    } catch (err) {
      console.error("🚨 쿠폰 교환 실패:", err);
      alert("쿠폰 교환에 실패했습니다. 다시 시도해주세요.");
      setSelectedCoupon(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseAllModals = () => {
    onClose();
    setSelectedCoupon(null);
    setExchangeComplete(false);
    setPinCode(null);
  };

  const isOverlayTransparent = selectedCoupon && !isConfirmClosing;

  return (
    <div className={`absolute inset-0 z-50 ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`}>
      <div
        className={`absolute inset-0 bg-[#2B2B2BE5] transition-opacity duration-250 ${
          isOverlayTransparent ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        onClick={onClose}
      />
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[375px] h-[300px] bg-white rounded-t-2xl px-6 pt-6 pb-8"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-[24px] mt-3 ml-2 font-semibold mb-8 text-[#2B2B2B] tracking-[-0.75px]">구미사랑상품권</h2>
        <div className="space-y-5">
          {loading ? (
            <p>로딩 중...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            coupons.map((coupon) => {
              const isAvailable = currentMileage >= coupon.price;
              return (
                <div key={coupon.id} className="flex justify-between items-center ml-2">
                  <p className="text-lg font-medium text-[#2B2B2B]">{coupon.name}</p>
                  <button
                    onClick={() => setSelectedCoupon(coupon)}
                    disabled={!isAvailable}
                    className={`rounded-full px-5 py-2 mr-2 text-sm font-semibold transition-colors ${
                      isAvailable ? "bg-[#9A8C4F] text-white cursor-pointer" : "bg-[#9A8C4F4D] text-white cursor-not-allowed"
                    }`}
                  >
                    교환하기
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      <ExchangeConfirmModal
        coupon={selectedCoupon}
        onConfirm={handleConfirmExchange}
        onCancel={handleCloseConfirmModal}
        isConfirmClosing={isConfirmClosing}
        isSubmitting={isSubmitting}
      />

      {exchangeComplete && (
        <ExchangeCompleteModal coupon={selectedCoupon} pinCode={pinCode} onCloseAll={handleCloseAllModals} />
      )}
    </div>
  );
}
