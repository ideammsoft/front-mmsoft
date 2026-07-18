import { useState } from 'react';
import { FaDownload, FaTag, FaFile, FaCalendar } from 'react-icons/fa';
import DownloadDetailModal, { isNewRelease } from './DownloadDetailModal';
import styles from './DownloadItem.module.css';

function DownloadItem({ download, apiBase }) {
  const [modalOpen, setModalOpen]             = useState(false);
  const [downloadCount, setDownloadCount]     = useState(download.downloadCount ?? 0);

  const thumbnailUrl = download.thumbnail
    ? `${apiBase}/images/pds/${download.thumbnail}`
    : null;

  const isNew = isNewRelease(download.publishedAt);

  const handleDownloadClick = () => setModalOpen(true);

  const handleClose = () => setModalOpen(false);

  return (
    <>
      <div className={styles.item}>
        <div className={styles.thumbnail} onClick={handleDownloadClick} style={{ cursor: 'pointer' }}>
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={download.title}
              className={styles.thumbnailImg}
              onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
            />
          ) : null}
          <div className={styles.thumbnailFallback} style={{ display: thumbnailUrl ? 'none' : 'flex' }}>
            <FaFile size={28} />
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.titleRow}>
            <h3 className={styles.title} onClick={handleDownloadClick} style={{ cursor: 'pointer' }}>
              {download.title}
            </h3>
            {isNew && <span className={styles.newBadge}>NEW</span>}
          </div>
          <p className={styles.description}>{download.osInfo}</p>
          <div className={styles.meta}>
            <span className={styles.metaItem}>
              <FaTag size={11} />
              {download.version}
            </span>
            <span className={styles.metaItem}>
              <FaFile size={11} />
              {download.fileSize}
            </span>
            <span className={styles.metaItem}>
              <FaCalendar size={11} />
              {download.publishedAt}
            </span>
            <span className={styles.metaItem}>
              <FaDownload size={11} />
              {downloadCount.toLocaleString()}
            </span>
          </div>
        </div>

        <button onClick={handleDownloadClick} className={styles.downloadButton}>
          <FaDownload />
          다운로드
        </button>
      </div>

      {modalOpen && (
        <DownloadDetailModal
          download={download}
          apiBase={apiBase}
          onClose={handleClose}
          onDownloaded={() => setDownloadCount(prev => prev + 1)}
        />
      )}
    </>
  );
}

export default DownloadItem;
