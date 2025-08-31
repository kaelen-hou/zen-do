'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ModeToggle } from '@/components/mode-toggle';
import { UserAvatarDropdown } from '@/components/user-avatar-dropdown';
import { ClipboardList, Plus, BarChart3, Info } from 'lucide-react';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">ZenDo Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <ModeToggle />
              <UserAvatarDropdown />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">
              Welcome to ZenDo, {user.displayName || user.email?.split('@')[0]}!
            </h2>
            <p className="text-muted-foreground">
              Your todo management dashboard is ready. Here you can manage your tasks and stay organized.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="text-center">
                <div className="text-primary mb-4">
                  <ClipboardList className="w-8 h-8 mx-auto" />
                </div>
                <CardTitle>My Tasks</CardTitle>
                <CardDescription>View and manage your todo items</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/tasks">View Tasks →</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="text-center">
                <div className="text-secondary mb-4">
                  <Plus className="w-8 h-8 mx-auto" />
                </div>
                <CardTitle>Add Task</CardTitle>
                <CardDescription>Create a new todo item</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/add-task">Add New →</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="text-center">
                <div className="text-green-600 mb-4">
                  <BarChart3 className="w-8 h-8 mx-auto" />
                </div>
                <CardTitle>Analytics</CardTitle>
                <CardDescription>Track your productivity</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  View Stats →
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 max-w-md mx-auto">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <Info className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Todo features are coming soon! This dashboard will be your central hub for task management. Try switching between light and dark mode using the theme toggle.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}