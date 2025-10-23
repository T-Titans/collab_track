import express from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Validation schemas
const createCommentSchema = z.object({
  content: z.string().min(1, 'Comment content is required'),
  taskId: z.string().min(1, 'Task ID is required')
});

const updateCommentSchema = z.object({
  content: z.string().min(1, 'Comment content is required')
});

// @route   GET /api/comments/task/:taskId
// @desc    Get all comments for a task
// @access  Private
router.get('/task/:taskId', authenticate, async (req: AuthRequest, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.user!.id;

    // Check if user has access to the task
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
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

    const comments = await prisma.comment.findMany({
      where: { taskId },
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
    });

    res.json({
      success: true,
      data: comments
    });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   POST /api/comments
// @desc    Create new comment
// @access  Private
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const { content, taskId } = createCommentSchema.parse(req.body);

    // Check if user has access to the task
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
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
        assignee: true,
        project: {
          include: {
            members: true
          }
        }
      }
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found or insufficient permissions'
      });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        taskId,
        authorId: userId
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        }
      }
    });

    // Create notifications for task assignee and project members (excluding comment author)
    const notificationPromises = [];

    if (task.assignedTo && task.assignedTo !== userId) {
      notificationPromises.push(
        prisma.notification.create({
          data: {
            type: 'COMMENT_ADDED',
            title: 'New Comment',
            message: `New comment added to task: "${task.title}"`,
            userId: task.assignedTo,
            relatedId: taskId
          }
        })
      );
    }

    // Notify project members (excluding comment author and task assignee)
    const memberIds = task.project.members
      .map(member => member.userId)
      .filter(id => id !== userId && id !== task.assignedTo);

    for (const memberId of memberIds) {
      notificationPromises.push(
        prisma.notification.create({
          data: {
            type: 'COMMENT_ADDED',
            title: 'New Comment',
            message: `New comment added to task: "${task.title}"`,
            userId: memberId,
            relatedId: taskId
          }
        })
      );
    }

    await Promise.all(notificationPromises);

    res.status(201).json({
      success: true,
      data: comment
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors
      });
    }

    console.error('Create comment error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   PUT /api/comments/:id
// @desc    Update comment
// @access  Private (Comment Author only)
router.put('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const { content } = updateCommentSchema.parse(req.body);

    const comment = await prisma.comment.findFirst({
      where: {
        id,
        authorId: userId
      }
    });

    if (!comment) {
      return res.status(404).json({
        success: false,
        error: 'Comment not found or insufficient permissions'
      });
    }

    const updatedComment = await prisma.comment.update({
      where: { id },
      data: {
        content,
        updatedAt: new Date()
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        }
      }
    });

    res.json({
      success: true,
      data: updatedComment
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors
      });
    }

    console.error('Update comment error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   DELETE /api/comments/:id
// @desc    Delete comment
// @access  Private (Comment Author or Project Owner/Manager)
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const comment = await prisma.comment.findFirst({
      where: {
        id,
        OR: [
          { authorId: userId },
          { 
            task: {
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
          }
        ]
      }
    });

    if (!comment) {
      return res.status(404).json({
        success: false,
        error: 'Comment not found or insufficient permissions'
      });
    }

    await prisma.comment.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

export default router;

