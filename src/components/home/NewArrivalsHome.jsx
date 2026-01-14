import ProductCard from '@/components/ProductCard';
import { supabase } from '@/lib/supabaseClient';

async function getLatestProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('id, name, slug, price, currency, product_images(url, alt, position)')
    .order('created_at', { ascending: false })
    .limit(4);

  if (error) {
    console.error('Supabase error fetching latest products', error);
    return [];
  }

  // Normalize data to match ProductCard expectations
  return data.map(p => ({
    ...p,
    price: `$${parseFloat(p.price).toFixed(2)}`,
    image: p.product_images?.length ? p.product_images[0].url : null,
  }));
}

export default async function NewArrivalsHome() {
  const products = await getLatestProducts();

  if (!products.length) return null;

  return (
    <section id="shop" className="mt-12">
      <h2 className="text-center text-2xl font-medium mb-6">
        New Arrivals
      </h2>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
