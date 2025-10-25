import 'dart:io';
import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/sky_reading.dart';
import '../models/statistics.dart';

class ApiService {
  static const String baseUrl = 'http://10.0.2.2:5000/api'; // Android emulator
  // static const String baseUrl = 'http://localhost:5000/api'; // iOS simulator
  // static const String baseUrl = 'https://your-domain.com/api'; // Production

  late final Dio _dio;
  String? _authToken;

  ApiService() {
    _dio = Dio(BaseOptions(
      baseUrl: baseUrl,
      connectTimeout: const Duration(seconds: 30),
      receiveTimeout: const Duration(seconds: 30),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    ));

    // Add interceptors
    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          // Add auth token if available
          if (_authToken != null) {
            options.headers['Authorization'] = 'Bearer $_authToken';
          }
          return handler.next(options);
        },
        onError: (error, handler) {
          // Handle errors globally
          print('API Error: ${error.message}');
          return handler.next(error);
        },
      ),
    );

    _loadAuthToken();
  }

  Future<void> _loadAuthToken() async {
    final prefs = await SharedPreferences.getInstance();
    _authToken = prefs.getString('auth_token');
  }

  Future<void> _saveAuthToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('auth_token', token);
    _authToken = token;
  }

  Future<void> clearAuthToken() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('auth_token');
    _authToken = null;
  }

  // =========================================================================
  // Authentication Endpoints
  // =========================================================================

  Future<Map<String, dynamic>> register({
    required String email,
    required String username,
    required String password,
    String? fullName,
  }) async {
    try {
      final response = await _dio.post(
        '/auth/register',
        data: {
          'email': email,
          'username': username,
          'password': password,
          if (fullName != null) 'full_name': fullName,
        },
      );

      if (response.data['token'] != null) {
        await _saveAuthToken(response.data['token']);
      }

      return response.data;
    } catch (e) {
      rethrow;
    }
  }

  Future<Map<String, dynamic>> login({
    required String email,
    required String password,
  }) async {
    try {
      final response = await _dio.post(
        '/auth/login',
        data: {
          'email': email,
          'password': password,
        },
      );

      if (response.data['token'] != null) {
        await _saveAuthToken(response.data['token']);
      }

      return response.data;
    } catch (e) {
      rethrow;
    }
  }

  Future<Map<String, dynamic>> getProfile() async {
    try {
      final response = await _dio.get('/auth/profile');
      return response.data;
    } catch (e) {
      rethrow;
    }
  }

  Future<void> logout() async {
    await clearAuthToken();
  }

  // =========================================================================
  // Sky Readings Endpoints
  // =========================================================================

  Future<SkyReading> uploadPhoto({
    required File photoFile,
    required double latitude,
    required double longitude,
    String? locationName,
    String? city,
    String? country,
    DateTime? observationDatetime,
  }) async {
    try {
      FormData formData = FormData.fromMap({
        'photo': await MultipartFile.fromFile(
          photoFile.path,
          filename: photoFile.path.split('/').last,
        ),
        'latitude': latitude,
        'longitude': longitude,
        if (locationName != null) 'location_name': locationName,
        if (city != null) 'city': city,
        if (country != null) 'country': country,
        if (observationDatetime != null)
          'observation_datetime': observationDatetime.toIso8601String(),
      });

      final response = await _dio.post(
        '/readings/upload',
        data: formData,
        options: Options(
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        ),
      );

      return SkyReading.fromJson(response.data['reading']);
    } catch (e) {
      rethrow;
    }
  }

  Future<SkyReading> getReading(String id) async {
    try {
      final response = await _dio.get('/readings/$id');
      return SkyReading.fromJson(response.data['reading']);
    } catch (e) {
      rethrow;
    }
  }

  Future<List<SkyReading>> getReadings({
    String? userId,
    String? country,
    int? minBortle,
    int? maxBortle,
    int limit = 20,
    int offset = 0,
  }) async {
    try {
      final response = await _dio.get(
        '/readings',
        queryParameters: {
          if (userId != null) 'user_id': userId,
          if (country != null) 'country': country,
          if (minBortle != null) 'min_bortle': minBortle,
          if (maxBortle != null) 'max_bortle': maxBortle,
          'limit': limit,
          'offset': offset,
        },
      );

      return (response.data['readings'] as List)
          .map((e) => SkyReading.fromJson(e))
          .toList();
    } catch (e) {
      rethrow;
    }
  }

  Future<List<MapReading>> getMapData() async {
    try {
      final response = await _dio.get('/readings/map/data');
      return (response.data['readings'] as List)
          .map((e) => MapReading.fromJson(e))
          .toList();
    } catch (e) {
      rethrow;
    }
  }

  Future<Statistics> getStatistics() async {
    try {
      final response = await _dio.get('/readings/stats/global');
      return Statistics.fromJson(response.data['statistics']);
    } catch (e) {
      rethrow;
    }
  }

  // =========================================================================
  // Health Check
  // =========================================================================

  Future<bool> checkHealth() async {
    try {
      final response = await _dio.get(
        '/health',
        options: Options(
          baseUrl: baseUrl.replaceAll('/api', ''),
        ),
      );
      return response.statusCode == 200;
    } catch (e) {
      return false;
    }
  }
}
