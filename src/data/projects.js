// 프로젝트/포트폴리오 데이터
export const PROJECTS = [
  {
    id: 1,
    title: 'A기업 고객관리 시스템 구축',
    client: 'A기업',
    description: '제조업 고객관리 시스템 구축 및 기존 데이터 마이그레이션',
    completedAt: '2026-01',
    category: '주문제작',
    image: '/images/projects/project1.png'
  },
  {
    id: 2,
    title: 'B병원 인사관리 솔루션 도입',
    client: 'B병원',
    description: '병원 직원 근태 및 급여 관리 시스템 도입',
    completedAt: '2025-12',
    category: '주문제작',
    image: '/images/projects/project2.png'
  },
  {
    id: 3,
    title: 'C스포츠센터 회원관리 시스템',
    client: 'C스포츠센터',
    description: '체육관 회원 및 수강 관리 시스템 구축',
    completedAt: '2025-11',
    category: '기타',
    image: '/images/projects/project3.png'
  },
  {
    id: 4,
    title: 'D보험사 고객관리 시스템',
    client: 'D보험사',
    description: '보험 고객 정보 통합 관리 솔루션',
    completedAt: '2025-10',
    category: '주문제작',
    image: '/images/projects/project4.png'
  },
  {
    id: 5,
    title: 'E대학교 시설물 관리',
    client: 'E대학교',
    description: '캠퍼스 시설물 통합 관리 시스템',
    completedAt: '2025-09',
    category: '기타',
    image: '/images/projects/project5.png'
  },
  {
    id: 6,
    title: 'F기업 인사 솔루션 업그레이드',
    client: 'F기업',
    description: '기존 인사 시스템 업그레이드 및 기능 확장',
    completedAt: '2025-08',
    category: 'Util',
    image: '/images/projects/project6.png'
  }
];

// 프로젝트 카테고리
export const PROJECT_CATEGORIES = [
  { id: 'all', label: '전체', value: 'all' },
  { id: 'custom', label: '주문제작', value: '주문제작' },
  { id: 'util', label: 'Util', value: 'Util' },
  { id: 'etc', label: '기타', value: '기타' }
];
