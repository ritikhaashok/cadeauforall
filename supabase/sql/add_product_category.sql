-- Add category column to products
ALTER TABLE IF EXISTS products
  ADD COLUMN IF NOT EXISTS category TEXT;

-- Seed sample products to indoor-planters for dev/testing
UPDATE products SET category = 'indoor-planters' WHERE slug IN (
  'geometric-ceramic-planter-small',
  'glazed-indoor-plant-pot',
  'hand-painted-ceramic-face'
);

-- Optional: create index on category for faster filtering
CREATE INDEX IF NOT EXISTS products_category_idx ON products (category);