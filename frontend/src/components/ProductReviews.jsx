import React, { useEffect, useState } from "react";
import { Star, MessageSquare } from "lucide-react";
import { getProductReviews, postReview } from "../api/client";
import { useAuth, startLogin } from "../context/AuthContext";
import { useToast } from "../hooks/use-toast";

const ProductReviews = ({ productId }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ rating: 5, title: "", body: "" });
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    getProductReviews(productId).then(setItems).finally(() => setLoading(false));
  };
  useEffect(() => { if (productId) load(); }, [productId]);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.body || form.body.length < 5) {
      toast({ title: "Please write a few words about your experience" });
      return;
    }
    setSubmitting(true);
    try {
      await postReview({ product_id: productId, rating: form.rating, title: form.title, body: form.body });
      toast({ title: "Review posted", description: "Thank you for sharing your thoughts." });
      setForm({ rating: 5, title: "", body: "" });
      setOpen(false);
      load();
    } catch (err) {
      toast({ title: "Couldn't post review", description: err?.response?.data?.detail || "Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-4">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h3 className="font-serif-display text-[20px] md:text-[24px]">Customer Reviews <span className="text-[14px] font-body" style={{ color: "#8A8A8A" }}>({items.length})</span></h3>
        {user ? (
          <button onClick={() => setOpen(o => !o)} className="text-[12px] tracking-[0.18em] uppercase pb-1 border-b border-[#1A1A1A] hover:text-[#B89778] hover:border-[#B89778]">
            {open ? "Cancel" : "Write a review"}
          </button>
        ) : (
          <button onClick={startLogin} className="text-[12px] tracking-[0.18em] uppercase pb-1 border-b border-[#1A1A1A] hover:text-[#B89778]">Sign in to review</button>
        )}
      </div>

      {open && user && (
        <form onSubmit={submit} className="bg-white border p-5 md:p-6 mb-6" style={{ borderColor: "#EFE7D6" }}>
          <p className="text-[12px] tracking-[0.2em] mb-3">YOUR RATING</p>
          <div className="flex gap-1 mb-4">
            {[1,2,3,4,5].map(r => (
              <button type="button" key={r} onClick={() => setForm({...form, rating: r})} className="text-[#D4A574]">
                <Star className={`w-6 h-6 ${r <= form.rating ? "fill-current" : ""}`} strokeWidth={1.5} />
              </button>
            ))}
          </div>
          <input type="text" placeholder="Title (optional)" value={form.title} onChange={e => setForm({...form, title: e.target.value})}
            className="w-full px-4 py-2.5 border text-[14px] mb-3" style={{ borderColor: "#E8E2D5" }} />
          <textarea rows="4" required placeholder="Share your thoughts on the craftsmanship, quality, and feel." value={form.body} onChange={e => setForm({...form, body: e.target.value})}
            className="w-full px-4 py-2.5 border text-[14px] mb-4" style={{ borderColor: "#E8E2D5" }} />
          <button type="submit" disabled={submitting} className="btn-dark disabled:opacity-60">{submitting ? "Posting..." : "Post Review"}</button>
        </form>
      )}

      {loading ? (
        <p className="text-[13px]" style={{ color: "#8A8A8A" }}>Loading reviews...</p>
      ) : items.length === 0 ? (
        <div className="text-center py-10">
          <MessageSquare className="w-8 h-8 mx-auto mb-3" style={{ color: "#D4A574" }} strokeWidth={1.5} />
          <p className="text-[14px]" style={{ color: "#8A8A8A" }}>No reviews yet. Be the first to share your thoughts.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {items.map(r => (
            <div key={r.id} className="py-4 border-b" style={{ borderColor: "#EFE7D6" }}>
              <div className="flex items-center gap-3 mb-2">
                {r.user_picture ? (
                  <img src={r.user_picture} alt={r.user_name} className="w-9 h-9 rounded-full object-cover" />
                ) : (
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[12px]" style={{ background: "#D4A574" }}>{r.user_name?.[0]}</div>
                )}
                <div>
                  <p className="text-[14px] font-medium">{r.user_name}</p>
                  <div className="flex items-center gap-1 text-[#D4A574]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < r.rating ? "fill-current" : ""}`} strokeWidth={1.5} />
                    ))}
                  </div>
                </div>
                <span className="text-[11px] ml-auto" style={{ color: "#8A8A8A" }}>
                  {r.created_at ? new Date(r.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : ""}
                </span>
              </div>
              {r.title && <p className="font-serif-display text-[16px] mb-1">{r.title}</p>}
              <p className="text-[14px] leading-relaxed" style={{ color: "#5C5C5C" }}>{r.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductReviews;
