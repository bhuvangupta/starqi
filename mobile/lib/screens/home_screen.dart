import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/auth_service.dart';
import '../services/api_service.dart';
import '../models/sky_reading.dart';
import '../utils/routes.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _selectedIndex = 0;
  final ApiService _apiService = ApiService();
  List<SkyReading> _recentReadings = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadRecentReadings();
  }

  Future<void> _loadRecentReadings() async {
    try {
      final readings = await _apiService.getReadings(limit: 10);
      setState(() {
        _recentReadings = readings;
        _isLoading = false;
      });
    } catch (e) {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('StarQI'),
        actions: [
          IconButton(
            icon: const Icon(Icons.person),
            onPressed: () => Navigator.pushNamed(context, AppRoutes.profile),
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _loadRecentReadings,
        child: _isLoading
            ? const Center(child: CircularProgressIndicator())
            : ListView(
                padding: const EdgeInsets.all(16),
                children: [
                  _buildHeroCard(context),
                  const SizedBox(height: 24),
                  _buildQuickActions(context),
                  const SizedBox(height: 24),
                  _buildRecentReadings(context),
                ],
              ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _selectedIndex,
        onTap: (index) {
          setState(() => _selectedIndex = index);
          switch (index) {
            case 0: break; // Home
            case 1: Navigator.pushNamed(context, AppRoutes.map); break;
            case 2: Navigator.pushNamed(context, AppRoutes.statistics); break;
            case 3: Navigator.pushNamed(context, AppRoutes.profile); break;
          }
        },
        type: BottomNavigationBarType.fixed,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.map), label: 'Map'),
          BottomNavigationBarItem(icon: Icon(Icons.bar_chart), label: 'Stats'),
          BottomNavigationBarItem(icon: Icon(Icons.person), label: 'Profile'),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => Navigator.pushNamed(context, AppRoutes.upload),
        icon: const Icon(Icons.camera_alt),
        label: const Text('Upload Photo'),
      ),
    );
  }

  Widget _buildHeroCard(BuildContext context) {
    return Card(
      child: Container(
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          gradient: const LinearGradient(
            colors: [Color(0xFF4338ca), Color(0xFF6366f1)],
          ),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Measure Light Pollution',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.white),
            ),
            const SizedBox(height: 8),
            const Text(
              'Upload a night sky photo to analyze light pollution in your area',
              style: TextStyle(color: Colors.white70),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildQuickActions(BuildContext context) {
    return Row(
      children: [
        Expanded(child: _buildActionCard(context, 'Upload\nPhoto', Icons.camera_alt, AppRoutes.upload)),
        const SizedBox(width: 12),
        Expanded(child: _buildActionCard(context, 'View\nMap', Icons.map, AppRoutes.map)),
        const SizedBox(width: 12),
        Expanded(child: _buildActionCard(context, 'Statistics', Icons.bar_chart, AppRoutes.statistics)),
      ],
    );
  }

  Widget _buildActionCard(BuildContext context, String title, IconData icon, String route) {
    return Card(
      child: InkWell(
        onTap: () => Navigator.pushNamed(context, route),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            children: [
              Icon(icon, size: 32, color: Theme.of(context).primaryColor),
              const SizedBox(height: 8),
              Text(title, textAlign: TextAlign.center, style: const TextStyle(fontSize: 12)),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildRecentReadings(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Recent Readings', style: Theme.of(context).textTheme.titleLarge),
        const SizedBox(height: 12),
        ..._recentReadings.map((reading) => Card(
          margin: const EdgeInsets.only(bottom: 8),
          child: ListTile(
            leading: CircleAvatar(
              backgroundColor: reading.getPollutionLevelColor(),
              child: Text(reading.bortleScale?.toString() ?? '?', style: const TextStyle(color: Colors.white)),
            ),
            title: Text(reading.locationName ?? '${reading.city ?? 'Unknown'}, ${reading.country ?? ''}'),
            subtitle: Text('SQM: ${reading.sqmValue?.toStringAsFixed(2) ?? 'N/A'}'),
            trailing: Chip(
              label: Text(reading.getPollutionLevelText(), style: const TextStyle(fontSize: 10)),
              backgroundColor: reading.getPollutionLevelColor().withOpacity(0.2),
            ),
          ),
        )).toList(),
      ],
    );
  }
}
