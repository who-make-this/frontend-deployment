import axios from "axios";
import Cookies from "js-cookie";

const baseUrl = import.meta.env.VITE_BACKEND_URL || "";

// ✅ 회원가입
export async function signUp(userData) {
  const response = await axios.post(`${baseUrl}/users/sign-up`, userData);
  return response.data;
}

// ✅ 로그인
export async function signIn(credentials) {
  const response = await axios.post(`${baseUrl}/users/sign-in`, credentials);
  const { accessToken } = response.data;

  // 쿠키에 토큰 저장
  Cookies.set("token", accessToken, { expires: 7 });
  return accessToken;
}

// ✅ 로그아웃
export async function signOut() {
  const token = Cookies.get("token");
  const response = await axios.post(
    `${baseUrl}/users/sign-out`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  Cookies.remove("token");
  return response.data;
}

// ✅ 토큰 재발급
export async function refreshToken() {
  const token = Cookies.get("token");
  const response = await axios.post(
    `${baseUrl}/users/refresh`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  const { accessToken } = response.data;
  Cookies.set("token", accessToken, { expires: 7 });
  return accessToken;
}

// ✅ 내 정보 조회
export async function fetchUserInfo() {
  const token = Cookies.get("token");
  const response = await axios.get(`${baseUrl}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}
