import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

// --- Asset Imports ---
import ReportbgImg from "../../assets/reportbgimg.svg?react";
import Logo from "../../component/Logo";
import JournalEntryForm from "../../component/JournalEntryForm";
import ReportContainer from "../../component/ReportContainer";
import loading1 from "../../assets/loading.svg";

const ImageGalleryModal = ({ onClose, onSelectImage }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) throw new Error("로그인이 필요합니다.");

        const baseUrl = import.meta.env.VITE_BACKEND_URL || "";
        const url = `${baseUrl}/reports/completed-images`;

        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setImages(response.data.map((img) => img.imageUrl));
      } catch (err) {
        console.error("🚨 이미지 갤러리 로드 실패:", err);
        setError("이미지를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  return (
    <div className="fixed inset-0 backdrop-blur-[10px] z-50 flex flex-col pt-3 animate-fade-in">
      <header className="relative flex items-center justify-center mt-4 text-white mb-4 py-2">
        <button
          onClick={onClose}
          className="absolute left-5 mb-1.5 text-[40px] font-extralight"
        >
          &times;
        </button>
        <h2 className="text-xl font-normal">탐험 일지 사진 선택</h2>
      </header>
      <div className="flex-grow overflow-y-auto hide-scrollbar p-2">
        {loading ? (
          <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/70">
            <img
              src={loading1}
              alt="인증 중 로딩"
              className="w-16 h-16 animate-spin mb-4"
            />
            <div className="text-white text-xl font-normal">
              이미지 불러 오는 중...
            </div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-white text-center">{error}</p>
          </div>
        ) : images.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-white text-center">
              선택할 수 있는 이미지가 없습니다.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1">
            {images.map((imgSrc, index) => (
              <div
                key={index}
                className="aspect-square bg-gray-700 overflow-hidden"
                onClick={() => onSelectImage(imgSrc)}
              >
                <img
                  src={imgSrc}
                  alt={`Gallery image ${index + 1}`}
                  className="w-full h-full object-cover cursor-pointer transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("ko-KR").replace(/\./g, "/").slice(0, -1);
const formatTime = (iso) => new Date(iso).toTimeString().slice(0, 5);
const formatDiaryDate = (iso) => {
  const date = new Date(iso);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const period = hours < 12 ? "오전" : "오후";
  const formattedHours = String(hours).padStart(2, "0");
  return `${year}.${month}.${day} ${period} ${formattedHours}:${minutes}`;
};

export default function JournalEntryPage({ setIsMissionActive }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [journalText, setJournalText] = useState("");
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedReport, setGeneratedReport] = useState(null);
  const [activeView, setActiveView] = useState("report");

  const handleSelectImage = (imageSrc) => {
    setSelectedImage(imageSrc);
    setIsGalleryOpen(false);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("로그인이 필요합니다.");

      const baseUrl = import.meta.env.VITE_BACKEND_URL || "";
      const url = `${baseUrl}/reports/generate`;

      const payload = {
        selectedImageUrl: selectedImage,
        marketId: 1,
      };

      const response = await axios.post(url, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const report = response.data;
      const transformedData = {
        id: report.id,
        marketName: report.reportTitle.replace(" 탐험", ""),
        date: formatDate(report.explorationDate),
        timeRange: `${formatTime(report.startTime)} - ${formatTime(
          report.endTime
        )}`,
        mainType: report.userType,
        scores: {
          sensitivity: report.completedMissionsByCategories["감성형"] || 0,
          foodie: report.completedMissionsByCategories["먹보형"] || 0,
          adventure: report.completedMissionsByCategories["모험형"] || 0,
        },
        results: {
          totalScore: report.totalScore,
          mileage: `${report.earnedMileage}M`,
          thisMonthTotal: `${report.remainingMonthlyMileage}M`,
        },
        status: "성공",
        diary: {
          explorationDate: formatDiaryDate(report.explorationDate),
          journalContent: report.journalContent,
          imageUrl: report.mainImageUrl,
        },
      };

      setGeneratedReport(transformedData);
      setIsMissionActive(false);
    } catch (error) {
      console.error("🚨 일지 생성 실패:", error);
      alert("일지 생성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-[375px] h-[812px] bg-white shadow-sm relative overflow-hidden">
        <ReportbgImg
          className="absolute top-0 left-0 w-full h-full"
          preserveAspectRatio="none"
        />
        <div
          className="absolute top-0 left-0 w-full h-full pointer-events-none z-10"
          style={{ backgroundColor: "#2B2B2B4D" }}
        />
        <div className="absolute top-0 left-0 w-full z-30">
          <Logo textColor="text-white" iconColor="white" />
        </div>

        {generatedReport ? (
          <div className="absolute inset-0 z-20 flex items-center justify-center p-4">
            <ReportContainer
              report={generatedReport}
              activeView={activeView}
              setActiveView={setActiveView}
            />
          </div>
        ) : (
          <JournalEntryForm
            selectedImage={selectedImage}
            journalText={journalText}
            onImageSelectClick={() => setIsGalleryOpen(true)}
            onTextChange={(e) => setJournalText(e.target.value)}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        )}

        {isGalleryOpen && (
          <ImageGalleryModal
            onClose={() => setIsGalleryOpen(false)}
            onSelectImage={handleSelectImage}
          />
        )}

        {isSubmitting && (
          <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/70">
            <img
              src={loading1}
              alt="인증 중 로딩"
              className="w-16 h-16 animate-spin mb-4"
            />
            <div className="text-white text-xl font-normal">
              탐험 일지 생성 중...
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
