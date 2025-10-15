import React, { useState } from 'react';
import Button from '../components/ui/Button';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'project_manager' | 'team_member';
  avatar: string;
  projects: number;
  tasks: number;
  joinDate: string;
}

const Team: React.FC = () => {
  const [teamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@company.com',
      role: 'admin',
      avatar: 'JD',
      projects: 5,
      tasks: 12,
      joinDate: '2023-01-15'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@company.com',
      role: 'project_manager',
      avatar: 'JS',
      projects: 3,
      tasks: 8,
      joinDate: '2023-03-20'
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike@company.com',
      role: 'team_member',
      avatar: 'MJ',
      projects: 2,
      tasks: 5,
      joinDate: '2023-06-10'
    },
    {
      id: '4',
      name: 'Sarah Wilson',
      email: 'sarah@company.com',
      role: 'team_member',
      avatar: 'SW',
      projects: 4,
      tasks: 7,
      joinDate: '2023-02-28'
    }
  ]);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return '#ef4444';
      case 'project_manager': return '#f59e0b';
      case 'team_member': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Admin';
      case 'project_manager': return 'Project Manager';
      case 'team_member': return 'Team Member';
      default: return role;
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
            Team
          </h1>
          <p style={{ color: '#6b7280', margin: 0 }}>
            Manage your team members and their roles
          </p>
        </div>
        
        <Button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>+</span>
          Invite Member
        </Button>
      </div>

      {/* Team Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1.5rem'
      }}>
        {teamMembers.map((member) => (
          <div
            key={member.id}
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              padding: '1.5rem',
              border: '1px solid #e5e7eb',
              transition: 'all 0.2s'
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
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '1rem'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                backgroundColor: '#3b82f6',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1rem'
              }}>
                {member.avatar}
              </div>
              
              <div style={{ flex: 1 }}>
                <h3 style={{ 
                  margin: '0 0 0.25rem 0',
                  color: '#1f2937',
                  fontWeight: '600'
                }}>
                  {member.name}
                </h3>
                <p style={{ 
                  margin: 0,
                  color: '#6b7280',
                  fontSize: '0.875rem'
                }}>
                  {member.email}
                </p>
              </div>
            </div>

            <div style={{ 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              <span
                style={{
                  backgroundColor: getRoleColor(member.role),
                  color: 'white',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: '500'
                }}
              >
                {getRoleLabel(member.role)}
              </span>
              
              <span style={{ 
                color: '#6b7280',
                fontSize: '0.875rem'
              }}>
                Joined {new Date(member.joinDate).toLocaleDateString()}
              </span>
            </div>

            <div style={{ 
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
              paddingTop: '1rem',
              borderTop: '1px solid #e5e7eb'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  color: '#3b82f6'
                }}>
                  {member.projects}
                </div>
                <div style={{ 
                  fontSize: '0.75rem',
                  color: '#6b7280'
                }}>
                  Projects
                </div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  color: '#10b981'
                }}>
                  {member.tasks}
                </div>
                <div style={{ 
                  fontSize: '0.75rem',
                  color: '#6b7280'
                }}>
                  Tasks
                </div>
              </div>
            </div>

            <div style={{ 
              display: 'flex',
              gap: '0.5rem',
              marginTop: '1rem'
            }}>
              <Button variant="secondary" style={{ flex: 1, fontSize: '0.875rem' }}>
                Edit
              </Button>
              <Button variant="secondary" style={{ flex: 1, fontSize: '0.875rem' }}>
                Message
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Team;