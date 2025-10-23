#!/bin/bash

# CollabTrack Setup Script
echo "🚀 Setting up CollabTrack Project Management Platform..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18 or higher is required. Current version: $(node -v)"
    exit 1
fi

print_success "Node.js $(node -v) is installed"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    print_warning "PostgreSQL is not installed. You'll need to install it or use Docker."
    print_status "You can install PostgreSQL from: https://www.postgresql.org/download/"
fi

# Setup Backend
print_status "Setting up backend..."
cd backend

# Install backend dependencies
print_status "Installing backend dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    print_status "Creating .env file..."
    cp env.example .env
    print_warning "Please edit backend/.env file with your database configuration"
fi

# Setup Frontend
print_status "Setting up frontend..."
cd ..

# Install frontend dependencies
print_status "Installing frontend dependencies..."
npm install

# Create .env.local file if it doesn't exist
if [ ! -f .env.local ]; then
    print_status "Creating .env.local file..."
    echo "REACT_APP_API_URL=http://localhost:5000/api" > .env.local
fi

print_success "Setup completed!"

echo ""
echo "📋 Next Steps:"
echo "1. Configure your database in backend/.env"
echo "2. Run database migrations: cd backend && npm run migrate"
echo "3. Seed the database: cd backend && npm run seed"
echo "4. Start the backend: cd backend && npm run dev"
echo "5. Start the frontend: npm start"
echo ""
echo "🌐 Access the application:"
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:5000"
echo ""
echo "🔐 Demo Accounts:"
echo "Admin: admin@collabtrack.com / password123"
echo "Project Manager: pm@collabtrack.com / password123"
echo "Team Member: member@collabtrack.com / password123"
echo ""
echo "📚 For more information, see README.md"
