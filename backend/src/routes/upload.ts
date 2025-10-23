import express from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../lib/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Allow common file types
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/csv',
    'application/zip',
    'application/x-rar-compressed'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('File type not allowed'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760') // 10MB default
  }
});

// @route   POST /api/upload/task/:taskId
// @desc    Upload file to task
// @access  Private
router.post('/task/:taskId', authenticate, upload.single('file'), async (req: AuthRequest, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.user!.id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

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

    // Create attachment record
    const attachment = await prisma.attachment.create({
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        url: `/uploads/${req.file.filename}`,
        taskId,
        uploadedBy: userId
      },
      include: {
        uploader: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        }
      }
    });

    // Create notification for task assignee
    if (task.assignedTo && task.assignedTo !== userId) {
      await prisma.notification.create({
        data: {
          type: 'TASK_UPDATED',
          title: 'File Uploaded',
          message: `A file has been uploaded to task: "${task.title}"`,
          userId: task.assignedTo,
          relatedId: taskId
        }
      });
    }

    res.status(201).json({
      success: true,
      data: attachment
    });
  } catch (error) {
    console.error('Upload file error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   DELETE /api/upload/:id
// @desc    Delete file attachment
// @access  Private
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const attachment = await prisma.attachment.findFirst({
      where: {
        id,
        OR: [
          { uploadedBy: userId },
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

    if (!attachment) {
      return res.status(404).json({
        success: false,
        error: 'Attachment not found or insufficient permissions'
      });
    }

    // Delete file from filesystem
    const fs = require('fs');
    const filePath = path.join(__dirname, '../../uploads', attachment.filename);
    
    try {
      fs.unlinkSync(filePath);
    } catch (fileError) {
      console.error('Error deleting file:', fileError);
      // Continue with database deletion even if file deletion fails
    }

    // Delete attachment record
    await prisma.attachment.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// Error handling middleware for multer
router.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File too large'
      });
    }
  }
  
  if (error.message === 'File type not allowed') {
    return res.status(400).json({
      success: false,
      error: 'File type not allowed'
    });
  }

  next(error);
});

export default router;

