'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getTodos,
  getDeletedTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  restoreTodo,
  permanentlyDeleteTodo,
} from '@/lib/todos';
import { CreateTaskInput } from '@/lib/validations';
import { Todo } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

// 查询键工厂
export const todoKeys = {
  all: ['todos'] as const,
  lists: () => [...todoKeys.all, 'list'] as const,
  list: (userId: string, filters?: object) =>
    [...todoKeys.lists(), userId, filters] as const,
  deleted: (userId: string) => [...todoKeys.all, 'deleted', userId] as const,
  detail: (id: string) => [...todoKeys.all, 'detail', id] as const,
};

// 获取任务列表
export function useTodos(filters?: {
  status?: 'todo' | 'in-progress' | 'done' | 'archived';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  search?: string;
}) {
  const { user } = useAuth();

  return useQuery({
    queryKey: todoKeys.list(user?.uid || '', filters),
    queryFn: async () => {
      if (!user?.uid) throw new Error('User not authenticated');
      const todos = await getTodos(user.uid);

      // 客户端过滤
      return todos.filter(todo => {
        if (filters?.status && todo.status !== filters.status) return false;
        if (filters?.priority && todo.priority !== filters.priority)
          return false;
        if (filters?.search) {
          const searchTerm = filters.search.toLowerCase();
          return (
            todo.title.toLowerCase().includes(searchTerm) ||
            todo.description?.toLowerCase().includes(searchTerm)
          );
        }
        return true;
      });
    },
    enabled: !!user?.uid,
    staleTime: 1000 * 60, // 1分钟
  });
}

// 获取已删除的任务
export function useDeletedTodos() {
  const { user } = useAuth();

  return useQuery({
    queryKey: todoKeys.deleted(user?.uid || ''),
    queryFn: async () => {
      if (!user?.uid) throw new Error('User not authenticated');
      return getDeletedTodos(user.uid);
    },
    enabled: !!user?.uid,
    staleTime: 1000 * 60, // 1分钟
  });
}

// 创建任务
export function useCreateTodo() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: CreateTaskInput) => {
      if (!user?.uid) throw new Error('User not authenticated');
      return createTodo(user.uid, data);
    },
    onSuccess: () => {
      // 使相关查询失效，触发重新获取
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
      toast({
        title: '创建成功',
        description: '任务已创建',
      });
    },
    onError: error => {
      console.error('Create todo error:', error);
      toast({
        title: '创建失败',
        description:
          error instanceof Error ? error.message : '创建任务时发生错误',
        variant: 'destructive',
      });
    },
  });
}

// 更新任务
export function useUpdateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Todo> }) => {
      return updateTodo(id, data);
    },
    onMutate: async ({ id, data }) => {
      // 取消正在进行的查询
      await queryClient.cancelQueries({ queryKey: todoKeys.lists() });

      // 获取当前数据作为快照
      const previousTodos = queryClient.getQueriesData({
        queryKey: todoKeys.lists(),
      });

      // 乐观更新
      queryClient.setQueriesData(
        { queryKey: todoKeys.lists() },
        (oldData: Todo[] | undefined) => {
          if (!oldData) return oldData;
          return oldData.map(todo =>
            todo.id === id ? { ...todo, ...data, updatedAt: new Date() } : todo
          );
        }
      );

      return { previousTodos };
    },
    onError: (error, _variables, context) => {
      // 回滚乐观更新
      if (context?.previousTodos) {
        context.previousTodos.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast({
        title: '更新失败',
        description:
          error instanceof Error ? error.message : '更新任务时发生错误',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      toast({
        title: '更新成功',
        description: '任务已更新',
      });
    },
    onSettled: () => {
      // 重新获取数据以确保一致性
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
    },
  });
}

// 删除任务（软删除）
export function useDeleteTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTodo,
    onMutate: async todoId => {
      // 取消正在进行的查询
      await queryClient.cancelQueries({ queryKey: todoKeys.lists() });

      // 获取当前数据作为快照
      const previousTodos = queryClient.getQueriesData({
        queryKey: todoKeys.lists(),
      });

      // 乐观更新：移除任务
      queryClient.setQueriesData(
        { queryKey: todoKeys.lists() },
        (oldData: Todo[] | undefined) => {
          if (!oldData) return oldData;
          return oldData.filter(todo => todo.id !== todoId);
        }
      );

      return { previousTodos };
    },
    onError: (error, _variables, context) => {
      // 回滚乐观更新
      if (context?.previousTodos) {
        context.previousTodos.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast({
        title: '删除失败',
        description:
          error instanceof Error ? error.message : '删除任务时发生错误',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      toast({
        title: '删除成功',
        description: '任务已移至回收站',
      });
    },
    onSettled: () => {
      // 使相关查询失效
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
      queryClient.invalidateQueries({ queryKey: todoKeys.all });
    },
  });
}

// 恢复任务
export function useRestoreTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: restoreTodo,
    onSuccess: () => {
      // 使相关查询失效
      queryClient.invalidateQueries({ queryKey: todoKeys.all });
      toast({
        title: '恢复成功',
        description: '任务已恢复',
      });
    },
    onError: error => {
      toast({
        title: '恢复失败',
        description:
          error instanceof Error ? error.message : '恢复任务时发生错误',
        variant: 'destructive',
      });
    },
  });
}

// 永久删除任务
export function usePermanentlyDeleteTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: permanentlyDeleteTodo,
    onMutate: async todoId => {
      // 取消正在进行的查询
      await queryClient.cancelQueries({ queryKey: todoKeys.deleted(todoId) });

      // 获取当前数据作为快照
      const previousTodos = queryClient.getQueryData(todoKeys.deleted(todoId));

      // 乐观更新：移除任务
      queryClient.setQueryData(
        todoKeys.deleted(todoId),
        (oldData: Todo[] | undefined) => {
          if (!oldData) return oldData;
          return oldData.filter(todo => todo.id !== todoId);
        }
      );

      return { previousTodos };
    },
    onError: (error, _variables, context) => {
      // 回滚乐观更新
      if (context?.previousTodos) {
        queryClient.setQueryData(
          todoKeys.deleted(_variables),
          context.previousTodos
        );
      }
      toast({
        title: '删除失败',
        description:
          error instanceof Error ? error.message : '永久删除任务时发生错误',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      toast({
        title: '删除成功',
        description: '任务已永久删除',
      });
    },
    onSettled: () => {
      // 使相关查询失效
      queryClient.invalidateQueries({ queryKey: todoKeys.all });
    },
  });
}
