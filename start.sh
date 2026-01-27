#!/bin/bash

# Gym Fight Application Startup Script

echo "======================================"
echo "   Starting Gym Fight Application    "
echo "======================================"
echo ""

# Check if MongoDB is running
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB is not installed or not in PATH"
    echo "   Please install MongoDB or use Docker:"
    echo "   docker-compose up -d"
    exit 1
fi

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running"
    echo "   Starting MongoDB..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        brew services start mongodb-community
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        sudo systemctl start mongod
    else
        echo "   Please start MongoDB manually or use Docker:"
        echo "   docker-compose up -d"
        exit 1
    fi
fi

# Check if backend dependencies are installed
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend
    npm install
    cd ..
fi

# Check if frontend dependencies are installed
if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
fi

echo ""
echo "✅ All dependencies installed"
echo ""

# Start backend in background
echo "🚀 Starting backend server..."
cd backend
npm start &
BACKEND_PID=$!
cd ..

# Wait a bit for backend to start
sleep 3

# Start frontend
echo "🚀 Starting frontend server..."
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo "======================================"
echo "   Gym Fight is starting up...       "
echo "======================================"
echo ""
echo "📍 Frontend: http://localhost:3000"
echo "📍 Backend:  http://localhost:5001"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
