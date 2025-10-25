import 'package:flutter/material.dart';
import 'package:cached_network_image.dart';
import '../models/sky_reading.dart';

class ReadingDetailScreen extends StatelessWidget {
  final SkyReading reading;

  const ReadingDetailScreen({super.key, required this.reading});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Reading Details')),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            if (reading.photoUpload != null)
              CachedNetworkImage(
                imageUrl: reading.photoUpload!.fileUrl,
                height: 300,
                fit: BoxFit.cover,
                placeholder: (context, url) => const Center(child: CircularProgressIndicator()),
                errorWidget: (context, url, error) => const Icon(Icons.error),
              ),
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: reading.getPollutionLevelColor(),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          reading.getPollutionLevelText(),
                          style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Text(reading.locationName ?? '${reading.city}, ${reading.country}',
                      style: Theme.of(context).textTheme.headlineSmall),
                  const SizedBox(height: 8),
                  Text('${reading.latitude.toStringAsFixed(4)}, ${reading.longitude.toStringAsFixed(4)}',
                      style: const TextStyle(color: Colors.grey)),
                  const Divider(height: 32),
                  _buildInfoRow('SQM Value', '${reading.sqmValue?.toStringAsFixed(2) ?? 'N/A'} mag/arcsec²'),
                  _buildInfoRow('Bortle Scale', 'Class ${reading.bortleScale ?? '?'}'),
                  _buildInfoRow('Stars Detected', '${reading.starCount ?? 0}'),
                  _buildInfoRow('Sky Brightness', reading.skyBrightness?.toStringAsFixed(1) ?? 'N/A'),
                  _buildInfoRow('NELM', reading.nelm?.toStringAsFixed(1) ?? 'N/A'),
                  const Divider(height: 32),
                  _buildInfoRow('Observation Time', _formatDate(reading.observationDatetime)),
                  _buildInfoRow('Uploaded', _formatDate(reading.createdAt)),
                  if (reading.user != null) _buildInfoRow('By', reading.user!.username),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(fontWeight: FontWeight.w500)),
          Text(value, style: const TextStyle(color: Colors.grey)),
        ],
      ),
    );
  }

  String _formatDate(DateTime date) {
    return '${date.year}-${date.month.toString().padLeft(2, '0')}-${date.day.toString().padLeft(2, '0')} ${date.hour.toString().padLeft(2, '0')}:${date.minute.toString().padLeft(2, '0')}';
  }
}
