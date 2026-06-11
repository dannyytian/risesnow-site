/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    session: import('@supabase/supabase-js').Session | null;
    user: import('@supabase/supabase-js').User | null;
    [key: string]: any; // 作为一个后备，防止其他中间件注入时报错
  }
}