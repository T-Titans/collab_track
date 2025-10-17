import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'admin' | 'project_manager' | 'team_member';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { user, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#f8fafc'
      }}>
        <div style={{ 
          textAlign: 'center',
          padding: '2rem',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>⏳</div>
          <p style={{ margin: 0, color: '#6b7280' }}>Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check role if requiredRole is specified
  if (requiredRole) {
    // Define role hierarchy (admin has access to everything)
    const roleHierarchy = {
      'admin': ['admin', 'project_manager', 'team_member'],
      'project_manager': ['project_manager', 'team_member'],
      'team_member': ['team_member']
    };

    const userRole = user.role;
    const allowedRoles = roleHierarchy[requiredRole] || [requiredRole];
    
    if (!allowedRoles.includes(userRole)) {
      return (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '60vh',
          padding: '2rem',
          textAlign: 'center',
          backgroundColor: '#f8fafc'
        }}>
          <div style={{ 
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            maxWidth: '400px',
            width: '100%'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚫</div>
            <h2 style={{ 
              color: '#ef4444', 
              marginBottom: '1rem',
              fontSize: '1.5rem'
            }}>
              Access Denied
            </h2>
            <p style={{ 
              color: '#6b7280', 
              marginBottom: '2rem',
              lineHeight: '1.5'
            }}>
              You don't have permission to access this page.<br />
              <strong>Required role: {requiredRole.replace('_', ' ')}</strong><br />
              <span style={{ fontSize: '0.875rem' }}>
                Your role: {user.role.replace('_', ' ')}
              </span>
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button 
                onClick={() => window.history.back()}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Go Back
              </button>
              <button 
                onClick={() => window.location.href = '/dashboard'}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }
  }

  // If all checks pass, render the children
  return <>{children}</>;
};

export default ProtectedRoute;