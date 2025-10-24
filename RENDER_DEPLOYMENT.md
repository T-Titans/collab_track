# CollabTrack - Render Deployment Guide

This guide will help you deploy your CollabTrack project on Render.

## 🚀 Prerequisites

1. **Render Account**: Sign up at [render.com](https://render.com)
2. **MongoDB Atlas**: Free cluster for database
3. **GitHub Repository**: Your code should be pushed to GitHub

## 📋 Step-by-Step Deployment

### **Step 1: Set Up MongoDB Atlas**

1. **Create MongoDB Atlas Account**
   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for a free account

2. **Create a Cluster**
   - Click "Build a Database"
   - Choose "FREE" tier (M0)
   - Select a region close to you
   - Name your cluster (e.g., "collabtrack")

3. **Create Database User**
   - Go to "Database Access" → "Add New Database User"
   - Username: `collabtrack`
   - Password: Generate a strong password (save this!)
   - Database User Privileges: "Read and write to any database"

4. **Whitelist IP Addresses**
   - Go to "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Or add specific IPs for better security

5. **Get Connection String**
   - Go to "Database" → "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `collabtrack`

**Example connection string:**
```
mongodb+srv://collabtrack:yourpassword@cluster0.xxxxx.mongodb.net/collabtrack?retryWrites=true&w=majority
```

### **Step 2: Deploy Backend on Render**

1. **Create New Web Service**
   - Go to [render.com/dashboard](https://render.com/dashboard)
   - Click "New" → "Web Service"
   - Connect your GitHub repository

2. **Configure Backend Service**
   - **Name**: `collabtrack-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Free

3. **Set Environment Variables**
   - Go to "Environment" tab
   - Add these variables:
     ```
     NODE_ENV=production
     MONGO_URI=mongodb+srv://collabtrack:yourpassword@cluster0.xxxxx.mongodb.net/collabtrack?retryWrites=true&w=majority
     JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
     FRONTEND_URL=https://collabtrack-frontend.onrender.com
     ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note the backend URL (e.g., `https://collabtrack-backend.onrender.com`)

### **Step 3: Deploy Frontend on Render**

1. **Create New Static Site**
   - Go to [render.com/dashboard](https://render.com/dashboard)
   - Click "New" → "Static Site"
   - Connect your GitHub repository

2. **Configure Frontend Service**
   - **Name**: `collabtrack-frontend`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/build`
   - **Plan**: Free

3. **Set Environment Variables**
   - Go to "Environment" tab
   - Add this variable:
     ```
     REACT_APP_API_URL=https://collabtrack-backend.onrender.com/api
     ```

4. **Deploy**
   - Click "Create Static Site"
   - Wait for deployment to complete
   - Note the frontend URL (e.g., `https://collabtrack-frontend.onrender.com`)

### **Step 4: Update Backend Environment**

1. **Update Backend Environment Variables**
   - Go to your backend service on Render
   - Update `FRONTEND_URL` to your actual frontend URL
   - Redeploy if necessary

### **Step 5: Seed the Database**

1. **Connect to Your Backend**
   - Go to your backend service on Render
   - Click "Shell" tab
   - Run: `cd backend && npm run seed`

2. **Verify Database**
   - Check MongoDB Atlas dashboard
   - You should see collections: users, projects, tasks

## 🔧 Alternative: Single Service Deployment

If you prefer to deploy as a single service:

1. **Create Web Service**
   - **Build Command**: `npm run install-all && npm run build`
   - **Start Command**: `npm start`

2. **Environment Variables**
   ```
   NODE_ENV=production
   MONGO_URI=mongodb+srv://collabtrack:yourpassword@cluster0.xxxxx.mongodb.net/collabtrack?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-here
   FRONTEND_URL=https://your-app.onrender.com
   ```

## 🧪 Testing Your Deployment

1. **Visit Your Frontend URL**
   - Should load the CollabTrack application
   - Try logging in with demo credentials

2. **Test Demo Credentials**
   - Admin: `admin@collabtrack.com` / `password123`
   - Project Manager: `pm@collabtrack.com` / `password123`
   - Team Member: `member@collabtrack.com` / `password123`

3. **Test Features**
   - Create projects
   - Add tasks
   - Test drag & drop
   - Check dashboard statistics

## 🚨 Troubleshooting

### **Common Issues**

1. **Build Failures**
   - Check build logs in Render dashboard
   - Ensure all dependencies are in package.json
   - Verify Node.js version compatibility

2. **Database Connection Issues**
   - Verify MongoDB Atlas connection string
   - Check IP whitelist in MongoDB Atlas
   - Ensure database user has correct permissions

3. **CORS Errors**
   - Verify FRONTEND_URL environment variable
   - Check that URLs match exactly

4. **Environment Variables**
   - Double-check all environment variables are set
   - Ensure no typos in variable names
   - Verify MongoDB connection string format

### **Debug Commands**

```bash
# Check environment variables
echo $MONGO_URI
echo $JWT_SECRET

# Test database connection
node -e "require('./backend/models/User'); console.log('DB connected')"

# Check if frontend builds
cd frontend && npm run build
```

## 📊 Monitoring

1. **Render Dashboard**
   - Monitor service health
   - Check logs for errors
   - View metrics and usage

2. **MongoDB Atlas**
   - Monitor database performance
   - Check connection metrics
   - View query performance

## 🔄 Updates and Maintenance

1. **Code Updates**
   - Push changes to GitHub
   - Render will auto-deploy
   - Monitor deployment logs

2. **Database Backups**
   - MongoDB Atlas provides automatic backups
   - Configure backup retention as needed

3. **Scaling**
   - Free tier has limitations
   - Upgrade to paid plans for production use
   - Consider database scaling options

## 🎉 Success!

Once deployed, your CollabTrack application will be live and accessible to users worldwide!

**Your URLs will be:**
- Frontend: `https://collabtrack-frontend.onrender.com`
- Backend API: `https://collabtrack-backend.onrender.com/api`

## 📞 Support

If you encounter issues:
1. Check Render service logs
2. Verify environment variables
3. Test database connectivity
4. Review this guide for common solutions
