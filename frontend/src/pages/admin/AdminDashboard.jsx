import React, { useEffect, useState } from "react";
import { adminStats } from "../../api/client";
import { formatPrice } from "../../mock";
import { Loader2, ShoppingBag, Package, Users, Star, Mail, TrendingUp } from "lucide-react";

const Card = ({ icon: I, label, value, accent }) => (
  <div className="bg-white border p-5 md:p-6" style={{ borderColor: "#EFE7D6" }}>
    <div className="flex items-center justify-between mb-3">
      <p className="text-[11px] tracking-[0.22em] uppercase" style={{ color: "#8A8A8A" }}>{label}</p>
      <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: accent || "#F5EFE2", color: "#B89778" }}>
        <I className="w-4 h-4" />
      </div>
    </div>
    <p className="font-serif-display text-[28px] md:text-[34px]" style={{ fontWeight: 600 }}>{value}</p>
  </div>
);

const AdminDashboard = () => {
  const [s, setS] = useState(null);

  useEffect(() => { adminStats().then(setS).catch(() => {}); }, []);

  if (!s) return <div className="py-12 flex justify-center"><Loader2 className="w-6 h-6 animate-spin" style={{ color: "#D4A574" }} /></div>;

  return (
    <div>
      <header className="mb-10">
        <p className="text-[11px] md:text-[12px] tracking-[0.4em] mb-2" style={{ color: "#B89778" }}>OVERVIEW</p>
        <h1 className="font-serif-display text-[28px] md:text-[40px]">Dashboard</h1>
      </header>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-10">
        <Card icon={TrendingUp} label="Total Revenue" value={formatPrice(s.revenue || 0)} />
        <Card icon={ShoppingBag} label="Orders" value={s.orders} />
        <Card icon={Package} label="Products" value={s.products} />
        <Card icon={Users} label="Customers" value={s.users} />
        <Card icon={Mail} label="Subscribers" value={s.subscribers} />
        <Card icon={Star} label="Reviews" value={s.reviews} />
      </div>

      <section>
        <h2 className="font-serif-display text-[22px] md:text-[26px] mb-6">Recent orders</h2>
        {s.recent_orders?.length === 0 ? (
          <p className="text-[14px]" style={{ color: "#8A8A8A" }}>No orders yet.</p>
        ) : (
          <div className="bg-white border overflow-hidden" style={{ borderColor: "#EFE7D6" }}>
            <table className="w-full text-[13px]">
              <thead>
                <tr className="text-left" style={{ background: "#F5EFE2" }}>
                  <th className="px-4 py-3 font-medium">Order</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Total</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {s.recent_orders?.map(o => (
                  <tr key={o.order_id} className="border-t" style={{ borderColor: "#EFE7D6" }}>
                    <td className="px-4 py-3 font-mono text-[12px]">{o.order_id?.slice(0, 8)}</td>
                    <td className="px-4 py-3">{o.customer?.name}</td>
                    <td className="px-4 py-3">{formatPrice(o.subtotal)}</td>
                    <td className="px-4 py-3"><span className="text-[10px] tracking-[0.2em] uppercase px-2.5 py-1 bg-[#D4A574] text-white">{o.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;
