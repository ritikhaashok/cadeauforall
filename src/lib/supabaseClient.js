import { createClient } from '@supabase/supabase-js';

// Try standard env names first, then fall back to NEXT_PUBLIC_* variants (often used in Next.js setups)
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase configuration. Please set SUPABASE_URL and SUPABASE_ANON_KEY in `.env.local` and restart the dev server.' +
      ' If you used NEXT_PUBLIC_* variables, ensure they are available as NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
