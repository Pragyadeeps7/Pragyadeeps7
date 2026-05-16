import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import TopBar from "../components/TopBar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { ChevronDown, SlidersHorizontal, X, Loader2 } from "lucide-react";
import { getProducts, getCategories } from "../api/client";

const Shop = () => {
  const [params, setParams] = useSearchParams();
  const category = params.get("category") || "all";
  const tag = params.get("tag") || undefined;
  const [sort, setSort] = useState("featured");
  const [priceMax, setPriceMax] = useState(30000);
  const [filterOpen, setFilterOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [cats, setCats] = useState([]);

  useEffect(() => { getCategories().then(setCats).catch(() => {}); }, []);

  useEffect(() => {
    setLoading(true);
    getProducts({
      category: category !== "all" ? category : undefined,
      tag, sort, min_price: 0, max_price: priceMax, limit: 60,
    }).then(d => { setItems(d.items || []); setTotal(d.total || 0); })
      .finally(() => setLoading(false));
  }, [category, tag, sort, priceMax]);

  const cleanCat = category === "all" ? "All Products" : (cats.find(c => c.id === category)?.name || category);

  return (
    <div>
      <TopBar />
      <Header />
      <section className="py-12 lg:py-16" style={{ background: "#F5EFE2" }}>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 text-center">
          <p className="text-[12px] tracking-[0.3em] mb-3" style={{ color: "#B89778" }}>SAUKRITI EDIT</p>
          <h1 className="font-serif-display text-[34px] md:text-[54px] leading-tight">{cleanCat}</h1>
          <div className="gold-line" />
          <p className="text-[14px] font-body max-w-[560px] mx-auto" style={{ color: "#5C5C5C" }}>
            Slow-made, hand-finished pieces curated for considered, soulful interiors.
          </p>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between mb-8 pb-4 border-b" style={{ borderColor: "#EFE7D6" }}>
            <div className="flex items-center gap-4">
              <button onClick={() => setFilterOpen(!filterOpen)} className="inline-flex items-center gap-2 text-[12px] tracking-[0.2em] font-medium hover:text-[#B89778]">
                <SlidersHorizontal className="w-4 h-4" /> FILTERS
              </button>
              <span className="text-[12px]" style={{ color: "#8A8A8A" }}>{total} products</span>
            </div>
            <div className="relative">
              <select value={sort} onChange={(e) => setSort(e.target.value)}
                className="appearance-none bg-transparent border-b text-[12px] tracking-[0.2em] font-medium pr-8 pb-1 cursor-pointer"
                style={{ borderColor: "#1A1A1A" }}>
                <option value="featured">SORT: FEATURED</option>
                <option value="new">NEWEST</option>
                <option value="low">PRICE: LOW TO HIGH</option>
                <option value="high">PRICE: HIGH TO LOW</option>
                <option value="rating">TOP RATED</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="grid lg:grid-cols-[240px_1fr] gap-10">
            <aside className={`${filterOpen ? "block" : "hidden lg:block"} space-y-8`}>
              <div>
                <h4 className="font-serif-display text-[16px] mb-4" style={{ fontWeight: 500 }}>Category</h4>
                <ul className="space-y-2">
                  <li><button onClick={() => setParams({})} className={`text-[13px] hover:text-[#B89778] ${category === "all" ? "text-[#B89778] font-medium" : ""}`}>All Products</button></li>
                  {cats.map(c => (
                    <li key={c.id}>
                      <button onClick={() => setParams({ category: c.id })} className={`text-[13px] hover:text-[#B89778] ${category === c.id ? "text-[#B89778] font-medium" : ""}`}>{c.name}</button>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-serif-display text-[16px] mb-4" style={{ fontWeight: 500 }}>Price</h4>
                <input type="range" min="500" max="30000" step="500" value={priceMax}
                  onChange={(e) => setPriceMax(parseInt(e.target.value))} className="w-full accent-[#D4A574]" />
                <div className="flex justify-between text-[12px] mt-2" style={{ color: "#5C5C5C" }}>
                  <span>500</span>
                  <span>Up to {priceMax.toLocaleString("en-IN")}</span>
                </div>
              </div>
              <div>
                <h4 className="font-serif-display text-[16px] mb-4" style={{ fontWeight: 500 }}>Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {["new", "sale", "bestseller", "festive", "luxe"].map(t => (
                    <button key={t} onClick={() => setParams(category !== "all" ? { category, tag: t } : { tag: t })}
                      className={`text-[11px] tracking-[0.18em] px-3 py-1.5 border uppercase ${tag === t ? "bg-[#1A1A1A] text-white border-[#1A1A1A]" : ""}`}
                      style={{ borderColor: tag === t ? "#1A1A1A" : "#E8E2D5" }}>{t}</button>
                  ))}
                  {tag && (
                    <button onClick={() => setParams(category !== "all" ? { category } : {})}
                      className="text-[11px] tracking-[0.18em] px-3 py-1.5 inline-flex items-center gap-1" style={{ color: "#B89778" }}>
                      <X className="w-3 h-3" /> CLEAR
                    </button>
                  )}
                </div>
              </div>
            </aside>

            <div>
              {loading ? (
                <div className="py-20 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin" style={{ color: "#D4A574" }} /></div>
              ) : items.length === 0 ? (
                <div className="py-20 text-center">
                  <p className="font-serif-display text-[24px] mb-3">No pieces match your filters</p>
                  <Link to="/shop" className="text-[13px] underline" style={{ color: "#B89778" }}>Reset filters</Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-5 lg:gap-8">
                  {items.map(p => <ProductCard key={p.id} product={p} />)}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Shop;
