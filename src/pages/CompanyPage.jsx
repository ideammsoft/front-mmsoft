import { FaEye, FaBullseye } from 'react-icons/fa';
import styles from './CompanyPage.module.css';

function CompanyPage() {
  const historyItems = [
    { year: '2026', content: '고객관리 시스템 v2.0 출시' },
    { year: '2025', content: 'AI 기반 인사관리 솔루션 개발' },
    { year: '2020', content: '클라우드 서비스 런칭' },
    { year: '2015', content: '누적 고객사 1,000개 달성' },
    { year: '2010', content: '시설관리 솔루션 출시' },
    { year: '2005', content: '인사관리 시스템 출시' },
    { year: '2000', content: '엠엠소프트 설립' },
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
              엠엠소프트는 2000년 설립 이래 기업 및 기관의 효율적인 업무 관리를 위한
              최적의 솔루션을 제공해 왔습니다.
            </p>
            <p>
              고객관리, 인사관리, 시설관리 등 다양한 분야의 소프트웨어 솔루션을 통해
              고객사의 업무 효율성을 극대화하고 있습니다.
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
