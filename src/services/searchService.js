import { searchApi } from './api';

export const searchService = {
    // Sök patienter med fritext (söker i patientdata, journaler och conditions)
    searchPatients: async (query) => {
        const response = await searchApi.get('/search/patients', {
            params: { query }
        });
        return response.data;
    },

    // Sök patienter efter namn
    searchPatientsByName: async (firstName, lastName) => {
        const response = await searchApi.get('/search/patients/by-name', {
            params: { firstName, lastName }
        });
        return response.data;
    },

    // Sök patienter efter diagnos/condition
    searchPatientsByCondition: async (condition) => {
        const response = await searchApi.get('/search/patients/by-condition', {
            params: { condition }
        });
        return response.data;
    },

    // Sök patienter efter personnummer
    searchPatientsByPersonalNumber: async (personalNumber) => {
        const response = await searchApi.get('/search/patients/by-personal-number', {
            params: { personalNumber }
        });
        return response.data;
    },

    // Sök journalanteckningar
    searchJournals: async (query) => {
        const response = await searchApi.get('/search/journals', {
            params: { query }
        });
        return response.data;
    },

    // Hämta journaler för en specifik patient
    searchJournalsByPatient: async (patientId) => {
        const response = await searchApi.get('/search/journals/by-patient', {
            params: { patientId }
        });
        return response.data;
    },

    // Health check
    checkHealth: async () => {
        const response = await searchApi.get('/search/health');
        return response.data;
    },
};