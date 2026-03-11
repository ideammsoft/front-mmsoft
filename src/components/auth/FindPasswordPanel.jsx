import { useState } from 'react';
import Button from '../common/Button';
import styles from './LoginPanel.module.css';
import findStyles from './FindIdPanel.module.css';

function FindPasswordPanel({ onClose }) {
  const [method, setMethod] = useState('email'); // 'email' | 'phone'
  const [homepageId, setHomepageId] = useState('');
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!homepageId.trim() || !value.trim()) return;

    const body = {
      idOrPass: 'password',
      homepageId: homepageId.trim(),
      email: method === 'email' ? value.trim() : '',
      phone: method === 'phone' ? value.trim() : '',
    };

    setLoading(true);
    try {
      const res = await fetch('http://localhost:1882/api/auth/idpassfind', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const text = await res.text();
      const result = text.trim();

      let isOk = false;
      try {
        const parsed = JSON.parse(result);
        isOk = parsed.newPassword === 'ok';
      } catch {
        isOk = result === 'ok';
      }

      if (isOk) {
        const msg = method === 'email'
          ? '이메일로 임시 비밀번호를 보내드렸습니다. 확인 바랍니다.'
          : '휴대폰 문자메시지로 임시 비밀번호를 보내드렸습니다. 확인 바랍니다.';
        alert(msg);
        onClose();
      } else {
        alert('입력하신 정보가 일치하지 않습니다.');
      }
    } catch {
      alert('서버 연결에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleMethodChange = (newMethod) => {
    setMethod(newMethod);
    setValue('');
  };

  return (
    <div className={styles.overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.panelHeader}>
          <h3 className={styles.title}>비밀번호 찾기</h3>
          <button className={styles.closeButton} onClick={onClose}>&times;</button>
        </div>

        <p className={findStyles.description}>
          가입 시 등록한 아이디와 이메일 또는 휴대폰 번호로 임시 비밀번호를 받으실 수 있습니다.
        </p>

        {/* 방법 선택 탭 */}
        <div className={findStyles.tabs}>
          <button
            type="button"
            className={`${findStyles.tab} ${method === 'email' ? findStyles.tabActive : ''}`}
            onClick={() => handleMethodChange('email')}
          >
            이메일로 받기
          </button>
          <button
            type="button"
            className={`${findStyles.tab} ${method === 'phone' ? findStyles.tabActive : ''}`}
            onClick={() => handleMethodChange('phone')}
          >
            휴대폰으로 받기
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.fieldRow}>
            <label className={styles.fieldLabel}>아 이 디</label>
            <input
              type="text"
              placeholder="아이디를 입력하세요"
              value={homepageId}
              onChange={(e) => setHomepageId(e.target.value)}
              className={styles.fieldInput}
              required
              autoFocus
            />
          </div>

          <div className={styles.fieldRow}>
            <label className={styles.fieldLabel}>
              {method === 'email' ? '이메일' : '휴대폰'}
            </label>
            <input
              type={method === 'email' ? 'email' : 'tel'}
              placeholder={method === 'email' ? '이메일 주소를 입력하세요' : '휴대폰 번호를 입력하세요'}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className={styles.fieldInput}
              required
            />
          </div>

          <Button type="submit" variant="primary" size="lg" disabled={loading}>
            {loading ? '확인 중...' : '비밀번호 찾기'}
          </Button>

          <div className={styles.links}>
            <span className={styles.link} onClick={onClose}>
              로그인으로 돌아가기
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FindPasswordPanel;
