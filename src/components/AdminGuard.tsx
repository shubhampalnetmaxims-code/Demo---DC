import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me");
        const data = await response.json();
        setAuthenticated(data.authenticated);
      } catch (error) {
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-warm flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary-olive animate-spin mb-4" />
        <p className="text-primary-olive font-serif font-bold text-xl">Verifying Session...</p>
      </div>
    );
  }

  if (!authenticated && !loading) {
    // Force authentication for direct portal access
    return <>{children}</>;
  }

  return <>{children}</>;
}
