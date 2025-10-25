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
      {/* Header */}
      <header className="bg-dark-sky-900 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-3xl">🌌</span>
              <div>
                <h1 className="text-2xl font-bold">SkyQI</h1>
                <p className="text-sm text-dark-sky-300">{t('layout.subtitle')}</p>
              </div>
            </Link>

            <nav className="flex items-center gap-6">
              <Link
                to="/"
                className="text-white hover:text-dark-sky-200 transition-colors"
              >
                {t('nav.home')}
              </Link>
              <Link
                to="/about"
                className="text-white hover:text-dark-sky-200 transition-colors"
              >
                {t('nav.about')}
              </Link>
              <Link
                to="/impact"
                className="text-white hover:text-dark-sky-200 transition-colors"
              >
                {t('nav.impact')}
              </Link>
              <Link
                to="/blog"
                className="text-white hover:text-dark-sky-200 transition-colors"
              >
                {t('nav.learn')}
              </Link>
              <Link
                to="/upload"
                className="text-white hover:text-dark-sky-200 transition-colors"
              >
                {t('nav.upload')}
              </Link>
              <a
                href="/#map"
                className="text-white hover:text-dark-sky-200 transition-colors"
              >
                {t('nav.map')}
              </a>
              <LanguageSwitcher />
              {isAuthenticated ? (
                <div className="flex items-center gap-4">
                  <span className="text-dark-sky-300">
                    {t('nav.hi')}, {user?.username}
                  </span>
                  <button
                    onClick={logout}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    {t('nav.logout')}
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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

      {/* Footer */}
      <footer className="bg-dark-sky-900 text-white mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">{t('footer.aboutSkyQI')}</h3>
              <p className="text-dark-sky-300 text-sm mb-3">
                {t('footer.aboutDescription')}
              </p>
              <ul className="space-y-2 text-sm text-dark-sky-300">
                <li>
                  <Link to="/about" className="hover:text-white">
                    {t('footer.ourStory')}
                  </Link>
                </li>
                <li>
                  <Link to="/impact" className="hover:text-white">
                    {t('footer.impactDashboard')}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">{t('footer.resources')}</h3>
              <ul className="space-y-2 text-sm text-dark-sky-300">
                <li>
                  <Link to="/blog" className="hover:text-white">
                    {t('footer.learnAboutLightPollution')}
                  </Link>
                </li>
                <li>
                  <Link to="/blog/how-to-take-night-sky-photos" className="hover:text-white">
                    {t('footer.howToTakePhotos')}
                  </Link>
                </li>
                <li>
                  <Link to="/blog/what-is-light-pollution" className="hover:text-white">
                    {t('footer.understandingLightPollution')}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">{t('footer.connect')}</h3>
              <ul className="space-y-2 text-sm text-dark-sky-300">
                <li>
                  <a href="#" className="hover:text-white">
                    {t('footer.github')}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    {t('footer.twitter')}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    {t('footer.contactUs')}
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-dark-sky-800 mt-8 pt-8 text-center text-sm text-dark-sky-400">
            <p>{t('footer.copyright')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
