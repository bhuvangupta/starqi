import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import '../services/api_service.dart';
import '../models/statistics.dart';

class MapScreen extends StatefulWidget {
  const MapScreen({super.key});

  @override
  State<MapScreen> createState() => _MapScreenState();
}

class _MapScreenState extends State<MapScreen> {
  final ApiService _apiService = ApiService();
  List<MapReading> _readings = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadMapData();
  }

  Future<void> _loadMapData() async {
    try {
      final readings = await _apiService.getMapData();
      setState(() {
        _readings = readings;
        _isLoading = false;
      });
    } catch (e) {
      setState(() => _isLoading = false);
    }
  }

  Color _getMarkerColor(String level) {
    switch (level) {
      case 'excellent': return const Color(0xFF10b981);
      case 'good': return const Color(0xFF22c55e);
      case 'moderate': return const Color(0xFFeab308);
      case 'poor': return const Color(0xFFf97316);
      case 'very_poor': return const Color(0xFFef4444);
      default: return Colors.grey;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Light Pollution Map')),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : FlutterMap(
              options: const MapOptions(
                initialCenter: LatLng(20, 0),
                initialZoom: 2,
              ),
              children: [
                TileLayer(
                  urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                  userAgentPackageName: 'com.starqi.mobile',
                ),
                MarkerLayer(
                  markers: _readings.map((reading) => Marker(
                    point: LatLng(reading.latitude, reading.longitude),
                    width: 30,
                    height: 30,
                    child: GestureDetector(
                      onTap: () => _showReadingInfo(reading),
                      child: Icon(
                        Icons.circle,
                        color: _getMarkerColor(reading.lightPollutionLevel),
                        size: 20,
                      ),
                    ),
                  )).toList(),
                ),
              ],
            ),
    );
  }

  void _showReadingInfo(MapReading reading) {
    showModalBottomSheet(
      context: context,
      builder: (context) => Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(reading.locationName ?? '${reading.city}, ${reading.country}',
                style: Theme.of(context).textTheme.titleLarge),
            const Divider(),
            Text('Bortle Scale: Class ${reading.bortleScale ?? '?'}'),
            Text('SQM: ${reading.sqmValue?.toStringAsFixed(2) ?? 'N/A'}'),
            Text('Level: ${reading.lightPollutionLevel.replaceAll('_', ' ').toUpperCase()}'),
          ],
        ),
      ),
    );
  }
}
