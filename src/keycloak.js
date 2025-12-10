import Keycloak from 'keycloak-js';

const keycloakConfig = {
    url: import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8180',
    realm: import.meta.env.VITE_KEYCLOAK_REALM || 'patient-journal',
    clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'frontend-client',
};

// Logga vid module load
console.log('=== KEYCLOAK MODULE LOADED ===');
console.log('Timestamp:', new Date().toISOString());
console.log('Config:', JSON.stringify(keycloakConfig, null, 2));
console.log('Current URL:', window.location.href);
console.log('URL hash:', window.location.hash);
console.log('URL search:', window.location.search);
console.log('SessionStorage keys:', Object.keys(sessionStorage));

const keycloak = new Keycloak(keycloakConfig);

let initPromise = null;

export const initKeycloak = () => {
    console.log('=== initKeycloak() CALLED ===');
    console.log('initPromise exists:', !!initPromise);
    console.log('keycloak.authenticated:', keycloak.authenticated);

    if (initPromise) {
        console.log('Returning existing initPromise');
        return initPromise;
    }

    console.log('=== STARTING keycloak.init() ===');

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
            console.log('Subject:', keycloak.subject);
            console.log('TokenParsed:', JSON.stringify(keycloak.tokenParsed, null, 2));

            // Rensa URL
            if (window.location.hash || window.location.search) {
                console.log('Clearing URL params');
                window.history.replaceState({}, document.title, window.location.pathname);
            }

            return authenticated;
        })
        .catch((err) => {
            console.error('=== KEYCLOAK INIT FAILED ===');
            console.error('Error:', err);
            console.error('Error type:', typeof err);
            console.error('SessionStorage at failure:', Object.keys(sessionStorage));

            // Vid nonce-fel, rensa och försök igen
            console.log('Clearing sessionStorage and redirecting...');
            sessionStorage.clear();
            window.location.href = window.location.origin;
            throw err;
        });

    return initPromise;
};

export default keycloak;