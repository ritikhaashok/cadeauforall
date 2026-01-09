"use client";

import { useState } from "react";
import ContactModal from "./ContactModal";

export default function Navbar() {
  const [showContact, setShowContact] = useState(false);

  return (
    <nav className="w-full bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <a href="/" className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center bg-sage text-sage rounded-full w-8 h-8">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
                <path d="M20 8h-2.18A3 3 0 0 0 16 6a3 3 0 0 0-5.83-.64A3.5 3.5 0 0 0 5 8H3a1 1 0 0 0-1 1v3a3 3 0 0 0 3 3h16a3 3 0 0 0 3-3V9a1 1 0 0 0-1-1zM6 12v-1h12v1H6z" />
              </svg>
            </span>

            <span className="text-sage font-semibold">Cadeau4All</span>
          </a>

          <button onClick={() => setShowContact(true)} className="text-sm text-gray-600 hover:text-gray-800">Contact</button>
        </div>

        <div className="flex items-center gap-3 text-gray-600">
          <button aria-label="Cart" className="p-2 rounded-md hover:bg-gray-50">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
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
    </nav>
  );
}
