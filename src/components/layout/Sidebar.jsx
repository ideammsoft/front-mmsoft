import { Link } from 'react-router-dom';
import LoginPanel from '../auth/LoginPanel';
import styles from './Sidebar.module.css';

function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      {/* Login Panel */}
      <LoginPanel />

      {/* Quick Links */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>바로가기</h3>
        <div className={styles.quickLinks}>
          <Link to="/downloads" className={styles.quickLink}>
            다운로드
          </Link>
          <Link to="/faq" className={styles.quickLink}>
            FAQ
          </Link>
          <Link to="/community" className={styles.quickLink}>
            고객지원
          </Link>
        </div>
      </div>

      {/* KakaoTalk Widget */}
      <div className={styles.kakaoWidget}>
        <p>💬 카카오톡 상담</p>
        <a
          href="#"
          className={styles.kakaoButton}
          onClick={(e) => {
            e.preventDefault();
            alert('카카오톡 상담 서비스 (데모)');
          }}
        >
          상담하기
        </a>
      </div>
    </aside>
  );
}

export default Sidebar;
