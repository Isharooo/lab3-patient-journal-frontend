import Keycloak from 'keycloak-js';

const keycloakConfig = {
    url: import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8180',
    realm: import.meta.env.VITE_KEYCLOAK_REALM || 'patient-journal',
    clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'frontend-client',
};

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
        })
        .then((authenticated) => {
            console.log('SUCCESS - Authenticated:', authenticated);

            // Rensa URL
            if (window.location.hash || window.location.search) {
                window.history.replaceState({}, document.title, window.location.pathname);
            }

            return authenticated;
        })
        .catch((err) => {
            console.error('FAILED:', err);
            // Vid nonce-fel, rensa och försök igen
            sessionStorage.clear();
            window.location.href = window.location.origin;
            throw err;
        });

    return initPromise;
};

export default keycloak;