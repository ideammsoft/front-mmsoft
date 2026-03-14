// =====================================================================
// [Layout.jsx] - 모든 페이지의 공통 뼈대(레이아웃) 컴포넌트
// =====================================================================
//
// 📌 이 컴포넌트가 하는 일
//   - 모든 페이지에 공통으로 들어가는 구조를 정의합니다.
//   - 구조: Header (상단 헤더) → main (페이지 본문) → Footer (하단 푸터)
//   - App.jsx에서 <Layout> 안에 각 페이지 컴포넌트를 넣습니다.
//
// 📌 children이란?
//   - React에서 컴포넌트 태그 사이에 들어가는 내용을 말합니다.
//   - <Layout><HomePage /></Layout> 이라면 children = <HomePage />
//   - {children}을 원하는 위치에 넣어 "각 페이지 내용을 여기에 표시"합니다.
//
// 📌 CSS Module이란?
//   - import styles from './Layout.module.css'
//   - .module.css 파일의 클래스명이 자동으로 고유화됩니다.
//   - styles.layout → 실제로는 'Layout_layout__xyz12' 같은 고유 이름이 됩니다.
//   - 다른 컴포넌트의 CSS와 이름이 충돌하지 않아 안전합니다.

import Header from './Header';           // 상단 헤더 (로고, 내비게이션, 로그인 버튼)
import Footer from './Footer';           // 하단 푸터 (주소, 연락처, 링크 등)
import ScrollToTop from '../common/ScrollToTop'; // 페이지 이동 시 스크롤을 맨 위로
import FloatingChat from '../common/FloatingChat'; // 우하단 플로팅 채팅 버튼
import styles from './Layout.module.css'; // CSS Module (레이아웃 스타일)

// Layout 컴포넌트
// props에서 children을 꺼냅니다. children = 이 컴포넌트 태그 사이에 들어오는 자식 요소
function Layout({ children }) {
  return (
    // 전체 페이지를 감싸는 div
    <div className={styles.layout}>
      {/* 모든 페이지 상단에 공통으로 표시되는 헤더 */}
      <Header />

      {/* main: HTML의 주요 콘텐츠 영역 (접근성을 위해 <main> 태그 사용) */}
      {/* children이 여기에 렌더링됩니다 = 각 페이지의 실제 내용 */}
      <main className={styles.main}>
        {children}
      </main>

      {/* 모든 페이지 하단에 공통으로 표시되는 푸터 */}
      <Footer />

      {/* 페이지 이동 시 자동으로 스크롤을 맨 위로 이동시키는 컴포넌트 */}
      <ScrollToTop />

      {/* 우하단에 고정된 플로팅 채팅/문의 버튼 */}
      <FloatingChat />
    </div>
  );
}

export default Layout;
