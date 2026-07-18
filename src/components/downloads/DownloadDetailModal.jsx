import { FaDownload, FaTimes } from 'react-icons/fa';
// 모달 스타일은 DownloadItem 과 공용으로 사용합니다.
import styles from './DownloadItem.module.css';

// 최근 2개월 내 등록이면 NEW
export function isNewRelease(publishedAt) {
  if (!publishedAt) return false;
  const pub = new Date(publishedAt);
  const twoMonthsAgo = new Date();
  twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
  return pub >= twoMonthsAgo;
}

/**
 * 다운로드 상세 모달 (목록 아이템 / 상단 캐러셀 공용)
 * onDownloaded: 다운로드 성공 시 호출(목록 아이템의 다운로드 수 갱신용)
 */
function DownloadDetailModal({ download, apiBase = '', onClose, onDownloaded }) {
  const thumbnailUrl = download.thumbnail
    ? `${apiBase}/images/pds/${download.thumbnail}`
    : null;
  const isNew = isNewRelease(download.publishedAt);

  const handleConfirmDownload = async () => {
    try {
      const res = await fetch(`${apiBase}/api/pds/${download.pdsId}/download`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        onDownloaded?.();
        window.open(data.url, '_blank', 'noopener,noreferrer');
      } else {
        window.open(download.downloadUrl, '_blank', 'noopener,noreferrer');
      }
    } catch {
      window.open(download.downloadUrl, '_blank', 'noopener,noreferrer');
    }
    onClose?.();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {download.title}
            {isNew && <span className={styles.newBadge}>NEW</span>}
          </h2>
          <button className={styles.closeIcon} onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        <div className={styles.modalBody}>
          {thumbnailUrl && (
            <div className={styles.modalHero}>
              <img src={thumbnailUrl} alt={download.title} className={styles.modalHeroImg}
                onError={(e) => { e.target.parentElement.style.display = 'none' }} />
            </div>
          )}
          <div className={styles.modalMeta}>
            {download.version && <span className={styles.modalMetaTag}>v{download.version}</span>}
            {download.fileSize && <span className={styles.modalMetaTag}>{download.fileSize}</span>}
            {download.osInfo && <span className={styles.modalMetaTag}>{download.osInfo}</span>}
          </div>
          {download.content && (
            download.content.trim().startsWith('<')
              ? <div className={styles.modalContent} dangerouslySetInnerHTML={{ __html: download.content }} />
              : <pre className={styles.modalContent}>{download.content}</pre>
          )}
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.modalDownloadBtn} onClick={handleConfirmDownload}>
            <FaDownload />
            다운로드
          </button>
          <button className={styles.modalCloseBtn} onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}

export default DownloadDetailModal;
