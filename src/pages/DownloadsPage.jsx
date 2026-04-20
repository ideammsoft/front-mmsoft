import { useState, useEffect } from 'react';
import { DOWNLOAD_CATEGORIES } from '../data/downloads';
import DownloadCategories from '../components/downloads/DownloadCategories';
import DownloadItem from '../components/downloads/DownloadItem';
import styles from './DownloadsPage.module.css';

const API_BASE = '';

function DownloadsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [downloads, setDownloads]               = useState([]);
  const [loading, setLoading]                   = useState(true);

  useEffect(() => {
    const category = selectedCategory === 'all' ? '' : selectedCategory;
    setLoading(true);
    fetch(`${API_BASE}/api/pds${category ? `?category=${category}` : ''}`)
      .then(res => res.json())
      .then(data => setDownloads(data))
      .catch(() => setDownloads([]))
      .finally(() => setLoading(false));
  }, [selectedCategory]);

  return (
    <div>
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <h1 className={styles.heroTitle}>제품 소개</h1>
          <p className={styles.heroSubtitle}>프로그램 설치 파일 및 사용자 매뉴얼을 다운로드 받으실 수 있습니다</p>
        </div>
      </section>

      <div className={styles.content}>
        <DownloadCategories
          categories={DOWNLOAD_CATEGORIES}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {loading ? (
          <div className={styles.empty}>불러오는 중...</div>
        ) : (
          <div className={styles.grid}>
            {downloads.length > 0 ? (
              downloads.map(download => (
                <DownloadItem key={download.pdsId} download={download} apiBase={API_BASE} />
              ))
            ) : (
              <div className={styles.empty}>다운로드 항목이 없습니다.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default DownloadsPage;
