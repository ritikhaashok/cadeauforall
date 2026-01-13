import Link from 'next/link';

const categories = [
  { slug: 'name-signs', label: 'Name Signs' },
  { slug: 'wall-art', label: 'Wall Art' },
  { slug: 'indoor-planters', label: 'Indoor Planters' },
  { slug: 'night-lights', label: 'Night Lights' },
  { slug: 'return-gifts', label: 'Return Gifts' },
];

export default function CategoryBar() {
  return (
    <div className="w-full bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-1 flex items-center gap-3 overflow-x-auto text-sm">
        {categories.map((c) => (
          <Link key={c.slug} href={`/shop?categories=${encodeURIComponent(c.slug)}`} className="text-xs text-gray-700 px-2 py-1 rounded whitespace-nowrap hover:bg-gray-50">{c.label}</Link>
        ))}
      </div>
    </div>
  );
}