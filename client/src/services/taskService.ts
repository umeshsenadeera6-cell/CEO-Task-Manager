import api from './api';
import { Task, Status } from '@/types';

export const taskService = {
  getTasks: async (filters?: any) => {
    const response = await api.get<Task[]>('/tasks', { params: filters });
    return response.data;
  },
  createTask: async (taskData: any) => {
    const response = await api.post<Task>('/tasks', taskData);
    return response.data;
  },
  updateStatus: async (id: string, status: Status) => {
    const response = await api.patch<Task>(`/tasks/${id}/status`, { status });
    return response.data;
  }
};
