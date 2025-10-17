require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Project = require('./models/Project');
const Task = require('./models/Task');

async function seed() {
  const MONGO_URI = process.env.MONGO_URI;
  if (!MONGO_URI) {
    console.error('MONGO_URI not set in environment');
    process.exit(1);
  }

  await mongoose.connect(MONGO_URI, { dbName: process.env.DB_NAME || undefined });
  console.log('Connected to Mongo for seeding');

  // Clear existing data
  await User.deleteMany({});
  await Project.deleteMany({});
  await Task.deleteMany({});

  const plain = 'password123';
  const hashed = await bcrypt.hash(plain, 10);

  const admin = await User.create({ name: 'Admin User', email: 'admin@collabtrack.com', password: hashed, role: 'admin' });
  const pm = await User.create({ name: 'Project Manager', email: 'pm@collabtrack.com', password: hashed, role: 'project_manager' });
  const member = await User.create({ name: 'Team Member', email: 'member@collabtrack.com', password: hashed, role: 'team_member' });

  const p1 = await Project.create({ title: 'Website Redesign', description: 'Redesign the company website', status: 'active', members: 3, tasks: 12 });
  const p2 = await Project.create({ title: 'Mobile App Development', description: 'Build the new mobile application', status: 'active', members: 5, tasks: 8 });
  const p3 = await Project.create({ title: 'API Integration', description: 'Integrate third-party APIs', status: 'completed', members: 2, tasks: 15 });

  const tasks = [
    { title: 'Design Homepage', description: 'Create wireframes for homepage layout', status: 'todo', priority: 'high', dueDate: new Date('2024-03-15'), assignedTo: admin._id, project: p1._id },
    { title: 'API Authentication', description: 'Implement JWT authentication system', status: 'in-progress', priority: 'high', dueDate: new Date('2024-03-20'), assignedTo: pm._id, project: p2._id },
    { title: 'Database Schema', description: 'Design initial database structure', status: 'done', priority: 'medium', assignedTo: member._id, project: p3._id },
    { title: 'User Testing', description: 'Conduct usability testing sessions', status: 'backlog', priority: 'low', dueDate: new Date('2024-04-01'), assignedTo: admin._id, project: p1._id },
    { title: 'Mobile App UI Design', description: 'Design user interface for mobile application', status: 'in-progress', priority: 'high', dueDate: new Date('2024-03-25'), assignedTo: admin._id, project: p2._id },
    { title: 'API Documentation', description: 'Write comprehensive API documentation', status: 'todo', priority: 'medium', dueDate: new Date('2024-03-30'), assignedTo: member._id, project: p3._id }
  ];

  for (const t of tasks) {
    await Task.create(t);
  }

  console.log('Seed complete');
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
