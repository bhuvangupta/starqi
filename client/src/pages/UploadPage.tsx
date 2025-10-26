import React from 'react';
import { useTranslation } from 'react-i18next';
import { PhotoUpload } from '../components/PhotoUpload';
import { SEO } from '../components/SEO';
import { StructuredData, createBreadcrumbSchema } from '../components/StructuredData';

export const UploadPage: React.FC = () => {
  const { t, i18n } = useTranslation();

  const breadcrumbs = createBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Upload', url: '/upload' },
  ]);

  return (
    <>
      <SEO
        title={t('upload.pageTitle')}
        description={t('upload.pageDescription')}
        keywords="upload sky photo, measure light pollution, sky quality meter, upload night sky, citizen science contribution, SQM measurement"
        url="/upload"
        locale={i18n.language}
      />
      <StructuredData data={breadcrumbs} />

      <div className="space-y-8">
        {/* Hero Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 text-white rounded-3xl shadow-2xl p-8 md:p-12">
          {/* Animated background elements */}
          <div className="absolute top-0 left-0 w-full h-full opacity-20">
            <div className="absolute top-10 right-10 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 left-10 w-40 h-40 bg-yellow-300 rounded-full blur-3xl animate-pulse delay-75"></div>
          </div>

          <div className="relative z-10 max-w-3xl">
            <div className="inline-block mb-4 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-sm font-medium">
              📸 Contribute to Citizen Science
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight">
              Upload Your Night Sky Photo
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 mb-4">
              Get instant sky quality analysis and help map light pollution worldwide
            </p>
          </div>
        </div>

        {/* How It Works - Brief Instructions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-200">
            <div className="text-4xl mb-3">📸</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">1. Upload Photo</h3>
            <p className="text-sm text-gray-600">
              Drop your night sky photo below. Any photo of the night sky works - no professional equipment needed!
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
            <div className="text-4xl mb-3">📍</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">2. Add Location</h3>
            <p className="text-sm text-gray-600">
              Click "Use Current Location" or manually enter coordinates. This helps us map light pollution accurately.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
            <div className="text-4xl mb-3">🔬</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">3. Get Analysis</h3>
            <p className="text-sm text-gray-600">
              Our AI analyzes your photo instantly! Get SQM value, Bortle scale, star count, and pollution level.
            </p>
          </div>
        </div>

        {/* Upload Component */}
        <PhotoUpload />

        {/* What Happens After */}
        <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-8 border border-indigo-200">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            ✨ What Happens After Upload?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🗺️</span>
              <div>
                <h4 className="font-semibold mb-1">Appears on Global Map</h4>
                <p className="text-sm text-gray-600">Your reading shows up instantly on our interactive light pollution map with a purple marker</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">📊</span>
              <div>
                <h4 className="font-semibold mb-1">Updates Statistics</h4>
                <p className="text-sm text-gray-600">Contributes to global sky quality data and helps track light pollution trends</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🌌</span>
              <div>
                <h4 className="font-semibold mb-1">Joins Photo Gallery</h4>
                <p className="text-sm text-gray-600">Your photo appears in our community gallery (if you're logged in)</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🔗</span>
              <div>
                <h4 className="font-semibold mb-1">Share Your Results</h4>
                <p className="text-sm text-gray-600">Get shareable results to spread awareness about light pollution on social media</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
