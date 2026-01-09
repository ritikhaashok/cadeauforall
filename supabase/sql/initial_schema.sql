-- Enable pgcrypto for gen_random_uuid (Supabase has this available)
-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Product images
CREATE TABLE IF NOT EXISTS product_images (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt TEXT,
  position INT DEFAULT 0
);

-- Testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  text TEXT NOT NULL,
  avatar_url TEXT,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Profiles: supplemental metadata for auth.users
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role TEXT DEFAULT 'user',
  avatar_url TEXT,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Carts
CREATE TABLE IF NOT EXISTS carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Cart items
CREATE TABLE IF NOT EXISTS cart_items (
  id BIGSERIAL PRIMARY KEY,
  cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_id BIGINT NOT NULL REFERENCES products(id),
  variant_id BIGINT,
  quantity INT NOT NULL DEFAULT 1,
  price NUMERIC(10,2) NOT NULL,
  added_at timestamptz NOT NULL DEFAULT now()
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  total NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  stripe_session_id TEXT,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Seed sample products
INSERT INTO products (name, slug, description, price) VALUES
('Geometric Ceramic Planter (small)', 'geometric-ceramic-planter-small', 'A modern ceramic planter with geometric lines.', 34.99),
('Glazed Indoor Plant Pot', 'glazed-indoor-plant-pot', 'Glazed finish, great for indoor plants.', 29.99),
('Hand-Painted Ceramic Face', 'hand-painted-ceramic-face', 'Unique handmade planter with a painted face.', 55.00)
ON CONFLICT (slug) DO NOTHING;

-- Seed sample testimonials
INSERT INTO testimonials (name, role, text) VALUES
('Sarah M.', 'Verified buyer', 'The personalized planter I ordered exceeded all expectations—beautiful and arrived quickly.'),
('David L.', 'Customer', 'CadeauForAll made my daughter''s birthday extra special with the custom cake topper.')
ON CONFLICT DO NOTHING;