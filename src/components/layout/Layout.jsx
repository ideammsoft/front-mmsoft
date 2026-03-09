import Header from './Header';
import Footer from './Footer';
import ScrollToTop from '../common/ScrollToTop';
import FloatingChat from '../common/FloatingChat';
import styles from './Layout.module.css';

function Layout({ children }) {
  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.main}>
        {children}
      </main>
      <Footer />
      <ScrollToTop />
      <FloatingChat />
    </div>
  );
}

export default Layout;
