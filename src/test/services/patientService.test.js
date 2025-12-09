import { describe, it, expect, vi, beforeEach } from 'vitest';
import { patientService } from '../../services/patientService';
import { patientApi } from '../../services/api';

vi.mock('../../services/api', () => ({
  patientApi: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
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

  describe('createPatient', () => {
    it('creates a new patient', async () => {
      const newPatient = { firstName: 'John', lastName: 'Doe' };
      const createdPatient = { id: 1, ...newPatient };
      patientApi.post.mockResolvedValue({ data: createdPatient });

      const result = await patientService.createPatient(newPatient);

      expect(patientApi.post).toHaveBeenCalledWith('/patients', newPatient);
      expect(result).toEqual(createdPatient);
    });
  });

  describe('updatePatient', () => {
    it('updates an existing patient', async () => {
      const updatedData = { firstName: 'John', lastName: 'Updated' };
      const updatedPatient = { id: 1, ...updatedData };
      patientApi.put.mockResolvedValue({ data: updatedPatient });

      const result = await patientService.updatePatient(1, updatedData);

      expect(patientApi.put).toHaveBeenCalledWith('/patients/1', updatedData);
      expect(result).toEqual(updatedPatient);
    });
  });
});
