import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  MoreVertical, 
  Download,
  AlertCircle,
  X,
  CheckCircle2,
  Users,
  MapPin,
  DollarSign,
  Calendar,
  LayoutDashboard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { destinations } from "@/lib/data";
import { cn } from "@/lib/utils";

interface Lead {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  travelerType: string;
  destination: string;
  budget?: number;
  status: string;
  timestamp: string;
}

const STATUS_COLORS: Record<string, string> = {
  "New": "bg-blue-100 text-blue-700",
  "Contacted": "bg-yellow-100 text-yellow-700",
  "Quoted": "bg-purple-100 text-purple-700",
  "Won": "bg-green-100 text-green-700",
  "Deposit Received": "bg-emerald-100 text-emerald-700",
  "Enquiry": "bg-indigo-100 text-indigo-700",
  "Urgent": "bg-red-100 text-red-700",
};

const MOCK_LEADS: Lead[] = [
  {
    _id: "sim-1",
    name: "Alex Johnson",
    email: "alex@example.com",
    travelerType: "couple",
    destination: "Cape Town",
    budget: 4500,
    status: "New",
    timestamp: new Date().toISOString()
  },
  {
    _id: "sim-2",
    name: "Sarah Miller",
    email: "sarah@example.com",
    travelerType: "family",
    destination: "Botswana",
    budget: 12000,
    status: "Won",
    timestamp: new Date(Date.now() - 86400000).toISOString()
  },
  {
    _id: "sim-3",
    name: "Michael Chen",
    email: "michael@example.com",
    travelerType: "individual",
    destination: "Johannesburg",
    budget: 2500,
    status: "Contacted",
    timestamp: new Date(Date.now() - 172800000).toISOString()
  }
];

export function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSimulation, setIsSimulation] = useState(false);

  const [newLead, setNewLead] = useState({
    name: "",
    email: "",
    phone: "",
    travelerType: "individual",
    destination: "Cape Town",
    budget: "",
    status: "New"
  });

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.append("status", statusFilter);
      if (search) params.append("search", search);
      
      const response = await fetch(`/api/admin/leads?${params.toString()}`);
      if (!response.ok) throw new Error("Could not fetch leads");
      const data = await response.json();
      
      if (data.length === 0) {
        setLeads(MOCK_LEADS);
        setIsSimulation(true);
      } else {
        setLeads(data);
        setIsSimulation(false);
      }
    } catch (err) {
      setLeads(MOCK_LEADS);
      setIsSimulation(true);
      setError(null); // Don't show error if we have mock data
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [statusFilter, search]);

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/admin/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLead),
      });
      if (response.ok) {
        setIsModalOpen(false);
        setNewLead({
          name: "",
          email: "",
          phone: "",
          travelerType: "individual",
          destination: "Cape Town",
          budget: "",
          status: "New"
        });
        fetchLeads();
      }
    } catch (err) {
      console.error("Failed to add lead", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen pt-12 pb-20 px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold text-primary-olive font-serif">Lead Management</h1>
              {isSimulation && (
                <Badge className="bg-blue-100 text-blue-700 border-none px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                  Simulation Mode
                </Badge>
              )}
            </div>
            <p className="text-text-muted">Track and manage your luxury travel enquiries.</p>
          </div>
          <div className="flex gap-4">
            <Button 
              onClick={() => setIsModalOpen(true)}
              className="bg-primary-olive text-white rounded-full px-8 h-12 font-bold shadow-lg shadow-primary-olive/20"
            >
              <Plus className="w-5 h-5 mr-2" /> Add New Lead
            </Button>
          </div>
        </div>

        {/* Filters & Search */}
        <Card className="bg-white border-primary-olive/10 p-6 rounded-[32px] shadow-sm mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input 
                type="text" 
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-bg-warm border border-primary-olive/10 rounded-2xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-olive/20"
              />
            </div>
            <div className="flex gap-4">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-bg-warm border border-primary-olive/10 rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-olive/20"
              >
                <option value="">All Statuses</option>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Quoted">Quoted</option>
                <option value="Won">Won</option>
                <option value="Deposit Received">Deposit Received</option>
              </select>
              <Button variant="outline" className="rounded-2xl border-primary-olive/10 text-text-muted">
                <Download className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Leads Table */}
        <Card className="bg-white border-primary-olive/10 rounded-[32px] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-bg-warm border-b border-primary-olive/5">
                  <th className="p-6 text-[10px] text-text-muted uppercase font-bold tracking-widest">Lead ID</th>
                  <th className="p-6 text-[10px] text-text-muted uppercase font-bold tracking-widest">Name</th>
                  <th className="p-6 text-[10px] text-text-muted uppercase font-bold tracking-widest">Destination</th>
                  <th className="p-6 text-[10px] text-text-muted uppercase font-bold tracking-widest">Origin</th>
                  <th className="p-6 text-[10px] text-text-muted uppercase font-bold tracking-widest">Status</th>
                  <th className="p-6 text-[10px] text-text-muted uppercase font-bold tracking-widest">Created</th>
                  <th className="p-6 text-[10px] text-text-muted uppercase font-bold tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="p-12 text-center text-text-muted">Loading leads...</td>
                  </tr>
                ) : leads.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-12 text-center text-text-muted">No leads found matching your criteria.</td>
                  </tr>
                ) : (
                  leads.map((lead: any, index: number) => (
                    <tr key={lead._id || `lead-${index}-${lead.name}`} className="border-b border-primary-olive/5 hover:bg-bg-warm/50 transition-colors group">
                      <td className="p-6">
                        <span className="text-xs font-mono text-primary-olive font-bold">#{lead._id.slice(-6).toUpperCase()}</span>
                      </td>
                      <td className="p-6">
                        <p className="font-bold text-text-main">{lead.name}</p>
                        <p className="text-xs text-text-muted">{lead.email}</p>
                      </td>
                      <td className="p-6">
                        <Badge variant="outline" className="bg-bg-warm border-primary-olive/10 text-primary-olive">
                          {lead.destination || "N/A"}
                        </Badge>
                      </td>
                      <td className="p-6">
                        <p className="text-xs font-medium text-text-muted">{lead.origin || "Direct/Web"}</p>
                      </td>
                      <td className="p-6">
                        <Badge className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider", STATUS_COLORS[lead.status] || "bg-gray-100 text-gray-700")}>
                          {lead.status}
                        </Badge>
                      </td>
                      <td className="p-6">
                        <p className="text-xs text-text-muted">{new Date(lead.timestamp).toLocaleDateString()}</p>
                      </td>
                      <td className="p-6">
                        <div className="flex gap-2">
                          <Button asChild variant="ghost" size="sm" className="rounded-full hover:bg-primary-olive/10 text-primary-olive">
                            <Link to={`/admin/leads/${lead._id}`}><Eye className="w-4 h-4" /></Link>
                          </Button>
                          <Button variant="ghost" size="sm" className="rounded-full hover:bg-primary-olive/10 text-text-muted">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {error && (
          <div className="mt-6 p-4 bg-accent-clay/10 border border-accent-clay/20 rounded-2xl text-accent-clay text-sm flex items-center">
            <AlertCircle className="w-5 h-5 mr-3" /> {error}
          </div>
        )}
      </div>

      {/* Add Lead Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-primary-olive/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-bg-warm transition-colors z-10"
              >
                <X className="w-5 h-5 text-text-muted" />
              </button>

              <div className="p-10">
                <h2 className="text-3xl font-bold text-primary-olive font-serif mb-8">Add New Lead</h2>
                
                <form onSubmit={handleAddLead} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-primary-olive uppercase tracking-widest mb-2">Name</label>
                      <input
                        required
                        type="text"
                        value={newLead.name}
                        onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                        className="w-full bg-bg-warm border border-primary-olive/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-olive/20"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-primary-olive uppercase tracking-widest mb-2">Email</label>
                      <input
                        required
                        type="email"
                        value={newLead.email}
                        onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                        className="w-full bg-bg-warm border border-primary-olive/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-olive/20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-primary-olive uppercase tracking-widest mb-2">Phone</label>
                      <input
                        type="tel"
                        value={newLead.phone}
                        onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                        className="w-full bg-bg-warm border border-primary-olive/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-olive/20"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-primary-olive uppercase tracking-widest mb-2">Destination</label>
                      <select
                        value={newLead.destination}
                        onChange={(e) => setNewLead({ ...newLead, destination: e.target.value })}
                        className="w-full bg-bg-warm border border-primary-olive/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-olive/20"
                      >
                        {Object.values(destinations).map(d => (
                          <option key={d.id} value={d.name}>{d.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-primary-olive uppercase tracking-widest mb-2">Budget</label>
                      <input
                        type="number"
                        value={newLead.budget}
                        onChange={(e) => setNewLead({ ...newLead, budget: e.target.value })}
                        className="w-full bg-bg-warm border border-primary-olive/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-olive/20"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-primary-olive uppercase tracking-widest mb-2">Type</label>
                      <select
                        value={newLead.travelerType}
                        onChange={(e) => setNewLead({ ...newLead, travelerType: e.target.value })}
                        className="w-full bg-bg-warm border border-primary-olive/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-olive/20"
                      >
                        <option value="individual">Individual</option>
                        <option value="couple">Couple</option>
                        <option value="family">Family</option>
                        <option value="group">Group</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-primary-olive uppercase tracking-widest mb-2">Status</label>
                      <select
                        value={newLead.status}
                        onChange={(e) => setNewLead({ ...newLead, status: e.target.value })}
                        className="w-full bg-bg-warm border border-primary-olive/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-olive/20"
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Quoted">Quoted</option>
                        <option value="Won">Won</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-6 flex gap-4">
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="flex-grow bg-primary-olive text-white rounded-full h-14 font-bold text-lg shadow-lg shadow-primary-olive/20"
                    >
                      {isSubmitting ? "Creating..." : "Create Lead"}
                    </Button>
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => setIsModalOpen(false)}
                      className="rounded-full border-primary-olive/20 text-text-muted px-8"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
