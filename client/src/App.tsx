import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/Layout';
import { useAuthStore } from './stores/authStore';
import { GoogleAnalytics } from './components/GoogleAnalytics';

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/HomePage').then(module => ({ default: module.HomePage })));
const UploadPage = lazy(() => import('./pages/UploadPage').then(module => ({ default: module.UploadPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then(module => ({ default: module.AboutPage })));
const ImpactPage = lazy(() => import('./pages/ImpactPage').then(module => ({ default: module.ImpactPage })));
const BlogPage = lazy(() => import('./pages/BlogPage').then(module => ({ default: module.BlogPage })));
const ArticleDetailPage = lazy(() => import('./pages/ArticleDetailPage').then(module => ({ default: module.ArticleDetailPage })));
const AdminArticlesPage = lazy(() => import('./pages/AdminArticlesPage').then(module => ({ default: module.AdminArticlesPage })));
const LoginPage = lazy(() => import('./pages/LoginPage').then(module => ({ default: module.LoginPage })));
const UserProfilePage = lazy(() => import('./pages/UserProfilePage').then(module => ({ default: module.UserProfilePage })));
const PhotoGalleryPage = lazy(() => import('./pages/PhotoGalleryPage').then(module => ({ default: module.PhotoGalleryPage })));
const MapPage = lazy(() => import('./pages/MapPage').then(module => ({ default: module.MapPage })));

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
      <p className="text-gray-600 font-medium">Loading...</p>
    </div>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes
      cacheTime: 10 * 60 * 1000, // Cache data for 10 minutes
      refetchOnMount: false, // Don't refetch on component mount if data is fresh
    },
  },
});

function App() {
  const loadFromStorage = useAuthStore((state) => state.loadFromStorage);

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <GoogleAnalytics />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="upload" element={<UploadPage />} />
              <Route path="map" element={<MapPage />} />
              <Route path="gallery" element={<PhotoGalleryPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="impact" element={<ImpactPage />} />
              <Route path="blog" element={<BlogPage />} />
              <Route path="blog/:slug" element={<ArticleDetailPage />} />
              <Route path="profile" element={<UserProfilePage />} />
              <Route path="admin/articles" element={<AdminArticlesPage />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
