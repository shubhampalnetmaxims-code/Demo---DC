import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Image as ImageIcon, 
  MapPin, 
  Package, 
  Hotel, 
  Compass,
  ChevronRight,
  LayoutDashboard,
  DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type EntityType = "destinations" | "packages" | "stays" | "experiences";

interface Entity {
  _id?: string;
  name?: string;
  title?: string;
  description: string;
  image?: string;
  price?: number;
  destination?: string;
  highlights?: string[];
  [key: string]: any;
}

const ENTITY_CONFIG = {
  destinations: { label: "Destinations", icon: MapPin, color: "text-blue-600" },
  packages: { label: "Packages", icon: Package, color: "text-purple-600" },
  stays: { label: "Stays", icon: Hotel, color: "text-emerald-600" },
  experiences: { label: "Experiences", icon: Compass, color: "text-orange-600" }
};

export function AdminContentPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<EntityType>("destinations");
  const [items, setItems] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSimulation, setIsSimulation] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async (collection: EntityType) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/content/${collection}`);
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setItems(data);
      setIsSimulation(false);
    } catch (err) {
      console.warn(`Falling back to simulation for ${collection}`);
      setIsSimulation(true);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      const response = await fetch(`/api/content/${activeTab}/${id}`, {
        method: "DELETE"
      });
      if (response.ok) fetchData(activeTab);
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const filteredItems = items.filter(item => 
    (item.name || item.title || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="min-h-screen pt-12 pb-20 px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold text-primary-olive font-serif">Content Manager</h1>
              {isSimulation && (
                <Badge className="bg-blue-100 text-blue-700 border-none px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                  Simulation Mode
                </Badge>
              )}
            </div>
            <p className="text-text-muted">Directly manage destinations, stays, and curated luxury packages.</p>
          </div>
          <div className="flex gap-4">
            <div className="hidden lg:flex flex-col justify-center bg-accent-clay/5 border border-accent-clay/10 rounded-2xl px-4 py-1">
              <p className="text-[10px] text-accent-clay font-bold uppercase tracking-widest leading-none mb-1">Platform Sync</p>
              <p className="text-[10px] text-text-muted leading-none">Updates Live Site & Trip Builder</p>
            </div>
            <Button 
              onClick={() => navigate(`/admin/content/${activeTab}/new`)}
              className="bg-primary-olive text-white rounded-full px-8 h-12 font-bold shadow-lg shadow-primary-olive/20"
            >
              <Plus className="w-5 h-5 mr-2" /> Add {ENTITY_CONFIG[activeTab].label.slice(0, -1)}
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 p-1 bg-white/50 backdrop-blur-sm rounded-3xl border border-primary-olive/10 w-fit">
          {(Object.keys(ENTITY_CONFIG) as EntityType[]).map((tab) => {
            const Config = ENTITY_CONFIG[tab];
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all",
                  isActive 
                    ? "bg-white text-primary-olive shadow-sm ring-1 ring-primary-olive/5" 
                    : "text-text-muted hover:text-primary-olive hover:bg-white/50"
                )}
              >
                <Config.icon className={cn("w-4 h-4", isActive ? Config.color : "opacity-50")} />
                {Config.label}
              </button>
            );
          })}
        </div>

        {/* Content List */}
        <Card className="bg-white border-primary-olive/10 rounded-[40px] shadow-sm overflow-hidden min-h-[400px]">
          <div className="p-6 border-b border-primary-olive/5 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input 
                type="text" 
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-bg-warm/50 border border-primary-olive/10 rounded-2xl pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-olive/20"
              />
            </div>
            <p className="text-xs text-text-muted font-bold uppercase tracking-widest">
              {filteredItems.length} Total {ENTITY_CONFIG[activeTab].label}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-bg-warm/30 border-b border-primary-olive/5">
                  <th className="p-6 text-[10px] text-text-muted uppercase font-bold tracking-widest">Preview</th>
                  <th className="p-6 text-[10px] text-text-muted uppercase font-bold tracking-widest">Name / Title</th>
                  <th className="p-6 text-[10px] text-text-muted uppercase font-bold tracking-widest">Location</th>
                  {(activeTab !== "destinations") && (
                    <th className="p-6 text-[10px] text-text-muted uppercase font-bold tracking-widest">Price</th>
                  )}
                  <th className="p-6 text-[10px] text-text-muted uppercase font-bold tracking-widest">Modified</th>
                  <th className="p-6 text-[10px] text-text-muted uppercase font-bold tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="p-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-primary-olive/10 border-t-primary-olive rounded-full animate-spin" />
                        <p className="text-sm text-text-muted font-bold uppercase tracking-widest animate-pulse">Syncing Content...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-20 text-center">
                      <div className="max-w-xs mx-auto space-y-4">
                        <div className="w-16 h-16 bg-bg-warm rounded-full flex items-center justify-center mx-auto">
                          {React.createElement(ENTITY_CONFIG[activeTab].icon, { className: "w-8 h-8 text-primary-olive/20" })}
                        </div>
                        <p className="text-text-muted text-sm leading-relaxed">No {activeTab} found. Start by adding your first luxury collection.</p>
                        <Button onClick={() => navigate(`/admin/content/${activeTab}/new`)} variant="outline" className="rounded-full border-primary-olive/20 text-primary-olive">
                          Create {ENTITY_CONFIG[activeTab].label.slice(0, -1)}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item, index) => (
                    <tr key={item._id || item.id || `item-${index}`} className="border-b border-primary-olive/5 hover:bg-bg-warm/30 transition-colors group">
                      <td className="p-6">
                        <div className="w-20 h-14 rounded-xl bg-bg-warm overflow-hidden border border-primary-olive/10 group-hover:scale-105 transition-transform">
                          {item.image ? (
                            <img src={item.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center opacity-20">
                              <ImageIcon className="w-6 h-6" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-6">
                        <p className="font-bold text-text-main text-base">{item.name || item.title}</p>
                        <p className="text-xs text-text-muted line-clamp-1 max-w-xs">{item.description}</p>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center text-sm text-text-muted font-medium">
                          <MapPin className="w-4 h-4 mr-2 opacity-50 text-accent-clay" />
                          {item.destination || "Multiple Locations"}
                        </div>
                      </td>
                      {(activeTab !== "destinations") && (
                        <td className="p-6">
                          <p className="text-base font-bold text-primary-olive font-serif">${item.price?.toLocaleString()}</p>
                          <p className="text-[10px] text-text-muted uppercase font-bold">Estimated Cost</p>
                        </td>
                      )}
                      <td className="p-6">
                        <p className="text-xs text-text-muted font-medium">{item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : "Draft"}</p>
                      </td>
                      <td className="p-6 text-right">
                        <div className="flex gap-2 justify-end">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            asChild
                            className="rounded-full hover:bg-primary-olive/10 text-primary-olive"
                          >
                            <Link to={`/admin/content/${activeTab}/${item._id || item.id}`}>
                              <Edit className="w-4 h-4 mr-2" />
                              <span className="text-xs font-bold uppercase tracking-widest">Edit Details</span>
                            </Link>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => (item._id || item.id) && handleDelete(item._id || item.id)}
                            className="rounded-full hover:bg-accent-clay/10 text-accent-clay"
                          >
                            <Trash2 className="w-4 h-4" />
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
      </div>
    </main>
  );
}
