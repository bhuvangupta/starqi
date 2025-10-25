import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { Statistics, LightPollutionLevel } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      const response = await apiService.getStatistics();
      setStats(response.statistics);
      setLoading(false);
    } catch (err: any) {
      setError('Failed to load statistics');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading statistics...</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {error || 'No data available'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <h3 className="text-sm font-semibold uppercase tracking-wide opacity-90">
            Total Readings
          </h3>
          <p className="text-4xl font-bold mt-2">{stats.total_readings.toLocaleString()}</p>
          <p className="text-sm opacity-75 mt-2">Global sky quality measurements</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <h3 className="text-sm font-semibold uppercase tracking-wide opacity-90">
            Average Bortle
          </h3>
          <p className="text-4xl font-bold mt-2">{stats.average_bortle}</p>
          <p className="text-sm opacity-75 mt-2">Worldwide average dark-sky scale</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
          <h3 className="text-sm font-semibold uppercase tracking-wide opacity-90">
            Average SQM
          </h3>
          <p className="text-4xl font-bold mt-2">{stats.average_sqm}</p>
          <p className="text-sm opacity-75 mt-2">mag/arcsec² (higher is darker)</p>
        </div>
      </div>

      {/* Best and Worst Readings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.best_reading && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-2xl">🌟</span>
              Best Sky Quality
            </h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Location:</span>{' '}
                {stats.best_reading.location_name ||
                  `${stats.best_reading.city}, ${stats.best_reading.country}` ||
                  'Unknown'}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">SQM Value:</span>{' '}
                <span className="text-green-600 font-bold">
                  {stats.best_reading.sqm_value?.toFixed(2)}
                </span>{' '}
                mag/arcsec²
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Bortle Scale:</span> Class{' '}
                {stats.best_reading.bortle_scale}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Stars Detected:</span>{' '}
                {stats.best_reading.star_count}
              </p>
            </div>
          </div>
        )}

        {stats.worst_reading && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-2xl">💡</span>
              Highest Light Pollution
            </h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Location:</span>{' '}
                {stats.worst_reading.location_name ||
                  `${stats.worst_reading.city}, ${stats.worst_reading.country}` ||
                  'Unknown'}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">SQM Value:</span>{' '}
                <span className="text-red-600 font-bold">
                  {stats.worst_reading.sqm_value?.toFixed(2)}
                </span>{' '}
                mag/arcsec²
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Bortle Scale:</span> Class{' '}
                {stats.worst_reading.bortle_scale}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Stars Detected:</span>{' '}
                {stats.worst_reading.star_count || 0}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Top Countries Chart */}
      {stats.top_countries && stats.top_countries.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Top Countries by Readings
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.top_countries}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="country" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#3b82f6" name="Number of Readings" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="font-bold text-gray-800 mb-2">What is Light Pollution?</h4>
          <p className="text-sm text-gray-600">
            Light pollution is excessive or misdirected artificial light that brightens the night
            sky, obscuring stars and affecting ecosystems, human health, and astronomical
            observations.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="font-bold text-gray-800 mb-2">Bortle Scale Explained</h4>
          <p className="text-sm text-gray-600">
            The Bortle Dark-Sky Scale measures night sky brightness from Class 1 (excellent
            dark-sky site) to Class 9 (inner-city sky). Lower numbers indicate darker, better
            quality skies.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="font-bold text-gray-800 mb-2">Sky Quality Meter (SQM)</h4>
          <p className="text-sm text-gray-600">
            SQM measures sky brightness in magnitudes per square arcsecond. Higher values (21-22)
            indicate darker skies, while lower values (15-17) indicate significant light pollution.
          </p>
        </div>
      </div>
    </div>
  );
};
