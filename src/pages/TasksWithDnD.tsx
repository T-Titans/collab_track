import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

// Droppable Column Component
const DroppableColumn: React.FC<{
  id: string;
  title: string;
  color: string;
  icon: string;
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
}> = ({ id, title, color, icon, tasks, onTaskClick }) => {
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
const SortableTask: React.FC<{ task: Task; onClick: (taskId: string) => void }> = ({ task, onClick }) => {
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
      case 'urgent': return '#ef4444';
      case 'high': return '#f97316';
      case 'medium': return '#eab308';
      case 'low': return '#84cc16';
      default: return '#6b7280';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return '🔥';
      case 'high': return '⚡';
      case 'medium': return '⚠️';
      case 'low': return '💤';
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
        {task.project}
      </div>
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

  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const navigate = useNavigate();

  const columns = [
    { id: 'backlog', title: 'Backlog', color: '#6b7280', icon: '📥' },
    { id: 'todo', title: 'To Do', color: '#3b82f6', icon: '📋' },
    { id: 'in-progress', title: 'In Progress', color: '#f59e0b', icon: '⚡' },
    { id: 'done', title: 'Done', color: '#10b981', icon: '✅' }
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

  const handleDragEnd = (event: DragEndEvent) => {
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
        setTasks(tasks.map(task =>
          task.id === activeId
            ? { ...task, status: overColumn.id as Task['status'] }
            : task
        ));
      }
    }
  };

  const handleDragCancel = () => {
    setActiveTask(null);
  };

  const handleTaskClick = (taskId: string) => {
    navigate(`/tasks/${taskId}`);
  };

  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status);
  };

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
    </div>
  );
};

export default TasksWithDnD;