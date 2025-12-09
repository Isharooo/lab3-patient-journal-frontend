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

    // Kolla om vi kommer tillbaka från Keycloak med code
    const params = new URLSearchParams(window.location.search);
    const hasCode = params.has('code');

    initPromise = keycloak
        .init({
            onLoad: hasCode ? undefined : 'login-required',
            checkLoginIframe: false,
            pkceMethod: 'S256',
        })
        .then((authenticated) => {
            console.log('Authenticated:', authenticated);

            // Rensa URL
            if (window.location.search) {
                window.history.replaceState({}, document.title, window.location.pathname);
            }

            // Om inte autentiserad och vi inte har code, logga in
            if (!authenticated && !hasCode) {
                keycloak.login();
                return false;
            }

            return authenticated;
        })
        .catch((err) => {
            console.error('Keycloak init error:', err);
            throw err;
        });

    return initPromise;
};

export default keycloak;