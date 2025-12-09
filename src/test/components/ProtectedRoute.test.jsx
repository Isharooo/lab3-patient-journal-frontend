import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProtectedRoute from '../../components/ProtectedRoute';
import { AuthProvider } from '../../context/AuthContext';

// Mock AuthContext
vi.mock('../../context/AuthContext', () => ({
  AuthProvider: ({ children }) => children,
  useAuth: vi.fn(),
}));

import { useAuth } from '../../context/AuthContext';

describe('ProtectedRoute', () => {
  it('renders children when authenticated', () => {
    useAuth.mockReturnValue({
      authenticated: true,
      initialized: true,
      user: { role: 'DOCTOR' },
    });

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('shows loading when not initialized', () => {
    useAuth.mockReturnValue({
      authenticated: false,
      initialized: false,
      user: null,
    });

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders children when user has allowed role', () => {
    useAuth.mockReturnValue({
      authenticated: true,
      initialized: true,
      user: { role: 'DOCTOR' },
    });

    render(
      <MemoryRouter>
        <ProtectedRoute allowedRoles={['DOCTOR', 'STAFF']}>
          <div>Doctor Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByText('Doctor Content')).toBeInTheDocument();
  });
});
