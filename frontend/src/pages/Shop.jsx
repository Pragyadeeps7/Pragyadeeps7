import React, { useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import TopBar from "../components/TopBar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { PRODUCTS, CATEGORIES } from "../mock";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";

const Shop = () => {
  const [params, setParams] = useSearchParams();
  const category = params.get("category") || "all";
  const tag = params.get("tag");
  const [sort, setSort] = useState("featured");
  const [priceRange, setPriceRange] = useState([0, 30000]);
  const [filterOpen, setFilterOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = [...PRODUCTS];
    if (category !== "all") list = list.filter(p => p.category === category);
    if (tag) list = list.filter(p => p.tags.includes(tag));
    list = list.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (sort === "low") list.sort((a, b) => a.price - b.price);
    if (sort === "high") list.sort((a, b) => b.price - a.price);
    if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    if (sort === "new") list.sort((a, b) => (b.tags.includes("new") ? 1 : 0) - (a.tags.includes("new") ? 1 : 0));
    return list;
  }, [category, tag, sort, priceRange]);

  const cleanCat = category === "all" ? "All Products" : (CATEGORIES.find(c => c.id === category)?.name || category);

  return (
    <div>
      <TopBar />
      <Header />
      <section className="py-12 lg:py-16" style={{ background: "#F5EFE2" }}>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 text-center">
          <p className="text-[12px] tracking-[0.3em] mb-3" style={{ color: "#B89778" }}>SAUKRITI EDIT</p>
          <h1 className="font-serif-display text-[40px] md:text-[54px] leading-tight">{cleanCat}</h1>
          <div className="gold-line" />
          <p className="text-[14px] font-body max-w-[560px] mx-auto" style={{ color: "#5C5C5C" }}>
            Slow-made, hand-finished pieces curated for considered, soulful interiors.
          </p>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b" style={{ borderColor: "#EFE7D6" }}>
            <div className="flex items-center gap-4">
              <button onClick={() => setFilterOpen(!filterOpen)}
                className="inline-flex items-center gap-2 text-[12px] tracking-[0.2em] font-medium hover:text-[#B89778] transition-colors">
                <SlidersHorizontal className="w-4 h-4" /> FILTERS
              </button>
              <span className="text-[12px]" style={{ color: "#8A8A8A" }}>{filtered.length} products</span>
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
            {/* Filters */}
            <aside className={`${filterOpen ? "block" : "hidden lg:block"} space-y-8`}>
              <div>
                <h4 className="font-serif-display text-[16px] mb-4" style={{ fontWeight: 500 }}>Category</h4>
                <ul className="space-y-2">
                  <li>
                    <button onClick={() => setParams({})}
                      className={`text-[13px] hover:text-[#B89778] ${category === "all" ? "text-[#B89778] font-medium" : ""}`}>
                      All Products
                    </button>
                  </li>
                  {CATEGORIES.map(c => (
                    <li key={c.id}>
                      <button onClick={() => setParams({ category: c.id })}
                        className={`text-[13px] hover:text-[#B89778] ${category === c.id ? "text-[#B89778] font-medium" : ""}`}>
                        {c.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-serif-display text-[16px] mb-4" style={{ fontWeight: 500 }}>Price</h4>
                <input type="range" min="500" max="30000" step="500" value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  className="w-full accent-[#D4A574]" />
                <div className="flex justify-between text-[12px] mt-2" style={{ color: "#5C5C5C" }}>
                  <span>500</span>
                  <span>Up to {priceRange[1].toLocaleString("en-IN")}</span>
                </div>
              </div>
              <div>
                <h4 className="font-serif-display text-[16px] mb-4" style={{ fontWeight: 500 }}>Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {["new", "sale", "bestseller", "festive", "luxe"].map(t => (
                    <button key={t} onClick={() => setParams(category !== "all" ? { category, tag: t } : { tag: t })}
                      className={`text-[11px] tracking-[0.18em] px-3 py-1.5 border uppercase transition-colors ${tag === t ? "bg-[#1A1A1A] text-white border-[#1A1A1A]" : ""}`}
                      style={{ borderColor: tag === t ? "#1A1A1A" : "#E8E2D5" }}>
                      {t}
                    </button>
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

            {/* Grid */}
            <div>
              {filtered.length === 0 ? (
                <div className="py-20 text-center">
                  <p className="font-serif-display text-[24px] mb-3">No pieces match your filters</p>
                  <Link to="/shop" className="text-[13px] underline" style={{ color: "#B89778" }}>Reset filters</Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8">
                  {filtered.map(p => <ProductCard key={p.id} product={p} />)}
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
