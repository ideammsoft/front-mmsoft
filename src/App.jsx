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

import { lazy, Suspense, Component } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/common/LoadingSpinner';

// 에러 경계: 페이지 렌더링 중 에러 발생 시 빈 화면 대신 에러 메시지 표시
class ErrorBoundary extends Component {
  state = { error: null, errorInfo: null };
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('[ErrorBoundary]', error, errorInfo);
  }
  componentDidUpdate(prevProps) {
    // 페이지 이동 시 에러 상태 리셋
    if (this.state.error && prevProps.location !== this.props.location) {
      this.setState({ error: null, errorInfo: null });
    }
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: '40px', color: 'red' }}>
          <h2>페이지 오류</h2>
          <pre style={{ background: '#fee', padding: '16px', borderRadius: '8px', fontSize: '12px', whiteSpace: 'pre-wrap', overflowX: 'auto' }}>
            {this.state.error.stack || this.state.error.message}
          </pre>
          {this.state.errorInfo && (
            <pre style={{ background: '#ffe', padding: '16px', borderRadius: '8px', fontSize: '11px', whiteSpace: 'pre-wrap', overflowX: 'auto' }}>
              컴포넌트 스택:{this.state.errorInfo.componentStack}
            </pre>
          )}
          <button onClick={() => this.setState({ error: null, errorInfo: null })} style={{ marginTop: '16px', padding: '8px 24px', cursor: 'pointer' }}>
            다시 시도
          </button>
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
const NotFoundPage          = lazy(() => import('./pages/NotFoundPage'));
// 소셜 로그인(OAuth2) 완료 후 리다이렉트되는 콜백 페이지
const OAuthCallbackPage     = lazy(() => import('./pages/OAuthCallbackPage'));
const SmsServicePage        = lazy(() => import('./pages/SmsServicePage'));

function App() {
  return (
    // BrowserRouter: URL 변화를 감지하여 적절한 페이지 컴포넌트를 렌더링합니다
    <BrowserRouter>
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
            <Route path="/payment"            element={<PaymentPage />} />
            <Route path="/sitemap"            element={<SitemapPage />} />
            {/* 소셜 로그인 후 서버가 이 경로로 리다이렉트합니다 */}
            {/* 예) http://localhost:5173/oauth/callback?code=UUID임시코드 */}
            <Route path="/oauth/callback"     element={<OAuthCallbackPage />} />
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
