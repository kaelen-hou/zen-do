import { useState, useCallback } from 'react';
import { ParseResult } from '@/shared/types';

export function useTaskParser() {
  const [isLoading, setIsLoading] = useState(false);
  const [lastResult, setLastResult] = useState<ParseResult | null>(null);

  const parseTask = useCallback(async (input: string): Promise<ParseResult> => {
    if (!input.trim()) {
      const result: ParseResult = {
        success: false,
        error: '请输入任务描述',
        rawInput: input,
      };
      setLastResult(result);
      return result;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/parse-task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input }),
      });

      const result: ParseResult = await response.json();
      setLastResult(result);
      return result;
    } catch {
      const result: ParseResult = {
        success: false,
        error: '网络错误，请重试',
        rawInput: input,
      };
      setLastResult(result);
      return result;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearResult = useCallback(() => {
    setLastResult(null);
  }, []);

  return {
    parseTask,
    isLoading,
    lastResult,
    clearResult,
  };
}
