import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { apiService } from '../services/api';
import { Statistics, LightPollutionLevel } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const Dashboard: React.FC = () => {
  const { t } = useTranslation();
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
          <p className="mt-4 text-gray-600">{t('dashboard.loadingStatistics')}</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {error || t('dashboard.noDataAvailable')}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <h3 className="text-sm font-semibold uppercase tracking-wide opacity-90">
            {t('dashboard.totalReadings')}
          </h3>
          <p className="text-4xl font-bold mt-2">{stats.total_readings.toLocaleString()}</p>
          <p className="text-sm opacity-75 mt-2">{t('dashboard.globalMeasurements')}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <h3 className="text-sm font-semibold uppercase tracking-wide opacity-90">
            {t('dashboard.averageBortle')}
          </h3>
          <p className="text-4xl font-bold mt-2">{stats.average_bortle}</p>
          <p className="text-sm opacity-75 mt-2">{t('dashboard.worldwideAverage')}</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
          <h3 className="text-sm font-semibold uppercase tracking-wide opacity-90">
            {t('dashboard.averageSQM')}
          </h3>
          <p className="text-4xl font-bold mt-2">{stats.average_sqm}</p>
          <p className="text-sm opacity-75 mt-2">{t('dashboard.sqmDescription')}</p>
        </div>
      </div>

      {/* Best and Worst Readings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.best_reading && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-2xl">🌟</span>
              {t('dashboard.bestSkyQuality')}
            </h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">{t('dashboard.location')}:</span>{' '}
                {stats.best_reading.location_name ||
                  `${stats.best_reading.city}, ${stats.best_reading.country}` ||
                  t('map.unknownLocation')}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">{t('dashboard.sqmValue')}:</span>{' '}
                <span className="text-green-600 font-bold">
                  {stats.best_reading.sqm_value ? Number(stats.best_reading.sqm_value).toFixed(2) : 'N/A'}
                </span>{' '}
                mag/arcsec²
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">{t('dashboard.bortleScale')}:</span> {t('map.class')}{' '}
                {stats.best_reading.bortle_scale}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">{t('dashboard.starsDetected')}:</span>{' '}
                {stats.best_reading.star_count}
              </p>
            </div>
          </div>
        )}

        {stats.worst_reading && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-2xl">💡</span>
              {t('dashboard.highestLightPollution')}
            </h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">{t('dashboard.location')}:</span>{' '}
                {stats.worst_reading.location_name ||
                  `${stats.worst_reading.city}, ${stats.worst_reading.country}` ||
                  t('map.unknownLocation')}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">{t('dashboard.sqmValue')}:</span>{' '}
                <span className="text-red-600 font-bold">
                  {stats.worst_reading.sqm_value ? Number(stats.worst_reading.sqm_value).toFixed(2) : 'N/A'}
                </span>{' '}
                mag/arcsec²
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">{t('dashboard.bortleScale')}:</span> {t('map.class')}{' '}
                {stats.worst_reading.bortle_scale}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">{t('dashboard.starsDetected')}:</span>{' '}
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
            {t('dashboard.topCountries')}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.top_countries}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="country" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#3b82f6" name={t('dashboard.numberOfReadings')} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="font-bold text-gray-800 mb-2">{t('dashboard.whatIsLightPollution')}</h4>
          <p className="text-sm text-gray-600">
            {t('dashboard.lightPollutionDesc')}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="font-bold text-gray-800 mb-2">{t('dashboard.bortleScaleExplained')}</h4>
          <p className="text-sm text-gray-600">
            {t('dashboard.bortleScaleDesc')}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="font-bold text-gray-800 mb-2">{t('dashboard.sqmMeterExplained')}</h4>
          <p className="text-sm text-gray-600">
            {t('dashboard.sqmMeterDesc')}
          </p>
        </div>
      </div>
    </div>
  );
};
