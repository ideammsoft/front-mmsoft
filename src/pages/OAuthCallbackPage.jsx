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

    // 임시코드 → AccessToken + 사용자 정보 교환
    fetch(`http://localhost:1882/api/auth/oauth2/exchange?code=${code}`, {
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

        // 사용자 정보 저장 (name, email, provider, phone, company 포함)
        localStorage.setItem('mmsoft_user', JSON.stringify({
          name:     data.name     || '',
          email:    data.email    || '',
          phone:    data.phone    || '',
          company:  data.company  || '',
          provider: data.provider || '',
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
