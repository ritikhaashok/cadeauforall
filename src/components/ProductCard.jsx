import Image from 'next/image';
import Link from 'next/link';

export default function ProductCard({ product = {} }) {
  const { id, name = 'Product name', price = '$0.00', image, badge, category } = product;

  return (
    <article className="bg-white rounded-xl shadow-sm p-4 flex flex-col" aria-labelledby={`product-${id}`}>
      <Link href={product.href || `/product/${id}`} className="block mb-4 relative">
        {badge && (
          <div className="absolute left-3 top-3 bg-sage text-sage text-xs font-semibold px-2 py-1 rounded-full shadow">{badge}</div>
        )}

        <div className="aspect-square bg-[var(--beige)] rounded-lg mb-2 overflow-hidden flex items-center justify-center">
          {image ? (
            <Image src={image} alt={name} width={400} height={400} className="object-cover w-full h-full" />
          ) : (
            <div className="text-sm text-gray-400">Image</div>
          )}
        </div>
      </Link>

      <div className="flex items-center justify-between mb-1">
        <h3 id={`product-${id}`} className="text-sm md:text-base font-medium">{name}</h3>
        {category && (
          <Link href={`/shop?categories=${encodeURIComponent(category)}`} className="text-xs text-gray-500 hover:text-sage ml-2">{category.replace(/-/g, ' ')}</Link>
        )}
      </div>

      <p className="text-sm text-sage font-semibold mb-3">{price}</p>

      <div className="mt-auto">
        <button className="w-full bg-sage text-white text-sm py-2 rounded-full hover:bg-sage">Add to Cart</button>
      </div>
    </article>
  );
}
