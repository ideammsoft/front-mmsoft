import { useState } from 'react';
import { FaDownload, FaTimes, FaTag, FaFile, FaCalendar } from 'react-icons/fa';
import styles from './DownloadItem.module.css';

function DownloadItem({ download }) {
  const [modalOpen, setModalOpen] = useState(false);

  const handleDownloadClick = () => {
    setModalOpen(true);
  };

  const handleConfirmDownload = () => {
    window.open(download.fileUrl, '_blank', 'noopener,noreferrer');
    setModalOpen(false);
  };

  const handleClose = () => {
    setModalOpen(false);
  };

  return (
    <>
      <div className={styles.item}>
        <div className={styles.thumbnail}>
          <img
            src={download.imageUrl}
            alt={download.title}
            className={styles.thumbnailImg}
            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
          />
          <div className={styles.thumbnailFallback}>
            <FaFile size={28} />
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.titleRow}>
            <h3 className={styles.title}>{download.title}</h3>
          </div>
          <p className={styles.description}>{download.description}</p>
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
              {download.uploadedAt}
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
