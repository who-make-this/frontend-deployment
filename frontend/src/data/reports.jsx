// src/data/reports.js

export const reportsData = [
  {
    id: 1,
    marketName: "구미중앙시장",
    date: "2025/08/12",
    timeRange: "12:01 - 18:11",
    mainType: "먹보형",
    scores: { sensitivity: 5, foodie: 12, adventure: 1 },
    results: { totalScore: 18, mileage: "1,800M", thisMonthTotal: "3,200M" },
    status: "성공",
    diary: {
      explorationDate: "2025-08-12",
      journalContent: "제목: 맛있는 걸 먹으러가자\n내용:\n해가 쨍쨍했지만, 골목 그늘 속은 시원했다. 첫 미션인 '시장에 피어난...'을 찾아다녔다. 밥을 먹고 가서 그런지 미션을 많이 진행했다. 찜닭으로 메뉴를 추천해주니 편했다. 온종일 걸었더니 다리가 아프다.."
    }
  },
  {
    id: 2,
    marketName: "선산종합시장",
    date: "2025/07/28",
    timeRange: "15:30 - 19:00",
    mainType: "감성형",
    scores: { sensitivity: 15, foodie: 2, adventure: 3 },
    results: { totalScore: 20, mileage: "2,000M", thisMonthTotal: "3,200M" },
    status: "성공",
    diary: {
      explorationDate: "2025-07-28",
      journalContent: "제목: 심쿵! 고양이 미션\n내용:\n2025년 7월 28일. 날씨는 미지수지만, 마음은 훈훈했다.\n시장에서 귀여운 고양이를 만났다. '열일하다 쉬는 냥' 문구가 짠하게 다가왔다.\n감성형 미션, 역시 마음으로 통했다.\n사랑스러운 고양이와 함께, 짧지만 꽉 찬 하루였다!"
    }
  },
  {
    id: 3,
    marketName: "마산종합시장",
    date: "2025/07/23",
    timeRange: "15:30 - 19:00",
    mainType: "모험형",
    scores: { sensitivity: 12, foodie: 2, adventure: 3 },
    results: { totalScore: 30, mileage: "2,000M", thisMonthTotal: "3,200M" },
    status: "성공",
    diary: {
      explorationDate: "2025-07-23",
       journalContent: "제목: 시장 체크!!!\n내용:\n2025년 7월 28일.  입추라더니 선선한 게 딱 좋은 기온이었다.기역(ㄱ)이 들어가는 가게는 많았는데 시작하는 가게는 잘 없어서 애를 먹었다.그래도 시장을 샅샅이 돌아다니는 게 평소에는 보지 못한 걸 발견할 수도 있어서 참 즐거웠다.그리 오래 머물지는 않았지만 특별한 경험을 만들 수 있어 좋았다...!"
    }
  },
];