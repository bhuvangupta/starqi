import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import { apiService } from '../services/api';
import { MapReading, LightPollutionLevel } from '../types';
import 'leaflet/dist/leaflet.css';

const getMarkerColor = (level: LightPollutionLevel): string => {
  const colors = {
    [LightPollutionLevel.EXCELLENT]: '#10b981', // Bright green
    [LightPollutionLevel.GOOD]: '#34d399', // Lighter green
    [LightPollutionLevel.MODERATE]: '#fbbf24', // Bright yellow
    [LightPollutionLevel.POOR]: '#fb923c', // Bright orange
    [LightPollutionLevel.VERY_POOR]: '#f87171', // Bright red
  };
  return colors[level] || '#94a3b8';
};

export const IndiaMapPreview: React.FC = () => {
  const [readings, setReadings] = useState<MapReading[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadIndiaData();
  }, []);

  const loadIndiaData = async () => {
    try {
      setLoading(true);
      const response = await apiService.getMapData();
      // Filter for India only
      const indiaReadings = response.readings.filter(
        (r) => r.country === 'India' || r.country === 'IN'
      );
      setReadings(indiaReadings);
    } catch (err) {
      console.error('Failed to load India map data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-white/5 backdrop-blur-md rounded-2xl border border-white/20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border-4 border-white/30 shadow-2xl">
      {/* India-focused map */}
      <MapContainer
        center={[22.5, 79.0]} // Center of India
        zoom={5}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
        dragging={false}
        zoomControl={false}
        doubleClickZoom={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {readings.map((reading) => (
          <CircleMarker
            key={reading.id}
            center={[reading.latitude, reading.longitude]}
            radius={10}
            fillColor={getMarkerColor(reading.light_pollution_level)}
            color="#fff"
            weight={3}
            opacity={1}
            fillOpacity={0.95}
            className="marker-pulse"
          >
            <Tooltip direction="top" offset={[0, -8]} opacity={1}>
              <div className="text-xs font-medium">
                <div className="font-bold">{reading.city || 'Unknown'}</div>
                <div className="text-gray-600">
                  {reading.sqm_value ? `${Number(reading.sqm_value).toFixed(1)} SQM` : 'N/A'}
                </div>
              </div>
            </Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>

      {/* Overlay badge */}
      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-lg">
        <div className="text-xs font-bold text-purple-600">
          🇮🇳 India: {readings.length} Readings
        </div>
      </div>

      {/* Legend - compact */}
      <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md px-3 py-2 rounded-lg shadow-lg">
        <div className="flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-gray-700 font-medium">Good</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
            <span className="text-gray-700 font-medium">Moderate</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <span className="text-gray-700 font-medium">Poor</span>
          </div>
        </div>
      </div>
    </div>
  );
};
