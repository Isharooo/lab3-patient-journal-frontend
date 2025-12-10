import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { initKeycloak } from './keycloak';

// Initiera Keycloak FÖRST, sedan rendera React
initKeycloak()
    .then(() => {
        console.log('Keycloak ready, rendering React...');
        ReactDOM.createRoot(document.getElementById('root')).render(
            <React.StrictMode>
                <App />
            </React.StrictMode>
        );
    })
    .catch((err) => {
        console.error('Failed to init Keycloak:', err);
        document.getElementById('root').innerHTML = '<h1>Authentication failed</h1>';
    });