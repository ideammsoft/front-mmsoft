import styles from './SocialLoginButtons.module.css';

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
      <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
      <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
      <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/>
      <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
    </svg>
  );
}

function NaverIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path fill="#ffffff" d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z"/>
    </svg>
  );
}

function KakaoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path fill="#000000" d="M12 3C6.477 3 2 6.477 2 10.8c0 2.72 1.61 5.13 4.07 6.58l-.9 3.35a.38.38 0 0 0 .56.42l3.9-2.6a11.2 11.2 0 0 0 2.37.25c5.523 0 10-3.477 10-7.8C22 6.477 17.523 3 12 3z"/>
    </svg>
  );
}

function SocialLoginButtons() {
  const handleSocialLogin = (provider) => {
    alert(`${provider} 로그인은 구현 예정입니다.`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.divider}>
        <span className={styles.dividerLine} />
        <span className={styles.dividerText}>또는</span>
        <span className={styles.dividerLine} />
      </div>

      <div className={styles.buttons}>
        <button
          type="button"
          className={`${styles.socialBtn} ${styles.google}`}
          onClick={() => handleSocialLogin('Google')}
        >
          <GoogleIcon />
          <span>Google로 계속하기</span>
        </button>

        <button
          type="button"
          className={`${styles.socialBtn} ${styles.naver}`}
          onClick={() => handleSocialLogin('네이버')}
        >
          <NaverIcon />
          <span>네이버로 계속하기</span>
        </button>

        <button
          type="button"
          className={`${styles.socialBtn} ${styles.kakao}`}
          onClick={() => handleSocialLogin('카카오')}
        >
          <KakaoIcon />
          <span>카카오로 계속하기</span>
        </button>
      </div>
    </div>
  );
}

export default SocialLoginButtons;
