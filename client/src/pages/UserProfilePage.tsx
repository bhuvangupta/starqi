import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { apiService } from '../services/api';
import { useAuthStore } from '../stores/authStore';
import { SEO } from '../components/SEO';
import { ShareButtons } from '../components/ShareButtons';
import { Link } from 'react-router-dom';

interface UserStats {
  totalReadings: number;
  joinDate: string;
  rank: number;
  bestReading: any;
  recentReadings: any[];
}

export const UserProfilePage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user, isAuthenticated } = useAuthStore();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserStats();
    }
  }, [isAuthenticated, user]);

  const loadUserStats = async () => {
    try {
      setLoading(true);
      const data = await apiService.getUserStats('me');
      setStats({
        totalReadings: data.stats.totalReadings,
        joinDate: data.user.created_at,
        rank: data.stats.rank || 0,
        bestReading: data.stats.bestReading,
        recentReadings: data.stats.recentReadings
      });
    } catch (err) {
      console.error('Failed to load user stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Login Required</h2>
          <p className="text-gray-600 mb-6">Please login to view your profile</p>
          <Link
            to="/login"
            className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-48 bg-gray-200 rounded-2xl"></div>
          <div className="h-64 bg-gray-200 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={`${user?.full_name || user?.username}'s Profile`}
        description="View your SkyQI profile, stats, and contribution history"
        url="/profile"
        locale={i18n.language}
      />

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Profile Header */}
        <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-yellow-300 rounded-full blur-3xl animate-pulse delay-75"></div>
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-white/20 backdrop-blur-md rounded-full border-4 border-white/40 flex items-center justify-center text-6xl">
                👤
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-black mb-2">{user?.full_name || user?.username}</h1>
              <p className="text-purple-200 text-lg mb-1">{user?.email}</p>
              {user?.state && user?.country && (
                <p className="text-purple-300">
                  📍 {user.state}, {user.country}
                </p>
              )}
              <p className="text-sm text-purple-200 mt-3">
                ✨ Member since {new Date(stats?.joinDate || '').toLocaleDateString()}
              </p>
            </div>

            {/* Quick Stats */}
            <div className="flex gap-6">
              <div className="text-center bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                <div className="text-4xl font-black">{stats?.totalReadings || 0}</div>
                <div className="text-sm text-purple-200">Readings</div>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                <div className="text-4xl font-black">#{stats?.rank || '—'}</div>
                <div className="text-sm text-purple-200">Rank</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Contributions */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white text-2xl">
                📊
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Total Contributions</h3>
                <p className="text-3xl font-black text-blue-600">{stats?.totalReadings || 0}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">Sky quality measurements uploaded</p>
          </div>

          {/* Best Reading */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white text-2xl">
                🌟
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Best Sky Quality</h3>
                <p className="text-3xl font-black text-green-600">
                  {stats?.bestReading?.sqm_value || '—'}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600">Darkest sky you've found</p>
          </div>

          {/* Achievements */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white text-2xl">
                🏆
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Achievements</h3>
                <p className="text-3xl font-black text-purple-600">0</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">Badges earned (coming soon!)</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>📸</span>
            Recent Activity
          </h2>

          {stats?.recentReadings && stats.recentReadings.length > 0 ? (
            <div className="space-y-4">
              {stats.recentReadings.map((reading: any) => (
                <div
                  key={reading.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-purple-300 transition-colors"
                >
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {reading.location_name || reading.city || 'Unknown Location'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {new Date(reading.observation_datetime).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-purple-600">
                      SQM: {reading.sqm_value ? Number(reading.sqm_value).toFixed(2) : 'N/A'}
                    </p>
                    <p className="text-sm text-gray-600">Bortle: {reading.bortle_scale}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🌌</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No readings yet</h3>
              <p className="text-gray-600 mb-6">
                Upload your first night sky photo to start tracking light pollution!
              </p>
              <Link
                to="/upload"
                className="inline-block px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
              >
                📸 Upload Your First Photo
              </Link>
            </div>
          )}
        </div>

        {/* Share Profile */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Share Your Impact</h2>
          <p className="text-gray-600 mb-4">
            Inspire others to join the fight against light pollution!
          </p>
          <ShareButtons
            url={window.location.href}
            title={`I'm tracking light pollution with SkyQI! 🌟 Join me in preserving our dark skies.`}
            description={`${stats?.totalReadings || 0} sky quality measurements contributed to citizen science`}
            hashtags={['SkyQI', 'DarkSkies', 'CitizenScience']}
          />
        </div>
      </div>
    </>
  );
};
