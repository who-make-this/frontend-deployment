import React, { useState, useEffect, useRef } from "react";

import eatImg from "../assets/eat.svg";
import moodImg from "../assets/mood.svg";
import exploreImg from "../assets/explore.svg";

export default function MissionCard({
  category,
  missionNumbers,
  missionTitle,
  content,
}) {
  const cardRef = useRef(null);

  const [fontSize, setFontSize] = useState(24);
  const [cardHeight, setCardHeight] = useState(480);
  const [paddingTop, setPaddingTop] = useState("pt-12");
  const [borderRadius, setBorderRadius] = useState("24px");
  const [padding, setPadding] = useState("100");

  useEffect(() => {
    function updateSize() {
      if (!cardRef.current) return;
      const width = cardRef.current.offsetWidth;

      const newFontSize = Math.min(Math.max(width / 10, 12), 24);
      setFontSize(newFontSize);

      const newHeight = (480 / 306) * width;
      setCardHeight(newHeight);

      setPaddingTop(width <= 250 ? "pt-4" : "pt-12");
      setBorderRadius(width <= 250 ? "16px" : "24px");
      setPadding(width <= 250 ? "10" : "24");
    }

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const typeStyles = {
    먹보형: {
      colors: ["#9A8C4F", "#D19B98"],
      image: eatImg,
    },
    감성형: {
      colors: ["#9A8C4F", "#A792B9"],
      image: moodImg,
    },
    모험형: {
      colors: ["#9A8C4F", "#889F69"],
      image: exploreImg,
    },
  };

  const { colors, image } = typeStyles[category] || typeStyles["먹보형"];

  return (
    <div
      ref={cardRef}
      className="relative w-full overflow-hidden"
      style={{
        height: `${cardHeight}px`,
        borderRadius: borderRadius,
        background: `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 100%)`,
        boxShadow:
          "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px z-30",
      }}
    >
      {/* 두 줄 빛 오버레이 - 중앙 투명 */}
      <div
        className="absolute inset-0 z-30 animate-fade-shine"
        style={{
          width: "30%",
          background:
            "linear-gradient(90deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.2) 70%, rgba(255,255,255,0) 70%, rgba(255,255,255,0) 85%, rgba(255,255,255,0.2) 80%, rgba(255,255,255,0.2) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* 카드 태그 */}
      <div
        className="flex justify-between text-gray-800 font-medium z-50"
        style={{ fontSize: `${fontSize * 0.6}px`, padding: `${padding}px` }}
      >
        <div
          className="bg-[#FFFAFA70] flex justify-center rounded-full z-50"
          style={{
            width: fontSize * 2.8,
            maxHeight: cardHeight * 0.3,
            fontSize: `${fontSize * 0.6}px`,
            userSelect: "none",
          }}
        >
          {category}
        </div>
        <div style={{ fontSize: `${fontSize * 0.6}px` }} className=" z-50">
          No.{missionNumbers}
        </div>
      </div>

      {/* 타입 이미지 */}
      <div className={`flex justify-center ${paddingTop} my-2`}>
        <img
          src={image}
          alt={`${category} 이미지`}
          draggable={false}
          style={{
            width: fontSize * 25,
            height: "auto",
            maxWidth: "100%",
            maxHeight: cardHeight * 0.38,
            zIndex: 50,
          }}
        />
      </div>

      {/* 미션 설명 */}
      <div
        className="flex flex-col z-50"
        style={{ padding: `${padding * 0.8}px` }}
      >
        <div
          className="font-extrabold z-50"
          style={{ fontSize: `${fontSize}px` }}
        >
          {missionTitle}
        </div>
        <div
          className="font-medium text-[#2B2B2B] z-50"
          style={{
            fontSize: `${fontSize * 0.66}px`,
            paddingTop: `${padding * 0.2}px`,
          }}
        >
          {content}
        </div>
      </div>
    </div>
  );
}
