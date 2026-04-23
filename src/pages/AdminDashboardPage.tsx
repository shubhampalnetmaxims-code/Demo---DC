import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { 
  Users, 
  TrendingUp, 
  CreditCard, 
  MapPin, 
  ArrowRight,
  Loader2,
  Calendar,
  AlertCircle
} from "lucide-react";
import { Link } from "react-router-dom";

interface Stats {
  totalLeads: number;
  newLeads: number;
  wonLeads: number;
  totalRevenue: number;
  popularDestinations: { name: string; count: number }[];
}

const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats");
      if (!response.ok) throw new Error("Failed to fetch dashboard data");
      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-red-50 text-red-600 rounded-xl flex items-center gap-3">
        <AlertCircle className="w-5 h-5" />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Executive Dashboard</h1>
          <p className="text-gray-500 mt-1 italic font-serif">Performance overview for VAYA Luxury</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Leads" 
          value={stats?.totalLeads || 0} 
          icon={<Users className="w-5 h-5" />} 
          color="bg-blue-50 text-blue-600"
          link="/admin/leads"
        />
        <StatCard 
          title="New Opportunities" 
          value={stats?.newLeads || 0} 
          icon={<TrendingUp className="w-5 h-5" />} 
          color="bg-orange-50 text-orange-600"
          link="/admin/leads?status=New"
        />
        <StatCard 
          title="Won Bookings" 
          value={stats?.wonLeads || 0} 
          icon={<ArrowRight className="w-5 h-5" />} 
          color="bg-green-50 text-green-600"
        />
        <StatCard 
          title="Revenue (USD)" 
          value={`$${(stats?.totalRevenue || 0).toLocaleString()}`} 
          icon={<CreditCard className="w-5 h-5" />} 
          color="bg-purple-50 text-purple-600"
          link="/admin/payments"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Popular Destinations */}
        <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <MapPin className="w-5 h-5 text-gray-400" />
              Destinations by Interest
            </h2>
            <Link to="/admin/content?tab=destinations" className="text-sm text-blue-600 hover:underline">Manage All</Link>
          </div>
          <div className="space-y-4">
            {stats?.popularDestinations.map((dest, idx) => (
              <div key={dest.name} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 flex items-center justify-center bg-gray-50 rounded text-xs font-mono text-gray-400">{String(idx + 1).padStart(2, '0')}</span>
                  <span className="font-medium text-gray-700">{dest.name}</span>
                </div>
                <div className="flex items-center gap-4 flex-1 ml-8">
                  <div className="h-2 bg-gray-50 flex-1 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(dest.count / (stats?.totalLeads || 1)) * 100}%` }}
                      className="h-full bg-blue-500"
                    />
                  </div>
                  <span className="text-sm font-mono text-gray-500 w-8 text-right">{dest.count}</span>
                </div>
              </div>
            ))}
            {(!stats?.popularDestinations || stats.popularDestinations.length === 0) && (
              <p className="text-center py-8 text-gray-400 italic">No data available yet</p>
            )}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="bg-gray-900 text-white p-6 rounded-2xl shadow-xl overflow-hidden relative">
          <div className="relative z-10">
            <h2 className="text-lg font-semibold mb-6">Quick Operations</h2>
            <div className="grid grid-cols-2 gap-4">
              <QuickActionLink to="/admin/leads" label="Review Leads" sub="Check new enquiries" />
              <QuickActionLink to="/admin/content" label="Update Content" sub="Destinations & Packages" />
              <QuickActionLink to="/admin/payments" label="Financials" sub="Track revenue" />
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors cursor-pointer group">
                  <p className="font-medium">System Health</p>
                  <p className="text-xs text-white/50 mt-1">MongoDB & Stripe: OK</p>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
        </section>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  link?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, link }) => {
  const Card = (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
      <div className="flex items-center gap-4 mb-4">
        <div className={`p-3 rounded-xl ${color}`}>
          {icon}
        </div>
        <div className="h-px bg-gray-100 flex-1" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
    </div>
  );

  return link ? <Link to={link}>{Card}</Link> : Card;
};

const QuickActionLink: React.FC<{ to: string; label: string; sub: string }> = ({ to, label, sub }) => (
  <Link to={to} className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors group">
    <p className="font-medium group-hover:text-blue-400 transition-colors">{label}</p>
    <p className="text-xs text-white/50 mt-1">{sub}</p>
  </Link>
);

export default AdminDashboardPage;
