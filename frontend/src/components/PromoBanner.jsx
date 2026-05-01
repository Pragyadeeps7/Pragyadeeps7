import React from "react";
import { Link } from "react-router-dom";
import { PROMO_BANNERS } from "../mock";

const PromoBanner = ({ index = 0, reverse = false }) => {
  const b = PROMO_BANNERS[index];
  if (!b) return null;
  return (
    <section className="py-16 lg:py-20">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
        <div className={`grid lg:grid-cols-2 gap-0 lg:gap-12 items-center ${reverse ? "lg:[direction:rtl]" : ""}`}>
          <div className="relative aspect-[4/3] lg:aspect-[5/4] overflow-hidden" style={{ direction: "ltr" }}>
            <img src={b.image} alt={b.title} className="w-full h-full object-cover" loading="lazy" />
          </div>
          <div className="py-10 lg:py-0 lg:px-10 text-left" style={{ direction: "ltr" }}>
            <p className="text-[12px] tracking-[0.4em] mb-4" style={{ color: "#B89778" }}>SAUKRITI EDIT</p>
            <h2 className="font-serif-display text-[34px] md:text-[46px] leading-tight mb-5 whitespace-pre-line">{b.title}</h2>
            <p className="text-[15px] mb-8 max-w-[440px] font-body" style={{ color: "#5C5C5C" }}>{b.subtitle}</p>
            <Link to={b.cta.path} className="btn-dark">{b.cta.label}</Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
