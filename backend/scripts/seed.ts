import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create admin user
  const adminPassword = await bcrypt.hash('password123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@collabtrack.com' },
    update: {},
    create: {
      email: 'admin@collabtrack.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
      isActive: true
    }
  });

  // Create project manager
  const pmPassword = await bcrypt.hash('password123', 12);
  const pm = await prisma.user.upsert({
    where: { email: 'pm@collabtrack.com' },
    update: {},
    create: {
      email: 'pm@collabtrack.com',
      name: 'Project Manager',
      password: pmPassword,
      role: 'PROJECT_MANAGER',
      isActive: true
    }
  });

  // Create team members
  const memberPassword = await bcrypt.hash('password123', 12);
  const member1 = await prisma.user.upsert({
    where: { email: 'member@collabtrack.com' },
    update: {},
    create: {
      email: 'member@collabtrack.com',
      name: 'Team Member',
      password: memberPassword,
      role: 'TEAM_MEMBER',
      isActive: true
    }
  });

  const member2 = await prisma.user.upsert({
    where: { email: 'john@collabtrack.com' },
    update: {},
    create: {
      email: 'john@collabtrack.com',
      name: 'John Doe',
      password: memberPassword,
      role: 'TEAM_MEMBER',
      isActive: true
    }
  });

  const member3 = await prisma.user.upsert({
    where: { email: 'jane@collabtrack.com' },
    update: {},
    create: {
      email: 'jane@collabtrack.com',
      name: 'Jane Smith',
      password: memberPassword,
      role: 'TEAM_MEMBER',
      isActive: true
    }
  });

  // Create sample projects
  const project1 = await prisma.project.create({
    data: {
      title: 'Website Redesign',
      description: 'Complete overhaul of company website with modern design and improved user experience',
      status: 'ACTIVE',
      deadline: new Date('2024-12-31'),
      createdBy: admin.id
    }
  });

  const project2 = await prisma.project.create({
    data: {
      title: 'Mobile App Development',
      description: 'Build cross-platform mobile application for iOS and Android',
      status: 'ACTIVE',
      deadline: new Date('2024-11-30'),
      createdBy: pm.id
    }
  });

  const project3 = await prisma.project.upsert({
    where: { id: 'project-3' },
    update: {},
    create: {
      id: 'project-3',
      title: 'API Integration',
      description: 'Integrate third-party APIs and services',
      status: 'COMPLETED',
      createdBy: admin.id
    }
  });

  // Add project members
  await prisma.projectMember.upsert({
    where: { userId_projectId: { userId: admin.id, projectId: project1.id } },
    update: {},
    create: {
      userId: admin.id,
      projectId: project1.id,
      role: 'OWNER'
    }
  });

  await prisma.projectMember.upsert({
    where: { userId_projectId: { userId: member1.id, projectId: project1.id } },
    update: {},
    create: {
      userId: member1.id,
      projectId: project1.id,
      role: 'MEMBER'
    }
  });

  await prisma.projectMember.upsert({
    where: { userId_projectId: { userId: member2.id, projectId: project1.id } },
    update: {},
    create: {
      userId: member2.id,
      projectId: project1.id,
      role: 'MEMBER'
    }
  });

  await prisma.projectMember.upsert({
    where: { userId_projectId: { userId: pm.id, projectId: project2.id } },
    update: {},
    create: {
      userId: pm.id,
      projectId: project2.id,
      role: 'OWNER'
    }
  });

  await prisma.projectMember.upsert({
    where: { userId_projectId: { userId: member3.id, projectId: project2.id } },
    update: {},
    create: {
      userId: member3.id,
      projectId: project2.id,
      role: 'MEMBER'
    }
  });

  // Create sample tasks
  const task1 = await prisma.task.create({
    data: {
      title: 'Design Homepage',
      description: 'Create wireframes and mockups for the new homepage design',
      status: 'TODO',
      priority: 'HIGH',
      dueDate: new Date('2024-03-15'),
      assignedTo: member1.id,
      projectId: project1.id,
      createdBy: admin.id,
      estimatedTime: 480 // 8 hours
    }
  });

  const task2 = await prisma.task.create({
    data: {
      title: 'API Authentication',
      description: 'Implement JWT authentication system for the mobile app',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      dueDate: new Date('2024-03-20'),
      assignedTo: member3.id,
      projectId: project2.id,
      createdBy: pm.id,
      estimatedTime: 720 // 12 hours
    }
  });

  const task3 = await prisma.task.create({
    data: {
      title: 'Database Schema',
      description: 'Design and implement the initial database structure',
      status: 'DONE',
      priority: 'MEDIUM',
      assignedTo: member2.id,
      projectId: project3.id,
      createdBy: admin.id,
      estimatedTime: 600 // 10 hours
    }
  });

  const task4 = await prisma.task.create({
    data: {
      title: 'User Testing',
      description: 'Conduct usability testing sessions with target users',
      status: 'BACKLOG',
      priority: 'LOW',
      dueDate: new Date('2024-04-01'),
      assignedTo: member1.id,
      projectId: project1.id,
      createdBy: admin.id,
      estimatedTime: 240 // 4 hours
    }
  });

  // Create sample comments
  await prisma.comment.create({
    data: {
      content: 'I\'ve started working on the initial wireframes. Should have something to review by tomorrow.',
      taskId: task1.id,
      authorId: member1.id
    }
  });

  await prisma.comment.create({
    data: {
      content: 'Great! Please make sure to follow the new design system guidelines.',
      taskId: task1.id,
      authorId: admin.id
    }
  });

  await prisma.comment.create({
    data: {
      content: 'The JWT implementation is complete. Ready for testing.',
      taskId: task2.id,
      authorId: member3.id
    }
  });

  // Create sample notifications
  await prisma.notification.create({
    data: {
      type: 'TASK_ASSIGNED',
      title: 'New Task Assigned',
      message: 'You have been assigned a new task: "Design Homepage"',
      userId: member1.id,
      relatedId: task1.id
    }
  });

  await prisma.notification.create({
    data: {
      type: 'COMMENT_ADDED',
      title: 'New Comment',
      message: 'New comment added to task: "Design Homepage"',
      userId: admin.id,
      relatedId: task1.id
    }
  });

  // Create sample time entries
  await prisma.timeEntry.create({
    data: {
      description: 'Initial wireframe creation',
      duration: 120, // 2 hours
      taskId: task1.id,
      userId: member1.id
    }
  });

  await prisma.timeEntry.create({
    data: {
      description: 'JWT implementation and testing',
      duration: 180, // 3 hours
      taskId: task2.id,
      userId: member3.id
    }
  });

  console.log('✅ Database seeding completed!');
  console.log('\n📋 Demo Accounts:');
  console.log('Admin: admin@collabtrack.com / password123');
  console.log('Project Manager: pm@collabtrack.com / password123');
  console.log('Team Member: member@collabtrack.com / password123');
  console.log('John Doe: john@collabtrack.com / password123');
  console.log('Jane Smith: jane@collabtrack.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

