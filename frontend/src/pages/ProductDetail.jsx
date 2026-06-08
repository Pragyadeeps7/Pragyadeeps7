import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import TopBar from "../components/TopBar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { formatPrice } from "../mock";
import { useCart } from "../context/CartContext";
import { Star, Heart, Minus, Plus, ShoppingBag, Truck, RefreshCw, ShieldCheck, ChevronRight, Loader2 } from "lucide-react";
import { getProduct, getProducts } from "../api/client";
import ProductReviews from "../components/ProductReviews";

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart, toggleWishlist, wishlist } = useCart();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [color, setColor] = useState(0);
  const [size, setSize] = useState("M");
  const [tab, setTab] = useState("details");
  const [thumb, setThumb] = useState(0);

  useEffect(() => {
    setLoading(true);
    setQty(1); setColor(0); setSize("M"); setThumb(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
    getProduct(id).then(async (p) => {
      setProduct(p);
      const r = await getProducts({ category: p.category, limit: 5 });
      setRelated((r.items || []).filter(x => x.id !== p.id).slice(0, 4));
    }).catch(() => setProduct(null)).finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div>
        <TopBar /><Header />
        <div className="py-32 flex justify-center"><Loader2 className="w-8 h-8 animate-spin" style={{ color: "#D4A574" }} /></div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div>
        <TopBar /><Header />
        <div className="py-32 text-center">
          <p className="font-serif-display text-[28px] mb-4">Piece not found</p>
          <Link to="/shop" className="btn-gold">Back to Shop</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const wished = wishlist.includes(product.id);

  return (
    <div>
      <TopBar /><Header />
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-6">
        <nav className="flex items-center gap-2 text-[11px] md:text-[12px] tracking-[0.18em] flex-wrap" style={{ color: "#8A8A8A" }}>
          <Link to="/" className="hover:text-[#B89778]">HOME</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/shop" className="hover:text-[#B89778]">SHOP</Link>
          <ChevronRight className="w-3 h-3" />
          <span style={{ color: "#1A1A1A" }}>{product.name.toUpperCase()}</span>
        </nav>
      </div>

      <section className="max-w-[1440px] mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-8 lg:gap-12 pb-16">
        <div>
          <div className="aspect-[4/5] bg-[#F5F0E5] mb-4">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="grid grid-cols-4 gap-3">
            {[0,1,2,3].map(i => (
              <button key={i} onClick={() => setThumb(i)} className="aspect-square bg-[#F5F0E5] border" style={{ borderColor: thumb === i ? "#1A1A1A" : "transparent" }}>
                <img src={product.image} alt="thumb" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
        <div className="py-2">
          <p className="text-[11px] tracking-[0.28em] uppercase mb-2" style={{ color: "#B89778" }}>{product.category}</p>
          <h1 className="font-serif-display text-[28px] md:text-[40px] lg:text-[44px] leading-tight mb-3" style={{ fontWeight: 500 }}>{product.name}</h1>
          <div className="flex items-center gap-2 mb-5">
            <div className="flex items-center gap-0.5 text-[#D4A574]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < Math.round(product.rating) ? "fill-current" : ""}`} strokeWidth={1.5} />
              ))}
            </div>
            <span className="text-[12px]" style={{ color: "#8A8A8A" }}>{product.rating}  ({product.reviews} reviews)</span>
          </div>
          <div className="flex items-baseline gap-3 mb-2">
            <span className="font-serif-display text-[26px] md:text-[30px]" style={{ fontWeight: 600 }}>{formatPrice(product.price)}</span>
            {product.compareAtPrice && (
              <span className="text-[15px] md:text-[16px] line-through" style={{ color: "#8A8A8A" }}>{formatPrice(product.compareAtPrice)}</span>
            )}
          </div>
          <p className="text-[12px] mb-7" style={{ color: "#8A8A8A" }}>Inclusive of all taxes  Free shipping over 2,000</p>

          <p className="text-[14px] md:text-[15px] font-body leading-relaxed mb-7" style={{ color: "#5C5C5C" }}>{product.description}</p>

          <div className="mb-6">
            <p className="text-[12px] tracking-[0.2em] mb-3">COLOUR</p>
            <div className="flex gap-3 flex-wrap">
              {product.colors.map((c, i) => (
                <button key={i} onClick={() => setColor(i)}
                  className={`w-10 h-10 rounded-full border-2 ${color === i ? "ring-2 ring-offset-2 ring-[#D4A574]" : ""}`}
                  style={{ background: c, borderColor: "#fff" }} aria-label="color" />
              ))}
            </div>
          </div>

          <div className="mb-7">
            <p className="text-[12px] tracking-[0.2em] mb-3">SIZE</p>
            <div className="flex gap-2 flex-wrap">
              {product.sizes.map(s => (
                <button key={s} onClick={() => setSize(s)}
                  className={`w-12 h-12 border text-[14px] font-medium ${size === s ? "bg-[#1A1A1A] text-white border-[#1A1A1A]" : ""}`}
                  style={{ borderColor: size === s ? "#1A1A1A" : "#E8E2D5" }}>{s}</button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 mb-8 flex-wrap">
            <div className="inline-flex items-center border" style={{ borderColor: "#E8E2D5" }}>
              <button className="w-12 h-12 flex items-center justify-center hover:bg-[#F5EFE2]" onClick={() => setQty(q => Math.max(1, q - 1))}><Minus className="w-4 h-4" /></button>
              <span className="w-10 text-center text-[14px]">{qty}</span>
              <button className="w-12 h-12 flex items-center justify-center hover:bg-[#F5EFE2]" onClick={() => setQty(q => q + 1)}><Plus className="w-4 h-4" /></button>
            </div>
            <button onClick={() => addToCart(product, qty)} className="btn-dark flex-1 min-w-[200px] flex items-center justify-center gap-2">
              <ShoppingBag className="w-4 h-4" /> Add to Cart
            </button>
            <button onClick={() => toggleWishlist(product.id)}
              className={`w-12 h-12 border flex items-center justify-center ${wished ? "text-[#B89778]" : ""}`} style={{ borderColor: "#E8E2D5" }}>
              <Heart className={`w-4 h-4 ${wished ? "fill-current" : ""}`} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-5 border-t border-b" style={{ borderColor: "#EFE7D6" }}>
            {[{ i: Truck, t: "Free shipping" }, { i: RefreshCw, t: "7-day returns" }, { i: ShieldCheck, t: "Quality assured" }].map(({ i: I, t }) => (
              <div key={t} className="flex items-center gap-2">
                <I className="w-4 h-4" style={{ color: "#D4A574" }} />
                <span className="text-[12px]">{t}</span>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <div className="flex gap-6 border-b overflow-x-auto" style={{ borderColor: "#EFE7D6" }}>
              {["details", "shipping", "reviews"].map(t => (
                <button key={t} onClick={() => setTab(t)} className={`pb-3 text-[12px] tracking-[0.22em] uppercase font-medium whitespace-nowrap ${tab === t ? "border-b-2 border-[#1A1A1A]" : ""}`}
                  style={{ color: tab === t ? "#1A1A1A" : "#8A8A8A" }}>{t}</button>
              ))}
            </div>
            <div className="py-5 text-[14px] leading-relaxed" style={{ color: "#5C5C5C" }}>
              {tab === "details" && (
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>Hand-finished by skilled artisans</li>
                  <li>Materials: premium ceramic, brass accents</li>
                  <li>Subtle imperfections celebrate the handmade nature</li>
                  <li>Care: hand-wash in warm soapy water; dry promptly</li>
                </ul>
              )}
              {tab === "shipping" && <p>Dispatched in 1-3 working days. Free shipping on orders above 2,000.</p>}
              {tab === "reviews" && <ProductReviews productId={product.id} />}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16" style={{ background: "#FAFAF7" }}>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
          <h3 className="font-serif-display text-[24px] md:text-[28px] mb-10 text-center">You may also love</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 lg:gap-6">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ProductDetail;
