import { useState, useEffect, useCallback } from 'react';
import BoardList from '../components/board/BoardList';
import styles from './CommunityPage.module.css';

function CommunityPage() {
  const [posts,   setPosts]   = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback((rolename = '', keyword = '') => {
    setLoading(true);
    const token = localStorage.getItem('mmsoft_access_token');
    const params = new URLSearchParams();
    if (rolename) params.set('rolename', rolename);
    if (keyword)  params.set('keyword',  keyword);

    fetch(`/api/freeboard?${params}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(r => r.ok ? r.json() : [])
      .then(data => setPosts(Array.isArray(data) ? data : []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  return (
    <div>
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <h1 className={styles.heroTitle}>커뮤니티</h1>
          <p className={styles.heroSubtitle}>공지사항 및 최신 소식을 확인하세요</p>
        </div>
      </section>

      <div className={styles.content}>
        {loading ? (
          <p style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)' }}>
            불러오는 중...
          </p>
        ) : (
          <BoardList posts={posts} onRefresh={fetchPosts} />
        )}
      </div>
    </div>
  );
}

export default CommunityPage;
