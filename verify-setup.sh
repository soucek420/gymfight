#!/bin/bash

# Gym Fight - Web Project Verification Script

echo "======================================"
echo "  Gym Fight Web Project Verification "
echo "======================================"
echo ""

SUCCESS="✅"
FAIL="❌"
WARNING="⚠️ "
PASS=0
FAIL_COUNT=0

# Test 1: Check project structure
echo -n "1. Checking project structure... "
if [ -d "backend" ] && [ -d "frontend" ] && [ -f "docker-compose.yml" ]; then
    echo "$SUCCESS"
    PASS=$((PASS + 1))
else
    echo "$FAIL"
    FAIL_COUNT=$((FAIL_COUNT + 1))
fi

# Test 2: Check backend files
echo -n "2. Checking backend files... "
if [ -f "backend/package.json" ] && [ -f "backend/server.js" ] && [ -f "backend/.env" ]; then
    echo "$SUCCESS"
    PASS=$((PASS + 1))
else
    echo "$FAIL Missing critical backend files"
    FAIL_COUNT=$((FAIL_COUNT + 1))
fi

# Test 3: Check frontend files
echo -n "3. Checking frontend files... "
if [ -f "frontend/package.json" ] && [ -f "frontend/src/App.js" ] && [ -f "frontend/public/index.html" ]; then
    echo "$SUCCESS"
    PASS=$((PASS + 1))
else
    echo "$FAIL Missing critical frontend files"
    FAIL_COUNT=$((FAIL_COUNT + 1))
fi

# Test 4: Check Docker configuration
echo -n "4. Checking Docker setup... "
if [ -f "docker-compose.yml" ] && [ -f "backend/Dockerfile" ] && [ -f "frontend/Dockerfile" ]; then
    echo "$SUCCESS Docker files present"
    PASS=$((PASS + 1))
else
    echo "$WARNING Docker files missing (optional)"
fi

# Test 5: Check scripts
echo -n "5. Checking startup scripts... "
if [ -f "start.sh" ] && [ -x "start.sh" ] && [ -f "start-servers.bat" ]; then
    echo "$SUCCESS"
    PASS=$((PASS + 1))
else
    echo "$WARNING Some scripts missing"
fi

# Test 6: Check documentation
echo -n "6. Checking documentation... "
if [ -f "README.md" ] && [ -f "DEPLOYMENT.md" ] && [ -f "QUICKSTART.md" ]; then
    echo "$SUCCESS"
    PASS=$((PASS + 1))
else
    echo "$WARNING Some documentation missing"
fi

# Test 7: Check backend dependencies installation
echo -n "7. Checking backend dependencies... "
if [ -d "backend/node_modules" ]; then
    echo "$SUCCESS Installed"
    PASS=$((PASS + 1))
else
    echo "$WARNING Not installed (run: cd backend && npm install)"
fi

# Test 8: Check frontend dependencies installation
echo -n "8. Checking frontend dependencies... "
if [ -d "frontend/node_modules" ]; then
    echo "$SUCCESS Installed"
    PASS=$((PASS + 1))
else
    echo "$WARNING Not installed (run: cd frontend && npm install)"
fi

# Test 9: Check .gitignore files
echo -n "9. Checking .gitignore files... "
if [ -f ".gitignore" ] && [ -f "backend/.gitignore" ] && [ -f "frontend/.gitignore" ]; then
    echo "$SUCCESS"
    PASS=$((PASS + 1))
else
    echo "$WARNING Some .gitignore files missing"
fi

# Test 10: Test frontend build
echo -n "10. Testing frontend build... "
if [ -d "frontend/build" ]; then
    echo "$SUCCESS Build exists"
    PASS=$((PASS + 1))
else
    echo "$WARNING Build not found (run: cd frontend && npm run build)"
fi

# Test 11: Check environment configuration
echo -n "11. Checking environment variables... "
if grep -q "PORT" backend/.env && grep -q "MONGO_URI" backend/.env && grep -q "JWT_SECRET" backend/.env; then
    echo "$SUCCESS Backend .env configured"
    PASS=$((PASS + 1))
else
    echo "$WARNING Backend .env may need configuration"
fi

# Test 12: Check proxy configuration
echo -n "12. Checking frontend proxy... "
if grep -q '"proxy"' frontend/package.json; then
    echo "$SUCCESS Proxy configured"
    PASS=$((PASS + 1))
else
    echo "$FAIL Proxy not configured"
    FAIL_COUNT=$((FAIL_COUNT + 1))
fi

echo ""
echo "======================================"
echo "  Test Results                       "
echo "======================================"
echo ""
echo "Passed: $PASS tests"
echo "Warnings: $((12 - PASS - FAIL_COUNT)) tests"
echo "Failed: $FAIL_COUNT tests"
echo ""

if [ $FAIL_COUNT -eq 0 ]; then
    echo "$SUCCESS All critical checks passed!"
    echo ""
    echo "Your Gym Fight web project is ready to run!"
    echo ""
    echo "Quick start options:"
    echo "  1. Docker:       docker-compose up"
    echo "  2. Auto script:  ./start.sh"
    echo "  3. Manual:       npm run dev"
    echo ""
    exit 0
else
    echo "$FAIL Some critical checks failed"
    echo "Please fix the issues above before running the application."
    echo ""
    exit 1
fi
