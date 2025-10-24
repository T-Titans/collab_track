# 🚀 Frontend Deployment Guide for CollabTrack

## **Deploy Frontend to Render**

Now that your backend is live at `https://collab-track-rjjs.onrender.com`, let's deploy the frontend:

### **Step 1: Create New Static Site on Render**

1. **Go to [Render Dashboard](https://dashboard.render.com)**
2. **Click "New" → "Static Site"**
3. **Connect your GitHub repository** (same repo as backend)
4. **Configure the service:**

   **Basic Settings:**
   - **Name**: `collabtrack-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`
   - **Instance Type**: Free

   **Environment Variables:**
   - `REACT_APP_API_URL`: `https://collab-track-rjjs.onrender.com/api`

### **Step 2: Deploy**

1. **Click "Create Static Site"**
2. **Wait for deployment to complete** (usually 2-3 minutes)
3. **Your frontend will be available at**: `https://collabtrack-frontend.onrender.com`

### **Step 3: Update Backend CORS (if needed)**

If you get CORS errors, update your backend environment variables on Render:

1. **Go to your backend service** (`collab-track-rjjs`)
2. **Environment tab**
3. **Update `FRONTEND_URL`** to your new frontend URL:
   ```
   FRONTEND_URL=https://collabtrack-frontend.onrender.com
   ```
4. **Redeploy the backend**

### **Step 4: Test Your Full Application**

1. **Visit your frontend URL**: `https://collabtrack-frontend.onrender.com`
2. **Try logging in with demo credentials:**
   - **Admin**: `admin@collabtrack.com` / `password123`
   - **Project Manager**: `pm@collabtrack.com` / `password123`
   - **Team Member**: `member@collabtrack.com` / `password123`

## **🎯 What Should Work**

Once deployed, your full-stack application should:
- ✅ Load the React frontend
- ✅ Connect to your live backend API
- ✅ Allow user registration and login
- ✅ Display dashboard with real data
- ✅ Show projects and tasks
- ✅ Support all user roles and permissions
- ✅ Handle real-time updates (WebSocket)

## **🔧 Troubleshooting**

**If you get CORS errors:**
- Check that `FRONTEND_URL` in backend matches your frontend URL
- Ensure both services are deployed and running

**If API calls fail:**
- Verify `REACT_APP_API_URL` is set correctly in frontend
- Check that backend is running and accessible

**If build fails:**
- Check the build logs in Render
- Ensure all dependencies are installed correctly

## **📱 Final URLs**

- **Frontend**: `https://collabtrack-frontend.onrender.com`
- **Backend API**: `https://collab-track-rjjs.onrender.com/api`
- **Full Application**: Use the frontend URL

Your CollabTrack application will be fully deployed and ready to use! 🎉
