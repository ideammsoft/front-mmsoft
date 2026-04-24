import { Link } from 'react-router-dom';
import ProductGrid from '../components/products/ProductGrid';
import NoticeBoard from '../components/board/NoticeBoard';
import StatsSection from '../components/home/StatsSection';
import CTASection from '../components/home/CTASection';
import styles from './HomePage.module.css';

function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            비즈니스 성장을 위한<br />스마트한 관리 솔루션
          </h1>
          <p className={styles.heroSubtitle}>
            엠엠소프트와 함께 업무 효율을 극대화하세요
          </p>
          <div className={styles.heroActions}>
            <Link to="/downloads?category=freeware" className={styles.heroPrimary}>
              무료 체험 시작
            </Link>
            <Link to="/company" className={styles.heroSecondary}>
              회사 소개
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection />

      {/* Product Grid */}
      <ProductGrid />

      {/* Notice Board */}
      <NoticeBoard limit={5} />

      {/* CTA Section */}
      <CTASection />
    </div>
  );
}

export default HomePage;
