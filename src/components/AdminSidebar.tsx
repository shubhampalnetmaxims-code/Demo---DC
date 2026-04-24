import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Users, 
  LayoutDashboard, 
  CreditCard, 
  Settings, 
  LogOut, 
  ChevronRight,
  ShieldCheck,
  Compass,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { 
    label: "Dashboard", 
    path: "/admin", 
    icon: LayoutDashboard,
    description: "Analytics & Status" 
  },
  { 
    label: "CRM & Leads", 
    path: "/admin/leads", 
    icon: Users,
    description: "Manage travel enquiries" 
  },
  { 
    label: "Content Manager", 
    path: "/admin/content", 
    icon: Compass,
    description: "Destinations & Packages" 
  },
  { 
    label: "Payments", 
    path: "/admin/payments/reconcile", 
    icon: CreditCard,
    description: "Reconcile deposits" 
  },
];

export function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<{name: string, email: string} | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/me");
        const data = await response.json();
        if (data.authenticated) {
          setUser(data.user);
        }
      } catch (err) {
        console.error("Failed to fetch admin user", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      navigate("/admin/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-72 bg-white border-r border-primary-olive/10 z-50 flex flex-col pt-10">
      <div className="px-8 mb-12">
        <Link to="/" className="text-2xl font-bold text-primary-olive font-serif tracking-tighter">
          VAYA <span className="text-accent-clay">Admin</span>
        </Link>
        <div className="mt-2 flex items-center text-[10px] text-accent-clay font-bold uppercase tracking-widest">
          <ShieldCheck className="w-3 h-3 mr-1" /> Secure Console
        </div>
      </div>

      <nav className="flex-grow px-4 space-y-2">
        {NAV_ITEMS.map((item) => {
          const isActive = item.path === "/admin" 
            ? location.pathname === "/admin" 
            : location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "group flex items-center gap-4 px-4 py-4 rounded-2xl transition-all",
                isActive 
                  ? "bg-primary-olive text-white shadow-lg shadow-primary-olive/20" 
                  : "text-text-muted hover:bg-bg-warm hover:text-primary-olive"
              )}
            >
              <div className={cn(
                "p-2 rounded-xl transition-colors",
                isActive ? "bg-white/20" : "bg-bg-warm group-hover:bg-white"
              )}>
                <item.icon className="w-5 h-5" />
              </div>
              <div className="flex-grow">
                <p className="text-sm font-bold leading-none mb-1">{item.label}</p>
                <p className={cn(
                  "text-[10px] opacity-60",
                  isActive ? "text-white" : "text-text-muted"
                )}>{item.description}</p>
              </div>
              <ChevronRight className={cn(
                "w-4 h-4 transition-transform",
                isActive ? "opacity-100 translate-x-1" : "opacity-0 -translate-x-2"
              )} />
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-primary-olive/5">
        <div className="p-4 bg-bg-warm rounded-2xl flex items-center gap-3 min-h-[72px]">
          {loading ? (
            <Loader2 className="w-5 h-5 text-primary-olive animate-spin mx-auto" />
          ) : user ? (
            <>
              <div className="w-10 h-10 rounded-full bg-primary-olive text-white flex items-center justify-center font-bold">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-text-main truncate">{user.name}</p>
                <p className="text-[10px] text-text-muted truncate">{user.email}</p>
              </div>
            </>
          ) : (
             <p className="text-[10px] text-text-muted mx-auto">Not authenticated</p>
          )}
        </div>
      </div>
    </aside>
  );
}

// Small helper for the Sidebar
function Button({ children, className, variant, ...props }: any) {
  return (
    <button 
      className={cn(
        "flex items-center transition-all",
        variant === "ghost" ? "bg-transparent" : "",
        className
      )} 
      {...props}
    >
      {children}
    </button>
  );
}
