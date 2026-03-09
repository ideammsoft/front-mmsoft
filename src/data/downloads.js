// 다운로드 항목 데이터
export const DOWNLOADS = [
  {
    id: 1,
    title: '고객관리 프로그램 설치파일',
    description: 'Windows 10/11 호환 설치 패키지',
    category: 'software',
    fileSize: '45.8MB',
    version: '2.0.1',
    uploadedAt: '2026-02-12',
    fileUrl: '#',
    fileName: 'customer-mgmt-setup-v2.0.1.exe'
  },
  {
    id: 2,
    title: '인사관리 시스템 설치파일',
    description: 'Windows 10/11 호환 설치 패키지',
    category: 'software',
    fileSize: '38.2MB',
    version: '1.5.2',
    uploadedAt: '2026-01-25',
    fileUrl: '#',
    fileName: 'hr-mgmt-setup-v1.5.2.exe'
  },
  {
    id: 3,
    title: '재고관리 시스템 설치파일',
    description: 'Windows 10/11 호환 설치 패키지',
    category: 'software',
    fileSize: '32.5MB',
    version: '1.2.0',
    uploadedAt: '2026-01-10',
    fileUrl: '#',
    fileName: 'inventory-mgmt-setup-v1.2.0.exe'
  },
  {
    id: 4,
    title: '고객관리 사용자 매뉴얼',
    description: '고객관리 프로그램 사용 가이드 (v2.0)',
    category: 'manual',
    fileSize: '2.5MB',
    version: '2.0',
    uploadedAt: '2026-02-10',
    fileUrl: '#',
    fileName: 'customer-mgmt-manual-v2.0.pdf'
  },
  {
    id: 5,
    title: '인사관리 사용자 매뉴얼',
    description: '인사관리 시스템 사용 가이드 (v1.5)',
    category: 'manual',
    fileSize: '3.1MB',
    version: '1.5',
    uploadedAt: '2026-01-20',
    fileUrl: '#',
    fileName: 'hr-mgmt-manual-v1.5.pdf'
  },
  {
    id: 6,
    title: '데이터 마이그레이션 가이드',
    description: '기존 데이터 이전 방법 안내',
    category: 'manual',
    fileSize: '2.1MB',
    version: '1.0',
    uploadedAt: '2025-12-20',
    fileUrl: '#',
    fileName: 'migration-guide.pdf'
  },
  {
    id: 7,
    title: 'API 레퍼런스 문서',
    description: '개발자를 위한 API 연동 가이드',
    category: 'manual',
    fileSize: '4.5MB',
    version: '1.0',
    uploadedAt: '2026-01-05',
    fileUrl: '#',
    fileName: 'api-reference.pdf'
  },
  {
    id: 8,
    title: '데이터 백업 도구',
    description: '고객 데이터 자동 백업 유틸리티',
    category: 'utility',
    fileSize: '5.3MB',
    version: '1.1.0',
    uploadedAt: '2026-02-05',
    fileUrl: '#',
    fileName: 'backup-tool-v1.1.0.exe'
  },
  {
    id: 9,
    title: 'Excel 데이터 변환 유틸리티',
    description: 'Excel/CSV 데이터 일괄 변환 및 가져오기 도구',
    category: 'utility',
    fileSize: '8.7MB',
    version: '2.0.0',
    uploadedAt: '2026-01-18',
    fileUrl: '#',
    fileName: 'data-converter-v2.0.0.exe'
  },
  {
    id: 10,
    title: '도입 제안서 양식',
    description: '기업 도입을 위한 제안서 템플릿 (Word)',
    category: 'utility',
    fileSize: '1.2MB',
    version: '1.0',
    uploadedAt: '2026-01-10',
    fileUrl: '#',
    fileName: 'proposal-template.docx'
  }
];

// 카테고리 목록
export const DOWNLOAD_CATEGORIES = [
  { id: 'all',      label: '전체',      value: 'all' },
  { id: 'software', label: '소프트웨어', value: 'software' },
  { id: 'manual',   label: '메뉴얼',    value: 'manual' },
  { id: 'utility',  label: '유틸리티',  value: 'utility' }
];
