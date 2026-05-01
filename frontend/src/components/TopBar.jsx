import React from "react";
import { TOP_BAR_MESSAGES } from "../mock";

const TopBar = () => {
  const items = [...TOP_BAR_MESSAGES, ...TOP_BAR_MESSAGES];
  return (
    <div className="w-full overflow-hidden" style={{ background: "#1A1A1A", color: "#F5EFE2" }}>
      <div className="flex marquee-track whitespace-nowrap py-2" style={{ width: "max-content" }}>
        {items.map((m, i) => (
          <span key={i} className="px-8 text-[11px] tracking-[0.18em] font-body" style={{ color: "#E8D9B8" }}>
             &nbsp;&nbsp;{m}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TopBar;
