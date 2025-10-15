import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input: React.FC<InputProps> = ({ label, ...props }) => {
  return (
    <div style={{ marginBottom: '1rem' }}>
      {label && (
        <label style={{ 
          display: 'block', 
          marginBottom: '0.5rem',
          fontWeight: '500' 
        }}>
          {label}
        </label>
      )}
      <input
        style={{
          width: '100%',
          padding: '10px',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
          fontSize: '16px',
          boxSizing: 'border-box' as const,
        }}
        {...props}
      />
    </div>
  );
};

export default Input;