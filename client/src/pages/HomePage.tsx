import React from 'react';
import { Link } from 'react-router-dom';
import { Dashboard } from '../components/Dashboard';
import { LightPollutionMap } from '../components/LightPollutionMap';

export const HomePage: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-dark-sky-900 to-dark-sky-800 text-white rounded-lg shadow-xl p-8 md:p-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          StarQI - Light Pollution Portal
        </h1>
        <p className="text-xl md:text-2xl text-dark-sky-200 mb-6">
          Measure, track, and visualize light pollution worldwide
        </p>
        <p className="text-lg text-dark-sky-300 mb-8">
          Upload photos of the night sky to analyze sky quality, or explore global light pollution
          data from our community. Help preserve our view of the stars.
        </p>
        <div className="flex gap-4">
          <Link
            to="/upload"
            className="px-6 py-3 bg-white text-dark-sky-900 font-semibold rounded-lg hover:bg-dark-sky-100 transition-colors"
          >
            Upload Sky Photo
          </Link>
          <a
            href="#map"
            className="px-6 py-3 bg-dark-sky-700 text-white font-semibold rounded-lg hover:bg-dark-sky-600 transition-colors"
          >
            Explore Map
          </a>
        </div>
      </div>

      {/* Dashboard */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Global Statistics</h2>
        <Dashboard />
      </section>

      {/* Map */}
      <section id="map">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Light Pollution Map</h2>
        <LightPollutionMap />
      </section>

      {/* Call to Action */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Contribute to Our Mission</h3>
        <p className="text-gray-600 mb-6">
          Join thousands of sky quality enthusiasts worldwide. Upload your night sky photos and
          help create a comprehensive global light pollution database.
        </p>
        <Link
          to="/upload"
          className="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
};
