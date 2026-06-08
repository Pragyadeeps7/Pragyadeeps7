import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import TopBar from "../components/TopBar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { myOrders } from "../api/client";
import { formatPrice } from "../mock";
import { Loader2, Package, LogOut, Shield } from "lucide-react";

const statusColors = {
  received: "#D4A574",
  packed: "#8B5A3C",
  shipped: "#5B7553",
  delivered: "#2D5F2D",
  cancelled: "#A33A3A",
};

const Account = () => {
  const { user, loading, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!user) { setLoadingOrders(false); return; }
    myOrders().then(setOrders).catch(() => setOrders([])).finally(() => setLoadingOrders(false));
  }, [user]);

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div>
      <TopBar /><Header />
      <section className="py-10 md:py-14" style={{ background: "#F5EFE2" }}>
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-5">
            {user.picture ? (
              <img src={user.picture} alt={user.name} className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover ring-2 ring-[#D4A574] ring-offset-2 ring-offset-[#F5EFE2]" />
            ) : (
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-white text-2xl font-serif-display" style={{ background: "#D4A574" }}>{user.name?.[0]}</div>
            )}
            <div>
              <p className="text-[11px] md:text-[12px] tracking-[0.3em]" style={{ color: "#B89778" }}>WELCOME</p>
              <h1 className="font-serif-display text-[26px] md:text-[36px]">{user.name}</h1>
              <p className="text-[13px] font-body" style={{ color: "#5C5C5C" }}>{user.email}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {user.is_admin && (
              <Link to="/admin" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1A1A1A] text-white text-[12px] tracking-[0.18em] uppercase">
                <Shield className="w-4 h-4" /> Admin Panel
              </Link>
            )}
            <button onClick={logout} className="inline-flex items-center gap-2 px-5 py-2.5 border text-[12px] tracking-[0.18em] uppercase hover:bg-white" style={{ borderColor: "#1A1A1A" }}>
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
          <h2 className="font-serif-display text-[24px] md:text-[32px] mb-8">Your Orders</h2>
          {loadingOrders ? (
            <div className="py-12 flex justify-center"><Loader2 className="w-6 h-6 animate-spin" style={{ color: "#D4A574" }} /></div>
          ) : orders.length === 0 ? (
            <div className="py-16 text-center max-w-[480px] mx-auto">
              <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ background: "#F5EFE2", color: "#B89778" }}>
                <Package className="w-7 h-7" strokeWidth={1.5} />
              </div>
              <p className="font-serif-display text-[22px] mb-3">No orders yet</p>
              <p className="text-[14px] mb-7" style={{ color: "#8A8A8A" }}>When you place an order it will appear here.</p>
              <Link to="/shop" className="btn-gold">Start Shopping</Link>
            </div>
          ) : (
            <div className="space-y-5">
              {orders.map(o => (
                <div key={o.order_id} className="bg-white border p-5 md:p-7" style={{ borderColor: "#EFE7D6" }}>
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
                    <div>
                      <p className="text-[11px] tracking-[0.18em] uppercase" style={{ color: "#8A8A8A" }}>Order  {o.order_id?.slice(0, 8)}</p>
                      <p className="text-[12px] mt-1" style={{ color: "#8A8A8A" }}>{o.created_at ? new Date(o.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : ""}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] tracking-[0.2em] uppercase px-3 py-1 text-white" style={{ background: statusColors[o.status] || "#D4A574" }}>
                        {o.status}
                      </span>
                      <span className="font-serif-display text-[18px]" style={{ fontWeight: 600 }}>{formatPrice(o.subtotal)}</span>
                    </div>
                  </div>
                  <div className="text-[13px] grid sm:grid-cols-2 gap-3" style={{ color: "#5C5C5C" }}>
                    <div><span style={{ color: "#8A8A8A" }}>Items:</span> {o.items?.reduce((a, b) => a + b.qty, 0)}</div>
                    <div className="truncate"><span style={{ color: "#8A8A8A" }}>Ship to:</span> {o.customer?.address?.slice(0, 60)}...</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Account;
