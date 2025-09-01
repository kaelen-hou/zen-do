'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { DatePicker } from '@/components/date-picker';
import { createTaskSchema, CreateTaskInput } from '@/lib/validations';
import { updateTodo, getTodos } from '@/lib/todos';
import { Todo } from '@/types';

const priorityOptions = [
  { value: 'low', label: '低优先级', description: '不紧急，稍后处理' },
  { value: 'medium', label: '中等优先级', description: '正常优先级任务' },
  { value: 'high', label: '高优先级', description: '重要，需要关注' },
  { value: 'urgent', label: '紧急', description: '关键任务，立即处理' },
];

const statusOptions = [
  { value: 'todo', label: '待办', description: '任务尚未开始' },
  { value: 'in-progress', label: '进行中', description: '正在处理此任务' },
  { value: 'done', label: '已完成', description: '任务已完成' },
  { value: 'archived', label: '已归档', description: '任务已归档' },
];

export default function EditTaskPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const taskId = params.id as string;

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
      setSubmitError('加载任务失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  }, [user, taskId, router, form]);

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

      router.push('/tasks?success=任务更新成功');
    } catch (error) {
      console.error('Failed to update task:', error);
      setSubmitError(
        error instanceof Error ? error.message : '更新任务失败，请稍后重试'
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
          <span>加载中...</span>
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
            <h1 className="text-3xl font-bold">编辑任务</h1>
            <p className="text-muted-foreground">修改任务信息并保持高效</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Save className="h-5 w-5" />
              任务信息
            </CardTitle>
            <CardDescription>更新下面的信息来修改您的任务</CardDescription>
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
                      <FormLabel>任务标题 *</FormLabel>
                      <FormControl>
                        <Input placeholder="输入任务标题..." {...field} />
                      </FormControl>
                      <FormDescription>
                        为您的任务起一个清晰、简洁的标题
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
                      <FormLabel>任务描述</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="添加关于此任务的更多详细信息..."
                          className="resize-none"
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        可选：添加关于任务的更多上下文或详细信息
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
                        <FormLabel>优先级</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="选择优先级" />
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
                          此任务的紧急程度如何？
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
                        <FormLabel>状态</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="选择状态" />
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
                        <FormDescription>任务的当前状态</FormDescription>
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
                      <FormLabel>截止日期</FormLabel>
                      <FormControl>
                        <DatePicker
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="选择截止日期"
                        />
                      </FormControl>
                      <FormDescription>
                        可选：此任务应该何时完成？
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
                        保存中...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        保存更改
                      </>
                    )}
                  </Button>
                  <Button type="button" variant="outline" asChild>
                    <Link href="/tasks">取消</Link>
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
