import { FaEye, FaBullseye } from 'react-icons/fa';
import styles from './CompanyPage.module.css';

function CompanyPage() {
  const historyItems = [
    { year: '2026', content: '노임관리 시스템 출시 — 서울시 관공서 노임관리 시스템을 시작으로 새로운 관공서 모델 제작 중. 모던 스타일의 신개념 디자인' },
    { year: '2025', content: '엑셀 문서 작업을 소프트웨어로 전환. 주문제작 시스템 출시 — 기존 엑셀 수식 등 다양한 양식으로 업무에 사용하던 시스템을 소프트웨어로 전환하는 기술 보유' },
    { year: '2024', content: '인공지능 시스템 도입 시작 — AI를 머신러닝 활용하여 회사 업무에 적용하는 시스템 개발' },
    { year: '2023', content: '다양한 업종의 고객사 확보 — 누적 고객사 4,000 업체 달성' },
    { year: '2022', content: '주문제작 소프트웨어 활성화 — 주문제작 소프트웨어 300업체 납품 달성' },
    { year: '1997', content: '엠엠소프트 설립' },
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
                <div className={styles.timelineContent}>{item.content}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default CompanyPage;
