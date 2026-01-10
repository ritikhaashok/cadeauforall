'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function ProductCustomizer({ productId, productName, productImage, initialPrice = 0, sizes = [], colors = [] }) {
  const [customText, setCustomText] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [saving, setSaving] = useState(false);

  // option selections
  const [selectedSizeId, setSelectedSizeId] = useState(sizes?.[0]?.id ?? null);
  const [selectedColorId, setSelectedColorId] = useState(colors?.[0]?.id ?? null);
  const [displayPrice, setDisplayPrice] = useState(Number(initialPrice));

  useEffect(() => {
    // initialize selections when sizes/colors change
    if (sizes && sizes.length) {
      setSelectedSizeId((prev) => prev || sizes[0].id);
    }
    if (colors && colors.length) {
      setSelectedColorId((prev) => prev || colors[0].id);
    }
  }, [sizes, colors]);

  useEffect(() => {
    if (selectedSizeId && sizes && sizes.length) {
      const s = sizes.find((x) => x.id === selectedSizeId);
      if (s) setDisplayPrice(Number(s.price));
    } else {
      setDisplayPrice(Number(initialPrice));
    }
  }, [selectedSizeId, sizes, initialPrice]);

  async function getAccessToken() {
    const { data } = await supabase.auth.getSession();
    return data?.session?.access_token || null;
  }

  async function addToServerCart() {
    setSaving(true);
    try {
      const token = await getAccessToken();
      if (!token) throw new Error('Not signed in');

      const sizeObj = sizes?.find((s) => s.id === selectedSizeId) || null;
      const colorObj = colors?.find((c) => c.id === selectedColorId) || null;

      // call server endpoint which expects Authorization Bearer token
      const res = await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
        body: JSON.stringify({
          productId,
          quantity: Number(quantity),
          price: Number(displayPrice),
          customText,
          size_id: sizeObj?.id || null,
          size_text: sizeObj?.size || null,
          color_id: colorObj?.id || null,
          color_text: colorObj?.name || null,
        }),
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
      const sizeObj = sizes?.find((s) => s.id === selectedSizeId) || null;
      const colorObj = colors?.find((c) => c.id === selectedColorId) || null;

      const item = {
        productId,
        productName: productName || null,
        productImage: productImage || null,
        customText,
        quantity: Number(quantity),
        price: Number(displayPrice),
        size_id: sizeObj?.id || null,
        size_text: sizeObj?.size || null,
        color_id: colorObj?.id || null,
        color_text: colorObj?.name || null,
      };
      existing.push(item);
      localStorage.setItem('cart', JSON.stringify(existing));
      // notify other UI that cart changed
      window.dispatchEvent(new CustomEvent('cart-updated'));
      // simple feedback
      alert('Added to cart.');
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

      {sizes && sizes.length > 0 && (
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Size</label>
          <select value={selectedSizeId ?? ''} onChange={(e) => setSelectedSizeId(e.target.value)} className="w-full border rounded px-3 py-2 text-sm">
            {sizes.map((s) => (
              <option key={s.id} value={s.id}>
                {s.size} — ${Number(s.price).toFixed(2)}
              </option>
            ))}
          </select>
        </div>
      )}

      {colors && colors.length > 0 && (
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Color</label>
          <select value={selectedColorId ?? ''} onChange={(e) => setSelectedColorId(e.target.value)} className="w-full border rounded px-3 py-2 text-sm">
            {colors.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="text-lg font-semibold mb-2">Price: ${Number(displayPrice).toFixed(2)}</div>

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
