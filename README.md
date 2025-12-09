# Patient Journal Frontend

React frontend for the Patient Journal System (Lab3). Features Keycloak OAuth2 authentication and communicates with microservices backend.

## Architecture

```
Frontend (React + Vite)
    ├── Keycloak (OAuth2 authentication)
    ├── patient-journal-backend (/api/patients, /api/journal-entries)
    └── message-service (/api/messages)
```

## Prerequisites

- Node.js 20+
- Running Keycloak instance
- Running backend services (patient-journal-backend, message-service)

## Setup

1. Copy environment file:
```bash
cp .env.example .env
```

2. Update `.env` with your configuration:
```
VITE_KEYCLOAK_URL=https://your-keycloak-url
VITE_KEYCLOAK_REALM=patient-journal
VITE_KEYCLOAK_CLIENT_ID=frontend-client
VITE_PATIENT_API_URL=https://your-patient-api/api
VITE_MESSAGE_API_URL=https://your-message-api/api
```

3. Install dependencies:
```bash
npm install
```

4. Run development server:
```bash
npm run dev
```

## Testing

```bash
npm run test        # Run tests once
npm run test:watch  # Run tests in watch mode
```

## Building

```bash
npm run build
```

## Docker

Build and run with Docker:

```bash
docker build -t patient-journal-frontend \
  --build-arg VITE_KEYCLOAK_URL=https://your-keycloak-url \
  --build-arg VITE_KEYCLOAK_REALM=patient-journal \
  --build-arg VITE_KEYCLOAK_CLIENT_ID=frontend-client \
  --build-arg VITE_PATIENT_API_URL=https://your-patient-api/api \
  --build-arg VITE_MESSAGE_API_URL=https://your-message-api/api \
  .

docker run -p 80:80 patient-journal-frontend
```

## Keycloak Setup

Required Keycloak configuration:

1. Create realm `patient-journal`
2. Create client `frontend-client`:
   - Client Protocol: openid-connect
   - Access Type: public
   - Valid Redirect URIs: `https://your-frontend-url/*`
   - Web Origins: `https://your-frontend-url`
3. Create roles: `DOCTOR`, `STAFF`, `PATIENT`
4. Assign roles to users

## Features

- OAuth2/OIDC authentication via Keycloak
- Role-based access control (DOCTOR, STAFF, PATIENT)
- Patient management (view patients, journal entries)
- Messaging system between users
- Responsive minimal design
