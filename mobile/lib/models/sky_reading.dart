class SkyReading {
  final String id;
  final String? userId;
  final String readingType;
  final double latitude;
  final double longitude;
  final String? locationName;
  final String? city;
  final String? country;
  final double? sqmValue;
  final int? bortleScale;
  final double? nelm;
  final double? skyBrightness;
  final int? starCount;
  final String lightPollutionLevel;
  final DateTime observationDatetime;
  final String? weatherConditions;
  final double? moonPhase;
  final DateTime createdAt;
  final DateTime updatedAt;
  final PhotoUpload? photoUpload;
  final User? user;

  SkyReading({
    required this.id,
    this.userId,
    required this.readingType,
    required this.latitude,
    required this.longitude,
    this.locationName,
    this.city,
    this.country,
    this.sqmValue,
    this.bortleScale,
    this.nelm,
    this.skyBrightness,
    this.starCount,
    required this.lightPollutionLevel,
    required this.observationDatetime,
    this.weatherConditions,
    this.moonPhase,
    required this.createdAt,
    required this.updatedAt,
    this.photoUpload,
    this.user,
  });

  factory SkyReading.fromJson(Map<String, dynamic> json) {
    return SkyReading(
      id: json['id'],
      userId: json['user_id'],
      readingType: json['reading_type'],
      latitude: (json['latitude'] as num).toDouble(),
      longitude: (json['longitude'] as num).toDouble(),
      locationName: json['location_name'],
      city: json['city'],
      country: json['country'],
      sqmValue: json['sqm_value'] != null ? (json['sqm_value'] as num).toDouble() : null,
      bortleScale: json['bortle_scale'],
      nelm: json['nelm'] != null ? (json['nelm'] as num).toDouble() : null,
      skyBrightness: json['sky_brightness'] != null ? (json['sky_brightness'] as num).toDouble() : null,
      starCount: json['star_count'],
      lightPollutionLevel: json['light_pollution_level'],
      observationDatetime: DateTime.parse(json['observation_datetime']),
      weatherConditions: json['weather_conditions'],
      moonPhase: json['moon_phase'] != null ? (json['moon_phase'] as num).toDouble() : null,
      createdAt: DateTime.parse(json['created_at']),
      updatedAt: DateTime.parse(json['updated_at']),
      photoUpload: json['photo_upload'] != null ? PhotoUpload.fromJson(json['photo_upload']) : null,
      user: json['user'] != null ? User.fromJson(json['user']) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'user_id': userId,
      'reading_type': readingType,
      'latitude': latitude,
      'longitude': longitude,
      'location_name': locationName,
      'city': city,
      'country': country,
      'sqm_value': sqmValue,
      'bortle_scale': bortleScale,
      'nelm': nelm,
      'sky_brightness': skyBrightness,
      'star_count': starCount,
      'light_pollution_level': lightPollutionLevel,
      'observation_datetime': observationDatetime.toIso8601String(),
      'weather_conditions': weatherConditions,
      'moon_phase': moonPhase,
    };
  }

  String getPollutionLevelText() {
    switch (lightPollutionLevel) {
      case 'excellent':
        return 'Excellent';
      case 'good':
        return 'Good';
      case 'moderate':
        return 'Moderate';
      case 'poor':
        return 'Poor';
      case 'very_poor':
        return 'Very Poor';
      default:
        return 'Unknown';
    }
  }

  Color getPollutionLevelColor() {
    switch (lightPollutionLevel) {
      case 'excellent':
        return const Color(0xFF10b981);
      case 'good':
        return const Color(0xFF22c55e);
      case 'moderate':
        return const Color(0xFFeab308);
      case 'poor':
        return const Color(0xFFf97316);
      case 'very_poor':
        return const Color(0xFFef4444);
      default:
        return Colors.grey;
    }
  }
}

class PhotoUpload {
  final String id;
  final String readingId;
  final String fileUrl;
  final int? fileSize;
  final String? fileFormat;
  final String? cameraModel;
  final int? isoValue;
  final String? exposureTime;
  final String? aperture;
  final double? averageBrightness;
  final double? skyRegionBrightness;
  final bool? horizonGlowDetected;
  final int? colorTemperature;
  final String processingStatus;
  final String? processingError;

  PhotoUpload({
    required this.id,
    required this.readingId,
    required this.fileUrl,
    this.fileSize,
    this.fileFormat,
    this.cameraModel,
    this.isoValue,
    this.exposureTime,
    this.aperture,
    this.averageBrightness,
    this.skyRegionBrightness,
    this.horizonGlowDetected,
    this.colorTemperature,
    required this.processingStatus,
    this.processingError,
  });

  factory PhotoUpload.fromJson(Map<String, dynamic> json) {
    return PhotoUpload(
      id: json['id'],
      readingId: json['reading_id'],
      fileUrl: json['file_url'],
      fileSize: json['file_size'],
      fileFormat: json['file_format'],
      cameraModel: json['camera_model'],
      isoValue: json['iso_value'],
      exposureTime: json['exposure_time'],
      aperture: json['aperture'],
      averageBrightness: json['average_brightness'] != null ? (json['average_brightness'] as num).toDouble() : null,
      skyRegionBrightness: json['sky_region_brightness'] != null ? (json['sky_region_brightness'] as num).toDouble() : null,
      horizonGlowDetected: json['horizon_glow_detected'],
      colorTemperature: json['color_temperature'],
      processingStatus: json['processing_status'],
      processingError: json['processing_error'],
    );
  }
}

class User {
  final String id;
  final String email;
  final String username;
  final String? fullName;
  final DateTime createdAt;
  final int? totalReadings;
  final int? totalContributions;

  User({
    required this.id,
    required this.email,
    required this.username,
    this.fullName,
    required this.createdAt,
    this.totalReadings,
    this.totalContributions,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'],
      email: json['email'],
      username: json['username'],
      fullName: json['full_name'],
      createdAt: DateTime.parse(json['created_at']),
      totalReadings: json['total_readings'],
      totalContributions: json['total_contributions'],
    );
  }
}
