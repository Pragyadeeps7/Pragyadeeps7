import React from "react";
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
import { FEATURED_PRODUCTS, NEW_ARRIVALS, BEST_SELLERS } from "../mock";

const Home = () => (
  <div>
    <TopBar />
    <Header />
    <main>
      <HeroSlider />
      <WhyChooseUs />
      <CategoryGrid />
      <ProductGrid title="Featured Products" eyebrow="HANDPICKED FOR YOU"
        products={FEATURED_PRODUCTS} viewAllPath="/shop" />
      <PromoBanner index={0} />
      <ProductGrid title="New Arrivals" eyebrow="FRESH ON THE NEST"
        products={NEW_ARRIVALS} viewAllPath="/shop?tag=new" />
      <PromoBanner index={1} reverse />
      <ProductGrid title="Best Sellers" eyebrow="PATRON FAVOURITES"
        products={BEST_SELLERS.slice(0, 8)} viewAllPath="/shop?tag=bestseller" />
      <Testimonials />
      <InstagramFeed />
      <Newsletter />
    </main>
    <Footer />
  </div>
);

export default Home;
