export interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
}

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  href: string;
  description: string;
  color: string;
}
