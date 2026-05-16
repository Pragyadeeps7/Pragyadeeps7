import React, { useEffect, useState } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { getTestimonials } from "../api/client";

const Testimonials = () => {
  const [items, setItems] = useState([]);
  const [active, setActive] = useState(0);

  useEffect(() => { getTestimonials().then(setItems).catch(() => {}); }, []);

  useEffect(() => {
    if (!items.length) return;
    const t = setInterval(() => setActive(a => (a + 1) % items.length), 5000);
    return () => clearInterval(t);
  }, [items]);

  if (!items.length) return null;
  const cur = items[active];

  return (
    <section className="py-20 md:py-24 lg:py-32" style={{ background: "#1A1A1A" }}>
      <div className="max-w-[900px] mx-auto px-6 text-center">
        <p className="text-[11px] md:text-[12px] tracking-[0.4em] mb-4" style={{ color: "#D4A574" }}>FROM OUR PATRONS</p>
        <h2 className="font-serif-display text-[28px] md:text-[42px] mb-10 md:mb-12" style={{ color: "#FAFAF7" }}>Loved across India</h2>
        <div className="flex justify-center mb-6 text-[#D4A574]">
          {[...Array(cur.rating)].map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-current" strokeWidth={1.5} />
          ))}
        </div>
        <blockquote className="font-serif-display italic text-[18px] md:text-[24px] lg:text-[28px] leading-relaxed mb-8 fade-in" key={cur.id}
          style={{ color: "#FAFAF7", fontWeight: 400 }}>
          &ldquo;{cur.quote}&rdquo;
        </blockquote>
        <p className="text-[13px] md:text-[14px] tracking-[0.18em] uppercase font-body" style={{ color: "#E8D9B8" }}>
          {cur.name}  {cur.city}
        </p>
        <p className="text-[12px] mt-2" style={{ color: "#8A8A8A" }}>on {cur.product}</p>

        <div className="flex justify-center items-center gap-4 mt-10 md:mt-12">
          <button onClick={() => setActive(a => (a - 1 + items.length) % items.length)}
            className="w-10 h-10 border border-white/30 hover:border-[#D4A574] text-white hover:text-[#D4A574] transition-colors flex items-center justify-center">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex gap-2">
            {items.map((_, i) => (
              <button key={i} onClick={() => setActive(i)}
                className={`h-[2px] transition-all ${i === active ? "w-8 bg-[#D4A574]" : "w-4 bg-white/30"}`} />
            ))}
          </div>
          <button onClick={() => setActive(a => (a + 1) % items.length)}
            className="w-10 h-10 border border-white/30 hover:border-[#D4A574] text-white hover:text-[#D4A574] transition-colors flex items-center justify-center">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
