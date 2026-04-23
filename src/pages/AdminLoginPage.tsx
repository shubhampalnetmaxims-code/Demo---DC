import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { Lock, Mail, AlertCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Redirect to intended page or dashboard
        const from = (location.state as any)?.from?.pathname || "/admin/leads";
        navigate(from, { replace: true });
      } else {
        setError(data.error || "Invalid credentials");
      }
    } catch (err) {
      setError("Could not complete login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-bg-warm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-olive text-white mb-4 shadow-xl">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-primary-olive font-serif">VAYA Admin</h1>
          <p className="text-text-muted mt-2">Sign in to your back-office account</p>
        </div>

        <Card className="bg-white border-primary-olive/10 rounded-[32px] shadow-2xl overflow-hidden">
          <CardHeader className="pt-8 pb-4 text-center">
            <CardTitle className="text-xl font-bold font-serif text-primary-olive">Login</CardTitle>
            <CardDescription className="text-xs font-bold uppercase tracking-widest">Authorized Access Only</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-accent-clay/10 border border-accent-clay/20 p-4 rounded-xl flex items-center text-accent-clay text-sm font-medium"
                >
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {error}
                </motion.div>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-primary-olive uppercase tracking-widest block">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@gmail.com"
                      className="w-full bg-bg-warm border border-primary-olive/10 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-olive/20 transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-primary-olive uppercase tracking-widest block">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                      required
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-bg-warm border border-primary-olive/10 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-olive/20 transition-all font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary-olive hover:bg-primary-olive/90 text-white rounded-full h-14 font-bold text-lg shadow-lg shadow-primary-olive/20 group transition-all"
                >
                  {loading ? (
                    "Signing in..."
                  ) : (
                    <>
                      Login
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <p className="mt-8 text-center text-xs text-text-muted font-bold uppercase tracking-widest">
          &copy; 2026 VAYA Travel Portfolio
        </p>
      </motion.div>
    </main>
  );
}
