import { useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FaHome, FaExclamationTriangle, FaSignInAlt } from 'react-icons/fa';
import styles from './NotFoundPage.module.css';

// 소셜 로그인 실패 시 백엔드가 /login?error 로 리다이렉트한다.
// ?error 가 없는 /login 접근은 홈으로 보내며 로그인 모달을 연다(?panel=login).
function LoginErrorPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const isError = params.has('error');

  useEffect(() => {
    if (!isError) navigate('/?panel=login', { replace: true });
  }, [isError, navigate]);

  if (!isError) return null;

  return (
    <div className={styles.container}>
      <div className={styles.code} style={{ fontSize: '5rem' }}>
        <FaExclamationTriangle />
      </div>
      <h2 className={styles.title}>로그인에 실패했습니다</h2>
      <p className={styles.description}>
        로그인 처리 중 일시적인 오류가 발생했습니다.<br />
        잠시 후 다시 시도해 주세요.
      </p>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          type="button"
          onClick={() => navigate('/?panel=login')}
          className={styles.homeLink}
          style={{ border: 'none', cursor: 'pointer' }}
        >
          <FaSignInAlt /> 다시 로그인
        </button>
        <Link
          to="/"
          className={styles.homeLink}
          style={{ background: '#64748b', boxShadow: 'none' }}
        >
          <FaHome /> 홈으로
        </Link>
      </div>
    </div>
  );
}

export default LoginErrorPage;
