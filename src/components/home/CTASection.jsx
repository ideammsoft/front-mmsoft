import { Link } from 'react-router-dom';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import styles from './CTASection.module.css';

function CTASection() {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <section className={styles.section} ref={ref}>
      <div
        className={styles.container}
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.6s ease',
        }}
      >
        <h2 className={styles.title}>지금 바로 시작하세요</h2>
        <p className={styles.subtitle}>
          엠앰소프트의 솔루션으로 비즈니스 효율을 극대화하세요
        </p>
        <div className={styles.actions}>
          <Link to="/downloads" className={styles.ctaButton}>
            무료 체험 시작하기
          </Link>
          <Link to="/community" className={styles.secondaryButton}>
            문의하기
          </Link>
        </div>
      </div>
    </section>
  );
}

export default CTASection;
