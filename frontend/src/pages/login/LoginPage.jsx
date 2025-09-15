import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signIn, fetchUserInfo } from "./api/LoginAPI";
import loginImg from "../../assets/loginImg.png";
import Logo from "../../component/Logo";
import accountImg from "../../assets/account.svg";
import lockImg from "../../assets/lockImg.svg";

export default function LoginPages({setIsLoggedIn}) {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. 로그인 요청
      const accessToken = await signIn({ username, password });

      if (!accessToken) {
        throw new Error("로그인 실패: 토큰이 없습니다.");
      }

      // 2. 사용자 정보 가져오기
      const userData = await fetchUserInfo();

      console.log("✅ 로그인 성공:", userData);

      // 3. 메인 페이지로 이동
      setIsLoggedIn(true);
      navigate("/");
    } catch (err) {
      console.error("🚨 Login error:", err);
      setError(err.response?.data?.message || "로그인 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[375px] h-[812px] flex min-h-screen bg-gray-100">
      <div className="fixed top-0 left-0 w-full z-30">
        <Logo textColor="black" iconColor="black" />
      </div>
      <div className=" bg-white shadow-sm relative flex items-center justify-center overflow-hidden ">
        <img
          src={loginImg}
          alt="Main Page"
          className="w-full h-full object-cover"
        />
        <div
          className="absolute top-0 left-0 w-full h-full pointer-events-none z-10 backdrop-blur-[20px]"
          style={{ backgroundColor: "#2B2B2B33" }}
        />

        <div className="absolute pt-[460px] top-[101px] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <form
            onSubmit={handleLogin}
            className="flex flex-col mt-24 gap-3 z-50 py-2 text-white w-[241px]"
          >
            <div className="relative w-full">
              <span className="absolute inset-y-0 left-3 flex items-center">
                <img src={accountImg} alt="계정" className="w-5 h-5" />
              </span>
              <input
                type="text"
                placeholder="계정"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="!text-white placeholder-white text-[0.9rem] font-[300] h-[44px] border rounded-full pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-white w-full"
                required
              />
            </div>

            <div className="relative w-full">
              <span className="absolute inset-y-0 left-3 flex items-center">
                <img src={lockImg} alt="비밀번호" className="w-5 h-5" />
              </span>
              <input
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="!text-white placeholder-white text-[0.9rem] font-[300] h-[44px] border rounded-full pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-white w-full"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-[#FFFAFA]/50 text-[#A47764]/70 font-bold h-[44px] mt-8 py-2 border-[#2B2B2B14] rounded-full hover:bg-[#FFFAFA] hover:text-[#A47764] disabled:opacity-50"
            >
              {loading ? "로그인 중..." : "시작하기"}
            </button>

          </form>
          
            {error && <p className="text-[#A47764] text-sm items-center justify-center w-[241px] flex">{error}</p>}
        </div>
      </div>
    </div>
  );
}
