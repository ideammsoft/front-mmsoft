import { FaEye, FaBullseye } from 'react-icons/fa';
import styles from './CompanyPage.module.css';

function CompanyPage() {
  const historyItems = [
    { year: '2026', items: ['노임관리 시스템 출시 — 건설현장 노임관리 시스템을 시작으로 각종 노임관리에 맞춤형으로 진행중. 모던 스타일의 신개념 디자인',
'manTax 출시 - 세금계산서 일괄등록 파일생성. 기초자료 홈텍스에서 내려받기',
'manDjb 출시 - 모던스타일의 무료 장부프로그램, 유료 Djb프로'
] },
    { year: '2025', items: ['엑셀 문서 작업을 소프트웨어로 전환. 주문제작 시스템 출시 — 기존 엑셀 수식 등 다양한 양식으로 업무에 사용하던 시스템을 소프트웨어로 전환하는 기술 보유'] },
    { year: '2024', items: ['인공지능 시스템 도입 시작 — AI를 머신러닝 활용하여 회사 업무에 적용하는 시스템 개발'] },
    { year: '2023', items: ['다양한 업종의 고객사 확보 — 누적 고객사 4,000 업체 달성'] },
    { year: '2022', items: ['주문제작 소프트웨어 활성화 — 주문제작 소프트웨어 300업체 납품 달성'] },
    { year: '2021', items: ['세무법인 이화 지로시스템'] },
    { year: '2020', items: ['경인도시가스검사 지로시스템'] },
    { year: '2019', items: ['한국자치개발전연구원 지로시스템'] },
    { year: '2018', items: ['금융결제원 지로 소프트웨어 적격업체 선정','노임대장 프로그램(엑셀 VBA) 개발'] },
    { year: '2017', items: ['소방방재신문사 지로시스템 리뉴얼', '배달프로그램 Windows용 개발 (팝업/알림/영수증프린터출력 — 가게·주방·배달용)'] },
    { year: '2016', items: ['장기보험 자료업데이트 시스템(Kings)', '공판장 경매관리 시스템'] },
    { year: '2015', items: ['엠엠소프트로 상호 변경', 'MmCRM 고객관리 프로그램(웹&모바일) 시스템 오픈', '노인장기요양보험 본인분담금전용 지로시스템 개발'] },
    { year: '2014', items: ['고려대학교 경영대학교우회 교우회 관리시스템', '한국주유소협회 관리프로그램', '연세대학교의과대학 내과총동우회 교우회 관리시스템', '시즐러 관리프로그램'] },
    { year: '2013', items: ['한국외식업중앙회 운영시스템', '사단법인 KBS사우회 관리시스템', '인천평화의료생활협동조합 조합원관리시스템', '사단법인 현대미술협회 회원관리', '한국토지주택공사 아산사업본부 지로발행 시스템'] },
    { year: '2012', items: ['한국추출가공협회 운영시스템', '서울투어버스 운행관리', '한국도로학회 회원관리'] },
    { year: '2011', items: ['한국도로교통협회 운영시스템', '한국국악협회, 한국무용협회 운영시스템', '사단법인 헤이리(파주) 회원관리'] },
    { year: '2010', items: ['한국도로학회 회원관리프로그램 납품', '흙표흙침대 서버용 운영시스템', '미술세계 회원관리'] },
    { year: '2009', items: ['한국체력향상협회 회원관리', '대한민국재향경우회 회원관리프로그램 납품', '대구상공회의소 운영시스템'] },
    { year: '2008', items: ['우성자동문 관리시스템', '대한민국재향경우회 회원관리프로그램 납품', '충주신문 운영시스템'] },
    { year: '2007', items: ['경기 고양시 일산으로 이전'] },
    { year: '2005', items: ['서울 광화문으로 이전', '(주)여러사람소프트로 변경'] },
    { year: '2002', items: ['인스나라 사이트 오픈'] },
    { year: '2001', items: ['MBC라디오 프로그램(별이빛나는밤에) 협찬 및 방송'] },
    { year: '1999', items: ['월간 PC Line 기사로 소개/CD배포', '99 지방행정 정보화 연찬회 전시용 우수소프트웨어로 추천', '여러사람소프트 홈페이지 오픈'] },
    { year: '1998', items: ['월간 HOW PC에 기사로 소개/CD배포', '국가행정소프트웨어로 추천'] },
    { year: '1997', items: ['여러사람소프트 설립', '전자신문 우수소프트웨어 기사로 소개'] },
  ];

  return (
    <div>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <h1 className={styles.heroTitle}>회사소개</h1>
          <p className={styles.heroSubtitle}>엠엠소프트를 소개합니다</p>
        </div>
      </section>

      {/* Intro */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>엠엠소프트를 소개합니다</h2>
          <div className={styles.introText}>
            <p>
              엠엠소프트는 1997년 설립 이래 기업 및 기관의 효율적인 업무 관리를 위한
              최적의 솔루션을 제공해 왔습니다.
            </p>
            <p>
              1997년 <strong>여러사람소프트</strong>로 시작해 2005년{' '}
              <strong>(주)여러사람소프트</strong>를 거쳐, 2015년부터는{' '}
              <strong>엠엠소프트(MMSoft)</strong>가 그 사업을 이어받아 운영하고 있습니다.
              이름은 바뀌었지만 하던 일은 그대로이며, 여러사람소프트 시절부터
              사용해 오신 고객사의 제품 지원과 문의도 변함없이 받고 있습니다.
            </p>
            <p>
              고객관리, 지로관리, 시설관리 등 다양한 분야의 소프트웨어 솔루션을 통해
              고객사의 업무 효율성을 극대화하고 있습니다.
            </p>
            <p>
              최근 화두가 되고 있는 AI 솔루션 도입 및 기술지원 등 다양하게 사업영역을
              확장하고 있습니다.
            </p>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className={styles.section} style={{ backgroundColor: 'var(--color-background-light)' }}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>비전 & 미션</h2>
          <div className={styles.cardGrid}>
            <div className={styles.card}>
              <div className={styles.cardIcon}>
                <FaEye />
              </div>
              <h3 className={styles.cardTitle}>비전</h3>
              <p className={styles.cardText}>
                대한민국 대표 비즈니스 솔루션 전문 기업
              </p>
            </div>
            <div className={styles.card}>
              <div className={styles.cardIcon}>
                <FaBullseye />
              </div>
              <h3 className={styles.cardTitle}>미션</h3>
              <p className={styles.cardText}>
                혁신적인 기술과 최상의 서비스로 고객의 성공을 지원
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>연혁</h2>
          <div className={styles.timeline}>
            {historyItems.map((item, index) => (
              <div key={index} className={styles.timelineItem}>
                <div className={styles.timelineDot} />
                <div className={styles.timelineYear}>{item.year}</div>
                <div className={styles.timelineContent}>
                  {item.items.map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default CompanyPage;
