import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Wishlist from "./pages/Wishlist";
import CartDrawer from "./components/CartDrawer";
import SearchDialog from "./components/SearchDialog";
import QuickViewModal from "./components/QuickViewModal";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <div className="App">
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-confirmed/:id" element={<OrderConfirmation />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="*" element={<Home />} />
          </Routes>
          <CartDrawer />
          <SearchDialog />
          <QuickViewModal />
          <Toaster />
        </BrowserRouter>
      </CartProvider>
    </div>
  );
}

export default App;
