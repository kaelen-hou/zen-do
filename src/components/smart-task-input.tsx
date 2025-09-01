'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
  Bot,
  Sparkles,
  Clock,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Edit3,
  Wand2,
} from 'lucide-react';
import { useTaskParser } from '@/hooks/useTaskParser';
import { ParsedTask } from '@/types';
import { format, parseISO } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface SmartTaskInputProps {
  onTaskParsed: (task: ParsedTask) => void;
  onManualInput: () => void;
  placeholder?: string;
}

const priorityConfig = {
  low: {
    label: '低',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  },
  medium: {
    label: '中',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  },
  high: {
    label: '高',
    color:
      'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  },
  urgent: {
    label: '紧急',
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  },
};

export function SmartTaskInput({
  onTaskParsed,
  onManualInput,
  placeholder = '请输入任务描述，例如：明天下午3点完成项目验收',
}: SmartTaskInputProps) {
  const [input, setInput] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const { parseTask, isLoading, lastResult, clearResult } = useTaskParser();

  const handleParse = async () => {
    if (!input.trim()) return;

    const result = await parseTask(input);
    if (result.success) {
      setShowPreview(true);
    }
  };

  const handleConfirm = () => {
    if (lastResult?.success && lastResult.data) {
      onTaskParsed(lastResult.data);
      setInput('');
      setShowPreview(false);
      clearResult();
    }
  };

  const handleEdit = () => {
    setShowPreview(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleParse();
    }
  };

  const formatDateTime = (dateStr?: string, timeStr?: string) => {
    if (!dateStr) return null;

    const date = parseISO(dateStr);
    const dateFormat = format(date, 'yyyy-MM-dd', { locale: zhCN });
    const timeFormat = timeStr || '';

    return timeFormat ? `${dateFormat} ${timeFormat}` : dateFormat;
  };

  return (
    <Card className="border-primary/20 hover:border-primary/40 border-2 border-dashed transition-colors">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="text-primary h-5 w-5" />
          智能任务解析
          <Sparkles className="text-primary h-4 w-4 animate-pulse" />
        </CardTitle>
        <CardDescription>
          使用自然语言描述您的任务，AI 将自动解析标题、时间和优先级
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!showPreview ? (
          <>
            <div className="space-y-3">
              <Textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={placeholder}
                className="min-h-[60px] resize-none"
                disabled={isLoading}
              />

              <div className="flex gap-2">
                <Button
                  onClick={handleParse}
                  disabled={!input.trim() || isLoading}
                  className="flex-1"
                  size="sm"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      AI 解析中...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" />
                      智能解析
                    </>
                  )}
                </Button>

                <Button variant="outline" onClick={onManualInput} size="sm">
                  <Edit3 className="mr-2 h-4 w-4" />
                  手动填写
                </Button>
              </div>
            </div>

            {lastResult && !lastResult.success && (
              <div className="bg-destructive/10 border-destructive/20 rounded-lg border p-3">
                <p className="text-destructive flex items-center gap-2 text-sm">
                  <AlertTriangle className="h-4 w-4" />
                  {lastResult.error}
                </p>
              </div>
            )}

            {/* 示例提示 */}
            <div className="space-y-2">
              <p className="text-muted-foreground text-xs font-medium">
                示例输入：
              </p>
              <div className="flex flex-wrap gap-1">
                {[
                  '明天下午3点完成项目验收',
                  '这周五之前提交报告，很重要',
                  '紧急：今晚8点开会讨论方案',
                  '买牛奶和面包',
                ].map((example, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground h-auto p-1 text-xs"
                    onClick={() => setInput(example)}
                  >
                    {example}
                  </Button>
                ))}
              </div>
            </div>
          </>
        ) : (
          lastResult?.success &&
          lastResult.data && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-medium">解析完成</span>
                <Badge variant="secondary" className="text-xs">
                  置信度: {Math.round(lastResult.data.confidence * 100)}%
                </Badge>
              </div>

              <Separator />

              <div className="space-y-3">
                <div>
                  <label className="text-muted-foreground text-sm font-medium">
                    任务标题
                  </label>
                  <p className="text-lg font-semibold">
                    {lastResult.data.title}
                  </p>
                </div>

                {lastResult.data.description && (
                  <div>
                    <label className="text-muted-foreground text-sm font-medium">
                      详细描述
                    </label>
                    <p className="text-sm">{lastResult.data.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-muted-foreground text-sm font-medium">
                      优先级
                    </label>
                    <div className="mt-1">
                      <Badge
                        className={
                          priorityConfig[lastResult.data.priority].color
                        }
                      >
                        {priorityConfig[lastResult.data.priority].label}
                      </Badge>
                    </div>
                  </div>

                  {(lastResult.data.dueDate || lastResult.data.dueTime) && (
                    <div>
                      <label className="text-muted-foreground text-sm font-medium">
                        截止时间
                      </label>
                      <p className="mt-1 flex items-center gap-1 text-sm">
                        {lastResult.data.dueDate && (
                          <Calendar className="h-3 w-3" />
                        )}
                        {lastResult.data.dueTime && (
                          <Clock className="h-3 w-3" />
                        )}
                        {formatDateTime(
                          lastResult.data.dueDate,
                          lastResult.data.dueTime
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              <div className="flex gap-2">
                <Button onClick={handleConfirm} className="flex-1">
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  确认创建任务
                </Button>
                <Button variant="outline" onClick={handleEdit}>
                  <Edit3 className="mr-2 h-4 w-4" />
                  重新编辑
                </Button>
              </div>
            </div>
          )
        )}
      </CardContent>
    </Card>
  );
}
