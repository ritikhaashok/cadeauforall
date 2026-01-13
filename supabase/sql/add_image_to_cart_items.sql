-- Add image_url column to cart_items (optional product-level uploaded image)
ALTER TABLE IF EXISTS cart_items
  ADD COLUMN IF NOT EXISTS image_url TEXT;

-- No RLS changes required; this column will be handled by the existing policies.