import React from "react";
import { Link, useParams } from "react-router-dom";
import TopBar from "../components/TopBar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Check, Mail, Package, Truck } from "lucide-react";

const OrderConfirmation = () => {
  const { id } = useParams();
  return (
    <div>
      <TopBar />
      <Header />
      <section className="py-20 lg:py-28" style={{ background: "#FAFAF7" }}>
        <div className="max-w-[640px] mx-auto px-6 text-center">
          <div className="w-20 h-20 rounded-full mx-auto mb-8 flex items-center justify-center" style={{ background: "#D4A574" }}>
            <Check className="w-10 h-10 text-white" strokeWidth={2} />
          </div>
          <p className="text-[11px] md:text-[12px] tracking-[0.4em] mb-3" style={{ color: "#B89778" }}>ORDER RECEIVED</p>
          <h1 className="font-serif-display text-[32px] md:text-[44px] leading-tight mb-5">Thank you for your order</h1>
          <p className="text-[14px] md:text-[16px] font-body leading-relaxed mb-2" style={{ color: "#5C5C5C" }}>
            We&rsquo;re so glad you found something you love. A confirmation has been sent to your email and our atelier will reach out shortly to confirm delivery details.
          </p>
          <p className="text-[12px] tracking-[0.18em] uppercase mb-12" style={{ color: "#8A8A8A" }}>Order ID  {id?.slice(0, 8)}</p>

          <div className="grid sm:grid-cols-3 gap-5 text-left mb-12">
            {[
              { i: Mail, t: "Confirmation sent", d: "Check your inbox for order details." },
              { i: Package, t: "Carefully packed", d: "Each piece is wrapped by hand." },
              { i: Truck, t: "On its way", d: "Dispatched in 1-3 working days." },
            ].map(({ i: I, t, d }) => (
              <div key={t} className="bg-white p-5 border" style={{ borderColor: "#EFE7D6" }}>
                <I className="w-5 h-5 mb-3" style={{ color: "#D4A574" }} />
                <h4 className="font-serif-display text-[16px] mb-1">{t}</h4>
                <p className="text-[13px] font-body" style={{ color: "#5C5C5C" }}>{d}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/shop" className="btn-gold">Continue Shopping</Link>
            <Link to="/" className="btn-dark">Back to Home</Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default OrderConfirmation;
