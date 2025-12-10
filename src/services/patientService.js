import { patientApi } from './api';

export const patientService = {
  // Via vanligt REST (snabbast för användaren)
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

  // Dessa anrop skickar kommandon till Kafka topic 'patient.commands'
  // som sedan processas asynkront av PatientCommandConsumer

  createPatient: async (patientData) => {
    // Anropar PatientKafkaController -> Skickar CREATE-kommando till Kafka
    const response = await patientApi.post('/kafka/patients', patientData);
    return response.data;
  },

  updatePatient: async (id, patientData) => {
    // Anropar PatientKafkaController -> Skickar UPDATE-kommando till Kafka
    const response = await patientApi.put(`/kafka/patients/${id}`, patientData);
    return response.data;
  },

  deletePatient: async (id) => {
    // Anropar PatientKafkaController -> Skickar DELETE-kommando till Kafka
    const response = await patientApi.delete(`/kafka/patients/${id}`);
    return response.data;
  },

  // === Alternativ: Direkt REST utan Kafka (för snabbare respons) ===
  createPatientDirect: async (patientData) => {
    const response = await patientApi.post('/patients', patientData);
    return response.data;
  },

  updatePatientDirect: async (id, patientData) => {
    const response = await patientApi.put(`/patients/${id}`, patientData);
    return response.data;
  },

  deletePatientDirect: async (id) => {
    const response = await patientApi.delete(`/patients/${id}`);
    return response.data;
  },
};