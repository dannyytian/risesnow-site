import { defineMiddleware } from 'astro:middleware';
import { getSupabaseClient } from './lib/supabase';

// 定义一个认证中间件
export const onRequest = defineMiddleware(async (context, next) => {
  const { cookies, locals, url, redirect } = context;
  const supabase = getSupabaseClient(cookies);

  // 1. 统一使用 getUser()，它最安全且会自动处理单次 Token 刷新
  const { data: { user } } = await supabase.auth.getUser();

  // 2. 注入 locals。getSession 会从本地缓存获取刚才 getUser 拿到的 session
  locals.user = user ?? null;
  
  if (user) {
    const { data: { session } } = await supabase.auth.getSession();
    locals.session = session ?? null;
  } else {
    locals.session = null;
  }

  // 如果用户未登录，且访问的是受保护的路由，则重定向到登录页
  const protectedRoutes = ['/profile', '/activities']; 
  const isProtectedRoute = protectedRoutes.some(route => url.pathname.startsWith(route));

  if (!user && isProtectedRoute) { // 检查 locals.user 是否存在
    // 如果用户尝试访问受保护的路由，但未登录，则重定向
    return redirect('/login');
  }

  // 继续处理请求
  return next();
});