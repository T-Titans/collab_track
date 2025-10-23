@echo off
echo 🚀 Setting up CollabTrack Project Management Platform...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js 18 or higher.
    pause
    exit /b 1
)

echo [SUCCESS] Node.js is installed

REM Setup Backend
echo [INFO] Setting up backend...
cd backend

REM Install backend dependencies
echo [INFO] Installing backend dependencies...
call npm install

REM Create .env file if it doesn't exist
if not exist .env (
    echo [INFO] Creating .env file...
    copy env.example .env
    echo [WARNING] Please edit backend\.env file with your database configuration
)

REM Setup Frontend
echo [INFO] Setting up frontend...
cd ..

REM Install frontend dependencies
echo [INFO] Installing frontend dependencies...
call npm install

REM Create .env.local file if it doesn't exist
if not exist .env.local (
    echo [INFO] Creating .env.local file...
    echo REACT_APP_API_URL=http://localhost:5000/api > .env.local
)

echo [SUCCESS] Setup completed!

echo.
echo 📋 Next Steps:
echo 1. Configure your database in backend\.env
echo 2. Run database migrations: cd backend ^&^& npm run migrate
echo 3. Seed the database: cd backend ^&^& npm run seed
echo 4. Start the backend: cd backend ^&^& npm run dev
echo 5. Start the frontend: npm start
echo.
echo 🌐 Access the application:
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:5000
echo.
echo 🔐 Demo Accounts:
echo Admin: admin@collabtrack.com / password123
echo Project Manager: pm@collabtrack.com / password123
echo Team Member: member@collabtrack.com / password123
echo.
echo 📚 For more information, see README.md
pause
