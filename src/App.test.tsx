import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

test('renders app without crashing', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  
  // Test that the app renders without errors
  expect(screen.getByText(/Tech-Titans CollabTrack/i)).toBeInTheDocument();
});