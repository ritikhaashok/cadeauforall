import ProductCard from "@/components/ProductCard";
import FilterSidebar from "@/components/shop/FilterSidebar";
import { supabase } from '@/lib/supabaseClient';

const fallbackProducts = [
  { id: 1, name: "Geometric Ceramic Planter (small)", price: "$34.99" },
  { id: 2, name: "Glazed Indoor Plant Pot", price: "$29.99" },
  { id: 3, name: "Hand-Painted Ceramic Face", price: "$55.00" },
];

async function getProducts() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    // Env vars not set — return fallback local products so dev doesn't crash
    return fallbackProducts;
  }

  const { data, error } = await supabase
    .from('products')
    .select('id, name, slug, price, currency, product_images(url, alt, position)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Supabase error', error);
    return fallbackProducts;
  }

  // Map to include a top-level `image` property using the first image if available
  return data.map(p => ({
    ...p,
    price: `$${parseFloat(p.price).toFixed(2)}`,
    image: p.product_images && p.product_images.length ? p.product_images[0].url : null,
  }));
}

export default async function Shop() {
  const products = await getProducts();

  return (
    <main className="px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <nav className="text-sm text-gray-600">Planters</nav>
            <div className="text-xs text-gray-500">{products.length} products found</div>
          </div>

          <div>
            <label className="text-sm text-gray-600 mr-3">Sort by:</label>
            <select className="border rounded px-3 py-1 text-sm">
              <option>Popularity</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <FilterSidebar />
          </div>

          <div className="col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
