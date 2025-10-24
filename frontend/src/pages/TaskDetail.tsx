import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import Button from '../components/ui/Button';

interface Comment {
  id: string;
  content: string;
  author: string;
  timestamp: string;
  avatar: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'backlog' | 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: string;
  assignedTo: string;
  project: string;
  createdAt: string;
}

const TaskDetail: React.FC = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      content: 'I\'ve started working on the initial wireframes. Should have something to review by tomorrow.',
      author: 'John Doe',
      timestamp: '2024-01-20T10:30:00',
      avatar: 'JD'
    },
    {
      id: '2',
      content: 'Great! Please make sure to follow the new design system guidelines.',
      author: 'Sarah Wilson',
      timestamp: '2024-01-20T11:15:00',
      avatar: 'SW'
    }
  ]);

  const [newComment, setNewComment] = useState('');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return '#ef4444';
      case 'high': return '#f97316';
      case 'medium': return '#eab308';
      case 'low': return '#84cc16';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return '#3b82f6';
      case 'in-progress': return '#f59e0b';
      case 'done': return '#10b981';
      case 'backlog': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      content: newComment,
      author: 'Current User',
      timestamp: new Date().toISOString(),
      avatar: 'CU'
    };

    setComments([...comments, comment]);
    setNewComment('');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!taskId) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await api.get(`/tasks/${taskId}`);
        if (mounted && res?.data?.task) {
          setTask(res.data.task as Task);
        }
      } catch (err) {
        console.warn('Failed to load task from API, falling back to demo data', err);
        if (mounted) {
          setTask({
            id: taskId || '1',
            title: 'Design Homepage',
            description: 'Create wireframes for homepage layout including header, navigation, hero section, and footer. Ensure responsive design for mobile and desktop.',
            status: 'todo',
            priority: 'high',
            dueDate: '2024-03-15',
            assignedTo: 'John Doe',
            project: 'Website Redesign',
            createdAt: '2024-01-15'
          });
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [taskId]);

  if (isLoading) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', padding: '2rem' }}>
        <p>Loading task details...</p>
      </div>
    );
  }

  if (!task) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', padding: '2rem' }}>
        <h1>Task Not Found</h1>
        <p>The requested task could not be found.</p>
        <button 
          onClick={() => navigate('/tasks')}
          style={{
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Back to Tasks
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '2rem'
      }}>
        <div>
          <button 
            onClick={() => navigate('/tasks')}
            style={{
              background: 'none',
              border: 'none',
              color: '#3b82f6',
              cursor: 'pointer',
              padding: '0.5rem 0',
              marginBottom: '0.5rem'
            }}
          >
            ← Back to Tasks
          </button>
          <h1 style={{ 
            color: '#1f2937', 
            margin: '0 0 0.5rem 0',
            fontSize: '1.875rem',
            fontWeight: 'bold'
          }}>
            {task.title}
          </h1>
          <p style={{ color: '#6b7280', margin: 0 }}>
            in <strong>{task.project}</strong>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <span
            style={{
              backgroundColor: getStatusColor(task.status),
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              fontSize: '0.875rem',
              fontWeight: '500',
              textTransform: 'capitalize'
            }}
          >
            {task.status.replace('-', ' ')}
          </span>
          <span
            style={{
              backgroundColor: getPriorityColor(task.priority),
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              fontSize: '0.875rem',
              fontWeight: '500',
              textTransform: 'capitalize'
            }}
          >
            {task.priority} Priority
          </span>
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '2fr 1fr', 
        gap: '2rem',
        alignItems: 'start'
      }}>
        {/* Main Content */}
        <div>
          {/* Description */}
          <section style={{ 
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            marginBottom: '1.5rem'
          }}>
            <h3 style={{ 
              color: '#1f2937',
              margin: '0 0 1rem 0',
              fontSize: '1.125rem',
              fontWeight: '600'
            }}>
              Description
            </h3>
            <p style={{ 
              color: '#374151',
              lineHeight: '1.6',
              margin: 0
            }}>
              {task.description}
            </p>
          </section>

          {/* Comments Section */}
          <section style={{ 
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ 
              color: '#1f2937',
              margin: '0 0 1rem 0',
              fontSize: '1.125rem',
              fontWeight: '600'
            }}>
              Comments ({comments.length})
            </h3>

            {/* Comment Form */}
            <form onSubmit={handleAddComment} style={{ marginBottom: '2rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    minHeight: '80px',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                />
              </div>
              <Button type="submit">
                Add Comment
              </Button>
            </form>

            {/* Comments List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {comments.map((comment) => (
                <div key={comment.id} style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: '#3b82f6',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '0.875rem',
                    flexShrink: 0
                  }}>
                    {comment.avatar}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '0.5rem'
                    }}>
                      <strong style={{ color: '#1f2937' }}>
                        {comment.author}
                      </strong>
                      <span style={{ 
                        color: '#6b7280',
                        fontSize: '0.875rem'
                      }}>
                        {formatDate(comment.timestamp)}
                      </span>
                    </div>
                    <p style={{ 
                      color: '#374151',
                      margin: 0,
                      lineHeight: '1.5'
                    }}>
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div>
          <div style={{ 
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            marginBottom: '1.5rem'
          }}>
            <h4 style={{ 
              color: '#1f2937',
              margin: '0 0 1rem 0',
              fontSize: '1rem',
              fontWeight: '600'
            }}>
              Task Details
            </h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ 
                  display: 'block',
                  color: '#6b7280',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  marginBottom: '0.25rem'
                }}>
                  Assigned To
                </label>
                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    backgroundColor: '#e5e7eb',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    color: '#374151'
                  }}>
                    {task.assignedTo.split(' ').map(n => n[0]).join('')}
                  </div>
                  <span style={{ color: '#374151' }}>{task.assignedTo}</span>
                </div>
              </div>

              <div>
                <label style={{ 
                  display: 'block',
                  color: '#6b7280',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  marginBottom: '0.25rem'
                }}>
                  Due Date
                </label>
                <span style={{ color: '#374151' }}>
                  {task.dueDate ? formatDate(task.dueDate) : 'No due date'}
                </span>
              </div>

              <div>
                <label style={{ 
                  display: 'block',
                  color: '#6b7280',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  marginBottom: '0.25rem'
                }}>
                  Created
                </label>
                <span style={{ color: '#374151' }}>
                  {formatDate(task.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ 
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <h4 style={{ 
              color: '#1f2937',
              margin: '0 0 1rem 0',
              fontSize: '1rem',
              fontWeight: '600'
            }}>
              Actions
            </h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Button variant="secondary" style={{ justifyContent: 'center' }}>
                Edit Task
              </Button>
              <Button variant="secondary" style={{ justifyContent: 'center' }}>
                Change Assignee
              </Button>
              <Button variant="secondary" style={{ justifyContent: 'center' }}>
                Set Due Date
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;