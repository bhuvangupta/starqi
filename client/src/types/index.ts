export enum ReadingType {
  PHOTO = 'photo',
  SQM_DEVICE = 'sqm_device',
  MANUAL = 'manual',
}

export enum LightPollutionLevel {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  MODERATE = 'moderate',
  POOR = 'poor',
  VERY_POOR = 'very_poor',
}

export enum ProcessingStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export interface User {
  id: string;
  email: string;
  username?: string;
  full_name?: string;
  state?: string;
  country?: string;
  created_at: string;
  total_readings?: number;
  total_contributions?: number;
}

export interface SkyReading {
  id: string;
  user_id?: string;
  reading_type: ReadingType;
  latitude: number;
  longitude: number;
  location_name?: string;
  city?: string;
  country?: string;
  sqm_value?: number;
  bortle_scale?: number;
  nelm?: number;
  sky_brightness?: number;
  star_count?: number;
  light_pollution_level: LightPollutionLevel;
  observation_datetime: string;
  weather_conditions?: string;
  moon_phase?: number;
  created_at: string;
  updated_at: string;
  photo_upload?: PhotoUpload;
  user?: User;
}

export interface PhotoUpload {
  id: string;
  reading_id: string;
  file_url: string;
  file_size?: number;
  file_format?: string;
  camera_model?: string;
  iso_value?: number;
  exposure_time?: string;
  aperture?: string;
  average_brightness?: number;
  sky_region_brightness?: number;
  horizon_glow_detected?: boolean;
  color_temperature?: number;
  processing_status: ProcessingStatus;
  processing_error?: string;
  created_at: string;
}

export interface UploadPhotoRequest {
  photo: File;
  latitude: number;
  longitude: number;
  location_name?: string;
  city?: string;
  country?: string;
  observation_datetime?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  full_name?: string;
}

// OTP-based authentication
export interface SendOTPRequest {
  email: string;
}

export interface SendOTPResponse {
  message: string;
  isNewUser: boolean;
}

export interface VerifyOTPRequest {
  email: string;
  otp: string;
}

export interface VerifyOTPResponse {
  message: string;
  isNewUser: boolean;
  token?: string;
  user?: User;
  tempToken?: string; // For new users to complete registration
}

export interface CompleteProfileRequest {
  full_name: string;
  state?: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

export interface Statistics {
  total_readings: number;
  average_bortle: string;
  average_sqm: string;
  best_reading?: SkyReading;
  worst_reading?: SkyReading;
  top_countries: Array<{
    country: string;
    count: number;
    avg_bortle: number;
  }>;
}

export interface MapReading {
  id: string;
  latitude: number;
  longitude: number;
  bortle_scale?: number;
  sqm_value?: number;
  light_pollution_level: LightPollutionLevel;
  location_name?: string;
  city?: string;
  country?: string;
}
