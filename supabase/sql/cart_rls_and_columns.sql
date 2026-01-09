-- Add custom_text column to cart_items (if not present)
ALTER TABLE IF EXISTS cart_items
  ADD COLUMN IF NOT EXISTS custom_text TEXT;

-- Enable RLS and policies for carts
ALTER TABLE IF EXISTS carts ENABLE ROW LEVEL SECURITY;

-- Allow users to SELECT/INSERT/UPDATE/DELETE their own carts
CREATE POLICY IF NOT EXISTS "Users manage own carts" ON carts
  FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Allow public read of carts? No, we won't allow it.

-- Enable RLS and policies for cart_items
ALTER TABLE IF EXISTS cart_items ENABLE ROW LEVEL SECURITY;

-- Policy: users can insert cart_items only when the cart belongs to them
CREATE POLICY IF NOT EXISTS "Users can insert items into their carts" ON cart_items
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM carts WHERE carts.id = cart_items.cart_id AND carts.user_id = auth.uid()
    )
  );

CREATE POLICY IF NOT EXISTS "Users can select their cart items" ON cart_items
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM carts WHERE carts.id = cart_items.cart_id AND carts.user_id = auth.uid()
    )
  );

CREATE POLICY IF NOT EXISTS "Users can update/delete their cart items" ON cart_items
  FOR UPDATE, DELETE
  USING (
    EXISTS (
      SELECT 1 FROM carts WHERE carts.id = cart_items.cart_id AND carts.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM carts WHERE carts.id = cart_items.cart_id AND carts.user_id = auth.uid()
    )
  );

-- Note: After applying these policies, client requests signed in as a user will be able to manage their carts and items.
-- To run: copy this SQL into Supabase SQL Editor and run it. Test by signing in as a user and inserting a cart + item via the client.
