"use client";

import { useState } from "react";

export default function ContactModal({ open, onClose }) {
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  if (!open) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage(null);
    if (!phone.trim()) {
      setMessage({ type: "error", text: "Please provide a phone number so we can get in touch." });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/contact/submit", {
        method: "POST",
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ phone: phone.trim(), description: description || "" }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Submission failed");

      setMessage({ type: "success", text: "Thanks! We received your request and will reach out soon." });
      // Reset form
      setDescription("");
      setPhone("");
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Submission error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-40" onClick={onClose}></div>

      <div className="relative bg-white rounded-md shadow-lg w-full max-w-xl mx-4 p-6 z-10">
        <h3 className="text-lg font-semibold mb-3">Contact us about a custom product</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Message</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded p-2 text-sm"
              rows={4}
              placeholder="Ask your question here..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Phone number (we'll call or text)</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type="tel"
              className="w-full border rounded p-2 text-sm"
              placeholder="+1 555 555 5555"
              required
            />
          </div>

          {message && (
            <div className={`p-2 rounded text-sm ${message.type === "error" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
              {message.text}
            </div>
          )}

          <div className="flex items-center justify-end gap-3">
            <button type="button" onClick={onClose} className="px-3 py-2 rounded bg-gray-100 text-sm">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded bg-sage text-white text-sm disabled:opacity-50" disabled={loading}>
              {loading ? "Sending..." : "Send request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
