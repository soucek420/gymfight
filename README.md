# 🏋️‍♂️ Gym Fight - Fitness Tracking RPG

A gamified fitness tracking web application that combines workout and diet logging with RPG character progression and combat mechanics. Turn your fitness journey into an epic adventure!

![License](https://img.shields.io/badge/license-ISC-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.2.0-blue.svg)

## 🎮 Features

### 💪 Fitness Tracking
- **Workout Logging**: Track exercises with reps, sets, and duration
- **Diet Logging**: Log meals with detailed macronutrient tracking
- **Custom Foods & Exercises**: Add your own custom items to the database
- **Daily Summary**: View your daily calorie burn and intake
- **Progress Graphs**: Visualize your fitness journey with interactive charts

### ⚔️ RPG System
- **Character Creation**: Create your unique fitness warrior
- **Character Progression**: Gain stats based on your real workout data
- **Combat System**: Battle AI opponents using your character's stats
- **Multiple Character Classes**: Choose your fighting style
- **Level Up**: Improve your character through consistent fitness tracking

### 🎯 What Makes It Unique
- Real fitness activities directly influence your in-game character
- Gamification makes fitness tracking more engaging and fun
- Comprehensive database of 100+ exercises and 100+ foods
- RPG combat adds a competitive element to fitness goals

## 📚 Documentation

- **[QUICKSTART.md](./QUICKSTART.md)** - Start here! Quick 5-minute setup guide
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Complete deployment guide for production
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Developer guide and coding standards
- **[DOCS_INDEX.md](./DOCS_INDEX.md)** - Complete documentation index
- **[PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md)** - Pre-deployment checklist

## 🚀 Quick Start

**New to Gym Fight? Start with [QUICKSTART.md](./QUICKSTART.md) for detailed instructions!**

### Option 1: Docker (Recommended - No Setup Required)

```bash
# Clone the repository
git clone <repository-url>
cd gymfight

# Start everything with Docker
docker-compose up
```

**Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5001

### Option 2: Local Development

**Prerequisites:**
- Node.js (v16+)
- MongoDB (v4.4+)
- npm or yarn

**Start the application:**

```bash
# Install all dependencies
npm run install:all

# Start both servers
npm run dev
```

Or manually:

```bash
# Terminal 1 - Backend
cd backend
npm install
npm start

# Terminal 2 - Frontend
cd frontend
npm install
npm start
```

### Option 3: Using the Start Script

**Linux/macOS:**
```bash
chmod +x start.sh
./start.sh
```

**Windows:**
```bash
start-servers.bat
```

## 📁 Project Structure

```
gymfight/
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Authentication & validation
│   │   ├── services/       # Business logic
│   │   └── database/       # DB connection & seeders
│   ├── server.js           # Entry point
│   ├── package.json
│   └── .env                # Environment variables
│
├── frontend/               # React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── api/           # API client
│   │   ├── App.js         # Root component
│   │   └── index.js       # Entry point
│   ├── public/
│   └── package.json
│
├── docker-compose.yml      # Docker orchestration
├── start.sh               # Linux/macOS start script
├── start-servers.bat      # Windows start script
└── README.md              # This file
```

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcrypt for password hashing, CORS enabled

### Frontend
- **Framework**: React 18
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Charts**: Chart.js with react-chartjs-2
- **State Management**: Context API
- **Styling**: CSS with modular stylesheets

### DevOps
- **Containerization**: Docker & Docker Compose
- **Development**: Hot reload for both frontend and backend
- **Process Management**: PM2 (production)

## 📋 Available Scripts

### Root Level
```bash
npm run install:all      # Install all dependencies
npm run dev             # Start both frontend and backend
npm run start:backend   # Start only backend
npm run start:frontend  # Start only frontend
npm run build:frontend  # Build frontend for production
npm run docker:up       # Start with Docker
npm run docker:down     # Stop Docker containers
npm run clean           # Remove all node_modules
```

### Backend
```bash
npm start               # Start backend server
npm run seed            # Seed database with sample data
npm test               # Run backend tests
```

### Frontend
```bash
npm start              # Start development server
npm run build          # Build for production
npm test              # Run tests
```

## 🔧 Configuration

### Backend Environment Variables

Create `backend/.env`:

```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/gymfight
JWT_SECRET=your-super-secure-secret-key-change-this
```

### Frontend Configuration

The frontend uses a proxy configuration in `package.json` for development:

```json
"proxy": "http://localhost:5001"
```

For production, set the API URL in `frontend/.env.production`:

```env
REACT_APP_API_URL=https://your-api-domain.com
```

## 🎯 Getting Started Guide

### 1. First Time Setup

1. Start the application (choose any method above)
2. Navigate to http://localhost:3000
3. Click "Register" to create an account
4. Log in with your credentials

### 2. Create Your Character

1. After login, you'll be prompted to create a character
2. Choose your character's name and class
3. Your starting stats will be set
4. You're ready to start your fitness journey!

### 3. Log Your First Workout

1. Navigate to "Fitness Tracker"
2. Select "Log Workout"
3. Choose an exercise from the dropdown (100+ available)
4. Enter reps/duration and notes
5. Submit - your character gains strength!

### 4. Log Your Diet

1. In "Fitness Tracker", select "Log Diet"
2. Choose a food item (100+ available)
3. Enter quantity in grams
4. Submit - track your nutrition!

### 5. Battle System

1. Navigate to "Combat"
2. Select an AI opponent
3. Your character's stats (from workouts) determine battle outcomes
4. Win battles to prove your fitness prowess!

## 📊 API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user

### Characters
- `GET /api/characters/user/:userId` - Get user's character
- `POST /api/characters` - Create new character

### Fitness
- `GET /api/exercises` - Get all exercises
- `POST /api/workoutlogs` - Log a workout
- `GET /api/workoutlogs/user` - Get user's workout logs
- `GET /api/foods` - Get all foods
- `POST /api/dietlogs` - Log food intake
- `GET /api/dietlogs/user` - Get user's diet logs
- `GET /api/dailysummary/:date` - Get daily summary

### Combat
- `GET /api/combat/aiOpponents` - Get available opponents
- `POST /api/combat` - Initiate combat

## 🐳 Docker Deployment

The application includes a complete Docker setup with three services:

1. **MongoDB**: Database service
2. **Backend**: Node.js API server
3. **Frontend**: React development server

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild after changes
docker-compose up --build
```

## 🚢 Production Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for comprehensive deployment guides including:
- Heroku deployment
- Vercel/Netlify frontend hosting
- Traditional VPS setup with Nginx
- PM2 process management
- Environment configuration
- Security best practices

## 🔍 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Ensure MongoDB is running
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Or use Docker
docker-compose up mongodb
```

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Solution**: Kill the process or change the port
```bash
# Find and kill process
lsof -ti:3000 | xargs kill -9
lsof -ti:5001 | xargs kill -9
```

### Cannot Find Module
```
Error: Cannot find module 'express'
```
**Solution**: Install dependencies
```bash
npm run install:all
```

### CORS Errors
**Solution**: Ensure proxy is set in `frontend/package.json` and CORS is enabled in `backend/server.js`

## 📝 Additional Documentation

- [DEPLOYMENT.md](./DEPLOYMENT.md) - Complete deployment guide
- [ROUTING_FIXES_README.md](./ROUTING_FIXES_README.md) - Routing architecture
- [HARDCODED_DATA_SOLUTION.md](./HARDCODED_DATA_SOLUTION.md) - Data seeding approach

## 🤝 Contributing

This is a personal fitness tracking project, but suggestions and improvements are welcome!

## 📄 License

ISC License

## 🎉 Credits

Built with passion for fitness and gaming!

---

**Ready to start your fitness adventure? Choose your deployment method above and begin your journey! 💪⚔️**
