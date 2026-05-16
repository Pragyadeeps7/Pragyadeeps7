import React from "react";
import { Heart, Eye, Star, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../mock";

const ProductCard = ({ product }) => {
  const { addToCart, toggleWishlist, wishlist, setQuickView } = useCart();
  const wished = wishlist.includes(product.id);
  const discount = product.compareAtPrice ? Math.round((1 - product.price / product.compareAtPrice) * 100) : 0;

  return (
    <div className="product-card group relative" >
      <div className="product-img-wrap relative aspect-[4/5] bg-[#F5F0E5]">
        <Link to={`/product/${product.id}`}>
          <img src={product.image} alt={product.name}
            className="product-img absolute inset-0 w-full h-full object-cover" loading="lazy" />
        </Link>
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.tags.includes("new") && (
            <span className="text-[10px] tracking-[0.2em] px-2.5 py-1 bg-white text-[#1A1A1A]">NEW</span>
          )}
          {discount > 0 && (
            <span className="text-[10px] tracking-[0.2em] px-2.5 py-1 bg-[#1A1A1A] text-white">-{discount}%</span>
          )}
          {product.tags.includes("bestseller") && (
            <span className="text-[10px] tracking-[0.2em] px-2.5 py-1 text-white" style={{ background: "#D4A574" }}>BESTSELLER</span>
          )}
        </div>
        {/* Right floating actions - always visible on mobile, hover on desktop */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
          <button onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); }}
            className={`w-9 h-9 flex items-center justify-center bg-white shadow-luxe transition-colors ${wished ? "text-[#B89778]" : "text-[#1A1A1A]"}`}
            aria-label="Wishlist">
            <Heart className={`w-4 h-4 ${wished ? "fill-current" : ""}`} />
          </button>
          <button onClick={(e) => { e.preventDefault(); setQuickView(product); }}
            className="hidden md:flex w-9 h-9 items-center justify-center bg-white shadow-luxe text-[#1A1A1A] hover:text-[#B89778] transition-colors"
            aria-label="Quick view">
            <Eye className="w-4 h-4" />
          </button>
        </div>
        {/* Add to cart bottom - always visible on mobile */}
        <button onClick={() => addToCart(product, 1)}
          className="absolute bottom-0 left-0 right-0 py-2.5 md:py-3 bg-[#1A1A1A] text-white text-[11px] md:text-[12px] tracking-[0.22em] font-medium md:translate-y-full md:group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center gap-2"
          aria-label="Add to cart">
          <ShoppingBag className="w-4 h-4" /> ADD TO CART
        </button>
      </div>
      <div className="pt-4 pb-2">
        <p className="text-[11px] tracking-[0.22em] uppercase mb-1" style={{ color: "#B89778" }}>{product.category}</p>
        <Link to={`/product/${product.id}`}>
          <h3 className="font-serif-display text-[17px] leading-snug mb-2 hover:text-[#B89778] transition-colors" style={{ fontWeight: 500 }}>
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-0.5 text-[#D4A574]">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-3 h-3 ${i < Math.round(product.rating) ? "fill-current" : ""}`} strokeWidth={1.5} />
            ))}
          </div>
          <span className="text-[11px]" style={{ color: "#8A8A8A" }}>({product.reviews})</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-serif-display text-[18px]" style={{ fontWeight: 600 }}>{formatPrice(product.price)}</span>
          {product.compareAtPrice && (
            <span className="text-[13px] line-through" style={{ color: "#8A8A8A" }}>{formatPrice(product.compareAtPrice)}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
