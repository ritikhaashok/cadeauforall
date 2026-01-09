'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function ProductCustomizer({ productId, price }) {
  const [customText, setCustomText] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [saving, setSaving] = useState(false);

  async function getAccessToken() {
    const { data } = await supabase.auth.getSession();
    return data?.session?.access_token || null;
  }

  async function addToServerCart() {
    setSaving(true);
    try {
      const token = await getAccessToken();
      if (!token) throw new Error('Not signed in');

      // call server endpoint which expects Authorization Bearer token
      const res = await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
        body: JSON.stringify({ productId, quantity: Number(quantity), price, customText }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Add failed');

      alert('Added to your cart.');
    } catch (err) {
      console.error(err);
      alert('Could not add to cart: ' + err.message);
    } finally {
      setSaving(false);
    }
  }

  function addToLocalCart() {
    setSaving(true);
    try {
      const existing = JSON.parse(localStorage.getItem('cart') || '[]');
      const item = { productId, customText, quantity: Number(quantity), price };
      existing.push(item);
      localStorage.setItem('cart', JSON.stringify(existing));
      // simple feedback
      alert('Added to cart (local demo).');
    } catch (err) {
      console.error(err);
      alert('Could not add to cart. See console.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-6">
      <label className="block text-sm font-medium mb-1">Customization</label>
      <input
        type="text"
        value={customText}
        onChange={(e) => setCustomText(e.target.value)}
        placeholder="Enter text to engrave or print"
        className="w-full border rounded px-3 py-2 text-sm mb-3"
      />

      <div className="flex items-center gap-3 mb-4">
        <label className="text-sm">Qty</label>
        <input type="number" min={1} value={quantity} onChange={(e) => setQuantity(e.target.value)} className="w-20 border rounded px-2 py-1 text-sm" />
      </div>

      <div className="flex gap-3">
        <button className="bg-sage text-white px-4 py-2 rounded" onClick={addToLocalCart} disabled={saving}>
          {saving ? 'Adding…' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
