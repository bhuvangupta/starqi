import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { apiService } from '../services/api';
import { SEO } from '../components/SEO';
import { Link } from 'react-router-dom';

interface PhotoData {
  id: string;
  photoUrl: string;
  fileFormat: string;
  cameraModel: string | null;
  isoValue: number | null;
  exposureTime: string | null;
  aperture: string | null;
  createdAt: string;
  // Attribution fields
  sourceName: string | null;
  sourceUrl: string | null;
  photographerName: string | null;
  licenseType: string | null;
  attributionText: string | null;
  reading: {
    id: string;
    locationName: string | null;
    city: string | null;
    country: string | null;
    sqmValue: number | null;
    bortleScale: number | null;
    lightPollutionLevel: string;
    starCount: number | null;
    observationDatetime: string;
  };
  user: {
    id: string;
    username: string;
    fullName: string | null;
    state: string | null;
    country: string | null;
  } | null;
}

export const PhotoGalleryPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [photos, setPhotos] = useState<PhotoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoData | null>(null);

  // Helper function to get full image URL
  const getImageUrl = (photoUrl: string) => {
    // If URL already starts with http, return as-is
    if (photoUrl.startsWith('http://') || photoUrl.startsWith('https://')) {
      return photoUrl;
    }
    // Otherwise, prepend the API base URL
    const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
    const baseUrl = apiBaseUrl.replace('/api', ''); // Remove /api suffix
    return `${baseUrl}${photoUrl}`;
  };

  useEffect(() => {
    loadPhotos();
  }, [page]);

  const loadPhotos = async () => {
    try {
      setLoading(true);
      const data = await apiService.getPhotoFeed({ page, limit: 20 });
      setPhotos(data.photos);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error('Failed to load photos:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPollutionColor = (level: string) => {
    const colors: Record<string, string> = {
      excellent: 'text-green-600 bg-green-100',
      good: 'text-blue-600 bg-blue-100',
      moderate: 'text-yellow-600 bg-yellow-100',
      poor: 'text-orange-600 bg-orange-100',
      very_poor: 'text-red-600 bg-red-100',
    };
    return colors[level] || 'text-gray-600 bg-gray-100';
  };

  const formatLocation = (photo: PhotoData) => {
    if (photo.reading.city && photo.reading.country) {
      return `${photo.reading.city}, ${photo.reading.country}`;
    }
    if (photo.reading.locationName) {
      return photo.reading.locationName;
    }
    return photo.reading.country || 'Unknown Location';
  };

  if (loading && photos.length === 0) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-xl"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Photo Gallery - SkyQI"
        description="Browse stunning night sky photos from sky watchers around the world. Explore light pollution data and sky quality measurements."
        url="/gallery"
        locale={i18n.language}
      />

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Sky Gallery 🌌
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore stunning night sky photos captured by sky watchers from around the world.
            Each photo tells a story about light pollution and sky quality.
          </p>
        </div>

        {/* Photo Grid - Instagram Style */}
        {photos.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="group relative aspect-square bg-gray-900 rounded-xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  onClick={() => setSelectedPhoto(photo)}
                >
                  {/* Photo Image */}
                  <img
                    src={getImageUrl(photo.photoUrl)}
                    alt={formatLocation(photo)}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />

                  {/* Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    {/* Location */}
                    <div className="text-white mb-2">
                      <p className="font-bold text-lg">📍 {formatLocation(photo)}</p>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-3 text-white text-sm">
                      {photo.reading.sqmValue && (
                        <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md rounded-lg px-2 py-1">
                          <span className="font-semibold">SQM:</span>
                          <span>{Number(photo.reading.sqmValue).toFixed(2)}</span>
                        </div>
                      )}
                      {photo.reading.bortleScale && (
                        <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md rounded-lg px-2 py-1">
                          <span className="font-semibold">Bortle:</span>
                          <span>{photo.reading.bortleScale}</span>
                        </div>
                      )}
                    </div>

                    {/* Attribution */}
                    {photo.sourceName ? (
                      <div className="mt-2 text-purple-200 text-sm">
                        <span>📸 </span>
                        {photo.sourceUrl ? (
                          <a
                            href={photo.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold hover:text-white hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {photo.photographerName || photo.sourceName}
                          </a>
                        ) : (
                          <span className="font-semibold">{photo.photographerName || photo.sourceName}</span>
                        )}
                        {photo.licenseType && (
                          <span className="text-xs ml-2 opacity-80">({photo.licenseType})</span>
                        )}
                      </div>
                    ) : photo.user ? (
                      <div className="mt-2 text-purple-200 text-sm">
                        <span>📸 by </span>
                        <Link
                          to={`/profile/${photo.user.id}`}
                          className="font-semibold hover:text-white hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {photo.user.fullName || photo.user.username}
                        </Link>
                      </div>
                    ) : null}
                  </div>

                  {/* Pollution Level Badge */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPollutionColor(photo.reading.lightPollutionLevel)}`}>
                      {photo.reading.lightPollutionLevel.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  ← Previous
                </button>
                <span className="text-gray-600 font-semibold">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <div className="text-8xl mb-6">📸</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">No Photos Yet</h2>
            <p className="text-gray-600 mb-8 max-w-xl mx-auto">
              Be the first to share your night sky photos! Upload a photo to analyze sky quality and contribute to citizen science.
            </p>
            <Link
              to="/upload"
              className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
            >
              📸 Upload Your First Photo
            </Link>
          </div>
        )}
      </div>

      {/* Photo Detail Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Photo */}
              <div className="relative aspect-square lg:aspect-auto bg-gray-900">
                <img
                  src={getImageUrl(selectedPhoto.photoUrl)}
                  alt={formatLocation(selectedPhoto)}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Details */}
              <div className="p-8 space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-3xl font-black text-gray-800 mb-2">
                      📍 {formatLocation(selectedPhoto)}
                    </h2>
                    {selectedPhoto.sourceName ? (
                      <div className="text-gray-600 space-y-1">
                        <p>
                          Photo by{' '}
                          {selectedPhoto.sourceUrl ? (
                            <a
                              href={selectedPhoto.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-semibold text-purple-600 hover:underline"
                            >
                              {selectedPhoto.photographerName || selectedPhoto.sourceName}
                            </a>
                          ) : (
                            <span className="font-semibold text-purple-600">
                              {selectedPhoto.photographerName || selectedPhoto.sourceName}
                            </span>
                          )}
                        </p>
                        {selectedPhoto.attributionText && (
                          <p className="text-sm text-gray-500 italic">{selectedPhoto.attributionText}</p>
                        )}
                      </div>
                    ) : selectedPhoto.user ? (
                      <p className="text-gray-600">
                        Captured by{' '}
                        <Link
                          to={`/profile/${selectedPhoto.user.id}`}
                          className="font-semibold text-purple-600 hover:underline"
                        >
                          {selectedPhoto.user.fullName || selectedPhoto.user.username}
                        </Link>
                      </p>
                    ) : null}
                  </div>
                  <button
                    onClick={() => setSelectedPhoto(null)}
                    className="text-gray-400 hover:text-gray-600 text-3xl"
                  >
                    ×
                  </button>
                </div>

                {/* Sky Quality Metrics */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 space-y-3">
                  <h3 className="font-bold text-gray-800 text-xl mb-4">Sky Quality Metrics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedPhoto.reading.sqmValue && (
                      <div>
                        <p className="text-sm text-gray-600">SQM Value</p>
                        <p className="text-2xl font-black text-purple-600">
                          {Number(selectedPhoto.reading.sqmValue).toFixed(2)}
                        </p>
                      </div>
                    )}
                    {selectedPhoto.reading.bortleScale && (
                      <div>
                        <p className="text-sm text-gray-600">Bortle Scale</p>
                        <p className="text-2xl font-black text-purple-600">
                          {selectedPhoto.reading.bortleScale}
                        </p>
                      </div>
                    )}
                    {selectedPhoto.reading.starCount && (
                      <div>
                        <p className="text-sm text-gray-600">Star Count</p>
                        <p className="text-2xl font-black text-purple-600">
                          {selectedPhoto.reading.starCount}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-600">Light Pollution</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${getPollutionColor(selectedPhoto.reading.lightPollutionLevel)}`}>
                        {selectedPhoto.reading.lightPollutionLevel.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Camera Info */}
                {(selectedPhoto.cameraModel || selectedPhoto.isoValue || selectedPhoto.exposureTime || selectedPhoto.aperture) && (
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-2">
                    <h3 className="font-bold text-gray-800 text-lg mb-3">📷 Camera Settings</h3>
                    {selectedPhoto.cameraModel && (
                      <p className="text-gray-700">
                        <span className="font-semibold">Camera:</span> {selectedPhoto.cameraModel}
                      </p>
                    )}
                    {selectedPhoto.isoValue && (
                      <p className="text-gray-700">
                        <span className="font-semibold">ISO:</span> {selectedPhoto.isoValue}
                      </p>
                    )}
                    {selectedPhoto.exposureTime && (
                      <p className="text-gray-700">
                        <span className="font-semibold">Exposure:</span> {selectedPhoto.exposureTime}
                      </p>
                    )}
                    {selectedPhoto.aperture && (
                      <p className="text-gray-700">
                        <span className="font-semibold">Aperture:</span> {selectedPhoto.aperture}
                      </p>
                    )}
                  </div>
                )}

                {/* Date */}
                <p className="text-sm text-gray-500">
                  📅 {new Date(selectedPhoto.reading.observationDatetime).toLocaleDateString()} at{' '}
                  {new Date(selectedPhoto.reading.observationDatetime).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
