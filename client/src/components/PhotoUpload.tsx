import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { apiService } from '../services/api';
import { SkyReading, LightPollutionLevel } from '../types';
import { ShareButtons } from './ShareButtons';

interface LocationData {
  latitude: number;
  longitude: number;
  location_name: string;
  city: string;
  country: string;
}

export const PhotoUpload: React.FC = () => {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [location, setLocation] = useState<LocationData>({
    latitude: 0,
    longitude: 0,
    location_name: '',
    city: '',
    country: '',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SkyReading | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [gettingLocation, setGettingLocation] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setFile(file);
      setPreview(URL.createObjectURL(file));
      setError(null);
      setResult(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    maxFiles: 1,
    maxSize: 10485760, // 10MB
  });

  const getCurrentLocation = () => {
    setGettingLocation(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation((prev) => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }));
          setGettingLocation(false);
        },
        (error) => {
          setError(t('upload.errorFailedToGetLocation') + error.message);
          setGettingLocation(false);
        }
      );
    } else {
      setError(t('upload.errorGeolocationNotSupported'));
      setGettingLocation(false);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError(t('upload.errorSelectFile'));
      return;
    }

    if (location.latitude === 0 && location.longitude === 0) {
      setError(t('upload.errorProvideLocation'));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('photo', file);
      formData.append('latitude', location.latitude.toString());
      formData.append('longitude', location.longitude.toString());
      if (location.location_name) formData.append('location_name', location.location_name);
      if (location.city) formData.append('city', location.city);
      if (location.country) formData.append('country', location.country);

      const response = await apiService.uploadPhoto(formData);
      setResult(response.reading);
      setLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.error || t('upload.errorUploadFailed'));
      setLoading(false);
    }
  };

  const getPollutionColor = (level: LightPollutionLevel): string => {
    const colors = {
      [LightPollutionLevel.EXCELLENT]: 'bg-pollution-excellent text-white',
      [LightPollutionLevel.GOOD]: 'bg-pollution-good text-white',
      [LightPollutionLevel.MODERATE]: 'bg-pollution-moderate text-black',
      [LightPollutionLevel.POOR]: 'bg-pollution-poor text-white',
      [LightPollutionLevel.VERY_POOR]: 'bg-pollution-very-poor text-white',
    };
    return colors[level] || 'bg-gray-500 text-white';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="text-3xl">📸</div>
          <h2 className="text-3xl font-black text-gray-800">{t('upload.uploadSkyPhoto')}</h2>
        </div>

        {/* File Upload */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
            isDragActive
              ? 'border-purple-500 bg-purple-50 scale-105 shadow-lg'
              : preview
              ? 'border-green-400 bg-green-50 hover:border-green-500'
              : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'
          }`}
        >
          <input {...getInputProps()} />
          {preview ? (
            <div>
              <div className="relative inline-block">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-64 mx-auto rounded-xl mb-4 shadow-lg"
                />
                <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  ✓ Ready
                </div>
              </div>
              <p className="text-sm text-gray-600 font-medium">{t('upload.clickOrDragToReplace')}</p>
              <p className="text-xs text-gray-500 mt-1">or upload a different photo</p>
            </div>
          ) : (
            <div>
              <div className="mx-auto w-16 h-16 mb-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                <svg
                  className="h-8 w-8 text-purple-600"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="text-lg font-semibold text-gray-800 mb-2">
                {isDragActive
                  ? '✨ Drop your photo here!'
                  : '📸 Drag & drop your night sky photo'}
              </p>
              <p className="text-sm text-gray-600 mb-3">
                or click to browse from your device
              </p>
              <p className="text-xs text-gray-500">
                JPG or PNG • Max 10MB • Any camera works!
              </p>
            </div>
          )}
        </div>

        {/* Location Input */}
        <div className="mt-8 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="text-2xl">📍</div>
            <h3 className="text-xl font-bold text-gray-800">Location Details</h3>
          </div>

          <div className="flex gap-2">
            <button
              onClick={getCurrentLocation}
              disabled={gettingLocation}
              className="group px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-400 disabled:to-gray-400 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:hover:scale-100 flex items-center gap-2"
            >
              {gettingLocation ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  {t('upload.gettingLocation')}
                </>
              ) : (
                <>
                  <span className="text-lg">📍</span>
                  {t('upload.useCurrentLocation')}
                </>
              )}
            </button>
            {(location.latitude !== 0 || location.longitude !== 0) && (
              <div className="px-4 py-3 bg-green-100 text-green-700 rounded-xl font-medium flex items-center gap-2">
                ✓ Location set
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('upload.latitude')}
              </label>
              <input
                type="number"
                step="any"
                value={location.latitude}
                onChange={(e) =>
                  setLocation({ ...location, latitude: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                placeholder="0.0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('upload.longitude')}
              </label>
              <input
                type="number"
                step="any"
                value={location.longitude}
                onChange={(e) =>
                  setLocation({ ...location, longitude: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                placeholder="0.0"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('upload.locationName')}
              </label>
              <input
                type="text"
                value={location.location_name}
                onChange={(e) =>
                  setLocation({ ...location, location_name: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                placeholder={t('upload.locationNamePlaceholder')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('upload.city')}
              </label>
              <input
                type="text"
                value={location.city}
                onChange={(e) => setLocation({ ...location, city: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                placeholder={t('upload.cityPlaceholder')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('upload.country')}
              </label>
              <input
                type="text"
                value={location.country}
                onChange={(e) =>
                  setLocation({ ...location, country: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                placeholder={t('upload.countryPlaceholder')}
              />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 flex items-start gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <p className="font-semibold mb-1">Oops! Something went wrong</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={!file || loading || (location.latitude === 0 && location.longitude === 0)}
          className="mt-8 w-full px-8 py-4 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white text-lg font-black rounded-2xl hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 disabled:from-gray-300 disabled:via-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 disabled:hover:scale-100 flex items-center justify-center gap-3"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-6 w-6 border-3 border-white border-t-transparent"></div>
              <span>{t('upload.analyzing')}</span>
            </>
          ) : (
            <>
              <span className="text-2xl">🚀</span>
              <span>{t('upload.uploadAndAnalyze')}</span>
            </>
          )}
        </button>

        {!file && (
          <p className="text-center text-sm text-gray-500 mt-3">
            Please upload a photo to continue
          </p>
        )}
        {file && (location.latitude === 0 && location.longitude === 0) && (
          <p className="text-center text-sm text-gray-500 mt-3">
            Please set your location to continue
          </p>
        )}
      </div>

      {/* Results */}
      {result && (
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl p-8 border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="text-4xl">🎉</div>
            <div>
              <h3 className="text-3xl font-black text-gray-800">{t('upload.analysisResults')}</h3>
              <p className="text-gray-600">Your sky quality data is ready!</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border-2 border-purple-200">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-bold text-lg">{t('upload.lightPollutionLevel')}</span>
                <span
                  className={`px-6 py-3 rounded-2xl font-black uppercase text-base shadow-lg ${getPollutionColor(
                    result.light_pollution_level
                  )}`}
                >
                  {result.light_pollution_level.replace('_', ' ')}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl border-2 border-blue-200 hover:shadow-lg transition-shadow">
                <p className="text-sm text-blue-600 font-semibold mb-2">{t('upload.sqmValue')}</p>
                <p className="text-3xl font-black text-blue-900">
                  {result.sqm_value ? Number(result.sqm_value).toFixed(2) : 'N/A'}
                </p>
                <p className="text-xs text-blue-600 mt-1">{t('upload.sqmUnit')}</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border-2 border-purple-200 hover:shadow-lg transition-shadow">
                <p className="text-sm text-purple-600 font-semibold mb-2">{t('upload.bortleScale')}</p>
                <p className="text-3xl font-black text-purple-900">
                  {result.bortle_scale}
                </p>
                <p className="text-xs text-purple-600 mt-1">{t('upload.bortleDescription')}</p>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-2xl border-2 border-yellow-200 hover:shadow-lg transition-shadow">
                <p className="text-sm text-orange-600 font-semibold mb-2">{t('upload.starsDetected')}</p>
                <p className="text-3xl font-black text-orange-900">
                  {result.star_count}
                </p>
                <p className="text-xs text-orange-600 mt-1">{t('upload.starsUnit')}</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border-2 border-green-200 hover:shadow-lg transition-shadow">
                <p className="text-sm text-green-600 font-semibold mb-2">{t('upload.skyBrightness')}</p>
                <p className="text-3xl font-black text-green-900">
                  {result.sky_brightness ? Number(result.sky_brightness).toFixed(1) : 'N/A'}
                </p>
                <p className="text-xs text-green-600 mt-1">{t('upload.brightnessUnit')}</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border-2 border-blue-200">
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <span className="text-xl">📍</span>
                  <div>
                    <p className="text-sm text-blue-700 font-semibold mb-1">{t('upload.locationLabel')}</p>
                    <p className="text-base text-blue-900 font-medium">
                      {result.location_name || `${result.latitude}, ${result.longitude}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-xl">🆔</span>
                  <div>
                    <p className="text-sm text-blue-700 font-semibold mb-1">{t('upload.readingId')}</p>
                    <p className="text-sm text-blue-900 font-mono">{result.id}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* View on Map Button */}
            <div className="mt-6 flex gap-4">
              <a
                href="/map"
                className="flex-1 px-6 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-2xl hover:from-cyan-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
              >
                <span className="text-xl">🗺️</span>
                <span>View on Map</span>
              </a>
              <a
                href="/gallery"
                className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
              >
                <span className="text-xl">🌌</span>
                <span>View Gallery</span>
              </a>
            </div>

            {/* Share Buttons */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <ShareButtons
                url={`${window.location.origin}/#map`}
                title={`I just measured light pollution in ${result.city || result.location_name || 'my area'}! 🌟`}
                description={`SQM: ${result.sqm_value ? Number(result.sqm_value).toFixed(2) : 'N/A'} | Bortle: ${result.bortle_scale} | Sky Quality: ${result.light_pollution_level.replace('_', ' ')}`}
                hashtags={['SkyQI', 'LightPollution', 'DarkSkies', 'CitizenScience']}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
