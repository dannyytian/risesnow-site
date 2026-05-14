import type { APIRoute } from 'astro';
import { getSupabaseClient } from '../../lib/supabase';

export const POST: APIRoute = async ({ cookies }) => {
  try {
    const supabase = getSupabaseClient(cookies);
    
    // 这会自动触发 supabase.ts 中定义的 storage.removeItem 逻辑
    // 从而删除正确的 Cookie 键名并应用相同的 path 配置
    await supabase.auth.signOut();

    return new Response(JSON.stringify({ message: 'Session cleared' }), { status: 200 });
  } catch (err) {
    console.error('Sign out error:', err);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
};