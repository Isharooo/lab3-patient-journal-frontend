import { patientApi } from './api';

export const patientService = {
  // Läsning sker fortfarande via vanligt REST (snabbast för användaren)
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

  // === HÖGRE BETYG: Skrivning sker via Kafka (Asynkront) ===

  createPatient: async (patientData) => {
    // Anropar PatientKafkaController
    const response = await patientApi.post('/kafka/patients', patientData);
    return response.data;
  },

  updatePatient: async (id, patientData) => {
    // Anropar PatientKafkaController
    const response = await patientApi.put(`/kafka/patients/${id}`, patientData);
    return response.data;
  },

  deletePatient: async (id) => {
    // Anropar PatientKafkaController
    const response = await patientApi.delete(`/kafka/patients/${id}`);
    return response.data;
  }
};