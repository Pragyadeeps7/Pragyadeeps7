import React, { useEffect, useState } from "react";
import { adminReviews, adminDeleteReview } from "../../api/client";
import { Loader2, Star, Trash2 } from "lucide-react";
import { useToast } from "../../hooks/use-toast";

const AdminReviews = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const load = () => { setLoading(true); adminReviews().then(setItems).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    if (!window.confirm("Delete this review?")) return;
    try { await adminDeleteReview(id); setItems(prev => prev.filter(r => r.id !== id)); toast({ title: "Review deleted" }); }
    catch { toast({ title: "Delete failed" }); }
  };

  return (
    <div>
      <header className="mb-8">
        <p className="text-[11px] md:text-[12px] tracking-[0.4em] mb-2" style={{ color: "#B89778" }}>MODERATE</p>
        <h1 className="font-serif-display text-[28px] md:text-[40px]">Reviews</h1>
      </header>
      {loading ? (
        <div className="py-12 flex justify-center"><Loader2 className="w-6 h-6 animate-spin" style={{ color: "#D4A574" }} /></div>
      ) : items.length === 0 ? (
        <p className="text-[14px] py-12 text-center" style={{ color: "#8A8A8A" }}>No reviews yet.</p>
      ) : (
        <div className="space-y-4">
          {items.map(r => (
            <div key={r.id} className="bg-white border p-5 md:p-6" style={{ borderColor: "#EFE7D6" }}>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <p className="font-serif-display text-[17px]">{r.user_name}  <span className="text-[12px]" style={{ color: "#8A8A8A" }}>on {r.product_name}</span></p>
                  <div className="flex items-center gap-1 mt-1 text-[#D4A574]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? "fill-current" : ""}`} strokeWidth={1.5} />
                    ))}
                  </div>
                </div>
                <button onClick={() => remove(r.id)} className="p-2 hover:text-red-600" aria-label="Delete"><Trash2 className="w-4 h-4" /></button>
              </div>
              {r.title && <p className="font-serif-display text-[16px] mb-1">{r.title}</p>}
              <p className="text-[14px] leading-relaxed" style={{ color: "#5C5C5C" }}>{r.body}</p>
              <p className="text-[11px] mt-3" style={{ color: "#8A8A8A" }}>{r.created_at ? new Date(r.created_at).toLocaleString("en-IN") : ""}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReviews;
