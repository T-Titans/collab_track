import axios from 'axios';
import { 
  User, 
  Project, 
  Task, 
  Comment, 
  Notification, 
  TimeEntry,
  CreateProjectData,
  CreateTaskData,
  UpdateTaskData,
  CreateCommentData,
  InviteUserData,
  ApiResponse,
  PaginatedResponse
} from '../types';

export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> =>
    api.post('/auth/login', { email, password }).then(res => res.data),
  
  register: (userData: { name: string; email: string; password: string; role?: string }): Promise<ApiResponse<{ user: User; token: string }>> =>
    api.post('/auth/register', userData).then(res => res.data),
  
  getMe: (): Promise<ApiResponse<User>> =>
    api.get('/auth/me').then(res => res.data),
  
  changePassword: (currentPassword: string, newPassword: string): Promise<ApiResponse<null>> =>
    api.post('/auth/change-password', { currentPassword, newPassword }).then(res => res.data),
};

// Users API
export const usersAPI = {
  getAll: (params?: { page?: number; limit?: number; search?: string }): Promise<ApiResponse<PaginatedResponse<User>>> =>
    api.get('/users', { params }).then(res => res.data),
  
  create: (data: { name: string; email: string; password: string; role: string }): Promise<ApiResponse<User>> =>
    api.post('/users', data).then(res => res.data),
  
  search: (query: string, projectId?: string): Promise<ApiResponse<User[]>> =>
    api.get('/users/search', { params: { q: query, projectId } }).then(res => res.data),
  
  getById: (id: string): Promise<ApiResponse<User>> =>
    api.get(`/users/${id}`).then(res => res.data),
  
  update: (id: string, data: Partial<User>): Promise<ApiResponse<User>> =>
    api.put(`/users/${id}`, data).then(res => res.data),
  
  delete: (id: string): Promise<ApiResponse<null>> =>
    api.delete(`/users/${id}`).then(res => res.data),
};

// Projects API
export const projectsAPI = {
  getAll: (): Promise<ApiResponse<Project[]>> =>
    api.get('/projects').then(res => res.data),
  
  getById: (id: string): Promise<ApiResponse<Project>> =>
    api.get(`/projects/${id}`).then(res => res.data),
  
  create: (data: CreateProjectData): Promise<ApiResponse<Project>> =>
    api.post('/projects', data).then(res => res.data),
  
  update: (id: string, data: Partial<CreateProjectData>): Promise<ApiResponse<Project>> =>
    api.put(`/projects/${id}`, data).then(res => res.data),
  
  delete: (id: string): Promise<ApiResponse<null>> =>
    api.delete(`/projects/${id}`).then(res => res.data),
  
  inviteUser: (projectId: string, data: InviteUserData): Promise<ApiResponse<any>> =>
    api.post(`/projects/${projectId}/invite`, data).then(res => res.data),
  
  removeMember: (projectId: string, userId: string): Promise<ApiResponse<null>> =>
    api.delete(`/projects/${projectId}/members/${userId}`).then(res => res.data),
};

// Tasks API
export const tasksAPI = {
  getAll: (params?: { projectId?: string; status?: string; assignedTo?: string }): Promise<ApiResponse<Task[]>> =>
    api.get('/tasks', { params }).then(res => res.data),
  
  getById: (id: string): Promise<ApiResponse<Task>> =>
    api.get(`/tasks/${id}`).then(res => res.data),
  
  create: (data: CreateTaskData): Promise<ApiResponse<Task>> =>
    api.post('/tasks', data).then(res => res.data),
  
  update: (id: string, data: UpdateTaskData): Promise<ApiResponse<Task>> =>
    api.put(`/tasks/${id}`, data).then(res => res.data),
  
  delete: (id: string): Promise<ApiResponse<null>> =>
    api.delete(`/tasks/${id}`).then(res => res.data),
  
  addTimeEntry: (taskId: string, data: { description: string; duration: number; date?: string }): Promise<ApiResponse<TimeEntry>> =>
    api.post(`/tasks/${taskId}/time`, data).then(res => res.data),
};

// Comments API
export const commentsAPI = {
  getByTask: (taskId: string): Promise<ApiResponse<Comment[]>> =>
    api.get(`/comments/task/${taskId}`).then(res => res.data),
  
  create: (data: CreateCommentData): Promise<ApiResponse<Comment>> =>
    api.post('/comments', data).then(res => res.data),
  
  update: (id: string, data: { content: string }): Promise<ApiResponse<Comment>> =>
    api.put(`/comments/${id}`, data).then(res => res.data),
  
  delete: (id: string): Promise<ApiResponse<null>> =>
    api.delete(`/comments/${id}`).then(res => res.data),
};

// Notifications API
export const notificationsAPI = {
  getAll: (params?: { page?: number; limit?: number; unreadOnly?: boolean }): Promise<ApiResponse<PaginatedResponse<Notification>>> =>
    api.get('/notifications', { params }).then(res => res.data),
  
  getUnreadCount: (): Promise<ApiResponse<{ unreadCount: number }>> =>
    api.get('/notifications/unread-count').then(res => res.data),
  
  markAsRead: (id: string): Promise<ApiResponse<Notification>> =>
    api.put(`/notifications/${id}/read`).then(res => res.data),
  
  markAllAsRead: (): Promise<ApiResponse<null>> =>
    api.put('/notifications/mark-all-read').then(res => res.data),
  
  delete: (id: string): Promise<ApiResponse<null>> =>
    api.delete(`/notifications/${id}`).then(res => res.data),
  
  clearAll: (): Promise<ApiResponse<null>> =>
    api.delete('/notifications/clear-all').then(res => res.data),
};

// File Upload API
export const uploadAPI = {
  uploadToTask: (taskId: string, file: File): Promise<ApiResponse<any>> => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/upload/task/${taskId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data);
  },
  
  deleteFile: (id: string): Promise<ApiResponse<null>> =>
    api.delete(`/upload/${id}`).then(res => res.data),
};