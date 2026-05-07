export type Role = 'CEO' | 'MANAGER' | 'EMPLOYEE';

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type Status = 'PENDING' | 'IN_PROGRESS' | 'UNDER_REVIEW' | 'COMPLETED' | 'REJECTED' | 'OVERDUE';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  profileImage?: string;
  departmentId?: string;
  department?: Department;
}

export interface Department {
  id: string;
  name: string;
  managerId?: string;
  manager?: User;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: Status;
  deadline?: string;
  attachments: string[];
  creatorId: string;
  creator: User;
  assigneeId?: string;
  assignee?: User;
  departmentId: string;
  department: Department;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  content: string;
  taskId: string;
  userId: string;
  user: User;
  createdAt: string;
}

export interface Notification {
  id: string;
  message: string;
  isRead: boolean;
  userId: string;
  createdAt: string;
}
