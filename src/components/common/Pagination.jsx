// =====================================================================
// [Pagination.jsx] - 페이지네이션(페이지 번호) 컴포넌트
// =====================================================================
//
// 📌 이 컴포넌트가 하는 일
//   - 게시글 목록 하단에 페이지 번호 버튼을 표시합니다.
//   - 페이지가 많을 때 "1 ... 4 5 6 ... 10" 형태로 표시합니다.
//
// 📌 Props 설명
//   - currentPage  : 현재 페이지 번호 (1부터 시작)
//   - totalPages   : 전체 페이지 수 (예: 총 27개, 10개씩 → 3페이지)
//   - onPageChange : 페이지 클릭 시 실행할 함수 (부모 컴포넌트에서 전달)
//     예) onPageChange(3) → 3페이지로 이동
//
// 📌 페이지 번호 계산 예시
//   totalPages=10, currentPage=5 이면:
//   [1] [...] [4] [5] [6] [...] [10]
//   - 현재 페이지(5) 기준 앞뒤 1페이지씩 + 첫/마지막 페이지 + 중간 생략(...)

import clsx from 'clsx';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import styles from './Pagination.module.css';

function Pagination({ currentPage, totalPages, onPageChange }) {

  // 표시할 페이지 번호 배열 계산
  const getPageNumbers = () => {
    const pages    = [];  // 최종 반환할 배열 (숫자 또는 '...')
    const showPages = 5;  // 한 번에 표시할 최대 페이지 수

    if (totalPages <= showPages) {
      // 전체 페이지 수가 5 이하이면 모든 페이지 번호 표시
      // 예) totalPages=3 → [1, 2, 3]
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 전체 페이지가 5 초과이면 스마트한 표시
      pages.push(1); // 항상 첫 번째 페이지 표시

      // 현재 페이지 주변 범위 계산
      let start = Math.max(2, currentPage - 1);           // 현재 페이지 - 1 (최소 2)
      let end   = Math.min(totalPages - 1, currentPage + 1); // 현재 페이지 + 1 (최대 마지막-1)

      // 첫 페이지와 start 사이에 숫자가 건너뛰어 있으면 '...' 추가
      if (start > 2) pages.push('...');

      // 현재 페이지 주변 번호 추가 (예: 4, 5, 6)
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // end와 마지막 페이지 사이에 숫자가 건너뛰어 있으면 '...' 추가
      if (end < totalPages - 1) pages.push('...');

      pages.push(totalPages); // 항상 마지막 페이지 표시
    }

    return pages;
  };

  return (
    <div className={styles.pagination}>

      {/* 이전 페이지 버튼 (< 아이콘) */}
      <button
        className={styles.button}
        onClick={() => onPageChange(currentPage - 1)} // 현재 페이지 - 1
        disabled={currentPage === 1} // 첫 페이지에서는 비활성화
        aria-label="이전 페이지"
      >
        <FaChevronLeft />
      </button>

      {/* 페이지 번호 버튼들 */}
      {getPageNumbers().map((page, index) => {
        // '...' 은 클릭 불가한 텍스트로 표시
        if (page === '...') {
          return (
            <span key={`ellipsis-${index}`} className={styles.ellipsis}>
              ...
            </span>
          );
        }

        return (
          <button
            key={page}
            // 현재 페이지면 active 클래스 추가 (강조 스타일)
            className={clsx(styles.button, currentPage === page && styles.active)}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        );
      })}

      {/* 다음 페이지 버튼 (> 아이콘) */}
      <button
        className={styles.button}
        onClick={() => onPageChange(currentPage + 1)} // 현재 페이지 + 1
        disabled={currentPage === totalPages} // 마지막 페이지에서는 비활성화
        aria-label="다음 페이지"
      >
        <FaChevronRight />
      </button>

    </div>
  );
}

export default Pagination;
