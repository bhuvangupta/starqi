import React from 'react';
import { useTranslation } from 'react-i18next';
import { LightPollutionMap } from '../components/LightPollutionMap';
import { SEO } from '../components/SEO';

export const MapPage: React.FC = () => {
  const { t, i18n } = useTranslation();

  return (
    <>
      <SEO
        title="Light Pollution Map - SkyQI"
        description="Explore the interactive global light pollution map. Search locations, view VIIRS satellite data, Bortle scale ratings, and sky quality measurements worldwide."
        keywords="light pollution map, VIIRS data, Bortle scale, sky quality map, dark sky map, satellite data, SQM measurements, night sky quality"
        url="/map"
        locale={i18n.language}
      />

      <div className="space-y-6">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight">
              🗺️ Light Pollution Map
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 mb-4">
              Explore sky quality data from around the world
            </p>
            <p className="text-lg text-purple-200">
              Search any location, click to analyze VIIRS satellite data, and discover the quality of night skies globally. Filter to see user-submitted readings or explore all data points.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-2">🔍</div>
            <h3 className="font-bold text-gray-800 mb-1">Location Search</h3>
            <p className="text-sm text-gray-600">
              Search for any city, park, or landmark worldwide
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-2">🛰️</div>
            <h3 className="font-bold text-gray-800 mb-1">VIIRS Data</h3>
            <p className="text-sm text-gray-600">
              Click anywhere to get satellite light pollution data
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-2">👥</div>
            <h3 className="font-bold text-gray-800 mb-1">User Readings</h3>
            <p className="text-sm text-gray-600">
              View community-submitted sky quality measurements
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-2">📊</div>
            <h3 className="font-bold text-gray-800 mb-1">Bortle Scale</h3>
            <p className="text-sm text-gray-600">
              Understand sky darkness from Class 1 (pristine) to 9 (city)
            </p>
          </div>
        </div>

        {/* Map Component */}
        <LightPollutionMap />

        {/* Info Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            💡 How to Use the Map
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">🔍 Search for Locations</h3>
              <p className="text-gray-600 text-sm">
                Type a city, dark sky park, or landmark name in the search bar. Select from the dropdown to fly to that location and view its light pollution data.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-2">🖱️ Click to Analyze</h3>
              <p className="text-gray-600 text-sm">
                Click anywhere on the map to get detailed VIIRS satellite data including Bortle Scale, SQM, NELM, and radiance measurements for that exact location.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-2">👥 Filter User Data</h3>
              <p className="text-gray-600 text-sm">
                Toggle "User Submitted Only" to see readings contributed by the community. User submissions appear with purple borders and larger markers.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-2">📊 Understand Metrics</h3>
              <p className="text-gray-600 text-sm">
                Bortle Scale (1-9): Lower is darker. SQM: Higher is darker. NELM: Higher means more visible stars. Use the color legend to interpret Bortle classes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
