import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/common/LoadingSpinner';

// Lazy load pages for code splitting
const HomePage = lazy(() => import('./pages/HomePage'));
const CompanyPage = lazy(() => import('./pages/CompanyPage'));
const CommunityPage = lazy(() => import('./pages/CommunityPage'));
const PostDetailPage = lazy(() => import('./pages/PostDetailPage'));
const DownloadsPage = lazy(() => import('./pages/DownloadsPage'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const FAQPage = lazy(() => import('./pages/FAQPage'));
const SitemapPage = lazy(() => import('./pages/SitemapPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/company" element={<CompanyPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/community/:postId" element={<PostDetailPage />} />
            <Route path="/downloads" element={<DownloadsPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/sitemap" element={<SitemapPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
