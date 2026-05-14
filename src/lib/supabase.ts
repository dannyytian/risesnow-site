import { createClient } from '@supabase/supabase-js';

// 使用 ImportMetaEnv 来获取环境变量，确保在 .env 文件中定义了这些变量
// const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
// const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

// if (!supabaseUrl || !supabaseAnonKey) {
//   console.warn("Supabase credentials missing. Check your .env file.");
// }
// 尝试两种方式读取，增加兼容性
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || 
                   (globalThis as any).process?.env?.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || 
                      (globalThis as any).process?.env?.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  // 这行日志会出现在你刚才看到的 Real-time Logs 里，帮我们最终确认
  console.error("Critical: PUBLIC_SUPABASE_URL is missing from environment!");
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || '',
  {
    auth: { persistSession: false }
  }
);
/**
 * 为服务端渲染（SSR）创建一个请求相关的 Supabase 客户端。
 * 它通过对接 Astro 的 cookies 对象，使服务器能识别用户的登录状态。
 */
export const getSupabaseClient = (cookies: { get: (k: string) => any, set: Function, delete: Function }) => {
  // 如果 URL 缺失，createClient 内部会报错，这里提供占位符确保不会在初始化阶段就崩溃
  const url = supabaseUrl || 'https://placeholder.supabase.co';
  const key = supabaseAnonKey || '';

  return createClient(url, key, {
    auth: {
      flowType: 'pkce',
      storage: {
        getItem: (key) => cookies.get(key)?.value,
        setItem: (key, value, options) => {
          cookies.set(key, value, {
            path: '/',
            secure: import.meta.env.PROD, // 生产环境开启，本地开发关闭以增加兼容性
            sameSite: 'lax',   // 允许在重定向时携带 Cookie
            httpOnly: false,   // 允许前端 SDK 访问 Auth 状态
            maxAge: 60 * 60 * 24 * 7, // 显式设置 7 天有效期
            ...options 
          })
        },
        removeItem: (key, options) => cookies.delete(key, { path: '/', ...options }),
      },
    },
  });
};