'use client';

import { queryClient } from './query-client';

import type { Todo } from '@/shared/types';
import type { CreateTaskInput } from '@/shared/utils/lib/validations';

interface CreateMutationData {
  userId: string;
  taskData: CreateTaskInput;
}

interface UpdateMutationData {
  id: string;
  updates: Partial<Todo>;
}

interface DeleteMutationData {
  id: string;
}

export interface QueuedMutation {
  id: string;
  type: 'CREATE' | 'UPDATE' | 'DELETE' | 'RESTORE' | 'PERMANENT_DELETE';
  data: CreateMutationData | UpdateMutationData | DeleteMutationData;
  timestamp: number;
  retryCount: number;
}

class OfflineQueue {
  private storageKey = 'zen-do-offline-queue';
  private queue: QueuedMutation[] = [];
  private isProcessing = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.loadQueue();
      this.setupOnlineListener();
    }
  }

  private loadQueue() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.queue = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load offline queue:', error);
      this.queue = [];
    }
  }

  private saveQueue() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.queue));
    } catch (error) {
      console.error('Failed to save offline queue:', error);
    }
  }

  private setupOnlineListener() {
    window.addEventListener('online', () => {
      console.log('Back online, processing queued mutations...');
      this.processQueue();
    });
  }

  async addToQueue(
    mutation: Omit<QueuedMutation, 'id' | 'timestamp' | 'retryCount'>
  ) {
    const queuedMutation: QueuedMutation = {
      ...mutation,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      retryCount: 0,
    };

    this.queue.push(queuedMutation);
    this.saveQueue();

    console.log('Added mutation to offline queue:', queuedMutation);

    // Try to process immediately if online
    if (navigator.onLine) {
      this.processQueue();
    }
  }

  async processQueue() {
    if (this.isProcessing || this.queue.length === 0 || !navigator.onLine) {
      return;
    }

    this.isProcessing = true;
    const processedItems: string[] = [];

    try {
      for (const mutation of this.queue) {
        try {
          await this.processMutation(mutation);
          processedItems.push(mutation.id);
          console.log('Successfully processed queued mutation:', mutation.id);
        } catch (error) {
          mutation.retryCount++;
          console.error(
            `Failed to process mutation ${mutation.id} (attempt ${mutation.retryCount}):`,
            error
          );

          // Remove mutations that have failed too many times
          if (mutation.retryCount >= 3) {
            processedItems.push(mutation.id);
            console.warn(
              `Removing mutation ${mutation.id} after 3 failed attempts`
            );
          }
        }
      }

      // Remove processed items from queue
      this.queue = this.queue.filter(item => !processedItems.includes(item.id));
      this.saveQueue();

      // Invalidate relevant queries to refresh data
      if (processedItems.length > 0) {
        queryClient.invalidateQueries({ queryKey: ['todos'] });
      }
    } finally {
      this.isProcessing = false;
    }
  }

  private async processMutation(mutation: QueuedMutation) {
    // Import Firebase functions dynamically to avoid circular dependencies
    const {
      createTodo,
      updateTodo,
      deleteTodo,
      restoreTodo,
      permanentlyDeleteTodo,
    } = await import('@/features/tasks');

    switch (mutation.type) {
      case 'CREATE': {
        const createData = mutation.data as CreateMutationData;
        return await createTodo(createData.userId, createData.taskData);
      }

      case 'UPDATE': {
        const updateData = mutation.data as UpdateMutationData;
        return await updateTodo(updateData.id, updateData.updates);
      }

      case 'DELETE':
      case 'RESTORE':
      case 'PERMANENT_DELETE': {
        const deleteData = mutation.data as DeleteMutationData;
        switch (mutation.type) {
          case 'DELETE':
            return await deleteTodo(deleteData.id);
          case 'RESTORE':
            return await restoreTodo(deleteData.id);
          case 'PERMANENT_DELETE':
            return await permanentlyDeleteTodo(deleteData.id);
        }
        break;
      }

      default:
        throw new Error(`Unknown mutation type: ${mutation.type}`);
    }
  }

  getQueueLength(): number {
    return this.queue.length;
  }

  clearQueue() {
    this.queue = [];
    this.saveQueue();
  }
}

export const offlineQueue = new OfflineQueue();
