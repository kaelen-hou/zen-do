'use client';

import { create } from 'zustand';

// UI 状态接口
interface UIState {
  // 全局加载状态
  isLoading: boolean;
  loadingMessage?: string;

  // 侧边栏状态
  sidebarOpen: boolean;

  // 模态框状态
  modals: {
    addTask: boolean;
    editTask: boolean;
    deleteConfirm: boolean;
    settings: boolean;
  };

  // 任务过滤器状态
  taskFilters: {
    status?: 'todo' | 'in-progress' | 'done' | 'archived';
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    search?: string;
  };

  // Actions
  setLoading: (loading: boolean, message?: string) => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setModal: (modal: keyof UIState['modals'], open: boolean) => void;
  setTaskFilters: (filters: Partial<UIState['taskFilters']>) => void;
  resetTaskFilters: () => void;
}

export const useUIStore = create<UIState>(set => ({
  // 初始状态
  isLoading: false,
  loadingMessage: undefined,
  sidebarOpen: false,

  modals: {
    addTask: false,
    editTask: false,
    deleteConfirm: false,
    settings: false,
  },

  taskFilters: {},

  // Actions
  setLoading: (loading: boolean, message?: string) =>
    set({ isLoading: loading, loadingMessage: message }),

  setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),

  toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen })),

  setModal: (modal, open) =>
    set(state => ({
      modals: { ...state.modals, [modal]: open },
    })),

  setTaskFilters: filters =>
    set(state => ({
      taskFilters: { ...state.taskFilters, ...filters },
    })),

  resetTaskFilters: () => set({ taskFilters: {} }),
}));

// 向后兼容的导出
export const useGlobalLoading = () => {
  const { isLoading, loadingMessage, setLoading } = useUIStore();
  return {
    isLoading,
    message: loadingMessage,
    setLoading,
  };
};
