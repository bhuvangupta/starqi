import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { apiService } from '../services/api';
import { MapReading, LightPollutionLevel } from '../types';
import 'leaflet/dist/leaflet.css';

const getMarkerColor = (level: LightPollutionLevel): string => {
  const colors = {
    [LightPollutionLevel.EXCELLENT]: '#10b981',
    [LightPollutionLevel.GOOD]: '#22c55e',
    [LightPollutionLevel.MODERATE]: '#eab308',
    [LightPollutionLevel.POOR]: '#f97316',
    [LightPollutionLevel.VERY_POOR]: '#ef4444',
  };
  return colors[level] || '#6b7280';
};

export const LightPollutionMap: React.FC = () => {
  const { t } = useTranslation();
  const [readings, setReadings] = useState<MapReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getBortleDescription = (bortle?: number): string => {
    if (!bortle) return t('map.unknownLocation');
    return t(`map.bortleDescriptions.${bortle}`, t('map.unknownLocation'));
  };

  useEffect(() => {
    loadMapData();
  }, []);

  const loadMapData = async () => {
    try {
      setLoading(true);
      const response = await apiService.getMapData();
      setReadings(response.readings);
      setLoading(false);
    } catch (err: any) {
      setError('Failed to load map data');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('map.loadingMap')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">{t('map.lightPollutionLevel')}</h3>
        <div className="flex flex-wrap gap-3">
          {Object.entries({
            [LightPollutionLevel.EXCELLENT]: t('map.excellent'),
            [LightPollutionLevel.GOOD]: t('map.good'),
            [LightPollutionLevel.MODERATE]: t('map.moderate'),
            [LightPollutionLevel.POOR]: t('map.poor'),
            [LightPollutionLevel.VERY_POOR]: t('map.veryPoor'),
          }).map(([level, label]) => (
            <div key={level} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: getMarkerColor(level as LightPollutionLevel) }}
              />
              <span className="text-sm text-gray-600">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="bg-white rounded-lg shadow overflow-hidden" style={{ height: '600px' }}>
        <MapContainer
          center={[20, 0]}
          zoom={2}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {readings.map((reading) => (
            <CircleMarker
              key={reading.id}
              center={[reading.latitude, reading.longitude]}
              radius={8}
              fillColor={getMarkerColor(reading.light_pollution_level)}
              color="#fff"
              weight={2}
              opacity={1}
              fillOpacity={0.7}
            >
              <Popup>
                <div className="p-2">
                  <h4 className="font-bold text-gray-800 mb-2">
                    {reading.location_name || reading.city || t('map.unknownLocation')}
                  </h4>
                  {reading.city && reading.country && (
                    <p className="text-sm text-gray-600 mb-2">
                      {reading.city}, {reading.country}
                    </p>
                  )}
                  <div className="space-y-1">
                    <p className="text-sm">
                      <span className="font-semibold">{t('map.level')}:</span>{' '}
                      <span
                        className="capitalize"
                        style={{ color: getMarkerColor(reading.light_pollution_level) }}
                      >
                        {reading.light_pollution_level.replace('_', ' ')}
                      </span>
                    </p>
                    {reading.bortle_scale && (
                      <p className="text-sm">
                        <span className="font-semibold">{t('map.bortle')}:</span> {t('map.class')}{' '}
                        {reading.bortle_scale}
                      </p>
                    )}
                    {reading.sqm_value && (
                      <p className="text-sm">
                        <span className="font-semibold">SQM:</span>{' '}
                        {reading.sqm_value.toFixed(2)} mag/arcsec²
                      </p>
                    )}
                    {reading.bortle_scale && (
                      <p className="text-xs text-gray-500 mt-2 italic">
                        {getBortleDescription(reading.bortle_scale)}
                      </p>
                    )}
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-lg shadow p-4">
        <p className="text-sm text-gray-600">
          {t('map.showingReadings')} <span className="font-semibold">{readings.length}</span> {t('map.readingsFromWorld')}
        </p>
      </div>
    </div>
  );
};
