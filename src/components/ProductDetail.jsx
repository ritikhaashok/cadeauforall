import Image from 'next/image';
import ProductCustomizer from './ProductCustomizer';

export default function ProductDetail({ product }) {
  const image = product.image || null;

  const prices = (product.sizes || []).map(s => Number(s.price));
  const minPrice = prices.length ? Math.min(...prices) : Number(product.price || 0);
  const maxPrice = prices.length ? Math.max(...prices) : minPrice;
  const priceRange = minPrice === maxPrice ? `$${minPrice.toFixed(2)}` : `$${minPrice.toFixed(2)}–$${maxPrice.toFixed(2)}`;

  return (
    <div className="max-w-6xl mx-auto py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="bg-white rounded-lg p-4 shadow">
            {image ? (
              <Image src={image} alt={product.name} width={800} height={800} className="object-cover w-full h-full rounded" />
            ) : (
              <div className="aspect-square bg-[var(--beige)] rounded" />
            )}

            {product.product_images && product.product_images.length > 1 && (
              <div className="mt-3 grid grid-cols-4 gap-2">
                {product.product_images.map((img) => (
                  <div key={img.url} className="h-20 w-20 bg-gray-50 rounded overflow-hidden">
                    <img src={img.url} alt={img.alt || product.name} className="object-cover w-full h-full" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-semibold mb-2">{product.name}</h1>
          <div className="text-xl text-sage font-semibold mb-4">{priceRange}</div>

          <div className="prose max-w-none text-gray-700 mb-6">
            {product.description || 'No description provided.'}
          </div>

          <ProductCustomizer productId={product.id} productName={product.name} productImage={product.image} initialPrice={minPrice} sizes={product.sizes} colors={product.colors} />
        </div>
      </div>
    </div>
  );
}
