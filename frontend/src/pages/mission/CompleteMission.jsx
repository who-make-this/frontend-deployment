import React from "react";
import MissionCard from "../../component/missionCard";

export default function CompleteMission({ missions }) {
  return (
    <div className="grid grid-cols-2 gap-4 px-2">
      {missions.map((mission, index) => (
        <MissionCard key={index} {...mission} />
      ))}
    </div>
  );
}
