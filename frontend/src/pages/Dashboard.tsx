import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { getThemeStyles } from '../lib/themeUtils';
import { api } from '../lib/api';

interface DashboardStats {
  totalProjects: number;
  activeTasks: number;
  teamMembers: number;
  overdueTasks: number;
}

interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  tasks: number;
  members: number;
}

const Dashboard: React.FC = () => {
  const { isDark } = useTheme();
  const theme = getThemeStyles(isDark);
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    activeTasks: 0,
    teamMembers: 0,
    overdueTasks: 0
  });
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch projects and tasks in parallel
        const [projectsRes, tasksRes] = await Promise.all([
          api.get('/projects'),
          api.get('/tasks')
        ]);

        const projectsData = projectsRes.data.projects || [];
        const tasksData = tasksRes.data.tasks || [];

        // Calculate stats
        const totalProjects = projectsData.length;
        const activeTasks = tasksData.filter((task: any) => 
          task.status === 'todo' || task.status === 'in-progress'
        ).length;
        
        const overdueTasks = tasksData.filter((task: any) => {
          if (!task.dueDate) return false;
          return new Date(task.dueDate) < new Date() && task.status !== 'done';
        }).length;

        setStats({
          totalProjects,
          activeTasks,
          teamMembers: 0, // We'll need a users endpoint for this
          overdueTasks
        });

        // Get recent projects (limit to 3)
        const recentProjects = projectsData.slice(0, 3).map((project: any) => ({
          id: project.id,
          title: project.title,
          description: project.description,
          status: project.status,
          tasks: project.tasks || 0,
          members: project.members || 0
        }));

        setProjects(recentProjects);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statsData = [
    { label: 'Total Projects', value: stats.totalProjects, color: theme.status.todo },
    { label: 'Active Tasks', value: stats.activeTasks, color: theme.status['in-progress'] },
    { label: 'Team Members', value: stats.teamMembers, color: theme.priority.medium },
    { label: 'Overdue', value: stats.overdueTasks, color: theme.priority.urgent }
  ];

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ 
          color: theme.textPrimary, 
          marginBottom: '0.5rem',
          fontSize: '1.875rem',
          fontWeight: 'bold'
        }}>
          Dashboard
        </h1>
        <p style={{ color: theme.textSecondary, margin: 0 }}>
          Welcome back! Here's what's happening today.
        </p>
      </div>
      
      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {isLoading ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
            <p style={{ color: theme.textSecondary }}>Loading dashboard data...</p>
          </div>
        ) : (
          statsData.map((stat, index) => (
          <div
            key={index}
            style={{
              backgroundColor: theme.cardBg,
              padding: '1.5rem',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              borderLeft: `4px solid ${stat.color}`,
              border: `1px solid ${theme.cardBorder}`,
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.borderColor = theme.borderSecondary;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = theme.cardBorder;
            }}
          >
            <h3 style={{ 
              color: theme.textSecondary, 
              margin: '0 0 0.5rem 0',
              fontSize: '0.875rem',
              fontWeight: '500',
              textTransform: 'uppercase'
            }}>
              {stat.label}
            </h3>
            <p style={{ 
              fontSize: '2rem', 
              fontWeight: 'bold', 
              color: stat.color, 
              margin: 0 
            }}>
              {stat.value}
            </p>
          </div>
          ))
        )}
      </div>

      {/* Recent Projects */}
      <div style={{
        backgroundColor: theme.cardBg,
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        padding: '1.5rem',
        border: `1px solid ${theme.cardBorder}`,
        transition: 'all 0.3s ease'
      }}>
        <h2 style={{ 
          color: theme.textPrimary, 
          marginBottom: '1rem',
          fontSize: '1.25rem',
          fontWeight: '600'
        }}>
          Recent Projects
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p style={{ color: theme.textSecondary }}>Loading projects...</p>
            </div>
          ) : projects.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p style={{ color: theme.textSecondary }}>No projects found. Create your first project to get started!</p>
            </div>
          ) : (
            projects.map((project, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1.5rem',
                border: `1px solid ${theme.borderPrimary}`,
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                backgroundColor: theme.bgTertiary
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = isDark ? '#374151' : '#f9fafb';
                e.currentTarget.style.borderColor = theme.borderSecondary;
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = theme.bgTertiary;
                e.currentTarget.style.borderColor = theme.borderPrimary;
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ flex: 1 }}>
                <h3 style={{ 
                  margin: '0 0 0.5rem 0',
                  color: theme.textPrimary,
                  fontWeight: '600',
                  fontSize: '1.125rem'
                }}>
                  {project.title}
                </h3>
                <p style={{ 
                  margin: 0,
                  color: theme.textSecondary,
                  fontSize: '0.875rem'
                }}>
                  {project.tasks} tasks • {project.members} members • {project.status}
                </p>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{
                  width: '120px',
                  height: '8px',
                  backgroundColor: isDark ? '#4b5563' : '#e5e7eb',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: theme.status.todo,
                      borderRadius: '4px',
                      transition: 'width 0.3s ease'
                    }}
                  />
                </div>
                <span style={{ 
                  color: theme.textPrimary,
                  fontWeight: '600',
                  minWidth: '40px',
                  fontSize: '1rem'
                }}>
                  {project.status}
                </span>
              </div>
            </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;