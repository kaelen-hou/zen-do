import OpenAI from 'openai';

// 初始化 DeepSeek 客户端
const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY || '',
});

export { openai };
