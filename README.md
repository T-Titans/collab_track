# CollabTrack - Project Management & Collaboration Platform

A modern, full-stack project management and team collaboration platform built with React, TypeScript, Node.js, Express, and PostgreSQL. CollabTrack provides teams with powerful tools to manage projects, track tasks, collaborate through comments, and monitor progress in real-time.

## 🚀 Features

### Core Features (MVP)
- **👥 User Roles & Authentication**
  - Admin, Project Manager, and Team Member roles
  - JWT-based authentication with secure password hashing
  - Role-based access control and permissions

- **📁 Project Management**
  - Create and manage projects with deadlines
  - Invite team members to projects
  - Project status tracking (Active, Archived, Completed)
  - Project progress analytics

- **📌 Task Management**
  - Create tasks with titles, descriptions, priorities, and due dates
  - Assign tasks to team members
  - Kanban-style board with drag-and-drop functionality
  - Task status tracking (Backlog, To Do, In Progress, Done)
  - Priority levels (Low, Medium, High, Urgent)

- **💬 Collaboration**
  - Task comments with real-time updates
  - File attachments for tasks
  - Real-time notifications
  - Team member management

- **🧭 Dashboard**
  - Overview of user's tasks across all projects
  - Project progress visualization
  - Team activity monitoring
  - Analytics and insights

### Bonus Features
- **⚡ Real-time Updates**
  - WebSocket integration for live collaboration
  - Real-time task updates and comments
  - Live typing indicators

- **📎 File Management**
  - File uploads and attachments
  - Support for multiple file types
  - Secure file storage

- **🔔 Notification System**
  - In-app notifications for task updates
  - Email notifications (configurable)
  - Unread notification tracking

- **⏱️ Time Tracking**
  - Time logging for tasks
  - Time estimation and tracking
  - Productivity analytics

- **🌙 Modern UI/UX**
  - Dark/Light mode toggle
  - Responsive design
  - Modern, intuitive interface
  - Accessibility support

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with hooks
- **TypeScript** - Type-safe development
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **@dnd-kit** - Drag and drop functionality
- **Socket.io Client** - Real-time communication
- **Axios** - HTTP client
- **Lucide React** - Beautiful icons

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **TypeScript** - Type-safe backend development
- **Prisma** - Modern database ORM
- **PostgreSQL** - Robust relational database
- **JWT** - Authentication tokens
- **Socket.io** - Real-time WebSocket communication
- **Multer** - File upload handling
- **Bcrypt** - Password hashing
- **Zod** - Schema validation

### DevOps & Deployment
- **Docker** - Containerization
- **Vercel/Netlify** - Frontend deployment
- **Railway/Render** - Backend deployment
- **GitHub Actions** - CI/CD pipeline

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** (v13 or higher)
- **Git**

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/collabtrack.git
cd collabtrack
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Set up environment variables
cp env.example .env

# Edit .env file with your configuration
# DATABASE_URL="postgresql://username:password@localhost:5432/collabtrack"
# JWT_SECRET="your-super-secret-jwt-key"
# FRONTEND_URL="http://localhost:3000"

# Set up the database
npx prisma migrate dev
npx prisma generate

# Start the development server
npm run dev
```

The backend will be running on `http://localhost:5000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory (root)
cd ..

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Edit .env.local file
# REACT_APP_API_URL=http://localhost:5000/api

# Start the development server
npm start
```

The frontend will be running on `http://localhost:3000`

## 🗄️ Database Schema

The application uses PostgreSQL with the following main entities:

- **Users** - User accounts with roles and authentication
- **Projects** - Project containers with metadata
- **ProjectMembers** - Many-to-many relationship between users and projects
- **Tasks** - Individual work items with status and priority
- **Comments** - Task discussions and collaboration
- **Attachments** - File uploads linked to tasks
- **Notifications** - User notifications and alerts
- **TimeEntries** - Time tracking for tasks
- **ProjectInvites** - Project invitation system

## 🔐 Authentication & Authorization

### User Roles
- **Admin**: Full system access, user management, all projects
- **Project Manager**: Project management, task assignment, team oversight
- **Team Member**: Task management, project participation

### Security Features
- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation with Zod
- Rate limiting
- CORS protection
- Helmet security headers

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user
- `POST /api/auth/change-password` - Change password

### Projects
- `GET /api/projects` - Get user's projects
- `POST /api/projects` - Create project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/projects/:id/invite` - Invite user to project

### Tasks
- `GET /api/tasks` - Get user's tasks
- `POST /api/tasks` - Create task
- `GET /api/tasks/:id` - Get task details
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `POST /api/tasks/:id/time` - Add time entry

### Comments
- `GET /api/comments/task/:taskId` - Get task comments
- `POST /api/comments` - Create comment
- `PUT /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `DELETE /api/notifications/:id` - Delete notification

### File Upload
- `POST /api/upload/task/:taskId` - Upload file to task
- `DELETE /api/upload/:id` - Delete file

## 🔄 Real-time Features

The application uses Socket.io for real-time communication:

- **Task Updates**: Live task status changes
- **Comments**: Real-time comment additions
- **Project Updates**: Live project modifications
- **Typing Indicators**: See when team members are typing
- **Notifications**: Instant notification delivery

## 🚀 Deployment

### Frontend (Vercel/Netlify)

1. Connect your GitHub repository
2. Set environment variables:
   - `REACT_APP_API_URL` - Your backend API URL
3. Deploy

### Backend (Railway/Render)

1. Connect your GitHub repository
2. Set environment variables:
   - `DATABASE_URL` - PostgreSQL connection string
   - `JWT_SECRET` - Your JWT secret
   - `FRONTEND_URL` - Your frontend URL
   - `NODE_ENV` - production
3. Deploy

### Database (PostgreSQL)

Use a managed PostgreSQL service like:
- Railway PostgreSQL
- Render PostgreSQL
- Supabase
- PlanetScale

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📝 Demo Credentials

For testing purposes, you can use these demo accounts:

- **Admin**: admin@collabtrack.com / password123
- **Project Manager**: pm@collabtrack.com / password123
- **Team Member**: member@collabtrack.com / password123

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Project Goals

This project demonstrates:

- **Full-stack development** with modern technologies
- **Scalable architecture** with proper separation of concerns
- **Real-time collaboration** features
- **Role-based access control** and security
- **Modern UI/UX** with responsive design
- **Database design** with proper relationships
- **API design** with RESTful principles
- **Real-time communication** with WebSockets
- **File management** and upload handling
- **Notification systems** for user engagement

## 📞 Support

If you have any questions or need help, please:

1. Check the [Issues](https://github.com/your-username/collabtrack/issues) page
2. Create a new issue if your problem isn't already reported
3. Contact the development team

## 🙏 Acknowledgments

- React team for the amazing framework
- Prisma team for the excellent ORM
- Socket.io team for real-time capabilities
- All open-source contributors who made this project possible

---

**Built with ❤️ by the CollabTrack Team**