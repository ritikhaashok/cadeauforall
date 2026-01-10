-- Migration: add sizes, colors, and product_colors; add columns to cart_items
-- Run in a safe environment (Dev/Staging) first. Use SUPABASE CLI or Supabase Studio SQL editor.

BEGIN;

-- Colors table (global list you can manage from Supabase Studio)
CREATE TABLE IF NOT EXISTS colors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  hex varchar(7),
  created_at timestamptz DEFAULT now()
);

-- Product sizes: one row per product-size with its own price
CREATE TABLE IF NOT EXISTS product_sizes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  size text NOT NULL,
  price numeric(10,2) NOT NULL,
  position integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Join table for allowed colors per product
CREATE TABLE IF NOT EXISTS product_colors (
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  color_id uuid REFERENCES colors(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, color_id)
);

-- Add optional columns to store chosen size/color on cart_items
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='cart_items' AND column_name='size_id') THEN
    ALTER TABLE cart_items ADD COLUMN size_id uuid REFERENCES product_sizes(id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='cart_items' AND column_name='color_id') THEN
    ALTER TABLE cart_items ADD COLUMN color_id uuid REFERENCES colors(id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='cart_items' AND column_name='size_text') THEN
    ALTER TABLE cart_items ADD COLUMN size_text text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='cart_items' AND column_name='color_text') THEN
    ALTER TABLE cart_items ADD COLUMN color_text text;
  END IF;
END$$;

COMMIT;

-- Notes:
-- 1) Apply this to your development DB first. Confirm queries & UI before applying to production.
-- 2) If you use row-level security, ensure policies allow reading/writing the new tables/columns as appropriate.
