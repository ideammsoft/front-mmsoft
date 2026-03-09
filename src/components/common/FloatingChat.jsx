import styles from './FloatingChat.module.css';

function FloatingChat() {
  const handleClick = (e) => {
    e.preventDefault();
    alert('카카오톡 상담 서비스 (데모)');
  };

  return (
    <a href="#" className={styles.floatingChat} onClick={handleClick} aria-label="카카오톡 상담">
      <span className={styles.chatIcon}>💬</span>
    </a>
  );
}

export default FloatingChat;
