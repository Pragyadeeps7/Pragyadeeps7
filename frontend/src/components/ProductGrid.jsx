import React from "react";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";

const ProductGrid = ({ title, eyebrow, products, viewAllPath = "/shop", columns = 4 }) => {
  const colClass = columns === 4 ? "md:grid-cols-3 lg:grid-cols-4" : columns === 3 ? "md:grid-cols-3" : "md:grid-cols-2";
  return (
    <section className="py-20 lg:py-24">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
        <div className="flex items-end justify-between mb-12 flex-wrap gap-6">
          <div>
            {eyebrow && <p className="text-[12px] tracking-[0.4em] mb-3" style={{ color: "#B89778" }}>{eyebrow}</p>}
            <h2 className="font-serif-display text-[32px] md:text-[40px] leading-tight">{title}</h2>
          </div>
          <Link to={viewAllPath} className="text-[12px] tracking-[0.22em] font-medium pb-1 border-b border-[#1A1A1A] hover:text-[#B89778] hover:border-[#B89778] transition-colors">
            VIEW ALL
          </Link>
        </div>
        <div className={`grid grid-cols-2 ${colClass} gap-6 lg:gap-8`}>
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
