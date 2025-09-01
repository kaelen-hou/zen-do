'use client';

import { create } from 'zustand';

interface GlobalLoadingState {
  isLoading: boolean;
  message?: string;
  setLoading: (loading: boolean, message?: string) => void;
}

export const useGlobalLoading = create<GlobalLoadingState>(set => ({
  isLoading: false,
  message: undefined,
  setLoading: (loading: boolean, message?: string) =>
    set({ isLoading: loading, message }),
}));
