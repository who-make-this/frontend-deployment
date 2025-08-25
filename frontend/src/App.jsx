import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import Cookies from 'js-cookie';
import "./App.css";

import MainPage from "./pages/main/mainPage";
import MissionPage from "./pages/mission/missionpage";
import MyPage from "./pages/mypage/mypage";
import Secretpage from "./pages/secretstory/secretpage";
import ReportPage from "./pages/reportpage/report";
import ReportEntryPage from "./pages/reportentrypage/reportentrypage";

const LoginFailedScreen = ({ error }) => (
    <div className="flex flex-col items-center justify-center w-full h-full bg-red-100 text-red-700">
        <h1 className="text-2xl font-bold">로그인 실패</h1>
        <p className="mt-2">{error}</p>
    </div>
);


function App() {
    const baseWidth = 375;
    const baseHeight = 812;
    const [scale, setScale] = useState(1);
    const [missionsCompleted, setMissionsCompleted] = useState(0);
    const [isMissionActive, setIsMissionActive] = useState(false);
    

    useEffect(() => {
        const handleResize = () => {
            const scaleX = window.innerWidth / baseWidth;
            const scaleY = window.innerHeight / baseHeight;
            setScale(Math.min(scaleX, scaleY));
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loginError, setLoginError] = useState('');

    useEffect(() => {
        const autoLoginAndFetchUser = async () => {
            const hardcodedUser = {
               "username": "whomadethis",
               "password": "WhoMadeThis!2#"
            }; 
            const baseUrl = import.meta.env.VITE_BACKEND_URL || "";
            const url = `${baseUrl}/users/sign-in`;

            try {
                const response = await axios.post(url, hardcodedUser);
                const { accessToken } = response.data;
                Cookies.set("token", accessToken, { expires: 7 });
                setIsLoggedIn(true);

                // --- 1. 로그인 성공 후, 사용자 정보를 바로 가져옵니다 ---
                const userResponse = await axios.get(`${baseUrl}/users/me`, {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });

                // --- 2. 받아온 데이터로 missionsCompleted 상태를 업데이트합니다 ---
                setMissionsCompleted(userResponse.data.completedMissionCount);

            } catch (error) {
                console.error("🚨 Auto-login error:", error);
                const errorMessage = error.response?.data?.message || "서버에 연결할 수 없습니다.";
                setLoginError(errorMessage);
            }
        };

        autoLoginAndFetchUser();
    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 overflow-hidden font-[pretendard]">
            <div
                style={{
                    transform: `scale(${scale})`,
                    transformOrigin: "top center",
                    width: "375px",
                    height: "812px",
                }}
                className="bg-white shadow-sm flex flex-col"
            >
                {!isLoggedIn && !loginError && <div>Loading...</div> /* Optional: Add a proper loading screen */}
                {loginError && <LoginFailedScreen error={loginError} />}
                {isLoggedIn && (
                    <Router>
                        <div className="flex-1 flex items-center justify-center">
                            <Routes>
                                <Route
                                    path="/"
                                    element={
                                        isMissionActive ? <Navigate to="/mission" replace /> : <MainPage setIsMissionActive={setIsMissionActive} />
                                    }
                                />
                                <Route
                                    path="/mission"
                                    element={
                                        isMissionActive ? (
                                            <MissionPage 
                                                setIsMissionActive={setIsMissionActive} 
                                                setMissionsCompleted={setMissionsCompleted}
                                            />
                                        ) : (
                                            <Navigate to="/" replace />
                                        )
                                    }
                                />
                                <Route path="/reportentry" element={<ReportEntryPage setIsMissionActive={setIsMissionActive} />} />
                                <Route path="/mypage" element={<MyPage />} />
                                <Route 
                                    path="/secret" 
                                    element={<Secretpage/>} 
                                />
                                <Route path="/report" element={<ReportPage />} />
                            </Routes>
                        </div>
                    </Router>
                )}
            </div>
        </div>
    );
}

export default App;