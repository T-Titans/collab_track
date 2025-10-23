import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  try {
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
    const member1Password = await bcrypt.hash('password123', 12);
    const member1 = await prisma.user.upsert({
      where: { email: 'member@collabtrack.com' },
      update: {},
      create: {
        email: 'member@collabtrack.com',
        name: 'Team Member',
        password: member1Password,
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

    const project3 = await prisma.project.create({
      data: {
        title: 'API Integration',
        description: 'Integrate third-party APIs and services',
        status: 'COMPLETED',
        createdBy: admin.id
      }
    });

    // Add project members
    await prisma.projectMember.create({
      data: {
        userId: admin.id,
        projectId: project1.id,
        role: 'OWNER'
      }
    });

    await prisma.projectMember.create({
      data: {
        userId: member1.id,
        projectId: project1.id,
        role: 'MEMBER'
      }
    });

    await prisma.projectMember.create({
      data: {
        userId: pm.id,
        projectId: project2.id,
        role: 'OWNER'
      }
    });

    await prisma.projectMember.create({
      data: {
        userId: member1.id,
        projectId: project2.id,
        role: 'MEMBER'
      }
    });

    // Create sample tasks
    const task1 = await prisma.task.create({
      data: {
        title: 'Design new homepage layout',
        description: 'Create wireframes and mockups for the new homepage design',
        status: 'TODO',
        priority: 'HIGH',
        dueDate: new Date('2024-10-25'),
        projectId: project1.id,
        assignedTo: member1.id,
        createdBy: admin.id
      }
    });

    const task2 = await prisma.task.create({
      data: {
        title: 'Implement user authentication',
        description: 'Set up secure user login and registration system',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        dueDate: new Date('2024-10-30'),
        projectId: project1.id,
        assignedTo: member1.id,
        createdBy: admin.id
      }
    });

    const task3 = await prisma.task.create({
      data: {
        title: 'Create mobile app wireframes',
        description: 'Design the initial wireframes for the mobile application',
        status: 'DONE',
        priority: 'MEDIUM',
        projectId: project2.id,
        assignedTo: pm.id,
        createdBy: pm.id
      }
    });

    const task4 = await prisma.task.create({
      data: {
        title: 'Set up development environment',
        description: 'Configure React Native development environment',
        status: 'TODO',
        priority: 'LOW',
        dueDate: new Date('2024-11-05'),
        projectId: project2.id,
        assignedTo: member1.id,
        createdBy: pm.id
      }
    });

    // Create some comments
    await prisma.comment.create({
      data: {
        content: 'Great progress on the design! Looking forward to the implementation.',
        taskId: task1.id,
        authorId: admin.id
      }
    });

    await prisma.comment.create({
      data: {
        content: 'I have some questions about the authentication flow. Can we discuss?',
        taskId: task2.id,
        authorId: member1.id
      }
    });

    // Create notifications
    await prisma.notification.create({
      data: {
        type: 'TASK_ASSIGNED',
        title: 'New Task Assigned',
        message: 'You have been assigned to "Design new homepage layout"',
        userId: member1.id,
        relatedId: task1.id
      }
    });

    await prisma.notification.create({
      data: {
        type: 'TASK_UPDATED',
        title: 'Task Updated',
        message: 'Task "Implement user authentication" status changed to In Progress',
        userId: member1.id,
        relatedId: task2.id
      }
    });

    console.log('✅ Database seeded successfully!');
    console.log('📧 Demo accounts created:');
    console.log('   Admin: admin@collabtrack.com / password123');
    console.log('   Project Manager: pm@collabtrack.com / password123');
    console.log('   Team Member: member@collabtrack.com / password123');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
