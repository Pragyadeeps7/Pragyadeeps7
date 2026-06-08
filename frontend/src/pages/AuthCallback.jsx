import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { exchangeSession } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;
    (async () => {
      const hash = window.location.hash || "";
      const match = hash.match(/session_id=([^&]+)/);
      const sid = match ? decodeURIComponent(match[1]) : null;
      if (!sid) { navigate("/", { replace: true }); return; }
      try {
        const res = await exchangeSession(sid);
        setUser(res.user);
        // Clean hash, go to account
        window.history.replaceState(null, "", "/account");
        navigate("/account", { replace: true, state: { user: res.user } });
      } catch (e) {
        navigate("/login", { replace: true });
      }
    })();
  }, [navigate, setUser]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAF7]">
      <Loader2 className="w-8 h-8 animate-spin mb-4" style={{ color: "#D4A574" }} />
      <p className="font-serif-display text-[18px]">Signing you in...</p>
    </div>
  );
};

export default AuthCallback;
