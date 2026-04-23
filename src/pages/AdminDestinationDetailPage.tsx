import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "motion/react";
import { 
  ArrowLeft, 
  Save, 
  Trash2, 
  Plus, 
  Image as ImageIcon, 
  MapPin, 
  Globe,
  Maximize2,
  Hotel,
  Package as PackageIcon,
  CheckCircle2,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { cn } from "@/lib/utils";

export function AdminDestinationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [destination, setDestination] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id && id !== 'new') {
      const fetchDetails = async () => {
        try {
          const response = await fetch(`/api/public/destinations/${id}`);
          if (response.ok) {
            const data = await response.json();
            setDestination(data);
          }
        } catch (err) {
          console.error("Fetch error:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchDetails();
    } else {
      setDestination({
        id: "",
        name: "",
        description: "",
        highlights: [],
        heroImage: "",
        stays: [],
        packages: []
      });
      setLoading(false);
    }
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const url = id === 'new' ? "/api/content/destinations" : `/api/content/destinations/${id}`;
      const method = id === 'new' ? "POST" : "PUT";
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(destination)
      });
      if (response.ok) {
        if (id === 'new') {
          navigate("/admin/content?tab=destinations");
        } else {
          alert("Destination updated successfully!");
        }
      }
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-warm">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-olive"></div>
      </div>
    );
  }

  if (!destination) return <div>Destination not found</div>;

  return (
    <main className="min-h-screen pt-12 pb-20 px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/admin/content")}
              className="rounded-full hover:bg-white/50"
            >
              <ArrowLeft className="w-5 h-5 mr-2" /> Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-primary-olive font-serif">{destination.name}</h1>
              <p className="text-text-muted text-sm">Managing destination profile & core assets</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={handleSave}
              disabled={saving}
              className="bg-primary-olive text-white rounded-full px-8 font-bold shadow-lg shadow-primary-olive/20"
            >
              <Save className="w-4 h-4 mr-2" /> {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="p-8 bg-white border-primary-olive/10 rounded-[32px] overflow-hidden">
              <h3 className="text-xl font-bold font-serif text-primary-olive mb-6 flex items-center">
                <Globe className="w-5 h-5 mr-3 text-accent-clay" /> Basic Information
              </h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] text-primary-olive uppercase font-bold tracking-widest mb-2 px-1">Destination ID</label>
                    <input 
                      type="text" 
                      value={destination.id} 
                      onChange={(e) => setDestination({ ...destination, id: e.target.value })}
                      disabled={id !== 'new'}
                      className={cn(
                        "w-full bg-bg-warm border border-primary-olive/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary-olive",
                        id !== 'new' && "opacity-50"
                      )}
                      placeholder="e.g. cape-town"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-primary-olive uppercase font-bold tracking-widest mb-2 px-1">Destination Name</label>
                    <input 
                      type="text" 
                      value={destination.name} 
                      onChange={(e) => setDestination({ ...destination, name: e.target.value })}
                      className="w-full bg-bg-warm border border-primary-olive/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary-olive"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-primary-olive uppercase font-bold tracking-widest mb-2 px-1">Description</label>
                  <textarea 
                    rows={4}
                    value={destination.description} 
                    onChange={(e) => setDestination({ ...destination, description: e.target.value })}
                    className="w-full bg-bg-warm border border-primary-olive/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary-olive resize-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-primary-olive uppercase font-bold tracking-widest mb-2 px-1">Highlights (one per line)</label>
                  <textarea 
                    rows={4}
                    value={destination.highlights?.join("\n")} 
                    onChange={(e) => setDestination({ ...destination, highlights: e.target.value.split("\n") })}
                    className="w-full bg-bg-warm border border-primary-olive/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary-olive resize-none font-mono text-xs"
                    placeholder="Luxury Dining&#10;Wildlife Safaris&#10;Private Flights"
                  />
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Stays List */}
              <Card className="p-8 bg-white border-primary-olive/10 rounded-[32px]">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold font-serif text-primary-olive flex items-center">
                    <Hotel className="w-5 h-5 mr-3 text-emerald-600" /> Stays
                  </h3>
                  <Button variant="ghost" size="sm" className="rounded-full h-8 w-8 p-0 hover:bg-emerald-50 text-emerald-600">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-3">
                  {destination.stays?.map((stay: any) => (
                    <div key={stay.id} className="flex items-center p-3 rounded-2xl bg-bg-warm/50 border border-primary-olive/5 group">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-white mr-3">
                        <img src={stay.image} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-grow">
                        <p className="text-sm font-bold text-primary-olive">{stay.name}</p>
                        <p className="text-[10px] text-text-muted">{stay.type}</p>
                      </div>
                      <Link to={`/admin/content?tab=stays&id=${stay.id}`} className="opacity-0 group-hover:opacity-100 p-2 hover:bg-white rounded-full transition-all">
                        <Maximize2 className="w-3 h-3 text-text-muted" />
                      </Link>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Packages List */}
              <Card className="p-8 bg-white border-primary-olive/10 rounded-[32px]">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold font-serif text-primary-olive flex items-center">
                    <PackageIcon className="w-5 h-5 mr-3 text-purple-600" /> Packages
                  </h3>
                  <Button variant="ghost" size="sm" className="rounded-full h-8 w-8 p-0 hover:bg-purple-50 text-purple-600">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-3">
                  {destination.packages?.map((pkg: any) => (
                    <div key={pkg.id} className="flex items-center p-3 rounded-2xl bg-bg-warm/50 border border-primary-olive/5 group">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-white mr-3">
                        <img src={pkg.image} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-grow">
                        <p className="text-sm font-bold text-primary-olive">{pkg.name}</p>
                        <p className="text-[10px] font-bold text-accent-clay">${pkg.price}</p>
                      </div>
                      <Link to={`/admin/content?tab=packages&id=${pkg.id}`} className="opacity-0 group-hover:opacity-100 p-2 hover:bg-white rounded-full transition-all">
                        <Maximize2 className="w-3 h-3 text-text-muted" />
                      </Link>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>

          {/* Media & Side Info */}
          <div className="space-y-8">
            <Card className="p-6 bg-white border-primary-olive/10 rounded-[32px] overflow-hidden">
               <label className="block text-[10px] text-primary-olive uppercase font-bold tracking-widest mb-4 px-1">Hero Image</label>
               <div className="aspect-[4/3] rounded-2xl bg-bg-warm overflow-hidden border border-primary-olive/5 mb-4 group relative">
                 <img 
                    src={destination.heroImage || destination.image} 
                    className="w-full h-full object-cover" 
                    referrerPolicy="no-referrer"
                 />
                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button variant="secondary" size="sm" className="rounded-full font-bold">
                       <ImageIcon className="w-4 h-4 mr-2" /> Change Image
                    </Button>
                 </div>
               </div>
               <input 
                  type="text" 
                  value={destination.heroImage || destination.image || ""} 
                  onChange={(e) => setDestination({ ...destination, heroImage: e.target.value })}
                  placeholder="Hero URL"
                  className="w-full bg-bg-warm border border-primary-olive/10 rounded-xl px-4 py-2.5 text-[10px] font-mono focus:outline-none focus:ring-1 focus:ring-primary-olive"
               />
            </Card>

            <Card className="p-6 bg-bg-warm border border-primary-olive/5 rounded-[32px]">
              <h4 className="text-xs font-bold text-primary-olive uppercase tracking-[0.2em] mb-4">Quick Stats</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm py-2 border-b border-primary-olive/5">
                  <span className="text-text-muted">Total Packages</span>
                  <span className="font-bold text-primary-olive">{destination.packages?.length || 0}</span>
                </div>
                <div className="flex justify-between items-center text-sm py-2 border-b border-primary-olive/5">
                  <span className="text-text-muted">Total Stays</span>
                  <span className="font-bold text-primary-olive">{destination.stays?.length || 0}</span>
                </div>
                <div className="flex justify-between items-center text-sm py-2">
                  <span className="text-text-muted">Live on Site</span>
                  <Badge className="bg-emerald-100 text-emerald-700 border-none font-bold text-[10px]">Active</Badge>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-accent-clay/5 border border-accent-clay/10 rounded-[32px]">
              <h4 className="text-xs font-bold text-accent-clay uppercase tracking-[0.2em] mb-2 flex items-center">
                <Trash2 className="w-4 h-4 mr-2" /> Danger Zone
              </h4>
              <p className="text-[10px] text-accent-clay/70 mb-4">Deleting this destination will remove it from the home page and category lists. This action cannot be undone.</p>
              <Button variant="outline" className="w-full rounded-full border-accent-clay/20 text-accent-clay hover:bg-accent-clay hover:text-white font-bold h-10">
                Delete Destination
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
