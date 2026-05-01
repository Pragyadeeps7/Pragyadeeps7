import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HERO_SLIDES } from "../mock";

const HeroSlider = () => {
  const [active, setActive] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setActive(a => (a + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timerRef.current);
  }, []);

  const go = (dir) => {
    setActive(a => (a + dir + HERO_SLIDES.length) % HERO_SLIDES.length);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  return (
    <section className="relative w-full overflow-hidden" style={{ height: "min(78vh, 760px)" }}>
      {HERO_SLIDES.map((s, i) => (
        <div key={s.id} className="absolute inset-0 hero-slide"
          style={{ opacity: i === active ? 1 : 0, pointerEvents: i === active ? "auto" : "none" }}>
          <img src={s.image} alt={s.title} className="w-full h-full object-cover" loading={i === 0 ? "eager" : "lazy"} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(26,26,26,0.25) 0%, rgba(26,26,26,0.55) 100%)" }} />
          <div className="absolute inset-0 flex items-center">
            <div className={`max-w-[1440px] w-full mx-auto px-8 lg:px-16 ${
              s.align === "left" ? "justify-start text-left" : s.align === "right" ? "justify-end text-right" : "justify-center text-center"
            } flex`}>
              <div className="max-w-[640px] fade-in" key={`${s.id}-${i === active}`}>
                <p className="text-[12px] tracking-[0.4em] mb-5" style={{ color: "#E8D9B8" }}>{s.eyebrow}</p>
                <h2 className="font-serif-display text-white text-[40px] md:text-[58px] lg:text-[68px] leading-[1.05] mb-6 whitespace-pre-line"
                  style={{ fontWeight: 500 }}>
                  {s.title}
                </h2>
                <p className="text-white/85 text-[15px] md:text-[16px] mb-9 italic font-body" style={{ maxWidth: 560 }}>
                  {s.subtitle}
                </p>
                <div className={`flex flex-wrap gap-4 ${s.align === "center" ? "justify-center" : s.align === "right" ? "justify-end" : "justify-start"}`}>
                  <Link to={s.cta1.path} className="btn-gold">{s.cta1.label}</Link>
                  <Link to={s.cta2.path} className="btn-outline-gold">{s.cta2.label}</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <button aria-label="Previous" onClick={() => go(-1)}
        className="absolute left-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm flex items-center justify-center text-white transition-colors">
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button aria-label="Next" onClick={() => go(1)}
        className="absolute right-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm flex items-center justify-center text-white transition-colors">
        <ChevronRight className="w-5 h-5" />
      </button>

      <div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex gap-2.5">
        {HERO_SLIDES.map((_, i) => (
          <button key={i} onClick={() => setActive(i)}
            className={`h-[3px] transition-all ${i === active ? "w-10 bg-[#D4A574]" : "w-5 bg-white/60"}`}
            aria-label={`Go to slide ${i + 1}`} />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
