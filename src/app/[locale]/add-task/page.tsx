'use client';

import { useEffect, useState } from 'react';
import { useRouter, Link } from '@/i18n/routing';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Plus, Bot } from 'lucide-react';
import { PageHeader } from '@/shared/components/common/page-header';

import { useAuth } from '@/features/auth';
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
import { DatePicker } from '@/shared/components';
import { SmartTaskInput } from '@/features/tasks';
import {
  createTaskSchema,
  CreateTaskInput,
} from '@/shared/utils/lib/validations';
import { useCreateTodo } from '@/features/tasks';
import { ParsedTask } from '@/shared/types';
import { parseISO } from 'date-fns';
import { useTranslations } from 'next-intl';

// Priority and status options will be defined inside component to use translations

export default function AddTaskPage() {
  const t = useTranslations();
  const { user, loading } = useAuth();
  const router = useRouter();

  const priorityOptions = [
    {
      value: 'low',
      label: t('priorities.low'),
      description: t('priorities.low'),
    },
    {
      value: 'medium',
      label: t('priorities.medium'),
      description: t('priorities.medium'),
    },
    {
      value: 'high',
      label: t('priorities.high'),
      description: t('priorities.high'),
    },
    {
      value: 'urgent',
      label: t('priorities.urgent'),
      description: t('priorities.urgent'),
    },
  ];

  const statusOptions = [
    {
      value: 'todo',
      label: t('statuses.todo'),
      description: t('statuses.todo'),
    },
    {
      value: 'in-progress',
      label: t('statuses.inProgress'),
      description: t('statuses.inProgress'),
    },
    {
      value: 'done',
      label: t('statuses.done'),
      description: t('statuses.done'),
    },
    {
      value: 'archived',
      label: t('statuses.archived'),
      description: t('statuses.archived'),
    },
  ];
  const [useSmartInput, setUseSmartInput] = useState(true);
  const createMutation = useCreateTodo();

  const form = useForm<CreateTaskInput>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'medium',
      status: 'todo',
    },
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin');
    }
  }, [user, loading, router]);

  const handleTaskParsed = (parsedTask: ParsedTask) => {
    // 将解析的任务数据填入表单
    form.setValue('title', parsedTask.title);
    form.setValue('description', parsedTask.description || '');
    form.setValue('priority', parsedTask.priority);
    form.setValue('status', 'todo'); // 默认状态

    // 处理日期时间
    if (parsedTask.dueDate) {
      try {
        const dueDateTime = parseISO(parsedTask.dueDate);
        if (parsedTask.dueTime) {
          const [hours, minutes] = parsedTask.dueTime.split(':').map(Number);
          dueDateTime.setHours(hours, minutes);
        }
        form.setValue('dueDate', dueDateTime);
      } catch (error) {
        console.error('Date parse error:', error);
      }
    }

    // 切换到手动编辑模式以便用户确认和修改
    setUseSmartInput(false);
  };

  const handleManualInput = () => {
    setUseSmartInput(false);
  };

  const onSubmit = async (data: CreateTaskInput) => {
    if (!user) return;

    try {
      await createMutation.mutateAsync(data);
      // 成功创建后重定向到仪表板
      router.push('/dashboard?success=Task created successfully');
    } catch (error) {
      console.error('Failed to create task:', error);
      // 错误处理已在 mutation 中处理，显示 toast
    }
  };

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
      <div className="container mx-auto max-w-2xl px-4 py-6">
        <PageHeader
          title={t('addTask.title')}
          description={t('addTask.description')}
          icon={Plus}
          actions={[
            {
              label: t('common.cancel'),
              icon: ArrowLeft,
              variant: 'outline',
              href: '/dashboard',
            },
          ]}
        />

        {useSmartInput ? (
          <SmartTaskInput
            onTaskParsed={handleTaskParsed}
            onManualInput={handleManualInput}
          />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  {t('addTask.title')}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setUseSmartInput(true)}
                >
                  <Bot className="mr-2 h-4 w-4" />
                  {t('addTask.createTask')}
                </Button>
              </CardTitle>
              <CardDescription>{t('addTask.description')}</CardDescription>
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
                        <FormLabel>{t('addTask.taskTitle')} *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t('addTask.taskTitlePlaceholder')}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          {t('addTask.taskTitlePlaceholder')}
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
                        <FormLabel>{t('addTask.taskDescription')}</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={t(
                              'addTask.taskDescriptionPlaceholder'
                            )}
                            className="resize-none"
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          {t('addTask.taskDescriptionPlaceholder')}
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
                          <FormLabel>{t('addTask.priority')}</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={t('addTask.priority')}
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
                            {t('addTask.priority')}
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
                          <FormLabel>{t('addTask.status')}</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={t('addTask.status')}
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
                            {t('addTask.status')}
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
                        <FormLabel>{t('addTask.dueDate')}</FormLabel>
                        <FormControl>
                          <DatePicker
                            value={field.value}
                            onChange={field.onChange}
                            placeholder={t('addTask.selectDate')}
                          />
                        </FormControl>
                        <FormDescription>
                          {t('addTask.dueDateOptional')}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {createMutation.error && (
                    <div className="bg-destructive/15 rounded-md p-3">
                      <p className="text-destructive text-sm">
                        {createMutation.error.message}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="submit"
                      disabled={createMutation.isPending}
                      className="flex-1"
                    >
                      {createMutation.isPending
                        ? t('addTask.creating')
                        : t('addTask.createTask')}
                    </Button>
                    <Button type="button" variant="outline" asChild>
                      <Link href="/dashboard">{t('common.cancel')}</Link>
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
