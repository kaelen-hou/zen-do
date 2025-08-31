"use client"

import { format } from 'date-fns'
import { Calendar, Clock, Flag } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Todo } from '@/types'
import { cn } from '@/lib/utils'

interface TaskCardProps {
  task: Todo
  className?: string
}

const priorityConfig = {
  low: { label: 'Low', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
  medium: { label: 'Medium', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' },
  high: { label: 'High', className: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300' },
  urgent: { label: 'Urgent', className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' },
}

const statusConfig = {
  todo: { label: 'To Do', className: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300' },
  'in-progress': { label: 'In Progress', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
  done: { label: 'Done', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
  archived: { label: 'Archived', className: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300' },
}

export function TaskCard({ task, className }: TaskCardProps) {
  return (
    <Card className={cn('hover:shadow-md transition-shadow', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="line-clamp-2">{task.title}</CardTitle>
          <div className="flex gap-1 flex-shrink-0">
            <Badge 
              variant="secondary" 
              className={priorityConfig[task.priority].className}
            >
              <Flag className="h-3 w-3 mr-1" />
              {priorityConfig[task.priority].label}
            </Badge>
          </div>
        </div>
        {task.description && (
          <CardDescription className="line-clamp-3">
            {task.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <Badge className={statusConfig[task.status].className}>
            {statusConfig[task.status].label}
          </Badge>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {task.dueDate && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {format(task.dueDate, 'MMM d')}
              </div>
            )}
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {format(task.createdAt, 'MMM d')}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}