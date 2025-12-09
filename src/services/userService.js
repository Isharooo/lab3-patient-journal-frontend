import { patientApi } from './api';

export const userService = {
  getAllUsers: async () => {
    const response = await patientApi.get('/users');
    return response.data;
  },

  getUserById: async (id) => {
    const response = await patientApi.get(`/users/${id}`);
    return response.data;
  },

  getUsersByRole: async (role) => {
    const response = await patientApi.get(`/users/role/${role}`);
    return response.data;
  },
};
