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
interface AstroCookies { // 修正 AstroCookies 接口以匹配 Astro 的实际行为
  get: (key: string) => { value: string } | undefined;
  set: (key: string, value: string, options?: Record<string, any>) => void;
  delete: (key: string, options?: Record<string, any>) => void;
}

export const getSupabaseClient = (cookies: AstroCookies) => {
  // 如果 URL 缺失，createClient 内部会报错，这里提供占位符确保不会在初始化阶段就崩溃
  const url = supabaseUrl || 'https://placeholder.supabase.co';
  const key = supabaseAnonKey || '';

  const supabase = createClient(url, key, {
    auth: {
      flowType: 'pkce',
      storage: {
        getItem: (key: string) => cookies.get(key)?.value ?? null, // 这里是正确的，因为 Astro.cookies.get 返回 { value: string } | undefined
        setItem: (key: string, value: string) => {
          // 如果响应头已经发送，跳过设置。Astro SSR 的流式渲染常导致此问题。
          // 这是一个安全卫体。
          // 在 Astro SSR 中，Astro.cookies.set 应该在响应头发送前完成。
          // 如果这里被调用，说明时机不对，但我们不应该阻止它，而是让 Astro 警告。
          try {
            cookies.set(key, value, {
              path: '/',
              secure: true,      // Supabase Auth 建议始终开启
              sameSite: 'lax',
              httpOnly: false,
              maxAge: 604800,    // 显式设置 7 天 (秒)
              domain: undefined, // 确保不被锁定在特定子域名
            })
          } catch (_e) {
            // Silence error if headers are already sent during streaming
          }
        },
        removeItem: (key: string) => cookies.delete(key, { path: '/' }),
      },
    },
  });

  return supabase;
};