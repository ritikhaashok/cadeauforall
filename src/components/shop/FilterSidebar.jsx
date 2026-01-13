"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const categories = [
  { slug: 'name-signs', label: 'Name Signs' },
  { slug: 'wall-art', label: 'Wall Art' },
  { slug: 'indoor-planters', label: 'Indoor Planters' },
  { slug: 'night-lights', label: 'Night Lights' },
  { slug: 'return-gifts', label: 'Return Gifts' },
];

export default function FilterSidebar({ selectedCategories = [], initialMin = '', initialMax = '' }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState(() => Array.isArray(selectedCategories) ? selectedCategories : (selectedCategories ? [selectedCategories] : []));
  const [minPrice, setMinPrice] = useState(initialMin || '');
  const [maxPrice, setMaxPrice] = useState(initialMax || '');

  useEffect(() => {
    // sync when search params from server change
    const raw = searchParams?.get('categories');
    const arr = raw ? raw.split(',').filter(Boolean) : [];
    setSelected(arr.length ? arr : (Array.isArray(selectedCategories) ? selectedCategories : (selectedCategories ? [selectedCategories] : [])));

    const min = searchParams?.get('minPrice') || initialMin || '';
    const max = searchParams?.get('maxPrice') || initialMax || '';
    setMinPrice(min);
    setMaxPrice(max);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams?.toString()]);

  function toggle(cat) {
    const next = selected.includes(cat) ? selected.filter(c => c !== cat) : [...selected, cat];
    setSelected(next);

    const params = new URLSearchParams(searchParams?.toString() || '');
    if (next.length) params.set('categories', next.join(',')); else params.delete('categories');
    console.debug('FilterSidebar toggle params:', params.toString());
    router.push(`/shop?${params.toString()}`);
  }

  function applyPrice() {
    const params = new URLSearchParams(searchParams?.toString() || '');
    if (minPrice !== '') params.set('minPrice', String(Number(minPrice) || 0)); else params.delete('minPrice');
    if (maxPrice !== '') params.set('maxPrice', String(Number(maxPrice) || 0)); else params.delete('maxPrice');
    console.debug('FilterSidebar applyPrice params:', params.toString());
    router.push(`/shop?${params.toString()}`);
  }

  function clearPrice() {
    setMinPrice('');
    setMaxPrice('');
    const params = new URLSearchParams(Array.from(searchParams || []));
    params.delete('minPrice');
    params.delete('maxPrice');
    router.push(`/shop?${params.toString()}`);
  }

  return (
    <aside className="w-full md:w-64">
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h4 className="font-semibold mb-3">Filter by</h4>

        <div className="mb-4">
          <div className="font-medium mb-2">Category</div>
          <ul className="text-sm text-gray-600 space-y-2">
            {categories.map((c) => (
              <li key={c.slug}>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={selected.includes(c.slug)} onChange={() => toggle(c.slug)} />
                  <span className={selected.includes(c.slug) ? 'font-semibold text-sage' : ''}>{c.label}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="font-medium mb-2">Price Range</div>
          <div className="flex items-center gap-2 mb-3">
            <input value={minPrice} onChange={(e) => setMinPrice(e.target.value)} type="number" placeholder="Min" className="w-1/2 border rounded px-2 py-1 text-sm" />
            <input value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} type="number" placeholder="Max" className="w-1/2 border rounded px-2 py-1 text-sm" />
          </div>

          <div className="flex items-center gap-2">
            <button onClick={applyPrice} className="px-3 py-1 bg-sage text-white rounded text-sm">Apply</button>
            <button onClick={clearPrice} className="px-3 py-1 border rounded text-sm">Clear</button>
          </div>
        </div>
      </div>
    </aside>
  );
} 
