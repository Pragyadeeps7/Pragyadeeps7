import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TopBar from "../components/TopBar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { placeOrder } from "../api/client";
import { formatPrice } from "../mock";
import { Loader2, ChevronRight, ShieldCheck, Truck } from "lucide-react";
import { useToast } from "../hooks/use-toast";

const Checkout = () => {
  const { cart, subtotal, clearCart } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: "", email: "", phone: "", address: "", city: "", pincode: "", state: "", notes: "",
  });

  const shipping = subtotal >= 2000 ? 0 : 99;
  const total = subtotal + shipping;

  const update = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      toast({ title: "Your bag is empty", description: "Add a few pieces before checking out." });
      return;
    }
    if (!form.name || !form.email || !form.phone || !form.address) {
      toast({ title: "Missing details", description: "Please fill in all required fields." });
      return;
    }
    setSubmitting(true);
    try {
      const fullAddress = `${form.address}, ${form.city}, ${form.state} - ${form.pincode}`;
      const res = await placeOrder({
        customer: { name: form.name, email: form.email, phone: form.phone, address: fullAddress },
        items: cart.map(i => ({ id: i.id, qty: i.qty })),
        subtotal: total,
      });
      clearCart();
      navigate(`/order-confirmed/${res.order_id}`);
    } catch (err) {
      toast({ title: "Order could not be placed", description: "Please check your details and try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <TopBar />
      <Header />
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-6">
        <nav className="flex items-center gap-2 text-[11px] md:text-[12px] tracking-[0.18em]" style={{ color: "#8A8A8A" }}>
          <Link to="/" className="hover:text-[#B89778]">HOME</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/shop" className="hover:text-[#B89778]">SHOP</Link>
          <ChevronRight className="w-3 h-3" />
          <span style={{ color: "#1A1A1A" }}>CHECKOUT</span>
        </nav>
      </div>

      <section className="max-w-[1440px] mx-auto px-6 lg:px-10 py-8 lg:py-12">
        <div className="text-center mb-12">
          <p className="text-[11px] md:text-[12px] tracking-[0.4em] mb-3" style={{ color: "#B89778" }}>SECURE CHECKOUT</p>
          <h1 className="font-serif-display text-[32px] md:text-[48px] leading-tight">Your Order</h1>
          <div className="gold-line" />
        </div>

        <div className="grid lg:grid-cols-[1fr_440px] gap-10 lg:gap-16">
          <form onSubmit={submit} className="space-y-8">
            <div>
              <h3 className="font-serif-display text-[20px] md:text-[24px] mb-5">Contact</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <input required value={form.name} onChange={update("name")} placeholder="Full Name *" className="px-4 py-3.5 bg-white border text-[14px] font-body" style={{ borderColor: "#E8E2D5" }} />
                <input required type="email" value={form.email} onChange={update("email")} placeholder="Email *" className="px-4 py-3.5 bg-white border text-[14px] font-body" style={{ borderColor: "#E8E2D5" }} />
                <input required value={form.phone} onChange={update("phone")} placeholder="Phone *" className="px-4 py-3.5 bg-white border text-[14px] font-body sm:col-span-2" style={{ borderColor: "#E8E2D5" }} />
              </div>
            </div>
            <div>
              <h3 className="font-serif-display text-[20px] md:text-[24px] mb-5">Shipping Address</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <input required value={form.address} onChange={update("address")} placeholder="Street Address *" className="px-4 py-3.5 bg-white border text-[14px] font-body sm:col-span-2" style={{ borderColor: "#E8E2D5" }} />
                <input value={form.city} onChange={update("city")} placeholder="City" className="px-4 py-3.5 bg-white border text-[14px] font-body" style={{ borderColor: "#E8E2D5" }} />
                <input value={form.state} onChange={update("state")} placeholder="State" className="px-4 py-3.5 bg-white border text-[14px] font-body" style={{ borderColor: "#E8E2D5" }} />
                <input value={form.pincode} onChange={update("pincode")} placeholder="Pincode" className="px-4 py-3.5 bg-white border text-[14px] font-body sm:col-span-2" style={{ borderColor: "#E8E2D5" }} />
                <textarea value={form.notes} onChange={update("notes")} placeholder="Order notes (optional)" rows="3" className="px-4 py-3.5 bg-white border text-[14px] font-body sm:col-span-2" style={{ borderColor: "#E8E2D5" }} />
              </div>
            </div>
            <div>
              <h3 className="font-serif-display text-[20px] md:text-[24px] mb-5">Payment</h3>
              <div className="p-5 border bg-white" style={{ borderColor: "#E8E2D5" }}>
                <div className="flex items-start gap-3">
                  <input type="radio" checked readOnly className="mt-1.5 accent-[#D4A574]" />
                  <div>
                    <p className="text-[14px] font-medium">Cash on Delivery</p>
                    <p className="text-[12px] mt-1" style={{ color: "#8A8A8A" }}>Pay in cash when your parcel arrives.</p>
                  </div>
                </div>
              </div>
            </div>
            <button type="submit" disabled={submitting || cart.length === 0} className="btn-dark w-full flex items-center justify-center gap-2 disabled:opacity-60">
              {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Placing Order...</> : `Place Order  ${formatPrice(total)}`}
            </button>
            <div className="flex flex-wrap items-center gap-5 text-[12px]" style={{ color: "#8A8A8A" }}>
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-4 h-4" style={{ color: "#D4A574" }} /> Secure checkout</span>
              <span className="inline-flex items-center gap-1.5"><Truck className="w-4 h-4" style={{ color: "#D4A574" }} /> Free over 2,000</span>
            </div>
          </form>

          <aside className="lg:sticky lg:top-32 self-start bg-white border p-6 md:p-8" style={{ borderColor: "#EFE7D6" }}>
            <h3 className="font-serif-display text-[20px] md:text-[24px] mb-5">Order Summary</h3>
            {cart.length === 0 ? (
              <p className="text-[14px]" style={{ color: "#8A8A8A" }}>Your bag is empty. <Link to="/shop" className="underline" style={{ color: "#B89778" }}>Continue shopping</Link>.</p>
            ) : (
              <>
                <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
                  {cart.map(i => (
                    <div key={i.id} className="flex gap-3 items-start">
                      <div className="relative">
                        <img src={i.image} alt={i.name} className="w-16 h-20 object-cover" />
                        <span className="absolute -top-2 -right-2 w-5 h-5 text-[10px] rounded-full bg-[#1A1A1A] text-white flex items-center justify-center">{i.qty}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-serif-display text-[14px] leading-snug">{i.name}</p>
                        <p className="text-[12px] mt-1" style={{ color: "#8A8A8A" }}>{formatPrice(i.price)}  {i.qty}</p>
                      </div>
                      <p className="text-[13px]">{formatPrice(i.price * i.qty)}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-2 pt-4 border-t" style={{ borderColor: "#EFE7D6" }}>
                  <div className="flex justify-between text-[14px]"><span style={{ color: "#5C5C5C" }}>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                  <div className="flex justify-between text-[14px]"><span style={{ color: "#5C5C5C" }}>Shipping</span><span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span></div>
                  <div className="flex justify-between pt-3 border-t mt-3" style={{ borderColor: "#EFE7D6" }}>
                    <span className="font-serif-display text-[16px]">Total</span>
                    <span className="font-serif-display text-[20px]" style={{ fontWeight: 600 }}>{formatPrice(total)}</span>
                  </div>
                </div>
              </>
            )}
          </aside>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Checkout;
