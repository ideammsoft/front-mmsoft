import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaPen, FaTimes, FaPaperclip } from 'react-icons/fa';
import clsx from 'clsx';
import Pagination from '../common/Pagination';
import styles from './BoardList.module.css';

function WriteModal({ onClose }) {
  const loggedInId = (() => {
    try { return JSON.parse(localStorage.getItem('mmsoft_user'))?.homepageId || ''; } catch { return ''; }
  })();
  const [form, setForm] = useState({ title: '', author: loggedInId, content: '' });
  const [fileName, setFileName] = useState('');
  const fileRef = useRef(null);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    setFileName(e.target.files[0]?.name || '');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.author.trim() || !form.content.trim()) {
      alert('제목, 작성자, 내용을 모두 입력해주세요.');
      return;
    }
    alert('등록되었습니다. (데모)');
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>

        {/* 고정 헤더 */}
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>글쓰기</h2>
          <button className={styles.modalClose} onClick={onClose} aria-label="닫기">
            <FaTimes />
          </button>
        </div>

        {/* 스크롤 가능한 폼 영역 */}
        <form id="writeForm" onSubmit={handleSubmit} className={styles.modalBody}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>제목</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="제목을 입력하세요"
              className={styles.formInput}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>작성자</label>
            <input
              type="text"
              name="author"
              value={form.author}
              readOnly
              className={`${styles.formInput} ${styles.formInputReadonly}`}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>내용</label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              placeholder="내용을 입력하세요"
              className={styles.formTextarea}
              rows={6}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>파일첨부</label>
            <div className={styles.fileInputWrapper}>
              <button
                type="button"
                className={styles.fileButton}
                onClick={() => fileRef.current.click()}
              >
                <FaPaperclip />
                파일 선택
              </button>
              <span className={styles.fileName}>
                {fileName || '선택된 파일 없음'}
              </span>
              <input
                type="file"
                ref={fileRef}
                onChange={handleFileChange}
                className={styles.fileInputHidden}
              />
            </div>
          </div>
        </form>

        {/* 고정 푸터 */}
        <div className={styles.modalFooter}>
          <button type="button" className={styles.cancelButton} onClick={onClose}>
            취소
          </button>
          <button type="submit" form="writeForm" className={styles.submitButton}>
            등록
          </button>
        </div>

      </div>
    </div>
  );
}

function BoardList({ notices }) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [searchTerm, setSearchTerm] = useState('');
  const [writeOpen, setWriteOpen] = useState(false);

  const itemsPerPage = 10;
  const categories = ['전체', '공지', '안내', '일반'];

  const filteredNotices = notices.filter(notice => {
    const matchesCategory = selectedCategory === '전체' || notice.category === selectedCategory;
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notice.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedNotices = [...filteredNotices].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.date) - new Date(a.date);
  });

  const totalPages = Math.ceil(sortedNotices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedNotices = sortedNotices.slice(startIndex, startIndex + itemsPerPage);

  const handleRowClick = (noticeId) => {
    navigate(`/community/${noticeId}`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  return (
    <div className={styles.container}>
      {/* 상단 바: 탭 필터 + 검색 + 글쓰기 */}
      <div className={styles.topBar}>
        <div className={styles.filters}>
          {categories.map(category => (
            <button
              key={category}
              className={clsx(styles.filterButton, selectedCategory === category && styles.active)}
              onClick={() => { setSelectedCategory(category); setCurrentPage(1); }}
            >
              {category}
            </button>
          ))}
        </div>

        <div className={styles.topActions}>
          <form onSubmit={handleSearch} className={styles.searchBox}>
            <input
              type="text"
              placeholder="검색어를 입력하세요"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            <button type="submit" className={styles.searchButton}>
              <FaSearch />
            </button>
          </form>
          <button className={styles.writeButton} onClick={() => setWriteOpen(true)}>
            <FaPen />
            글쓰기
          </button>
        </div>
      </div>

      {/* 테이블 */}
      {paginatedNotices.length > 0 ? (
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
              {paginatedNotices.map((notice, index) => (
                <tr key={notice.id} onClick={() => handleRowClick(notice.id)}>
                  <td className={styles.numberCol}>
                    {notice.pinned ? '공지' : startIndex + index + 1}
                  </td>
                  <td className={styles.titleCol}>
                    <div className={styles.titleCell}>
                      {notice.pinned && <span className={styles.badge}>공지</span>}
                      <span>{notice.title}</span>
                    </div>
                  </td>
                  <td className={styles.authorCol}>{notice.author}</td>
                  <td className={styles.dateCol}>{notice.date}</td>
                  <td className={styles.viewsCol}>{notice.views}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      ) : (
        <div className={styles.empty}>검색 결과가 없습니다.</div>
      )}

      {/* 하단 글쓰기 버튼 */}
      <div className={styles.bottomBar}>
        <button className={styles.writeButton} onClick={() => setWriteOpen(true)}>
          <FaPen />
          글쓰기
        </button>
      </div>

      {/* 글쓰기 모달 */}
      {writeOpen && <WriteModal onClose={() => setWriteOpen(false)} />}
    </div>
  );
}

export default BoardList;
