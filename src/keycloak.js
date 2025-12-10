import Keycloak from 'keycloak-js';

const keycloakConfig = {
    url: import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8180',
    realm: import.meta.env.VITE_KEYCLOAK_REALM || 'patient-journal',
    clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'frontend-client',
};

// Logga direkt vid module load
console.log('=== KEYCLOAK MODULE LOADED ===');
console.log('Timestamp:', new Date().toISOString());
console.log('Config:', JSON.stringify(keycloakConfig, null, 2));
console.log('Current URL:', window.location.href);
console.log('URL Search params:', window.location.search);
console.log('Has code:', new URLSearchParams(window.location.search).has('code'));
console.log('Has state:', new URLSearchParams(window.location.search).has('state'));
console.log('Has session_state:', new URLSearchParams(window.location.search).has('session_state'));

const keycloak = new Keycloak(keycloakConfig);

let initPromise = null;
let isInitialized = false;

export const initKeycloak = () => {
    console.log('=== initKeycloak() CALLED ===');
    console.log('isInitialized:', isInitialized);
    console.log('initPromise exists:', !!initPromise);
    console.log('keycloak.authenticated:', keycloak.authenticated);

    if (isInitialized) {
        console.log('Already initialized, returning:', keycloak.authenticated);
        return Promise.resolve(keycloak.authenticated);
    }

    if (initPromise) {
        console.log('Returning existing initPromise');
        return initPromise;
    }

    isInitialized = true;
    console.log('=== STARTING keycloak.init() ===');

    initPromise = new Promise((resolve, reject) => {
        keycloak
            .init({
                onLoad: 'login-required',
                checkLoginIframe: false,
                pkceMethod: 'S256',
                enableLogging: true,
            })
            .then((authenticated) => {
                console.log('=== KEYCLOAK INIT SUCCESS ===');
                console.log('Authenticated:', authenticated);
                console.log('Token exists:', !!keycloak.token);
                console.log('Token:', keycloak.token ? keycloak.token.substring(0, 50) + '...' : 'null');
                console.log('Refresh token exists:', !!keycloak.refreshToken);
                console.log('Subject:', keycloak.subject);
                console.log('Token parsed:', JSON.stringify(keycloak.tokenParsed, null, 2));

                // Rensa URL
                if (window.location.search) {
                    console.log('Clearing URL search params');
                    window.history.replaceState({}, document.title, window.location.pathname);
                }

                resolve(authenticated);
            })
            .catch((err) => {
                console.error('=== KEYCLOAK INIT FAILED ===');
                console.error('Error:', err);
                console.error('Error type:', typeof err);
                console.error('Error message:', err?.message);
                console.error('Error stack:', err?.stack);
                console.error('Error stringified:', JSON.stringify(err, Object.getOwnPropertyNames(err || {})));
                console.error('Keycloak state after error:', {
                    authenticated: keycloak.authenticated,
                    token: keycloak.token ? 'exists' : 'null',
                    refreshToken: keycloak.refreshToken ? 'exists' : 'null',
                    subject: keycloak.subject,
                    sessionId: keycloak.sessionId,
                    responseMode: keycloak.responseMode,
                    flow: keycloak.flow,
                });
                reject(err);
            });
    });

    return initPromise;
};

export default keycloak;