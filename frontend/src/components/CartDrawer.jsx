import React from "react";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../mock";
import { Link } from "react-router-dom";

const CartDrawer = () => {
  const { cart, cartOpen, setCartOpen, removeFromCart, updateQty, subtotal } = useCart();
  if (!cartOpen) return null;

  return (
    <div className="fixed inset-0 z-50" onClick={() => setCartOpen(false)}>
      <div className="absolute inset-0 bg-black/50" />
      <aside
        onClick={(e) => e.stopPropagation()}
        className="absolute right-0 top-0 bottom-0 w-full sm:w-[440px] bg-[#FAFAF7] flex flex-col scale-in"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: "#EFE7D6" }}>
          <h3 className="font-serif-display text-[22px] flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" /> Your Bag ({cart.length})
          </h3>
          <button onClick={() => setCartOpen(false)} aria-label="Close"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5" style={{ background: "#F5EFE2", color: "#B89778" }}>
                <ShoppingBag className="w-7 h-7" strokeWidth={1.5} />
              </div>
              <p className="font-serif-display text-[20px] mb-2">Your bag is empty</p>
              <p className="text-[13px] mb-6" style={{ color: "#8A8A8A" }}>Discover our curated edit and add a little luxury.</p>
              <button onClick={() => setCartOpen(false)} className="btn-dark">Continue Shopping</button>
            </div>
          ) : (
            <div className="space-y-5">
              {cart.map(item => (
                <div key={item.id} className="flex gap-4">
                  <img src={item.image} alt={item.name} className="w-24 h-28 object-cover" />
                  <div className="flex-1 flex flex-col">
                    <h4 className="font-serif-display text-[15px] mb-1 leading-snug">{item.name}</h4>
                    <p className="text-[14px] mb-3" style={{ color: "#1A1A1A" }}>{formatPrice(item.price)}</p>
                    <div className="flex items-center gap-2 mt-auto">
                      <div className="inline-flex items-center border" style={{ borderColor: "#E8E2D5" }}>
                        <button className="w-8 h-8 flex items-center justify-center hover:bg-[#F5EFE2]"
                          onClick={() => updateQty(item.id, item.qty - 1)} aria-label="Decrease"><Minus className="w-3 h-3" /></button>
                        <span className="w-8 text-center text-[13px]">{item.qty}</span>
                        <button className="w-8 h-8 flex items-center justify-center hover:bg-[#F5EFE2]"
                          onClick={() => updateQty(item.id, item.qty + 1)} aria-label="Increase"><Plus className="w-3 h-3" /></button>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-[12px] underline ml-auto" style={{ color: "#8A8A8A" }}>Remove</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="px-6 py-5 border-t bg-white" style={{ borderColor: "#EFE7D6" }}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[14px] font-body" style={{ color: "#5C5C5C" }}>Subtotal</span>
              <span className="font-serif-display text-[20px]" style={{ fontWeight: 600 }}>{formatPrice(subtotal)}</span>
            </div>
            <p className="text-[12px] mb-5" style={{ color: "#8A8A8A" }}>Shipping calculated at checkout.</p>
            <Link to="/checkout" onClick={() => setCartOpen(false)} className="btn-dark w-full text-center block">
              Proceed to Checkout
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
};

export default CartDrawer;
