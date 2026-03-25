import { useState, useEffect, useRef } from 'react';
import Button from '../common/Button';
import styles from './ProfileCompletionPanel.module.css';

const API = '';

/**
 * mode='register' : OAuth 신규회원 추가정보 입력
 * mode='edit'     : 회원정보 수정
 *
 * onSaved(updatedUser) : 저장 완료 후 콜백
 */
function ProfileCompletionPanel({ mode = 'register', onClose, onSaved }) {
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [mphone, setMphone]   = useState('');  // 휴대폰
  const [phone, setPhone]     = useState('');  // 회사전화
  const [company, setCompany] = useState('');
  const [errors, setErrors]   = useState({});
  const [saving, setSaving]   = useState(false);

  // 비밀번호 변경 폼
  const [showPwForm, setShowPwForm]       = useState(false);
  const [currentPw, setCurrentPw]         = useState('');
  const [newPw, setNewPw]                 = useState('');
  const [confirmPw, setConfirmPw]         = useState('');
  const [pwError, setPwError]             = useState('');
  const [pwSaving, setPwSaving]           = useState(false);

  const isEdit  = mode === 'edit';
  const title   = isEdit ? '회원 정보 수정' : '추가 정보 입력';
  const loginId = JSON.parse(localStorage.getItem('mmsoft_user') || '{}').homepageId || '';
  const overlayMouseDown = useRef(false);

  // 초기값 세팅: localStorage + 서버(수정 모드)
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('mmsoft_user') || '{}');
    setName(stored.name || '');
    setEmail(stored.email || '');
    setMphone(stored.mphone || '');
    setPhone(stored.phone || '');
    setCompany(stored.company || '');

    if (isEdit) {
      const token = localStorage.getItem('mmsoft_access_token');
      if (!token) return;
      fetch(`${API}/api/members/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(r => r.ok ? r.json() : null)
        .then(data => {
          if (!data) return;
          setName(data.name || '');
          setEmail(data.email || '');
          setMphone(data.mphone || '');
          setPhone(data.phone || '');
          setCompany(data.company || '');
        })
        .catch(() => {});
    }
  }, [isEdit]);

  const validate = () => {
    const errs = {};
    if (!mphone.trim()) errs.mphone = '휴대폰 번호는 필수 입력 사항입니다';
    if (!email.trim())  errs.email  = '이메일은 필수 입력 사항입니다';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    const token = localStorage.getItem('mmsoft_access_token');
    if (!token) { alert('로그인이 필요합니다.'); return; }

    setSaving(true);
    fetch(`${API}/api/members/me`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, email, mphone, phone, company }),
    })
      .then(r => { if (!r.ok) throw new Error('저장 실패'); return r.json(); })
      .then(() => {
        const prev    = JSON.parse(localStorage.getItem('mmsoft_user') || '{}');
        const updated = { ...prev, name, email, mphone, phone, company };
        localStorage.setItem('mmsoft_user', JSON.stringify(updated));
        onSaved?.(updated);
      })
      .catch(() => alert('저장에 실패했습니다. 다시 시도해주세요.'))
      .finally(() => setSaving(false));
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwError('');
    if (!currentPw) { setPwError('현재 비밀번호를 입력해주세요.'); return; }
    if (newPw.length < 4) { setPwError('새 비밀번호는 4자 이상이어야 합니다.'); return; }
    if (newPw !== confirmPw) { setPwError('새 비밀번호가 일치하지 않습니다.'); return; }

    const token = localStorage.getItem('mmsoft_access_token');
    if (!token) { alert('로그인이 필요합니다.'); return; }

    setPwSaving(true);
    try {
      const res = await fetch(`${API}/api/members/me/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setPwError(err.message || '비밀번호 변경에 실패했습니다.');
        return;
      }
      alert('비밀번호가 변경되었습니다.');
      setShowPwForm(false);
      setCurrentPw(''); setNewPw(''); setConfirmPw('');
    } catch {
      setPwError('서버 연결에 실패했습니다.');
    } finally {
      setPwSaving(false);
    }
  };

  const handleWithdraw = () => {
    if (!window.confirm('정말로 탈퇴 하시겠습니까?')) return;
    const token = localStorage.getItem('mmsoft_access_token');
    if (!token) return;

    fetch(`${API}/api/members/me`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => { if (!r.ok) throw new Error(); })
      .then(() => {
        localStorage.removeItem('mmsoft_user');
        localStorage.removeItem('mmsoft_access_token');
        alert('회원 탈퇴가 완료되었습니다.');
        onClose?.();
        window.location.href = '/';
      })
      .catch(() => alert('탈퇴 처리에 실패했습니다.'));
  };

  const handleChange = (setter, field) => (e) => {
    setter(e.target.value);
    if (e.target.value.trim()) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  return (
    <div
      className={styles.overlay}
      onMouseDown={e => { overlayMouseDown.current = e.target === e.currentTarget; }}
      onMouseUp={e => { if (overlayMouseDown.current && e.target === e.currentTarget) onClose(); }}
    >
      <div className={`${styles.panel} ${saving ? styles.saving : ''}`}>

        <div className={styles.panelHeader}>
          <h3 className={styles.title}>
            {title}
            {isEdit && loginId && (
              <span className={styles.loginIdBadge}>{loginId}</span>
            )}
          </h3>
          <button className={styles.closeButton} onClick={onClose}>&times;</button>
        </div>

        {!isEdit && (
          <p className={styles.description}>서비스 이용을 위해 추가 정보를 입력해 주세요.</p>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>

          <div className={styles.fieldWrapper}>
            <div className={styles.labelRow}>
              <label className={styles.label} htmlFor="mphone">휴대폰 번호</label>
              <span className={styles.requiredMark}>필수</span>
            </div>
            <input id="mphone" type="tel" placeholder="010-0000-0000"
              value={mphone} onChange={handleChange(setMphone, 'mphone')}
              className={styles.input} />
            {errors.mphone && <p className={styles.errorMessage}>{errors.mphone}</p>}
          </div>

          <div className={styles.fieldWrapper}>
            <div className={styles.labelRow}>
              <label className={styles.label} htmlFor="email">이메일</label>
              <span className={styles.requiredMark}>필수</span>
            </div>
            <input id="email" type="email" placeholder="이메일을 입력하세요"
              value={email} onChange={handleChange(setEmail, 'email')}
              className={styles.input} />
            {errors.email && <p className={styles.errorMessage}>{errors.email}</p>}
          </div>

          <div className={styles.fieldWrapper}>
            <label className={styles.label} htmlFor="name">성명</label>
            <input id="name" type="text" placeholder="이름을 입력하세요"
              value={name} onChange={e => setName(e.target.value)}
              className={styles.input} />
          </div>

          <div className={styles.fieldWrapper}>
            <label className={styles.label} htmlFor="phone">회사전화</label>
            <input id="phone" type="tel" placeholder="회사 전화번호를 입력하세요"
              value={phone} onChange={handleChange(setPhone, 'phone')}
              className={styles.input} />
          </div>

          <div className={styles.fieldWrapper}>
            <label className={styles.label} htmlFor="company">회사명</label>
            <input id="company" type="text" placeholder="회사명을 입력하세요"
              value={company} onChange={e => setCompany(e.target.value)}
              className={styles.input} />
          </div>

          <Button type="submit" variant="primary" size="lg" disabled={saving}>
            {saving ? '저장 중...' : '확인'}
          </Button>
        </form>

        {isEdit && (
          <div className={styles.bottomLinks}>
            <span className={styles.actionLink} onClick={() => { setShowPwForm(v => !v); setPwError(''); }}>
              비밀번호 변경
            </span>
            <span className={styles.withdrawLink} onClick={handleWithdraw}>
              회원 탈퇴
            </span>
          </div>
        )}

        {isEdit && showPwForm && (
          <form onSubmit={handlePasswordChange} className={styles.pwForm}>
            <div className={styles.fieldWrapper}>
              <label className={styles.label}>현재 비밀번호</label>
              <input type="password" value={currentPw} onChange={e => setCurrentPw(e.target.value)}
                placeholder="현재 비밀번호" className={styles.input} />
            </div>
            <div className={styles.fieldWrapper}>
              <label className={styles.label}>새 비밀번호</label>
              <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)}
                placeholder="새 비밀번호 (4자 이상)" className={styles.input} />
            </div>
            <div className={styles.fieldWrapper}>
              <label className={styles.label}>새 비밀번호 확인</label>
              <input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)}
                placeholder="새 비밀번호 재입력" className={styles.input} />
            </div>
            {pwError && <p className={styles.errorMessage}>{pwError}</p>}
            <button type="submit" className={styles.pwSubmitButton} disabled={pwSaving}>
              {pwSaving ? '변경 중...' : '비밀번호 변경'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ProfileCompletionPanel;
