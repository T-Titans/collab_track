export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'project_manager' | 'team_member';
  avatar?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'archived' | 'completed';
  createdAt: string;
}