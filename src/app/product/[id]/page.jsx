import { supabase } from '@/lib/supabaseClient';
import ProductDetail from '@/components/ProductDetail';

export default async function ProductPage({ params }) {
  const { id } = await params;

  const { data, error } = await supabase
    .from('products')
    .select('id, name, slug, description, price, currency, product_images(url)')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Supabase error', error);
    return <div className="p-8">Error loading product.</div>;
  }

  if (!data) {
    return <div className="p-8">Product not found.</div>;
  }

  // fetch sizes for the product
  const { data: sizesData } = await supabase
    .from('product_sizes')
    .select('id, size, price, position')
    .eq('product_id', id)
    .order('position', { ascending: true });

  // fetch allowed colors for the product (and include color details)
  const { data: productColorsData } = await supabase
    .from('product_colors')
    .select('color_id, colors(id, name, hex)')
    .eq('product_id', id);

  // normalize image into a top-level field and include sizes/colors
  const product = {
    ...data,
    image: data.product_images && data.product_images.length ? data.product_images[0].url : null,
    sizes: sizesData || [],
    colors: (productColorsData || []).map(pc => pc.colors).filter(Boolean),
  };

  return <ProductDetail product={product} />;
}
