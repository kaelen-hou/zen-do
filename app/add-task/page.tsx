'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { ArrowLeft, Plus, Bot } from 'lucide-react'

import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { DatePicker } from '@/components/date-picker'
import { SmartTaskInput } from '@/components/smart-task-input'
import { createTaskSchema, CreateTaskInput } from '@/lib/validations'
import { createTodo } from '@/lib/todos'
import { ParsedTask } from '@/types'
import { parseISO } from 'date-fns'

const priorityOptions = [
  { value: 'low', label: '低优先级', description: '不紧急，稍后处理' },
  { value: 'medium', label: '中等优先级', description: '正常优先级任务' },
  { value: 'high', label: '高优先级', description: '重要，需要关注' },
  { value: 'urgent', label: '紧急', description: '关键任务，立即处理' },
]

const statusOptions = [
  { value: 'todo', label: '待办', description: '任务尚未开始' },
  { value: 'in-progress', label: '进行中', description: '正在处理此任务' },
  { value: 'done', label: '已完成', description: '任务已完成' },
  { value: 'archived', label: '已归档', description: '任务已归档' },
]

export default function AddTaskPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [useSmartInput, setUseSmartInput] = useState(true)

  const form = useForm<CreateTaskInput>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'medium',
      status: 'todo',
    },
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin')
    }
  }, [user, loading, router])

  const handleTaskParsed = (parsedTask: ParsedTask) => {
    // 将解析的任务数据填入表单
    form.setValue('title', parsedTask.title)
    form.setValue('description', parsedTask.description || '')
    form.setValue('priority', parsedTask.priority)
    form.setValue('status', 'todo') // 默认状态

    // 处理日期时间
    if (parsedTask.dueDate) {
      try {
        const dueDateTime = parseISO(parsedTask.dueDate)
        if (parsedTask.dueTime) {
          const [hours, minutes] = parsedTask.dueTime.split(':').map(Number)
          dueDateTime.setHours(hours, minutes)
        }
        form.setValue('dueDate', dueDateTime)
      } catch (error) {
        console.error('日期解析错误:', error)
      }
    }

    // 切换到手动编辑模式以便用户确认和修改
    setUseSmartInput(false)
  }

  const handleManualInput = () => {
    setUseSmartInput(false)
  }

  const onSubmit = async (data: CreateTaskInput) => {
    if (!user) return
    
    try {
      setIsSubmitting(true)
      setSubmitError(null)
      await createTodo(user.uid, data)
      
      // Show success message or redirect
      router.push('/dashboard?success=Task created successfully')
    } catch (error) {
      console.error('Failed to create task:', error)
      setSubmitError(
        error instanceof Error 
          ? error.message 
          : 'Failed to create task. Please check your Firebase configuration and try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6 px-4 max-w-2xl">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">创建新任务</h1>
            <p className="text-muted-foreground">使用 AI 智能解析或手动创建任务来保持高效</p>
          </div>
        </div>

        {useSmartInput ? (
          <SmartTaskInput 
            onTaskParsed={handleTaskParsed}
            onManualInput={handleManualInput}
          />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 justify-between">
                <div className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  任务详情
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setUseSmartInput(true)}
                >
                  <Bot className="h-4 w-4 mr-2" />
                  智能解析
                </Button>
              </CardTitle>
              <CardDescription>
                填写下面的信息来创建您的新任务
              </CardDescription>
            </CardHeader>
            <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>优先级</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="选择优先级" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {priorityOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                <div className="flex flex-col">
                                  <span>{option.label}</span>
                                  <span className="text-xs text-muted-foreground">
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
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="选择状态" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {statusOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                <div className="flex flex-col">
                                  <span>{option.label}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {option.description}
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          任务的当前状态
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
                  <div className="rounded-md bg-destructive/15 p-3">
                    <p className="text-sm text-destructive">{submitError}</p>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button type="submit" disabled={isSubmitting} className="flex-1">
                    {isSubmitting ? '创建中...' : '创建任务'}
                  </Button>
                  <Button type="button" variant="outline" asChild>
                    <Link href="/dashboard">取消</Link>
                  </Button>
                </div>
              </form>
            </Form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}