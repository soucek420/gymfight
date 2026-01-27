#!/bin/bash

# Gym Fight - Setup Verification Script

echo "======================================"
echo "  Gym Fight Setup Verification Tool  "
echo "======================================"
echo ""

SUCCESS="✅"
FAIL="❌"
WARNING="⚠️ "

# Check Node.js
echo -n "Checking Node.js... "
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo "$SUCCESS Node.js $NODE_VERSION"
else
    echo "$FAIL Node.js not found"
    echo "   Install from: https://nodejs.org/"
fi

# Check npm
echo -n "Checking npm... "
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo "$SUCCESS npm $NPM_VERSION"
else
    echo "$FAIL npm not found"
fi

# Check MongoDB
echo -n "Checking MongoDB... "
if command -v mongod &> /dev/null; then
    MONGO_VERSION=$(mongod --version | head -n 1)
    echo "$SUCCESS MongoDB installed"
    
    # Check if MongoDB is running
    echo -n "Checking MongoDB status... "
    if pgrep -x "mongod" > /dev/null; then
        echo "$SUCCESS MongoDB is running"
    else
        echo "$WARNING MongoDB is not running"
        echo "   Start MongoDB to use the application"
    fi
else
    echo "$WARNING MongoDB not found in PATH"
    echo "   Install MongoDB or use Docker"
fi

# Check Docker (optional)
echo -n "Checking Docker... "
if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version)
    echo "$SUCCESS $DOCKER_VERSION"
    
    # Check Docker Compose
    echo -n "Checking Docker Compose... "
    if command -v docker-compose &> /dev/null; then
        COMPOSE_VERSION=$(docker-compose --version)
        echo "$SUCCESS $COMPOSE_VERSION"
    else
        echo "$WARNING Docker Compose not found"
    fi
else
    echo "$WARNING Docker not found (optional)"
fi

echo ""
echo "======================================"
echo "  Checking Project Dependencies      "
echo "======================================"
echo ""

# Check backend dependencies
echo -n "Backend dependencies... "
if [ -d "backend/node_modules" ]; then
    echo "$SUCCESS Installed"
else
    echo "$FAIL Not installed"
    echo "   Run: cd backend && npm install"
fi

# Check frontend dependencies
echo -n "Frontend dependencies... "
if [ -d "frontend/node_modules" ]; then
    echo "$SUCCESS Installed"
else
    echo "$FAIL Not installed"
    echo "   Run: cd frontend && npm install"
fi

# Check environment files
echo -n "Backend .env file... "
if [ -f "backend/.env" ]; then
    echo "$SUCCESS Present"
else
    echo "$WARNING Not found"
    echo "   Create backend/.env with required variables"
fi

echo ""
echo "======================================"
echo "  Recommendation                      "
echo "======================================"
echo ""

if command -v docker &> /dev/null && command -v docker-compose &> /dev/null; then
    echo "🐳 Docker is available! Recommended command:"
    echo "   docker-compose up"
    echo ""
elif command -v node &> /dev/null && command -v mongod &> /dev/null; then
    echo "💻 Local setup is available! Recommended command:"
    echo "   ./start.sh"
    echo ""
else
    echo "⚠️  Please install missing prerequisites above"
fi

echo "For detailed setup instructions, see:"
echo "  - README.md (quick start)"
echo "  - DEPLOYMENT.md (full deployment guide)"
echo ""
