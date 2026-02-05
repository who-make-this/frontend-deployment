import axios from "axios";
import Cookies from "js-cookie";

const baseUrl = import.meta.env.VITE_BACKEND_URL || "";

// 🚀 1. 전역 axios 인스턴스 생성
export const api = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🚀 2. 요청 Interceptor 설정: 모든 요청 전에 쿠키에서 토큰을 가져와 헤더에 추가
api.interceptors.request.use(
  async (config) => {
    const token = Cookies.get("token");

    if (!token) {
        try {
          token = await signIn({ 
            id: "whomadethis", 
            password: "WhoMadeThis!2#" 
          });
        } catch (error) {
          console.error("자동 로그인 실패 (아이디/비번 확인 필요):", error);
        }
      }

    if (token) {
      // 💡 토큰이 있다면 요청 헤더에 자동으로 추가
      config.headers.Authorization = `Bearer ${token}`;
    }
    return (
    <AuthContext.Provider value={{ user, loading, login: signIn, logout: signOut }}>
      {!loading && children}
    </AuthContext.Provider>
  );
  },
  (error) => {
    return Promise.reject(error);
  }
);


// ✅ 회원가입
export async function signUp(userData) {
  const response = await api.post("/users/sign-up", userData);
  return response.data;
}

// ✅ 로그인
export async function signIn(credentials) {
  const response = await api.post("/users/sign-in", credentials);
  const { accessToken } = response.data;

  // 쿠키에 토큰 저장
  Cookies.set("token", accessToken, { expires: 7 });
  return accessToken;
}

// ✅ 로그아웃
export async function signOut() {
  const response = await api.post("/users/sign-out", {});

  Cookies.remove("token"); // 로그아웃 시 쿠키에서 토큰 제거
  return response.data;
}

// ✅ 내 정보 조회
export async function fetchUserInfo() {
  const response = await api.get("/users/me");
  return response.data;
}