import React, { useState, useEffect } from 'react';
import { CompleteProfileRequest } from '../types';

interface CompleteProfileFormProps {
  onSubmit: (data: CompleteProfileRequest) => Promise<void>;
  loading?: boolean;
}

interface LocationData {
  latitude: number;
  longitude: number;
  state?: string;
  country?: string;
}

export const CompleteProfileForm: React.FC<CompleteProfileFormProps> = ({
  onSubmit,
  loading = false,
}) => {
  const [formData, setFormData] = useState<CompleteProfileRequest>({
    full_name: '',
    state: '',
    country: 'India',
  });

  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [error, setError] = useState('');

  // List of Indian states
  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
  ];

  // Common countries for quick selection
  const countries = [
    'India', 'United States', 'United Kingdom', 'Canada', 'Australia',
    'Germany', 'France', 'Japan', 'China', 'Brazil', 'Other'
  ];

  const detectLocation = () => {
    setDetectingLocation(true);
    setLocationError('');

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setDetectingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // Use reverse geocoding to get location details
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();

          const address = data.address || {};
          const state = address.state || '';
          const country = address.country || 'India';

          setLocationData({ latitude, longitude, state, country });
          setFormData((prev) => ({
            ...prev,
            state: state || prev.state,
            country: country || prev.country,
          }));
        } catch (err) {
          console.error('Failed to get location details:', err);
          setLocationData({ latitude, longitude });
        } finally {
          setDetectingLocation(false);
        }
      },
      (error) => {
        setLocationError('Failed to get your location. Please enter manually.');
        setDetectingLocation(false);
        console.error('Geolocation error:', error);
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.full_name.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!formData.country) {
      setError('Please select your country');
      return;
    }

    try {
      const submitData: CompleteProfileRequest = {
        full_name: formData.full_name.trim(),
        country: formData.country,
        state: formData.state?.trim() || undefined,
        latitude: locationData?.latitude,
        longitude: locationData?.longitude,
      };

      await onSubmit(submitData);
    } catch (err: any) {
      setError(err.message || 'Failed to complete profile');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Location Detection */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-900">
              📍 Detect Location
            </p>
            <p className="text-xs text-blue-700 mt-1">
              We'll auto-fill your country and state
            </p>
          </div>
          <button
            type="button"
            onClick={detectLocation}
            disabled={detectingLocation}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {detectingLocation ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Detecting...
              </div>
            ) : (
              'Detect'
            )}
          </button>
        </div>
        {locationError && (
          <p className="text-xs text-red-600 mt-2">{locationError}</p>
        )}
      </div>

      {/* Full Name */}
      <div>
        <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          id="full_name"
          name="full_name"
          type="text"
          required
          value={formData.full_name}
          onChange={handleChange}
          className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="John Doe"
        />
      </div>

      {/* Country */}
      <div>
        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
          Country <span className="text-red-500">*</span>
        </label>
        <select
          id="country"
          name="country"
          required
          value={formData.country}
          onChange={handleChange}
          className="appearance-none relative block w-full px-3 py-3 border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
      </div>

      {/* State (show for India) */}
      {formData.country === 'India' && (
        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
            State
          </label>
          <select
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="appearance-none relative block w-full px-3 py-3 border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">Select State</option>
            {indianStates.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* State (text input for other countries) */}
      {formData.country !== 'India' && (
        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
            State / Province
          </label>
          <input
            id="state"
            name="state"
            type="text"
            value={formData.state}
            onChange={handleChange}
            className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="California"
          />
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Completing...
          </div>
        ) : (
          'Complete Registration'
        )}
      </button>

      {/* Privacy Note */}
      <p className="text-xs text-center text-gray-500">
        By continuing, you agree to our Terms of Service and Privacy Policy
      </p>
    </form>
  );
};
