import { patientApi } from './api';

export const journalService = {
  getAllEntries: async () => {
    const response = await patientApi.get('/journal-entries');
    return response.data;
  },

  getEntryById: async (id) => {
    const response = await patientApi.get(`/journal-entries/${id}`);
    return response.data;
  },

  getEntriesByPatientId: async (patientId) => {
    const response = await patientApi.get(`/journal-entries/patient/${patientId}`);
    return response.data;
  },

  createEntry: async (entryData) => {
    const response = await patientApi.post('/journal-entries', entryData);
    return response.data;
  },

  updateEntry: async (id, entryData) => {
    const response = await patientApi.put(`/journal-entries/${id}`, entryData);
    return response.data;
  },
};
