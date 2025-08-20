import React, { useState, useEffect, useRef } from "react";

import eatImg from "../assets/eat.svg";
import moodImg from "../assets/mood.svg";
import exploreImg from "../assets/explore.svg";

export default function MissionCard({ type, number, title, description }) {
  const [clicked, setClicked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  // 상태들: 폰트 크기, 카드 높이, pt, rounded
  const [fontSize, setFontSize] = useState(24);
  const [cardHeight, setCardHeight] = useState(464);
  const [paddingTop, setPaddingTop] = useState("pt-12");
  const [borderRadius, setBorderRadius] = useState("24px");
  const [padding, setpadding] = useState("100");

  // 카드 너비에 따라 모든 값 조정
  useEffect(() => {
    function updateSize() {
      if (!cardRef.current) return;
      const width = cardRef.current.offsetWidth;

      // 폰트 크기: 너비 / 10, 12 ~ 28 제한
      const newFontSize = Math.min(Math.max(width / 8, 10), 28);
      setFontSize(newFontSize);

      // 카드 높이: 원비율(464/306) 유지하며 조정
      const newHeight = (464 / 306) * width;
      setCardHeight(newHeight);

      // padding top
      setPaddingTop(width <= 250 ? "pt-2" : "pt-12");

      // 너비에 따라 카드 모서리 곡률 수정
      setBorderRadius(width <= 250 ? "16px" : "24px");

      setpadding(width <= 250 ? "10" : "24");
    }

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // 타입별 색상 및 이미지 매핑
  const typeStyles = {
    먹보형: {
      colors: ["#9A8C4F", "#D19B98"],
      image: eatImg,
    },
    감성형: {
      colors: ["#9A8C4F", "#A792B9"],
      image: moodImg,
    },
    탐험형: {
      colors: ["#9A8C4F", "#889F69"],
      image: exploreImg,
    },
  };

  // 잘못된 타입 처리 기본값 지정
  const { colors, image } = typeStyles[type] || typeStyles["먹보형"];

  return (
    <div
      ref={cardRef}
      className="relative w-full"
      style={{
        height: `${cardHeight}px`,
        borderRadius: borderRadius,
        background: `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 100%)`,
        boxShadow:
          "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
      }}
    >
    
      {/* 카드 태그 */}
      <div
        className="flex justify-between text-gray-800 font-medium"
        style={{ fontSize: `${fontSize * 0.6}px`, padding: `${padding}px` }}
      >
        <div
          className="bg-[#FFFAFA70] flex justify-center rounded-full"
          style={{
            width: fontSize * 2.8,
            maxHeight: cardHeight * 0.3,
            fontSize: `${fontSize * 0.6}px`,
            userSelect: "none",
          }}
        >
          {type}
        </div>
        <div style={{ fontSize: `${fontSize * 0.6}px` }}>No.{number}</div>
      </div>

      {/* 타입 이미지 */}
      <div className={`flex justify-center ${paddingTop}`}>
        <img
          src={image}
          alt={`${type} 이미지`}
          draggable={false}
          style={{
            width: fontSize * 25,
            height: "auto",
            maxWidth: "100%",
            maxHeight: cardHeight * 0.3,
          }}
        />
      </div>

      {/* 미션 설명 */}
      <div
        className="flex flex-col"
        style={{ padding: `${padding * 1}px ${padding * 1.5}px` }}
      >
        <div className="font-extrabold" style={{ fontSize: `${fontSize}px` }}>
          {title}
        </div>
        <div
          className="font-medium text-[#2B2B2B]"
          style={{ fontSize: `${fontSize * 0.66}px` }}
        >
          {description}
        </div>
      </div>
    </div>
  );
}
