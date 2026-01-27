// PM2 Ecosystem Configuration for Gym Fight
// Use with: pm2 start ecosystem.config.js

module.exports = {
  apps: [
    {
      name: 'gymfight-backend',
      script: './backend/server.js',
      cwd: './backend',
      instances: 'max', // Use all available CPU cores
      exec_mode: 'cluster',
      watch: false, // Set to true for development
      env: {
        NODE_ENV: 'development',
        PORT: 5001
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5001
      },
      error_file: './logs/backend-error.log',
      out_file: './logs/backend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      max_memory_restart: '500M',
      min_uptime: '10s',
      max_restarts: 10,
      autorestart: true
    }
  ]
};
