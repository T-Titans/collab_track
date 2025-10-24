#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 CollabTrack Setup Script');
console.log('============================\n');

// Check if Node.js version is compatible
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (majorVersion < 18) {
  console.error('❌ Node.js version 18 or higher is required');
  console.error(`Current version: ${nodeVersion}`);
  process.exit(1);
}

console.log(`✅ Node.js version: ${nodeVersion}`);

// Create environment files if they don't exist
const backendEnvPath = path.join(__dirname, 'backend', '.env');
const frontendEnvPath = path.join(__dirname, 'frontend', '.env');

if (!fs.existsSync(backendEnvPath)) {
  console.log('📝 Creating backend/.env file...');
  fs.writeFileSync(backendEnvPath, `# Database
MONGO_URI=mongodb+srv://collab-track:Password123@cluster0.dkjevxo.mongodb.net/collabtrack?retryWrites=true&w=majority&appName=Cluster0
DB_NAME=collabtrack

# JWT
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production

# Server
PORT=5000
NODE_ENV=development

# CORS
FRONTEND_URL=http://localhost:3000
`);
  console.log('✅ Backend .env file created');
} else {
  console.log('✅ Backend .env file already exists');
}

if (!fs.existsSync(frontendEnvPath)) {
  console.log('📝 Creating frontend/.env file...');
  fs.writeFileSync(frontendEnvPath, `# API Configuration
REACT_APP_API_URL=http://localhost:5000/api

# Build Configuration
GENERATE_SOURCEMAP=false
`);
  console.log('✅ Frontend .env file created');
} else {
  console.log('✅ Frontend .env file already exists');
}

// Install dependencies
console.log('\n📦 Installing dependencies...');
try {
  console.log('Installing root dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  console.log('Installing backend dependencies...');
  execSync('cd backend && npm install', { stdio: 'inherit' });
  
  console.log('Installing frontend dependencies...');
  execSync('cd frontend && npm install', { stdio: 'inherit' });
  
  console.log('✅ All dependencies installed successfully');
} catch (error) {
  console.error('❌ Error installing dependencies:', error.message);
  process.exit(1);
}

console.log('\n🎉 Setup completed successfully!');
console.log('\n📋 Next steps:');
console.log('1. Update the MongoDB connection string in backend/.env');
console.log('2. Run: npm run backend:seed (to seed the database)');
console.log('3. Run: npm run dev (to start both servers)');
console.log('\n🔐 Demo credentials:');
console.log('- Admin: admin@collabtrack.com / password123');
console.log('- Project Manager: pm@collabtrack.com / password123');
console.log('- Team Member: member@collabtrack.com / password123');
