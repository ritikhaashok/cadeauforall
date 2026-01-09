import { supabase } from '@/lib/supabaseClient';
import ProductDetail from '@/components/ProductDetail';

export default async function ProductPage({ params }) {
  const { id } = await params;

  const { data, error } = await supabase
    .from('products')
    .select('id, name, slug, description, price, currency, product_images(url, alt, position)')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Supabase error', error);
    return <div className="p-8">Error loading product.</div>;
  }

  if (!data) {
    return <div className="p-8">Product not found.</div>;
  }

  // normalize image into a top-level field
  const product = {
    ...data,
    image: data.product_images && data.product_images.length ? data.product_images[0].url : null,
  };

  return <ProductDetail product={product} />;
}
