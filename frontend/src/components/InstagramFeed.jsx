import React from "react";
import { Instagram } from "lucide-react";
import { INSTA_FEED } from "../mock";

const InstagramFeed = () => (
  <section className="py-20">
    <div className="max-w-[1440px] mx-auto px-6 lg:px-10 text-center mb-12">
      <p className="text-[12px] tracking-[0.4em] mb-3" style={{ color: "#B89778" }}>FOLLOW THE STORY</p>
      <h2 className="font-serif-display text-[32px] md:text-[40px] flex items-center justify-center gap-3">
        <Instagram className="w-7 h-7" strokeWidth={1.4} /> @saukriti.home
      </h2>
      <div className="gold-line" />
    </div>
    <div className="grid grid-cols-4 lg:grid-cols-8 gap-1">
      {INSTA_FEED.map((src, i) => (
        <a key={i} href="#" className="group relative block aspect-square overflow-hidden">
          <img src={src} alt="Instagram" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
          <div className="absolute inset-0 bg-[#1A1A1A]/0 group-hover:bg-[#1A1A1A]/40 transition-colors flex items-center justify-center">
            <Instagram className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </a>
      ))}
    </div>
  </section>
);

export default InstagramFeed;
