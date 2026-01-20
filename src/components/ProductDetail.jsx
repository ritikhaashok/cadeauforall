"use client";

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import ProductCustomizer from './ProductCustomizer';

export default function ProductDetail({ product }) {
  const images = product.product_images || [];
  const [activeIndex, setActiveIndex] = useState(0);

  const mainImage = images.length ? images[activeIndex].url : null;

  const showPrev = () => {
    setActiveIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const showNext = () => {
    setActiveIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const prices = (product.sizes || []).map(s => Number(s.price));
  const minPrice = prices.length ? Math.min(...prices) : Number(product.price || 0);
  const maxPrice = prices.length ? Math.max(...prices) : minPrice;
  const priceRange =
    minPrice === maxPrice
      ? `$${minPrice.toFixed(2)}`
      : `$${minPrice.toFixed(2)}–$${maxPrice.toFixed(2)}`;

  return (
    <div className="max-w-6xl mx-auto py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="relative bg-white rounded-lg p-4 shadow">
            {mainImage ? (
              <Image
                src={mainImage}
                alt={product.name}
                width={800}
                height={800}
                className="object-cover w-full h-full rounded"
              />
            ) : (
              <div className="aspect-square bg-[var(--beige)] rounded" />
            )}

            {images.length > 1 && (
              <>
                <button
                  onClick={showPrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow"
                >
                  <ChevronLeft size={24} />
                </button>

                <button
                  onClick={showNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}

            {images.length > 1 && (
              <div className="mt-3 grid grid-cols-4 gap-2">
                {images.map((img, index) => (
                  <button
                    key={img.url}
                    onClick={() => setActiveIndex(index)}
                    className={`h-20 w-20 rounded overflow-hidden border ${
                      activeIndex === index
                        ? 'border-sage'
                        : 'border-transparent'
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={img.alt || product.name}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-semibold mb-2">{product.name}</h1>
          <div className="text-xl text-sage font-semibold mb-4">
            {priceRange}
          </div>

          <div className="prose max-w-none text-gray-700 mb-6">
            {product.description || 'No description provided.'}
          </div>

          <ProductCustomizer
            productId={product.id}
            productName={product.name}
            productImage={mainImage}
            initialPrice={minPrice}
            sizes={product.sizes}
            colors={product.colors}
          />
        </div>
      </div>
    </div>
  );
}
