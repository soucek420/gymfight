#!/bin/bash

# Gym Fight Production Build Script

echo "======================================"
echo "   Building Gym Fight for Production "
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}✅ Node.js found: $(node -v)${NC}"
echo ""

# Install backend dependencies
echo -e "${YELLOW}📦 Installing backend dependencies...${NC}"
cd backend
npm install --production
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Backend installation failed${NC}"
    exit 1
fi
cd ..
echo -e "${GREEN}✅ Backend dependencies installed${NC}"
echo ""

# Install frontend dependencies
echo -e "${YELLOW}📦 Installing frontend dependencies...${NC}"
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Frontend installation failed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Frontend dependencies installed${NC}"
echo ""

# Build frontend
echo -e "${YELLOW}🔨 Building frontend for production...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Frontend build failed${NC}"
    exit 1
fi
cd ..
echo -e "${GREEN}✅ Frontend built successfully${NC}"
echo ""

# Create logs directory if it doesn't exist
mkdir -p logs

echo "======================================"
echo -e "${GREEN}   Build Complete! 🎉${NC}"
echo "======================================"
echo ""
echo "Frontend build is in: frontend/build/"
echo ""
echo "Deployment options:"
echo "  1. Serve frontend with Nginx (see nginx.conf.template)"
echo "  2. Start backend with PM2: pm2 start ecosystem.config.js --env production"
echo "  3. Or deploy to cloud platforms (Heroku, Vercel, etc.)"
echo ""
echo "Don't forget to:"
echo "  - Set production environment variables"
echo "  - Configure MongoDB connection"
echo "  - Set up SSL/HTTPS"
echo "  - Configure domain and DNS"
echo ""
