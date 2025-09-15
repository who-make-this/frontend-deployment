import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";

import MainPage from "./pages/main/mainPage";
import MissionPage from "./pages/mission/missionpage";
import MyPage from "./pages/mypage/mypage";
import Secretpage from "./pages/secretstory/secretpage";
import ReportPage from "./pages/reportpage/report";
import ReportEntryPage from "./pages/reportentrypage/reportentrypage";
import LoginPage from "./pages/login/LoginPage";

function App() {
  const baseWidth = 375;
  const baseHeight = 812;
  const [scale, setScale] = useState(1);

  const [missionsCompleted, setMissionsCompleted] = useState(0);
  const [isMissionActive, setIsMissionActive] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 화면 크기 비율 계산
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
        <Router>
          <div className="flex-1 flex items-center justify-center">
            <Routes>
              {/* 메인 */}
              <Route
                path="/"
                element={
                  isLoggedIn ? (
                    isMissionActive ? (
                      <Navigate to="/mission" replace />
                    ) : (
                      <MainPage setIsMissionActive={setIsMissionActive} />
                    )
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              {/* 미션 */}
              <Route
                path="/mission"
                element={
                  isLoggedIn ? (
                    isMissionActive ? (
                      <MissionPage
                        setIsMissionActive={setIsMissionActive}
                        setMissionsCompleted={setMissionsCompleted}
                      />
                    ) : (
                      <Navigate to="/" replace />
                    )
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              {/* 나머지 페이지들 */}
              <Route
                path="/reportentry"
                element={
                  isLoggedIn ? (
                    <ReportEntryPage setIsMissionActive={setIsMissionActive} />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/mypage"
                element={isLoggedIn ? <MyPage /> : <Navigate to="/login" replace />}
              />
              <Route
                path="/secret"
                element={isLoggedIn ? <Secretpage /> : <Navigate to="/login" replace />}
              />
              <Route
                path="/report"
                element={isLoggedIn ? <ReportPage /> : <Navigate to="/login" replace />}
              />

              {/* 로그인 페이지 */}
              <Route
                path="/login"
                element={<LoginPage setIsLoggedIn={setIsLoggedIn} />}
              />
            </Routes>
          </div>
        </Router>
      </div>
    </div>
  );
}

export default App;
