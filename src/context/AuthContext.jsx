import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import keycloak from '../keycloak';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [initialized, setInitialized] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const extractRole = (tokenParsed) => {
    const roles = tokenParsed.realm_access?.roles || [];
    if (roles.includes('DOCTOR')) return 'DOCTOR';
    if (roles.includes('STAFF')) return 'STAFF';
    if (roles.includes('PATIENT')) return 'PATIENT';
    return 'PATIENT';
  };

  const logout = useCallback(() => {
    keycloak.logout({ redirectUri: window.location.origin });
  }, []);

  useEffect(() => {
    keycloak
        .init({
          onLoad: 'login-required',
          checkLoginIframe: false,
          pkceMethod: 'S256',
          responseMode: 'query',
        })
        .then((auth) => {
          setAuthenticated(auth);
          if (auth) {
            // Rensa URL från Keycloak-parametrar
            if (window.location.search.includes('code=') || window.location.search.includes('state=')) {
              window.history.replaceState({}, document.title, window.location.pathname);
            }

            setToken(keycloak.token);
            const tokenParsed = keycloak.tokenParsed;
            setUser({
              id: tokenParsed.sub,
              username: tokenParsed.preferred_username,
              firstName: tokenParsed.given_name || '',
              lastName: tokenParsed.family_name || '',
              email: tokenParsed.email || '',
              role: extractRole(tokenParsed),
            });
          }
          setInitialized(true);
        })
        .catch((err) => {
          console.error('Keycloak init failed:', err);
          setInitialized(true);
        });

    keycloak.onTokenExpired = () => {
      keycloak
          .updateToken(30)
          .then((refreshed) => {
            if (refreshed) {
              setToken(keycloak.token);
            }
          })
          .catch(() => {
            console.error('Failed to refresh token');
            logout();
          });
    };
  }, [logout]);

  const getToken = useCallback(async () => {
    if (keycloak.isTokenExpired(5)) {
      try {
        await keycloak.updateToken(30);
      } catch {
        logout();
        return null;
      }
    }
    return keycloak.token;
  }, [logout]);

  const value = {
    user,
    token,
    authenticated,
    initialized,
    logout,
    getToken,
    keycloak,
    isDoctor: user?.role === 'DOCTOR',
    isPatient: user?.role === 'PATIENT',
    isStaff: user?.role === 'STAFF',
  };

  if (!initialized) {
    return <div>Loading...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};