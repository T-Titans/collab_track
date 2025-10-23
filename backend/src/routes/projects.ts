import express from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Validation schemas
const createProjectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  deadline: z.string().datetime().optional()
});

const updateProjectSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  status: z.enum(['ACTIVE', 'ARCHIVED', 'COMPLETED']).optional(),
  deadline: z.string().datetime().optional()
});

const inviteUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  role: z.enum(['MANAGER', 'MEMBER']).default('MEMBER')
});

// @route   GET /api/projects
// @desc    Get all projects for the current user
// @access  Private
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;

    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { createdBy: userId },
          { members: { some: { userId } } }
        ]
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        members: {
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
        },
        _count: {
          select: {
            tasks: true
          }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    // Add task counts and completion status
    const projectsWithStats = await Promise.all(
      projects.map(async (project) => {
        const taskCount = await prisma.task.count({
          where: { projectId: project.id }
        });

        const completedTaskCount = await prisma.task.count({
          where: { 
            projectId: project.id,
            status: 'DONE'
          }
        });

        return {
          ...project,
          taskCount,
          completedTaskCount,
          progress: taskCount > 0 ? Math.round((completedTaskCount / taskCount) * 100) : 0
        };
      })
    );

    res.json({
      success: true,
      data: projectsWithStats
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   GET /api/projects/:id
// @desc    Get single project
// @access  Private
router.get('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const project = await prisma.project.findFirst({
      where: {
        id,
        OR: [
          { createdBy: userId },
          { members: { some: { userId } } }
        ]
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        members: {
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
        },
        tasks: {
          include: {
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
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   POST /api/projects
// @desc    Create new project
// @access  Private
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { title, description, deadline } = createProjectSchema.parse(req.body);
    const userId = req.user!.id;

    const project = await prisma.project.create({
      data: {
        title,
        description,
        deadline: deadline ? new Date(deadline) : null,
        createdBy: userId,
        members: {
          create: {
            userId,
            role: 'OWNER'
          }
        }
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        members: {
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
        }
      }
    });

    res.status(201).json({
      success: true,
      data: project
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors
      });
    }

    console.error('Create project error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   PUT /api/projects/:id
// @desc    Update project
// @access  Private (Project Owner/Manager)
router.put('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const updateData = updateProjectSchema.parse(req.body);

    // Check if user has permission to update project
    const project = await prisma.project.findFirst({
      where: {
        id,
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
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found or insufficient permissions'
      });
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        ...updateData,
        deadline: updateData.deadline ? new Date(updateData.deadline) : undefined,
        updatedAt: new Date()
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        members: {
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
        }
      }
    });

    res.json({
      success: true,
      data: updatedProject
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors
      });
    }

    console.error('Update project error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   DELETE /api/projects/:id
// @desc    Delete project
// @access  Private (Project Owner only)
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    // Check if user is the project owner
    const project = await prisma.project.findFirst({
      where: {
        id,
        createdBy: userId
      }
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found or insufficient permissions'
      });
    }

    await prisma.project.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   POST /api/projects/:id/invite
// @desc    Invite user to project
// @access  Private (Project Owner/Manager)
router.post('/:id/invite', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const { email, role } = inviteUserSchema.parse(req.body);

    // Check if user has permission to invite
    const project = await prisma.project.findFirst({
      where: {
        id,
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
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found or insufficient permissions'
      });
    }

    // Check if user exists
    const userToInvite = await prisma.user.findUnique({
      where: { email }
    });

    if (!userToInvite) {
      return res.status(404).json({
        success: false,
        error: 'User with this email not found'
      });
    }

    // Check if user is already a member
    const existingMember = await prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId: userToInvite.id,
          projectId: id
        }
      }
    });

    if (existingMember) {
      return res.status(400).json({
        success: false,
        error: 'User is already a member of this project'
      });
    }

    // Create project invite
    const invite = await prisma.projectInvite.create({
      data: {
        email,
        role: role as any,
        projectId: id,
        invitedBy: userId,
        userId: userToInvite.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      }
    });

    // Add user as project member
    await prisma.projectMember.create({
      data: {
        userId: userToInvite.id,
        projectId: id,
        role: role as any
      }
    });

    // Create notification for the invited user
    await prisma.notification.create({
      data: {
        type: 'PROJECT_INVITE',
        title: 'Project Invitation',
        message: `You have been invited to join the project "${project.title}"`,
        userId: userToInvite.id,
        relatedId: id
      }
    });

    res.status(201).json({
      success: true,
      data: invite,
      message: 'User invited successfully'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors
      });
    }

    console.error('Invite user error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   DELETE /api/projects/:id/members/:userId
// @desc    Remove member from project
// @access  Private (Project Owner/Manager)
router.delete('/:id/members/:userId', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id, userId: memberId } = req.params;
    const currentUserId = req.user!.id;

    // Check if user has permission to remove members
    const project = await prisma.project.findFirst({
      where: {
        id,
        OR: [
          { createdBy: currentUserId },
          { 
            members: { 
              some: { 
                userId: currentUserId,
                role: { in: ['OWNER', 'MANAGER'] }
              }
            }
          }
        ]
      }
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found or insufficient permissions'
      });
    }

    // Don't allow removing the project owner
    if (project.createdBy === memberId) {
      return res.status(400).json({
        success: false,
        error: 'Cannot remove project owner'
      });
    }

    await prisma.projectMember.deleteMany({
      where: {
        projectId: id,
        userId: memberId
      }
    });

    res.json({
      success: true,
      message: 'Member removed successfully'
    });
  } catch (error) {
    console.error('Remove member error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

export default router;

