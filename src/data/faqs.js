// FAQ 데이터
export const FAQS = [
  {
    id: 1,
    question: '프로그램 설치 시 필요한 시스템 요구사항은 무엇인가요?',
    answer: 'Windows 10 이상의 운영체제, 최소 4GB RAM, 500MB 이상의 여유 디스크 공간이 필요합니다. 인터넷 연결이 필요하며, .NET Framework 4.8 이상이 설치되어 있어야 합니다.',
    category: '기술지원',
    order: 1
  },
  {
    id: 2,
    question: '라이선스는 어떻게 구매하나요?',
    answer: '고객센터(1234-5678)로 문의주시거나 홈페이지 문의 게시판을 통해 견적을 요청하실 수 있습니다. 담당자가 신속하게 연락드립니다.',
    category: '구매문의',
    order: 2
  },
  {
    id: 3,
    question: '무료 체험판이 있나요?',
    answer: '네, 30일 무료 체험판을 제공하고 있습니다. 다운로드 페이지에서 체험판을 다운로드 받으실 수 있으며, 모든 기능을 제한 없이 사용하실 수 있습니다.',
    category: '일반',
    order: 3
  },
  {
    id: 4,
    question: '데이터 백업은 어떻게 하나요?',
    answer: '프로그램 설정 메뉴에서 "데이터 백업" 기능을 선택하시면 됩니다. 자동 백업 기능을 설정하시면 매일 지정된 시간에 자동으로 백업이 진행됩니다.',
    category: '기술지원',
    order: 4
  },
  {
    id: 5,
    question: '여러 대의 컴퓨터에서 사용할 수 있나요?',
    answer: '구매하신 라이선스 수만큼 설치 및 사용이 가능합니다. 네트워크 라이선스를 구매하시면 사내 네트워크에서 여러 사용자가 동시에 접속하여 사용할 수 있습니다.',
    category: '구매문의',
    order: 5
  },
  {
    id: 6,
    question: '기술 지원은 어떻게 받을 수 있나요?',
    answer: '전화(1234-5678), 이메일(support@mmsoft.co.kr), 카카오톡 상담을 통해 기술 지원을 받으실 수 있습니다. 평일 오전 9시부터 오후 6시까지 운영됩니다.',
    category: '일반',
    order: 6
  },
  {
    id: 7,
    question: '프로그램 업데이트는 유료인가요?',
    answer: '마이너 업데이트(버그 수정, 소규모 개선)는 무료로 제공됩니다. 메이저 업데이트(주요 기능 추가)는 별도의 업그레이드 비용이 발생할 수 있습니다.',
    category: '구매문의',
    order: 7
  },
  {
    id: 8,
    question: '맥(Mac)에서도 사용할 수 있나요?',
    answer: '현재는 Windows 전용 프로그램입니다. Mac에서는 가상머신(Parallels, VMware 등)을 통해 Windows를 설치하여 사용하실 수 있습니다.',
    category: '기술지원',
    order: 8
  },
  {
    id: 9,
    question: '환불 정책은 어떻게 되나요?',
    answer: '구매 후 7일 이내에 제품에 만족하지 않으실 경우 전액 환불이 가능합니다. 단, 라이선스 키를 등록하지 않은 경우에 한합니다.',
    category: '구매문의',
    order: 9
  },
  {
    id: 10,
    question: '직원 교육 프로그램이 있나요?',
    answer: '네, 온라인 및 오프라인 교육 프로그램을 제공하고 있습니다. 도입 시 무료 초기 교육이 포함되며, 추가 교육은 별도 문의 바랍니다.',
    category: '일반',
    order: 10
  }
];

// FAQ 카테고리
export const FAQ_CATEGORIES = [
  { id: 'all', label: '전체', value: 'all' },
  { id: 'general', label: '일반', value: '일반' },
  { id: 'technical', label: '기술지원', value: '기술지원' },
  { id: 'purchase', label: '구매문의', value: '구매문의' }
];
