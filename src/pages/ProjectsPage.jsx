import { useState, useEffect, useCallback } from 'react';
import ProjectBoardList from '../components/board/ProjectBoardList';
import styles from './ProjectsPage.module.css';

// 워크보드 API 응답이 없거나 빈 경우 보여줄 임시 데이터 (1건)
const DUMMY_POST = [{
  id: 1,
  title: '주문제작 ERP 시스템 개발 문의',
  content: '저희 회사에 맞는 맞춤형 ERP 시스템 개발을 문의드립니다.',
  author: '관리자',
  date: '2026-03-10',
  views: 1,
  category: '주문제작',
}];

function ProjectsPage() {
  const [posts, setPosts] = useState([]);

  const fetchPosts = useCallback(() => {
    const token = localStorage.getItem('mmsoft_access_token');
    fetch('http://localhost:1882/api/workboard/projects', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setPosts(data.map(p => ({
            id:       p.workboardId,
            title:    p.title,
            content:  p.content,
            author:   p.name,
            date:     p.regDate ? p.regDate.substring(0, 10) : '',
            views:    0,
            category: p.workboardRolename || '일반',
            url:      p.url || '',
            passwd:   p.passwd || '',
          })));
        } else {
          setPosts(DUMMY_POST);
        }
      })
      .catch(() => setPosts(DUMMY_POST));
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
