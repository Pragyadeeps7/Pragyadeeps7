import React, { useEffect, useState } from "react";
import TopBar from "../components/TopBar";
import Header from "../components/Header";
import HeroSlider from "../components/HeroSlider";
import CategoryGrid from "../components/CategoryGrid";
import ProductGrid from "../components/ProductGrid";
import PromoBanner from "../components/PromoBanner";
import Testimonials from "../components/Testimonials";
import WhyChooseUs from "../components/WhyChooseUs";
import InstagramFeed from "../components/InstagramFeed";
import Newsletter from "../components/Newsletter";
import Footer from "../components/Footer";
import { getProducts } from "../api/client";

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const [f, n, b] = await Promise.all([
          getProducts({ sort: "featured", limit: 8 }),
          getProducts({ tag: "new", limit: 8 }),
          getProducts({ tag: "bestseller", limit: 8 }),
        ]);
        setFeatured(f.items || []);
        setNewArrivals(n.items || []);
        setBestSellers(b.items || []);
      } catch (e) { /* silent */ }
    })();
  }, []);

  return (
    <div>
      <TopBar />
      <Header />
      <main>
        <HeroSlider />
        <WhyChooseUs />
        <CategoryGrid />
        <ProductGrid title="Featured Products" eyebrow="HANDPICKED FOR YOU"
          products={featured} viewAllPath="/shop" />
        <PromoBanner index={0} />
        <ProductGrid title="New Arrivals" eyebrow="FRESH ON THE NEST"
          products={newArrivals} viewAllPath="/shop?tag=new" />
        <PromoBanner index={1} reverse />
        <ProductGrid title="Best Sellers" eyebrow="PATRON FAVOURITES"
          products={bestSellers} viewAllPath="/shop?tag=bestseller" />
        <Testimonials />
        <InstagramFeed />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
