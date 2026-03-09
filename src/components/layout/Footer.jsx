import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>엠엠소프트</h3>
            <div className={styles.companyInfo}>
              <p>대표: 홍길동</p>
              <p>서울특별시 강남구 테헤란로 123</p>
              <p>전화: 1234-5678</p>
              <p>이메일: info@mmsoft.co.kr</p>
              <p>사업자등록번호: 123-45-67890</p>
            </div>
          </div>

          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>바로가기</h3>
            <Link to="/" className={styles.footerLink}>홈</Link>
            <Link to="/company" className={styles.footerLink}>회사소개</Link>
            <Link to="/community" className={styles.footerLink}>커뮤니티</Link>
            <Link to="/downloads" className={styles.footerLink}>다운로드</Link>
            <Link to="/sitemap" className={styles.footerLink}>사이트맵</Link>
          </div>

          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>제품</h3>
            <Link to="/" className={styles.footerLink}>고객관리</Link>
            <Link to="/" className={styles.footerLink}>인사관리</Link>
            <Link to="/" className={styles.footerLink}>시설관리</Link>
            <Link to="/projects" className={styles.footerLink}>포트폴리오</Link>
          </div>

          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>고객지원</h3>
            <Link to="/faq" className={styles.footerLink}>FAQ</Link>
            <Link to="/downloads" className={styles.footerLink}>자료실</Link>
            <Link to="/community" className={styles.footerLink}>문의하기</Link>
          </div>
        </div>

        <div className={styles.copyright}>
          <p>Copyright &copy; 2026 MmSoft. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
