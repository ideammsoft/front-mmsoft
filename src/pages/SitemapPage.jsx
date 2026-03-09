import { Link } from 'react-router-dom';
import styles from './SitemapPage.module.css';

function SitemapPage() {
  const sitemap = [
    {
      title: '홈',
      path: '/',
      children: []
    },
    {
      title: '회사소개',
      path: '/company',
      children: []
    },
    {
      title: '커뮤니티',
      path: '/community',
      children: [
        { title: '공지사항', path: '/community' },
        { title: '게시글 상세', path: '/community/1' }
      ]
    },
    {
      title: '다운로드',
      path: '/downloads',
      children: []
    },
    {
      title: '프로젝트',
      path: '/projects',
      children: []
    },
    {
      title: 'FAQ',
      path: '/faq',
      children: []
    },
    {
      title: '사이트맵',
      path: '/sitemap',
      children: []
    }
  ];

  return (
    <div>
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <h1 className={styles.heroTitle}>사이트맵</h1>
          <p className={styles.heroSubtitle}>엠엠소프트 웹사이트의 전체 구조입니다</p>
        </div>
      </section>

      <div className={styles.content}>
        <div className={styles.grid}>
          {sitemap.map((section, index) => (
            <div key={index} className={styles.card}>
              <Link to={section.path} className={styles.sectionLink}>
                {section.title}
              </Link>

              {section.children.length > 0 && (
                <ul className={styles.children}>
                  {section.children.map((child, childIndex) => (
                    <li key={childIndex} className={styles.childItem}>
                      <Link to={child.path} className={styles.childLink}>
                        {child.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SitemapPage;
