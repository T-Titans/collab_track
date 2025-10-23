import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { getThemeStyles } from '../../lib/themeUtils';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { isDark } = useTheme();
  const { user } = useAuth();
  const theme = getThemeStyles(isDark);

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: '📊' },
    { label: 'Projects', path: '/projects', icon: '📁' },
    { label: 'Tasks', path: '/tasks', icon: '✅' },
    { label: 'Team', path: '/team', icon: '👥' },
    ...(user?.role === 'ADMIN' ? [{ label: 'Users', path: '/users', icon: '👤' }] : []),
    { label: 'Settings', path: '/settings', icon: '⚙️' }
  ];

  return (
    <aside style={{
      width: '250px',
      backgroundColor: theme.cardBg,
      borderRight: `1px solid ${theme.borderPrimary}`,
      padding: '1rem 0',
      height: '100vh',
      transition: 'all 0.3s ease'
    }}>
      <nav>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const activeColor = theme.status.todo; // Using todo color for active state
          
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.75rem 1.5rem',
                color: isActive ? activeColor : theme.textSecondary,
                textDecoration: 'none',
                transition: 'all 0.2s',
                borderLeft: `3px solid ${isActive ? activeColor : 'transparent'}`,
                backgroundColor: isActive ? theme.bgTertiary : 'transparent',
                fontWeight: isActive ? '600' : '400'
              }}
              onMouseOver={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = theme.bgTertiary;
                  e.currentTarget.style.color = theme.textPrimary;
                }
              }}
              onMouseOut={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = theme.textSecondary;
                }
              }}
            >
              <span style={{ marginRight: '0.75rem', fontSize: '1.1rem' }}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;