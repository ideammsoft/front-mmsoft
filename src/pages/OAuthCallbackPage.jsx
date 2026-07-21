import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

function OAuthCallbackPage() {
  const [params]  = useSearchParams();
  const [msg, setMsg] = useState('SNS 로그인 처리 중...');
  const navigate  = useNavigate();

  useEffect(() => {
    const code = params.get('code');

    if (!code) {
      setMsg('인증 코드가 없습니다. 다시 로그인해주세요.');
      setTimeout(() => navigate('/'), 2000);
      return;
    }

    // ── PC 프로그램(데스크톱) 로그인: code 를 로컬 콜백(127.0.0.1)으로 되돌린다 ──
    //  desktop-start 페이지가 저장해 둔 port/state 가 있으면, 웹에서 교환하지 않고
    //  PC 앱의 로컬 리스너로 code 를 넘긴다. (앱이 exchange 를 직접 호출)
    const desktopRaw = sessionStorage.getItem('desktop_oauth');
    if (desktopRaw) {
      sessionStorage.removeItem('desktop_oauth');
      try {
        const { port, state } = JSON.parse(desktopRaw);
        if (/^\d{2,5}$/.test(String(port))) {
          setMsg('프로그램으로 돌아가는 중입니다. 이 창은 닫으셔도 됩니다.');
          window.location.replace(
            `http://127.0.0.1:${port}/?code=${encodeURIComponent(code)}` +
            `&state=${encodeURIComponent(state || '')}`
          );
          return;
        }
      } catch {
        /* 파싱 실패 시 일반 웹 흐름으로 진행 */
      }
    }

    // 임시코드 → AccessToken + 사용자 정보 교환
    fetch(`/api/auth/oauth2/exchange?code=${code}`, {
      method: 'POST',
      credentials: 'include',
    })
      .then(res => {
        if (!res.ok) throw new Error('코드 교환 실패');
        return res.json();
      })
      .then(data => {
        // AccessToken 저장
        if (data.accessToken) {
          localStorage.setItem('mmsoft_access_token', data.accessToken);
        }

        // 사용자 정보 저장 (name, email, provider, mphone, phone, company 포함)
        localStorage.setItem('mmsoft_user', JSON.stringify({
          name:       data.name       || '',
          email:      data.email      || '',
          mphone:     data.mphone     || '',
          phone:      data.phone      || '',
          company:    data.company    || '',
          provider:   data.provider   || '',
          homepageId: data.homepageId || '',
        }));

        // Header에 로그인 상태 변경 알림
        window.dispatchEvent(new CustomEvent('userUpdated'));

        if (data.isNewMember) {
          // 신규 회원: 추가정보 입력 화면으로 이동 (state로 신규 여부 전달)
          navigate('/', { state: { showProfileComplete: true } });
        } else {
          navigate('/');
        }
      })
      .catch(() => {
        setMsg('SNS 로그인에 실패했습니다. 다시 시도해주세요.');
        setTimeout(() => navigate('/'), 2000);
      });

  }, [params, navigate]);

  return (
    <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--color-text-light)' }}>
      <p>{msg}</p>
    </div>
  );
}

export default OAuthCallbackPage;
