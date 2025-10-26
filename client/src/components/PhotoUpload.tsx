import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { apiService } from '../services/api';
import { SkyReading, LightPollutionLevel } from '../types';

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
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">{t('upload.uploadSkyPhoto')}</h2>

        {/* File Upload */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input {...getInputProps()} />
          {preview ? (
            <div>
              <img
                src={preview}
                alt="Preview"
                className="max-h-64 mx-auto rounded-lg mb-4"
              />
              <p className="text-sm text-gray-600">{t('upload.clickOrDragToReplace')}</p>
            </div>
          ) : (
            <div>
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
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
              <p className="mt-2 text-sm text-gray-600">
                {isDragActive
                  ? t('upload.dropImageHere')
                  : t('upload.dragAndDropMessage')}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {t('upload.fileSizeLimit')}
              </p>
            </div>
          )}
        </div>

        {/* Location Input */}
        <div className="mt-6 space-y-4">
          <div className="flex gap-2">
            <button
              onClick={getCurrentLocation}
              disabled={gettingLocation}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {gettingLocation ? t('upload.gettingLocation') : t('upload.useCurrentLocation')}
            </button>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder={t('upload.countryPlaceholder')}
              />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="mt-6 w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? t('upload.analyzing') : t('upload.uploadAndAnalyze')}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800">{t('upload.analysisResults')}</h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 font-medium">{t('upload.lightPollutionLevel')}</span>
              <span
                className={`px-4 py-2 rounded-full font-semibold uppercase text-sm ${getPollutionColor(
                  result.light_pollution_level
                )}`}
              >
                {result.light_pollution_level.replace('_', ' ')}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">{t('upload.sqmValue')}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {result.sqm_value ? Number(result.sqm_value).toFixed(2) : 'N/A'}
                </p>
                <p className="text-xs text-gray-500">{t('upload.sqmUnit')}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">{t('upload.bortleScale')}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {result.bortle_scale}
                </p>
                <p className="text-xs text-gray-500">{t('upload.bortleDescription')}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">{t('upload.starsDetected')}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {result.star_count}
                </p>
                <p className="text-xs text-gray-500">{t('upload.starsUnit')}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">{t('upload.skyBrightness')}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {result.sky_brightness ? Number(result.sky_brightness).toFixed(1) : 'N/A'}
                </p>
                <p className="text-xs text-gray-500">{t('upload.brightnessUnit')}</p>
              </div>
            </div>

            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>{t('upload.locationLabel')}</strong>{' '}
                {result.location_name || `${result.latitude}, ${result.longitude}`}
              </p>
              <p className="text-sm text-blue-900 mt-1">
                <strong>{t('upload.readingId')}</strong> {result.id}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
