import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/auth_service.dart';
import '../utils/routes.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Profile')),
      body: Consumer<AuthService>(
        builder: (context, authService, child) {
          if (!authService.isAuthenticated) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.person_outline, size: 80, color: Colors.grey),
                  const SizedBox(height: 16),
                  const Text('Not logged in'),
                  const SizedBox(height: 24),
                  ElevatedButton(
                    onPressed: () => Navigator.pushNamed(context, AppRoutes.login),
                    child: const Text('Login'),
                  ),
                ],
              ),
            );
          }

          final user = authService.currentUser!;
          return ListView(
            padding: const EdgeInsets.all(16),
            children: [
              CircleAvatar(
                radius: 50,
                child: Text(user.username[0].toUpperCase(), style: const TextStyle(fontSize: 40)),
              ),
              const SizedBox(height: 16),
              Text(user.fullName ?? user.username,
                  textAlign: TextAlign.center,
                  style: Theme.of(context).textTheme.headlineSmall),
              Text(user.email,
                  textAlign: TextAlign.center,
                  style: const TextStyle(color: Colors.grey)),
              const SizedBox(height: 24),
              Card(
                child: ListTile(
                  leading: const Icon(Icons.photo_library),
                  title: const Text('Total Readings'),
                  trailing: Text('${user.totalReadings ?? 0}',
                      style: const TextStyle(fontWeight: FontWeight.bold)),
                ),
              ),
              Card(
                child: ListTile(
                  leading: const Icon(Icons.emoji_events),
                  title: const Text('Contribution Points'),
                  trailing: Text('${user.totalContributions ?? 0}',
                      style: const TextStyle(fontWeight: FontWeight.bold)),
                ),
              ),
              const SizedBox(height: 24),
              ListTile(
                leading: const Icon(Icons.settings),
                title: const Text('Settings'),
                trailing: const Icon(Icons.chevron_right),
                onTap: () {},
              ),
              ListTile(
                leading: const Icon(Icons.help),
                title: const Text('Help & Support'),
                trailing: const Icon(Icons.chevron_right),
                onTap: () {},
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: () {
                  authService.logout();
                  Navigator.pushReplacementNamed(context, AppRoutes.home);
                },
                style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
                child: const Text('Logout'),
              ),
            ],
          );
        },
      ),
    );
  }
}
