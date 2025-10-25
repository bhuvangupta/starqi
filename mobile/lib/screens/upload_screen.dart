import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:geolocator/geolocator.dart';
import 'package:geocoding/geocoding.dart';
import '../services/api_service.dart';
import '../models/sky_reading.dart';

class UploadScreen extends StatefulWidget {
  const UploadScreen({super.key});

  @override
  State<UploadScreen> createState() => _UploadScreenState();
}

class _UploadScreenState extends State<UploadScreen> {
  final ApiService _apiService = ApiService();
  final ImagePicker _picker = ImagePicker();
  File? _imageFile;
  Position? _position;
  String? _locationName;
  bool _isUploading = false;
  SkyReading? _result;

  final _locationNameController = TextEditingController();
  final _cityController = TextEditingController();
  final _countryController = TextEditingController();

  Future<void> _pickImage() async {
    final XFile? image = await _picker.pickImage(source: ImageSource.camera, imageQuality: 80);
    if (image != null) {
      setState(() {
        _imageFile = File(image.path);
      });
    }
  }

  Future<void> _pickFromGallery() async {
    final XFile? image = await _picker.pickImage(source: ImageSource.gallery, imageQuality: 80);
    if (image != null) {
      setState(() {
        _imageFile = File(image.path);
      });
    }
  }

  Future<void> _getCurrentLocation() async {
    try {
      bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) throw 'Location services disabled';

      LocationPermission permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
        if (permission == LocationPermission.denied) throw 'Permission denied';
      }

      final position = await Geolocator.getCurrentPosition();
      final placemarks = await placemarkFromCoordinates(position.latitude, position.longitude);

      setState(() {
        _position = position;
        if (placemarks.isNotEmpty) {
          _cityController.text = placemarks.first.locality ?? '';
          _countryController.text = placemarks.first.country ?? '';
        }
      });

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Location obtained')),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e')),
        );
      }
    }
  }

  Future<void> _uploadPhoto() async {
    if (_imageFile == null || _position == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select photo and location')),
      );
      return;
    }

    setState(() {
      _isUploading = true;
      _result = null;
    });

    try {
      final reading = await _apiService.uploadPhoto(
        photoFile: _imageFile!,
        latitude: _position!.latitude,
        longitude: _position!.longitude,
        locationName: _locationNameController.text.isEmpty ? null : _locationNameController.text,
        city: _cityController.text.isEmpty ? null : _cityController.text,
        country: _countryController.text.isEmpty ? null : _countryController.text,
      );

      setState(() {
        _result = reading;
        _isUploading = false;
      });
    } catch (e) {
      setState(() => _isUploading = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Upload failed: $e'), backgroundColor: Colors.red),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Upload Sky Photo')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            if (_imageFile != null) ...[
              ClipRRect(
                borderRadius: BorderRadius.circular(12),
                child: Image.file(_imageFile!, height: 200, fit: BoxFit.cover),
              ),
              const SizedBox(height: 16),
            ],
            Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: _pickImage,
                    icon: const Icon(Icons.camera_alt),
                    label: const Text('Camera'),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: _pickFromGallery,
                    icon: const Icon(Icons.photo_library),
                    label: const Text('Gallery'),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24),
            ElevatedButton.icon(
              onPressed: _getCurrentLocation,
              icon: const Icon(Icons.my_location),
              label: Text(_position != null
                  ? 'Location: ${_position!.latitude.toStringAsFixed(4)}, ${_position!.longitude.toStringAsFixed(4)}'
                  : 'Get Current Location'),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _locationNameController,
              decoration: const InputDecoration(labelText: 'Location Name (Optional)'),
            ),
            const SizedBox(height: 8),
            TextField(
              controller: _cityController,
              decoration: const InputDecoration(labelText: 'City (Optional)'),
            ),
            const SizedBox(height: 8),
            TextField(
              controller: _countryController,
              decoration: const InputDecoration(labelText: 'Country (Optional)'),
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: _isUploading ? null : _uploadPhoto,
              child: _isUploading
                  ? const CircularProgressIndicator()
                  : const Text('Upload & Analyze'),
            ),
            if (_result != null) ...[
              const SizedBox(height: 24),
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Analysis Results', style: Theme.of(context).textTheme.titleLarge),
                      const Divider(),
                      _buildResultRow('Light Pollution', _result!.getPollutionLevelText()),
                      _buildResultRow('SQM Value', _result!.sqmValue?.toStringAsFixed(2) ?? 'N/A'),
                      _buildResultRow('Bortle Scale', 'Class ${_result!.bortleScale ?? '?'}'),
                      _buildResultRow('Stars Detected', '${_result!.starCount ?? 0}'),
                      _buildResultRow('Sky Brightness', _result!.skyBrightness?.toStringAsFixed(1) ?? 'N/A'),
                    ],
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildResultRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(fontWeight: FontWeight.w500)),
          Text(value, style: const TextStyle(color: Colors.grey)),
        ],
      ),
    );
  }
}
