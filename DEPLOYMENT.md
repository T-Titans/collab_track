# CollabTrack Deployment Guide

This guide covers deploying CollabTrack to various platforms.

## 🚀 Quick Start (Local Development)

```bash
# 1. Run the setup script
node setup.js

# 2. Update MongoDB connection string in backend/.env
# 3. Seed the database
npm run backend:seed

# 4. Start development servers
npm run dev
```

## 🌐 Production Deployment Options

### Option 1: Heroku (Recommended)

#### Prerequisites
- Heroku CLI installed
- Git repository
- MongoDB Atlas account

#### Steps

1. **Create Heroku App**:
```bash
heroku create your-collabtrack-app
```

2. **Set Environment Variables**:
```bash
heroku config:set MONGO_URI="mongodb+srv://username:password@cluster.mongodb.net/collabtrack?retryWrites=true&w=majority"
heroku config:set JWT_SECRET="your-super-secret-jwt-key"
heroku config:set NODE_ENV="production"
heroku config:set FRONTEND_URL="https://your-app.herokuapp.com"
```

3. **Deploy**:
```bash
git add .
git commit -m "Initial deployment"
git push heroku main
```

4. **Seed Database**:
```bash
heroku run npm run backend:seed
```

### Option 2: Vercel + Railway

#### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set build command: `cd frontend && npm run build`
3. Set output directory: `frontend/build`
4. Add environment variable: `REACT_APP_API_URL=https://your-backend.railway.app/api`

#### Backend (Railway)
1. Connect your GitHub repository to Railway
2. Set start command: `cd backend && npm start`
3. Add environment variables:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `NODE_ENV=production`
   - `FRONTEND_URL=https://your-frontend.vercel.app`

### Option 3: DigitalOcean App Platform

1. Create a new app in DigitalOcean
2. Connect your GitHub repository
3. Set build command: `npm run build`
4. Set run command: `npm start`
5. Add environment variables in the app settings

### Option 4: AWS/GCP/Azure

For cloud providers, you'll need to:
1. Set up a virtual machine or container service
2. Install Node.js and dependencies
3. Configure environment variables
4. Set up a reverse proxy (nginx) if needed
5. Configure SSL certificates

## 🔧 Environment Variables

### Backend (.env)
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/collabtrack?retryWrites=true&w=majority
DB_NAME=collabtrack
JWT_SECRET=your-super-secret-jwt-key-here
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
```

### Frontend (.env)
```env
REACT_APP_API_URL=https://your-backend-domain.com/api
GENERATE_SOURCEMAP=false
```

## 🗄️ Database Setup

### MongoDB Atlas (Recommended)

1. **Create MongoDB Atlas Account**
2. **Create a Cluster**
3. **Get Connection String**:
   - Go to "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password
   - Replace `<dbname>` with `collabtrack`

4. **Whitelist IP Addresses**:
   - Add `0.0.0.0/0` for all IPs (development)
   - Add specific IPs for production

5. **Create Database User**:
   - Username: `collabtrack`
   - Password: Generate a strong password
   - Database User Privileges: "Read and write to any database"

### Local MongoDB (Development Only)

```bash
# Install MongoDB locally
# macOS
brew install mongodb-community

# Ubuntu/Debian
sudo apt-get install mongodb

# Start MongoDB
mongod
```

## 🔒 Security Considerations

### Production Security Checklist

- [ ] Change default JWT secret
- [ ] Use strong MongoDB passwords
- [ ] Enable HTTPS in production
- [ ] Set up proper CORS origins
- [ ] Implement rate limiting
- [ ] Add input validation
- [ ] Use environment variables for secrets
- [ ] Regular security updates

### Environment Variables Security

```bash
# Generate secure JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Generate secure MongoDB password
openssl rand -base64 32
```

## 📊 Monitoring & Logs

### Heroku
```bash
# View logs
heroku logs --tail

# View specific app logs
heroku logs --tail --app your-app-name
```

### General Monitoring
- Set up health check endpoints
- Monitor database connections
- Track API response times
- Set up error alerting

## 🚨 Troubleshooting

### Common Deployment Issues

1. **Build Failures**:
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for TypeScript errors

2. **Database Connection Issues**:
   - Verify MongoDB connection string
   - Check IP whitelist in MongoDB Atlas
   - Ensure database user has correct permissions

3. **CORS Errors**:
   - Verify FRONTEND_URL environment variable
   - Check CORS configuration in backend

4. **Authentication Issues**:
   - Verify JWT_SECRET is set
   - Check token expiration settings
   - Clear browser cache/localStorage

### Debug Commands

```bash
# Check environment variables
heroku config

# Test database connection
heroku run node -e "require('./backend/models/User'); console.log('DB connected')"

# View build logs
heroku logs --tail --dyno web
```

## 📈 Performance Optimization

### Frontend
- Enable production builds
- Use CDN for static assets
- Implement code splitting
- Optimize images

### Backend
- Enable compression
- Implement caching
- Use connection pooling
- Monitor memory usage

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy to Heroku

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - uses: akhileshns/heroku-deploy@v3.12.12
      with:
        heroku_api_key: ${{secrets.HEROKU_API_KEY}}
        heroku_app_name: "your-app-name"
        heroku_email: "your-email@example.com"
```

## 📞 Support

If you encounter issues during deployment:

1. Check the logs for error messages
2. Verify all environment variables are set
3. Test database connectivity
4. Check platform-specific documentation
5. Open an issue on GitHub with deployment details
