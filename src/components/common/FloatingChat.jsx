import styles from './FloatingChat.module.css';

function FloatingChat() {
  const handleClick = () => {
    const w = 440, h = 730;
    const left = window.screenX + (window.outerWidth - w) / 2;
    const top  = window.screenY + (window.outerHeight - h) / 2;
    window.open(
      `${window.location.protocol}//${window.location.hostname}:8001/`,
      'chatPopup',
      `width=${w},height=${h},left=${left},top=${top},resizable=no,scrollbars=no,toolbar=no,menubar=no,location=no,status=no`
    );
  };

  return (
    <button className={styles.floatingChat} onClick={handleClick} aria-label="고객센터 상담">
      <span className={styles.chatIcon}>💬</span>
    </button>
  );
}

export default FloatingChat;
