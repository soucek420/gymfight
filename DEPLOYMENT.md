# Gym Fight - Web Deployment Guide

This guide covers all deployment options for running the Gym Fight application as a fully working web project.

## Table of Contents
- [Quick Start Options](#quick-start-options)
- [Option 1: Docker (Recommended)](#option-1-docker-recommended)
- [Option 2: Local Development](#option-2-local-development)
- [Option 3: Production Deployment](#option-3-production-deployment)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)

---

## Quick Start Options

### 🐳 Using Docker (Easiest - No MongoDB Installation Required)
```bash
docker-compose up
```

### 💻 Using Local Development (Requires MongoDB)
```bash
./start.sh
```

### 🪟 Using Windows Batch Script
```bash
start-servers.bat
```

---

## Option 1: Docker (Recommended)

Docker provides the easiest way to run the entire application with all dependencies.

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop) (includes Docker Compose)

### Steps

1. **Clone and navigate to the project**
   ```bash
   cd gym-fight
   ```

2. **Start all services**
   ```bash
   docker-compose up
   ```
   
   Or run in detached mode (background):
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5001
   - MongoDB: localhost:27017

4. **Stop the services**
   ```bash
   docker-compose down
   ```

5. **View logs**
   ```bash
   docker-compose logs -f
   ```

### Docker Services Included
- **MongoDB**: Database server
- **Backend**: Node.js Express API server
- **Frontend**: React development server

---

## Option 2: Local Development

Run the application directly on your machine for development.

### Prerequisites

1. **Node.js** (v16 or higher)
   - Download: https://nodejs.org/
   - Verify: `node -v` and `npm -v`

2. **MongoDB** (v4.4 or higher)
   - Download: https://www.mongodb.com/try/download/community
   - Verify: `mongod --version`
   - Ensure MongoDB is running on `localhost:27017`

### Quick Start

#### Linux/macOS
```bash
# Make the start script executable
chmod +x start.sh

# Run the application
./start.sh
```

#### Windows
```bash
start-servers.bat
```

#### Manual Start

**Terminal 1 - Backend**
```bash
cd backend
npm install
npm start
```

**Terminal 2 - Frontend**
```bash
cd frontend
npm install
npm start
```

### Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5001

---

## Option 3: Production Deployment

Deploy to a production environment.

### Backend Deployment

#### Option A: Traditional VPS (DigitalOcean, AWS EC2, etc.)

1. **Prepare the server**
   ```bash
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Install MongoDB
   wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
   sudo apt-get update
   sudo apt-get install -y mongodb-org
   sudo systemctl start mongod
   sudo systemctl enable mongod
   ```

2. **Deploy backend**
   ```bash
   cd backend
   npm install --production
   
   # Use PM2 for process management
   npm install -g pm2
   pm2 start server.js --name gymfight-backend
   pm2 save
   pm2 startup
   ```

3. **Configure environment**
   ```bash
   # Create .env file
   cat > .env << EOF
   PORT=5001
   MONGO_URI=mongodb://localhost:27017/gymfight
   JWT_SECRET=your-secure-jwt-secret-here
   EOF
   ```

#### Option B: Heroku

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Create and deploy**
   ```bash
   cd backend
   heroku create gymfight-backend
   heroku addons:create mongolab
   git push heroku main
   ```

3. **Set environment variables**
   ```bash
   heroku config:set JWT_SECRET=your-secure-secret
   ```

### Frontend Deployment

#### Option A: Vercel (Recommended for React)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   cd frontend
   vercel
   ```

3. **Update API URL**
   Create `frontend/.env.production`:
   ```
   REACT_APP_API_URL=https://your-backend-url.com
   ```

#### Option B: Netlify

1. **Build the app**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Netlify**
   - Drag and drop the `build` folder to https://app.netlify.com/drop
   - Or use Netlify CLI:
     ```bash
     npm install -g netlify-cli
     netlify deploy --prod --dir=build
     ```

#### Option C: Traditional Web Server (Nginx)

1. **Build the frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Configure Nginx**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       root /var/www/gymfight/build;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }

       location /api {
           proxy_pass http://localhost:5001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

---

## Environment Variables

### Backend (.env)

```bash
# Server Configuration
PORT=5001

# Database
MONGO_URI=mongodb://localhost:27017/gymfight

# Security
JWT_SECRET=your-secure-random-secret-here

# Optional: Session Configuration
SESSION_SECRET=your-session-secret-here
```

### Frontend (.env)

For production builds, create `frontend/.env.production`:

```bash
# API URL (no trailing slash)
REACT_APP_API_URL=http://localhost:5001

# Optional: Feature Flags
REACT_APP_ENABLE_ANALYTICS=false
```

---

## Troubleshooting

### MongoDB Connection Issues

**Problem**: Cannot connect to MongoDB
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solutions**:
1. Verify MongoDB is running:
   ```bash
   # Linux
   sudo systemctl status mongod
   
   # macOS
   brew services list
   ```

2. Start MongoDB:
   ```bash
   # Linux
   sudo systemctl start mongod
   
   # macOS
   brew services start mongodb-community
   ```

3. Check MongoDB URI in `backend/.env`

### Port Already in Use

**Problem**: Port 3000 or 5001 is already in use

**Solutions**:
1. Change the port in configuration
2. Kill the process using the port:
   ```bash
   # Find process
   lsof -i :3000
   lsof -i :5001
   
   # Kill process
   kill -9 <PID>
   ```

### CORS Issues

**Problem**: Frontend cannot reach backend API

**Solutions**:
1. Ensure `frontend/package.json` has proxy:
   ```json
   "proxy": "http://localhost:5001"
   ```

2. Check backend CORS configuration in `backend/server.js`

3. For production, update frontend API URL in `.env.production`

### Dependencies Not Found

**Problem**: Module not found errors

**Solutions**:
1. Delete `node_modules` and reinstall:
   ```bash
   cd backend
   rm -rf node_modules package-lock.json
   npm install
   
   cd ../frontend
   rm -rf node_modules package-lock.json
   npm install
   ```

### Docker Issues

**Problem**: Docker containers won't start

**Solutions**:
1. Clean up Docker:
   ```bash
   docker-compose down -v
   docker system prune -a
   ```

2. Rebuild containers:
   ```bash
   docker-compose build --no-cache
   docker-compose up
   ```

3. Check logs:
   ```bash
   docker-compose logs backend
   docker-compose logs frontend
   docker-compose logs mongodb
   ```

### Build Errors

**Problem**: Frontend build fails

**Solutions**:
1. Clear cache:
   ```bash
   cd frontend
   rm -rf build node_modules/.cache
   npm run build
   ```

2. Check for linting errors:
   ```bash
   npm run build 2>&1 | grep "Failed to compile"
   ```

---

## Performance Optimization

### Production Build

Always build frontend for production:
```bash
cd frontend
npm run build
```

This creates an optimized production bundle in the `build` folder.

### Backend Optimization

1. **Use PM2 for clustering**:
   ```bash
   pm2 start server.js -i max
   ```

2. **Enable compression**:
   Add to `backend/server.js`:
   ```javascript
   const compression = require('compression');
   app.use(compression());
   ```

3. **Database indexing**:
   Ensure proper indexes in MongoDB models

---

## Security Checklist

- [ ] Change default JWT_SECRET
- [ ] Enable HTTPS in production
- [ ] Set secure CORS origins
- [ ] Use environment variables (never commit secrets)
- [ ] Enable rate limiting
- [ ] Keep dependencies updated
- [ ] Use MongoDB authentication
- [ ] Implement proper error handling
- [ ] Add request validation
- [ ] Enable security headers

---

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review application logs
3. Check MongoDB connection
4. Verify environment variables

## Next Steps

After successful deployment:
1. Create a user account
2. Create your character
3. Start logging workouts and diet
4. Battle opponents in combat mode
5. Track your fitness progress

Enjoy your Gym Fight experience! 🏋️‍♂️⚔️
