import express from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Validation schemas
const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  dueDate: z.string().datetime().optional(),
  assignedTo: z.string().optional(),
  projectId: z.string().min(1, 'Project ID is required'),
  estimatedTime: z.number().positive().optional()
});

const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  status: z.enum(['BACKLOG', 'TODO', 'IN_PROGRESS', 'DONE']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  dueDate: z.string().datetime().optional(),
  assignedTo: z.string().optional(),
  estimatedTime: z.number().positive().optional()
});

// @route   GET /api/tasks
// @desc    Get all tasks for the current user
// @access  Private
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const { projectId, status, assignedTo } = req.query;

    const where: any = {
      OR: [
        { assignedTo: userId },
        { createdBy: userId },
        { 
          project: {
            members: {
              some: { userId }
            }
          }
        }
      ]
    };

    if (projectId) {
      where.projectId = projectId;
    }

    if (status) {
      where.status = status;
    }

    if (assignedTo) {
      where.assignedTo = assignedTo;
    }

    const tasks = await prisma.task.findMany({
      where,
      include: {
        project: {
          select: {
            id: true,
            title: true,
            status: true
          }
        },
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        _count: {
          select: {
            comments: true,
            attachments: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: tasks
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   GET /api/tasks/:id
// @desc    Get single task
// @access  Private
router.get('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const task = await prisma.task.findFirst({
      where: {
        id,
        OR: [
          { assignedTo: userId },
          { createdBy: userId },
          { 
            project: {
              members: {
                some: { userId }
              }
            }
          }
        ]
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            status: true
          }
        },
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true
              }
            }
          },
          orderBy: { createdAt: 'asc' }
        },
        attachments: {
          include: {
            uploader: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true
              }
            }
          },
          orderBy: { uploadedAt: 'desc' }
        },
        timeEntries: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true
              }
            }
          },
          orderBy: { date: 'desc' }
        }
      }
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   POST /api/tasks
// @desc    Create new task
// @access  Private
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const { title, description, priority, dueDate, assignedTo, projectId, estimatedTime } = createTaskSchema.parse(req.body);

    // Check if user has access to the project
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        OR: [
          { createdBy: userId },
          { members: { some: { userId } } }
        ]
      }
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found or insufficient permissions'
      });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority: priority as any,
        dueDate: dueDate ? new Date(dueDate) : null,
        assignedTo,
        projectId,
        createdBy: userId,
        estimatedTime
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            status: true
          }
        },
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        }
      }
    });

    // Create notification for assigned user
    if (assignedTo && assignedTo !== userId) {
      await prisma.notification.create({
        data: {
          type: 'TASK_ASSIGNED',
          title: 'New Task Assigned',
          message: `You have been assigned a new task: "${title}"`,
          userId: assignedTo,
          relatedId: task.id
        }
      });
    }

    res.status(201).json({
      success: true,
      data: task
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors
      });
    }

    console.error('Create task error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update task
// @access  Private
router.put('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const updateData = updateTaskSchema.parse(req.body);

    // Check if user has access to the task
    const existingTask = await prisma.task.findFirst({
      where: {
        id,
        OR: [
          { assignedTo: userId },
          { createdBy: userId },
          { 
            project: {
              members: {
                some: { userId }
              }
            }
          }
        ]
      }
    });

    if (!existingTask) {
      return res.status(404).json({
        success: false,
        error: 'Task not found or insufficient permissions'
      });
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        ...updateData,
        dueDate: updateData.dueDate ? new Date(updateData.dueDate) : undefined,
        updatedAt: new Date()
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            status: true
          }
        },
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        }
      }
    });

    // Create notification for assigned user if assignment changed
    if (updateData.assignedTo && updateData.assignedTo !== userId && updateData.assignedTo !== existingTask.assignedTo) {
      await prisma.notification.create({
        data: {
          type: 'TASK_ASSIGNED',
          title: 'Task Assigned',
          message: `You have been assigned to task: "${updatedTask.title}"`,
          userId: updateData.assignedTo,
          relatedId: updatedTask.id
        }
      });
    }

    // Create notification for status change
    if (updateData.status && updateData.status !== existingTask.status) {
      const statusMessages = {
        'BACKLOG': 'moved to backlog',
        'TODO': 'moved to todo',
        'IN_PROGRESS': 'started working on',
        'DONE': 'completed'
      };

      if (updatedTask.assignedTo) {
        await prisma.notification.create({
          data: {
            type: 'TASK_UPDATED',
            title: 'Task Status Updated',
            message: `Task "${updatedTask.title}" has been ${statusMessages[updateData.status]}`,
            userId: updatedTask.assignedTo,
            relatedId: updatedTask.id
          }
        });
      }
    }

    res.json({
      success: true,
      data: updatedTask
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors
      });
    }

    console.error('Update task error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete task
// @access  Private (Task Creator or Project Owner/Manager)
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    // Check if user has permission to delete task
    const task = await prisma.task.findFirst({
      where: {
        id,
        OR: [
          { createdBy: userId },
          { 
            project: {
              OR: [
                { createdBy: userId },
                { 
                  members: { 
                    some: { 
                      userId,
                      role: { in: ['OWNER', 'MANAGER'] }
                    }
                  }
                }
              ]
            }
          }
        ]
      }
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found or insufficient permissions'
      });
    }

    await prisma.task.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   POST /api/tasks/:id/time
// @desc    Add time entry to task
// @access  Private
router.post('/:id/time', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const { description, duration, date } = req.body;

    if (!description || !duration || duration <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Description and duration are required'
      });
    }

    // Check if user has access to the task
    const task = await prisma.task.findFirst({
      where: {
        id,
        OR: [
          { assignedTo: userId },
          { createdBy: userId },
          { 
            project: {
              members: {
                some: { userId }
              }
            }
          }
        ]
      }
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found or insufficient permissions'
      });
    }

    const timeEntry = await prisma.timeEntry.create({
      data: {
        description,
        duration,
        date: date ? new Date(date) : new Date(),
        taskId: id,
        userId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        }
      }
    });

    // Update task time spent
    const totalTimeSpent = await prisma.timeEntry.aggregate({
      where: { taskId: id },
      _sum: { duration: true }
    });

    await prisma.task.update({
      where: { id },
      data: { timeSpent: totalTimeSpent._sum.duration || 0 }
    });

    res.status(201).json({
      success: true,
      data: timeEntry
    });
  } catch (error) {
    console.error('Add time entry error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

export default router;

