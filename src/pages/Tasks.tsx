import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'backlog' | 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: string;
  assignedTo: string;
  project: string;
}

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Design Homepage',
      description: 'Create wireframes for homepage layout',
      status: 'todo',
      priority: 'high',
      dueDate: '2024-03-15',
      assignedTo: 'John Doe',
      project: 'Website Redesign'
    },
    {
      id: '2',
      title: 'API Authentication',
      description: 'Implement JWT authentication system',
      status: 'in-progress',
      priority: 'high',
      dueDate: '2024-03-20',
      assignedTo: 'Jane Smith',
      project: 'Mobile App Development'
    },
    {
      id: '3',
      title: 'Database Schema',
      description: 'Design initial database structure',
      status: 'done',
      priority: 'medium',
      assignedTo: 'Mike Johnson',
      project: 'API Integration'
    },
    {
      id: '4',
      title: 'User Testing',
      description: 'Conduct usability testing sessions',
      status: 'backlog',
      priority: 'low',
      dueDate: '2024-04-01',
      assignedTo: 'Sarah Wilson',
      project: 'Website Redesign'
    },
    {
      id: '5',
      title: 'Mobile App UI Design',
      description: 'Design user interface for mobile application',
      status: 'in-progress',
      priority: 'high',
      dueDate: '2024-03-25',
      assignedTo: 'John Doe',
      project: 'Mobile App Development'
    },
    {
      id: '6',
      title: 'API Documentation',
      description: 'Write comprehensive API documentation',
      status: 'todo',
      priority: 'medium',
      dueDate: '2024-03-30',
      assignedTo: 'Mike Johnson',
      project: 'API Integration'
    }
  ]);

  const navigate = useNavigate();

  const columns = [
    { id: 'backlog', title: 'Backlog', color: '#6b7280' },
    { id: 'todo', title: 'To Do', color: '#3b82f6' },
    { id: 'in-progress', title: 'In Progress', color: '#f59e0b' },
    { id: 'done', title: 'Done', color: '#10b981' }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return '#ef4444';
      case 'high': return '#f97316';
      case 'medium': return '#eab308';
      case 'low': return '#84cc16';
      default: return '#6b7280';
    }
  };

  const moveTask = (taskId: string, newStatus: Task['status']) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  const handleTaskClick = (taskId: string) => {
    navigate(`/tasks/${taskId}`);
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ 
          color: '#1f2937', 
          marginBottom: '0.5rem',
          fontSize: '1.875rem',
          fontWeight: 'bold'
        }}>
          Tasks
        </h1>
        <p style={{ color: '#6b7280', margin: 0 }}>
          Manage tasks across all projects. Click on any task to view details.
        </p>
      </div>

      {/* Kanban Board */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '1rem',
        alignItems: 'start'
      }}>
        {columns.map((column) => (
          <div
            key={column.id}
            style={{
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              padding: '1rem',
              minHeight: '600px'
            }}
          >
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              marginBottom: '1rem',
              paddingBottom: '0.5rem',
              borderBottom: `2px solid ${column.color}`
            }}>
              <h3 style={{ 
                margin: 0,
                color: column.color,
                fontWeight: '600',
                fontSize: '1rem'
              }}>
                {column.title}
              </h3>
              <span style={{
                marginLeft: '0.5rem',
                backgroundColor: column.color,
                color: 'white',
                borderRadius: '9999px',
                padding: '0.125rem 0.5rem',
                fontSize: '0.75rem',
                fontWeight: '500'
              }}>
                {tasks.filter(task => task.status === column.id).length}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {tasks
                .filter(task => task.status === column.id)
                .map((task) => (
                  <div
                    key={task.id}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '6px',
                      padding: '1rem',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                      border: '1px solid #e5e7eb',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                    onClick={() => handleTaskClick(task.id)}
                  >
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '0.5rem'
                    }}>
                      <h4 style={{ 
                        margin: 0,
                        color: '#1f2937',
                        fontWeight: '500',
                        fontSize: '0.875rem'
                      }}>
                        {task.title}
                      </h4>
                      <span
                        style={{
                          backgroundColor: getPriorityColor(task.priority),
                          color: 'white',
                          padding: '0.125rem 0.5rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: '500',
                          textTransform: 'capitalize'
                        }}
                      >
                        {task.priority}
                      </span>
                    </div>

                    <p style={{ 
                      color: '#6b7280',
                      margin: '0 0 0.75rem 0',
                      fontSize: '0.75rem',
                      lineHeight: '1.4'
                    }}>
                      {task.description}
                    </p>

                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.75rem',
                      color: '#6b7280'
                    }}>
                      <span>👤 {task.assignedTo}</span>
                      {task.dueDate && (
                        <span>📅 {new Date(task.dueDate).toLocaleDateString()}</span>
                      )}
                    </div>

                    {/* Project Badge */}
                    <div style={{ 
                      marginTop: '0.5rem',
                      padding: '0.25rem 0.5rem',
                      backgroundColor: '#f3f4f6',
                      borderRadius: '4px',
                      fontSize: '0.7rem',
                      color: '#4b5563',
                      fontWeight: '500',
                      display: 'inline-block'
                    }}>
                      {task.project}
                    </div>

                    {/* Status Buttons */}
                    <div style={{ 
                      display: 'flex', 
                      gap: '0.25rem',
                      marginTop: '0.75rem',
                      flexWrap: 'wrap'
                    }}>
                      {columns
                        .filter(col => col.id !== task.status)
                        .map((col) => (
                          <button
                            key={col.id}
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent navigation when clicking move buttons
                              moveTask(task.id, col.id as Task['status']);
                            }}
                            style={{
                              backgroundColor: col.color,
                              color: 'white',
                              border: 'none',
                              padding: '0.25rem 0.5rem',
                              borderRadius: '4px',
                              fontSize: '0.625rem',
                              cursor: 'pointer',
                              fontWeight: '500'
                            }}
                          >
                            Move to {col.title}
                          </button>
                        ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State for Columns */}
      {columns.map((column) => {
        const columnTasks = tasks.filter(task => task.status === column.id);
        if (columnTasks.length === 0) {
          return (
            <div
              key={column.id}
              style={{
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                padding: '1rem',
                minHeight: '600px'
              }}
            >
              <div style={{ 
                display: 'flex',
                alignItems: 'center',
                marginBottom: '1rem',
                paddingBottom: '0.5rem',
                borderBottom: `2px solid ${column.color}`
              }}>
                <h3 style={{ 
                  margin: 0,
                  color: column.color,
                  fontWeight: '600',
                  fontSize: '1rem'
                }}>
                  {column.title}
                </h3>
                <span style={{
                  marginLeft: '0.5rem',
                  backgroundColor: column.color,
                  color: 'white',
                  borderRadius: '9999px',
                  padding: '0.125rem 0.5rem',
                  fontSize: '0.75rem',
                  fontWeight: '500'
                }}>
                  0
                </span>
              </div>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '200px',
                color: '#9ca3af',
                fontSize: '0.875rem',
                textAlign: 'center',
                border: '2px dashed #d1d5db',
                borderRadius: '6px',
                margin: '1rem 0'
              }}>
                No tasks in {column.title}
              </div>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};

export default Tasks;