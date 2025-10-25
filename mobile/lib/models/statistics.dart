import 'sky_reading.dart';

class Statistics {
  final int totalReadings;
  final String averageBortle;
  final String averageSqm;
  final SkyReading? bestReading;
  final SkyReading? worstReading;
  final List<CountryStats> topCountries;

  Statistics({
    required this.totalReadings,
    required this.averageBortle,
    required this.averageSqm,
    this.bestReading,
    this.worstReading,
    required this.topCountries,
  });

  factory Statistics.fromJson(Map<String, dynamic> json) {
    return Statistics(
      totalReadings: json['total_readings'],
      averageBortle: json['average_bortle'],
      averageSqm: json['average_sqm'],
      bestReading: json['best_reading'] != null
          ? SkyReading.fromJson(json['best_reading'])
          : null,
      worstReading: json['worst_reading'] != null
          ? SkyReading.fromJson(json['worst_reading'])
          : null,
      topCountries: (json['top_countries'] as List?)
          ?.map((e) => CountryStats.fromJson(e))
          .toList() ?? [],
    );
  }
}

class CountryStats {
  final String country;
  final int count;
  final double avgBortle;

  CountryStats({
    required this.country,
    required this.count,
    required this.avgBortle,
  });

  factory CountryStats.fromJson(Map<String, dynamic> json) {
    return CountryStats(
      country: json['country'],
      count: json['count'] is String ? int.parse(json['count']) : json['count'],
      avgBortle: (json['avg_bortle'] as num).toDouble(),
    );
  }
}

class MapReading {
  final String id;
  final double latitude;
  final double longitude;
  final int? bortleScale;
  final double? sqmValue;
  final String lightPollutionLevel;
  final String? locationName;
  final String? city;
  final String? country;

  MapReading({
    required this.id,
    required this.latitude,
    required this.longitude,
    this.bortleScale,
    this.sqmValue,
    required this.lightPollutionLevel,
    this.locationName,
    this.city,
    this.country,
  });

  factory MapReading.fromJson(Map<String, dynamic> json) {
    return MapReading(
      id: json['id'],
      latitude: (json['latitude'] as num).toDouble(),
      longitude: (json['longitude'] as num).toDouble(),
      bortleScale: json['bortle_scale'],
      sqmValue: json['sqm_value'] != null ? (json['sqm_value'] as num).toDouble() : null,
      lightPollutionLevel: json['light_pollution_level'],
      locationName: json['location_name'],
      city: json['city'],
      country: json['country'],
    );
  }
}
