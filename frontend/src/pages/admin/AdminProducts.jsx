import React, { useEffect, useState } from "react";
import { getProducts, adminCreateProduct, adminUpdateProduct, adminDeleteProduct } from "../../api/client";
import { formatPrice } from "../../mock";
import { Loader2, Plus, Pencil, Trash2, X } from "lucide-react";
import { useToast } from "../../hooks/use-toast";

const empty = {
  name: "", category: "decor", image: "", price: 1500, compareAtPrice: "",
  description: "", tags: "new", stock: 50,
};

const AdminProducts = () => {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const { toast } = useToast();

  const load = () => {
    setLoading(true);
    getProducts({ limit: 200 }).then(d => { setItems(d.items); setTotal(d.total); }).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const open = (p) => {
    if (p) {
      setEditing(p);
      setForm({
        name: p.name, category: p.category, image: p.image, price: p.price,
        compareAtPrice: p.compareAtPrice || "", description: p.description || "",
        tags: (p.tags || []).join(","), stock: p.stock ?? 100,
      });
    } else {
      setEditing({ new: true });
      setForm(empty);
    }
  };
  const close = () => { setEditing(null); setForm(empty); };

  const save = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : null,
        stock: Number(form.stock),
        tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
      };
      if (editing?.new) {
        await adminCreateProduct(payload);
        toast({ title: "Product added" });
      } else {
        await adminUpdateProduct(editing.id, payload);
        toast({ title: "Product updated" });
      }
      close(); load();
    } catch (err) {
      toast({ title: "Save failed", description: err?.response?.data?.detail || "Please check the fields." });
    }
  };

  const remove = async (p) => {
    if (!window.confirm(`Delete "${p.name}"?`)) return;
    try {
      await adminDeleteProduct(p.id);
      toast({ title: "Deleted" });
      setItems(prev => prev.filter(x => x.id !== p.id));
    } catch {
      toast({ title: "Delete failed" });
    }
  };

  return (
    <div>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] md:text-[12px] tracking-[0.4em] mb-2" style={{ color: "#B89778" }}>CATALOGUE</p>
          <h1 className="font-serif-display text-[28px] md:text-[40px]">Products  <span className="text-[18px] font-body align-middle" style={{ color: "#8A8A8A" }}>{total} total</span></h1>
        </div>
        <button onClick={() => open(null)} className="inline-flex items-center gap-2 btn-dark">
          <Plus className="w-4 h-4" /> New Product
        </button>
      </header>

      {loading ? (
        <div className="py-12 flex justify-center"><Loader2 className="w-6 h-6 animate-spin" style={{ color: "#D4A574" }} /></div>
      ) : (
        <div className="bg-white border overflow-x-auto" style={{ borderColor: "#EFE7D6" }}>
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-left" style={{ background: "#F5EFE2" }}>
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {items.map(p => (
                <tr key={p.id} className="border-t" style={{ borderColor: "#EFE7D6" }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="w-12 h-14 object-cover" />
                      <div>
                        <p className="font-serif-display">{p.name}</p>
                        <p className="text-[11px]" style={{ color: "#8A8A8A" }}>{p.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 capitalize">{p.category}</td>
                  <td className="px-4 py-3">{formatPrice(p.price)}</td>
                  <td className="px-4 py-3">{p.stock ?? ""}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <button onClick={() => open(p)} className="p-1.5 hover:text-[#B89778] mr-2"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => remove(p)} className="p-1.5 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={close}>
          <div className="absolute inset-0 bg-black/60" />
          <form onSubmit={save} onClick={e => e.stopPropagation()}
            className="relative bg-white max-w-[640px] w-full max-h-[90vh] overflow-y-auto p-7 scale-in">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-serif-display text-[22px]">{editing.new ? "New Product" : "Edit Product"}</h3>
              <button type="button" onClick={close}><X className="w-5 h-5" /></button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <input className="px-3 py-2.5 border sm:col-span-2" style={{ borderColor: "#E8E2D5" }} placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="px-3 py-2.5 border" style={{ borderColor: "#E8E2D5" }}>
                {["dining","kitchen","decor","bath","bags","soft","gifts","sale"].map(c => <option key={c}>{c}</option>)}
              </select>
              <input className="px-3 py-2.5 border" style={{ borderColor: "#E8E2D5" }} placeholder="Stock" type="number" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} />
              <input className="px-3 py-2.5 border" style={{ borderColor: "#E8E2D5" }} placeholder="Price (INR)" type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
              <input className="px-3 py-2.5 border" style={{ borderColor: "#E8E2D5" }} placeholder="Compare-at price (optional)" type="number" value={form.compareAtPrice} onChange={e => setForm({...form, compareAtPrice: e.target.value})} />
              <input className="px-3 py-2.5 border sm:col-span-2" style={{ borderColor: "#E8E2D5" }} placeholder="Image URL" value={form.image} onChange={e => setForm({...form, image: e.target.value})} required />
              <input className="px-3 py-2.5 border sm:col-span-2" style={{ borderColor: "#E8E2D5" }} placeholder="Tags (comma separated: new,sale,bestseller)" value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} />
              <textarea rows="3" className="px-3 py-2.5 border sm:col-span-2" style={{ borderColor: "#E8E2D5" }} placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
            </div>
            <div className="flex gap-3 mt-6">
              <button type="submit" className="btn-dark flex-1">Save</button>
              <button type="button" onClick={close} className="px-5 py-3 border" style={{ borderColor: "#E8E2D5" }}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
