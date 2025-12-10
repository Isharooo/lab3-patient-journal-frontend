import { describe, it, expect, vi, beforeEach } from 'vitest';
import { patientService } from '../../services/patientService';
import { patientApi } from '../../services/api';

vi.mock('../../services/api', () => ({
  patientApi: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('patientService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllPatients', () => {
    it('fetches all patients', async () => {
      const mockPatients = [
        { id: 1, firstName: 'John', lastName: 'Doe' },
        { id: 2, firstName: 'Jane', lastName: 'Smith' },
      ];
      patientApi.get.mockResolvedValue({ data: mockPatients });

      const result = await patientService.getAllPatients();

      expect(patientApi.get).toHaveBeenCalledWith('/patients');
      expect(result).toEqual(mockPatients);
    });
  });

  describe('getPatientById', () => {
    it('fetches a patient by id', async () => {
      const mockPatient = { id: 1, firstName: 'John', lastName: 'Doe' };
      patientApi.get.mockResolvedValue({ data: mockPatient });

      const result = await patientService.getPatientById(1);

      expect(patientApi.get).toHaveBeenCalledWith('/patients/1');
      expect(result).toEqual(mockPatient);
    });
  });

  describe('getPatientByUserId', () => {
    it('fetches a patient by user id', async () => {
      const mockPatient = { id: 1, userId: 'user-123', firstName: 'John' };
      patientApi.get.mockResolvedValue({ data: mockPatient });

      const result = await patientService.getPatientByUserId('user-123');

      expect(patientApi.get).toHaveBeenCalledWith('/patients/user/user-123');
      expect(result).toEqual(mockPatient);
    });
  });

  // === KAFKA ENDPOINTS (för högre betyg) ===
  describe('createPatient (Kafka)', () => {
    it('sends CREATE command to Kafka endpoint', async () => {
      const newPatient = { firstName: 'John', lastName: 'Doe' };
      const response = { message: 'CREATE-kommando skickat till Kafka' };
      patientApi.post.mockResolvedValue({ data: response });

      const result = await patientService.createPatient(newPatient);

      // Använder /kafka/patients för asynkron Kafka-hantering
      expect(patientApi.post).toHaveBeenCalledWith('/kafka/patients', newPatient);
      expect(result).toEqual(response);
    });
  });

  describe('updatePatient (Kafka)', () => {
    it('sends UPDATE command to Kafka endpoint', async () => {
      const updatedData = { firstName: 'John', lastName: 'Updated' };
      const response = { message: 'UPDATE-kommando skickat till Kafka' };
      patientApi.put.mockResolvedValue({ data: response });

      const result = await patientService.updatePatient(1, updatedData);

      // Använder /kafka/patients/{id} för asynkron Kafka-hantering
      expect(patientApi.put).toHaveBeenCalledWith('/kafka/patients/1', updatedData);
      expect(result).toEqual(response);
    });
  });

  describe('deletePatient (Kafka)', () => {
    it('sends DELETE command to Kafka endpoint', async () => {
      const response = { message: 'DELETE-kommando skickat till Kafka' };
      patientApi.delete.mockResolvedValue({ data: response });

      const result = await patientService.deletePatient(1);

      // Använder /kafka/patients/{id} för asynkron Kafka-hantering
      expect(patientApi.delete).toHaveBeenCalledWith('/kafka/patients/1');
      expect(result).toEqual(response);
    });
  });

  // === DIRECT REST ENDPOINTS (synkrona alternativ) ===
  describe('createPatientDirect', () => {
    it('creates a patient via direct REST', async () => {
      const newPatient = { firstName: 'John', lastName: 'Doe' };
      const createdPatient = { id: 1, ...newPatient };
      patientApi.post.mockResolvedValue({ data: createdPatient });

      const result = await patientService.createPatientDirect(newPatient);

      expect(patientApi.post).toHaveBeenCalledWith('/patients', newPatient);
      expect(result).toEqual(createdPatient);
    });
  });

  describe('updatePatientDirect', () => {
    it('updates a patient via direct REST', async () => {
      const updatedData = { firstName: 'John', lastName: 'Updated' };
      const updatedPatient = { id: 1, ...updatedData };
      patientApi.put.mockResolvedValue({ data: updatedPatient });

      const result = await patientService.updatePatientDirect(1, updatedData);

      expect(patientApi.put).toHaveBeenCalledWith('/patients/1', updatedData);
      expect(result).toEqual(updatedPatient);
    });
  });

  describe('deletePatientDirect', () => {
    it('deletes a patient via direct REST', async () => {
      patientApi.delete.mockResolvedValue({ data: undefined });

      await patientService.deletePatientDirect(1);

      expect(patientApi.delete).toHaveBeenCalledWith('/patients/1');
    });
  });
});