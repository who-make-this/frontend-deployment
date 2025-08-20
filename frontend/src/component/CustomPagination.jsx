import React, { useState, useEffect } from 'react';

export default function CustomPagination({ totalSlides, activeIndex }) {
  const [dotStyles, setDotStyles] = useState([]);

  const dotSize = 6;   
  const barSize = 28;  
  const gap = 12;      

  const itemInterval = dotSize + gap;

  useEffect(() => {
    const newStyles = Array.from({ length: totalSlides }).map((_, i) => {
      let x = i * itemInterval;
      if (i > activeIndex) {
        x += barSize - dotSize;
      }
      return {
        transform: `translateX(${x}px)`,
        width: activeIndex === i ? `${barSize}px` : `${dotSize}px`,
      };
    });
    setDotStyles(newStyles);
  }, [activeIndex, totalSlides]);

  const containerWidth = (totalSlides - 1) * itemInterval + barSize;

  return (
    <div 
      className="relative flex items-center" 
      style={{ width: containerWidth, height: dotSize }}
    >
      {dotStyles.map((style, index) => (
        <div
          key={index}
          className="pagination-bullet"
          style={style}
        />
      ))}
    </div>
  );
}