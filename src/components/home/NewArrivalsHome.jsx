import ProductCard from '@/components/ProductCard';

const sampleProducts = [
  { id: 1, name: 'Engraved Bamboo Coasters (set of 4)', price: '$29.00' },
  { id: 2, name: 'Custom Pet Portrait Mug', price: '$25.00' },
  { id: 3, name: 'Minimalist Geometric Wall Art', price: '$55.00' },
  { id: 4, name: 'Leather Engraved Keyring', price: '$18.00' },
];

export default function NewArrivalsHome() {
  return (
    <section id="shop" className="mt-12">
      <h2 className="text-center text-2xl font-medium mb-6">New Arrivals</h2>
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {sampleProducts.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
