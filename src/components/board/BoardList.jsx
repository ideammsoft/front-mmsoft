import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaPen, FaTimes, FaPaperclip, FaLock, FaReply } from 'react-icons/fa';
import clsx from 'clsx';
import Pagination from '../common/Pagination';
import styles from './BoardList.module.css';

const API = 'http://localhost:1882/api/freeboard';
const CATEGORIES = ['전체', '공지', '안내', '일반'];

// ─── 공통: 현재 로그인 정보 ─────────────────────────────
function useAuth() {
  try {
    const user = JSON.parse(localStorage.getItem('mmsoft_user') || '{}');
    const token = localStorage.getItem('mmsoft_access_token');
    // JWT payload에서 roles 추출
    let roles = [];
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      roles = payload.roles || [];
    }
    const isAdmin = roles.some(r => r === 'ROLE_admin' || r === 'ROLE_super_admin');
    return { user, token, isAdmin, accountId: user.accountId || null };
  } catch {
    return { user: {}, token: null, isAdmin: false, accountId: null };
  }
}

// ─── 글쓰기 모달 ─────────────────────────────────────────
function WriteModal({ onClose, onSave, parentPost = null }) {
  const { user, token } = useAuth();
  const isReply = !!parentPost;
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    title   : isReply ? `Re: ${parentPost.title}` : '',
    content : '',
    freeboardRolename: '일반',
    isSecret: 'N',
  });
  const [fileName, setFileName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 'Y' : 'N') : value,
    }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert('파일 크기는 10MB 이하여야 합니다.');
      return;
    }
    setUploading(true);
    setFileName(file.name);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch(`${API}/upload`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: fd,
      });
      if (res.ok) {
        const data = await res.json();
        setForm(prev => ({ ...prev, url: data.filePath }));
      } else {
        const msg = await res.text().catch(() => '');
        alert('파일 업로드 실패: ' + (msg || res.status));
        setFileName('');
      }
    } catch { alert('파일 업로드 실패'); }
    finally { setUploading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }
    setSubmitting(true);
    try {
      const url = isReply ? `${API}/${parentPost.freeboardId}/reply` : API;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ ...form, name: user.name || user.homepageId || '익명' }),
      });
      if (!res.ok) throw new Error();
      alert(isReply ? '댓글이 등록되었습니다.' : '등록되었습니다.');
      onSave?.();
      onClose();
    } catch { alert('등록 중 오류가 발생했습니다.'); }
    finally { setSubmitting(false); }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{isReply ? '댓글 쓰기' : '글쓰기'}</h2>
          <button className={styles.modalClose} onClick={onClose}><FaTimes /></button>
        </div>

        <form id="boardWriteForm" onSubmit={handleSubmit} className={styles.modalBody}>
          {!isReply && (
            <>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>유형</label>
                <select name="freeboardRolename" value={form.freeboardRolename}
                  onChange={handleChange} className={styles.formInput}>
                  <option value="공지">공지</option>
                  <option value="안내">안내</option>
                  <option value="일반">일반</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.secretCheckLabel}>
                  <input type="checkbox" name="isSecret"
                    checked={form.isSecret === 'Y'} onChange={handleChange}
                    className={styles.secretCheckbox} />
                  비밀글 (본인 및 관리자만 열람 가능)
                </label>
              </div>
            </>
          )}

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>제목</label>
            <input type="text" name="title" value={form.title} onChange={handleChange}
              placeholder="제목을 입력하세요" className={styles.formInput} />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>내용</label>
            <textarea name="content" value={form.content} onChange={handleChange}
              placeholder="내용을 입력하세요" className={styles.formTextarea} rows={6} />
          </div>

          {!isReply && (
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>파일첨부 (최대 10MB)</label>
              <div className={styles.fileInputWrapper}>
                <button type="button" className={styles.fileButton}
                  onClick={() => fileRef.current.click()} disabled={uploading}>
                  <FaPaperclip /> {uploading ? '업로드 중...' : '파일 선택'}
                </button>
                <span className={styles.fileName}>{fileName || '선택된 파일 없음'}</span>
                <input type="file" ref={fileRef} onChange={handleFileChange}
                  className={styles.fileInputHidden} />
              </div>
            </div>
          )}
        </form>

        <div className={styles.modalFooter}>
          <button type="button" className={styles.cancelButton} onClick={onClose}>취소</button>
          <button type="submit" form="boardWriteForm" className={styles.submitButton}
            disabled={submitting || uploading}>
            {submitting ? '등록 중...' : '등록'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── 메인 컴포넌트 ────────────────────────────────────────
function BoardList({ posts, onRefresh }) {
  const navigate = useNavigate();
  const { token, isAdmin } = useAuth();

  const [currentPage,      setCurrentPage]      = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [searchTerm,       setSearchTerm]       = useState('');
  const [writeOpen,        setWriteOpen]        = useState(false);
  const [replyTarget,      setReplyTarget]      = useState(null);

  const itemsPerPage = 10;

  // 카테고리 우선순위: 공지(0) → 안내(1) → 일반(2)
  const CATEGORY_ORDER = { '공지': 0, '안내': 1, '일반': 2 };

  // 카테고리 필터 (비밀글: 제목이 가려진 채로 목록에 포함됨)
  const filtered = posts
    .filter(post => {
      const matchCat  = selectedCategory === '전체' || post.freeboardRolename === selectedCategory;
      const matchWord = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (post.name || '').toLowerCase().includes(searchTerm.toLowerCase());
      return matchCat && matchWord;
    })
    .sort((a, b) => {
      const oa = CATEGORY_ORDER[a.freeboardRolename] ?? 2;
      const ob = CATEGORY_ORDER[b.freeboardRolename] ?? 2;
      return oa - ob;
    });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIdx   = (currentPage - 1) * itemsPerPage;
  const paginated  = filtered.slice(startIdx, startIdx + itemsPerPage);

  const handleSearch = (e) => { e.preventDefault(); setCurrentPage(1); };

  const handleRowClick = (post) => {
    // 서버에서 이미 마스킹된 비밀글 (제목이 치환된 경우)
    if (post.title === '비밀 게시글입니다.') {
      alert('비밀 게시글은 작성자와 관리자만 볼 수 있습니다.');
      return;
    }
    navigate(`/community/${post.freeboardId}`, { state: { post } });
  };

  const handleDelete = async (e, postId) => {
    e.stopPropagation();
    if (!window.confirm('삭제하시겠습니까?')) return;
    const res = await fetch(`${API}/${postId}`, {
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (res.ok) { onRefresh?.(); }
    else alert('삭제 권한이 없거나 오류가 발생했습니다.');
  };

  return (
    <div className={styles.container}>

      {/* 상단 바 */}
      <div className={styles.topBar}>
        <div className={styles.filters}>
          {CATEGORIES.map(cat => (
            <button key={cat}
              className={clsx(styles.filterButton, selectedCategory === cat && styles.active)}
              onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}>
              {cat}
            </button>
          ))}
        </div>

        <div className={styles.topActions}>
          <form onSubmit={handleSearch} className={styles.searchBox}>
            <input type="text" placeholder="검색어를 입력하세요"
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              className={styles.searchInput} />
            <button type="submit" className={styles.searchButton}><FaSearch /></button>
          </form>
          <button className={styles.writeButton}
            onClick={() => token ? setWriteOpen(true) : alert('로그인 후 이용해주세요.')}>
            <FaPen /> 글쓰기
          </button>
        </div>
      </div>

      {/* 테이블 */}
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
                {isAdmin && <th style={{ width: '60px' }}></th>}
              </tr>
            </thead>
            <tbody>
              {paginated.map((post, idx) => {
                const isSecret   = post.title === '비밀 게시글입니다.';  // 서버 마스킹
                const isMySecret = post.isSecret === 'Y';               // 내가 볼 수 있는 비밀글
                const isNotice   = post.freeboardRolename === '공지';
                const isReplyRow = post.depth > 0;
                return (
                  <tr key={post.freeboardId} onClick={() => handleRowClick(post)}
                    style={{ cursor: isSecret ? 'not-allowed' : 'pointer' }}>
                    <td className={styles.numberCol}>
                      {startIdx + idx + 1}
                    </td>
                    <td className={styles.titleCol}>
                      <div className={styles.titleCell}>
                        {isReplyRow && (
                          <span style={{ paddingLeft: `${post.depth * 16}px`, color: 'var(--color-text-muted)' }}>
                            <FaReply size={11} style={{ marginRight: 4 }} />
                          </span>
                        )}
                        {post.freeboardRolename === '공지' && !isSecret && (
                          <span className={styles.badge}>{post.freeboardRolename}</span>
                        )}
                        {post.freeboardRolename === '안내' && !isSecret && (
                          <span className={styles.badgeInfo}>{post.freeboardRolename}</span>
                        )}
                        {(isSecret || isMySecret) && <FaLock size={12} style={{ marginRight: 6, color: 'var(--color-text-muted)' }} />}
                        <span style={{ color: isSecret ? 'var(--color-text-muted)' : 'inherit' }}>
                          {post.title}
                        </span>
                        {post.url && !isSecret && <FaPaperclip size={11} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />}
                      </div>
                    </td>
                    <td className={styles.authorCol}>{post.name}</td>
                    <td className={styles.dateCol}>
                      {post.regDate ? post.regDate.substring(0, 10) : ''}
                    </td>
                    <td className={styles.viewsCol}>{post.cnt}</td>
                    {isAdmin && (
                      <td onClick={e => e.stopPropagation()} style={{ textAlign: 'center' }}>
                        <button onClick={e => handleDelete(e, post.freeboardId)}
                          style={{ fontSize: '12px', color: '#e53e3e', background: 'none',
                                   border: 'none', cursor: 'pointer' }}>
                          삭제
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>

          <Pagination currentPage={currentPage} totalPages={totalPages}
            onPageChange={setCurrentPage} />
        </>
      ) : (
        <div className={styles.empty}>게시글이 없습니다.</div>
      )}

      {/* 하단 글쓰기 버튼 */}
      <div className={styles.bottomBar}>
        <button className={styles.writeButton}
          onClick={() => token ? setWriteOpen(true) : alert('로그인 후 이용해주세요.')}>
          <FaPen /> 글쓰기
        </button>
      </div>

      {/* 글쓰기 모달 */}
      {writeOpen && (
        <WriteModal onClose={() => setWriteOpen(false)} onSave={() => onRefresh?.()} />
      )}

      {/* 댓글 모달 */}
      {replyTarget && (
        <WriteModal
          parentPost={replyTarget}
          onClose={() => setReplyTarget(null)}
          onSave={() => { onRefresh?.(); setReplyTarget(null); }}
        />
      )}
    </div>
  );
}

export default BoardList;
