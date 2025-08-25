import axios from 'axios';
import api from '../../../api/Authorization';
import Cookies from 'js-cookie';
import imageCompression from 'browser-image-compression'; // 이미지 세탁 라이브러리

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const token = `Bearer ${Cookies.get("accessToken")}`;

// 모바일 환경 감지
function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Canvas를 이용한 이미지 정규화 (메타데이터 완전 제거)
async function normalizeImage(imageFile) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = function() {
      // 적절한 크기로 캔버스 설정
      const maxSize = isMobile() ? 600 : 800;
      let { width, height } = img;
      
      // 비율 유지하면서 크기 조정
      if (width > height) {
        if (width > maxSize) {
          height = (height * maxSize) / width;
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width = (width * maxSize) / height;
          height = maxSize;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // 배경을 흰색으로 설정 (투명도 제거)
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);
      
      // 이미지를 캔버스에 그리기 (모든 메타데이터 제거됨)
      ctx.drawImage(img, 0, 0, width, height);
      
      // Blob으로 변환
      canvas.toBlob((blob) => {
        if (blob) {
          const normalizedFile = new File([blob], 'normalized-image.jpg', {
            type: 'image/jpeg',
            lastModified: Date.now()
          });
          resolve(normalizedFile);
        } else {
          reject(new Error('이미지 정규화 실패'));
        }
      }, 'image/jpeg', 0.8);
    };
    
    img.onerror = () => reject(new Error('이미지 로드 실패'));
    img.src = URL.createObjectURL(imageFile);
  });
}

// --- 개선된 이미지 세탁 함수 ---
async function cleanImage(imageFile) {
  try {
    // 원본 이미지 정보 로깅
    console.log("원본 이미지 정보:", {
      name: imageFile.name,
      size: imageFile.size,
      type: imageFile.type,
      lastModified: imageFile.lastModified,
      isMobile: isMobile()
    });

    // 1단계: Canvas로 메타데이터 완전 제거 및 정규화
    const normalizedImage = await normalizeImage(imageFile);
    
    // 2단계: 환경별 압축 옵션 설정
    let options;
    
    if (isMobile()) {
      // 모바일 환경에서는 더 강한 정규화
      options = {
        maxSizeMB: 5, // 더 작게
        maxWidthOrHeight: 600, // 더 작게
        useWebWorker: true,
        exifOrientation: 1, // 강제로 정상 방향
        fileType: 'image/jpeg',
        initialQuality: 0.7, // 품질 조금 낮춤
        alwaysKeepResolution: false
      };
    } else {
      options = {
        maxSizeMB: 8,
        maxWidthOrHeight: 800,
        useWebWorker: true,
        exifOrientation: 1,
        fileType: 'image/jpeg',
        initialQuality: 0.8,
        alwaysKeepResolution: false
      };
    }

    // 3단계: 최종 압축
    const compressedFile = await imageCompression(normalizedImage, options);
    
    // 처리된 이미지 정보 로깅
    console.log("이미지 세탁 후 파일:", {
      name: compressedFile.name,
      size: compressedFile.size,
      type: compressedFile.type,
      lastModified: compressedFile.lastModified,
      sizeReduction: `${((imageFile.size - compressedFile.size) / imageFile.size * 100).toFixed(1)}%`
    });
    
    return compressedFile;
  } catch (error) {
    console.error("이미지 세탁 실패:", error);
    // 세탁에 실패하면 원본 파일 반환 (최후의 수단)
    console.warn("원본 파일로 fallback 처리");
    return imageFile;
  }
}

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

    return response.data; // 배열을 기대
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

// 개선된 미션 인증
export async function authenticateMission(missionId, imageFile) {
  try {
    console.log(`[미션 인증 시작] missionId: ${missionId}, 환경: ${isMobile() ? 'Mobile' : 'Desktop'}`);
    
    // 이미지 세탁 (정상적인 이미지 형식으로 변환)
    const cleanedImage = await cleanImage(imageFile);

    const formData = new FormData();
    formData.append("imageFile", cleanedImage);

    // Content-Type을 명시하지 않고 브라우저가 자동 설정하도록 함
    const response = await api.post(
      `/missions/authenticate/${missionId}`,
      formData,
      {
        headers: {
          // 'Content-Type': 'multipart/form-data', // 제거 - 브라우저가 자동 설정
        },
        // 타임아웃 설정 (모바일에서 업로드가 느릴 수 있음)
        timeout: 30000, // 30초
      }
    );
    
    console.log('[미션 인증 성공] mission data:', response.data);
    return response.data;
  } catch (error) {
    console.error('[미션 인증 실패]', {
      missionId,
      error: error.response?.data || error.message,
      status: error.response?.status,
      isMobile: isMobile()
    });
    throw error;
  }
}

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