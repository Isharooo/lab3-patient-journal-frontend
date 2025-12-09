import { patientApi } from './api';

export const patientService = {
  getAllPatients: async () => {
    const response = await patientApi.get('/patients');
    return response.data;
  },

  getPatientById: async (id) => {
    const response = await patientApi.get(`/patients/${id}`);
    return response.data;
  },

  getPatientByUserId: async (userId) => {
    const response = await patientApi.get(`/patients/user/${userId}`);
    return response.data;
  },

  createPatient: async (patientData) => {
    const response = await patientApi.post('/patients', patientData);
    return response.data;
  },

  updatePatient: async (id, patientData) => {
    const response = await patientApi.put(`/patients/${id}`, patientData);
    return response.data;
  },
};
