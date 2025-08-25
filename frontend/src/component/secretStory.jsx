import React, { useState, useEffect } from 'react';
import LockIcon from '../assets/lockicon.svg';
import SecretStorybg1 from "../assets/secretmarketimg1.svg";

const getViewedAnimations = () => {
    try {
        const saved = localStorage.getItem('viewedStoryAnimations');
        return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch (error) {
        console.error('localStorage에서 애니메이션 상태를 불러오는데 실패:', error);
        return new Set();
    }
};

const addViewedAnimation = (storyId) => {
    try {
        const viewedAnimations = getViewedAnimations();
        viewedAnimations.add(storyId);
        localStorage.setItem('viewedStoryAnimations', JSON.stringify([...viewedAnimations]));
    } catch (error) {
        console.error('localStorage에 애니메이션 상태를 저장하는데 실패:', error);
    }
};

export default function SecretStory({ 
    story, 
    clearedMissions, 
    isCurrentCard = false
}) {
    if (!story) return null;

    const isActuallyUnlocked = clearedMissions >= story.unlockRequirement;

    const [hasViewedAnimation, setHasViewedAnimation] = useState(() => {
        return getViewedAnimations().has(story.id);
    });

    const [shouldAnimate, setShouldAnimate] = useState(false);

    useEffect(() => {
        if (isCurrentCard && isActuallyUnlocked && !hasViewedAnimation) {
            setShouldAnimate(true);
            
            addViewedAnimation(story.id);
            setHasViewedAnimation(true);
            
            const timer = setTimeout(() => {
                setShouldAnimate(false);
            }, 1200); 

            return () => clearTimeout(timer);
        }
    }, [isCurrentCard, isActuallyUnlocked, hasViewedAnimation, story.id]);

    const showLockOverlay = !isActuallyUnlocked || shouldAnimate;
    const applyBlur = !isActuallyUnlocked && !shouldAnimate;

    const backgroundImage = isActuallyUnlocked && story.image ? story.image : SecretStorybg1;

    return (
        <div className="w-[349px] h-[344px] shadow-[0_0_0_1px_rgba(0,0,0,0.05),_0_2px_8px_rgba(0,0,0,0.08)] rounded-xl overflow-hidden relative">
            <div className={`flex flex-col h-full
                 ${applyBlur ? 'blur-[4px]' : ''}
                 ${shouldAnimate ? 'animate-unblur' : ''}`
            }>
                <div className="relative w-full h-[175px]">
                    <img src={backgroundImage} alt={story.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-3 flex-grow bg-[#FFFAFA] -mt-1.5">
                    <div>
                        <h1 className="text-[#2B2B2B] text-xl font-bold mb-1 mt-1">{story.title}</h1>
                        <p 
                            className="text-[#2B2B2BCC] text-sm font-[400] tracking-[-0.3px] leading-[135%]"
                            dangerouslySetInnerHTML={{ __html: story.content }}
                        />
                    </div>
                </div>
            </div>

            {showLockOverlay && (
                <div className={`absolute inset-0 z-10 bg-[#FFFAFA80] flex flex-col items-center justify-center rounded-xl
                     ${shouldAnimate ? 'animate-unlock-fall-fade' : ''}`
                }>
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