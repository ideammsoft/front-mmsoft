// =====================================================================
// [SocialLoginButtons.jsx] - 소셜 로그인 버튼 컴포넌트
// =====================================================================
//
// 📌 소셜 로그인 동작 원리
//   - 버튼 클릭 시 window.location.href로 백엔드 OAuth2 시작 URL로 이동합니다.
//   - 이 URL에 접근하면 Spring Security가 자동으로 해당 소셜 로그인 페이지로 이동시킵니다.
//
//   흐름:
//   버튼 클릭
//   → /oauth2/authorization/google
//   → Spring Security가 자동으로 구글 로그인 페이지로 리다이렉트
//   → 구글 로그인 완료
//   → 백엔드 OAuth2LoginSuccessHandler 실행
//   → http://localhost:5173/oauth/callback?code=임시코드 로 리다이렉트
//   → OAuthCallbackPage.jsx에서 임시코드로 AccessToken 교환
//
// 📌 SVG 아이콘이란?
//   - 벡터 그래픽(확대해도 깨지지 않는 이미지 형식)입니다.
//   - <svg> 태그 안에 <path>로 모양을 정의합니다.
//   - fill 속성으로 색상을 지정합니다.
//   - 외부 이미지 파일 없이 코드로 아이콘을 그립니다.

import styles from './SocialLoginButtons.module.css';

// ─── 아이콘 컴포넌트들 ───

// Google 로고 (파랑, 초록, 노랑, 빨강의 4색 G 마크)
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

// Naver 로고 (흰색 N 마크)
function NaverIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path fill="#ffffff" d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z"/>
    </svg>
  );
}

// Kakao 로고 (검정 말풍선 K 마크)
function KakaoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path fill="#000000" d="M12 3C6.477 3 2 6.477 2 10.8c0 2.72 1.61 5.13 4.07 6.58l-.9 3.35a.38.38 0 0 0 .56.42l3.9-2.6a11.2 11.2 0 0 0 2.37.25c5.523 0 10-3.477 10-7.8C22 6.477 17.523 3 12 3z"/>
    </svg>
  );
}

// ─── 메인 컴포넌트 ───
function SocialLoginButtons() {

  // 소셜 로그인 시작 함수
  // provider: 'google' | 'naver' | 'kakao'
  const handleSocialLogin = (provider) => {
    // window.location.href = URL : 현재 탭에서 해당 URL로 이동
    // 이 URL에 접근하면 Spring Security가 해당 소셜 로그인 페이지로 자동 리다이렉트합니다
    window.location.href = `/oauth2/authorization/${provider}`;
    // 예) /oauth2/authorization/google
    //   → 구글 로그인 페이지로 이동
    // 예) /oauth2/authorization/naver
    //   → 네이버 로그인 페이지로 이동
  };

  return (
    <div className={styles.container}>
      {/* 구분선: ─────── 또는 ─────────── */}
      <div className={styles.divider}>
        <span className={styles.dividerLine} />
        <span className={styles.dividerText}>또는</span>
        <span className={styles.dividerLine} />
      </div>

      {/* 소셜 로그인 버튼 목록 */}
      <div className={styles.buttons}>

        {/* Google 로그인 버튼 */}
        <button
          type="button" // form 안에 있어도 submit이 되지 않도록 type="button" 명시
          className={`${styles.socialBtn} ${styles.google}`}
          onClick={() => handleSocialLogin('google')}
        >
          <GoogleIcon />
          <span>Google로 계속하기</span>
        </button>

        {/* Naver 로그인 버튼 */}
        <button
          type="button"
          className={`${styles.socialBtn} ${styles.naver}`}
          onClick={() => handleSocialLogin('naver')}
        >
          <NaverIcon />
          <span>네이버로 계속하기</span>
        </button>

        {/* Kakao 로그인 버튼 */}
        <button
          type="button"
          className={`${styles.socialBtn} ${styles.kakao}`}
          onClick={() => handleSocialLogin('kakao')}
        >
          <KakaoIcon />
          <span>카카오로 계속하기</span>
        </button>

      </div>
    </div>
  );
}

export default SocialLoginButtons;
