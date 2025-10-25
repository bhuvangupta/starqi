import axios, { AxiosInstance } from 'axios';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  SkyReading,
  Statistics,
  MapReading,
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
}

export const apiService = new ApiService();
