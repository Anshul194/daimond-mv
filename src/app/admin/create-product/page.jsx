"use client";
import React, { useState } from "react";

export default function CreateProductPage() {
  const [title, setTitle] = useState("");
  const [sku, setSku] = useState("");
  const [price, setPrice] = useState("");
  const [attributes, setAttributes] = useState([{ name: "", value: "" }]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const addAttr = () => setAttributes(prev => [...prev, { name: "", value: "" }]);
  const removeAttr = (i) => setAttributes(prev => prev.filter((_, idx) => idx !== i));
  const updateAttr = (i, key, val) => setAttributes(prev => prev.map((a, idx) => idx === i ? { ...a, [key]: val } : a));

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const fd = new FormData();
      fd.append('title', title);
      fd.append('sku', sku);
      fd.append('price', price);
      // append attribute pairs
      for (const a of attributes) {
        if (a.name && a.value) {
          fd.append('product_attribute_name[]', a.name);
          fd.append('product_attribute_value[]', a.value);
        }
      }

      const res = await fetch('/api/product', {
        method: 'POST',
        body: fd,
      });
      const data = await res.json();
      setResult({ ok: res.ok, data });
    } catch (err) {
      setResult({ ok: false, error: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">Create Product (Admin)</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input className="border p-2 w-full" value={title} onChange={e => setTitle(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium">SKU</label>
          <input className="border p-2 w-full" value={sku} onChange={e => setSku(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium">Price</label>
          <input className="border p-2 w-full" value={price} onChange={e => setPrice(e.target.value)} />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Product Attributes (filter options)</h2>
            <button type="button" className="text-sm text-blue-600" onClick={addAttr}>Add</button>
          </div>
          <div className="space-y-2 mt-2">
            {attributes.map((a, i) => (
              <div key={i} className="flex gap-2">
                <input placeholder="Attribute name (e.g. Shape)" className="border p-2 flex-1" value={a.name} onChange={e => updateAttr(i, 'name', e.target.value)} />
                <input placeholder="Value (e.g. Round)" className="border p-2 flex-1" value={a.value} onChange={e => updateAttr(i, 'value', e.target.value)} />
                <button type="button" className="text-red-600" onClick={() => removeAttr(i)}>×</button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading} type="submit">{loading ? 'Creating…' : 'Create Product'}</button>
        </div>
      </form>

      {result && (
        <pre className="mt-4 p-3 bg-gray-100 rounded">{JSON.stringify(result, null, 2)}</pre>
      )}
    </div>
  );
}
