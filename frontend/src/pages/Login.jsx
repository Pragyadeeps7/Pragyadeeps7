import React from "react";
import { Link } from "react-router-dom";
import TopBar from "../components/TopBar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth, startLogin } from "../context/AuthContext";
import { Sparkles, Heart, Package, ShieldCheck } from "lucide-react";
import { Navigate } from "react-router-dom";

const Login = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/account" replace />;

  return (
    <div>
      <TopBar /><Header />
      <section className="py-16 md:py-24" style={{ background: "#FAFAF7" }}>
        <div className="max-w-[980px] mx-auto px-6 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="order-2 lg:order-1">
            <p className="text-[11px] md:text-[12px] tracking-[0.4em] mb-3" style={{ color: "#B89778" }}>WELCOME BACK</p>
            <h1 className="font-serif-display text-[32px] md:text-[48px] leading-tight mb-5">Sign in to your Saukriti account</h1>
            <p className="text-[14px] md:text-[15px] font-body mb-9" style={{ color: "#5C5C5C" }}>
              Sign in to view your orders, save favourites, write reviews and enjoy a more personal shopping experience.
            </p>
            <button onClick={startLogin}
              className="flex items-center gap-3 w-full sm:w-auto px-6 py-3.5 bg-white border-2 hover:border-[#D4A574] transition-colors"
              style={{ borderColor: "#E8E2D5" }}>
              <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              <span className="text-[14px] font-medium tracking-[0.05em]">Continue with Google</span>
            </button>
            <p className="text-[12px] mt-6" style={{ color: "#8A8A8A" }}>
              By continuing you agree to our <Link to="/" className="underline">Terms</Link> and <Link to="/" className="underline">Privacy Policy</Link>.
            </p>
          </div>
          <div className="order-1 lg:order-2 bg-white border p-8 md:p-10" style={{ borderColor: "#EFE7D6" }}>
            <h3 className="font-serif-display text-[22px] mb-6">Why sign in</h3>
            <ul className="space-y-5">
              {[
                { i: Package, t: "Track your orders", d: "See order status and history at a glance." },
                { i: Heart, t: "Save your favourites", d: "Your wishlist follows you across devices." },
                { i: Sparkles, t: "Write reviews", d: "Share your thoughts on the pieces you love." },
                { i: ShieldCheck, t: "Faster checkout", d: "Your details are remembered for next time." },
              ].map(({ i: I, t, d }) => (
                <li key={t} className="flex gap-4">
                  <div className="w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center" style={{ background: "#F5EFE2", color: "#B89778" }}>
                    <I className="w-5 h-5" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="font-serif-display text-[16px] mb-0.5" style={{ fontWeight: 500 }}>{t}</p>
                    <p className="text-[13px] font-body" style={{ color: "#5C5C5C" }}>{d}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Login;
