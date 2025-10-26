import React, { useEffect, useState, useRef, useMemo, useCallback, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { MapContainer, TileLayer, CircleMarker, Popup, useMapEvents, Marker, useMap } from 'react-leaflet';
import { apiService } from '../services/api';
import { MapReading, LightPollutionLevel } from '../types';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

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

const getBortleColor = (bortle: number): string => {
  const colors: Record<number, string> = {
    1: '#001f3f', // Excellent - Dark blue
    2: '#0074D9', // Dark sky - Blue
    3: '#39CCCC', // Rural - Teal
    4: '#2ECC40', // Transition - Green
    5: '#FFDC00', // Suburban - Yellow
    6: '#FF851B', // Bright suburban - Orange
    7: '#FF6347', // Transition - Orange-red
    8: '#E63946', // City - Red
    9: '#8B0000', // Inner city - Dark red
  };
  return colors[bortle] || '#808080';
};

interface VIIRSData {
  radiance: number;
  sqm: number;
  bortleScale: number;
  lightPollutionLevel: string;
  nelm: number;
  source: string;
  dataYear: number;
  coordinates: { latitude: number; longitude: number };
}

interface SearchResult {
  name: string;
  lat: number;
  lon: number;
  displayName: string;
}

// Map click handler component
function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// Component to fly to location
function FlyToLocation({ position }: { position: [number, number] | null }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, 12, { duration: 1.5 });
    }
  }, [position, map]);

  return null;
}

export const LightPollutionMap: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [readings, setReadings] = useState<MapReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // VIIRS data states
  const [viirsData, setViirsData] = useState<VIIRSData | null>(null);
  const [viirsLoading, setViirsLoading] = useState(false);
  const [clickedPosition, setClickedPosition] = useState<[number, number] | null>(null);

  // Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);

  // Filter states
  const [showUserReadingsOnly, setShowUserReadingsOnly] = useState(false);

  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  const getBortleDescription = (bortle?: number): string => {
    if (!bortle) return t('map.unknownLocation');
    const descriptions: Record<number, string> = {
      1: 'Excellent dark-sky site',
      2: 'Typical truly dark site',
      3: 'Rural sky',
      4: 'Rural/suburban transition',
      5: 'Suburban sky',
      6: 'Bright suburban sky',
      7: 'Suburban/urban transition',
      8: 'City sky',
      9: 'Inner-city sky'
    };
    return descriptions[bortle] || 'Unknown';
  };

  const getTimeAgo = (datetime: string): string => {
    const now = new Date();
    const then = new Date(datetime);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return then.toLocaleDateString();
  };

  // Filter readings based on toggle (memoized for performance)
  const filteredReadings = useMemo(() => {
    return showUserReadingsOnly
      ? readings.filter((reading) => reading.user_id !== null)
      : readings;
  }, [readings, showUserReadingsOnly]);

  useEffect(() => {
    loadMapData();
  }, []);

  const loadMapData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiService.getMapData();
      setReadings(response.readings);
      setLoading(false);
    } catch (err: any) {
      setError('Failed to load map data');
      setLoading(false);
    }
  }, []);

  // Handle map click - fetch VIIRS data (memoized)
  const handleMapClick = useCallback(async (lat: number, lng: number) => {
    setClickedPosition([lat, lng]);
    setViirsLoading(true);

    try {
      const response = await apiService.getLightPollutionEstimate(lat, lng);
      setViirsData(response.data);
    } catch (err) {
      console.error('Failed to fetch VIIRS data:', err);
      setViirsData(null);
    } finally {
      setViirsLoading(false);
    }
  }, []);

  // Search for location using Nominatim (OpenStreetMap) (memoized)
  const searchLocation = useCallback(async (query: string) => {
    if (query.length < 3) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
      );
      const data = await response.json();

      const results: SearchResult[] = data.map((item: any) => ({
        name: item.name,
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon),
        displayName: item.display_name,
      }));

      setSearchResults(results);
      setShowSearchResults(true);
    } catch (err) {
      console.error('Search failed:', err);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  // Debounced search (memoized)
  const handleSearchInput = useCallback((value: string) => {
    setSearchQuery(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      searchLocation(value);
    }, 500);
  }, [searchLocation]);

  // Select location from search results (memoized)
  const selectLocation = useCallback(async (result: SearchResult) => {
    setSelectedLocation([result.lat, result.lon]);
    setShowSearchResults(false);
    setSearchQuery(result.name);

    // Fetch VIIRS data for selected location
    await handleMapClick(result.lat, result.lon);
  }, [handleMapClick]);

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
      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="relative">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchInput(e.target.value)}
                onFocus={() => searchResults.length > 0 && setShowSearchResults(true)}
                placeholder="Search for a location (e.g., Delhi, Cherry Springs State Park, Tokyo)..."
                className="w-full px-4 py-3 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
              <svg
                className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              {searchLoading && (
                <div className="absolute right-3 top-3.5">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
                </div>
              )}
            </div>
          </div>

          {/* Search Results Dropdown */}
          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-64 overflow-y-auto">
              {searchResults.map((result, index) => (
                <button
                  key={index}
                  onClick={() => selectLocation(result)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                >
                  <p className="font-semibold text-gray-800">{result.name}</p>
                  <p className="text-sm text-gray-500 truncate">{result.displayName}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-3">
          <p className="text-sm text-gray-500">
            💡 Tip: Search for a location or click anywhere on the map to see light pollution data
          </p>

          {/* Filter Toggle */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showUserReadingsOnly}
              onChange={(e) => setShowUserReadingsOnly(e.target.checked)}
              className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            />
            <span className="text-sm font-medium text-gray-700">
              👥 User Submitted Only ({readings.filter(r => r.user_id).length})
            </span>
          </label>
        </div>
      </div>

      {/* VIIRS Data Display */}
      {viirsData && clickedPosition && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg shadow-lg p-6 border border-purple-200">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-1">
                🌌 Light Pollution Analysis
              </h3>
              <p className="text-sm text-gray-600">
                📍 {viirsData.coordinates.latitude.toFixed(4)}°, {viirsData.coordinates.longitude.toFixed(4)}°
              </p>
            </div>
            <button
              onClick={() => setViirsData(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {/* Bortle Scale */}
            <div className="bg-white rounded-lg p-4 shadow">
              <p className="text-xs text-gray-500 mb-1">Bortle Scale</p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-black" style={{ color: getBortleColor(viirsData.bortleScale) }}>
                  {viirsData.bortleScale}
                </p>
                <p className="text-sm text-gray-600">/ 9</p>
              </div>
              <p className="text-xs text-gray-500 mt-1">{getBortleDescription(viirsData.bortleScale)}</p>
            </div>

            {/* SQM Value */}
            <div className="bg-white rounded-lg p-4 shadow">
              <p className="text-xs text-gray-500 mb-1">Sky Quality (SQM)</p>
              <p className="text-3xl font-black text-indigo-600">{viirsData.sqm.toFixed(2)}</p>
              <p className="text-xs text-gray-500 mt-1">mag/arcsec²</p>
            </div>

            {/* NELM */}
            <div className="bg-white rounded-lg p-4 shadow">
              <p className="text-xs text-gray-500 mb-1">Visible Stars (NELM)</p>
              <p className="text-3xl font-black text-purple-600">{viirsData.nelm.toFixed(1)}</p>
              <p className="text-xs text-gray-500 mt-1">magnitude</p>
            </div>

            {/* Radiance */}
            <div className="bg-white rounded-lg p-4 shadow">
              <p className="text-xs text-gray-500 mb-1">Satellite Radiance</p>
              <p className="text-3xl font-black text-pink-600">{viirsData.radiance.toFixed(1)}</p>
              <p className="text-xs text-gray-500 mt-1">nW/cm²/sr</p>
            </div>
          </div>

          {/* Light Pollution Level Badge */}
          <div className="bg-white rounded-lg p-4 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Light Pollution Level</p>
                <p className="text-2xl font-bold capitalize" style={{ color: getBortleColor(viirsData.bortleScale) }}>
                  {viirsData.lightPollutionLevel.replace('_', ' ')}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Data Source</p>
                <p className="text-sm font-semibold text-gray-700">{viirsData.source}</p>
                <p className="text-xs text-gray-500">Year: {viirsData.dataYear}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {viirsLoading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <p className="text-blue-700">Loading light pollution data...</p>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">📊 Bortle Dark Sky Scale</h3>
        <div className="grid grid-cols-3 md:grid-cols-9 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((bortle) => (
            <div key={bortle} className="text-center">
              <div
                className="w-full h-8 rounded"
                style={{ backgroundColor: getBortleColor(bortle) }}
              />
              <p className="text-xs font-semibold mt-1">{bortle}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Lower numbers = Darker skies = Better for stargazing
        </p>
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

          <MapClickHandler onMapClick={handleMapClick} />
          <FlyToLocation position={selectedLocation} />

          {/* All readings */}
          {filteredReadings.map((reading) => {
            const isUserSubmitted = reading.user_id !== null;
            return (
            <CircleMarker
              key={reading.id}
              center={[reading.latitude, reading.longitude]}
              radius={isUserSubmitted ? 10 : 8}
              fillColor={getMarkerColor(reading.light_pollution_level)}
              color={isUserSubmitted ? '#7c3aed' : '#fff'}
              weight={isUserSubmitted ? 3 : 2}
              opacity={1}
              fillOpacity={isUserSubmitted ? 0.85 : 0.7}
            >
              <Popup>
                <div className="p-2">
                  {/* User badge for user-submitted readings */}
                  {isUserSubmitted && (
                    <div className="mb-2">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                        👥 User Submitted
                      </span>
                    </div>
                  )}

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
                        {Number(reading.sqm_value).toFixed(2)} mag/arcsec²
                      </p>
                    )}
                    {reading.observation_datetime && (
                      <p className="text-xs text-gray-500 mt-1">
                        <span className="font-semibold">📅 Submitted:</span>{' '}
                        {getTimeAgo(reading.observation_datetime)}
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
            );
          })}

          {/* Clicked location marker */}
          {clickedPosition && viirsData && (
            <Marker position={clickedPosition}>
              <Popup>
                <div className="p-2">
                  <h4 className="font-bold text-gray-800 mb-2">VIIRS Data</h4>
                  <div className="space-y-1">
                    <p className="text-sm">
                      <span className="font-semibold">Bortle:</span> Class {viirsData.bortleScale}
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">SQM:</span> {viirsData.sqm.toFixed(2)} mag/arcsec²
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">NELM:</span> {viirsData.nelm.toFixed(1)}
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">Level:</span>{' '}
                      <span className="capitalize">{viirsData.lightPollutionLevel.replace('_', ' ')}</span>
                    </p>
                  </div>
                </div>
              </Popup>
            </Marker>
          )}
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
