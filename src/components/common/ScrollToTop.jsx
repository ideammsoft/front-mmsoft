import { useState, useEffect } from 'react';
import { FaChevronUp } from 'react-icons/fa';
import styles from './ScrollToTop.module.css';
import clsx from 'clsx';

function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      className={clsx(styles.scrollToTop, visible && styles.visible)}
      onClick={scrollToTop}
      aria-label="맨 위로"
    >
      <FaChevronUp />
    </button>
  );
}

export default ScrollToTop;
