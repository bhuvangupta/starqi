// PM2 Process Configuration for StarQI
// https://pm2.keymetrics.io/docs/usage/application-declaration/

module.exports = {
  apps: [
    {
      name: 'starqi-server',
      script: './dist/index.js',
      cwd: './server',
      instances: 'max', // Use all available CPUs
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
      env_production: {
        NODE_ENV: 'production',
      },
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_file: './logs/pm2-combined.log',
      time: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      listen_timeout: 3000,
      kill_timeout: 5000,
      wait_ready: true,
      shutdown_with_message: true,

      // Health monitoring
      instance_var: 'INSTANCE_ID',

      // Advanced features
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',

      // Graceful shutdown
      kill_timeout: 5000,

      // Resource limits
      max_memory_restart: '500M',

      // Monitoring
      monitoring: true,

      // Auto-restart on file changes (disable in production)
      watch: false,
      ignore_watch: ['node_modules', 'logs', 'uploads'],

      // Source maps support
      source_map_support: true,

      // Combine logs from all instances
      merge_logs: true,

      // Cron restart (optional - restart daily at 3 AM)
      cron_restart: '0 3 * * *',

      // Exponential backoff restart delay
      exp_backoff_restart_delay: 100,
    },
  ],

  // Deployment configuration
  deploy: {
    production: {
      user: 'deploy',
      host: ['production.starqi.org'],
      ref: 'origin/main',
      repo: 'git@github.com:yourusername/starqi.git',
      path: '/var/www/starqi',
      'post-deploy': 'npm install && npm run build && pm2 reload pm2.config.js --env production',
      'pre-setup': 'mkdir -p /var/www/starqi',
      env: {
        NODE_ENV: 'production',
      },
    },
    staging: {
      user: 'deploy',
      host: ['staging.starqi.org'],
      ref: 'origin/develop',
      repo: 'git@github.com:yourusername/starqi.git',
      path: '/var/www/starqi-staging',
      'post-deploy': 'npm install && npm run build && pm2 reload pm2.config.js --env staging',
      env: {
        NODE_ENV: 'staging',
      },
    },
  },
};
