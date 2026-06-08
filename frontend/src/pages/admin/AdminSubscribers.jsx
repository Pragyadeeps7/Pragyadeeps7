import React, { useEffect, useState } from "react";
import { adminSubscribers } from "../../api/client";
import { Loader2, Mail, Download } from "lucide-react";

const AdminSubscribers = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { adminSubscribers().then(setItems).finally(() => setLoading(false)); }, []);

  const exportCsv = () => {
    const csv = ["email,created_at", ...items.map(i => `${i.email},${i.created_at || ""}`)].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "saukriti-subscribers.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] md:text-[12px] tracking-[0.4em] mb-2" style={{ color: "#B89778" }}>NEWSLETTER</p>
          <h1 className="font-serif-display text-[28px] md:text-[40px]">Subscribers  <span className="text-[18px] font-body align-middle" style={{ color: "#8A8A8A" }}>{items.length}</span></h1>
        </div>
        <button onClick={exportCsv} disabled={!items.length} className="inline-flex items-center gap-2 btn-dark disabled:opacity-60">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </header>
      {loading ? (
        <div className="py-12 flex justify-center"><Loader2 className="w-6 h-6 animate-spin" style={{ color: "#D4A574" }} /></div>
      ) : items.length === 0 ? (
        <p className="text-[14px] py-12 text-center" style={{ color: "#8A8A8A" }}>No subscribers yet.</p>
      ) : (
        <div className="bg-white border" style={{ borderColor: "#EFE7D6" }}>
          <ul className="divide-y" style={{ borderColor: "#EFE7D6" }}>
            {items.map(s => (
              <li key={s.id} className="px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4" style={{ color: "#D4A574" }} />
                  <span className="text-[14px]">{s.email}</span>
                </div>
                <span className="text-[12px]" style={{ color: "#8A8A8A" }}>{s.created_at ? new Date(s.created_at).toLocaleDateString("en-IN") : ""}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdminSubscribers;
