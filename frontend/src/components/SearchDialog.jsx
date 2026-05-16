import React, { useEffect, useState } from "react";
import { X, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../mock";
import { getProducts } from "../api/client";

const SearchDialog = () => {
  const { searchOpen, setSearchOpen } = useCart();
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!searchOpen) { setQ(""); setResults([]); }
  }, [searchOpen]);

  useEffect(() => {
    if (q.trim().length <= 1) { setResults([]); return; }
    const t = setTimeout(() => {
      getProducts({ q: q.trim(), limit: 8 }).then(d => setResults(d.items || [])).catch(() => setResults([]));
    }, 250);
    return () => clearTimeout(t);
  }, [q]);

  if (!searchOpen) return null;

  return (
    <div className="fixed inset-0 z-50" onClick={() => setSearchOpen(false)}>
      <div className="absolute inset-0 bg-black/50" />
      <div onClick={e => e.stopPropagation()} className="absolute top-0 left-0 right-0 bg-[#FAFAF7] scale-in max-h-[100vh] overflow-y-auto">
        <div className="max-w-[900px] mx-auto px-6 py-8">
          <div className="flex items-center gap-4 border-b pb-4" style={{ borderColor: "#1A1A1A" }}>
            <Search className="w-5 h-5" />
            <input autoFocus value={q} onChange={(e) => setQ(e.target.value)}
              placeholder="Search for vases, candles, dinnerware..."
              className="flex-1 bg-transparent outline-none font-serif-display text-[18px] md:text-[22px] placeholder:text-[#B5B0A2]" />
            <button onClick={() => setSearchOpen(false)}><X className="w-5 h-5" /></button>
          </div>
          <div className="py-6">
            {q.length <= 1 && (
              <div>
                <p className="text-[11px] md:text-[12px] tracking-[0.3em] mb-4" style={{ color: "#B89778" }}>POPULAR SEARCHES</p>
                <div className="flex flex-wrap gap-2">
                  {["Vase", "Candle", "Plate", "Tray", "Cushion", "Lamp", "Mug"].map(t => (
                    <button key={t} onClick={() => setQ(t)}
                      className="text-[13px] px-4 py-2 border hover:border-[#D4A574] hover:text-[#B89778] transition-colors" style={{ borderColor: "#E8E2D5" }}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {results.length > 0 && (
              <div className="grid sm:grid-cols-2 gap-4">
                {results.map(p => (
                  <Link key={p.id} to={`/product/${p.id}`} onClick={() => setSearchOpen(false)}
                    className="flex gap-4 p-3 hover:bg-white transition-colors">
                    <img src={p.image} alt={p.name} className="w-16 h-20 object-cover" />
                    <div>
                      <p className="text-[10px] tracking-[0.22em] uppercase" style={{ color: "#B89778" }}>{p.category}</p>
                      <h4 className="font-serif-display text-[16px] mb-1">{p.name}</h4>
                      <p className="text-[14px]">{formatPrice(p.price)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            {q.length > 1 && results.length === 0 && (
              <p className="text-center py-10 text-[14px]" style={{ color: "#8A8A8A" }}>No results found for "{q}"</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchDialog;
