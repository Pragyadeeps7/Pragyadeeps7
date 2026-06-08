import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, User, Heart, ShoppingBag, Menu, X, LogIn, Shield, Package, LogOut } from "lucide-react";
import { NAV_LINKS, NAV_RIGHT, SUBNAV } from "../mock";
import { useCart } from "../context/CartContext";
import { useAuth, startLogin } from "../context/AuthContext";

const Header = () => {
  const { cartCount, setCartOpen, setSearchOpen, wishlist } = useCart();
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-shadow ${scrolled ? "shadow-luxe" : ""}`}
      style={{ background: "#FAFAF7", borderBottom: "1px solid #EFE7D6" }}
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center gap-6 lg:gap-8 flex-1">
            <button className="lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Menu">
              <Menu className="w-6 h-6" />
            </button>
            <nav className="hidden lg:flex items-center gap-7">
              {NAV_LINKS.map(l => (
                <Link key={l.label} to={l.path}
                  className="text-[13px] tracking-[0.14em] uppercase font-body font-medium hover:text-[#B89778] transition-colors"
                  style={{ color: "#1A1A1A" }}>
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          <Link to="/" className="flex-shrink-0 mx-2 md:mx-4">
            <h1 className="font-serif-display text-[20px] md:text-[28px] lg:text-[30px] tracking-[0.24em] md:tracking-[0.32em] font-medium" style={{ color: "#1A1A1A" }}>
              SAUKRITI
            </h1>
          </Link>

          <div className="flex items-center gap-3 md:gap-6 flex-1 justify-end">
            <nav className="hidden lg:flex items-center gap-7">
              {NAV_RIGHT.map(l => (
                <Link key={l.label} to={l.path}
                  className="text-[13px] tracking-[0.14em] uppercase font-body font-medium hover:text-[#B89778] transition-colors"
                  style={{ color: "#1A1A1A" }}>
                  {l.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-4">
              <button onClick={() => setSearchOpen(true)} aria-label="Search" className="hover:text-[#B89778] transition-colors">
                <Search className="w-[18px] h-[18px]" />
              </button>
              <div className="relative hidden sm:block">
                <button onClick={() => user ? setAccountOpen(o => !o) : startLogin()}
                  aria-label="Account" className="hover:text-[#B89778] transition-colors flex items-center">
                  {user?.picture ? (
                    <img src={user.picture} alt="" className="w-7 h-7 rounded-full object-cover ring-1 ring-[#D4A574]" />
                  ) : user ? (
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px]" style={{ background: "#D4A574" }}>{user.name?.[0]?.toUpperCase()}</div>
                  ) : (
                    <User className="w-[18px] h-[18px]" />
                  )}
                </button>
                {user && accountOpen && (
                  <div className="absolute right-0 top-12 z-50 w-56 bg-white shadow-luxe border" style={{ borderColor: "#EFE7D6" }}
                    onMouseLeave={() => setAccountOpen(false)}>
                    <div className="px-4 py-3 border-b" style={{ borderColor: "#EFE7D6" }}>
                      <p className="text-[13px] font-medium truncate">{user.name}</p>
                      <p className="text-[11px] truncate" style={{ color: "#8A8A8A" }}>{user.email}</p>
                    </div>
                    <Link to="/account" onClick={() => setAccountOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-[13px] hover:bg-[#F5EFE2]">
                      <Package className="w-4 h-4" /> My Account
                    </Link>
                    {user.is_admin && (
                      <Link to="/admin" onClick={() => setAccountOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-[13px] hover:bg-[#F5EFE2]" style={{ color: "#B89778" }}>
                        <Shield className="w-4 h-4" /> Admin Panel
                      </Link>
                    )}
                    <button onClick={() => { logout(); setAccountOpen(false); navigate("/"); }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-[13px] hover:bg-[#F5EFE2] text-left border-t" style={{ borderColor: "#EFE7D6" }}>
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
              <button onClick={() => navigate("/wishlist")} aria-label="Wishlist" className="relative hover:text-[#B89778] transition-colors hidden sm:block">
                <Heart className="w-[18px] h-[18px]" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-2 -right-2 text-[10px] bg-[#D4A574] text-white rounded-full w-4 h-4 flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </button>
              <button onClick={() => setCartOpen(true)} aria-label="Cart" className="relative hover:text-[#B89778] transition-colors">
                <ShoppingBag className="w-[18px] h-[18px]" />
                <span className="absolute -top-2 -right-2 text-[10px] bg-[#D4A574] text-white rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Subnav */}
        <div className="hidden md:flex items-center justify-center gap-10 py-3 border-t" style={{ borderColor: "#EFE7D6" }}>
          {SUBNAV.map(s => (
            <Link key={s.label} to={s.path}
              className="text-[12px] tracking-[0.22em] font-medium font-body hover:text-[#B89778] transition-colors"
              style={{ color: "#1A1A1A" }}>
              {s.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute left-0 top-0 bottom-0 w-[78%] bg-[#FAFAF7] p-6 overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-8">
              <span className="font-serif-display tracking-[0.3em] text-lg">SAUKRITI</span>
              <button onClick={() => setMobileOpen(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="flex flex-col gap-5">
              {[...NAV_LINKS, ...NAV_RIGHT].map(l => (
                <Link key={l.label} to={l.path} onClick={() => setMobileOpen(false)}
                  className="text-[14px] tracking-[0.14em] uppercase font-body" style={{ color: "#1A1A1A" }}>
                  {l.label}
                </Link>
              ))}
              <div className="h-px bg-[#EFE7D6] my-3" />
              {user ? (
                <>
                  <Link to="/account" onClick={() => setMobileOpen(false)} className="text-[13px] tracking-[0.14em] uppercase font-body">My Account</Link>
                  {user.is_admin && (
                    <Link to="/admin" onClick={() => setMobileOpen(false)} className="text-[13px] tracking-[0.14em] uppercase font-body" style={{ color: "#B89778" }}>Admin Panel</Link>
                  )}
                  <button onClick={() => { logout(); setMobileOpen(false); }} className="text-[13px] tracking-[0.14em] uppercase font-body text-left">Logout</button>
                </>
              ) : (
                <button onClick={() => { setMobileOpen(false); startLogin(); }} className="inline-flex items-center gap-2 text-[13px] tracking-[0.14em] uppercase font-body">
                  <LogIn className="w-4 h-4" /> Sign in
                </button>
              )}
              <div className="h-px bg-[#EFE7D6] my-3" />
              {SUBNAV.map(s => (
                <Link key={s.label} to={s.path} onClick={() => setMobileOpen(false)}
                  className="text-[12px] tracking-[0.22em] font-body" style={{ color: "#D4A574" }}>
                  {s.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
