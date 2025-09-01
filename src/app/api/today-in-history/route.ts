import { NextResponse } from 'next/server';
import { openai } from '@/lib/openai';
import fs from 'fs';
import path from 'path';

// 历史事件接口
interface HistoryEvent {
  year: string;
  title: string;
  description: string;
}

// 内存缓存
const memoryCache = new Map<
  string,
  { data: HistoryEvent[]; timestamp: number }
>();

// 缓存过期时间（24小时）
const CACHE_EXPIRY = 24 * 60 * 60 * 1000;

// 获取缓存目录
const getCacheDir = () => {
  const cacheDir = path.join(process.cwd(), '.cache');
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }
  return cacheDir;
};

// 获取缓存文件路径
const getCacheFilePath = (key: string) => {
  return path.join(getCacheDir(), `${key}.json`);
};

// 从文件读取缓存
const readFileCache = (key: string) => {
  try {
    const filePath = getCacheFilePath(key);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const cached = JSON.parse(content);
      return cached;
    }
  } catch (error) {
    console.error('Error reading file cache:', error);
  }
  return null;
};

// 写入文件缓存
const writeFileCache = (
  key: string,
  data: { data: HistoryEvent[]; timestamp: number }
) => {
  try {
    const filePath = getCacheFilePath(key);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing file cache:', error);
  }
};

// 获取缓存数据
const getCachedData = (key: string) => {
  const now = Date.now();

  // 首先检查内存缓存
  const memoryData = memoryCache.get(key);
  if (memoryData && now - memoryData.timestamp < CACHE_EXPIRY) {
    console.log('Cache hit (memory):', key);
    return memoryData.data;
  }

  // 检查文件缓存
  const fileData = readFileCache(key);
  if (fileData && now - fileData.timestamp < CACHE_EXPIRY) {
    console.log('Cache hit (file):', key);
    // 更新内存缓存
    memoryCache.set(key, fileData);
    return fileData.data;
  }

  console.log('Cache miss:', key);
  return null;
};

// 设置缓存数据
const setCachedData = (key: string, data: HistoryEvent[]) => {
  const cacheEntry = {
    data,
    timestamp: Date.now(),
  };

  // 设置内存缓存
  memoryCache.set(key, cacheEntry);

  // 设置文件缓存
  writeFileCache(key, cacheEntry);
};

export async function GET() {
  try {
    const today = new Date();
    const month = today.getMonth() + 1; // getMonth() returns 0-11
    const day = today.getDate();

    // 生成缓存键（基于月日）
    const cacheKey = `history-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

    // 首先检查缓存
    const cachedResult = getCachedData(cacheKey);
    if (cachedResult) {
      return NextResponse.json({
        success: true,
        date: `${month}月${day}日`,
        events: cachedResult,
        cached: true,
      });
    }

    const prompt = `请告诉我历史上的今天（${month}月${day}日）发生的3个重要历史事件。要求：
1. 每个事件包含：年份、事件名称、简短描述（不超过50字）
2. 选择有影响力的、为人熟知的历史事件
3. 时间跨度尽量分散，不要都集中在某个时期
4. 返回JSON格式，数组包含3个事件对象
5. 每个对象包含字段：year, title, description

示例格式：
[
  {
    "year": "1912",
    "title": "中华民国成立",
    "description": "孙中山在南京就任中华民国临时大总统，标志着共和制度在中国的建立。"
  }
]

请直接返回JSON数组，不要包含其他文字说明。`;

    const completion = await openai.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const content = completion.choices[0]?.message?.content?.trim();

    if (!content) {
      throw new Error('No content received from DeepSeek API');
    }

    // 尝试解析 JSON
    let events;
    try {
      events = JSON.parse(content);
    } catch {
      console.error('Failed to parse JSON from DeepSeek:', content);
      // 如果解析失败，返回默认事件
      events = [
        {
          year: '1912',
          title: '中华民国成立',
          description:
            '孙中山在南京就任中华民国临时大总统，标志着共和制度在中国的建立。',
        },
        {
          year: '1969',
          title: '阿波罗11号登月',
          description:
            '人类首次登上月球，尼尔·阿姆斯特朗成为第一个踏上月球的人。',
        },
        {
          year: '1991',
          title: '万维网诞生',
          description:
            '蒂姆·伯纳斯-李创建了世界上第一个网站，开启了互联网时代。',
        },
      ];
    }

    // 验证数据格式
    if (!Array.isArray(events) || events.length === 0) {
      throw new Error('Invalid events format from API');
    }

    // 确保每个事件都有必要的字段
    const validatedEvents = events.slice(0, 3).map(event => ({
      year: String(event.year || '未知'),
      title: String(event.title || '历史事件'),
      description: String(event.description || '暂无描述'),
    }));

    // 缓存结果
    setCachedData(cacheKey, validatedEvents);

    return NextResponse.json({
      success: true,
      date: `${month}月${day}日`,
      events: validatedEvents,
      cached: false,
    });
  } catch (error) {
    console.error('Error fetching today in history:', error);

    // 返回默认的历史事件
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();

    return NextResponse.json(
      {
        success: false,
        date: `${month}月${day}日`,
        events: [
          {
            year: '1912',
            title: '历史事件',
            description: '由于网络问题，暂时无法获取今天的历史事件。',
          },
        ],
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
