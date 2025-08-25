import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';

import Logo from "../../component/Logo";
import SecretPageImg from "../../assets/secretbgimg.svg";
import MissionProgress from '../../component/missionProgress';
import SecretStory from '../../component/secretStory';
import CustomPagination from '../../component/CustomPagination';
import loading from "../../assets/loading.svg";

const LoadingScreen = () => (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/70">
        <img
            src={loading}
            alt="인증 중 로딩"
            className="w-16 h-16 animate-spin mb-4"
        />
        <div className="text-white text-xl font-normal">
            시장의 비밀이야기 불러 오는 중...
        </div>
    </div>
);

const ErrorScreen = ({ message }) => (
    <div className="flex items-center justify-center h-full">
        <p className="text-white bg-red-500/50 p-4 rounded-lg">{message}</p>
    </div>
);

export default function Secretpage() {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [missionsCompleted, setMissionsCompleted] = useState(0);
    
    const [swiperInstance, setSwiperInstance] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const token = Cookies.get('token');
                if (!token) throw new Error("로그인이 필요합니다.");

                const baseUrl = import.meta.env.VITE_BACKEND_URL || "";

                const userPromise = axios.get(`${baseUrl}/users/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const lorePromise = axios.get(`${baseUrl}/lore/1`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const [userResponse, loreResponse] = await Promise.all([userPromise, lorePromise]);

                setMissionsCompleted(userResponse.data.completedMissionCount);

                const transformedData = loreResponse.data.map((storyFromApi, index) => ({
                    id: index + 1,
                    unlockRequirement: storyFromApi.requiredMissionCount,
                    title: storyFromApi.data ? storyFromApi.data.title : "???",
                    content: storyFromApi.data ? storyFromApi.data.content : "아직 잠겨있는 이야기입니다.",
                    image: storyFromApi.data ? storyFromApi.data.imageUrl : null,
                }));
                setStories(transformedData);

            } catch (err) {
                console.error("🚨 데이터 조회 실패:", err);
                setError("데이터를 불러오는 데 실패했습니다.");
                setStories([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const loopedStories = stories.length > 0 ? [...stories, stories[0]] : [];
    
    const handleSlideChange = (swiper) => {
        if (isAnimating) return;
        if (swiper.activeIndex === stories.length) {
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
                    {loading ? <LoadingScreen /> : error ? <ErrorScreen message={error} /> : stories.length > 0 ? (
                        <>
                            <Swiper
                                effect={'fade'}
                                fadeEffect={{ crossFade: true }}
                                grabCursor={true}
                                modules={[EffectFade]}
                                className="w-[349px] h-[344px]"
                                onSwiper={setSwiperInstance}
                                onSlideChange={handleSlideChange}
                            >
                                {loopedStories.map((story, index) => {
                                    const storyIndex = index >= stories.length ? 0 : index;
                                    const isCurrentCard = activeIndex === storyIndex;
                                    
                                    return (
                                        <SwiperSlide key={`${story.id}-${index}`}>
                                            <div className="flex justify-center items-center">
                                                <SecretStory
                                                    story={story}
                                                    clearedMissions={missionsCompleted}
                                                    isCurrentCard={isCurrentCard}
                                                />
                                            </div>
                                        </SwiperSlide>
                                    );
                                })}
                            </Swiper>

                            <CustomPagination 
                                totalSlides={stories.length} 
                                activeIndex={activeIndex} 
                            />
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-[344px]">
                            <p className="text-white bg-black/30 p-4 rounded-lg">
                                아직 등록된 비밀 이야기가 없어요.
                            </p>
                        </div>
                    )}
                </div> 
            </div>
        </div>
    );
}