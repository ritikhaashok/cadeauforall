import ProductCard from "@/components/ProductCard";
import FilterSidebar from "@/components/shop/FilterSidebar";
import CategoryBar from '@/components/CategoryBar';
import { supabase } from '@/lib/supabaseClient';

// const fallbackProducts = [
//   { id: 1, name: "Geometric Ceramic Planter (small)", price: "$34.99", category: 'indoor-planters' },
//   { id: 2, name: "Glazed Indoor Plant Pot", price: "$29.99", category: 'indoor-planters' },
//   { id: 3, name: "Hand-Painted Ceramic Face", price: "$55.00", category: 'indoor-planters' },
// ];

async function getProducts(categories = [], minPrice = null, maxPrice = null) {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    // Env vars not set — return fallback local products so dev doesn't crash
    // Apply category and price filtering to fallback products
//    let list = fallbackProducts.slice();
    if (Array.isArray(categories) && categories.length) list = list.filter(p => categories.includes(p.category));
    if (minPrice !== null && minPrice !== '') list = list.filter(p => parseFloat(String(p.price).replace(/[^0-9.]/g, '')) >= Number(minPrice));
    if (maxPrice !== null && maxPrice !== '') list = list.filter(p => parseFloat(String(p.price).replace(/[^0-9.]/g, '')) <= Number(maxPrice));
    return list;
  }

  let query = supabase
    .from('products')
    .select('id, name, slug, price, currency, category, product_images(url, alt, position)')
    .order('created_at', { ascending: false });

  if (Array.isArray(categories) && categories.length) query = query.in('category', categories);

  console.debug('getProducts called with', { categories, minPrice, maxPrice });
  if (minPrice !== null && minPrice !== '') query = query.gte('price', Number(minPrice));
  if (maxPrice !== null && maxPrice !== '') query = query.lte('price', Number(maxPrice));

  const { data, error } = await query;

  if (error) {
    console.error('Supabase error', error);
//    return fallbackProducts;
  }

  // Map to include a top-level `image` property using the first image if available
  return data.map(p => ({
    ...p,
    price: `$${parseFloat(p.price).toFixed(2)}`,
    image: p.product_images && p.product_images.length ? p.product_images[0].url : null,
  }));
}

export default async function Shop({ searchParams }) {
  // `searchParams` can be a Promise in some Next.js setups — unwrap it to read params safely
  const sp = await searchParams;
  const selected = sp?.categories ? String(sp.categories).split(',').map(s => s.trim()).filter(Boolean) : [];
  const minPrice = sp?.minPrice ?? '';
  const maxPrice = sp?.maxPrice ?? '';

  console.debug('Shop page searchParams:', { selected, minPrice, maxPrice });

  const products = await getProducts(selected, minPrice, maxPrice);

  return (
    <main className="px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <nav className="text-sm text-gray-600">{selected.length ? selected.map(s => s.replace(/-/g, ' ')).join(', ') : 'All Products'}</nav>
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
            <FilterSidebar selectedCategories={selected} />
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
