import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FaChevronLeft, FaUser, FaCalendar, FaLink, FaDownload, FaEdit } from 'react-icons/fa';
import styles from './PostDetailPage.module.css';

// ─── 수정 모달 ───
function EditModal({ post, onClose, onSave }) {
  const [form, setForm] = useState({
    title   : post.title,
    content : post.content,
    url     : post.url || '',
    category: post.category || '일반',
    passwd  : post.passwd || '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }
    setSubmitting(true);
    try {
      const token = localStorage.getItem('mmsoft_access_token');
      const res = await fetch(`http://localhost:1882/api/workboard/update/${post.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(form),
      });
      const text = await res.text();
      if (!res.ok) {
        alert(`수정 실패 (${res.status}): ${text}`);
        return;
      }
      alert('수정되었습니다.');
      onSave?.();
      onClose();
    } catch (err) {
      alert(`수정 중 오류: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>수정</h2>
          <button className={styles.modalClose} onClick={onClose} aria-label="닫기">✕</button>
        </div>
        <form id="editForm" onSubmit={handleSubmit} className={styles.modalBody}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>제목</label>
            <input type="text" name="title" value={form.title} onChange={handleChange}
              className={styles.formInput} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>카테고리</label>
            <select name="category" value={form.category} onChange={handleChange} className={styles.formInput}>
              <option value="주문제작">주문제작</option>
              <option value="일반">일반</option>
              <option value="기타">기타</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>내용</label>
            <textarea name="content" value={form.content} onChange={handleChange}
              className={styles.formTextarea} rows={6} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>파일명</label>
            <input type="text" name="url" value={form.url} onChange={handleChange}
              className={styles.formInput} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>비밀번호</label>
            <input type="text" name="passwd" value={form.passwd} onChange={handleChange}
              placeholder="비밀번호 입력" className={styles.formInput} />
          </div>
        </form>
        <div className={styles.modalFooter}>
          <button type="button" className={styles.cancelButton} onClick={onClose}>취소</button>
          <button type="submit" form="editForm" className={styles.submitButton} disabled={submitting}>
            {submitting ? '저장 중...' : '저장'}
          </button>
        </div>
      </div>
    </div>
  );
}

function ProjectPostDetailPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [post, setPost] = useState(location.state?.post || null);
  const [loading, setLoading] = useState(!location.state?.post);
  const [editOpen, setEditOpen] = useState(false);

  const roleName = (() => {
    try { return JSON.parse(localStorage.getItem('mmsoft_user'))?.roleName || ''; } catch { return ''; }
  })();
  const canEdit = roleName === 'super_admin';

  // 비밀번호 확인 상태 (관리자는 바로 통과)
  const [verified, setVerified] = useState(canEdit);
  const [pwInput, setPwInput] = useState('');
  const [pwError, setPwError] = useState('');
  const [pwChecking, setPwChecking] = useState(false);

  // 직접 URL 접근 시 API에서 글 찾기
  useEffect(() => {
    if (post) return;
    const token = localStorage.getItem('mmsoft_access_token');
    fetch('http://localhost:1882/api/workboard/projects', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        const found = data.find(p => String(p.workboardId) === String(postId));
        if (found) {
          setPost({
            id:       found.workboardId,
            title:    found.title,
            content:  found.content,
            author:   found.name,
            date:     found.regDate ? found.regDate.substring(0, 10) : '',
            category: found.workboardRolename || '일반',
            url:      found.url || '',
            passwd:   found.passwd || '',
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [postId, post]);

  const handlePasswordCheck = async (e) => {
    e.preventDefault();
    if (!pwInput.trim()) { setPwError('비밀번호를 입력해주세요.'); return; }
    setPwChecking(true);
    setPwError('');
    try {
      const token = localStorage.getItem('mmsoft_access_token');
      const res = await fetch('http://localhost:1882/api/workboard/checkpw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ workboardId: Number(postId), passwd: pwInput }),
      });
      if (res.ok) {
        setVerified(true);
      } else {
        setPwError('비밀번호가 일치하지 않습니다.');
      }
    } catch {
      setPwError('확인 중 오류가 발생했습니다.');
    } finally {
      setPwChecking(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('게시글을 삭제하시겠습니까?')) return;
    try {
      const token = localStorage.getItem('mmsoft_access_token');
      const res = await fetch(`http://localhost:1882/api/workboard/delete/${postId}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error('삭제 실패');
      alert('삭제되었습니다.');
      navigate('/projects');
    } catch {
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  const handleEditSave = () => {
    // 수정 후 최신 데이터 다시 불러오기
    setPost(null);
    setLoading(true);
  };

  if (loading) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.notFound}><p>불러오는 중...</p></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.notFound}>
          <h1 className={styles.notFoundTitle}>게시글을 찾을 수 없습니다</h1>
          <p className={styles.notFoundText}>요청하신 게시글이 존재하지 않거나 삭제되었습니다.</p>
          <Link to="/projects" className={styles.backButton}>
            <FaChevronLeft /> 목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  // 비밀번호 확인 화면 (비관리자)
  if (!verified) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.categoryTag}>{post.category}</span>
            <h1 className={styles.title}>{post.title}</h1>
          </div>
          <div className={styles.content}>
            <p style={{ marginBottom: '16px', color: 'var(--color-text-muted)' }}>
              이 게시글은 비밀번호로 보호되어 있습니다.
            </p>
            <form onSubmit={handlePasswordCheck} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', flexDirection: 'column', maxWidth: '300px' }}>
              <input
                type="password"
                value={pwInput}
                onChange={e => setPwInput(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                style={{ padding: '8px 12px', border: '1px solid var(--color-border)', borderRadius: '4px', fontSize: 'var(--font-size-sm)', width: '100%' }}
                autoFocus
              />
              {pwError && <p style={{ color: 'red', fontSize: 'var(--font-size-sm)', margin: 0 }}>{pwError}</p>}
              <button type="submit" disabled={pwChecking}
                style={{ padding: '8px 20px', background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                {pwChecking ? '확인 중...' : '확인'}
              </button>
            </form>
          </div>
          <div className={styles.footer}>
            <Link to="/projects" className={styles.backButton}>
              <FaChevronLeft /> 목록으로
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.categoryTag}>{post.category}</span>
          <h1 className={styles.title}>{post.title}</h1>
          <div className={styles.meta}>
            <span className={styles.metaItem}>
              <FaUser size={13} />
              {post.author}
            </span>
            <span className={styles.metaItem}>
              <FaCalendar size={13} />
              {post.date}
            </span>
          </div>
        </div>

        <div className={styles.content}>
          <p style={{ whiteSpace: 'pre-wrap' }}>{post.content}</p>

          {post.url && (
            <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--color-border)' }}>
              <div style={{ marginBottom: '8px' }}>
                <FaLink size={12} style={{ marginRight: '6px', verticalAlign: 'middle', color: 'var(--color-text-muted)' }} />
                <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', marginRight: '8px' }}>
                  첨부 링크
                </span>
                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-primary)', textDecoration: 'underline', wordBreak: 'break-all' }}
                >
                  {post.url}
                </a>
              </div>
              <a
                href={post.url}
                download
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', background: 'var(--color-primary)', color: '#fff', borderRadius: '4px', fontSize: 'var(--font-size-sm)', textDecoration: 'none' }}
              >
                <FaDownload size={12} /> 다운로드
              </a>
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <Link to="/projects" className={styles.backButton}>
            <FaChevronLeft /> 목록으로
          </Link>
          {canEdit && (
            <div className={styles.actions}>
              <button className={styles.editButton} onClick={() => setEditOpen(true)}>
                <FaEdit size={13} /> 수정
              </button>
              <button className={styles.deleteButton} onClick={handleDelete}>
                삭제
              </button>
            </div>
          )}
        </div>
      </div>

      {editOpen && (
        <EditModal
          post={post}
          onClose={() => setEditOpen(false)}
          onSave={handleEditSave}
        />
      )}
    </div>
  );
}

export default ProjectPostDetailPage;
