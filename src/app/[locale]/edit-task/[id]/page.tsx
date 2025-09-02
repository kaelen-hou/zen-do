'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useRouter, Link } from '@/i18n/routing';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

import { useAuth } from '@/features/auth';
import { useTranslations } from 'next-intl';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import DatePicker from '@/shared/components/DatePickerLazy';
import {
  createTaskSchema,
  CreateTaskInput,
} from '@/shared/utils/lib/validations';
import { updateTodo, getTodos } from '@/features/tasks';
import { Todo } from '@/shared/types';

export default function EditTaskPage() {
  const t = useTranslations();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const taskId = params.id as string;

  const priorityOptions = [
    {
      value: 'low',
      label: t('priorities.low'),
      description: t('priorities.lowDesc'),
    },
    {
      value: 'medium',
      label: t('priorities.medium'),
      description: t('priorities.mediumDesc'),
    },
    {
      value: 'high',
      label: t('priorities.high'),
      description: t('priorities.highDesc'),
    },
    {
      value: 'urgent',
      label: t('priorities.urgent'),
      description: t('priorities.urgentDesc'),
    },
  ];

  const statusOptions = [
    {
      value: 'todo',
      label: t('statuses.todo'),
      description: t('statuses.todoDesc'),
    },
    {
      value: 'in-progress',
      label: t('statuses.inProgress'),
      description: t('statuses.inProgressDesc'),
    },
    {
      value: 'done',
      label: t('statuses.done'),
      description: t('statuses.doneDesc'),
    },
    {
      value: 'archived',
      label: t('statuses.archived'),
      description: t('statuses.archivedDesc'),
    },
  ];

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [task, setTask] = useState<Todo | null>(null);

  const form = useForm<CreateTaskInput>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'medium',
      status: 'todo',
    },
  });

  const loadTask = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const todos = await getTodos(user.uid);
      const foundTask = todos.find(t => t.id === taskId);

      if (!foundTask) {
        router.push('/tasks?error=Task not found');
        return;
      }

      setTask(foundTask);

      // 填充表单数据
      form.reset({
        title: foundTask.title,
        description: foundTask.description || '',
        priority: foundTask.priority,
        status: foundTask.status,
        dueDate: foundTask.dueDate || undefined,
      });
    } catch (error) {
      console.error('Failed to load task:', error);
      setSubmitError(t('editTask.loadingTask'));
    } finally {
      setLoading(false);
    }
  }, [user, taskId, router, form, t]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin');
      return;
    }

    if (user && taskId) {
      loadTask();
    }
  }, [user, authLoading, taskId, router, loadTask]);

  const onSubmit = async (data: CreateTaskInput) => {
    if (!user || !task) return;

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      await updateTodo(task.id, {
        title: data.title,
        description: data.description,
        priority: data.priority,
        status: data.status,
        dueDate: data.dueDate || null,
      });

      router.push(
        `/tasks?success=${encodeURIComponent(t('editTask.taskUpdatedSuccess'))}`
      );
    } catch (error) {
      console.error('Failed to update task:', error);
      setSubmitError(
        error instanceof Error ? error.message : t('editTask.updateTaskFailed')
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>{t('common.loading')}</span>
        </div>
      </div>
    );
  }

  if (!user || !task) {
    return null;
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto max-w-2xl px-4 py-6">
        <div className="mb-6 flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/tasks">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{t('editTask.title')}</h1>
            <p className="text-muted-foreground">{t('editTask.description')}</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Save className="h-5 w-5" />
              {t('editTask.taskInfo')}
            </CardTitle>
            <CardDescription>{t('editTask.updateInfo')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('editTask.taskTitleRequired')}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t('editTask.taskTitlePlaceholder')}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t('editTask.clearTitle')}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('editTask.taskDescription')}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t('editTask.taskDescriptionPlaceholder')}
                          className="resize-none"
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t('editTask.optionalContext')}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('editTask.priority')}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={t('priorities.selectPriority')}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {priorityOptions.map(option => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                <div className="flex flex-col">
                                  <span>{option.label}</span>
                                  <span className="text-muted-foreground text-xs">
                                    {option.description}
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          {t('editTask.priorityQuestion')}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('editTask.status')}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={t('statuses.selectStatus')}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {statusOptions.map(option => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                <div className="flex flex-col">
                                  <span>{option.label}</span>
                                  <span className="text-muted-foreground text-xs">
                                    {option.description}
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          {t('editTask.statusCurrent')}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('editTask.dueDate')}</FormLabel>
                      <FormControl>
                        <DatePicker
                          value={field.value}
                          onChange={field.onChange}
                          placeholder={t('editTask.selectDueDate')}
                        />
                      </FormControl>
                      <FormDescription>
                        {t('editTask.dueDateOptional')}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {submitError && (
                  <div className="bg-destructive/15 rounded-md p-3">
                    <p className="text-destructive text-sm">{submitError}</p>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t('editTask.saving')}
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        {t('editTask.saveChanges')}
                      </>
                    )}
                  </Button>
                  <Button type="button" variant="outline" asChild>
                    <Link href="/tasks">{t('editTask.cancel')}</Link>
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
