# 📱 StarQI Mobile App

Flutter mobile application for StarQI - Light Pollution Monitoring Platform

---

## 🌟 Features

- ✅ Photo upload and sky quality analysis
- ✅ Interactive global map with light pollution data
- ✅ Real-time statistics and analytics
- ✅ User authentication and profiles
- ✅ GPS location integration
- ✅ Camera integration for sky photos
- ✅ Beautiful Material Design UI
- ✅ Cross-platform (iOS & Android)

---

## 📋 Prerequisites

- Flutter SDK 3.16.0 or higher
- Dart 3.2.0 or higher
- Android Studio / Xcode
- Android SDK / iOS SDK
- StarQI backend running (see parent README.md)

---

## 🚀 Getting Started

### 1. Install Flutter

```bash
# Download Flutter SDK
# https://docs.flutter.dev/get-started/install

# Verify installation
flutter doctor
```

### 2. Install Dependencies

```bash
cd mobile
flutter pub get
```

### 3. Configure API Endpoint

Edit `lib/services/api_service.dart`:

```dart
// For Android Emulator
static const String baseUrl = 'http://10.0.2.2:5000/api';

// For iOS Simulator
static const String baseUrl = 'http://localhost:5000/api';

// For Physical Device (use your computer's IP)
static const String baseUrl = 'http://192.168.1.100:5000/api';

// For Production
static const String baseUrl = 'https://yourdomain.com/api';
```

### 4. Run the App

```bash
# List available devices
flutter devices

# Run on Android
flutter run -d android

# Run on iOS
flutter run -d ios

# Run on specific device
flutter run -d <device_id>
```

---

## 📱 Permissions

### Android (android/app/src/main/AndroidManifest.xml)

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

### iOS (ios/Runner/Info.plist)

```xml
<key>NSCameraUsageDescription</key>
<string>We need camera access to capture sky photos</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>We need photo library access to select sky photos</string>
<key>NSLocationWhenInUseUsageDescription</key>
<string>We need location access to tag your sky photos</string>
```

---

## 🏗️ Project Structure

```
mobile/
├── lib/
│   ├── main.dart                  # App entry point
│   ├── models/
│   │   ├── sky_reading.dart       # SkyReading, PhotoUpload, User models
│   │   └── statistics.dart        # Statistics, MapReading models
│   ├── services/
│   │   ├── api_service.dart       # API client
│   │   └── auth_service.dart      # Authentication service
│   ├── screens/
│   │   ├── splash_screen.dart     # Splash/loading screen
│   │   ├── home_screen.dart       # Main dashboard
│   │   ├── login_screen.dart      # Login
│   │   ├── register_screen.dart   # Registration
│   │   ├── upload_screen.dart     # Photo upload
│   │   ├── map_screen.dart        # Interactive map
│   │   ├── profile_screen.dart    # User profile
│   │   ├── statistics_screen.dart # Global statistics
│   │   └── reading_detail_screen.dart # Reading details
│   ├── utils/
│   │   ├── theme.dart             # App theme
│   │   └── routes.dart            # Route definitions
│   └── widgets/                   # Reusable widgets
├── android/                       # Android configuration
├── ios/                           # iOS configuration
├── assets/                        # Images, icons, fonts
├── pubspec.yaml                   # Dependencies
└── README.md                      # This file
```

---

## 🔧 Build for Production

### Android APK

```bash
flutter build apk --release
# Output: build/app/outputs/flutter-apk/app-release.apk
```

### Android App Bundle (for Google Play)

```bash
flutter build appbundle --release
# Output: build/app/outputs/bundle/release/app-release.aab
```

### iOS (requires Mac)

```bash
flutter build ios --release
# Then open in Xcode and archive
```

---

## 📦 Key Dependencies

| Package | Purpose |
|---------|---------|
| **dio** | HTTP client for API calls |
| **provider** | State management |
| **flutter_riverpod** | Alternative state management |
| **flutter_map** | Interactive maps |
| **geolocator** | GPS location |
| **image_picker** | Camera/gallery access |
| **cached_network_image** | Image caching |
| **fl_chart** | Charts and graphs |
| **shared_preferences** | Local storage |
| **flutter_secure_storage** | Secure token storage |

---

## 🎨 Theming

The app supports light and dark themes automatically based on system preferences.

To customize colors, edit `lib/utils/theme.dart`:

```dart
static const Color primaryColor = Color(0xFF4338ca);
static const Color secondaryColor = Color(0xFF1e1b4b);
```

---

## 🔐 Security

- JWT tokens stored securely using `flutter_secure_storage`
- HTTPS enforcement in production
- Input validation on all forms
- Permission requests before accessing camera/location

---

## 🐛 Troubleshooting

### Common Issues

**1. "Unable to connect to server"**
- Check API endpoint configuration
- Ensure backend is running
- For emulator, use correct IP (10.0.2.2 for Android)
- For physical device, use computer's network IP

**2. "Camera permission denied"**
- Check AndroidManifest.xml / Info.plist
- Reinstall the app
- Grant permissions in device settings

**3. "Location services disabled"**
- Enable location on device
- Grant location permissions
- Check permission_handler configuration

**4. Build errors**
- Run `flutter clean`
- Run `flutter pub get`
- Update Flutter: `flutter upgrade`
- Clear Gradle cache (Android): `cd android && ./gradlew clean`

---

## 📱 Screenshots

*(Add screenshots of your app here)*

---

## 🧪 Testing

```bash
# Run all tests
flutter test

# Run with coverage
flutter test --coverage

# Run integration tests
flutter drive --target=test_driver/app.dart
```

---

## 🚀 Deployment

### Google Play Store

1. Create keystore
2. Configure `android/app/build.gradle`
3. Build app bundle
4. Upload to Google Play Console

### Apple App Store

1. Configure signing in Xcode
2. Build archive
3. Upload to App Store Connect
4. Submit for review

See [Flutter deployment guide](https://docs.flutter.dev/deployment) for details.

---

## 📄 License

MIT License - See parent LICENSE file

---

## 🤝 Contributing

Contributions welcome! See parent CONTRIBUTING.md

---

## 📞 Support

- **Issues**: Report on GitHub
- **Documentation**: https://docs.starqi.org
- **API**: See parent README.md for API documentation

---

## 🔗 Related

- [Backend API](../server/README.md)
- [Web Frontend](../client/README.md)
- [Main Project](../README.md)

---

**Made with ❤️ using Flutter**
