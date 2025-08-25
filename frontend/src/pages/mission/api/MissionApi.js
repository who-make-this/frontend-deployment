import axios from 'axios';
import api from '../../../api/Authorization';
import Cookies from 'js-cookie';
import imageCompression from 'browser-image-compression';

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const token = `Bearer ${Cookies.get("accessToken")}`;

// 이미지를 Canvas로 완전히 정리하는 헬퍼 함수
async function cleanImageWithCanvas(file) {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // 최대 해상도 제한
      const maxWidth = 1920;
      const maxHeight = 1920;
      let { width, height } = img;
      
      // 비율 유지하면서 크기 조정
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // 이미지를 캔버스에 그리기 (메타데이터 제거됨)
      ctx.drawImage(img, 0, 0, width, height);
      
      // JPEG로 변환 (메타데이터 완전 제거)
      canvas.toBlob(
        (blob) => {
          const cleanFile = new File([blob], `cleaned_${Date.now()}.jpg`, {
            type: 'image/jpeg',
            lastModified: Date.now()
          });
          resolve(cleanFile);
        },
        'image/jpeg',
        0.85 // 품질 85%
      );
    };
    
    img.src = URL.createObjectURL(file);
  });
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

// 미션 인증 (이미지 압축, 방향 보정, 메타데이터 정리)
export async function authenticateMission(missionId, imageFile) {
  // 이미지 압축 및 처리 옵션 설정
  const options = {
    maxSizeMB: 3,                    // 최대 3MB로 제한
    maxWidthOrHeight: 1920,          // 최대 해상도 제한
    useWebWorker: true,
    fileType: 'image/jpeg',          // 강제로 JPEG 형식으로 변환
    initialQuality: 0.8,             // 초기 품질 설정
    alwaysKeepResolution: false,     // 해상도 조정 허용
    exifOrientation: 1,              // EXIF 방향 정보 초기화
  };

  try {
    console.log(`처리 전 원본 이미지:`, {
      name: imageFile.name,
      size: `${(imageFile.size / 1024 / 1024).toFixed(2)} MB`,
      type: imageFile.type
    });

    // 파일 타입 검증
    if (!imageFile.type.startsWith('image/')) {
      throw new Error('이미지 파일만 업로드 가능합니다.');
    }

    let processedImageFile;

    // 큰 이미지이거나 메타데이터 문제가 있을 수 있는 경우 Canvas 사용
    if (imageFile.size > 10 * 1024 * 1024) { // 10MB 이상이면 Canvas 사용
      console.log('큰 이미지 감지, Canvas로 정리 중...');
      processedImageFile = await cleanImageWithCanvas(imageFile);
    } else {
      // imageCompression 라이브러리 사용
      processedImageFile = await imageCompression(imageFile, options);
    }
    
    console.log(`처리 후 이미지:`, {
      name: processedImageFile.name,
      size: `${(processedImageFile.size / 1024 / 1024).toFixed(2)} MB`,
      type: processedImageFile.type
    });

    // FormData 생성
    const formData = new FormData();
    const cleanFileName = `mission_${missionId}_${Date.now()}.jpg`;
    formData.append("imageFile", processedImageFile, cleanFileName);

    const response = await api.post(
      `/missions/authenticate/${missionId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, // 30초 타임아웃
      }
    );
    
    console.log('[미션 인증] mission data:', response.data);
    return response.data;
    
  } catch (error) {
    console.error('미션 인증 실패:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    // 구체적인 에러 메시지 제공
    if (error.response?.status === 413) {
      throw new Error('이미지 파일이 너무 큽니다. 더 작은 이미지를 선택해주세요.');
    } else if (error.response?.status === 415) {
      throw new Error('지원되지 않는 이미지 형식입니다.');
    } else if (error.message.includes('timeout')) {
      throw new Error('업로드 시간이 초과되었습니다. 다시 시도해주세요.');
    }
    
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