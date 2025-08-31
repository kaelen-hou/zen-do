import { NextRequest, NextResponse } from 'next/server';
import { TaskParser } from '@/lib/task-parser';

export async function POST(request: NextRequest) {
  try {
    const { input } = await request.json();

    if (!input || typeof input !== 'string') {
      return NextResponse.json(
        { success: false, error: '请提供有效的输入内容' },
        { status: 400 }
      );
    }

    const result = await TaskParser.parseTask(input);
    return NextResponse.json(result);

  } catch (error) {
    console.error('API 解析错误:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: '服务器解析错误',
        rawInput: ''
      },
      { status: 500 }
    );
  }
}