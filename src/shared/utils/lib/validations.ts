import * as z from 'zod';

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters'),
  description: z.string().optional(),
  dueDate: z.date().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent'] as const),
  status: z.enum(['todo', 'in-progress', 'done', 'archived'] as const),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
