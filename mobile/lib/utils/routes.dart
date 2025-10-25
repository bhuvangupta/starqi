import 'package:flutter/material.dart';
import '../screens/splash_screen.dart';
import '../screens/home_screen.dart';
import '../screens/login_screen.dart';
import '../screens/register_screen.dart';
import '../screens/upload_screen.dart';
import '../screens/map_screen.dart';
import '../screens/profile_screen.dart';
import '../screens/reading_detail_screen.dart';
import '../screens/statistics_screen.dart';

class AppRoutes {
  static const String splash = '/';
  static const String home = '/home';
  static const String login = '/login';
  static const String register = '/register';
  static const String upload = '/upload';
  static const String map = '/map';
  static const String profile = '/profile';
  static const String readingDetail = '/reading-detail';
  static const String statistics = '/statistics';

  static Map<String, WidgetBuilder> get routes {
    return {
      splash: (context) => const SplashScreen(),
      home: (context) => const HomeScreen(),
      login: (context) => const LoginScreen(),
      register: (context) => const RegisterScreen(),
      upload: (context) => const UploadScreen(),
      map: (context) => const MapScreen(),
      profile: (context) => const ProfileScreen(),
      statistics: (context) => const StatisticsScreen(),
    };
  }
}
