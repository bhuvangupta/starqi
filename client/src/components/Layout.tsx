import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../stores/authStore';
import { LanguageSwitcher } from './LanguageSwitcher';

export const Layout: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Modern & Sleek */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 text-white shadow-2xl backdrop-blur-lg border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo - Enhanced */}
            <Link to="/" className="group flex items-center gap-3 hover:scale-105 transition-transform duration-300">
              <div className="text-4xl group-hover:rotate-12 transition-transform duration-300">🌌</div>
              <div>
                <h1 className="text-3xl font-black bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                  SkyQI
                </h1>
                <p className="text-xs text-purple-300 font-medium">{t('layout.subtitle')}</p>
              </div>
            </Link>

            {/* Navigation - Modern Link Styles */}
            <nav className="flex items-center gap-2">
              <Link
                to="/"
                className="px-4 py-2 text-white hover:text-cyan-300 hover:bg-white/10 rounded-lg transition-all duration-200 font-medium"
              >
                {t('nav.home')}
              </Link>
              <Link
                to="/about"
                className="px-4 py-2 text-white hover:text-cyan-300 hover:bg-white/10 rounded-lg transition-all duration-200 font-medium"
              >
                {t('nav.about')}
              </Link>
              <Link
                to="/impact"
                className="px-4 py-2 text-white hover:text-cyan-300 hover:bg-white/10 rounded-lg transition-all duration-200 font-medium"
              >
                {t('nav.impact')}
              </Link>
              <Link
                to="/blog"
                className="px-4 py-2 text-white hover:text-cyan-300 hover:bg-white/10 rounded-lg transition-all duration-200 font-medium"
              >
                {t('nav.learn')}
              </Link>
              <Link
                to="/upload"
                className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all duration-300 shadow-lg hover:shadow-purple-500/50 hover:scale-105 inline-flex items-center gap-2 ml-2"
              >
                <span>📸</span>
                {t('nav.upload')}
              </Link>
              <a
                href="/#map"
                className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-xl hover:from-cyan-400 hover:to-blue-400 transition-all duration-300 shadow-lg hover:shadow-cyan-500/50 hover:scale-105 inline-flex items-center gap-2"
              >
                <span className="text-xl">🗺️</span>
                {t('nav.map')}
              </a>

              <div className="ml-2">
                <LanguageSwitcher />
              </div>

              {isAuthenticated ? (
                <div className="flex items-center gap-3 ml-4 pl-4 border-l border-white/20">
                  <div className="px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-lg border border-white/20">
                    <span className="text-cyan-300 text-sm font-medium">
                      {t('nav.hi')}, <span className="font-bold">{user?.username}</span>
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105"
                  >
                    {t('nav.logout')}
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="ml-4 px-5 py-2.5 bg-white/10 backdrop-blur-md text-white font-bold rounded-lg hover:bg-white/20 transition-all duration-200 border border-white/30 hover:border-white/50 hover:scale-105"
                >
                  {t('nav.login')}
                </Link>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Footer - Modern & Vibrant */}
      <footer className="bg-gradient-to-r from-indigo-950 via-purple-950 to-pink-950 text-white mt-16">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* About Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-3xl">🌌</span>
                <h3 className="text-xl font-black bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                  {t('footer.aboutSkyQI')}
                </h3>
              </div>
              <p className="text-purple-300 text-sm mb-4 leading-relaxed">
                {t('footer.aboutDescription')}
              </p>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    to="/about"
                    className="text-purple-300 hover:text-cyan-300 transition-colors inline-flex items-center gap-2 group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                    {t('footer.ourStory')}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/impact"
                    className="text-purple-300 hover:text-cyan-300 transition-colors inline-flex items-center gap-2 group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                    {t('footer.impactDashboard')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources Section */}
            <div>
              <h3 className="text-xl font-black text-white mb-4 flex items-center gap-2">
                <span>📚</span>
                {t('footer.resources')}
              </h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    to="/blog"
                    className="text-purple-300 hover:text-cyan-300 transition-colors inline-flex items-center gap-2 group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                    {t('footer.learnAboutLightPollution')}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/blog/how-to-take-night-sky-photos"
                    className="text-purple-300 hover:text-cyan-300 transition-colors inline-flex items-center gap-2 group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                    {t('footer.howToTakePhotos')}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/blog/what-is-light-pollution"
                    className="text-purple-300 hover:text-cyan-300 transition-colors inline-flex items-center gap-2 group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                    {t('footer.understandingLightPollution')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Connect Section */}
            <div>
              <h3 className="text-xl font-black text-white mb-4 flex items-center gap-2">
                <span>🔗</span>
                {t('footer.connect')}
              </h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <a
                    href="#"
                    className="text-purple-300 hover:text-cyan-300 transition-colors inline-flex items-center gap-2 group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                    {t('footer.github')}
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-purple-300 hover:text-cyan-300 transition-colors inline-flex items-center gap-2 group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                    {t('footer.twitter')}
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-purple-300 hover:text-cyan-300 transition-colors inline-flex items-center gap-2 group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                    {t('footer.contactUs')}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-white/10 mt-10 pt-8 text-center">
            <p className="text-sm text-purple-400 flex items-center justify-center gap-2">
              <span>✨</span>
              {t('footer.copyright')}
              <span>✨</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
