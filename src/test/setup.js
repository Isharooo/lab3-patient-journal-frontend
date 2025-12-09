import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock keycloak-js
vi.mock('../keycloak', () => ({
  default: {
    init: vi.fn().mockResolvedValue(true),
    login: vi.fn(),
    logout: vi.fn(),
    authenticated: true,
    token: 'mock-token',
    tokenParsed: {
      sub: 'test-user-id',
      preferred_username: 'testuser',
      given_name: 'Test',
      family_name: 'User',
      email: 'test@example.com',
      realm_access: { roles: ['DOCTOR'] },
    },
    isTokenExpired: vi.fn().mockReturnValue(false),
    updateToken: vi.fn().mockResolvedValue(true),
  },
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
