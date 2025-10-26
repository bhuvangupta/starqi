import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Dashboard } from '../components/Dashboard';
import { LightPollutionMap } from '../components/LightPollutionMap';
import { IndiaMapPreview } from '../components/IndiaMapPreview';
import { SEO } from '../components/SEO';
import { StructuredData, createOrganizationSchema, createWebsiteSchema } from '../components/StructuredData';

export const HomePage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [stats, setStats] = useState({ users: 0, readings: 0, countries: 0 });

  // Animated counter effect
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        users: Math.min(prev.users + 1, 1247),
        readings: Math.min(prev.readings + 13, 746),
        countries: Math.min(prev.countries + 1, 7)
      }));
    }, 30);

    return () => clearInterval(interval);
  }, []);

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

      <div className="space-y-12">
        {/* Hero Section - Modern & Gen Z Friendly */}
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white rounded-3xl shadow-2xl p-8 md:p-16">
          {/* Animated background elements */}
          <div className="absolute top-0 left-0 w-full h-full opacity-20">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-yellow-300 rounded-full blur-3xl animate-pulse delay-75"></div>
            <div className="absolute top-1/2 left-1/2 w-36 h-36 bg-blue-300 rounded-full blur-3xl animate-pulse delay-150"></div>
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left: Content */}
            <div>
              <div className="inline-block mb-4 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-sm font-medium">
                ✨ Citizen Science for Dark Skies
              </div>

              <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-100">
                Track Light Pollution.<br />
                Save Our Stars. 🌟
              </h1>

              <p className="text-xl md:text-2xl text-purple-100 mb-4">
                {t('home.heroSubtitle')}
              </p>

              <p className="text-lg text-purple-200 mb-8">
                Upload a night sky photo 📸, get instant sky quality analysis 🔬, and join thousands fighting light pollution worldwide 🌍
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/upload"
                  className="group px-8 py-4 bg-white text-purple-600 font-bold rounded-2xl hover:bg-purple-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-center"
                >
                  <span className="inline-flex items-center gap-2">
                    📸 {t('home.uploadSkyPhoto')}
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </Link>

                <a
                  href="#map"
                  className="px-8 py-4 bg-purple-800/40 backdrop-blur-md text-white font-bold rounded-2xl hover:bg-purple-800/60 transition-all duration-300 border-2 border-white/30 hover:border-white/50 text-center"
                >
                  🗺️ {t('home.exploreMap')}
                </a>
              </div>
            </div>

            {/* Right: India Map Preview */}
            <div className="hidden lg:block h-[400px] w-full">
              <IndiaMapPreview />
            </div>
          </div>
        </div>

        {/* Quick Stats - Interactive Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-8 text-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer">
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🌍</div>
            <div className="text-5xl font-black mb-2">{stats.countries}+</div>
            <div className="text-xl font-semibold text-blue-100">Countries Reached</div>
          </div>

          <div className="group bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-8 text-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer">
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">📊</div>
            <div className="text-5xl font-black mb-2">{stats.readings}+</div>
            <div className="text-xl font-semibold text-purple-100">Sky Readings</div>
          </div>

          <div className="group bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-8 text-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer">
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">👥</div>
            <div className="text-5xl font-black mb-2">{stats.users}+</div>
            <div className="text-xl font-semibold text-orange-100">Sky Watchers</div>
          </div>
        </div>

        {/* How It Works - Feature Cards */}
        <section className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-3xl p-8 md:p-12">
          <h2 className="text-4xl md:text-5xl font-black text-gray-800 mb-4 text-center">
            How It Works 🚀
          </h2>
          <p className="text-xl text-gray-600 mb-12 text-center max-w-3xl mx-auto">
            Join the movement in 3 simple steps
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="text-6xl mb-4">📸</div>
              <div className="text-2xl font-bold text-gray-800 mb-3">1. Snap the Sky</div>
              <p className="text-gray-600">
                Take a photo of the night sky with your phone. No fancy equipment needed!
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="text-6xl mb-4">🔬</div>
              <div className="text-2xl font-bold text-gray-800 mb-3">2. Get AI Analysis</div>
              <p className="text-gray-600">
                Our AI analyzes brightness, star count, and calculates your SQM & Bortle rating.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="text-6xl mb-4">🌍</div>
              <div className="text-2xl font-bold text-gray-800 mb-3">3. Make Impact</div>
              <p className="text-gray-600">
                See your data on the global map and contribute to dark sky preservation!
              </p>
            </div>
          </div>
        </section>

        {/* Dashboard */}
        <section>
          <h2 className="text-4xl md:text-5xl font-black text-gray-800 mb-8 text-center">
            📈 Global Stats Dashboard
          </h2>
          <Dashboard />
        </section>

        {/* Map */}
        <section id="map">
          <h2 className="text-4xl md:text-5xl font-black text-gray-800 mb-4 text-center">
            🗺️ Explore the Light Pollution Map
          </h2>
          <p className="text-xl text-gray-600 mb-8 text-center max-w-3xl mx-auto">
            See real-time data from sky watchers around the world
          </p>
          <LightPollutionMap />
        </section>

        {/* Call to Action - Vibrant & Engaging */}
        <div className="relative overflow-hidden bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white rounded-3xl shadow-2xl p-8 md:p-16 text-center">
          {/* Animated background */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-1/4 w-32 h-32 bg-white rounded-full blur-3xl animate-bounce"></div>
            <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-yellow-200 rounded-full blur-3xl animate-bounce delay-75"></div>
          </div>

          <div className="relative z-10">
            <h3 className="text-4xl md:text-6xl font-black mb-6">
              Ready to Make a Difference? 💫
            </h3>
            <p className="text-xl md:text-2xl text-pink-100 mb-8 max-w-3xl mx-auto">
              {t('home.contributeDescription')}
            </p>
            <Link
              to="/upload"
              className="inline-block px-12 py-5 bg-white text-pink-600 font-black text-xl rounded-2xl hover:bg-pink-50 transition-all duration-300 shadow-2xl hover:shadow-pink-300/50 hover:scale-110"
            >
              🚀 {t('home.getStarted')} — It's Free!
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
