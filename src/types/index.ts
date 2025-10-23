export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'PROJECT_MANAGER' | 'TEAM_MEMBER';
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
  isActive: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'archived' | 'completed';
  deadline?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  members: ProjectMember[];
  taskCount?: number;
  completedTaskCount?: number;
}

export interface ProjectMember {
  id: string;
  userId: string;
  projectId: string;
  role: 'owner' | 'manager' | 'member';
  joinedAt: string;
  user?: User;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate?: string;
  assignedTo?: string;
  assignedUser?: User;
  projectId: string;
  project?: Project;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  comments?: Comment[];
  attachments?: Attachment[];
  timeSpent?: number; // in minutes
  estimatedTime?: number; // in minutes
}

export interface Comment {
  id: string;
  content: string;
  taskId: string;
  authorId: string;
  author?: User;
  createdAt: string;
  updatedAt: string;
}

export interface Attachment {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  taskId: string;
  uploadedBy: string;
  uploadedAt: string;
  url: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'task_assigned' | 'task_updated' | 'comment_added' | 'project_invite' | 'deadline_approaching';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  relatedId?: string; // taskId, projectId, etc.
}

export interface TimeEntry {
  id: string;
  taskId: string;
  userId: string;
  description: string;
  duration: number; // in minutes
  date: string;
  createdAt: string;
}

export interface ProjectInvite {
  id: string;
  projectId: string;
  email: string;
  role: 'manager' | 'member';
  invitedBy: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  createdAt: string;
  expiresAt: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Form types
export interface CreateProjectData {
  title: string;
  description: string;
  deadline?: string;
}

export interface CreateTaskData {
  title: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate?: string;
  assignedTo?: string;
  projectId: string;
  estimatedTime?: number;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate?: string;
  assignedTo?: string;
  estimatedTime?: number;
}

export interface CreateCommentData {
  content: string;
  taskId: string;
}

export interface InviteUserData {
  email: string;
  role: 'manager' | 'member';
  projectId: string;
}