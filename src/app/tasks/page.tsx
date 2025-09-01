'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Loader2 } from 'lucide-react';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { TaskCard } from '@/components/task-card';
import { getTodos } from '@/lib/todos';
import { Todo } from '@/types';

export default function TasksPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin');
    }
  }, [user, loading, router]);

  const fetchTasks = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);
      const fetchedTasks = await getTodos(user.uid);
      setTasks(fetchedTasks);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      setError('Failed to load tasks. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user, fetchTasks]);

  if (loading) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="border-primary h-32 w-32 animate-spin rounded-full border-b-2"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">My Tasks</h1>
              <p className="text-muted-foreground">
                {tasks.length === 0 ? 'No tasks yet' : `${tasks.length} tasks`}
              </p>
            </div>
          </div>

          <Button asChild>
            <Link href="/add-task">
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading tasks...</span>
          </div>
        ) : error ? (
          <div className="py-12 text-center">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={fetchTasks} variant="outline">
              Try Again
            </Button>
          </div>
        ) : tasks.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-muted-foreground mb-4">
              You haven&apos;t created any tasks yet.
            </p>
            <Button asChild>
              <Link href="/add-task">
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Task
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
