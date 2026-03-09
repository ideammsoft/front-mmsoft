import { Link } from 'react-router-dom';
import { FaChevronRight } from 'react-icons/fa';
import { NOTICES } from '../../data/notices';
import NoticeItem from './NoticeItem';
import styles from './NoticeBoard.module.css';

function NoticeBoard({ limit = 5 }) {
  // Show pinned notices first, then sort by date
  const sortedNotices = [...NOTICES]
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.date) - new Date(a.date);
    })
    .slice(0, limit);

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>공지사항</h2>
        <Link to="/community" className={styles.moreLink}>
          더보기 <FaChevronRight size={12} />
        </Link>
      </div>

      <div className={styles.board}>
        {sortedNotices.length > 0 ? (
          sortedNotices.map((notice) => (
            <NoticeItem key={notice.id} notice={notice} />
          ))
        ) : (
          <div className={styles.empty}>
            공지사항이 없습니다.
          </div>
        )}
      </div>
    </section>
  );
}

export default NoticeBoard;
