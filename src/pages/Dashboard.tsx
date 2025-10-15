import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { getThemeStyles } from '../lib/themeUtils';

const Dashboard: React.FC = () => {
  const { isDark } = useTheme();
  const theme = getThemeStyles(isDark);

  const stats = [
    { label: 'Total Projects', value: 12, color: theme.status.todo },
    { label: 'Active Tasks', value: 8, color: theme.status['in-progress'] },
    { label: 'Team Members', value: 5, color: theme.priority.medium },
    { label: 'Overdue', value: 2, color: theme.priority.urgent }
  ];

  const recentProjects = [
    { name: 'Website Redesign', progress: 75, tasks: 12, color: theme.status.todo },
    { name: 'Mobile App', progress: 45, tasks: 8, color: theme.status['in-progress'] },
    { name: 'API Development', progress: 90, tasks: 15, color: theme.status.completed }
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
        {stats.map((stat, index) => (
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
        ))}
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
          {recentProjects.map((project, index) => (
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
                  {project.name}
                </h3>
                <p style={{ 
                  margin: 0,
                  color: theme.textSecondary,
                  fontSize: '0.875rem'
                }}>
                  {project.tasks} tasks • {project.progress}% complete
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
                      width: `${project.progress}%`,
                      height: '100%',
                      backgroundColor: project.color,
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
                  {project.progress}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;