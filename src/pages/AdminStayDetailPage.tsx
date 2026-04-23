import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { 
  ArrowLeft, 
  Save, 
  Trash2, 
  Loader2, 
  AlertCircle,
  MapPin,
  Hotel,
  Image as ImageIcon,
  Type
} from "lucide-react";

interface Stay {
  _id?: string;
  id: string;
  name: string;
  destination: string;
  type: string;
  image: string;
  description: string;
}

const AdminStayDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [stay, setStay] = useState<Stay | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id && id !== 'new') {
      fetchStay();
    } else {
      setStay({
        id: "",
        name: "",
        destination: "",
        type: "",
        image: "",
        description: ""
      });
      setLoading(false);
    }
  }, [id]);

  const fetchStay = async () => {
    try {
      const response = await fetch("/api/content/stays");
      if (!response.ok) throw new Error("Failed to fetch stays");
      const data: Stay[] = await response.json();
      const found = data.find(s => s._id === id || s.id === id);
      if (!found) throw new Error("Stay not found");
      setStay(found);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stay) return;
    setSaving(true);
    try {
      const url = id === 'new' ? "/api/content/stays" : `/api/content/stays/${id}`;
      const method = id === 'new' ? "POST" : "PUT";
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stay)
      });

      if (!response.ok) throw new Error("Failed to save stay");
      
      navigate("/admin/content?tab=stays");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id || id === 'new') return;
    if (!window.confirm("Are you sure you want to delete this stay?")) return;
    
    try {
      const response = await fetch(`/api/content/stays/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete");
      navigate("/admin/content?tab=stays");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
    </div>
  );

  if (!stay) return <div>Not found</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate("/admin/content?tab=stays")}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Content
        </button>
        {id !== 'new' && (
          <button 
            onClick={handleDelete}
            className="flex items-center gap-2 text-red-500 hover:text-red-700 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete Stay
          </button>
        )}
      </div>

      <header>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          {id === 'new' ? "Create New Stay" : "Edit Stay"}
        </h1>
        <p className="text-gray-500 mt-1">Manage luxury accommodation details</p>
      </header>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <Type className="w-4 h-4 text-blue-500" />
              General Information
            </h2>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Stay Name</label>
              <input 
                type="text" 
                value={stay.name}
                onChange={(e) => setStay({ ...stay, name: e.target.value })}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                required
                placeholder="e.g. The Silo Hotel"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Internal ID</label>
                <input 
                  type="text" 
                  value={stay.id}
                  onChange={(e) => setStay({ ...stay, id: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  required
                  placeholder="the-silo-hotel"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Stay Type</label>
                <input 
                  type="text" 
                  value={stay.type}
                  onChange={(e) => setStay({ ...stay, type: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  required
                  placeholder="Luxury Hotel, Eco Lodge, etc."
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Destination</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  value={stay.destination}
                  onChange={(e) => setStay({ ...stay, destination: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  required
                  placeholder="Cape Town"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Description</label>
              <textarea 
                rows={4}
                value={stay.description}
                onChange={(e) => setStay({ ...stay, description: e.target.value })}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                required
              />
            </div>
          </section>

          <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <ImageIcon className="w-4 h-4 text-blue-500" />
              Media
            </h2>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Hero Image URL</label>
              <input 
                type="url" 
                value={stay.image}
                onChange={(e) => setStay({ ...stay, image: e.target.value })}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="https://images.unsplash.com/..."
              />
            </div>
            {stay.image && (
              <div className="mt-4 aspect-video rounded-xl overflow-hidden border border-gray-100 italic">
                <img 
                  src={stay.image} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-8">
            <h2 className="text-lg font-semibold mb-4">Publishing</h2>
            <p className="text-sm text-gray-500 mb-6 font-serif italic">
              Create or update luxury retreats available in our curated collection.
            </p>
            <button 
              type="submit"
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Save Stay Changes
            </button>
          </section>
        </div>
      </form>
    </div>
  );
};

export default AdminStayDetailPage;
