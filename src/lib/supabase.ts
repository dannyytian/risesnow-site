import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || 
                   (globalThis as any).process?.env?.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || 
                      (globalThis as any).process?.env?.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  // 改为 warn，避免开发时终端一片红，因为某些构建阶段变量确实可能延迟注入
  console.warn("Supabase URL is temporarily missing during initialization.");
}

export const supabase = createClient(
  supabaseUrl || 'https://your-project.supabase.co', 
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