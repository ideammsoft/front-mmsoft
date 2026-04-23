import { useState } from 'react';
import { FaDownload, FaTimes, FaTag, FaFile, FaCalendar } from 'react-icons/fa';
import styles from './DownloadItem.module.css';

function DownloadItem({ download, apiBase }) {
  const [modalOpen, setModalOpen]             = useState(false);
  const [downloadCount, setDownloadCount]     = useState(download.downloadCount ?? 0);

  const thumbnailUrl = download.thumbnail
    ? `${apiBase}/images/pds/${download.thumbnail}`
    : null;

  const handleDownloadClick = () => setModalOpen(true);

  const handleConfirmDownload = async () => {
    try {
      const res = await fetch(`${apiBase}/api/pds/${download.pdsId}/download`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setDownloadCount(prev => prev + 1);
        window.open(data.url, '_blank', 'noopener,noreferrer');
      } else {
        window.open(download.downloadUrl, '_blank', 'noopener,noreferrer');
      }
    } catch {
      window.open(download.downloadUrl, '_blank', 'noopener,noreferrer');
    }
    setModalOpen(false);
  };

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
        <div className={styles.overlay} onClick={handleClose}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>{download.title}</h2>
              <button className={styles.closeIcon} onClick={handleClose}>
                <FaTimes />
              </button>
            </div>
            <div className={styles.modalBody}>
              <pre className={styles.modalContent}>{download.content}</pre>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.modalDownloadBtn} onClick={handleConfirmDownload}>
                <FaDownload />
                다운로드
              </button>
              <button className={styles.modalCloseBtn} onClick={handleClose}>
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DownloadItem;
