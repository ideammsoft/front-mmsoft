import { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight, FaFile } from 'react-icons/fa';
import DownloadDetailModal, { isNewRelease } from './DownloadDetailModal';
import styles from './DownloadCarousel.module.css';

const AUTO_MS = 3000;

/**
 * 제품 상단 캐러셀
 *  - 3초마다 자동 이동, 좌우 버튼(또는 인디케이터) 클릭 시 자동 이동 정지
 *  - 제목/이미지 클릭 시 다운로드 상세 모달 오픈
 */
function DownloadCarousel({ items, apiBase = '' }) {
  const [index, setIndex]       = useState(0);
  const [auto, setAuto]         = useState(true);
  const [openItem, setOpenItem] = useState(null);

  // 목록(카테고리)이 바뀌면 처음으로
  useEffect(() => { setIndex(0); }, [items]);

  // 자동 이동 (정지되면 다시 시작하지 않음)
  useEffect(() => {
    if (!auto || !items || items.length <= 1) return;
    const timer = setInterval(() => {
      setIndex(i => (i + 1) % items.length);
    }, AUTO_MS);
    return () => clearInterval(timer);
  }, [auto, items]);

  if (!items || items.length === 0) return null;

  const current   = items[Math.min(index, items.length - 1)];
  const thumbnail = current.thumbnail ? `${apiBase}/images/pds/${current.thumbnail}` : null;
  const isNew     = isNewRelease(current.publishedAt);

  const stopAuto = () => setAuto(false);
  const goPrev = () => { stopAuto(); setIndex(i => (i - 1 + items.length) % items.length); };
  const goNext = () => { stopAuto(); setIndex(i => (i + 1) % items.length); };
  const goTo   = (i) => { stopAuto(); setIndex(i); };

  return (
    <>
      <div className={styles.carousel}>
        <h2 className={styles.title} onClick={() => setOpenItem(current)}>
          {current.title}
          {isNew && <span className={styles.newBadge}>NEW</span>}
        </h2>

        <div className={styles.stage}>
          <button className={`${styles.navBtn} ${styles.left}`} onClick={goPrev} aria-label="이전 제품">
            <FaChevronLeft />
          </button>

          <div className={styles.imageWrap} onClick={() => setOpenItem(current)}>
            {thumbnail ? (
              <img src={thumbnail} alt={current.title} className={styles.image} />
            ) : (
              <div className={styles.fallback}><FaFile size={40} /></div>
            )}
          </div>

          <button className={`${styles.navBtn} ${styles.right}`} onClick={goNext} aria-label="다음 제품">
            <FaChevronRight />
          </button>
        </div>

        <div className={styles.dots}>
          {items.map((it, i) => (
            <button
              key={it.pdsId}
              className={`${styles.dot} ${i === index ? styles.dotActive : ''}`}
              onClick={() => goTo(i)}
              aria-label={`${i + 1}번째 제품`}
            />
          ))}
        </div>
      </div>

      {openItem && (
        <DownloadDetailModal
          download={openItem}
          apiBase={apiBase}
          onClose={() => setOpenItem(null)}
        />
      )}
    </>
  );
}

export default DownloadCarousel;
