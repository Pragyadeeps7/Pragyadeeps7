import React from "react";
import { Link, NavLink, Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LayoutDashboard, Package, ShoppingBag, Users, Star, LogOut, Home, Loader2 } from "lucide-react";

const AdminLayout = () => {
  const { user, loading, logout } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="min-h-screen flex justify-center items-center"><Loader2 className="w-8 h-8 animate-spin" style={{ color: "#D4A574" }} /></div>;
  }
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (!user.is_admin) return <Navigate to="/account" replace />;

  const links = [
    { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
    { to: "/admin/orders", icon: ShoppingBag, label: "Orders" },
    { to: "/admin/products", icon: Package, label: "Products" },
    { to: "/admin/reviews", icon: Star, label: "Reviews" },
    { to: "/admin/subscribers", icon: Users, label: "Subscribers" },
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row" style={{ background: "#FAFAF7" }}>
      <aside className="lg:w-[240px] lg:min-h-screen border-r" style={{ background: "#1A1A1A", borderColor: "#2A2A2A" }}>
        <div className="px-6 py-6">
          <Link to="/" className="block">
            <h2 className="font-serif-display text-white text-[22px] tracking-[0.3em]">SAUKRITI</h2>
            <p className="text-[10px] tracking-[0.3em] mt-1" style={{ color: "#D4A574" }}>ADMIN</p>
          </Link>
        </div>
        <nav className="px-3 py-2 flex lg:flex-col gap-1 overflow-x-auto">
          {links.map(({ to, icon: I, label, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) => `flex items-center gap-3 px-4 py-3 text-[13px] tracking-[0.1em] uppercase font-medium whitespace-nowrap transition-colors ${isActive ? "text-[#D4A574]" : "text-white/80 hover:text-white"}`}
              style={({ isActive }) => isActive ? { background: "#0F0F0F" } : {}}>
              <I className="w-4 h-4" /> {label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden lg:block absolute bottom-0 left-0 right-0 lg:relative px-6 py-6 mt-10 border-t" style={{ borderColor: "#2A2A2A" }}>
          <Link to="/" className="flex items-center gap-2 text-[12px] mb-3 text-white/70 hover:text-white">
            <Home className="w-4 h-4" /> View Storefront
          </Link>
          <button onClick={logout} className="flex items-center gap-2 text-[12px] text-white/70 hover:text-[#D4A574]">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 p-6 md:p-10 lg:p-12">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
