import React from 'react';
import HatEnable from '../assets/hatEnable.svg';
import HatDisable from '../assets/hatDisable.svg';

export default function MissionProgress({ clearedMissions }) {
  const steps = [1, 3, 5, 10, 15];
  const hatWidth = 50;
  const containerWidth = 349;

  const calculateVisualProgress = () => {
    if (clearedMissions <= 0) return 0;
    if (clearedMissions >= 15) return 100;

    let baseProgress = 0;
    let segmentStart = 0;
    let segmentEnd = 0;

    if (clearedMissions >= 1 && clearedMissions < 3) {
      baseProgress = 0;
      segmentStart = 1;
      segmentEnd = 3;
    } else if (clearedMissions >= 3 && clearedMissions < 5) {
      baseProgress = 25;
      segmentStart = 3;
      segmentEnd = 5;
    } else if (clearedMissions >= 5 && clearedMissions < 10) {
      baseProgress = 50;
      segmentStart = 5;
      segmentEnd = 10;
    } else if (clearedMissions >= 10 && clearedMissions < 15) {
      baseProgress = 75;
      segmentStart = 10;
      segmentEnd = 15;
    } else {
      baseProgress = 0;
      segmentStart = 0;
      segmentEnd = 1;
    }
    
    const missionsInSegment = segmentEnd - segmentStart;
    const missionsCompletedInSegment = clearedMissions - segmentStart;
    const progressRatioInSegment = missionsInSegment === 0 ? 0 : missionsCompletedInSegment / missionsInSegment;
    const totalProgress = baseProgress + (25 * progressRatioInSegment);

    return totalProgress;
  };

  const progressPercentage = calculateVisualProgress();
  const totalProgressBarWidth = containerWidth - hatWidth;

  return (
    <div className="w-[349px] h-[50px] relative">
      
      <div
        className="absolute top-[25px] h-1 z-0"
        style={{
          left: `${hatWidth / 2}px`,
          width: `${totalProgressBarWidth}px`,
        }}
      >
        <div className="w-full h-full bg-[#A47764]" />
        <div
          className="absolute top-0 left-0 h-full rounded-2xl bg-[#F39E37] transition-all duration-500"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      <div className="w-full h-full flex items-center justify-between z-10">
        {steps.map((step, index) => {
          const isEnabled = clearedMissions >= step;
          return (
            <div key={index} className="relative flex justify-center items-center w-[50px] h-[50px]">
              <img
                src={isEnabled ? HatEnable : HatDisable}
                alt={`${step} missions`}
                className="w-full h-full"
              />
              <span
                className={`absolute text-sm z-15 ${isEnabled ? 'text-[#513D2E] font-black' : 'text-[#FFFAFA] font-bold'}`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}