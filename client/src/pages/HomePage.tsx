import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Dashboard } from '../components/Dashboard';
import { LightPollutionMap } from '../components/LightPollutionMap';
import { SEO } from '../components/SEO';
import { StructuredData, createOrganizationSchema, createWebsiteSchema } from '../components/StructuredData';

export const HomePage: React.FC = () => {
  const { t, i18n } = useTranslation();

  return (
    <>
      <SEO
        title="SkyQI - Light Pollution Portal"
        description={t('home.heroDescription')}
        keywords="light pollution, sky quality, dark sky, astronomy, citizen science, SQM, Bortle scale, night sky, stargazing, environmental monitoring"
        url="/"
        locale={i18n.language}
      />
      <StructuredData data={[createOrganizationSchema(), createWebsiteSchema()]} />

      <div className="space-y-8">
        {/* Hero Section */}
      <div className="bg-gradient-to-r from-dark-sky-900 to-dark-sky-800 text-white rounded-lg shadow-xl p-8 md:p-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          {t('home.heroTitle')}
        </h1>
        <p className="text-xl md:text-2xl text-dark-sky-200 mb-6">
          {t('home.heroSubtitle')}
        </p>
        <p className="text-lg text-dark-sky-300 mb-8">
          {t('home.heroDescription')}
        </p>
        <div className="flex gap-4">
          <Link
            to="/upload"
            className="px-6 py-3 bg-white text-dark-sky-900 font-semibold rounded-lg hover:bg-dark-sky-100 transition-colors"
          >
            {t('home.uploadSkyPhoto')}
          </Link>
          <a
            href="#map"
            className="px-6 py-3 bg-dark-sky-700 text-white font-semibold rounded-lg hover:bg-dark-sky-600 transition-colors"
          >
            {t('home.exploreMap')}
          </a>
        </div>
      </div>

      {/* Dashboard */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('home.globalStatistics')}</h2>
        <Dashboard />
      </section>

      {/* Map */}
      <section id="map">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('home.lightPollutionMap')}</h2>
        <LightPollutionMap />
      </section>

      {/* Call to Action */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">{t('home.contributeToOurMission')}</h3>
        <p className="text-gray-600 mb-6">
          {t('home.contributeDescription')}
        </p>
        <Link
          to="/upload"
          className="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          {t('home.getStarted')}
        </Link>
      </div>
      </div>
    </>
  );
};
