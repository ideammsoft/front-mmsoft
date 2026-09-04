// =====================================================================
// [App.jsx] - React 앱 전체 라우팅(페이지 경로) 설정 파일
// =====================================================================
//
// 📌 이 파일이 하는 일
//   - URL 경로(예: "/", "/login", "/projects")에 따라 어떤 페이지를
//     보여줄지 결정합니다.
//   - 모든 페이지는 <Layout> 안에 감싸져서 Header와 Footer가 공통으로 적용됩니다.
//
// 📌 컴포넌트(Component)란?
//   - 화면의 일부분을 나타내는 재사용 가능한 코드 조각입니다.
//   - HTML + CSS + JavaScript 로직을 하나로 묶은 단위입니다.
//   - 예) <Header />, <Button />, <LoginPanel /> 모두 컴포넌트입니다.
//   - 대문자로 시작하면 커스텀 컴포넌트, 소문자는 기본 HTML 태그입니다.
//
// 📌 JSX란?
//   - JavaScript 안에 HTML처럼 쓸 수 있는 React의 문법 확장입니다.
//   - <Route path="/..." element={<HomePage />} /> 이런 형태입니다.
//   - 실제로는 브라우저가 이해할 수 있는 JavaScript로 변환됩니다.
//
// 📌 lazy와 Suspense (코드 분할 - Code Splitting)
//   - lazy(() => import('./pages/HomePage'))
//     → 앱이 처음 로드될 때 모든 페이지를 다 불러오지 않고,
//       해당 페이지로 이동할 때 그 페이지만 불러옵니다.
//     → 초기 로딩 속도가 빨라집니다.
//   - <Suspense fallback={<LoadingSpinner />}>
//     → lazy 로딩 중에 보여줄 "로딩 화면"을 설정합니다.
//
// 📌 BrowserRouter란?
//   - React Router(페이지 이동 라이브러리)의 기반이 되는 컴포넌트입니다.
//   - 브라우저의 URL을 감시하고, URL이 바뀌면 해당 Route의 페이지를 표시합니다.
//   - 실제 서버 요청 없이 JavaScript로 페이지 전환을 처리합니다. (SPA 방식)

import { lazy, Suspense, Component, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/common/LoadingSpinner';
import { FaExclamationTriangle, FaHome, FaRedo } from 'react-icons/fa';
import { isChunkLoadError, reloadForNewChunks } from './utils/chunkReload';
// 404 화면과 같은 스타일을 써서 오류 화면의 생김새를 사이트와 맞춘다
import errorStyles from './pages/NotFoundPage.module.css';

// 에러 경계: 페이지 렌더링 중 에러가 나면 빈 화면 대신 안내 화면을 보여준다.
// 스택 트레이스는 고객에게 의미가 없고 내부 구조만 드러내므로 콘솔로만 남긴다.
class ErrorBoundary extends Component {
  state = { error: null };
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error, errorInfo) {
    // 배포 직후 옛 청크를 부르다 실패한 경우 — 오류 화면 대신 자동 새로고침.
    // React.lazy 의 import() 실패는 vite:preloadError 가 뜨지 않아 여기로 온다.
    if (isChunkLoadError(error) && reloadForNewChunks()) return;
    // 진단에 필요한 내용은 여기에 전부 남긴다(개발자 도구 콘솔에서 확인).
    console.error('[ErrorBoundary]', error, errorInfo?.componentStack);
  }
  componentDidUpdate(prevProps) {
    // 페이지 이동 시 에러 상태 리셋
    if (this.state.error && prevProps.location !== this.props.location) {
      this.setState({ error: null });
    }
  }
  render() {
    if (this.state.error) {
      return (
        <div className={errorStyles.container}>
          <div className={errorStyles.code} style={{ fontSize: '5rem' }}>
            <FaExclamationTriangle />
          </div>
          <h2 className={errorStyles.title}>일시적인 오류가 발생했습니다</h2>
          <p className={errorStyles.description}>
            페이지를 불러오는 중 문제가 생겼습니다.<br />
            새로고침하면 대부분 해결됩니다.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className={errorStyles.homeLink}
              style={{ border: 'none', cursor: 'pointer' }}
            >
              <FaRedo /> 새로고침
            </button>
            <a
              href="/"
              className={errorStyles.homeLink}
              style={{ background: '#64748b', boxShadow: 'none' }}
            >
              <FaHome /> 홈으로
            </a>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// lazy() : 해당 페이지에 처음 진입할 때만 파일을 불러옵니다.
// 초기 로딩 성능 최적화 (모든 페이지를 한번에 불러오면 느려짐)
const HomePage              = lazy(() => import('./pages/HomePage'));
const CompanyPage           = lazy(() => import('./pages/CompanyPage'));
const CommunityPage         = lazy(() => import('./pages/CommunityPage'));
const PostDetailPage        = lazy(() => import('./pages/PostDetailPage'));
const DownloadsPage         = lazy(() => import('./pages/DownloadsPage'));
const ProjectsPage          = lazy(() => import('./pages/ProjectsPage'));
const ProjectPostDetailPage = lazy(() => import('./pages/ProjectPostDetailPage'));
const FAQPage               = lazy(() => import('./pages/FAQPage'));
const PaymentPage           = lazy(() => import('./pages/PaymentPage'));
const SitemapPage           = lazy(() => import('./pages/SitemapPage'));
const PrivacyPage           = lazy(() => import('./pages/PrivacyPage'));
const NotFoundPage          = lazy(() => import('./pages/NotFoundPage'));
const LoginErrorPage        = lazy(() => import('./pages/LoginErrorPage'));
// 소셜 로그인(OAuth2) 완료 후 리다이렉트되는 콜백 페이지
const OAuthCallbackPage     = lazy(() => import('./pages/OAuthCallbackPage'));
// PC 프로그램(데스크톱) 소셜 로그인 진입점
const OAuthDesktopStartPage = lazy(() => import('./pages/OAuthDesktopStartPage'));
const SmsServicePage        = lazy(() => import('./pages/SmsServicePage'));
const TelecomCertGuidePage  = lazy(() => import('./pages/TelecomCertGuidePage'));

function AccessLogger() {
  const location = useLocation();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('mmsoft_user') || 'null');
    fetch('/api/noim/access-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: location.pathname, userId: user?.homepageId || null }),
      keepalive: true,
    }).catch(() => {});
  }, [location.pathname]);
  return null;
}

function App() {
  return (
    // BrowserRouter: URL 변화를 감지하여 적절한 페이지 컴포넌트를 렌더링합니다
    <BrowserRouter>
      <AccessLogger />
      {/* Layout: 모든 페이지에 공통으로 Header와 Footer를 적용 */}
      <Layout>
        {/* Suspense: lazy 컴포넌트 로딩 중에 LoadingSpinner를 보여줌 */}
        <Suspense fallback={<LoadingSpinner />}>
          <ErrorBoundary>
          {/* Routes: 현재 URL과 일치하는 첫 번째 Route만 렌더링 */}
          <Routes>
            {/* path: URL 경로, element: 보여줄 컴포넌트 */}
            <Route path="/"                   element={<HomePage />} />
            <Route path="/company"            element={<CompanyPage />} />
            <Route path="/community"          element={<CommunityPage />} />
            {/* :postId → URL의 일부를 변수로 받음. 예) /community/5 → postId = "5" */}
            <Route path="/community/:postId"  element={<PostDetailPage />} />
            <Route path="/downloads"          element={<DownloadsPage />} />
            <Route path="/projects"           element={<ProjectsPage />} />
            <Route path="/projects/:postId"   element={<ProjectPostDetailPage />} />
            <Route path="/faq"                element={<FAQPage />} />
            <Route path="/sms-service"        element={<SmsServicePage />} />
            <Route path="/sms-service/telecom-cert-guide" element={<TelecomCertGuidePage />} />
            <Route path="/payment"            element={<PaymentPage />} />
            <Route path="/sitemap"            element={<SitemapPage />} />
            <Route path="/privacy"            element={<PrivacyPage />} />
            {/* 소셜 로그인 후 서버가 이 경로로 리다이렉트합니다 */}
            {/* 예) http://localhost:5173/oauth/callback?code=UUID임시코드 */}
            <Route path="/oauth/callback"     element={<OAuthCallbackPage />} />
            {/* PC 프로그램 소셜 로그인 진입: port/state 저장 후 OAuth2 시작 URL로 이동 */}
            <Route path="/oauth/desktop-start" element={<OAuthDesktopStartPage />} />
            {/* 소셜 로그인 실패 시 백엔드가 /login?error 로 리다이렉트 → 에러 화면 */}
            <Route path="/login"              element={<LoginErrorPage />} />
            {/* * → 위 경로 중 아무것도 일치하지 않으면 404 페이지 표시 */}
            <Route path="*"                   element={<NotFoundPage />} />
          </Routes>
          </ErrorBoundary>
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
}

// export default: 이 파일의 "기본 내보내기". 다른 파일에서 import App from './App' 으로 가져감
export default App;
