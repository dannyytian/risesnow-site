import { createClient } from '@supabase/supabase-js';

// 使用 ImportMetaEnv 来获取环境变量，确保在 .env 文件中定义了这些变量
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase credentials missing. Check your .env file.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * 为服务端渲染（SSR）创建一个请求相关的 Supabase 客户端。
 * 它通过对接 Astro 的 cookies 对象，使服务器能识别用户的登录状态。
 */
export const getSupabaseClient = (cookies: { get: (k: string) => any, set: Function, delete: Function }) => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      flowType: 'pkce',
      storage: {
        getItem: (key) => cookies.get(key)?.value,
        setItem: (key, value, options) => cookies.set(key, value, { path: '/', ...options }),
        removeItem: (key, options) => cookies.delete(key, { path: '/', ...options }),
      },
    },
  });
};