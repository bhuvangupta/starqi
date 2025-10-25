import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface ImpactData {
  community: {
    totalUsers: number;
    totalReadings: number;
    countries: number;
    citiesInIndia: number;
    activeThisMonth: number;
  };
  geographic: {
    topCities: Array<{ city: string; country: string; count: number }>;
    topIndianCities: Array<{ city: string; count: number }>;
    readingsByCountry: Array<{ country: string; count: number }>;
  };
  growth: {
    readingsByMonth: Array<{ month: string; count: number }>;
    usersByMonth: Array<{ month: string; count: number }>;
  };
  manual: {
    schools: number;
    workshops: number;
    studentsEngaged: number;
    mediaMentions: number;
  };
}

export const ImpactPage: React.FC = () => {
  const [data, setData] = useState<ImpactData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadImpactData = async () => {
      try {
        const impactData = await apiService.getImpactMetrics();
        setData(impactData);
      } catch (err) {
        console.error('Error loading impact data:', err);
        setError('Failed to load impact data');
      } finally {
        setLoading(false);
      }
    };
    loadImpactData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading impact data...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>{error || 'Failed to load data'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            StarQI Impact Dashboard
          </h1>
          <p className="text-xl text-gray-600">
            Measuring our collective progress in fighting light pollution
          </p>
        </div>

        {/* Community Metrics */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Community Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <MetricCard
              title="Total Users"
              value={data.community.totalUsers.toLocaleString()}
              icon="👥"
              color="indigo"
            />
            <MetricCard
              title="Total Readings"
              value={data.community.totalReadings.toLocaleString()}
              icon="📊"
              color="purple"
            />
            <MetricCard
              title="Countries Reached"
              value={data.community.countries}
              icon="🌍"
              color="pink"
            />
            <MetricCard
              title="Cities in India"
              value={data.community.citiesInIndia}
              icon="🇮🇳"
              color="blue"
            />
            <MetricCard
              title="Active This Month"
              value={data.community.activeThisMonth.toLocaleString()}
              icon="✨"
              color="green"
            />
            <MetricCard
              title="Avg. Readings/User"
              value={(
                data.community.totalReadings / Math.max(data.community.totalUsers, 1)
              ).toFixed(1)}
              icon="📈"
              color="yellow"
            />
          </div>
        </section>

        {/* Community Impact (Manual Metrics) */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Community Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Schools Partnered"
              value={data.manual.schools}
              icon="🏫"
              color="indigo"
            />
            <MetricCard
              title="Workshops Conducted"
              value={data.manual.workshops}
              icon="🎓"
              color="purple"
            />
            <MetricCard
              title="Students Engaged"
              value={data.manual.studentsEngaged.toLocaleString()}
              icon="🎒"
              color="pink"
            />
            <MetricCard
              title="Media Mentions"
              value={data.manual.mediaMentions}
              icon="📰"
              color="blue"
            />
          </div>
        </section>

        {/* Growth Charts */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Growth Over Time</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Readings Growth */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4 text-gray-800">
                Readings by Month
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.growth.readingsByMonth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#6366f1"
                    strokeWidth={3}
                    name="Readings"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Users Growth */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Users by Month</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.growth.usersByMonth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#a855f7"
                    strokeWidth={3}
                    name="Users"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Geographic Distribution */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">
            Geographic Distribution
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Cities Globally */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4 text-gray-800">
                Top 10 Cities Worldwide
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data.geographic.topCities}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="city" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#6366f1" name="Readings" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Top Cities in India */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4 text-gray-800">
                Top 10 Cities in India 🇮🇳
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data.geographic.topIndianCities}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="city" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#ec4899" name="Readings" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Countries Distribution */}
        <section className="mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              Top 10 Countries by Readings
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={data.geographic.readingsByCountry}
                layout="horizontal"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="country" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="count" fill="#a855f7" name="Readings" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-10 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Be Part of the Change</h2>
          <p className="text-xl mb-8 text-indigo-100">
            Every reading contributes to our understanding of light pollution and helps
            drive environmental action
          </p>
          <div className="flex justify-center space-x-4">
            <a
              href="/upload"
              className="bg-white text-indigo-600 px-8 py-3 rounded-lg hover:bg-indigo-50 transition-colors font-semibold"
            >
              Upload Your Reading
            </a>
            <a
              href="/map"
              className="bg-indigo-700 text-white px-8 py-3 rounded-lg hover:bg-indigo-800 transition-colors font-semibold"
            >
              View Global Map
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

// Reusable Metric Card Component
interface MetricCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: 'indigo' | 'purple' | 'pink' | 'blue' | 'green' | 'yellow';
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, color }) => {
  const colorClasses = {
    indigo: 'from-indigo-50 to-indigo-100 text-indigo-600',
    purple: 'from-purple-50 to-purple-100 text-purple-600',
    pink: 'from-pink-50 to-pink-100 text-pink-600',
    blue: 'from-blue-50 to-blue-100 text-blue-600',
    green: 'from-green-50 to-green-100 text-green-600',
    yellow: 'from-yellow-50 to-yellow-100 text-yellow-600',
  };

  return (
    <div
      className={`bg-gradient-to-br ${colorClasses[color]} rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-4xl">{icon}</span>
        <span className="text-3xl font-bold">{value}</span>
      </div>
      <div className="text-sm font-semibold opacity-80">{title}</div>
    </div>
  );
};
