export interface Todo {
  id: string;
  title: string;
  description?: string;
  dueDate?: Date | null;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in-progress' | 'done' | 'archived';
  attachments: string[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  userId: string;
}

export interface TaskFilters {
  status?: 'todo' | 'in-progress' | 'done' | 'archived';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  search?: string;
}

export interface ParsedTask {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: Date;
}
