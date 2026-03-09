import { NOTICES } from '../data/notices';
import BoardList from '../components/board/BoardList';
import styles from './CommunityPage.module.css';

function CommunityPage() {
  return (
    <div>
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <h1 className={styles.heroTitle}>커뮤니티</h1>
          <p className={styles.heroSubtitle}>공지사항 및 최신 소식을 확인하세요</p>
        </div>
      </section>

      <div className={styles.content}>
        <BoardList notices={NOTICES} />
      </div>
    </div>
  );
}

export default CommunityPage;
