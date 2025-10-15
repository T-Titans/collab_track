import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return '#ef4444';
      case 'project_manager': return '#f59e0b';
      case 'team_member': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  return (
    <header style={{
      backgroundColor: isDark ? '#1f2937' : 'white',
      padding: '1rem 2rem',
      borderBottom: isDark ? '1px solid #374151' : '1px solid #e5e7eb',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      transition: 'all 0.3s ease'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          width: '32px',
          height: '32px',
          backgroundColor: '#3b82f6',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold'
        }}>
          CT
        </div>
        <h1 style={{ 
          margin: 0, 
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: isDark ? '#f9fafb' : '#1f2937'
        }}>
          Tech-Titans CollabTrack
        </h1>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.5rem',
            borderRadius: '6px',
            backgroundColor: isDark ? '#374151' : '#f3f4f6',
            color: isDark ? '#fbbf24' : '#f59e0b',
            fontSize: '1.25rem'
          }}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? '☀️' : '🌙'}
        </button>

        {/* User Info */}
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ 
                color: isDark ? '#f9fafb' : '#374151',
                fontWeight: '500'
              }}>
                {user.name}
              </div>
              <div style={{ 
                color: getRoleColor(user.role),
                fontSize: '0.75rem',
                fontWeight: '500',
                textTransform: 'capitalize'
              }}>
                {user.role.replace('_', ' ')}
              </div>
            </div>
            
            <div style={{
              width: '32px',
              height: '32px',
              backgroundColor: getRoleColor(user.role),
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              color: 'white',
              fontSize: '0.75rem'
            }}>
              {user.name.split(' ').map(n => n[0]).join('')}
            </div>

            <button
              onClick={logout}
              style={{
                background: 'none',
                border: 'none',
                color: isDark ? '#d1d5db' : '#6b7280',
                cursor: 'pointer',
                padding: '0.5rem',
                borderRadius: '4px',
                fontSize: '0.875rem'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = isDark ? '#374151' : '#f3f4f6';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;