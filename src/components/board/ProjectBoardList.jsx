// =====================================================================
// [ProjectBoardList.jsx] - 프로젝트 게시판 목록 + 글쓰기 컴포넌트
// =====================================================================
//
// 📌 이 컴포넌트가 하는 일
//   - 프로젝트 게시글 목록을 테이블 형태로 표시합니다.
//   - 카테고리 필터링 (전체/주문제작/일반/기타)
//   - 검색 기능 (제목 또는 작성자로 검색)
//   - 페이지네이션 (10개씩 분할)
//   - 특정 사용자(manyman, manyman2)만 글쓰기 가능
//   - WriteModal: 글쓰기 팝업창
//
// 📌 컴포넌트 안에 컴포넌트 정의
//   - WriteModal은 ProjectBoardList 안에서만 사용하는 팝업입니다.
//   - 같은 파일 안에 정의하여 코드를 한 곳에서 관리합니다.
//   - 큰 프로젝트에서는 별도 파일로 분리하는 것이 좋습니다.
//
// 📌 .filter() .sort() 메서드
//   - array.filter(조건함수) : 조건이 true인 요소만 남긴 새 배열 반환
//   - array.sort(비교함수)   : 정렬한 배열 반환
//   - [...array]            : 원본 배열을 복사 (원본 변경 방지)
//
// 📌 useRef를 파일 input에 사용하는 이유
//   - <input type="file">은 styled 버튼으로 대체할 때
//     실제 file input을 숨기고 ref.current.click()으로 프로그래밍적으로 클릭합니다.

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaPen, FaTimes } from 'react-icons/fa';
import clsx from 'clsx';
import Pagination from '../common/Pagination';
import styles from './BoardList.module.css';
import projStyles from './ProjectBoardList.module.css';

// ─── 글쓰기 팝업 컴포넌트 ───
// ProjectBoardList 안에서만 사용하므로 같은 파일에 정의합니다.
function WriteModal({ onClose, onSave }) {
  const storedUser = (() => {
    try { return JSON.parse(localStorage.getItem('mmsoft_user')) || {}; } catch { return {}; }
  })();
  const loggedInId = storedUser.homepageId || '';
  const loggedInAccountId = storedUser.accountId || null;

  const [form, setForm] = useState({
    title    : '',
    author   : loggedInId,
    accountId: loggedInAccountId,
    passwd   : '',
    content  : '',
    url      : '',
    category : '일반',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }
    setSubmitting(true);
    try {
      const token = localStorage.getItem('mmsoft_access_token');
      const res = await fetch('/api/workboard/write', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('등록 실패');
      alert('등록되었습니다.');
      onSave?.();
      onClose();
    } catch {
      alert('등록 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>글쓰기</h2>
          <button className={styles.modalClose} onClick={onClose} aria-label="닫기">
            <FaTimes />
          </button>
        </div>

        {/* id="projectWriteForm"으로 모달 외부의 submit 버튼과 연결 */}
        <form id="projectWriteForm" onSubmit={handleSubmit} className={styles.modalBody}>

          {/* 제목 */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>제목</label>
            <input type="text" name="title" value={form.title} onChange={handleChange}
              placeholder="제목을 입력하세요" className={styles.formInput} />
          </div>

          {/* 작성자(읽기전용) + 비밀번호 - 2칸 그리드 */}
          <div className={projStyles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>작성자</label>
              <input type="text" name="author" value={form.author}
                readOnly // 작성자는 로그인 아이디로 고정, 변경 불가
                className={`${styles.formInput} ${styles.formInputReadonly}`} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>비밀번호</label>
              <input type="text" name="passwd" value={form.passwd}
                onChange={handleChange} placeholder="비밀번호 입력" className={styles.formInput} />
            </div>
          </div>

          {/* 내용 (textarea: 여러 줄 입력 가능) */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>내용</label>
            <textarea name="content" value={form.content} onChange={handleChange}
              placeholder="내용을 입력하세요" className={styles.formTextarea} rows={6} />
          </div>

          {/* 카테고리 */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>카테고리</label>
            <select name="category" value={form.category} onChange={handleChange} className={styles.formInput}>
              <option value="주문제작">주문제작</option>
              <option value="일반">일반</option>
              <option value="기타">기타</option>
            </select>
          </div>

          {/* 파일명 (URL) */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>파일명</label>
            <input type="text" name="url" value={form.url} onChange={handleChange}
              placeholder="" className={styles.formInput} />
          </div>
        </form>

        {/* 모달 하단 버튼: form 외부에 있지만 form="projectWriteForm"으로 연결 */}
        <div className={styles.modalFooter}>
          <button type="button" className={styles.cancelButton} onClick={onClose}>취소</button>
          <button type="submit" form="projectWriteForm" className={styles.submitButton} disabled={submitting}>
            {submitting ? '등록 중...' : '등록'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── 메인 컴포넌트: 게시글 목록 ───
// posts: 부모 컴포넌트(ProjectsPage)에서 전달받은 게시글 배열
function ProjectBoardList({ posts, onRefresh }) {
  const navigate = useNavigate(); // 페이지 이동 함수

  // 현재 페이지 번호 (1부터 시작)
  const [currentPage,      setCurrentPage]      = useState(1);
  // 선택된 카테고리 필터
  const [selectedCategory, setSelectedCategory] = useState('전체');
  // 검색어
  const [searchTerm,       setSearchTerm]       = useState('');
  // 글쓰기 모달 표시 여부
  const [writeOpen,        setWriteOpen]        = useState(false);

  // 로그인한 사용자 아이디 (글쓰기 권한 체크)
  const roleName = (() => {
    try { return JSON.parse(localStorage.getItem('mmsoft_user'))?.roleName || ''; } catch { return ''; }
  })();
  const canWrite = roleName === 'super_admin';

  const itemsPerPage = 10; // 한 페이지에 표시할 게시글 수
  const categories   = ['전체', '주문제작', '일반', '기타']; // 카테고리 목록

  // 1단계: 카테고리 + 검색어로 필터링
  const filtered = posts.filter(post => {
    const matchesCategory = selectedCategory === '전체' || post.category === selectedCategory;
    const matchesSearch   = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            post.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // 2단계: 서버에서 workboard_id DESC로 정렬되어 오므로 순서 유지
  const sorted = filtered;

  // 3단계: 페이지네이션 계산
  const totalPages  = Math.ceil(sorted.length / itemsPerPage); // 올림 나눗셈
  const startIndex  = (currentPage - 1) * itemsPerPage;       // 현재 페이지 시작 인덱스
  const paginated   = sorted.slice(startIndex, startIndex + itemsPerPage); // 현재 페이지 데이터

  // 게시글 행 클릭 → 상세 페이지로 이동 (post 데이터를 state로 전달)
  const handleRowClick  = (post) => navigate(`/projects/${post.id}`, { state: { post } });

  // 검색 폼 제출 (첫 페이지로 이동)
  const handleSearch    = (e) => { e.preventDefault(); setCurrentPage(1); };

  return (
    <div className={styles.container}>

      {/* 상단 바: 카테고리 필터 + 검색 + 글쓰기 버튼 */}
      <div className={styles.topBar}>
        <div className={styles.filters}>
          {/* 카테고리 버튼 목록 */}
          {categories.map(category => (
            <button
              key={category} // 리스트에서 각 항목을 고유하게 식별하는 key
              className={clsx(styles.filterButton, selectedCategory === category && styles.active)}
              onClick={() => { setSelectedCategory(category); setCurrentPage(1); }}
            >
              {category}
            </button>
          ))}
        </div>

        <div className={styles.topActions}>
          {/* 검색 폼 */}
          <form onSubmit={handleSearch} className={styles.searchBox}>
            <input type="text" placeholder="검색어를 입력하세요"
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput} />
            <button type="submit" className={styles.searchButton}>
              <FaSearch />
            </button>
          </form>

          {/* 글쓰기 버튼: 권한 있는 사용자에게만 표시 */}
          {canWrite && (
            <button className={styles.writeButton} onClick={() => setWriteOpen(true)}>
              <FaPen /> 글쓰기
            </button>
          )}
        </div>
      </div>

      {/* 게시글이 있을 때만 테이블 표시 */}
      {paginated.length > 0 ? (
        <>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.numberCol}>번호</th>
                <th className={styles.titleCol}>제목</th>
                <th className={styles.authorCol}>작성자</th>
                <th className={styles.dateCol}>작성일</th>
                <th className={styles.viewsCol}>조회</th>
              </tr>
            </thead>
            <tbody>
              {/* 현재 페이지 게시글들을 순서대로 렌더링 */}
              {paginated.map((post, index) => (
                // 행 클릭 시 해당 게시글 상세 페이지로 이동
                <tr key={post.id} onClick={() => handleRowClick(post)}>
                  {/* 실제 번호 = 전체 수 - 시작 인덱스 - 현재 인덱스 */}
                  <td className={styles.numberCol}>{sorted.length - startIndex - index}</td>
                  <td className={styles.titleCol}>
                    <div className={styles.titleCell}>
                      <span className={projStyles.categoryBadge}>{post.category}</span>
                      <span>{post.title}</span>
                    </div>
                  </td>
                  <td className={styles.authorCol}>{post.author}</td>
                  <td className={styles.dateCol}>{post.date}</td>
                  <td className={styles.viewsCol}>{post.views}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 페이지네이션 컴포넌트 */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage} // 페이지 클릭 시 currentPage 상태 변경
          />
        </>
      ) : (
        <div className={styles.empty}>검색 결과가 없습니다.</div>
      )}

      {/* 하단 글쓰기 버튼 (권한 있는 사용자만) */}
      {canWrite && (
        <div className={styles.bottomBar}>
          <button className={styles.writeButton} onClick={() => setWriteOpen(true)}>
            <FaPen /> 글쓰기
          </button>
        </div>
      )}

      {/* 글쓰기 모달: writeOpen이 true일 때만 렌더링 */}
      {writeOpen && <WriteModal onClose={() => setWriteOpen(false)} onSave={onRefresh} />}
    </div>
  );
}

export default ProjectBoardList;
