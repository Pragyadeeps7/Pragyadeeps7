import React, { useState } from "react";
import { X, Heart, Star, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../mock";
import { Link } from "react-router-dom";

const QuickViewModal = () => {
  const { quickView, setQuickView, addToCart, toggleWishlist, wishlist } = useCart();
  const [qty, setQty] = useState(1);
  const [color, setColor] = useState(0);
  const [size, setSize] = useState("M");

  if (!quickView) return null;
  const p = quickView;
  const wished = wishlist.includes(p.id);
  const close = () => { setQuickView(null); setQty(1); setColor(0); setSize("M"); };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={close}>
      <div className="absolute inset-0 bg-black/60" />
      <div onClick={(e) => e.stopPropagation()}
        className="relative bg-[#FAFAF7] max-w-[980px] w-full max-h-[90vh] overflow-y-auto grid lg:grid-cols-2 scale-in">
        <button onClick={close} className="absolute top-4 right-4 z-10 w-9 h-9 bg-white shadow-luxe flex items-center justify-center">
          <X className="w-4 h-4" />
        </button>
        <div className="aspect-[4/5] bg-[#F5F0E5]">
          <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
        </div>
        <div className="p-8 lg:p-10 flex flex-col">
          <p className="text-[11px] tracking-[0.28em] uppercase mb-2" style={{ color: "#B89778" }}>{p.category}</p>
          <h2 className="font-serif-display text-[28px] lg:text-[32px] mb-3" style={{ fontWeight: 500 }}>{p.name}</h2>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-0.5 text-[#D4A574]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(p.rating) ? "fill-current" : ""}`} strokeWidth={1.5} />
              ))}
            </div>
            <span className="text-[12px]" style={{ color: "#8A8A8A" }}>{p.rating}  ({p.reviews} reviews)</span>
          </div>
          <div className="flex items-baseline gap-3 mb-6">
            <span className="font-serif-display text-[26px]" style={{ fontWeight: 600 }}>{formatPrice(p.price)}</span>
            {p.compareAtPrice && (
              <span className="text-[15px] line-through" style={{ color: "#8A8A8A" }}>{formatPrice(p.compareAtPrice)}</span>
            )}
          </div>
          <p className="text-[14px] font-body leading-relaxed mb-6" style={{ color: "#5C5C5C" }}>{p.description}</p>

          <div className="mb-5">
            <p className="text-[12px] tracking-[0.2em] mb-3" style={{ color: "#1A1A1A" }}>COLOUR</p>
            <div className="flex gap-3">
              {p.colors.map((c, i) => (
                <button key={i} onClick={() => setColor(i)}
                  className={`w-9 h-9 rounded-full border-2 transition-all ${color === i ? "ring-2 ring-offset-2 ring-[#D4A574]" : ""}`}
                  style={{ background: c, borderColor: "#fff" }} aria-label="Select color" />
              ))}
            </div>
          </div>

          <div className="mb-6">
            <p className="text-[12px] tracking-[0.2em] mb-3" style={{ color: "#1A1A1A" }}>SIZE</p>
            <div className="flex gap-2">
              {p.sizes.map(s => (
                <button key={s} onClick={() => setSize(s)}
                  className={`w-11 h-11 border text-[13px] font-medium transition-colors ${size === s ? "bg-[#1A1A1A] text-white border-[#1A1A1A]" : ""}`}
                  style={{ borderColor: size === s ? "#1A1A1A" : "#E8E2D5" }}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="inline-flex items-center border" style={{ borderColor: "#E8E2D5" }}>
              <button className="w-11 h-11 flex items-center justify-center hover:bg-[#F5EFE2]" onClick={() => setQty(q => Math.max(1, q - 1))}><Minus className="w-3.5 h-3.5" /></button>
              <span className="w-10 text-center text-[14px]">{qty}</span>
              <button className="w-11 h-11 flex items-center justify-center hover:bg-[#F5EFE2]" onClick={() => setQty(q => q + 1)}><Plus className="w-3.5 h-3.5" /></button>
            </div>
            <button onClick={() => { addToCart(p, qty); close(); }} className="btn-dark flex-1 flex items-center justify-center gap-2">
              <ShoppingBag className="w-4 h-4" /> Add to Cart
            </button>
            <button onClick={() => toggleWishlist(p.id)}
              className={`w-11 h-11 border flex items-center justify-center transition-colors ${wished ? "text-[#B89778]" : "text-[#1A1A1A]"}`}
              style={{ borderColor: "#E8E2D5" }}>
              <Heart className={`w-4 h-4 ${wished ? "fill-current" : ""}`} />
            </button>
          </div>

          <Link to={`/product/${p.id}`} onClick={close} className="text-[12px] underline self-start" style={{ color: "#B89778" }}>
            View full details 
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
