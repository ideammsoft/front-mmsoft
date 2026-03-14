import { useState, useEffect } from 'react';
import Button from '../common/Button';
import styles from './ProfileCompletionPanel.module.css';

const API = 'http://localhost:1882';

/**
 * mode='register' : OAuth 신규회원 추가정보 입력
 * mode='edit'     : 회원정보 수정
 *
 * onSaved(updatedUser) : 저장 완료 후 콜백
 */
function ProfileCompletionPanel({ mode = 'register', onClose, onSaved }) {
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [phone, setPhone]     = useState('');
  const [company, setCompany] = useState('');
  const [errors, setErrors]   = useState({});
  const [saving, setSaving]   = useState(false);

  const isEdit = mode === 'edit';
  const title  = isEdit ? '회원 정보 수정' : '추가 정보 입력';

  // 초기값 세팅: localStorage + 서버(수정 모드)
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('mmsoft_user') || '{}');
    setName(stored.name || '');
    setEmail(stored.email || '');
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
          setPhone(data.phone || '');
          setCompany(data.company || '');
        })
        .catch(() => {});
    }
  }, [isEdit]);

  const validate = () => {
    const errs = {};
    if (!phone.trim())  errs.phone  = '휴대폰 번호는 필수 입력 사항입니다';
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
      body: JSON.stringify({ name, email, phone, company }),
    })
      .then(r => { if (!r.ok) throw new Error('저장 실패'); return r.json(); })
      .then(() => {
        const prev    = JSON.parse(localStorage.getItem('mmsoft_user') || '{}');
        const updated = { ...prev, name, email, phone, company };
        localStorage.setItem('mmsoft_user', JSON.stringify(updated));
        onSaved?.(updated);
      })
      .catch(() => alert('저장에 실패했습니다. 다시 시도해주세요.'))
      .finally(() => setSaving(false));
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
    <div className={styles.overlay} onClick={onClose}>
      <div className={`${styles.panel} ${saving ? styles.saving : ''}`}
           onClick={e => e.stopPropagation()}>

        <div className={styles.panelHeader}>
          <h3 className={styles.title}>{title}</h3>
          <button className={styles.closeButton} onClick={onClose}>&times;</button>
        </div>

        {!isEdit && (
          <p className={styles.description}>서비스 이용을 위해 추가 정보를 입력해 주세요.</p>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>

          <div className={styles.fieldWrapper}>
            <div className={styles.labelRow}>
              <label className={styles.label} htmlFor="phone">휴대폰 번호</label>
              <span className={styles.requiredMark}>필수</span>
            </div>
            <input id="phone" type="tel" placeholder="010-0000-0000"
              value={phone} onChange={handleChange(setPhone, 'phone')}
              className={styles.input} />
            {errors.phone && <p className={styles.errorMessage}>{errors.phone}</p>}
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
          <span className={styles.withdrawLink} onClick={handleWithdraw}>
            회원 탈퇴
          </span>
        )}
      </div>
    </div>
  );
}

export default ProfileCompletionPanel;
