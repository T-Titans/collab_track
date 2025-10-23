import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { SocketProvider } from './context/SocketContext';
import ProtectedRoute from './components/ProtectedRoute';

import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import TasksWithDnD from './pages/TasksWithDnD';
import TasksNew from './pages/TasksNew';
import TaskDetail from './pages/TaskDetail';
import Team from './pages/Team';
import Users from './pages/Users';
import Settings from './pages/Settings';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <SocketProvider>
          <Router>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Routes with Layout */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/projects" 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Projects />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/tasks" 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <TasksNew />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/tasks/:taskId" 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <TaskDetail />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/team" 
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <Layout>
                      <Team />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/users" 
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <Layout>
                      <Users />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Settings />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              
              {/* Default redirect */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              {/* 404 fallback */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
          </Router>
        </SocketProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;