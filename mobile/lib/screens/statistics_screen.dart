import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import '../services/api_service.dart';
import '../models/statistics.dart';

class StatisticsScreen extends StatefulWidget {
  const StatisticsScreen({super.key});

  @override
  State<StatisticsScreen> createState() => _StatisticsScreenState();
}

class _StatisticsScreenState extends State<StatisticsScreen> {
  final ApiService _apiService = ApiService();
  Statistics? _statistics;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadStatistics();
  }

  Future<void> _loadStatistics() async {
    try {
      final stats = await _apiService.getStatistics();
      setState(() {
        _statistics = stats;
        _isLoading = false;
      });
    } catch (e) {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Global Statistics')),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _statistics == null
              ? const Center(child: Text('Failed to load statistics'))
              : RefreshIndicator(
                  onRefresh: _loadStatistics,
                  child: ListView(
                    padding: const EdgeInsets.all(16),
                    children: [
                      _buildStatCard('Total Readings', _statistics!.totalReadings.toString(), Icons.photo_library, Colors.blue),
                      _buildStatCard('Average Bortle', _statistics!.averageBortle, Icons.nights_stay, Colors.purple),
                      _buildStatCard('Average SQM', '${_statistics!.averageSqm} mag/arcsec²', Icons.brightness_3, Colors.orange),
                      const SizedBox(height: 24),
                      if (_statistics!.topCountries.isNotEmpty) ...[
                        Text('Top Countries', style: Theme.of(context).textTheme.titleLarge),
                        const SizedBox(height: 16),
                        SizedBox(
                          height: 300,
                          child: BarChart(
                            BarChartData(
                              barGroups: _statistics!.topCountries.asMap().entries.map((entry) => BarChartGroupData(
                                x: entry.key,
                                barRods: [BarChartRodData(toY: entry.value.count.toDouble(), color: Theme.of(context).primaryColor)],
                              )).toList(),
                              titlesData: FlTitlesData(
                                leftTitles: AxisTitles(sideTitles: SideTitles(showTitles: true, reservedSize: 40)),
                                bottomTitles: AxisTitles(
                                  sideTitles: SideTitles(
                                    showTitles: true,
                                    getTitlesWidget: (value, meta) {
                                      if (value.toInt() < _statistics!.topCountries.length) {
                                        return Text(_statistics!.topCountries[value.toInt()].country, style: const TextStyle(fontSize: 10));
                                      }
                                      return const Text('');
                                    },
                                  ),
                                ),
                                topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                                rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ],
                  ),
                ),
    );
  }

  Widget _buildStatCard(String title, String value, IconData icon, Color color) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: color.withOpacity(0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, color: color, size: 32),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: const TextStyle(color: Colors.grey)),
                  Text(value, style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
