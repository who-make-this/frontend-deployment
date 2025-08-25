import axios from 'axios';
import api from '../../../api/Authorization';
import Cookies from 'js-cookie';
import imageCompression from 'browser-image-compression';
const backendUrl = import.meta.env.VITE_BACKEND_URL;

// 미션 시작
export async function createMission(marketId) {
  try {
    const response = await api.post(`/missions/start?marketId=${marketId}`);
    console.log('[미션 시작] mission data:', response.data);
    return response.data;
  } catch (error) {
    console.error('미션 생성 실패:', error.response?.data || error.message);
    throw error;
  }
}

// 완료된 이미지 조회
export async function getCompletedImages() {
  try {
    const token = Cookies.get("token");
    if (!token) throw new Error("로그인이 필요합니다.");

    const response = await axios.get(`${backendUrl}/reports/completed-images`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("완료 이미지 불러오기 실패:", error.response?.data || error.message);
    throw error;
  }
}


// 미션 종료 (탐험 종료)
export async function endMission(marketId) {
  try {
    const response = await api.post(`/missions/end?marketId=${marketId}`);
    console.log('[탐험 종료] result:', response.data);
    return response.data;
  } catch (error) {
    console.error('탐험 종료 실패:', error.response?.data || error.message);
    throw error;
  }
}

// --- ⬇️ 이 부분을 수정했습니다 ⬇️ ---
// 미션 인증 (이미지 압축 및 방향 보정 기능 추가)
export async function authenticateMission(missionId, imageFile) {
  // 2. 이미지 압축 및 방향 보정 옵션 설정
  const options = {
    maxSizeMB: 5,           // 이미지를 최대 5MB로 압축
    maxWidthOrHeight: 1920,   // 이미지의 최대 너비/높이를 1920px로 조절
    useWebWorker: true,
  };

  try {
    console.log(`처리 전 원본 이미지 용량: ${(imageFile.size / 1024 / 1024).toFixed(2)} MB`);

    // 3. 라이브러리를 사용해 이미지 처리 (압축 및 방향 보정)
    const processedImageFile = await imageCompression(imageFile, options);
    
    console.log(`처리 후 이미지 용량: ${(processedImageFile.size / 1024 / 1024).toFixed(2)} MB`);

    const formData = new FormData();
    // 4. 처리된 이미지 파일을 FormData에 추가
    formData.append("imageFile", processedImageFile);

    const response = await api.post(
      `/missions/authenticate/${missionId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    console.log('[미션 인증] mission data:', response.data);
    return response.data;
  } catch (error) {
    console.error('미션 인증 실패:', error.response?.data || error.message);
    throw error;
  }
}
// --- ⬆️ 여기까지 수정되었습니다 ⬆️ ---

// 랜덤 미션 가져오기 (새로고침)
export async function getRandomMission(marketId) {
  try {
    const response = await api.post(`/missions/refresh?marketId=${marketId}`);
    console.log('[랜덤 미션] mission data:', response.data);
    return response.data;
  } catch (error) {
    console.error('랜덤 미션 불러오기 실패:', error.response?.data || error.message);
    throw error;
  }
}

// 완료된 미션 가져오기 (카테고리별)
export async function getCompletedMissions(category) {
  try {
    const response = await api.get(`/missions/completed/${category}`);
    console.log('[완료된 미션] missions:', response.data);
    return response.data;
  } catch (error) {
    console.error('완료된 미션 불러오기 실패:', error.response?.data || error.message);
    throw error;
  }
}

// 유저 프로필 가져오기
export async function getUserProfile() {
  try {
    const response = await api.get(`/missions/profile`);
    console.log('[유저 프로필] data:', response.data);
    return response.data;
  } catch (error) {
    console.error('유저 프로필 불러오기 실패:', error.response?.data || error.message);
    throw error;
  }
}
