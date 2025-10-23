import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tasksAPI } from '../lib/api';
import { Task } from '../types';
import { useAuth } from '../context/AuthContext';

const TasksNew: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        setIsLoading(true);
        const response = await tasksAPI.getAll();
        if (response.success) {
          setTasks(response.data || []);
        } else {
          setError(response.error || 'Failed to fetch tasks');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch tasks');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [user, navigate]);

  const columns = [
    { id: 'BACKLOG', title: 'Backlog', color: '#6b7280' },
    { id: 'TODO', title: 'To Do', color: '#3b82f6' },
    { id: 'IN_PROGRESS', title: 'In Progress', color: '#f59e0b' },
    { id: 'DONE', title: 'Done', color: '#10b981' }
  ];

  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return '#ef4444';
      case 'MEDIUM': return '#eab308';
      case 'LOW': return '#84cc16';
      case 'URGENT': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'HIGH': return '🔥';
      case 'MEDIUM': return '⚠️';
      case 'LOW': return '💤';
      case 'URGENT': return '🚨';
      default: return '📌';
    }
  };

  const handleTaskClick = (taskId: string) => {
    navigate(`/tasks/${taskId}`);
  };

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh' 
      }}>
        <div>Loading tasks...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        gap: '1rem'
      }}>
        <div style={{ color: '#ef4444' }}>Error: {error}</div>
        <button onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '1rem', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ 
          color: '#1f2937', 
          marginBottom: '0.5rem',
          fontSize: '2rem',
          fontWeight: 'bold'
        }}>
          Tasks
        </h1>
        <p style={{ 
          color: '#6b7280', 
          margin: 0,
          fontSize: '1rem'
        }}>
          Manage your tasks and track progress
        </p>
      </div>

      {/* Kanban Board */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '1.5rem',
        alignItems: 'start'
      }}>
        {columns.map((column) => (
          <div
            key={column.id}
            style={{
              backgroundColor: '#f8fafc',
              borderRadius: '12px',
              padding: '1.25rem',
              minHeight: '700px',
              border: `2px dashed ${column.color}30`
            }}
          >
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              marginBottom: '1.5rem',
              paddingBottom: '0.75rem',
              borderBottom: `3px solid ${column.color}`
            }}>
              <h3 style={{ 
                margin: 0,
                color: column.color,
                fontWeight: '700',
                fontSize: '1.1rem'
              }}>
                {column.title}
              </h3>
              <span style={{
                marginLeft: 'auto',
                backgroundColor: column.color,
                color: 'white',
                borderRadius: '9999px',
                padding: '0.25rem 0.75rem',
                fontSize: '0.8rem',
                fontWeight: '600'
              }}>
                {getTasksByStatus(column.id).length}
              </span>
            </div>

            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '1rem',
              minHeight: '500px'
            }}>
              {getTasksByStatus(column.id).map((task) => (
                <div
                  key={task.id}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    padding: '1rem',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #e5e7eb',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    position: 'relative',
                  }}
                  onClick={() => handleTaskClick(task.id)}
                  onMouseOver={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {/* Priority indicator bar */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '4px',
                      height: '100%',
                      backgroundColor: getPriorityColor(task.priority),
                      borderTopLeftRadius: '8px',
                      borderBottomLeftRadius: '8px',
                    }}
                  />
                  
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '0.5rem',
                    marginLeft: '4px'
                  }}>
                    <h4 style={{ 
                      margin: 0,
                      color: '#1f2937',
                      fontWeight: '600',
                      fontSize: '0.875rem',
                      lineHeight: '1.4'
                    }}>
                      {task.title}
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ fontSize: '0.75rem' }}>
                        {getPriorityIcon(task.priority)}
                      </span>
                      <span
                        style={{
                          backgroundColor: getPriorityColor(task.priority),
                          color: 'white',
                          padding: '0.125rem 0.5rem',
                          borderRadius: '9999px',
                          fontSize: '0.7rem',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em'
                        }}
                      >
                        {task.priority}
                      </span>
                    </div>
                  </div>

                  <p style={{ 
                    color: '#6b7280',
                    margin: '0 0 0.75rem 0',
                    fontSize: '0.75rem',
                    lineHeight: '1.4',
                    marginLeft: '4px'
                  }}>
                    {task.description}
                  </p>

                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.7rem',
                    color: '#6b7280',
                    marginLeft: '4px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <span style={{ 
                        width: '6px', 
                        height: '6px', 
                        backgroundColor: '#3b82f6', 
                        borderRadius: '50%' 
                      }} />
                      <span style={{ fontWeight: '500' }}>{task.assignedTo || 'Unassigned'}</span>
                    </div>
                    {task.dueDate && (
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.25rem',
                        backgroundColor: '#f3f4f6',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontWeight: '500'
                      }}>
                        <span>📅</span>
                        <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  {/* Project Badge */}
                  <div style={{ 
                    marginTop: '0.75rem',
                    padding: '0.25rem 0.75rem',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '6px',
                    fontSize: '0.7rem',
                    color: '#4b5563',
                    fontWeight: '600',
                    display: 'inline-block',
                    marginLeft: '4px',
                    border: '1px solid #e5e7eb'
                  }}>
                    {task.project?.title || 'No Project'}
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {getTasksByStatus(column.id).length === 0 && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '200px',
                color: '#9ca3af',
                fontSize: '0.9rem',
                textAlign: 'center',
                border: '2px dashed #d1d5db',
                borderRadius: '8px',
                margin: '1rem 0',
                padding: '2rem'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                  {column.id === 'BACKLOG' ? '📥' : 
                   column.id === 'TODO' ? '📋' : 
                   column.id === 'IN_PROGRESS' ? '⚡' : '✅'}
                </div>
                <p style={{ margin: '0 0 0.5rem 0', fontWeight: '500' }}>
                  No tasks in {column.title}
                </p>
                <p style={{ margin: 0, fontSize: '0.8rem' }}>
                  Tasks will appear here when assigned
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TasksNew;
