/**
 * 한국 출입국관리사무소 데이터
 * 주요 지역의 출입국관리사무소 위치, 연락처, 운영시간 정보
 */

export interface ImmigrationOffice {
  id: string;
  name: string;
  nameEn: string;
  address: string;
  addressEn: string;
  latitude: number;
  longitude: number;
  phone: string;
  hours: {
    weekday: string; // 평일 운영시간
    saturday: string; // 토요일 운영시간
    sunday: string; // 일요일 운영시간
  };
  closed: string[]; // 휴무일 (예: "일요일", "공휴일")
  note?: string;
}

export const IMMIGRATION_OFFICES: ImmigrationOffice[] = [
  {
    id: "seoul",
    name: "서울출입국관리사무소",
    nameEn: "Seoul Immigration Office",
    address: "서울시 강남구 테헤란로 114 (역삼동)",
    addressEn: "114 Teheran-ro, Gangnam-gu, Seoul",
    latitude: 37.4979,
    longitude: 127.0476,
    phone: "02-3469-3114",
    hours: {
      weekday: "09:00 - 18:00",
      saturday: "09:00 - 13:00",
      sunday: "휴무",
    },
    closed: ["일요일", "공휴일"],
  },
  {
    id: "incheon",
    name: "인천출입국관리사무소",
    nameEn: "Incheon Immigration Office",
    address: "인천시 중구 공항로 272 (신도심)",
    addressEn: "272 Gonghang-ro, Jung-gu, Incheon",
    latitude: 37.4603,
    longitude: 126.4406,
    phone: "032-1345",
    hours: {
      weekday: "09:00 - 18:00",
      saturday: "09:00 - 13:00",
      sunday: "휴무",
    },
    closed: ["일요일", "공휴일"],
  },
  {
    id: "busan",
    name: "부산출입국관리사무소",
    nameEn: "Busan Immigration Office",
    address: "부산시 중구 중앙대로 206 (중앙동)",
    addressEn: "206 Jungangdae-ro, Jung-gu, Busan",
    latitude: 35.0979,
    longitude: 129.0329,
    phone: "051-860-0100",
    hours: {
      weekday: "09:00 - 18:00",
      saturday: "09:00 - 13:00",
      sunday: "휴무",
    },
    closed: ["일요일", "공휴일"],
  },
  {
    id: "daegu",
    name: "대구출입국관리사무소",
    nameEn: "Daegu Immigration Office",
    address: "대구시 중구 동성로 2-1 (동인동)",
    addressEn: "2-1 Dongseong-ro, Jung-gu, Daegu",
    latitude: 35.8714,
    longitude: 128.5948,
    phone: "053-803-3114",
    hours: {
      weekday: "09:00 - 18:00",
      saturday: "09:00 - 13:00",
      sunday: "휴무",
    },
    closed: ["일요일", "공휴일"],
  },
  {
    id: "gwangju",
    name: "광주출입국관리사무소",
    nameEn: "Gwangju Immigration Office",
    address: "광주시 동구 금남로 1-1 (동명동)",
    addressEn: "1-1 Geumnam-ro, Dong-gu, Gwangju",
    latitude: 35.1595,
    longitude: 126.9213,
    phone: "062-360-8114",
    hours: {
      weekday: "09:00 - 18:00",
      saturday: "09:00 - 13:00",
      sunday: "휴무",
    },
    closed: ["일요일", "공휴일"],
  },
  {
    id: "daejeon",
    name: "대전출입국관리사무소",
    nameEn: "Daejeon Immigration Office",
    address: "대전시 중구 중앙로 87 (문화동)",
    addressEn: "87 Jungangno, Jung-gu, Daejeon",
    latitude: 36.3254,
    longitude: 127.4245,
    phone: "042-253-3114",
    hours: {
      weekday: "09:00 - 18:00",
      saturday: "09:00 - 13:00",
      sunday: "휴무",
    },
    closed: ["일요일", "공휴일"],
  },
  {
    id: "ulsan",
    name: "울산출입국관리사무소",
    nameEn: "Ulsan Immigration Office",
    address: "울산시 남구 중앙로 201 (달동)",
    addressEn: "201 Jungangno, Nam-gu, Ulsan",
    latitude: 35.5394,
    longitude: 129.3145,
    phone: "052-960-3114",
    hours: {
      weekday: "09:00 - 18:00",
      saturday: "09:00 - 13:00",
      sunday: "휴무",
    },
    closed: ["일요일", "공휴일"],
  },
  {
    id: "gyeonggi",
    name: "경기출입국관리사무소",
    nameEn: "Gyeonggi Immigration Office",
    address: "수원시 팔달구 권광로 63 (화서동)",
    addressEn: "63 Gwangkwang-ro, Paldal-gu, Suwon",
    latitude: 37.2636,
    longitude: 127.0087,
    phone: "031-290-0114",
    hours: {
      weekday: "09:00 - 18:00",
      saturday: "09:00 - 13:00",
      sunday: "휴무",
    },
    closed: ["일요일", "공휴일"],
  },
  {
    id: "gangwon",
    name: "강원출입국관리사무소",
    nameEn: "Gangwon Immigration Office",
    address: "춘천시 중앙로 1 (중앙동)",
    addressEn: "1 Jungangno, Chuncheon, Gangwon",
    latitude: 37.8809,
    longitude: 127.7305,
    phone: "033-250-0114",
    hours: {
      weekday: "09:00 - 18:00",
      saturday: "09:00 - 13:00",
      sunday: "휴무",
    },
    closed: ["일요일", "공휴일"],
  },
  {
    id: "jeolla",
    name: "전라출입국관리사무소",
    nameEn: "Jeolla Immigration Office",
    address: "전주시 완산구 중앙로 55 (중앙동)",
    addressEn: "55 Jungangno, Wansan-gu, Jeonju",
    latitude: 35.8242,
    longitude: 127.1479,
    phone: "063-280-0114",
    hours: {
      weekday: "09:00 - 18:00",
      saturday: "09:00 - 13:00",
      sunday: "휴무",
    },
    closed: ["일요일", "공휴일"],
  },
  {
    id: "jeju",
    name: "제주출입국관리사무소",
    nameEn: "Jeju Immigration Office",
    address: "제주시 연동 1200-1",
    addressEn: "1200-1 Yeon-dong, Jeju",
    latitude: 33.5086,
    longitude: 126.5225,
    phone: "064-710-0114",
    hours: {
      weekday: "09:00 - 18:00",
      saturday: "09:00 - 13:00",
      sunday: "휴무",
    },
    closed: ["일요일", "공휴일"],
  },
];

/**
 * 두 좌표 사이의 거리 계산 (Haversine 공식)
 * @param lat1 위도 1
 * @param lon1 경도 1
 * @param lat2 위도 2
 * @param lon2 경도 2
 * @returns 거리 (km)
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // 지구 반지름 (km)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * 현재 위치에서 가장 가까운 출입국관리사무소 찾기
 * @param userLat 사용자 위도
 * @param userLon 사용자 경도
 * @returns 가장 가까운 사무소 정보
 */
export function findNearestOffice(
  userLat: number,
  userLon: number
): ImmigrationOffice & { distance: number } {
  let nearest = IMMIGRATION_OFFICES[0];
  let minDistance = calculateDistance(
    userLat,
    userLon,
    nearest.latitude,
    nearest.longitude
  );

  for (let i = 1; i < IMMIGRATION_OFFICES.length; i++) {
    const office = IMMIGRATION_OFFICES[i];
    const distance = calculateDistance(
      userLat,
      userLon,
      office.latitude,
      office.longitude
    );
    if (distance < minDistance) {
      minDistance = distance;
      nearest = office;
    }
  }

  return { ...nearest, distance: minDistance };
}

/**
 * 거리 범위 내의 모든 출입국관리사무소 찾기
 * @param userLat 사용자 위도
 * @param userLon 사용자 경도
 * @param radiusKm 검색 반경 (km)
 * @returns 거리순으로 정렬된 사무소 목록
 */
export function findNearbyOffices(
  userLat: number,
  userLon: number,
  radiusKm: number = 50
): Array<ImmigrationOffice & { distance: number }> {
  const nearby = IMMIGRATION_OFFICES.map((office) => ({
    ...office,
    distance: calculateDistance(userLat, userLon, office.latitude, office.longitude),
  }))
    .filter((office) => office.distance <= radiusKm)
    .sort((a, b) => a.distance - b.distance);

  return nearby;
}
