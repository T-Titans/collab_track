import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export const setupSocketHandlers = (io: Server) => {
  // Authentication middleware for socket connections
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true
        }
      });

      if (!user || !user.isActive) {
        return next(new Error('Authentication error: Invalid user'));
      }

      socket.userId = user.id;
      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log(`User ${socket.user?.name} connected with socket ${socket.id}`);

    // Join user to their personal room for notifications
    socket.join(`user:${socket.userId}`);

    // Join project rooms based on user's project memberships
    socket.on('join-projects', async () => {
      try {
        const projects = await prisma.project.findMany({
          where: {
            OR: [
              { createdBy: socket.userId },
              { members: { some: { userId: socket.userId } } }
            ]
          },
          select: { id: true }
        });

        projects.forEach((project: { id: string }) => {
          socket.join(`project:${project.id}`);
        });

        console.log(`User ${socket.user?.name} joined ${projects.length} project rooms`);
      } catch (error) {
        console.error('Error joining project rooms:', error);
      }
    });

    // Handle task updates
    socket.on('task-updated', async (data: { taskId: string, projectId: string, updates: any }) => {
      try {
        // Verify user has access to the task
        const task = await prisma.task.findFirst({
          where: {
            id: data.taskId,
            OR: [
              { assignedTo: socket.userId },
              { createdBy: socket.userId },
              { 
                project: {
                  members: {
                    some: { userId: socket.userId }
                  }
                }
              }
            ]
          }
        });

        if (!task) {
          socket.emit('error', { message: 'Task not found or insufficient permissions' });
          return;
        }

        // Broadcast update to all users in the project
        socket.to(`project:${data.projectId}`).emit('task-updated', {
          taskId: data.taskId,
          updates: data.updates,
          updatedBy: {
            id: socket.userId,
            name: socket.user?.name,
            email: socket.user?.email
          },
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('Error handling task update:', error);
        socket.emit('error', { message: 'Error updating task' });
      }
    });

    // Handle new comments
    socket.on('comment-added', async (data: { taskId: string, projectId: string, comment: any }) => {
      try {
        // Verify user has access to the task
        const task = await prisma.task.findFirst({
          where: {
            id: data.taskId,
            OR: [
              { assignedTo: socket.userId },
              { createdBy: socket.userId },
              { 
                project: {
                  members: {
                    some: { userId: socket.userId }
                  }
                }
              }
            ]
          }
        });

        if (!task) {
          socket.emit('error', { message: 'Task not found or insufficient permissions' });
          return;
        }

        // Broadcast new comment to all users in the project
        socket.to(`project:${data.projectId}`).emit('comment-added', {
          taskId: data.taskId,
          comment: {
            ...data.comment,
            author: {
              id: socket.userId,
              name: socket.user?.name,
              email: socket.user?.email,
              avatar: null
            }
          },
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('Error handling comment addition:', error);
        socket.emit('error', { message: 'Error adding comment' });
      }
    });

    // Handle project updates
    socket.on('project-updated', async (data: { projectId: string, updates: any }) => {
      try {
        // Verify user has access to the project
        const project = await prisma.project.findFirst({
          where: {
            id: data.projectId,
            OR: [
              { createdBy: socket.userId },
              { members: { some: { userId: socket.userId } } }
            ]
          }
        });

        if (!project) {
          socket.emit('error', { message: 'Project not found or insufficient permissions' });
          return;
        }

        // Broadcast update to all users in the project
        socket.to(`project:${data.projectId}`).emit('project-updated', {
          projectId: data.projectId,
          updates: data.updates,
          updatedBy: {
            id: socket.userId,
            name: socket.user?.name,
            email: socket.user?.email
          },
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('Error handling project update:', error);
        socket.emit('error', { message: 'Error updating project' });
      }
    });

    // Handle typing indicators
    socket.on('typing-start', (data: { taskId: string, projectId: string }) => {
      socket.to(`project:${data.projectId}`).emit('user-typing', {
        taskId: data.taskId,
        userId: socket.userId,
        userName: socket.user?.name,
        isTyping: true
      });
    });

    socket.on('typing-stop', (data: { taskId: string, projectId: string }) => {
      socket.to(`project:${data.projectId}`).emit('user-typing', {
        taskId: data.taskId,
        userId: socket.userId,
        userName: socket.user?.name,
        isTyping: false
      });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`User ${socket.user?.name} disconnected`);
    });
  });

};

// Helper functions to emit events (need to be called with io instance)
export const emitNotification = async (io: Server, userId: string, notification: any) => {
  io.to(`user:${userId}`).emit('new-notification', notification);
};

export const emitProjectUpdate = (io: Server, projectId: string, update: any) => {
  io.to(`project:${projectId}`).emit('project-updated', update);
};

export const emitTaskUpdate = (io: Server, projectId: string, taskUpdate: any) => {
  io.to(`project:${projectId}`).emit('task-updated', taskUpdate);
};

