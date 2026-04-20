import { Link } from 'react-router-dom';
import { FaUser, FaCalendar, FaEye } from 'react-icons/fa';
import styles from './NoticeItem.module.css';

function NoticeItem({ notice }) {
  return (
    <Link to={`/community/${notice.id}`} className={styles.item}>
      {notice.category === '공지' && (
        <span className={styles.badge}>공지</span>
      )}
      {notice.category === '안내' && (
        <span className={styles.badgeInfo}>안내</span>
      )}

      <div className={styles.content}>
        <div className={styles.title}>{notice.title}</div>
        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <FaUser size={12} />
            {notice.author}
          </span>
          <span className={styles.metaItem}>
            <FaCalendar size={12} />
            {notice.date}
          </span>
          <span className={styles.metaItem}>
            <FaEye size={12} />
            {notice.views}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default NoticeItem;
