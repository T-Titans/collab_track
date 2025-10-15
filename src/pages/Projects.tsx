import React, { useState } from 'react';
import Button from '../components/ui/Button';

interface Project {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'archived' | 'completed';
  deadline?: string;
  members: number;
  tasks: number;
  createdAt: string;
}

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      title: 'Website Redesign',
      description: 'Complete overhaul of company website',
      status: 'active',
      deadline: '2024-12-31',
      members: 3,
      tasks: 12,
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      title: 'Mobile App Development',
      description: 'Build cross-platform mobile application',
      status: 'active',
      deadline: '2024-11-30',
      members: 5,
      tasks: 8,
      createdAt: '2024-02-01'
    },
    {
      id: '3',
      title: 'API Integration',
      description: 'Integrate third-party APIs',
      status: 'completed',
      members: 2,
      tasks: 15,
      createdAt: '2024-01-10'
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    deadline: ''
  });

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    const project: Project = {
      id: Date.now().toString(),
      title: newProject.title,
      description: newProject.description,
      status: 'active',
      deadline: newProject.deadline,
      members: 0,
      tasks: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setProjects([project, ...projects]);
    setNewProject({ title: '', description: '', deadline: '' });
    setShowCreateModal(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'completed': return '#3b82f6';
      case 'archived': return '#6b7280';
      default: return '#6b7280';
    }
  };

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <div>
          <h1 style={{ 
            color: '#1f2937', 
            marginBottom: '0.5rem',
            fontSize: '1.875rem',
            fontWeight: 'bold'
          }}>
            Projects
          </h1>
          <p style={{ color: '#6b7280', margin: 0 }}>
            Manage your team's projects and track progress
          </p>
        </div>
        
        <Button 
          onClick={() => setShowCreateModal(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <span>+</span>
          New Project
        </Button>
      </div>

      {/* Projects Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '1.5rem'
      }}>
        {projects.map((project) => (
          <div
            key={project.id}
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              padding: '1.5rem',
              border: '1px solid #e5e7eb',
              transition: 'all 0.2s',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '1rem'
            }}>
              <h3 style={{ 
                margin: 0,
                color: '#1f2937',
                fontWeight: '600',
                fontSize: '1.125rem'
              }}>
                {project.title}
              </h3>
              <span
                style={{
                  backgroundColor: getStatusColor(project.status),
                  color: 'white',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  textTransform: 'capitalize'
                }}
              >
                {project.status}
              </span>
            </div>

            <p style={{ 
              color: '#6b7280',
              margin: '0 0 1rem 0',
              lineHeight: '1.5'
            }}>
              {project.description}
            </p>

            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.875rem',
              color: '#6b7280'
            }}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <span>👥 {project.members}</span>
                <span>✅ {project.tasks}</span>
              </div>
              
              {project.deadline && (
                <span>
                  📅 {new Date(project.deadline).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
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
              Create New Project
            </h2>
            
            <form onSubmit={handleCreateProject}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  Project Title
                </label>
                <input
                  type="text"
                  required
                  value={newProject.title}
                  onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '16px'
                  }}
                  placeholder="Enter project title"
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
                  value={newProject.description}
                  onChange={(e) => setNewProject({...newProject, description: e.target.value})}
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
                  placeholder="Describe the project..."
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  Deadline
                </label>
                <input
                  type="date"
                  value={newProject.deadline}
                  onChange={(e) => setNewProject({...newProject, deadline: e.target.value})}
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
                <Button 
                  type="button"
                  variant="secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Create Project
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;