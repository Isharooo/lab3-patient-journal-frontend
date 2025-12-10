import Keycloak from 'keycloak-js';

const keycloakConfig = {
    url: import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8180',
    realm: import.meta.env.VITE_KEYCLOAK_REALM || 'patient-journal',
    clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'frontend-client',
};

// Logga vid uppstart
console.log('=== KEYCLOAK INIT START ===');
console.log('Timestamp:', new Date().toISOString());
console.log('Config:', JSON.stringify(keycloakConfig, null, 2));
console.log('Current URL:', window.location.href);
console.log('Has code param:', new URLSearchParams(window.location.search).has('code'));
console.log('Has state param:', new URLSearchParams(window.location.search).has('state'));

const keycloak = new Keycloak(keycloakConfig);

let initPromise = null;
let isInitialized = false;

export const initKeycloak = () => {
    console.log('=== initKeycloak() CALLED ===');
    console.log('isInitialized:', isInitialized);
    console.log('initPromise exists:', !!initPromise);

    if (isInitialized && keycloak.authenticated) {
        console.log('Already initialized and authenticated, returning true');
        return Promise.resolve(true);
    }

    if (initPromise) {
        console.log('Returning existing promise');
        return initPromise;
    }

    isInitialized = true;
    console.log('Starting keycloak.init()...');

    initPromise = keycloak
        .init({
            onLoad: 'login-required',
            checkLoginIframe: false,
            pkceMethod: 'S256',
        })
        .then((authenticated) => {
            console.log('=== KEYCLOAK INIT SUCCESS ===');
            console.log('Authenticated:', authenticated);
            console.log('Token exists:', !!keycloak.token);
            console.log('Token parsed:', keycloak.tokenParsed ? JSON.stringify(keycloak.tokenParsed, null, 2) : 'null');

            if (window.location.search) {
                console.log('Clearing URL params...');
                window.history.replaceState({}, document.title, window.location.pathname);
            }

            return authenticated;
        })
        .catch((err) => {
            console.log('=== KEYCLOAK INIT FAILED ===');
            console.log('Error:', err);
            console.log('Error type:', typeof err);
            console.log('Error stringified:', JSON.stringify(err));
            console.log('Keycloak state after error:', {
                authenticated: keycloak.authenticated,
                token: !!keycloak.token,
                refreshToken: !!keycloak.refreshToken,
                subject: keycloak.subject,
            });
            throw err;
        });

    return initPromise;
};

export default keycloak;