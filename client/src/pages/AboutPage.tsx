import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SEO } from '../components/SEO';
import { StructuredData, createOrganizationSchema, createBreadcrumbSchema } from '../components/StructuredData';

interface QuickStats {
  totalUsers: number;
  totalReadings: number;
  countries: number;
}

export const AboutPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [stats, setStats] = useState<QuickStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await apiService.getQuickStats();
        setStats(data);
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  const breadcrumbs = createBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'About', url: '/about' },
  ]);

  const howToSchema = {
    type: 'HowTo' as const,
    name: t('about.howSkyQIWorks'),
    description: t('about.heroSubtitle'),
    step: [
      {
        type: 'HowToStep',
        name: t('about.step1Title'),
        text: t('about.step1Desc'),
      },
      {
        type: 'HowToStep',
        name: t('about.step2Title'),
        text: t('about.step2Desc'),
      },
      {
        type: 'HowToStep',
        name: t('about.step3Title'),
        text: t('about.step3Desc'),
      },
      {
        type: 'HowToStep',
        name: t('about.step4Title'),
        text: t('about.step4Desc'),
      },
      {
        type: 'HowToStep',
        name: t('about.step5Title'),
        text: t('about.step5Desc'),
      },
    ],
  };

  return (
    <>
      <SEO
        title={t('about.heroTitle1') + ' ' + t('about.heroTitle2')}
        description={t('about.heroSubtitle')}
        keywords="SkyQI, light pollution measurement, citizen science, environmental education, dark sky advocacy, Gurgaon, India, student project"
        url="/about"
        locale={i18n.language}
      />
      <StructuredData data={[createOrganizationSchema(), breadcrumbs, howToSchema]} />

      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
        <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <div className="mb-8">
            <div className="w-40 h-40 mx-auto bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white text-6xl font-bold shadow-2xl">
              S
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {t('about.heroTitle1')}
            <br />
            {t('about.heroTitle2')}
          </h1>
          <p className="text-2xl text-gray-600 max-w-3xl mx-auto">
            {t('about.heroSubtitle')}
          </p>
        </section>

        {/* Impact Numbers */}
        {!loading && stats && (
          <section className="bg-white rounded-2xl shadow-xl p-10 mb-16 border border-indigo-100">
            <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
              {t('about.ourImpactSoFar')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl">
                <div className="text-5xl font-bold text-indigo-600 mb-2">
                  {stats.totalUsers.toLocaleString()}
                </div>
                <div className="text-gray-600 text-lg">{t('about.usersWorldwide')}</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                <div className="text-5xl font-bold text-purple-600 mb-2">
                  {stats.totalReadings.toLocaleString()}
                </div>
                <div className="text-gray-600 text-lg">{t('about.measurementsCollected')}</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-pink-50 to-red-50 rounded-xl">
                <div className="text-5xl font-bold text-pink-600 mb-2">
                  {stats.countries}
                </div>
                <div className="text-gray-600 text-lg">{t('about.countriesReached')}</div>
              </div>
            </div>
            <div className="text-center mt-8">
              <Link
                to="/impact"
                className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
              >
                {t('about.viewDetailedDashboard')}
              </Link>
            </div>
          </section>
        )}

        {/* Story Section */}
        <section className="prose prose-lg max-w-none mb-16">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">{t('about.theStoryBehindSkyQI')}</h2>

          <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg mb-8">
            <p className="text-lg italic text-gray-700 mb-0">
              "{t('about.quote')}"
            </p>
          </div>

          <h3 className="text-2xl font-bold mt-8 mb-4 text-gray-800">
            {t('about.discoveringTheProblem')}
          </h3>
          <p className="text-gray-700 leading-relaxed">
            {t('about.problemDescription1')}{' '}
            <strong>{t('about.problemDescription2')}</strong>
            {t('about.problemDescription3')}
          </p>
          <p className="text-gray-700 leading-relaxed">
            {t('about.problemDescription4')}
          </p>
          <ul className="text-gray-700 space-y-2">
            <li>
              <strong>{t('about.disruptsWildlife')}</strong>: {t('about.disruptsWildlifeDesc')}
            </li>
            <li>
              <strong>{t('about.affectsHumanHealth')}</strong>: {t('about.affectsHumanHealthDesc')}
            </li>
            <li>
              <strong>{t('about.wastesEnergy')}</strong>: {t('about.wastesEnergyDesc')}
            </li>
            <li>
              <strong>{t('about.culturalLoss')}</strong>: {t('about.culturalLossDesc')}
            </li>
          </ul>

          <h3 className="text-2xl font-bold mt-8 mb-4 text-gray-800">{t('about.fromFrustrationToAction')}</h3>
          <p className="text-gray-700 leading-relaxed">
            {t('about.frustrationPara1')}
          </p>
          <p className="text-gray-700 leading-relaxed">
            {t('about.frustrationPara2')}
          </p>

          <h3 className="text-2xl font-bold mt-8 mb-4 text-gray-800">{t('about.howSkyQIWorks')}</h3>
          <div className="bg-indigo-50 p-6 rounded-lg">
            <ol className="text-gray-700 space-y-3 mb-0">
              <li className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                  1
                </span>
                <span>
                  <strong>{t('about.step1Title')}</strong> {t('about.step1Desc')}
                </span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                  2
                </span>
                <span>
                  <strong>{t('about.step2Title')}</strong> {t('about.step2Desc')}
                </span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                  3
                </span>
                <span>
                  <strong>{t('about.step3Title')}</strong> {t('about.step3Desc')}
                </span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                  4
                </span>
                <span>
                  <strong>{t('about.step4Title')}</strong>: {t('about.step4Desc')}
                </span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                  5
                </span>
                <span>
                  <strong>{t('about.step5Title')}</strong> {t('about.step5Desc')}
                </span>
              </li>
            </ol>
          </div>
        </section>

        {/* Get Involved Section */}
        <section className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-10 text-white mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">{t('about.getInvolved')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 hover:bg-opacity-20 transition-all">
              <h3 className="font-bold text-xl mb-3">{t('about.forIndividuals')}</h3>
              <p className="text-indigo-100 mb-4">
                {t('about.forIndividualsDesc')}
              </p>
              <Link
                to="/upload"
                className="inline-block bg-white text-indigo-600 px-6 py-2 rounded-lg hover:bg-indigo-50 transition-colors font-semibold"
              >
                {t('about.startMeasuring')}
              </Link>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 hover:bg-opacity-20 transition-all">
              <h3 className="font-bold text-xl mb-3">{t('about.forTeachers')}</h3>
              <p className="text-indigo-100 mb-4">
                {t('about.forTeachersDesc')}
              </p>
              <a
                href="/resources/teachers"
                className="inline-block bg-white text-indigo-600 px-6 py-2 rounded-lg hover:bg-indigo-50 transition-colors font-semibold"
              >
                {t('about.viewResources')}
              </a>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 hover:bg-opacity-20 transition-all">
              <h3 className="font-bold text-xl mb-3">{t('about.forSchools')}</h3>
              <p className="text-indigo-100 mb-4">
                {t('about.forSchoolsDesc')}
              </p>
              <a
                href="mailto:contact@skyqi.org"
                className="inline-block bg-white text-indigo-600 px-6 py-2 rounded-lg hover:bg-indigo-50 transition-colors font-semibold"
              >
                {t('about.getInTouch')}
              </a>
            </div>
          </div>
        </section>

        {/* About Founder */}
        <section className="bg-white rounded-2xl shadow-xl p-10 border border-gray-100">
          <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
            {t('about.aboutTheFounder')}
          </h2>
          <div className="max-w-3xl mx-auto">
            <p className="text-gray-700 leading-relaxed mb-4">
              {t('about.founderPara1')}
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              {t('about.founderPara2')}
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              {t('about.founderPara3')}
            </p>
            <div className="flex justify-center space-x-4">
              <a
                href="https://github.com/yourusername/skyqi"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-800 font-semibold"
              >
                {t('about.github')}
              </a>
              <span className="text-gray-300">|</span>
              <a
                href="mailto:contact@skyqi.org"
                className="text-indigo-600 hover:text-indigo-800 font-semibold"
              >
                {t('about.contact')}
              </a>
            </div>
          </div>
        </section>

        {/* Vision */}
        <section className="text-center py-16">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">{t('about.ourVision')}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            {t('about.visionPara')}
          </p>
          <p className="text-lg text-gray-500 italic">
            "{t('about.visionQuote')}" 🌌
          </p>
        </section>
      </div>
      </div>
    </>
  );
};
