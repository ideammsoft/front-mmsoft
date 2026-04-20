import { useState, useEffect, useCallback } from 'react';
import ProjectBoardList from '../components/board/ProjectBoardList';
import styles from './ProjectsPage.module.css';


function ProjectsPage() {
  const [posts, setPosts] = useState([]);

  const fetchPosts = useCallback(() => {
    const token = localStorage.getItem('mmsoft_access_token');
    fetch('/api/workboard/projects', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(r => {
        if (!r.ok) {
          console.error('[WorkBoard] API 응답 오류:', r.status, r.statusText);
          return [];
        }
        return r.json();
      })
      .then(data => {
        console.log('[WorkBoard] API 응답 데이터:', data);
        if (Array.isArray(data) && data.length > 0) {
          setPosts(data.map(p => ({
            id:       p.workboardId,
            title:    p.title,
            content:  p.content,
            author:   p.name,
            date:     p.regDate ? p.regDate.substring(0, 10) : '',
            views:    p.cnt || 0,
            category: p.workboardRolename || '일반',
            url:      p.url || '',
            passwd:   p.passwd || '',
          })));
        } else {
          setPosts([]);
        }
      })
      .catch(e => {
        console.error('[WorkBoard] fetch 오류:', e);
        setPosts([]);
      });
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  return (
    <div>
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <h1 className={styles.heroTitle}>프로젝트</h1>
          <p className={styles.heroSubtitle}>프로젝트 관련 문의 및 소식을 확인하세요</p>
        </div>
      </section>

      <div className={styles.content}>
        <ProjectBoardList posts={posts} onRefresh={fetchPosts} />
      </div>
    </div>
  );
}

export default ProjectsPage;
