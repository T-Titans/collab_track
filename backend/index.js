require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const User = require('./models/User');
const Project = require('./models/Project');
const Task = require('./models/Task');

const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret';

app.use(cors({ origin: FRONTEND_URL, allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  dbName: process.env.DB_NAME || undefined
}).then(() => console.log('MongoDB connected')).catch((err) => console.error('MongoDB connection error:', err));

function sanitizeUser(user) {
  if (!user) return null;
  const obj = user.toObject ? user.toObject() : user;
  const { password, __v, _id, ...rest } = obj;
  // expose an `id` string to keep response shapes consistent with other endpoints
  if (_id) rest.id = _id.toString();
  return rest;
}

function generateToken(user) {
  return jwt.sign({ id: user._id.toString(), role: user.role }, JWT_SECRET, { expiresIn: '1h' });
}

function verifyToken(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Missing token' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

app.get('/api/health', (req, res) => res.json({ ok: true }));

// Auth
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: 'Missing email or password' });
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid email or password' });
    const token = generateToken(user);
    return res.json({ user: sanitizeUser(user), accessToken: token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'User already exists' });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role: 'team_member' });
    const token = generateToken(user);
    return res.json({ user: sanitizeUser(user), accessToken: token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/auth/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json({ user: sanitizeUser(user) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Users (protected)
app.get('/api/users', verifyToken, async (req, res) => {
  try {
    const users = await User.find();
    return res.json({ users: users.map(sanitizeUser) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Update User (admin only)
app.put('/api/users/:id', verifyToken, async (req, res) => {
  try {
    if (req.userRole !== 'admin') return res.status(403).json({ message: 'Forbidden: Admins only' });
    const { id } = req.params;
    const payload = req.body || {};
    const updated = await User.findByIdAndUpdate(id, payload, { new: true });
    if (!updated) return res.status(404).json({ message: 'User not found' });
    return res.json({ user: sanitizeUser(updated) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Delete User (admin only)
app.delete('/api/users/:id', verifyToken, async (req, res) => {
  try {
    if (req.userRole !== 'admin') return res.status(403).json({ message: 'Forbidden: Admins only' });
    const { id } = req.params;
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'User not found' });
    return res.json({ message: 'User deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Projects
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find();
    const mapped = projects.map((p) => ({
      id: p._id ? p._id.toString() : undefined,
      title: p.title,
      description: p.description || '',
      status: p.status || 'active',
      deadline: p.deadline ? (p.deadline instanceof Date ? p.deadline.toISOString().split('T')[0] : p.deadline) : undefined,
      members: p.members || 0,
      tasks: p.tasks || 0,
      createdAt: p.createdAt
    }));
    return res.json({ projects: mapped });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Create Project
app.post('/api/projects', verifyToken, async (req, res) => {
  try {
    const payload = req.body || {};
    if (!payload.title) return res.status(400).json({ message: 'Missing project title' });
    const projectData = {
      title: payload.title,
      description: payload.description || '',
      status: payload.status || 'active',
      deadline: payload.deadline ? new Date(payload.deadline) : undefined,
      members: payload.members || 0,
      tasks: payload.tasks || 0
    };
    const created = await Project.create(projectData);
    return res.status(201).json({ project: created });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Update Project
app.put('/api/projects/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body || {};
    const updated = await Project.findByIdAndUpdate(id, payload, { new: true });
    if (!updated) return res.status(404).json({ message: 'Project not found' });
    return res.json({ project: updated });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Delete Project
app.delete('/api/projects/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Project.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Project not found' });
    return res.json({ message: 'Project deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find().populate('assignedTo', 'name').populate('project', 'title');
    const mapped = tasks.map((t) => ({
      id: t._id.toString(),
      title: t.title,
      description: t.description,
      status: t.status,
      priority: t.priority,
      dueDate: t.dueDate ? t.dueDate.toISOString().split('T')[0] : undefined,
      assignedTo: t.assignedTo ? t.assignedTo.name : null,
      project: t.project ? t.project.title : null,
      createdAt: t.createdAt
    }));
    return res.json({ tasks: mapped });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Serve React build in production (frontend now lives in ../frontend)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'));
  });
}

app.get('/api/tasks/:id', async (req, res) => {
  try {
    const t = await Task.findById(req.params.id).populate('assignedTo', 'name email').populate('project', 'title');
    if (!t) return res.status(404).json({ message: 'Task not found' });
    const mapped = {
      id: t._id.toString(),
      title: t.title,
      description: t.description,
      status: t.status,
      priority: t.priority,
      dueDate: t.dueDate ? t.dueDate.toISOString().split('T')[0] : undefined,
      assignedTo: t.assignedTo ? t.assignedTo.name : null,
      project: t.project ? t.project.title : null,
      createdAt: t.createdAt
    };
    return res.json({ task: mapped });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/tasks', verifyToken, async (req, res) => {
  try {
    const payload = req.body || {};
    const taskData = {
      title: payload.title || 'Untitled',
      description: payload.description || '',
      status: payload.status || 'backlog',
      priority: payload.priority || 'medium',
      dueDate: payload.dueDate ? new Date(payload.dueDate) : undefined,
      assignedTo: payload.assignedTo || undefined,
      project: payload.project || undefined
    };
    const created = await Task.create(taskData);
    const t = await Task.findById(created._id).populate('assignedTo', 'name').populate('project', 'title');
    const mapped = {
      id: t._id.toString(),
      title: t.title,
      description: t.description,
      status: t.status,
      priority: t.priority,
      dueDate: t.dueDate ? t.dueDate.toISOString().split('T')[0] : undefined,
      assignedTo: t.assignedTo ? t.assignedTo.name : null,
      project: t.project ? t.project.title : null,
      createdAt: t.createdAt
    };
    return res.status(201).json({ task: mapped });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Update Task
app.put('/api/tasks/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body || {};
    const updated = await Task.findByIdAndUpdate(id, payload, { new: true }).populate('assignedTo', 'name').populate('project', 'title');
    if (!updated) return res.status(404).json({ message: 'Task not found' });
    const mapped = {
      id: updated._id.toString(),
      title: updated.title,
      description: updated.description,
      status: updated.status,
      priority: updated.priority,
      dueDate: updated.dueDate ? updated.dueDate.toISOString().split('T')[0] : undefined,
      assignedTo: updated.assignedTo ? updated.assignedTo.name : null,
      project: updated.project ? updated.project.title : null,
      createdAt: updated.createdAt
    };
    return res.json({ task: mapped });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Delete Task
app.delete('/api/tasks/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Task.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Task not found' });
    return res.json({ message: 'Task deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

app.use((req, res) => res.status(404).json({ message: 'Not Found' }));

app.listen(PORT, () => {
  console.log(`CollabTrack server running on http://localhost:${PORT}/api`);
});
