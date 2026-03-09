import { FaDownload, FaDesktop, FaBookOpen, FaWrench, FaFile, FaCalendar, FaTag } from 'react-icons/fa';
import styles from './DownloadItem.module.css';

const CATEGORY_CONFIG = {
  software: {
    icon: <FaDesktop />,
    label: '소프트웨어',
    iconClass: 'iconSoftware',
  },
  manual: {
    icon: <FaBookOpen />,
    label: '메뉴얼',
    iconClass: 'iconManual',
  },
  utility: {
    icon: <FaWrench />,
    label: '유틸리티',
    iconClass: 'iconUtility',
  },
};

function DownloadItem({ download }) {
  const config = CATEGORY_CONFIG[download.category] || {
    icon: <FaFile />,
    label: download.category,
    iconClass: 'iconDefault',
  };

  const handleDownload = () => {
    alert(`다운로드 기능은 백엔드 연동 후 제공됩니다.\n파일: ${download.fileName}`);
  };

  return (
    <div className={styles.item}>
      <div className={`${styles.icon} ${styles[config.iconClass]}`}>
        {config.icon}
      </div>

      <div className={styles.content}>
        <div className={styles.titleRow}>
          <h3 className={styles.title}>{download.title}</h3>
          <span className={styles.categoryBadge}>
            {config.label}
          </span>
        </div>
        <p className={styles.description}>{download.description}</p>
        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <FaTag size={11} />
            v{download.version}
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

      <button onClick={handleDownload} className={styles.downloadButton}>
        <FaDownload />
        다운로드
      </button>
    </div>
  );
}

export default DownloadItem;
