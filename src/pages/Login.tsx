import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getThemeStyles } from '../lib/themeUtils';
import Button from '../components/ui/Button';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const { isDark } = useTheme();
  const theme = getThemeStyles(isDark);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Demo credentials for easy testing
  const demoCredentials = [
    { email: 'admin@collabtrack.com', password: 'password123', role: 'Admin' },
    { email: 'pm@collabtrack.com', password: 'password123', role: 'Project Manager' },
    { email: 'member@collabtrack.com', password: 'password123', role: 'Team Member' }
  ];

  const fillDemoCredentials = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.bgPrimary,
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: theme.cardBg,
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px',
        border: `1px solid ${theme.cardBorder}`
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '64px',
            height: '64px',
            backgroundColor: '#3b82f6',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '1.5rem',
            margin: '0 auto 1rem'
          }}>
            CT
          </div>
          <h2 style={{ 
            color: theme.textPrimary,
            margin: '0 0 0.5rem 0'
          }}>
            Welcome to Tech-Titans CollabTrack
          </h2>
          <p style={{ 
            color: theme.textSecondary,
            margin: 0
          }}>
            Sign in to your account
          </p>
        </div>
        
        {error && (
          <div style={{
            color: '#ef4444',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            padding: '0.75rem',
            borderRadius: '6px',
            marginBottom: '1rem',
            fontSize: '0.875rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '500',
              color: theme.textPrimary
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `1px solid ${theme.inputBorder}`,
                borderRadius: '6px',
                fontSize: '16px',
                backgroundColor: theme.inputBg,
                color: theme.textPrimary
              }}
              placeholder="Enter your email"
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '500',
              color: theme.textPrimary
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `1px solid ${theme.inputBorder}`,
                borderRadius: '6px',
                fontSize: '16px',
                backgroundColor: theme.inputBg,
                color: theme.textPrimary
              }}
              placeholder="Enter your password"
            />
          </div>

          <Button 
            type="submit" 
            style={{ width: '100%' }}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        {/* Registration Link */}
        <div style={{
          textAlign: 'center',
          marginTop: '1.5rem',
          paddingTop: '1.5rem',
          borderTop: `1px solid ${theme.borderPrimary}`
        }}>
          <p style={{
            color: theme.textSecondary,
            margin: '0 0 0.5rem 0',
            fontSize: '0.875rem'
          }}>
            Don't have an account?
          </p>
          <a
            href="/register"
            style={{
              color: '#3b82f6',
              textDecoration: 'none',
              fontWeight: '500',
              fontSize: '0.875rem'
            }}
          >
            Create an account here
          </a>
        </div>

        {/* Demo Credentials */}
        <div style={{ marginTop: '2rem' }}>
          <h4 style={{ 
            color: theme.textSecondary,
            fontSize: '0.875rem',
            margin: '0 0 1rem 0',
            textAlign: 'center'
          }}>
            Demo Credentials (Click to fill):
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {demoCredentials.map((cred, index) => (
              <button
                key={index}
                type="button"
                onClick={() => fillDemoCredentials(cred.email, cred.password)}
                style={{
                  padding: '0.5rem',
                  border: `1px solid ${theme.borderPrimary}`,
                  borderRadius: '4px',
                  backgroundColor: theme.bgTertiary,
                  color: theme.textPrimary,
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  textAlign: 'left'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = isDark ? '#374151' : '#e5e7eb';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = theme.bgTertiary;
                }}
              >
                <strong>{cred.role}:</strong> {cred.email} / {cred.password}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;