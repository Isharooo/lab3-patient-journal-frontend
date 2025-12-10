import Keycloak from 'keycloak-js';

const keycloakConfig = {
    url: import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8180',
    realm: import.meta.env.VITE_KEYCLOAK_REALM || 'patient-journal',
    clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'frontend-client',
};

console.log('=== KEYCLOAK MODULE LOADED ===');
console.log('Config:', JSON.stringify(keycloakConfig, null, 2));
console.log('LocalStorage keys:', Object.keys(localStorage));

const keycloak = new Keycloak(keycloakConfig);

let initPromise = null;

export const initKeycloak = () => {
    if (initPromise) {
        return initPromise;
    }

    initPromise = keycloak
        .init({
            onLoad: 'login-required',
            checkLoginIframe: false,
            pkceMethod: 'S256',
            useNonce: false,  // Stäng av nonce-validering
        })
        .then((authenticated) => {
            console.log('SUCCESS - Authenticated:', authenticated);

            if (window.location.hash || window.location.search) {
                window.history.replaceState({}, document.title, window.location.pathname);
            }

            return authenticated;
        })
        .catch((err) => {
            console.error('FAILED:', err);
            document.body.innerHTML = '<h1>Keycloak Error</h1><p>Check console</p>';
            throw err;
        });

    return initPromise;
};

export default keycloak;