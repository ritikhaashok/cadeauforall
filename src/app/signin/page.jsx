"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function signUp() {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) return alert(error.message);
    alert('Check your email for confirmation (if required)');
  }

  async function signIn() {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return alert(error.message);
    // create profile row (if needed)
    if (data?.user?.id) {
      await supabase.from('profiles').upsert({ id: data.user.id, full_name: null });
    }

    // merge guest local cart into server cart
    const guest = JSON.parse(localStorage.getItem('cart') || '[]');
    if (guest.length) {
      for (const item of guest) {
        await fetch('/api/cart/add', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(item),
        });
      }
      localStorage.removeItem('cart');
    }

    router.push('/shop');
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Sign in / Sign up</h2>

        <label className="block mb-2">Email</label>
        <input className="w-full border px-3 py-2 mb-3" value={email} onChange={(e) => setEmail(e.target.value)} />

        <label className="block mb-2">Password</label>
        <input type="password" className="w-full border px-3 py-2 mb-4" value={password} onChange={(e) => setPassword(e.target.value)} />

        <div className="flex gap-2">
          <button className="bg-sage text-white px-4 py-2 rounded" onClick={signIn} disabled={loading}>Sign in</button>
          <button className="border px-4 py-2 rounded" onClick={signUp} disabled={loading}>Create account</button>
        </div>
      </div>
    </main>
  );
}
