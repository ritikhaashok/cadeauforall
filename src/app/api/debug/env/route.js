export async function GET() {
  const hasSupabase = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY);
  const hasNextPublic = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  return new Response(JSON.stringify({ ok: true, hasSupabase, hasNextPublic }), { headers: { 'Content-Type': 'application/json' } });
}
