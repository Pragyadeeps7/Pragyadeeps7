import React from "react";
import { Link } from "react-router-dom";
import { CATEGORIES } from "../mock";

const CategoryGrid = () => (
  <section className="py-20 lg:py-24" style={{ background: "#FAFAF7" }}>
    <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
      <div className="text-center mb-14">
        <p className="text-[12px] tracking-[0.4em] mb-3" style={{ color: "#B89778" }}>SHOP BY CATEGORY</p>
        <h2 className="font-serif-display text-[34px] md:text-[42px] leading-tight">Everything for a meaningful home</h2>
        <div className="gold-line" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 lg:gap-7">
        {CATEGORIES.map(c => (
          <Link key={c.id} to={`/shop?category=${c.id}`}
            className="group relative block aspect-[4/5] overflow-hidden">
            <img src={c.image} alt={c.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.0) 40%, rgba(0,0,0,0.55) 100%)" }} />
            <div className="absolute bottom-7 left-7 right-7">
              <h3 className="font-serif-display text-white text-[26px] leading-none" style={{ fontWeight: 500 }}>{c.name}</h3>
              <p className="text-[11px] tracking-[0.32em] mt-2" style={{ color: "#E8D9B8" }}>SHOP NOW </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default CategoryGrid;
