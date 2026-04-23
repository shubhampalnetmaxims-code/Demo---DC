import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { 
  ArrowLeft, 
  Save, 
  Trash2, 
  Image as ImageIcon, 
  MapPin, 
  Package as PackageIcon,
  DollarSign,
  Calendar,
  ListChecks,
  Info,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function AdminPackageDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id && id !== 'new') {
      const fetchDetails = async () => {
        try {
          const response = await fetch(`/api/public/packages`);
          if (response.ok) {
            const data = await response.json();
            const found = data.find((p: any) => p.id === id || p._id === id);
            setPkg(found);
          }
        } catch (err) {
          console.error("Fetch error:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchDetails();
    } else {
      setPkg({
        id: "",
        name: "",
        title: "",
        description: "",
        image: "",
        price: 0,
        destination: "",
        itinerary: "",
        highlights: []
      });
      setLoading(false);
    }
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const url = id === 'new' ? "/api/content/packages" : `/api/content/packages/${id}`;
      const method = id === 'new' ? "POST" : "PUT";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pkg)
      });
      if (response.ok) {
        if (id === 'new') {
          navigate("/admin/content?tab=packages");
        } else {
          alert("Package updated successfully!");
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

  if (!pkg) return <div>Package not found</div>;

  return (
    <main className="min-h-screen pt-12 pb-20 px-8">
      <div className="max-w-5xl mx-auto">
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
              <h1 className="text-3xl font-bold text-primary-olive font-serif">{pkg.name}</h1>
              <p className="text-text-muted text-sm">Managing curated travel package</p>
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
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="p-8 bg-white border-primary-olive/10 rounded-[32px]">
              <h3 className="text-xl font-bold font-serif text-primary-olive mb-6 flex items-center">
                <Info className="w-5 h-5 mr-3 text-accent-clay" /> Package Details
              </h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-[10px] text-primary-olive uppercase font-bold tracking-widest mb-2 px-1">Package Name</label>
                    <input 
                      type="text" 
                      value={pkg.name} 
                      onChange={(e) => setPkg({ ...pkg, name: e.target.value })}
                      className="w-full bg-bg-warm border border-primary-olive/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary-olive"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-primary-olive uppercase font-bold tracking-widest mb-2 px-1">Destination</label>
                    <input 
                      type="text" 
                      value={pkg.destination} 
                      onChange={(e) => setPkg({ ...pkg, destination: e.target.value })}
                      className="w-full bg-bg-warm border border-primary-olive/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary-olive"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-primary-olive uppercase font-bold tracking-widest mb-2 px-1">Base Price (USD)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                      <input 
                        type="number" 
                        value={pkg.price} 
                        onChange={(e) => setPkg({ ...pkg, price: parseFloat(e.target.value) })}
                        className="w-full bg-bg-warm border border-primary-olive/10 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary-olive"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-primary-olive uppercase font-bold tracking-widest mb-2 px-1">Short Description</label>
                  <textarea 
                    rows={2}
                    value={pkg.description} 
                    onChange={(e) => setPkg({ ...pkg, description: e.target.value })}
                    className="w-full bg-bg-warm border border-primary-olive/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary-olive resize-none"
                  />
                </div>
              </div>
            </Card>

            {/* Itinerary Section */}
            <Card className="p-8 bg-white border-primary-olive/10 rounded-[32px]">
              <h3 className="text-xl font-bold font-serif text-primary-olive mb-6 flex items-center">
                <Calendar className="w-5 h-5 mr-3 text-purple-600" /> Itinerary Structure
              </h3>
              <div className="space-y-4">
                <p className="text-xs text-text-muted mb-4 font-medium italic">Describe the day-by-day flow of this journey.</p>
                <textarea 
                  rows={10}
                  value={pkg.itinerary} 
                  onChange={(e) => setPkg({ ...pkg, itinerary: e.target.value })}
                  className="w-full bg-bg-warm border border-primary-olive/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary-olive resize-none leading-relaxed"
                  placeholder="Day 1: Arrival...&#10;Day 2: Exploration..."
                />
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <Card className="p-6 bg-white border-primary-olive/10 rounded-[32px] overflow-hidden">
               <label className="block text-[10px] text-primary-olive uppercase font-bold tracking-widest mb-4 px-1">Package Image</label>
               <div className="aspect-[4/3] rounded-2xl bg-bg-warm overflow-hidden border border-primary-olive/5 mb-4 relative group">
                 <img 
                    src={pkg.image} 
                    className="w-full h-full object-cover" 
                    referrerPolicy="no-referrer"
                 />
                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button variant="secondary" size="sm" className="rounded-full font-bold">
                       Change Image
                    </Button>
                 </div>
               </div>
               <input 
                  type="text" 
                  value={pkg.image || ""} 
                  onChange={(e) => setPkg({ ...pkg, image: e.target.value })}
                  placeholder="Image URL"
                  className="w-full bg-bg-warm border border-primary-olive/10 rounded-xl px-4 py-2 text-[10px] font-mono focus:outline-none focus:ring-1 focus:ring-primary-olive"
               />
            </Card>

            <Card className="p-6 bg-bg-warm border border-primary-olive/5 rounded-[32px]">
              <h4 className="text-xs font-bold text-primary-olive uppercase tracking-[0.2em] mb-4">Highlights</h4>
              <div className="space-y-2">
                {[
                  "Luxury Accommodation",
                  "Private Guided Tours",
                  "All Transfers Included",
                  "Curated Local Experiences"
                ].map((h, i) => (
                  <div key={i} className="flex items-center text-xs text-text-muted">
                    <CheckCircle2 className="w-3 h-3 mr-2 text-primary-olive/40" />
                    {h}
                  </div>
                ))}
              </div>
              <Button variant="ghost" size="sm" className="w-full mt-6 rounded-full text-[10px] font-bold uppercase tracking-widest text-primary-olive hover:bg-white">
                Edit Highlights
              </Button>
            </Card>

            <Card className="p-6 bg-accent-clay/5 border border-accent-clay/10 rounded-[32px]">
              <h4 className="text-xs font-bold text-accent-clay uppercase tracking-[0.2em] mb-2 flex items-center">
                <Trash2 className="w-4 h-4 mr-2" /> Danger Zone
              </h4>
              <p className="text-[10px] text-accent-clay/70 mb-4">Deleting this package will remove it from the curated list. This action cannot be undone.</p>
              <Button variant="outline" className="w-full rounded-full border-accent-clay/20 text-accent-clay hover:bg-accent-clay hover:text-white font-bold h-10">
                Delete Package
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
