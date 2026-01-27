# 🚀 Gym Fight - Quick Start Guide

Get up and running with Gym Fight in under 5 minutes!

## Choose Your Setup Method

### 🐳 Method 1: Docker (Easiest)
**Best for**: Quick testing, no MongoDB installation needed

```bash
# Start everything
docker-compose up

# Access the app
open http://localhost:3000
```

That's it! ✨

---

### 💻 Method 2: Automated Script (macOS/Linux)
**Best for**: Local development with MongoDB

```bash
# Check prerequisites
./check-setup.sh

# Install everything and start
./start.sh
```

---

### 🪟 Method 3: Windows
**Best for**: Windows users

```bash
# Double-click or run
start-servers.bat
```

---

### 🔧 Method 4: Manual (All platforms)

**Step 1: Install MongoDB**
- Download from: https://www.mongodb.com/try/download/community
- Start MongoDB service

**Step 2: Install dependencies**
```bash
npm run install:all
```

**Step 3: Start servers**

Terminal 1 - Backend:
```bash
cd backend
npm start
```

Terminal 2 - Frontend:
```bash
cd frontend
npm start
```

**Step 4: Open browser**
```
http://localhost:3000
```

---

## First Time User Flow

### 1. Register Account
- Navigate to http://localhost:3000
- Click "Register"
- Fill in username, email, password
- Click "Register" button

### 2. Login
- Use your credentials to login
- You'll be redirected to the dashboard

### 3. Create Character
- Click "RPG" or "Create Character"
- Choose a character name
- Select a class (Warrior, Mage, Rogue)
- Click "Create Character"

### 4. Log Your First Workout
- Navigate to "Fitness Tracker"
- Click "Add Workout"
- Select an exercise from dropdown (100+ available!)
- Enter reps/sets or duration
- Add optional notes
- Submit!

Your character gains strength based on your workout! 💪

### 5. Log Your Diet
- In "Fitness Tracker", go to "Diet Log"
- Click "Add Food"
- Select a food item (100+ available!)
- Enter quantity in grams
- Submit!

Track your nutrition and see daily summaries!

### 6. View Progress
- Check "Progress Graphs" to see your fitness journey
- View daily summaries of calories burned and consumed
- Watch your character grow stronger!

### 7. Battle!
- Navigate to "Combat"
- Select an AI opponent
- Start battle!
- Your real fitness stats determine the outcome

---

## Troubleshooting

### Problem: MongoDB connection error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Start MongoDB
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Or use Docker
docker-compose up mongodb
```

### Problem: Port already in use
```
Error: listen EADDRINUSE :::3000
```
**Solution**: Kill the process
```bash
# macOS/Linux
lsof -ti:3000 | xargs kill -9
lsof -ti:5001 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Problem: npm install fails
**Solution**: Clear cache and retry
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Problem: Can't see exercises/foods
**Solution**: The data is hardcoded in controllers. If dropdowns are empty:
1. Check browser console for errors
2. Ensure backend is running on port 5001
3. Check network tab for API call failures
4. Verify proxy setting in frontend/package.json

---

## Quick Commands Reference

```bash
# Install everything
npm run install:all

# Start both servers (requires concurrently)
npm run dev

# Start individually
npm run start:backend
npm run start:frontend

# Build frontend for production
npm run build:frontend

# Docker commands
docker-compose up           # Start all services
docker-compose up -d        # Start in background
docker-compose down         # Stop all services
docker-compose logs -f      # View logs

# Database seeding (optional)
cd backend
npm run seed

# Check your setup
./check-setup.sh
```

---

## Default Ports

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001
- **MongoDB**: localhost:27017

---

## Environment Variables

Backend `.env` (already configured):
```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/gymfight
JWT_SECRET=<secret-key>
```

---

## Next Steps

✅ Register and create your account  
✅ Create your character  
✅ Log your first workout  
✅ Log your first meal  
✅ Battle an opponent  
✅ Track your progress  

📖 For more details, see:
- [README.md](./README.md) - Full documentation
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Production deployment
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Development guide

---

## Need Help?

1. Run the setup checker: `./check-setup.sh`
2. Check the troubleshooting section above
3. Review the console output for error messages
4. Check the full documentation in README.md

---

**Ready? Let's get started! 🏋️‍♂️⚔️**

```bash
# Choose your preferred method and run it!
docker-compose up          # Docker
./start.sh                # Auto script
start-servers.bat         # Windows
npm run dev               # NPM
```
