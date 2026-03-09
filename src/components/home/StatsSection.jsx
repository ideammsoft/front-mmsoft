import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import styles from './StatsSection.module.css';

const stats = [
  { value: '1,000+', label: '고객사' },
  { value: '25+', label: '운영 연수' },
  { value: '500+', label: '프로젝트' },
  { value: '98%', label: '고객 만족도' },
];

function StatsSection() {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <section className={styles.section} ref={ref}>
      <div className={styles.container}>
        {stats.map((stat, index) => (
          <div
            key={index}
            className={styles.stat}
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: `all 0.6s ease ${index * 0.1}s`,
            }}
          >
            <div className={styles.value}>{stat.value}</div>
            <div className={styles.label}>{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default StatsSection;
