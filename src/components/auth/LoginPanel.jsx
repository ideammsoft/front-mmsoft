import { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import SocialLoginButtons from './SocialLoginButtons';
import ProfileCompletionPanel from './ProfileCompletionPanel';
import SignUpPanel from './SignUpPanel';
import styles from './LoginPanel.module.css';

function LoginPanel({ onClose, onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showProfileCompletion, setShowProfileCompletion] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:1882/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ homepageId: username, password }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err.message || '아이디 또는 비밀번호가 올바르지 않습니다.');
        return;
      }
      const data = await res.json();
      const name = data.name || data.user?.name || username;
      localStorage.setItem('mmsoft_user', JSON.stringify({ name }));
      onLoginSuccess?.({ name });
      onClose();
    } catch {
      alert('서버 연결에 실패했습니다.');
    }
  };

  const handleLinkClick = (action) => {
    alert(`${action} 기능은 구현 예정입니다.`);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.panelHeader}>
          <h3 className={styles.title}>로그인</h3>
          <button className={styles.closeButton} onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.fieldRow}>
            <label htmlFor="username" className={styles.fieldLabel}>아 이 디</label>
            <input
              id="username"
              type="text"
              placeholder="아이디를 입력하세요"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={styles.fieldInput}
              required
            />
          </div>

          <div className={styles.fieldRow}>
            <label htmlFor="password" className={styles.fieldLabel}>비밀번호</label>
            <input
              id="password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.fieldInput}
              required
            />
          </div>

          <Button type="submit" variant="primary" size="lg">
            로그인
          </Button>

          <div className={styles.links}>
            <span
              className={styles.link}
              onClick={() => setShowSignUp(true)}
            >
              회원가입
            </span>
            <span
              className={styles.link}
              onClick={() => handleLinkClick('아이디 찾기')}
            >
              아이디 찾기
            </span>
            <span
              className={styles.link}
              onClick={() => handleLinkClick('비밀번호 찾기')}
            >
              비밀번호 찾기
            </span>
          </div>
        </form>

        <SocialLoginButtons />

        <div className={styles.info}>
          데모 버전입니다 &nbsp;|&nbsp;
          <span
            className={styles.link}
            onClick={() => setShowProfileCompletion(true)}
          >
            추가정보 입력 테스트
          </span>
        </div>
      </div>

      {showProfileCompletion && (
        <ProfileCompletionPanel onClose={() => setShowProfileCompletion(false)} />
      )}

      {showSignUp && (
        <SignUpPanel onClose={() => setShowSignUp(false)} />
      )}
    </div>
  );
}

export default LoginPanel;
