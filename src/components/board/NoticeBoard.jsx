import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronRight } from 'react-icons/fa';
import NoticeItem from './NoticeItem';
import styles from './NoticeBoard.module.css';

function NoticeBoard({ limit = 5 }) {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('mmsoft_access_token');

    fetch(`/api/freeboard`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        const list = Array.isArray(data) ? data : [];
        const ORDER = { '공지': 0, '안내': 1 };
        const filtered = list
          .filter(n => n.freeboardRolename === '공지' || n.freeboardRolename === '안내')
          .sort((a, b) => (ORDER[a.freeboardRolename] ?? 9) - (ORDER[b.freeboardRolename] ?? 9))
          .slice(0, limit);
        setNotices(filtered);
      })
      .catch(() => setNotices([]));
  }, [limit]);

  // API 데이터를 NoticeItem 형식으로 변환
  const toNotice = (post) => ({
    id:       post.freeboardId ?? post.id,
    title:    post.title,
    author:   post.writerName ?? post.author ?? '',
    date:     (post.createdAt ?? post.date ?? '').slice(0, 10),
    views:    post.viewCount ?? post.views ?? 0,
    pinned:   post.freeboardRolename === '공지',
    category: post.freeboardRolename ?? '',
  });

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>공지사항</h2>
        <Link to="/community" className={styles.moreLink}>
          더보기 <FaChevronRight size={12} />
        </Link>
      </div>

      <div className={styles.board}>
        {notices.length > 0 ? (
          notices.map(post => (
            <NoticeItem key={toNotice(post).id} notice={toNotice(post)} />
          ))
        ) : (
          <div className={styles.empty}>공지사항이 없습니다.</div>
        )}
      </div>
    </section>
  );
}

export default NoticeBoard;
