import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { Link } from 'react-router-dom';

interface QuickStats {
  totalUsers: number;
  totalReadings: number;
  countries: number;
}

export const AboutPage: React.FC = () => {
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

  return (
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
            Measuring Light Pollution,
            <br />
            One Photo at a Time
          </h1>
          <p className="text-2xl text-gray-600 max-w-3xl mx-auto">
            A student-led initiative from Gurgaon, India to restore our dark skies
          </p>
        </section>

        {/* Impact Numbers */}
        {!loading && stats && (
          <section className="bg-white rounded-2xl shadow-xl p-10 mb-16 border border-indigo-100">
            <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
              Our Impact So Far
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl">
                <div className="text-5xl font-bold text-indigo-600 mb-2">
                  {stats.totalUsers.toLocaleString()}
                </div>
                <div className="text-gray-600 text-lg">Users Worldwide</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                <div className="text-5xl font-bold text-purple-600 mb-2">
                  {stats.totalReadings.toLocaleString()}
                </div>
                <div className="text-gray-600 text-lg">Measurements Collected</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-pink-50 to-red-50 rounded-xl">
                <div className="text-5xl font-bold text-pink-600 mb-2">
                  {stats.countries}
                </div>
                <div className="text-gray-600 text-lg">Countries Reached</div>
              </div>
            </div>
            <div className="text-center mt-8">
              <Link
                to="/impact"
                className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
              >
                View Detailed Impact Dashboard →
              </Link>
            </div>
          </section>
        )}

        {/* Story Section */}
        <section className="prose prose-lg max-w-none mb-16">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">The Story Behind StarQI</h2>

          <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg mb-8">
            <p className="text-lg italic text-gray-700 mb-0">
              "I've been fascinated by the night sky for as long as I can remember. But over
              the years in Gurgaon, I watched the stars disappear one by one. By the time I
              reached Class 11, I could barely see a dozen stars on a clear night. I asked
              myself: where did all the stars go?"
            </p>
          </div>

          <h3 className="text-2xl font-bold mt-8 mb-4 text-gray-800">
            Discovering the Problem
          </h3>
          <p className="text-gray-700 leading-relaxed">
            That question led me down a path of research. I discovered that{' '}
            <strong>80% of the world's population lives under light-polluted skies</strong>.
            More than one-third of humanity can never see the Milky Way from their homes.
          </p>
          <p className="text-gray-700 leading-relaxed">
            But the problem went far beyond astronomy. Light pollution:
          </p>
          <ul className="text-gray-700 space-y-2">
            <li>
              <strong>Disrupts wildlife</strong>: Birds migrate at wrong times, sea turtles
              can't find the ocean, nocturnal ecosystems collapse
            </li>
            <li>
              <strong>Affects human health</strong>: Sleep disruption, circadian rhythm
              disorders, linked to serious health issues
            </li>
            <li>
              <strong>Wastes energy</strong>: 30% of outdoor lighting in the US is wasted,
              costing $3.3 billion annually
            </li>
            <li>
              <strong>Cultural loss</strong>: An entire generation growing up never seeing
              the Milky Way
            </li>
          </ul>

          <h3 className="text-2xl font-bold mt-8 mb-4 text-gray-800">From Frustration to Action</h3>
          <p className="text-gray-700 leading-relaxed">
            As a student in Gurgaon - one of India's most rapidly developing cities - I
            witnessed firsthand how unchecked urbanization creates environmental problems.
            But unlike air quality, there was no easy way for citizens to measure light
            pollution.
          </p>
          <p className="text-gray-700 leading-relaxed">
            So I taught myself full-stack development and built StarQI. After months of
            coding, researching sky quality measurement algorithms, and testing different
            approaches, I launched a platform where anyone with a smartphone can become a
            citizen scientist.
          </p>

          <h3 className="text-2xl font-bold mt-8 mb-4 text-gray-800">How StarQI Works</h3>
          <div className="bg-indigo-50 p-6 rounded-lg">
            <ol className="text-gray-700 space-y-3 mb-0">
              <li className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                  1
                </span>
                <span>
                  <strong>Take a photo</strong> of the night sky with your smartphone
                </span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                  2
                </span>
                <span>
                  <strong>Upload to StarQI</strong> with your location
                </span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                  3
                </span>
                <span>
                  <strong>AI analyzes</strong> brightness, star count, color temperature, and
                  light pollution
                </span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                  4
                </span>
                <span>
                  <strong>Get results</strong>: SQM value, Bortle Scale rating, NELM, and
                  pollution level
                </span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                  5
                </span>
                <span>
                  <strong>See it on the map</strong> and contribute to global knowledge
                </span>
              </li>
            </ol>
          </div>
        </section>

        {/* Get Involved Section */}
        <section className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-10 text-white mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Get Involved</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 hover:bg-opacity-20 transition-all">
              <h3 className="font-bold text-xl mb-3">🌟 For Individuals</h3>
              <p className="text-indigo-100 mb-4">
                Upload your first sky quality reading and join the citizen science movement
              </p>
              <Link
                to="/upload"
                className="inline-block bg-white text-indigo-600 px-6 py-2 rounded-lg hover:bg-indigo-50 transition-colors font-semibold"
              >
                Start Measuring
              </Link>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 hover:bg-opacity-20 transition-all">
              <h3 className="font-bold text-xl mb-3">📚 For Teachers</h3>
              <p className="text-indigo-100 mb-4">
                Bring citizen science to your classroom with ready-to-use lesson plans
              </p>
              <a
                href="/resources/teachers"
                className="inline-block bg-white text-indigo-600 px-6 py-2 rounded-lg hover:bg-indigo-50 transition-colors font-semibold"
              >
                View Resources
              </a>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 hover:bg-opacity-20 transition-all">
              <h3 className="font-bold text-xl mb-3">🏫 For Schools</h3>
              <p className="text-indigo-100 mb-4">
                Partner with us for environmental education and citizen science projects
              </p>
              <a
                href="mailto:contact@starqi.org"
                className="inline-block bg-white text-indigo-600 px-6 py-2 rounded-lg hover:bg-indigo-50 transition-colors font-semibold"
              >
                Get in Touch
              </a>
            </div>
          </div>
        </section>

        {/* About Founder */}
        <section className="bg-white rounded-2xl shadow-xl p-10 border border-gray-100">
          <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
            About the Founder
          </h2>
          <div className="max-w-3xl mx-auto">
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>StarQI</strong> was founded by a Class 11 student at Amity
              International School Sector 46, Gurgaon. Passionate about astronomy,
              environmental science, and technology, they taught themselves full-stack web
              development to build this platform from scratch.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              The entire project - including the web application, mobile app, and image
              analysis algorithms - was built independently, demonstrating that meaningful
              change doesn't require waiting until you're older. With the right tools and
              determination, students can create real environmental impact today.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              This project combines interests in computer science, environmental advocacy,
              and community engagement, with plans to study these fields at university and
              continue building technology for social good.
            </p>
            <div className="flex justify-center space-x-4">
              <a
                href="https://github.com/yourusername/starqi"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-800 font-semibold"
              >
                GitHub →
              </a>
              <span className="text-gray-300">|</span>
              <a
                href="mailto:contact@starqi.org"
                className="text-indigo-600 hover:text-indigo-800 font-semibold"
              >
                Contact →
              </a>
            </div>
          </div>
        </section>

        {/* Vision */}
        <section className="text-center py-16">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Our Vision</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            To empower individuals, communities, and researchers worldwide to measure,
            understand, and combat light pollution through accessible technology and
            data-driven advocacy.
          </p>
          <p className="text-lg text-gray-500 italic">
            "Look up. Notice. Act. Together, we can restore our night skies." 🌌
          </p>
        </section>
      </div>
    </div>
  );
};
