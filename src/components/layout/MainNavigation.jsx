import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import styles from './MainNavigation.module.css';

function MainNavigation({ mobileOpen, onCloseMobile }) {
  const location = useLocation();

  const navItems = [
    { path: '/', label: '홈' },
    { path: '/company', label: '회사소개' },
    { path: '/community', label: '커뮤니티' },
    { path: '/downloads', label: '다운로드' },
    { path: '/projects', label: '프로젝트' },
    { path: '/faq', label: 'FAQ' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Desktop navigation */}
      <nav className={styles.nav}>
        <ul className={styles.navList}>
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={clsx(styles.navLink, isActive(item.path) && styles.active)}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile navigation overlay — rendered in document.body via Portal */}
      {mobileOpen && createPortal(
        <div className={styles.mobileOverlay} onClick={onCloseMobile}>
          <nav className={styles.mobileNav} onClick={(e) => e.stopPropagation()}>
            <div className={styles.mobileHeader}>
              <span className={styles.mobileTitle}>메뉴</span>
              <button className={styles.mobileClose} onClick={onCloseMobile} aria-label="닫기">
                &times;
              </button>
            </div>
            <ul className={styles.mobileNavList}>
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={clsx(styles.mobileNavLink, isActive(item.path) && styles.active)}
                    onClick={onCloseMobile}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className={styles.mobileFooter}>
              <button
                className={styles.mobileLoginButton}
                onClick={() => {
                  onCloseMobile();
                  alert('로그인 기능은 백엔드 연동 후 제공됩니다.');
                }}
              >
                로그인
              </button>
            </div>
          </nav>
        </div>,
        document.body
      )}
    </>
  );
}

export default MainNavigation;
