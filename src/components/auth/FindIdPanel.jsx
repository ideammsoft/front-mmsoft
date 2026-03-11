import { useState } from 'react';
import Button from '../common/Button';
import styles from './LoginPanel.module.css';
import findStyles from './FindIdPanel.module.css';

function FindIdPanel({ onClose, onFoundId }) {
  const [method, setMethod] = useState('email'); // 'email' | 'phone'
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!value.trim()) return;

    const body = {
      idOrPass: 'id',
      homepageId: '',
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

      if (!res.ok) {
        alert('가입하신 아이디가 없습니다.');
      } else {
        // JSON 응답 처리: {"foundId":"2222"} → "2222"
        let foundId = result;
        try {
          const parsed = JSON.parse(result);
          foundId = parsed.foundId ?? parsed.id ?? parsed.userId ?? result;
        } catch {
          // 일반 텍스트면 그대로 사용
        }
        if (!foundId || foundId === '없음') {
          alert('가입하신 아이디가 없습니다.');
        } else {
          alert(`가입하신 아이디는 "${foundId}" 입니다.`);
          onFoundId?.(foundId);
          onClose();
        }
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
          <h3 className={styles.title}>아이디 찾기</h3>
          <button className={styles.closeButton} onClick={onClose}>&times;</button>
        </div>

        <p className={findStyles.description}>
          가입 시 등록한 이메일 또는 휴대폰 번호로 아이디를 찾을 수 있습니다.
        </p>

        {/* 방법 선택 탭 */}
        <div className={findStyles.tabs}>
          <button
            type="button"
            className={`${findStyles.tab} ${method === 'email' ? findStyles.tabActive : ''}`}
            onClick={() => handleMethodChange('email')}
          >
            이메일로 찾기
          </button>
          <button
            type="button"
            className={`${findStyles.tab} ${method === 'phone' ? findStyles.tabActive : ''}`}
            onClick={() => handleMethodChange('phone')}
          >
            휴대폰으로 찾기
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
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
              autoFocus
            />
          </div>

          <Button type="submit" variant="primary" size="lg" disabled={loading}>
            {loading ? '확인 중...' : '아이디 찾기'}
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

export default FindIdPanel;
