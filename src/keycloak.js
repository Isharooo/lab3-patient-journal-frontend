import Keycloak from 'keycloak-js';

const keycloakConfig = {
  url: import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8180',
  realm: import.meta.env.VITE_KEYCLOAK_REALM || 'patient-journal',
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'frontend-client',
};

console.log('Keycloak config:', keycloakConfig);

const keycloak = new Keycloak(keycloakConfig);

let initPromise = null;

export const initKeycloak = () => {
  console.log('initKeycloak called, initPromise exists:', !!initPromise);
  console.log('keycloak.authenticated:', keycloak.authenticated);

  if (initPromise) {
    console.log('Returning existing promise');
    return initPromise;
  }

  console.log('Starting new init');
  initPromise = keycloak
      .init({
        onLoad: 'login-required',
        checkLoginIframe: false,
        pkceMethod: 'S256',
      })
      .then((authenticated) => {
        console.log('Init completed, authenticated:', authenticated);
        if (window.location.search.includes('code=') || window.location.search.includes('state=')) {
          console.log('Clearing URL params');
          window.history.replaceState({}, document.title, window.location.pathname);
        }
        return authenticated;
      });

  return initPromise;
};

export default keycloak;