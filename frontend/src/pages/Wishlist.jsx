import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TopBar from "../components/TopBar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import { getProduct } from "../api/client";
import { Heart, Loader2 } from "lucide-react";

const Wishlist = () => {
  const { wishlist } = useCart();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (wishlist.length === 0) { setItems([]); setLoading(false); return; }
    setLoading(true);
    Promise.all(wishlist.map(id => getProduct(id).catch(() => null)))
      .then(arr => setItems(arr.filter(Boolean)))
      .finally(() => setLoading(false));
  }, [wishlist]);

  return (
    <div>
      <TopBar /><Header />
      <section className="py-12 lg:py-16" style={{ background: "#F5EFE2" }}>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 text-center">
          <p className="text-[11px] md:text-[12px] tracking-[0.3em] mb-3" style={{ color: "#B89778" }}>SAVED FOR LATER</p>
          <h1 className="font-serif-display text-[32px] md:text-[54px] leading-tight">Your Wishlist</h1>
          <div className="gold-line" />
          <p className="text-[14px] font-body max-w-[560px] mx-auto" style={{ color: "#5C5C5C" }}>
            The pieces you&rsquo;ve fallen for, gathered in one quiet place.
          </p>
        </div>
      </section>
      <section className="py-12 lg:py-16">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
          {loading ? (
            <div className="py-20 flex justify-center"><Loader2 className="w-6 h-6 animate-spin" style={{ color: "#D4A574" }} /></div>
          ) : items.length === 0 ? (
            <div className="py-20 text-center max-w-[480px] mx-auto">
              <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ background: "#F5EFE2", color: "#B89778" }}>
                <Heart className="w-7 h-7" strokeWidth={1.5} />
              </div>
              <p className="font-serif-display text-[22px] md:text-[26px] mb-3">Your wishlist is empty</p>
              <p className="text-[14px] mb-8" style={{ color: "#8A8A8A" }}>Tap the heart on any piece to save it here.</p>
              <Link to="/shop" className="btn-gold">Discover the Edit</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-8">
              {items.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Wishlist;
