import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import MainNavigation from './MainNavigation';
import LoginPanel from '../auth/LoginPanel';
import ProfileCompletionPanel from '../auth/ProfileCompletionPanel';
import styles from './Header.module.css';
import clsx from 'clsx';

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled]             = useState(false);
  const [loginOpen, setLoginOpen]           = useState(false);
  const [profileOpen, setProfileOpen]       = useState(false);
  const [profileMode, setProfileMode]       = useState('register'); // 'register' | 'edit'

  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('mmsoft_user')); }
    catch { return null; }
  });

  // OAuth 로그인 후 OAuthCallbackPage에서 userUpdated 이벤트 발생 시 상태 갱신
  useEffect(() => {
    const handleUserUpdated = () => {
      try { setUser(JSON.parse(localStorage.getItem('mmsoft_user'))); }
      catch { setUser(null); }
    };
    window.addEventListener('userUpdated', handleUserUpdated);
    return () => window.removeEventListener('userUpdated', handleUserUpdated);
  }, []);

  // OAuthCallbackPage에서 신규회원 플래그를 state로 전달받으면 자동으로 팝업 오픈
  const location = useLocation();
  useEffect(() => {
    if (location.state?.showProfileComplete) {
      setProfileMode('register');
      setProfileOpen(true);
      // history state 초기화
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLoginSuccess = (userData) => setUser(userData);

  const handleLogout = () => {
    localStorage.removeItem('mmsoft_user');
    localStorage.removeItem('mmsoft_access_token');
    setUser(null);
  };

  // 회원정보수정 클릭
  const handleEditProfile = () => {
    setProfileMode('edit');
    setProfileOpen(true);
  };

  // 프로필 저장 후 사용자 이름 갱신
  const handleProfileSaved = (updatedUser) => {
    setUser(updatedUser);
    setProfileOpen(false);
  };

  // 인사말 텍스트 결정
  const getWelcomeText = () => {
    if (!user) return '';
    if (user.name)     return `${user.name}님 반갑습니다.`;
    if (user.email)    return `${user.email} 로그인`;
    if (user.provider) return `${user.provider}로 로그인 되었습니다`;
    return '반갑습니다.';
  };

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu  = () => setMobileMenuOpen(false);

  return (
    <>
      <header className={clsx(styles.header, scrolled && styles.scrolled)}>
        <div className={styles.headerContainer}>

          <Link to="/" className={styles.logo}>
            <img src="/manymen_mark.png" alt="엠엠소프트" className={styles.logoIcon} />
            엠엠소프트
          </Link>

          <MainNavigation
            mobileOpen={mobileMenuOpen}
            onCloseMobile={closeMobileMenu}
            user={user}
            onLogin={() => setLoginOpen(true)}
            onLogout={handleLogout}
          />

          <div className={styles.headerActions}>
            {user && (
              // 풍선도움말: 호버 시 "회원정보수정" 표시, 클릭 시 수정 패널 열기
              <div className={styles.tooltipWrapper} onClick={handleEditProfile}>
                <span className={styles.welcomeMessage}>{getWelcomeText()}</span>
                <span className={styles.tooltip}>회원정보수정</span>
              </div>
            )}

            {user ? (
              <button className={styles.loginButton} onClick={handleLogout}>
                로그아웃
              </button>
            ) : (
              <button className={styles.loginButton} onClick={() => setLoginOpen(true)}>
                로그인
              </button>
            )}

            <button
              className={styles.mobileMenuButton}
              onClick={toggleMobileMenu}
              aria-label="메뉴"
            >
              {mobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </header>

      {loginOpen && (
        <LoginPanel
          onClose={() => setLoginOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {profileOpen && (
        <ProfileCompletionPanel
          mode={profileMode}
          onClose={() => setProfileOpen(false)}
          onSaved={handleProfileSaved}
        />
      )}
    </>
  );
}

export default Header;
