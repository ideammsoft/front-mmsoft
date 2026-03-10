import { useState } from 'react';
import { DOWNLOADS, DOWNLOAD_CATEGORIES } from '../data/downloads';
import DownloadCategories from '../components/downloads/DownloadCategories';
import DownloadItem from '../components/downloads/DownloadItem';
import styles from './DownloadsPage.module.css';

function DownloadsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredDownloads = DOWNLOADS.filter(download => {
    if (selectedCategory === 'all') return true;
    return download.category === selectedCategory;
  });

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

        <div className={styles.grid}>
          {filteredDownloads.length > 0 ? (
            filteredDownloads.map(download => (
              <DownloadItem key={download.id} download={download} />
            ))
          ) : (
            <div className={styles.empty}>
              다운로드 항목이 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DownloadsPage;
