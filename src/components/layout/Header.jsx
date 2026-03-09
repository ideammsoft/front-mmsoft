import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import MainNavigation from './MainNavigation';
import LoginPanel from '../auth/LoginPanel';
import styles from './Header.module.css';
import clsx from 'clsx';

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('mmsoft_user')); } catch { return null; }
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('mmsoft_user');
    setUser(null);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className={clsx(styles.header, scrolled && styles.scrolled)}>
        <div className={styles.headerContainer}>
          <Link to="/" className={styles.logo}>
            <svg className={styles.logoIcon} viewBox="0 0 56 52" xmlns="http://www.w3.org/2000/svg" aria-label="MM">
              <defs>
                <linearGradient id="mmLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38D5F5"/>
                  <stop offset="100%" stopColor="#0A7FE5"/>
                </linearGradient>
              </defs>
              <rect width="56" height="52" rx="12" fill="url(#mmLogoGrad)"/>
              <text x="28" y="36"
                fontFamily="'Arial Black', Arial, sans-serif"
                fontSize="24"
                fill="white"
                fontWeight="900"
                textAnchor="middle"
                letterSpacing="1">MM</text>
            </svg>
            엠엠소프트
          </Link>

          <MainNavigation mobileOpen={mobileMenuOpen} onCloseMobile={closeMobileMenu} />

          <div className={styles.headerActions}>
            {user && (
              <span className={styles.welcomeMessage}>
                {user.name}님 반갑습니다.
              </span>
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
    </>
  );
}

export default Header;
