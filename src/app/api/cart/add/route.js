import { supabase } from '@/lib/supabaseClient';

export async function POST(req) {
  try {
    const body = await req.json();
    // Expect body: { productId, quantity, price, customText }

    // get user info from auth header
    const authHeader = req.headers.get('authorization');
    let userId = null;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const { data: userData, error: userErr } = await supabase.auth.getUser(token);
      if (userErr || !userData?.user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
      userId = userData.user.id;
    } else {
      return new Response(JSON.stringify({ error: 'Must be signed in' }), { status: 401 });
    }

    // find or create cart
    const { data: existingCarts } = await supabase.from('carts').select('*').eq('user_id', userId).limit(1);
    let cartId;
    if (existingCarts && existingCarts.length) {
      cartId = existingCarts[0].id;
    } else {
      const { data: newCart } = await supabase.from('carts').insert({ user_id: userId }).select('*').single();
      cartId = newCart.id;
    }

    // insert item (persist selected options)
    const { error } = await supabase.from('cart_items').insert({
      cart_id: cartId,
      product_id: body.productId,
      quantity: body.quantity || 1,
      price: body.price || 0,
      custom_text: body.customText || null,
      size_id: body.size_id || null,
      size_text: body.size_text || null,
      color_id: body.color_id || null,
      color_text: body.color_text || null,
      image_url: body.image || null,
    });

    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
