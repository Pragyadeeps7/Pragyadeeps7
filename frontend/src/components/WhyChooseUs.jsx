import React from "react";
import { Truck, Gift, RefreshCw, Leaf } from "lucide-react";
import { WHY_CHOOSE } from "../mock";

const ICONS = { truck: Truck, gift: Gift, refresh: RefreshCw, leaf: Leaf };

const WhyChooseUs = () => (
  <section className="py-16 lg:py-20" style={{ background: "#F5EFE2" }}>
    <div className="max-w-[1440px] mx-auto px-6 lg:px-10 grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
      {WHY_CHOOSE.map((w, i) => {
        const Icon = ICONS[w.icon];
        return (
          <div key={i} className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white flex items-center justify-center" style={{ color: "#D4A574" }}>
              <Icon className="w-5 h-5" strokeWidth={1.6} />
            </div>
            <div>
              <h4 className="font-serif-display text-[18px] mb-1" style={{ fontWeight: 500 }}>{w.title}</h4>
              <p className="text-[13px] font-body" style={{ color: "#5C5C5C" }}>{w.text}</p>
            </div>
          </div>
        );
      })}
    </div>
  </section>
);

export default WhyChooseUs;
