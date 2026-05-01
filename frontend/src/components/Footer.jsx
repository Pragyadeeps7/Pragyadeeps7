import React from "react";
import { Instagram, Facebook, Twitter, Youtube, Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { FOOTER_LINKS } from "../mock";

const Footer = () => (
  <footer style={{ background: "#1A1A1A", color: "#E8D9B8" }}>
    <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-20">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
        <div className="col-span-2 md:col-span-3 lg:col-span-1">
          <h3 className="font-serif-display text-[28px] tracking-[0.3em] mb-5" style={{ color: "#FAFAF7" }}>SAUKRITI</h3>
          <p className="text-[14px] font-body leading-relaxed mb-6" style={{ color: "#B5B0A2" }}>
            Crafted pieces with a soul. Slow-made, mindful objects for a meaningful home.
          </p>
          <div className="flex items-center gap-2 text-[13px] mb-2" style={{ color: "#B5B0A2" }}>
            <Mail className="w-4 h-4" /> hello@saukriti.in
          </div>
          <div className="flex items-center gap-2 text-[13px]" style={{ color: "#B5B0A2" }}>
            <Phone className="w-4 h-4" /> +91 98XX XXXXXX
          </div>
        </div>
        {Object.entries(FOOTER_LINKS).map(([title, items]) => (
          <div key={title}>
            <h4 className="font-serif-display text-[16px] mb-5" style={{ color: "#FAFAF7", fontWeight: 500 }}>{title}</h4>
            <ul className="space-y-3">
              {items.map(item => (
                <li key={item}>
                  <Link to="#" className="text-[13px] font-body hover:text-[#D4A574] transition-colors" style={{ color: "#B5B0A2" }}>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mt-16 pt-8 border-t" style={{ borderColor: "#2A2A2A" }}>
        <p className="text-[12px] font-body" style={{ color: "#8A8A8A" }}>
           {new Date().getFullYear()} Saukriti. All rights reserved.  Crafted in India with care.
        </p>
        <div className="flex items-center gap-5">
          {[Instagram, Facebook, Twitter, Youtube].map((Icon, i) => (
            <a key={i} href="#" className="hover:text-[#D4A574] transition-colors" aria-label="social">
              <Icon className="w-[18px] h-[18px]" strokeWidth={1.5} />
            </a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
