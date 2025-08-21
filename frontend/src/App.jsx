import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import MainPage from "./pages/main/mainPage";
import MissionPage from "./pages/mission/missionpage";
import MyPage from "./pages/mypage/mypage";
import Secretpage from "./pages/secretstory/secretpage";
import ReportPage from "./pages/reportpage/report";

function App() {
  const baseWidth = 375;
  const baseHeight = 812;
  const [scale, setScale] = useState(1);

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
              <Route path="/" element={<MainPage />} />
              <Route path="/mission" element={<MissionPage />} />
              <Route path="/mypage" element={<MyPage />} />
              <Route path="/secret" element={<Secretpage />} />
              <Route path="/report" element={<ReportPage />} />
            </Routes>
          </div>
        </Router>
      </div>
    </div>
  );
}

export default App;
