import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: '#f8fafc'
    }}>
      {/* Header */}
      <Header />
      
      {/* Main Content Area with Sidebar */}
      <div style={{ 
        display: 'flex', 
        flex: 1 
      }}>
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <main style={{ 
          flex: 1, 
          padding: '2rem',
          overflow: 'auto',
          backgroundColor: '#f8fafc'
        }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;