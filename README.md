# CollabTrack - Collaborative Project Management Tool

A full-stack project management application built with React, Node.js, Express, and MongoDB.

## 🚀 Features

- **User Management**: Role-based access control (Admin, Project Manager, Team Member)
- **Project Management**: Create, update, and track projects
- **Task Management**: Drag & drop task management with priorities and due dates
- **Team Collaboration**: Real-time updates and team member management
- **Dashboard**: Real-time statistics and project overview
- **Theme Support**: Dark/Light mode with modern UI

## 🛠️ Tech Stack

### Frontend
- React 19 with TypeScript
- React Router v7
- Axios for API calls
- Custom UI components with theme support
- Drag & Drop functionality

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT Authentication
- bcrypt for password hashing
- CORS enabled

## 📋 Prerequisites

- Node.js (>=18.0.0)
- npm (>=8.0.0)
- MongoDB Atlas account (or local MongoDB)

## 🚀 Quick Start

### 1. Clone and Install Dependencies

```bash
# Install all dependencies (root, backend, frontend)
npm run install-all
```

### 2. Environment Setup

#### Backend Environment
Create `backend/.env`:
```env
# Database
MONGO_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/collabtrack?retryWrites=true&w=majority&appName=YourCluster
DB_NAME=collabtrack

# JWT
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production

# Server
PORT=5000
NODE_ENV=development

# CORS
FRONTEND_URL=http://localhost:3000
```

#### Frontend Environment
Create `frontend/.env`:
```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000/api

# Build Configuration
GENERATE_SOURCEMAP=false
```

### 3. Database Setup

```bash
# Seed the database with sample data
npm run backend:seed
```

### 4. Start Development Servers

```bash
# Start both backend and frontend in development mode
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend React app on `http://localhost:3000`

## 🔐 Demo Credentials

- **Admin**: `admin@collabtrack.com` / `password123`
- **Project Manager**: `pm@collabtrack.com` / `password123`
- **Team Member**: `member@collabtrack.com` / `password123`

## 📁 Project Structure

```
collabtrack/
├── backend/                 # Node.js/Express API
│   ├── models/             # MongoDB models
│   ├── index.js           # Main server file
│   ├── seed.js            # Database seeding
│   └── package.json
├── frontend/               # React TypeScript app
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React contexts
│   │   ├── lib/            # Utilities and API
│   │   └── types/          # TypeScript types
│   └── package.json
├── package.json            # Root package.json
└── README.md
```

## 🚀 Deployment

### Heroku Deployment

1. **Create Heroku App**:
```bash
heroku create your-app-name
```

2. **Set Environment Variables**:
```bash
heroku config:set MONGO_URI=your_mongodb_atlas_connection_string
heroku config:set JWT_SECRET=your_jwt_secret
heroku config:set NODE_ENV=production
```

3. **Deploy**:
```bash
git push heroku main
```

4. **Seed Database**:
```bash
heroku run npm run backend:seed
```

### Other Platforms

The app can be deployed to any platform that supports Node.js:
- Vercel
- Netlify
- Railway
- DigitalOcean App Platform

## 🔧 Available Scripts

- `npm run install-all` - Install all dependencies
- `npm run dev` - Start development servers
- `npm run backend:dev` - Start backend only
- `npm run frontend:dev` - Start frontend only
- `npm run backend:seed` - Seed database
- `npm run build` - Build for production
- `npm start` - Start production server

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**:
   - Check your MongoDB Atlas connection string
   - Ensure your IP is whitelisted in MongoDB Atlas

2. **CORS Errors**:
   - Verify `FRONTEND_URL` in backend `.env`
   - Check that frontend is running on the correct port

3. **Authentication Issues**:
   - Clear browser localStorage
   - Check JWT_SECRET is set correctly

## 📝 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Users
- `GET /api/users` - Get all users (Admin only)
- `PUT /api/users/:id` - Update user (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions, please open an issue on GitHub.
