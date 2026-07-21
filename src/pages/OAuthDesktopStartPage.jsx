import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

// =====================================================================
// [OAuthDesktopStartPage] - PC 프로그램(데스크톱) 소셜 로그인 진입점
// =====================================================================
//  PC 앱이 기본 브라우저로 이 페이지를 연다:
//    /oauth/desktop-start?provider=kakao&port=34567&state=난수
//  콜백을 이 PC(127.0.0.1:port)로 되돌리기 위해 port/state 를 sessionStorage 에
//  저장한 뒤, 표준 OAuth2 시작 URL 로 이동한다.
//  이후 /oauth/callback 에서 이 표시를 보고 로컬(127.0.0.1)로 code 를 bounce 한다.
// =====================================================================
function OAuthDesktopStartPage() {
  const [params] = useSearchParams();

  useEffect(() => {
    const provider = params.get('provider'); // google | kakao | naver
    const port     = params.get('port');
    const state    = params.get('state');

    const valid =
      /^(google|kakao|naver)$/.test(provider || '') &&
      /^\d{2,5}$/.test(port || '') &&
      /^[A-Za-z0-9]{8,64}$/.test(state || '');

    if (!valid) {
      window.location.replace('/login?error');
      return;
    }

    sessionStorage.setItem('desktop_oauth', JSON.stringify({ port, state }));
    window.location.href = `/oauth2/authorization/${provider}`;
  }, [params]);

  return (
    <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--color-text-light)' }}>
      <p>소셜 로그인으로 이동 중입니다...</p>
    </div>
  );
}

export default OAuthDesktopStartPage;
