"use client";

import { useState, useEffect } from "react";
import ContactModal from "./ContactModal";
import CartModal from "./CartModal";

export default function Navbar() {
  const [showContact, setShowContact] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [count, setCount] = useState(0);

  function loadCount() {
    try {
      const existing = JSON.parse(localStorage.getItem('cart') || '[]');
      setCount(existing.reduce((s, it) => s + (Number(it.quantity) || 0), 0));
    } catch (e) {
      setCount(0);
    }
  }

  useEffect(() => {
    loadCount();
    const handler = () => loadCount();
    window.addEventListener('cart-updated', handler);
    return () => window.removeEventListener('cart-updated', handler);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[var(--sage)] border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <a href="/" className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center bg-sage rounded-full w-8 h-8 overflow-hidden">
              <img
                src="/Logo2.png"
                alt="Logo"
                className="w-8 h-8 object-contain"
              />
            </span>

            <span className="text-white font-semibold">Cadeau4All</span>
          </a>

          <button onClick={() => setShowContact(true)} className="text-sm text-white">Questions?</button>
        </div>

        <div className="flex items-center gap-3 text-white">
          <button aria-label="Cart" className="relative p-2 rounded-md hover:bg-gray-50" onClick={() => setShowCart(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {count > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{count}</span>}
          </button>

          <button aria-label="Account" className="p-2 rounded-md hover:bg-gray-50">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>
        </div>
      </div>

      <ContactModal open={showContact} onClose={() => setShowContact(false)} />
      <CartModal open={showCart} onClose={() => setShowCart(false)} />
    </nav>
  );
}
