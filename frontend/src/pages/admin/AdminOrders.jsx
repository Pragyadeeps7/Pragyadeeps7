import React, { useEffect, useState } from "react";
import { adminOrders, adminUpdateOrder } from "../../api/client";
import { formatPrice } from "../../mock";
import { Loader2 } from "lucide-react";
import { useToast } from "../../hooks/use-toast";

const STATUSES = ["received", "packed", "shipped", "delivered", "cancelled"];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const { toast } = useToast();

  const load = () => {
    setLoading(true);
    adminOrders(filter ? { status: filter } : {}).then(setOrders).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filter]);

  const updateStatus = async (oid, status) => {
    try {
      await adminUpdateOrder(oid, status);
      setOrders(prev => prev.map(o => o.order_id === oid ? { ...o, status } : o));
      toast({ title: "Order updated", description: `Status set to ${status}.` });
    } catch {
      toast({ title: "Update failed" });
    }
  };

  return (
    <div>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] md:text-[12px] tracking-[0.4em] mb-2" style={{ color: "#B89778" }}>MANAGE</p>
          <h1 className="font-serif-display text-[28px] md:text-[40px]">Orders</h1>
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="px-4 py-2.5 bg-white border text-[13px]" style={{ borderColor: "#E8E2D5" }}>
          <option value="">All statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </header>

      {loading ? (
        <div className="py-12 flex justify-center"><Loader2 className="w-6 h-6 animate-spin" style={{ color: "#D4A574" }} /></div>
      ) : orders.length === 0 ? (
        <p className="text-[14px] py-12 text-center" style={{ color: "#8A8A8A" }}>No orders found.</p>
      ) : (
        <div className="bg-white border overflow-x-auto" style={{ borderColor: "#EFE7D6" }}>
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-left" style={{ background: "#F5EFE2" }}>
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Items</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.order_id} className="border-t" style={{ borderColor: "#EFE7D6" }}>
                  <td className="px-4 py-3 font-mono text-[12px]">{o.order_id?.slice(0, 8)}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{o.created_at ? new Date(o.created_at).toLocaleDateString("en-IN") : ""}</td>
                  <td className="px-4 py-3">
                    <div>{o.customer?.name}</div>
                    <div className="text-[11px]" style={{ color: "#8A8A8A" }}>{o.customer?.email}</div>
                  </td>
                  <td className="px-4 py-3">{o.items?.reduce((a, b) => a + b.qty, 0)}</td>
                  <td className="px-4 py-3">{formatPrice(o.subtotal)}</td>
                  <td className="px-4 py-3">
                    <select value={o.status} onChange={(e) => updateStatus(o.order_id, e.target.value)}
                      className="px-2.5 py-1.5 border text-[12px] bg-white" style={{ borderColor: "#E8E2D5" }}>
                      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
