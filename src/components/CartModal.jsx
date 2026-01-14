"use client";

import { useEffect, useState } from "react";

export default function CartModal({ open, onClose }) {
  const [items, setItems] = useState([]);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderName, setOrderName] = useState('');
  const [orderPhone, setOrderPhone] = useState('');
  const [orderAddress, setOrderAddress] = useState('');
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderMessage, setOrderMessage] = useState(null);

  function loadCart() {
    try {
      const existing = JSON.parse(localStorage.getItem("cart") || "[]");
      setItems(existing);
    } catch (e) {
      setItems([]);
    }
  }

  useEffect(() => {
    loadCart();
    const handler = () => loadCart();
    window.addEventListener("cart-updated", handler);
    return () => window.removeEventListener("cart-updated", handler);
  }, []);

  useEffect(() => {
    if (!open) return;
    loadCart();
  }, [open]);

  function save(items) {
    setItems(items);
    localStorage.setItem("cart", JSON.stringify(items));
    window.dispatchEvent(new CustomEvent("cart-updated"));
  }

  function removeItem(idx) {
    const next = items.slice();
    next.splice(idx, 1);
    save(next);
  }

  function updateQty(idx, qty) {
    const next = items.slice();
    next[idx].quantity = Math.max(1, Number(qty) || 1);
    save(next);
  }

  function updateCustomText(idx, text) {
    const next = items.slice();
    next[idx].customText = text || null;
    save(next);
  }

  const subtotal = items.reduce((s, it) => s + Number(it.price || 0) * Number(it.quantity || 1), 0);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end">
      <div className="absolute inset-0 bg-black opacity-40" onClick={onClose}></div>

      <div className="relative bg-white w-full max-w-md h-full overflow-auto shadow-lg p-4 z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Your Cart</h3>
          <button className="text-sm text-gray-600" onClick={onClose}>Close</button>
        </div>

        {items.length === 0 ? (
          <div className="text-sm text-gray-500">Your cart is empty.</div>
        ) : (
          <div className="space-y-4">
            {items.map((it, idx) => (
              <div key={idx} className="flex items-center gap-3 border-b pb-3">
                <div className="w-16 h-16 bg-gray-100 flex items-center justify-center overflow-hidden rounded">
                  {it.productImage ? (
                    <img src={it.productImage} alt={it.productName || 'Product'} className="w-full h-full object-cover" />
                  ) : it.image_url ? (
                    <img src={it.image_url} alt={it.productName || 'Product'} className="w-full h-full object-cover" />
                  ) : it.productImageUrl ? (
                    <img src={it.productImageUrl} alt={it.productName || 'Product'} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-xs text-gray-400">No image</div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{it.productName || 'Product'}</div>
                  <div className="text-sm text-gray-600">{it.size_text ? `Size: ${it.size_text}` : ''} {it.color_text ? ` • Color: ${it.color_text}` : ''}</div>
                  <div className="text-sm text-gray-700 mt-1">${Number(it.price || 0).toFixed(2)}</div>

                  <div className="mt-2">
                    <label className="block text-xs text-gray-500 mb-1">Personalization</label>
                    <textarea
                      value={it.customText || ''}
                      onChange={(e) => updateCustomText(idx, e.target.value)}
                      className="w-full border rounded p-2 text-sm"
                      rows={2}
                      placeholder="Enter custom text..."
                    />
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <input type="number" min={1} value={it.quantity} onChange={(e) => updateQty(idx, e.target.value)} className="w-20 border rounded px-2 py-1 text-sm" />
                  <button onClick={() => removeItem(idx)} className="text-sm text-red-600">Remove</button>
                </div>
              </div>
            ))}

            <div className="pt-2 border-t flex items-center justify-between">
              <div className="font-semibold">Subtotal</div>
              <div className="font-semibold">${subtotal.toFixed(2)}</div>
            </div>

            <div className="flex gap-2 mt-3">
              <button onClick={() => setShowOrderForm(true)} className="bg-[var(--sage)] text-white px-4 py-2 rounded">Send to Order</button>
              <button onClick={() => { localStorage.removeItem('cart'); save([]); }} className="px-4 py-2 rounded border">Clear</button>
            </div>

            {/* Order form modal */}
            {showOrderForm && (
              <div className="fixed inset-0 z-60 flex items-center justify-center">
                <div className="absolute inset-0 bg-black opacity-40" onClick={() => setShowOrderForm(false)}></div>
                <div className="relative bg-white rounded-md shadow-lg w-full max-w-md mx-4 p-6 z-10">
                  <h3 className="text-lg font-semibold mb-3">Send Order</h3>
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    setOrderMessage(null);
                    setOrderLoading(true);
                    try {
                      const payload = { name: orderName.trim(), phone: orderPhone.trim(), address: orderAddress.trim(), items };
                      const res = await fetch('/api/orders/send', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
                      const data = await res.json();
                      if (!res.ok) throw new Error(data?.error || 'Order send failed');

                      setOrderMessage({ type: 'success', text: 'Order sent! we will contact you with the info given above for payment and order processing' });
                      // clear cart
                      localStorage.removeItem('cart');
                      save([]);
                    } catch (err) {
                      setOrderMessage({ type: 'error', text: err.message || 'Send failed' });
                    } finally {
                      setOrderLoading(false);
                    }
                  }} className="space-y-3">

                    <div>
                      <label className="block text-sm font-medium mb-1">Name</label>
                      <input value={orderName} onChange={(e) => setOrderName(e.target.value)} className="w-full border rounded p-2 text-sm" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Phone</label>
                      <input value={orderPhone} onChange={(e) => setOrderPhone(e.target.value)} className="w-full border rounded p-2 text-sm" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Address</label>
                      <textarea value={orderAddress} onChange={(e) => setOrderAddress(e.target.value)} className="w-full border rounded p-2 text-sm" rows={3} />
                    </div>

                    {orderMessage && (
                      <div className={`p-2 rounded text-sm ${orderMessage.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        {orderMessage.text}
                      </div>
                    )}

                    <div className="flex items-center justify-end gap-3">
                      <button type="button" onClick={() => setShowOrderForm(false)} className="px-3 py-2 rounded bg-gray-100 text-sm">Cancel</button>
                      <button type="submit" disabled={orderLoading} className="px-4 py-2 rounded bg-sage text-white text-sm">{orderLoading ? 'Sending...' : 'Send Order'}</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
