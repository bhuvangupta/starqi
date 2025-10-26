import axios, { AxiosInstance } from 'axios';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  SkyReading,
  Statistics,
  MapReading,
  SendOTPRequest,
  SendOTPResponse,
  VerifyOTPRequest,
  VerifyOTPResponse,
  CompleteProfileRequest,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add auth token to requests
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  // Auth endpoints
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/auth/register', data);
    return response.data;
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/auth/login', data);
    return response.data;
  }

  async getProfile(): Promise<{ user: any }> {
    const response = await this.api.get('/auth/profile');
    return response.data;
  }

  // OTP-based authentication
  async sendOTP(data: SendOTPRequest): Promise<SendOTPResponse> {
    const response = await this.api.post<SendOTPResponse>('/auth/send-otp', data);
    return response.data;
  }

  async verifyOTP(data: VerifyOTPRequest): Promise<VerifyOTPResponse> {
    const response = await this.api.post<VerifyOTPResponse>('/auth/verify-otp', data);
    return response.data;
  }

  async completeProfile(data: CompleteProfileRequest): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/auth/complete-profile', data);
    return response.data;
  }

  // Readings endpoints
  async uploadPhoto(formData: FormData): Promise<{ reading: SkyReading }> {
    const response = await this.api.post<{ reading: SkyReading }>(
      '/readings/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }

  async getReading(id: string): Promise<{ reading: SkyReading }> {
    const response = await this.api.get<{ reading: SkyReading }>(
      `/readings/${id}`
    );
    return response.data;
  }

  async getReadings(params?: {
    user_id?: string;
    country?: string;
    min_bortle?: number;
    max_bortle?: number;
    limit?: number;
    offset?: number;
  }): Promise<{
    readings: SkyReading[];
    pagination: { total: number; limit: number; offset: number };
  }> {
    const response = await this.api.get('/readings', { params });
    return response.data;
  }

  async getMapData(): Promise<{ readings: MapReading[] }> {
    const response = await this.api.get<{ readings: MapReading[] }>(
      '/readings/map/data'
    );
    return response.data;
  }

  async getStatistics(): Promise<{ statistics: Statistics }> {
    const response = await this.api.get<{ statistics: Statistics }>(
      '/readings/stats/global'
    );
    return response.data;
  }

  // Stats endpoints
  async getImpactMetrics(): Promise<any> {
    const response = await this.api.get('/stats/impact');
    return response.data;
  }

  async getQuickStats(): Promise<{
    totalUsers: number;
    totalReadings: number;
    countries: number;
  }> {
    const response = await this.api.get('/stats/quick');
    return response.data;
  }

  async updateManualMetric(
    metricName: string,
    value: number,
    updatedBy?: string
  ): Promise<any> {
    const response = await this.api.put(`/stats/manual/${metricName}`, {
      value,
      updatedBy,
    });
    return response.data;
  }

  // Article endpoints (public)
  async getArticles(params?: {
    category?: string;
    language?: string;
    limit?: number;
    offset?: number;
  }): Promise<{
    articles: any[];
    pagination: { total: number; limit: number; offset: number };
  }> {
    const response = await this.api.get('/articles', { params });
    return response.data;
  }

  async getArticle(slug: string): Promise<{ article: any }> {
    const response = await this.api.get(`/articles/${slug}`);
    return response.data;
  }

  async getCategories(): Promise<{ categories: any[] }> {
    const response = await this.api.get('/articles/categories');
    return response.data;
  }

  // Article endpoints (admin)
  async getAllArticlesAdmin(params?: {
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<{
    articles: any[];
    pagination: { total: number; limit: number; offset: number };
  }> {
    const response = await this.api.get('/articles/admin/all', { params });
    return response.data;
  }

  async createArticle(data: {
    title: string;
    slug: string;
    excerpt?: string;
    content: string;
    category?: string;
    language?: string;
    author_name?: string;
    featured_image?: string;
    tags?: string;
    status?: string;
  }): Promise<{ message: string; article: any }> {
    const response = await this.api.post('/articles/admin/create', data);
    return response.data;
  }

  async updateArticle(
    id: string,
    data: {
      title?: string;
      slug?: string;
      excerpt?: string;
      content?: string;
      category?: string;
      language?: string;
      author_name?: string;
      featured_image?: string;
      tags?: string;
      status?: string;
    }
  ): Promise<{ message: string; article: any }> {
    const response = await this.api.put(`/articles/admin/${id}`, data);
    return response.data;
  }

  async deleteArticle(id: string): Promise<{ message: string }> {
    const response = await this.api.delete(`/articles/admin/${id}`);
    return response.data;
  }

  // User endpoints
  async getUserStats(userId: string = 'me'): Promise<{
    user: any;
    stats: {
      totalReadings: number;
      rank: number | null;
      bestReading: any;
      averageSqm: string | null;
      averageBortle: string | null;
      citiesCount: number;
      countriesCount: number;
      recentReadings: any[];
    };
  }> {
    const response = await this.api.get(`/users/${userId}/stats`);
    return response.data;
  }

  async getUserReadings(
    userId: string = 'me',
    params?: { page?: number; limit?: number }
  ): Promise<{
    readings: SkyReading[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }> {
    const response = await this.api.get(`/users/${userId}/readings`, { params });
    return response.data;
  }

  // Photo endpoints
  async getPhotoFeed(params?: { page?: number; limit?: number }): Promise<{
    photos: any[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }> {
    const response = await this.api.get('/photos/feed', { params });
    return response.data;
  }

  async getPhotoDetails(photoId: string): Promise<{ photo: any }> {
    const response = await this.api.get(`/photos/${photoId}`);
    return response.data;
  }

  // VIIRS (Satellite Light Pollution Data) endpoints
  async getLightPollutionEstimate(lat: number, lng: number): Promise<{
    success: boolean;
    data: {
      radiance: number;
      sqm: number;
      bortleScale: number;
      lightPollutionLevel: string;
      nelm: number;
      source: string;
      dataYear: number;
      coordinates: { latitude: number; longitude: number };
    };
  }> {
    const response = await this.api.get('/viirs/estimate', {
      params: { lat, lng },
    });
    return response.data;
  }

  async getLightPollutionRegionStats(bounds: {
    minLat: number;
    maxLat: number;
    minLon: number;
    maxLon: number;
  }): Promise<{
    success: boolean;
    data: {
      avgRadiance: number;
      avgSQM: number;
      avgBortle: number;
      dataPoints: number;
    };
  }> {
    const response = await this.api.get('/viirs/region', {
      params: bounds,
    });
    return response.data;
  }
}

export const apiService = new ApiService();
