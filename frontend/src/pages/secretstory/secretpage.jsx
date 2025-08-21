import React, { useState } from 'react';
import Logo from "../../component/Logo";
import SecretPageImg from "../../assets/secretbgimg.svg";
import MissionProgress from '../../component/missionProgress';
import SecretStory from '../../component/secretStory';
import { secretStories } from '../../data/stories';
import CustomPagination from '../../component/CustomPagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-fade';

export default function Secretpage() {
    const missionsCompleted = 10;

    const sortedStories = [...secretStories].sort((a, b) => a.unlockRequirement - b.unlockRequirement);
    const loopedStories = [...sortedStories, sortedStories[0]];
    
    const [swiperInstance, setSwiperInstance] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);
    
    const [isAnimating, setIsAnimating] = useState(false);

    const handleSlideChange = (swiper) => {
        if (isAnimating) return;

        if (swiper.activeIndex === sortedStories.length) {
            setIsAnimating(true); 
            setTimeout(() => {
                if (swiperInstance) {
                    swiperInstance.slideTo(0, 0);
                    setActiveIndex(0);
                    setIsAnimating(false); 
                }
            }, 100); 
            return;
        }

        setActiveIndex(swiper.realIndex);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-[375px] h-[812px] bg-white shadow-sm relative overflow-hidden">
                <img src={SecretPageImg} alt="Secretstory Page" className="absolute top-0 left-0 w-full h-full object-cover" />
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0" style={{ backgroundColor: "#2B2B2B4D" }} />
                
                <div className="absolute top-0 left-0 w-full z-20">
                    <Logo />
                    <div className="px-4 pt-2 mt-25 flex justify-center">
                        <MissionProgress clearedMissions={missionsCompleted} />
                    </div>
                </div>
           
                <div className="absolute top-[255px] w-full h-auto z-30 flex flex-col items-center gap-6">
                    <Swiper
                        effect={'fade'}
                        fadeEffect={{ crossFade: true }}
                        grabCursor={true}
                        modules={[EffectFade]}
                        className="w-[349px] h-[344px]"
                        onSwiper={setSwiperInstance}
                        onSlideChange={handleSlideChange}
                    >
                        {loopedStories.map((story, index) => (
                            <SwiperSlide key={`${story.id}-${index}`}>
                                <div className="flex justify-center items-center">
                                    <SecretStory
                                        storyId={story.id}
                                        clearedMissions={missionsCompleted}
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    <CustomPagination 
                        totalSlides={sortedStories.length} 
                        activeIndex={activeIndex} 
                    />
                </div> 
            </div>
        </div>
    );
}