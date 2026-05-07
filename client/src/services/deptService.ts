import api from './api';
import { Department } from '@/types';

export const deptService = {
  getDepartments: async () => {
    const response = await api.get<Department[]>('/departments');
    return response.data;
  },
  createDepartment: async (deptData: any) => {
    const response = await api.post<Department>('/departments', deptData);
    return response.data;
  }
};
