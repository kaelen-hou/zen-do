import { openai } from './openai';
import { ParseResult, ParsedTask, Priority } from '@/types';
import { format, parseISO, isValid } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export class TaskParser {
  private static getSystemPrompt(): string {
    const today = format(new Date(), 'yyyy-MM-dd', { locale: zhCN });
    const todayWeekday = format(new Date(), 'EEEE', { locale: zhCN });

    return `你是一个智能任务解析助手。用户会输入自然语言的任务描述，你需要提取以下信息：

当前日期：${today} (${todayWeekday})

请从用户输入中提取以下信息，并以JSON格式返回：

{
  "title": "任务标题（必填，简洁描述）",
  "description": "详细描述（可选）",
  "dueDate": "截止日期，格式：YYYY-MM-DD（可选）",
  "dueTime": "截止时间，格式：HH:mm（可选）",
  "priority": "优先级：low/medium/high/urgent",
  "confidence": "解析置信度，0-1之间的小数"
}

解析规则：
1. 标题应该简洁，去掉时间信息
2. 时间解析：
   - "明天" = 明日日期
   - "后天" = 后天日期
   - "周一"到"周日" = 本周或下周对应日期
   - "下周三" = 下周三的日期
   - 具体日期：0901 = 2024-09-01, 12/25 = 2024-12-25
   - 时间：下午3点 = 15:00, 晚上8点 = 20:00, 上午10点 = 10:00
3. 优先级判断：
   - urgent: 紧急、立即、马上
   - high: 重要、关键、必须
   - medium: 一般、普通（默认）
   - low: 稍后、有空时
4. 如果没有指定时间，不要添加dueDate和dueTime
5. 置信度基于解析的确定性

只返回JSON，不要其他文字。`;
  }

  public static async parseTask(input: string): Promise<ParseResult> {
    if (!input.trim()) {
      return {
        success: false,
        error: '请输入任务描述',
        rawInput: input,
      };
    }

    try {
      const response = await openai.chat.completions.create({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: this.getSystemPrompt(),
          },
          {
            role: 'user',
            content: input,
          },
        ],
        temperature: 0.1,
        max_tokens: 500,
      });

      const content = response.choices[0]?.message?.content?.trim();

      if (!content) {
        throw new Error('OpenAI 返回空响应');
      }

      // 解析 JSON 响应
      let parsed: Record<string, unknown>;
      try {
        parsed = JSON.parse(content);
      } catch {
        // 如果直接解析失败，尝试提取JSON
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsed = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('无法解析 OpenAI 响应为 JSON');
        }
      }

      // 验证和清理解析结果
      const parsedTask = this.validateAndCleanParsedTask(parsed);

      return {
        success: true,
        data: parsedTask,
        rawInput: input,
      };
    } catch (error) {
      console.error('任务解析错误:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '解析失败',
        rawInput: input,
      };
    }
  }

  private static validateAndCleanParsedTask(
    parsed: Record<string, unknown>
  ): ParsedTask {
    // 验证必填字段
    if (!parsed.title || typeof parsed.title !== 'string') {
      throw new Error('缺少有效的任务标题');
    }

    // 验证优先级
    const validPriorities: Priority[] = ['low', 'medium', 'high', 'urgent'];
    const priority: Priority = validPriorities.includes(
      parsed.priority as Priority
    )
      ? (parsed.priority as Priority)
      : 'medium';

    // 验证日期
    let dueDate: string | undefined;
    if (parsed.dueDate && typeof parsed.dueDate === 'string') {
      try {
        const date = parseISO(parsed.dueDate);
        if (isValid(date)) {
          dueDate = format(date, 'yyyy-MM-dd');
        }
      } catch {
        // 忽略无效日期
      }
    }

    // 验证时间
    let dueTime: string | undefined;
    if (parsed.dueTime && typeof parsed.dueTime === 'string') {
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (timeRegex.test(parsed.dueTime)) {
        dueTime = parsed.dueTime;
      }
    }

    // 验证置信度
    const confidence =
      typeof parsed.confidence === 'number'
        ? Math.max(0, Math.min(1, parsed.confidence))
        : 0.7;

    return {
      title: parsed.title.trim(),
      description:
        parsed.description && typeof parsed.description === 'string'
          ? parsed.description.trim()
          : undefined,
      dueDate,
      dueTime,
      priority,
      confidence,
    };
  }

  /**
   * 获取解析示例，用于UI展示
   */
  public static getExamples(): Array<{ input: string; expected: string }> {
    return [
      {
        input: '明天下午3点完成项目验收',
        expected: '项目验收 | 明天 15:00 | 中等优先级',
      },
      {
        input: '这周五之前提交报告，很重要',
        expected: '提交报告 | 本周五 | 高优先级',
      },
      {
        input: '买牛奶和面包',
        expected: '买牛奶和面包 | 无日期 | 低优先级',
      },
      {
        input: '紧急：今晚8点开会讨论方案',
        expected: '开会讨论方案 | 今天 20:00 | 紧急',
      },
    ];
  }
}
