import React from "react";
import { secretStories } from "../data/stories";
import LockIcon from '../assets/lockicon.svg';

export default function SecretStory({ storyId, clearedMissions }) {
    const story = secretStories.find(s => s.id === storyId);
    if (!story) return null;
    const isLocked = clearedMissions < story.unlockRequirement;

    return (
        <div className="w-[349px] h-[344px] shadow-[0_0_0_1px_rgba(0,0,0,0.05),_0_2px_8px_rgba(0,0,0,0.08)] rounded-xl overflow-hidden relative">
            <div className={`flex flex-col h-full ${isLocked ? 'blur-[4px]' : ''}`}>
                <div className="relative w-full h-[175px]">
                    <img
                        src={story.image}
                        alt={story.title}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="p-4 flex-grow bg-[#FFFAFA]">
                    <div>
                        <h1 className="text-[#2B2B2B] text-xl font-bold mb-2">{story.title}</h1>
                        <p className="text-[#2B2B2BCC] text-sm font-[400] tracking-[-0.3px] leading-[140%]">{story.content}</p>
                    </div>
                </div>
            </div>

            {isLocked && (
                <div className="absolute inset-0 z-10 bg-[#FFFAFA80] flex flex-col items-center justify-center">
                    <img src={LockIcon} alt="Locked" className="w-[80px] h-[80px] mb-2" />
                    
                    <p 
                      className="text-[#2B2B2B]" 
                      style={{
                            fontFamily: 'MuseumClassic, sans-serif',
                            fontWeight: 'bold', 
                            fontSize: '22px',
                            lineHeight: '140%',
                            letterSpacing: '1px', 
                            textAlign: 'center',
                        }}
                    >
                        미션 <span style={{ color: '#A47764' }}>{story.unlockRequirement}개 성공</span> 시 해금
                    </p>
                </div>
            )}
        </div>
    );
}