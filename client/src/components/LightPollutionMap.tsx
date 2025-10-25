import React, { useEffect, useState } from 'react';
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

const getBortleDescription = (bortle?: number): string => {
  if (!bortle) return 'Unknown';
  const descriptions: Record<number, string> = {
    1: 'Excellent dark-sky site',
    2: 'Typical truly dark site',
    3: 'Rural sky',
    4: 'Rural/suburban transition',
    5: 'Suburban sky',
    6: 'Bright suburban sky',
    7: 'Suburban/urban transition',
    8: 'City sky',
    9: 'Inner-city sky',
  };
  return descriptions[bortle] || 'Unknown';
};

export const LightPollutionMap: React.FC = () => {
  const [readings, setReadings] = useState<MapReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          <p className="mt-4 text-gray-600">Loading map data...</p>
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
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Light Pollution Level</h3>
        <div className="flex flex-wrap gap-3">
          {Object.entries({
            [LightPollutionLevel.EXCELLENT]: 'Excellent',
            [LightPollutionLevel.GOOD]: 'Good',
            [LightPollutionLevel.MODERATE]: 'Moderate',
            [LightPollutionLevel.POOR]: 'Poor',
            [LightPollutionLevel.VERY_POOR]: 'Very Poor',
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
                    {reading.location_name || reading.city || 'Unknown Location'}
                  </h4>
                  {reading.city && reading.country && (
                    <p className="text-sm text-gray-600 mb-2">
                      {reading.city}, {reading.country}
                    </p>
                  )}
                  <div className="space-y-1">
                    <p className="text-sm">
                      <span className="font-semibold">Level:</span>{' '}
                      <span
                        className="capitalize"
                        style={{ color: getMarkerColor(reading.light_pollution_level) }}
                      >
                        {reading.light_pollution_level.replace('_', ' ')}
                      </span>
                    </p>
                    {reading.bortle_scale && (
                      <p className="text-sm">
                        <span className="font-semibold">Bortle:</span> Class{' '}
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
          Showing <span className="font-semibold">{readings.length}</span> sky quality readings from
          around the world
        </p>
      </div>
    </div>
  );
};
