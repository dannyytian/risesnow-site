import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, cookies }) => {
  const { event, session } = await request.json();

  if (event === 'SIGNED_IN' && session) {
    // Set the access token and refresh token in Astro cookies
    // These cookie names are what Supabase's server-side client expects to read
    cookies.set('sb-access-token', session.access_token, {
      path: '/',
      secure: import.meta.env.PROD, // 仅在生产环境启用安全传输
      httpOnly: true, // Prevent client-side JavaScript access
      sameSite: 'lax',
      maxAge: session.expires_in,
    });
    cookies.set('sb-refresh-token', session.refresh_token, {
      path: '/',
      secure: import.meta.env.PROD, // 仅在生产环境启用安全传输
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // Refresh token typically lasts longer, e.g., 7 days
    });

    return new Response(JSON.stringify({ message: 'Session set' }), { status: 200 });
  }

  return new Response(JSON.stringify({ message: 'Invalid session data' }), { status: 400 });
};