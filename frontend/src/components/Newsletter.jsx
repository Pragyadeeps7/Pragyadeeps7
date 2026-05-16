import React, { useState } from "react";
import { useToast } from "../hooks/use-toast";
import { subscribeNewsletter } from "../api/client";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const submit = async (e) => {
    e.preventDefault();
    if (!email.includes("@")) {
      toast({ title: "Please enter a valid email", description: "We need a valid email to send you updates." });
      return;
    }
    setLoading(true);
    try {
      await subscribeNewsletter(email);
      toast({ title: "Welcome to the Saukriti circle", description: "Use code WELCOME10 for 10% off your first order." });
      setEmail("");
    } catch (err) {
      toast({ title: "Subscription failed", description: "Please try again in a moment." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 md:py-24" style={{ background: "#FAFAF7" }}>
      <div className="max-w-[760px] mx-auto px-6 text-center">
        <p className="text-[11px] md:text-[12px] tracking-[0.4em] mb-3" style={{ color: "#B89778" }}>JOIN THE CIRCLE</p>
        <h2 className="font-serif-display text-[28px] md:text-[44px] leading-tight mb-5">A letter from our atelier</h2>
        <p className="text-[14px] md:text-[15px] font-body mb-10" style={{ color: "#5C5C5C" }}>
          Be the first to know about new collections, artisan stories and private sales. As a thank you, enjoy 10% off your first order.
        </p>
        <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3 max-w-[520px] mx-auto">
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className="flex-1 px-5 py-4 bg-white border text-[14px] font-body"
            style={{ borderColor: "#E8E2D5", color: "#1A1A1A" }} />
          <button type="submit" disabled={loading} className="btn-gold disabled:opacity-60">
            {loading ? "Subscribing..." : "Subscribe"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;
