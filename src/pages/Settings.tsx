import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getThemeStyles } from '../lib/themeUtils';
import Button from '../components/ui/Button';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const theme = getThemeStyles(isDark);

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ 
          color: theme.textPrimary, 
          marginBottom: '0.5rem',
          fontSize: '1.875rem',
          fontWeight: 'bold'
        }}>
          Settings
        </h1>
        <p style={{ color: theme.textSecondary, margin: 0 }}>
          Manage your application preferences and account settings
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '1.5rem'
      }}>
        {/* Account Settings */}
        <div style={{
          backgroundColor: theme.cardBg,
          borderRadius: '8px',
          padding: '1.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: `1px solid ${theme.cardBorder}`
        }}>
          <h3 style={{ 
            color: theme.textPrimary,
            margin: '0 0 1rem 0',
            fontSize: '1.125rem',
            fontWeight: '600'
          }}>
            Account Settings
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1rem',
              padding: '1rem',
              backgroundColor: theme.bgTertiary,
              borderRadius: '6px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#3b82f6',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold'
              }}>
                {user?.name?.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <div style={{ color: theme.textPrimary, fontWeight: '500' }}>
                  {user?.name}
                </div>
                <div style={{ color: theme.textSecondary, fontSize: '0.875rem' }}>
                  {user?.email}
                </div>
                <div style={{ 
                  color: theme.textSecondary, 
                  fontSize: '0.75rem',
                  textTransform: 'capitalize'
                }}>
                  {user?.role?.replace('_', ' ')}
                </div>
              </div>
            </div>
            
            <Button variant="secondary" style={{ width: '100%' }}>
              Change Password
            </Button>
            <Button variant="secondary" style={{ width: '100%' }}>
              Notification Preferences
            </Button>
          </div>
        </div>

        {/* App Preferences */}
        <div style={{
          backgroundColor: theme.cardBg,
          borderRadius: '8px',
          padding: '1.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: `1px solid ${theme.cardBorder}`
        }}>
          <h3 style={{ 
            color: theme.textPrimary,
            margin: '0 0 1rem 0',
            fontSize: '1.125rem',
            fontWeight: '600'
          }}>
            App Preferences
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1rem',
              backgroundColor: theme.bgTertiary,
              borderRadius: '6px'
            }}>
              <span style={{ color: theme.textPrimary }}>Dark Mode</span>
              <button
                onClick={toggleTheme}
                style={{
                  padding: '0.5rem',
                  backgroundColor: isDark ? '#3b82f6' : '#e5e7eb',
                  border: 'none',
                  borderRadius: '9999px',
                  width: '50px',
                  height: '24px',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: '2px',
                  left: isDark ? '28px' : '2px',
                  width: '20px',
                  height: '20px',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  transition: 'all 0.3s'
                }} />
              </button>
            </div>
            
            <Button variant="secondary" style={{ width: '100%' }}>
              Language & Region
            </Button>
            <Button variant="secondary" style={{ width: '100%' }}>
              Privacy Settings
            </Button>
          </div>
        </div>

        {/* Team Management (Admin only) */}
        {user?.role === 'ADMIN' && (
          <div style={{
            backgroundColor: theme.cardBg,
            borderRadius: '8px',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: `1px solid ${theme.cardBorder}`
          }}>
            <h3 style={{ 
              color: theme.textPrimary,
              margin: '0 0 1rem 0',
              fontSize: '1.125rem',
              fontWeight: '600'
            }}>
              Team Management
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Button variant="secondary" style={{ width: '100%' }}>
                Invite Team Members
              </Button>
              <Button variant="secondary" style={{ width: '100%' }}>
                Manage Roles & Permissions
              </Button>
              <Button variant="secondary" style={{ width: '100%' }}>
                Team Activity Log
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;