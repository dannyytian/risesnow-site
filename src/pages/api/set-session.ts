import type { APIRoute } from 'astro';
import { getSupabaseClient } from '../../lib/supabase';

export const POST: APIRoute = async ({ request, cookies }) => {
  const body = await request.json().catch(() => ({}));
  const { event, session } = body;

  if (!event || !session || !session.access_token) {
    return new Response(JSON.stringify({ message: 'Missing required session properties' }), { status: 400 });
  }

  if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session) {
    // 使用统一的客户端工厂函数
    const supabase = getSupabaseClient(cookies);
    
    // 调用 setSession 会自动触发 supabase.ts 中定义的 storage.setItem 逻辑
    await supabase.auth.setSession({
      access_token: session.access_token,
      refresh_token: session.refresh_token
    });

    return new Response(JSON.stringify({ message: 'Session set' }), { status: 200 });
  }

  return new Response(JSON.stringify({ message: 'Invalid session data' }), { status: 400 });
};