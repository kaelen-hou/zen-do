export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type TodoStatus = 'todo' | 'in-progress' | 'done' | 'archived';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  dueDate?: Date | null;
  priority: Priority;
  status: TodoStatus;
  attachments: string[];
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface UserPresence {
  uid: string;
  status: 'online' | 'offline';
  lastSeen: number;
}

export interface ParsedTask {
  title: string;
  description?: string;
  dueDate?: string; // ISO string format
  dueTime?: string; // HH:mm format
  priority: Priority;
  confidence: number; // 0-1, 解析置信度
}

export interface ParseResult {
  success: boolean;
  data?: ParsedTask;
  error?: string;
  rawInput: string;
}
