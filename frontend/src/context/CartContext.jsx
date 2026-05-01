import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

const CartContext = createContext(null);

const LS_CART = "saukriti_cart_v1";
const LS_WISH = "saukriti_wish_v1";

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [quickView, setQuickView] = useState(null); // product object

  useEffect(() => {
    try {
      const c = JSON.parse(localStorage.getItem(LS_CART) || "[]");
      const w = JSON.parse(localStorage.getItem(LS_WISH) || "[]");
      setCart(c);
      setWishlist(w);
    } catch {}
  }, []);

  useEffect(() => { localStorage.setItem(LS_CART, JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem(LS_WISH, JSON.stringify(wishlist)); }, [wishlist]);

  const addToCart = useCallback((product, qty = 1) => {
    setCart(prev => {
      const exists = prev.find(i => i.id === product.id);
      if (exists) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + qty } : i);
      return [...prev, { id: product.id, name: product.name, price: product.price, image: product.image, qty }];
    });
    setCartOpen(true);
  }, []);

  const removeFromCart = useCallback((id) => setCart(prev => prev.filter(i => i.id !== id)), []);
  const updateQty = useCallback((id, qty) => setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(1, qty) } : i)), []);
  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback((id) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }, []);

  const cartCount = cart.reduce((a, b) => a + b.qty, 0);
  const subtotal = cart.reduce((a, b) => a + b.qty * b.price, 0);

  return (
    <CartContext.Provider value={{
      cart, addToCart, removeFromCart, updateQty, clearCart, cartCount, subtotal,
      wishlist, toggleWishlist,
      cartOpen, setCartOpen,
      searchOpen, setSearchOpen,
      quickView, setQuickView,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
