import { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { FaChevronLeft, FaUser, FaCalendar, FaEye, FaReply, FaLock,
         FaPaperclip, FaTimes, FaPen } from 'react-icons/fa';
import styles from './PostDetailPage.module.css';

const API = 'http://localhost:1882/api/freeboard';

function useAuth() {
  try {
    const user  = JSON.parse(localStorage.getItem('mmsoft_user') || '{}');
    const token = localStorage.getItem('mmsoft_access_token');
    let roles = [];
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      roles = payload.roles || [];
    }
    const isAdmin = roles.some(r => r === 'ROLE_admin' || r === 'ROLE_super_admin');
    const accountId = user.accountId || null;
    return { user, token, isAdmin, accountId };
  } catch {
    return { user: {}, token: null, isAdmin: false, accountId: null };
  }
}

// ─── 댓글/글쓰기 모달 ──────────────────────────────────────
function WriteModal({ onClose, onSave, parentPost = null, editPost = null }) {
  const { user, token } = useAuth();
  const isReply = !!parentPost;
  const isEdit  = !!editPost;
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    title   : isEdit ? editPost.title : (isReply ? `Re: ${parentPost.title}` : ''),
    content : isEdit ? editPost.content : '',
    freeboardRolename: isEdit ? editPost.freeboardRolename : '일반',
    isSecret: isEdit ? (editPost.isSecret || 'N') : 'N',
  });
  const [fileName,   setFileName]   = useState('');
  const [uploading,  setUploading]  = useState(false);
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
    if (file.size > 10 * 1024 * 1024) { alert('파일 크기는 10MB 이하여야 합니다.'); return; }
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
      let url, method;
      if (isEdit) {
        url    = `${API}/${editPost.freeboardId}`;
        method = 'PUT';
      } else if (isReply) {
        url    = `${API}/${parentPost.freeboardId}/reply`;
        method = 'POST';
      } else {
        url    = API;
        method = 'POST';
      }
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ ...form, name: user.name || user.homepageId || '익명' }),
      });
      if (!res.ok) throw new Error();
      alert(isEdit ? '수정되었습니다.' : isReply ? '댓글이 등록되었습니다.' : '등록되었습니다.');
      onSave?.();
      onClose();
    } catch { alert('처리 중 오류가 발생했습니다.'); }
    finally { setSubmitting(false); }
  };

  const title = isEdit ? '글 수정' : isReply ? '댓글 쓰기' : '글쓰기';

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{title}</h2>
          <button className={styles.modalClose} onClick={onClose}><FaTimes /></button>
        </div>

        <form id="postWriteForm" onSubmit={handleSubmit} className={styles.modalBody}>
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
                <label style={{ display:'inline-flex', alignItems:'center', gap:'8px',
                                fontSize:'var(--font-size-sm)', color:'var(--color-text-light)', cursor:'pointer' }}>
                  <input type="checkbox" name="isSecret"
                    checked={form.isSecret === 'Y'} onChange={handleChange}
                    style={{ width:16, height:16, accentColor:'var(--color-primary)', cursor:'pointer' }} />
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
                <span className={styles.fileName}>{fileName || (editPost?.url ? '기존 파일 있음' : '선택된 파일 없음')}</span>
                <input type="file" ref={fileRef} onChange={handleFileChange}
                  style={{ display: 'none' }} />
              </div>
            </div>
          )}
        </form>

        <div className={styles.modalFooter}>
          <button type="button" className={styles.cancelButton} onClick={onClose}>취소</button>
          <button type="submit" form="postWriteForm" className={styles.submitButton}
            disabled={submitting || uploading}>
            {submitting ? '처리 중...' : isEdit ? '수정' : '등록'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── 메인 페이지 ──────────────────────────────────────────
function PostDetailPage() {
  const { postId }   = useParams();
  const location     = useLocation();
  const navigate     = useNavigate();
  const { token, isAdmin, accountId } = useAuth();

  const [post,        setPost]        = useState(location.state?.post || null);
  const [replies,     setReplies]     = useState([]);
  const [loading,     setLoading]     = useState(!location.state?.post);
  const [replyOpen,   setReplyOpen]   = useState(false);
  const [replyTarget, setReplyTarget] = useState(null);   // 답글 대상 (post or reply)
  const [editOpen,    setEditOpen]    = useState(false);
  const [editTarget,  setEditTarget]  = useState(null);   // post or reply

  const fetchPost = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/${postId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.status === 403) {
        alert('비밀 게시글은 작성자와 관리자만 볼 수 있습니다.');
        navigate('/community');
        return;
      }
      if (!res.ok) throw new Error();
      const data = await res.json();
      setPost(data);
    } catch {
      setPost(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchReplies = async () => {
    try {
      const res = await fetch(`${API}?keyword=`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) return;
      const all = await res.json();
      // same ref, depth > 0, not is parent itself
      if (post) {
        const related = all.filter(p =>
          p.ref === post.ref && p.depth > 0
        );
        setReplies(related);
      }
    } catch { /* ignore */ }
  };

  useEffect(() => {
    fetchPost();
  }, [postId]);

  useEffect(() => {
    if (post) fetchReplies();
  }, [post]);

  const handleDelete = async (targetId) => {
    if (!window.confirm('삭제하시겠습니까?')) return;
    const res = await fetch(`${API}/${targetId}`, {
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (res.ok) {
      if (targetId === post?.freeboardId) {
        navigate('/community');
      } else {
        fetchPost();
        fetchReplies();
      }
    } else {
      alert('삭제 권한이 없거나 오류가 발생했습니다.');
    }
  };

  const canModify = (item) =>
    isAdmin || (accountId && accountId === item?.accountId);

  const handleRefresh = () => {
    fetchPost();
    fetchReplies();
  };

  if (loading) {
    return (
      <div className={styles.pageWrapper}>
        <p style={{ color: 'var(--color-text-muted)' }}>불러오는 중...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.notFound}>
          <h1 className={styles.notFoundTitle}>게시글을 찾을 수 없습니다</h1>
          <p className={styles.notFoundText}>요청하신 게시글이 존재하지 않거나 삭제되었습니다.</p>
          <Link to="/community" className={styles.backButton}>
            <FaChevronLeft /> 목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.card}>
        {/* 헤더 */}
        <div className={styles.cardHeader}>
          {post.freeboardRolename !== '일반' && (
            <span className={styles.badge}>{post.freeboardRolename}</span>
          )}
          {post.isSecret === 'Y' && (
            <FaLock size={13} style={{ marginRight: 6, color: 'var(--color-text-muted)' }} />
          )}
          <h1 className={styles.title}>{post.title}</h1>
          <div className={styles.meta}>
            <span className={styles.metaItem}><FaUser size={13} />{post.name}</span>
            <span className={styles.metaItem}>
              <FaCalendar size={13} />
              {post.regDate ? post.regDate.substring(0, 10) : ''}
            </span>
            <span className={styles.metaItem}><FaEye size={13} />조회 {post.cnt}</span>
          </div>
        </div>

        {/* 본문 */}
        <div className={styles.content}>
          <p style={{ whiteSpace: 'pre-wrap' }}>{post.content}</p>
          {post.url && (
            <div className={styles.attachment}>
              <FaPaperclip size={13} style={{ marginRight: 6 }} />
              <a href={`${API}/files/${post.url}`} target="_blank" rel="noreferrer"
                style={{ color: 'var(--color-primary)', fontSize: 'var(--font-size-sm)' }}>
                {post.url.replace(/^\d+_/, '')}
              </a>
            </div>
          )}
        </div>

        {/* 댓글 목록 */}
        {replies.length > 0 && (
          <div className={styles.replySection}>
            <div className={styles.replySectionTitle}>댓글 {replies.length}개</div>
            {replies.map(r => (
              <div key={r.freeboardId} className={styles.replyItem}
                style={{ paddingLeft: `${r.depth * 20 + 16}px` }}>
                <div className={styles.replyMeta}>
                  <span className={styles.replyAuthor}>{r.name}</span>
                  <span className={styles.replyDate}>
                    {r.regDate ? r.regDate.substring(0, 10) : ''}
                  </span>
                  <div className={styles.replyActions}>
                    {token && (
                      <button onClick={() => { setReplyTarget(r); setReplyOpen(true); }}
                        style={{ fontSize: '12px', color: 'var(--color-text-muted)',
                                 background: 'none', border: 'none', cursor: 'pointer' }}>
                        <FaReply size={10} style={{ marginRight: 3 }} />답글
                      </button>
                    )}
                    {canModify(r) && (
                      <>
                        <button onClick={() => { setEditTarget(r); setEditOpen(true); }}
                          style={{ fontSize: '12px', color: 'var(--color-primary)',
                                   background: 'none', border: 'none', cursor: 'pointer' }}>
                          수정
                        </button>
                        <button onClick={() => handleDelete(r.freeboardId)}
                          style={{ fontSize: '12px', color: '#e53e3e',
                                   background: 'none', border: 'none', cursor: 'pointer' }}>
                          삭제
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <p className={styles.replyContent}>{r.content}</p>
              </div>
            ))}
          </div>
        )}

        {/* 푸터 */}
        <div className={styles.footer}>
          <Link to="/community" className={styles.backButton}>
            <FaChevronLeft /> 목록으로
          </Link>
          <div className={styles.actions}>
            {token && (
              <button className={styles.replyButton} onClick={() => setReplyOpen(true)}>
                <FaReply /> 댓글 쓰기
              </button>
            )}
            {canModify(post) && (
              <>
                <button className={styles.editButton}
                  onClick={() => { setEditTarget(post); setEditOpen(true); }}>
                  <FaPen /> 수정
                </button>
                <button className={styles.deleteButton}
                  onClick={() => handleDelete(post.freeboardId)}>
                  삭제
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 댓글/답글 모달 */}
      {replyOpen && (
        <WriteModal parentPost={replyTarget || post}
          onClose={() => { setReplyOpen(false); setReplyTarget(null); }}
          onSave={handleRefresh} />
      )}

      {/* 수정 모달 */}
      {editOpen && editTarget && (
        <WriteModal editPost={editTarget}
          onClose={() => { setEditOpen(false); setEditTarget(null); }}
          onSave={handleRefresh} />
      )}
    </div>
  );
}

export default PostDetailPage;
