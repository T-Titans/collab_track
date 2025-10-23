import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tasksAPI } from '../lib/api';
import { Task } from '../types';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  useDroppable,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Remove duplicate interface - using the one from types

// Droppable Column Component
const DroppableColumn: React.FC<{
  id: string;
  title: string;
  color: string;
  icon: string;
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (taskId: string) => void;
  canEditTask?: (task: Task) => boolean;
}> = ({ id, title, color, icon, tasks, onTaskClick, onEditTask, onDeleteTask, canEditTask }) => {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        backgroundColor: '#f8fafc',
        borderRadius: '12px',
        padding: '1.25rem',
        minHeight: '700px',
        border: `2px dashed ${color}30`
      }}
    >
      <div style={{ 
        display: 'flex',
        alignItems: 'center',
        marginBottom: '1.5rem',
        paddingBottom: '0.75rem',
        borderBottom: `3px solid ${color}`
      }}>
        <span style={{ fontSize: '1.25rem', marginRight: '0.5rem' }}>
          {icon}
        </span>
        <h3 style={{ 
          margin: 0,
          color: color,
          fontWeight: '700',
          fontSize: '1.1rem'
        }}>
          {title}
        </h3>
        <span style={{
          marginLeft: 'auto',
          backgroundColor: color,
          color: 'white',
          borderRadius: '9999px',
          padding: '0.25rem 0.75rem',
          fontSize: '0.8rem',
          fontWeight: '600'
        }}>
          {tasks.length}
        </span>
      </div>

      <SortableContext 
        items={tasks.map(task => task.id)} 
        strategy={verticalListSortingStrategy}
      >
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1rem',
          minHeight: '500px'
        }}>
          {tasks.map((task) => (
            <SortableTask
              key={task.id}
              task={task}
              onClick={onTaskClick}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              canEdit={canEditTask ? canEditTask(task) : false}
            />
          ))}
        </div>
      </SortableContext>

      {/* Empty State */}
      {tasks.length === 0 && (
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
            {icon}
          </div>
          <p style={{ margin: '0 0 0.5rem 0', fontWeight: '500' }}>
            No tasks in {title}
          </p>
          <p style={{ margin: 0, fontSize: '0.8rem' }}>
            Drag tasks here to move them
          </p>
        </div>
      )}
    </div>
  );
};

// Sortable Task Component
const SortableTask: React.FC<{ 
  task: Task; 
  onClick: (taskId: string) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  canEdit?: boolean;
}> = ({ task, onClick, onEdit, onDelete, canEdit = false }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const dragStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return '#ef4444';
      case 'MEDIUM': return '#eab308';
      case 'LOW': return '#84cc16';
      default: return '#6b7280';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'HIGH': return '🔥';
      case 'MEDIUM': return '⚠️';
      case 'LOW': return '💤';
      default: return '📌';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        ...dragStyle,
        backgroundColor: isDragging ? '#f8fafc' : 'white',
        borderRadius: '8px',
        padding: '1rem',
        boxShadow: isDragging 
          ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' 
          : '0 1px 3px rgba(0, 0, 0, 0.1)',
        border: isDragging 
          ? '2px solid #3b82f6' 
          : '1px solid #e5e7eb',
        cursor: isDragging ? 'grabbing' : 'grab',
        opacity: isDragging ? 0.6 : 1,
        transform: `${dragStyle.transform} ${isDragging ? 'scale(1.02) rotate(2deg)' : ''}`,
        position: 'relative',
      }}
      {...attributes}
      {...listeners}
      onClick={(e) => {
        e.stopPropagation();
        onClick(task.id);
      }}
      onMouseOver={(e) => {
        if (!isDragging) {
          e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }
      }}
      onMouseOut={(e) => {
        if (!isDragging) {
          e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
          e.currentTarget.style.transform = 'translateY(0)';
        }
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
          <span style={{ fontWeight: '500' }}>{task.assignedTo}</span>
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

      {/* Edit/Delete Buttons */}
      {canEdit && onEdit && onDelete && (
        <div style={{ 
          position: 'absolute',
          top: '0.5rem',
          right: '0.5rem',
          display: 'flex',
          gap: '0.25rem',
          opacity: 0,
          transition: 'opacity 0.2s'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '1';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '0';
        }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.25rem',
              borderRadius: '4px',
              color: '#6b7280',
              fontSize: '0.75rem'
            }}
            title="Edit Task"
          >
            ✏️
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.25rem',
              borderRadius: '4px',
              color: '#ef4444',
              fontSize: '0.75rem'
            }}
            title="Delete Task"
          >
            🗑️
          </button>
        </div>
      )}
    </div>
  );
};

// Task Overlay Component for dragging
const TaskOverlay: React.FC<{ task: Task }> = ({ task }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return '#ef4444';
      case 'high': return '#f97316';
      case 'medium': return '#eab308';
      case 'low': return '#84cc16';
      default: return '#6b7280';
    }
  };

  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '1rem',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        border: '2px solid #3b82f6',
        cursor: 'grabbing',
        opacity: 0.8,
        transform: 'scale(1.02) rotate(2deg)',
        width: '100%',
      }}
    >
      <div style={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        width: '4px',
        height: '100%',
        backgroundColor: getPriorityColor(task.priority),
        borderTopLeftRadius: '8px',
        borderBottomLeftRadius: '8px',
      }} />
      
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
          fontSize: '0.875rem'
        }}>
          {task.title}
        </h4>
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
    </div>
  );
};

// Main Tasks Component with Fixed Drag & Drop
const TasksWithDnD: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH',
    dueDate: ''
  });
  const navigate = useNavigate();
  const { socket } = useSocket();

  // Fetch tasks on component mount
  useEffect(() => {
    const fetchTasks = async () => {
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
  }, []);

  // Set up real-time event listeners
  useEffect(() => {
    if (socket) {
      // Listen for task updates
      socket.on('task-updated', (updatedTask: Task) => {
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task.id === updatedTask.id ? updatedTask : task
          )
        );
      });

      // Listen for new tasks
      socket.on('task-created', (newTask: Task) => {
        setTasks(prevTasks => [newTask, ...prevTasks]);
      });

      // Listen for task deletions
      socket.on('task-deleted', (taskId: string) => {
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      });

      return () => {
        socket.off('task-updated');
        socket.off('task-created');
        socket.off('task-deleted');
      };
    }
  }, [socket]);

  const columns = [
    { id: 'BACKLOG', title: 'Backlog', color: '#6b7280', icon: '📥' },
    { id: 'TODO', title: 'To Do', color: '#3b82f6', icon: '📋' },
    { id: 'IN_PROGRESS', title: 'In Progress', color: '#f59e0b', icon: '⚡' },
    { id: 'DONE', title: 'Done', color: '#10b981', icon: '✅' }
  ];

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Reduced distance for better sensitivity
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find(t => t.id === active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find the active task
    const activeTask = tasks.find(task => task.id === activeId);
    
    // Check if we're dropping on a column
    const overColumn = columns.find(col => col.id === overId);
    
    if (activeTask && overColumn) {
      // Update task status if it's different
      if (activeTask.status !== overColumn.id) {
        // Optimistically update the UI
        setTasks(tasks.map(task =>
          task.id === activeId
            ? { ...task, status: overColumn.id as Task['status'] }
            : task
        ));

        // Update the backend
        try {
          await tasksAPI.update(activeId, { status: overColumn.id as Task['status'] });
        } catch (err: any) {
          // Revert the optimistic update on error
          setTasks(tasks.map(task =>
            task.id === activeId
              ? { ...task, status: activeTask.status }
              : task
          ));
          setError(err.message || 'Failed to update task status');
        }
      }
    }
  };

  const handleDragCancel = () => {
    setActiveTask(null);
  };

  const handleTaskClick = (taskId: string) => {
    navigate(`/tasks/${taskId}`);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setEditForm({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
    });
    setShowEditModal(true);
  };

  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;
    
    try {
      const response = await tasksAPI.update(editingTask.id, {
        title: editForm.title,
        description: editForm.description,
        priority: editForm.priority,
        dueDate: editForm.dueDate ? new Date(editForm.dueDate).toISOString() : undefined
      });
      
      if (response.success && response.data) {
        setTasks(tasks.map(t => t.id === editingTask.id ? response.data! : t));
        setEditForm({ title: '', description: '', priority: 'MEDIUM', dueDate: '' });
        setEditingTask(null);
        setShowEditModal(false);
      } else {
        setError(response.error || 'Failed to update task');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
      return;
    }
    
    try {
      const response = await tasksAPI.delete(taskId);
      
      if (response.success) {
        setTasks(tasks.filter(t => t.id !== taskId));
      } else {
        setError(response.error || 'Failed to delete task');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete task');
    }
  };

  const canEditTask = (task: Task) => {
    return user?.role === 'ADMIN' || 
           user?.role === 'PROJECT_MANAGER' || 
           task.assignedTo === user?.id;
  };

  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status);
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
          Task Board
        </h1>
        <p style={{ 
          color: '#6b7280', 
          margin: 0,
          fontSize: '1rem'
        }}>
          Drag and drop tasks between columns to update their status
        </p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        {/* Kanban Board */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1.5rem',
          alignItems: 'start'
        }}>
          {columns.map((column) => (
            <DroppableColumn
              key={column.id}
              id={column.id}
              title={column.title}
              color={column.color}
              icon={column.icon}
              tasks={getTasksByStatus(column.id)}
              onTaskClick={handleTaskClick}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              canEditTask={canEditTask}
            />
          ))}
        </div>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeTask ? <TaskOverlay task={activeTask} /> : null}
        </DragOverlay>
      </DndContext>

      {/* Instructions */}
      <div style={{
        marginTop: '3rem',
        padding: '1.5rem',
        backgroundColor: '#f0f9ff',
        border: '2px solid #bae6fd',
        borderRadius: '12px',
      }}>
        <h3 style={{ 
          margin: '0 0 1rem 0',
          color: '#0369a1',
          fontWeight: '600'
        }}>
          How to Use:
        </h3>
        <ul style={{ 
          margin: 0, 
          paddingLeft: '1.5rem',
          color: '#0369a1'
        }}>
          <li>Click and hold a task to drag it</li>
          <li>Drop it on any column to change its status</li>
          <li>Click on a task to view details</li>
        </ul>
      </div>

      {/* Edit Task Modal */}
      {showEditModal && editingTask && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            width: '100%',
            maxWidth: '500px',
            margin: '1rem'
          }}>
            <h2 style={{ 
              margin: '0 0 1.5rem 0',
              color: '#1f2937'
            }}>
              Edit Task
            </h2>
            
            <form onSubmit={handleUpdateTask}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  value={editForm.title}
                  onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '16px'
                  }}
                  placeholder="Enter task title"
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  Description
                </label>
                <textarea
                  required
                  value={editForm.description}
                  onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '16px',
                    minHeight: '100px',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                  placeholder="Describe the task..."
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  Priority
                </label>
                <select
                  value={editForm.priority}
                  onChange={(e) => setEditForm({...editForm, priority: e.target.value as 'LOW' | 'MEDIUM' | 'HIGH'})}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '16px'
                  }}
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  Due Date
                </label>
                <input
                  type="date"
                  value={editForm.dueDate}
                  onChange={(e) => setEditForm({...editForm, dueDate: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '16px'
                  }}
                />
              </div>

              <div style={{ 
                display: 'flex', 
                gap: '1rem',
                justifyContent: 'flex-end'
              }}>
                <button 
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingTask(null);
                    setEditForm({ title: '', description: '', priority: 'MEDIUM', dueDate: '' });
                  }}
                  style={{
                    padding: '0.75rem 1.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    backgroundColor: 'white',
                    color: '#374151',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  style={{
                    padding: '0.75rem 1.5rem',
                    border: 'none',
                    borderRadius: '6px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >
                  Update Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksWithDnD;