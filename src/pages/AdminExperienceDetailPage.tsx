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
  Sparkles,
  DollarSign,
  Type
} from "lucide-react";

interface Experience {
  _id?: string;
  id: string;
  name: string;
  destination: string;
  price: number;
}

const AdminExperienceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [experience, setExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id && id !== 'new') {
      fetchExperience();
    } else {
      setExperience({
        id: "",
        name: "",
        destination: "",
        price: 0
      });
      setLoading(false);
    }
  }, [id]);

  const fetchExperience = async () => {
    try {
      const response = await fetch("/api/content/experiences");
      if (!response.ok) throw new Error("Failed to fetch experiences");
      const data: Experience[] = await response.json();
      const found = data.find(e => e._id === id || e.id === id);
      if (!found) throw new Error("Experience not found");
      setExperience(found);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!experience) return;
    setSaving(true);
    try {
      const url = id === 'new' ? "/api/content/experiences" : `/api/content/experiences/${id}`;
      const method = id === 'new' ? "POST" : "PUT";
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(experience)
      });

      if (!response.ok) throw new Error("Failed to save experience");
      
      navigate("/admin/content?tab=experiences");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id || id === 'new') return;
    if (!window.confirm("Are you sure you want to delete this experience?")) return;
    
    try {
      const response = await fetch(`/api/content/experiences/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete");
      navigate("/admin/content?tab=experiences");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
    </div>
  );

  if (!experience) return <div>Not found</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate("/admin/content?tab=experiences")}
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
            Delete Experience
          </button>
        )}
      </div>

      <header>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          {id === 'new' ? "Add New Experience" : "Edit Experience"}
        </h1>
        <p className="text-gray-500 mt-1">Configure individual trip activities and pricing</p>
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
              <Sparkles className="w-4 h-4 text-orange-500" />
              Activity Details
            </h2>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Experience Name</label>
              <input 
                type="text" 
                value={experience.name}
                onChange={(e) => setExperience({ ...experience, name: e.target.value })}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                required
                placeholder="e.g. Helicopter Flight over the Falls"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Internal ID</label>
                <input 
                  type="text" 
                  value={experience.id}
                  onChange={(e) => setExperience({ ...experience, id: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  required
                  placeholder="helicopter-flight"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Price (USD)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="number" 
                    value={experience.price}
                    onChange={(e) => setExperience({ ...experience, price: parseFloat(e.target.value) })}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Destination</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  value={experience.destination}
                  onChange={(e) => setExperience({ ...experience, destination: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  required
                  placeholder="Cape Town"
                />
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-8">
            <h2 className="text-lg font-semibold mb-4">Operations</h2>
            <p className="text-sm text-gray-500 mb-6 font-serif italic">
              These activities are used as options in the custom trip builder for clients.
            </p>
            <button 
              type="submit"
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Save Activity
            </button>
          </section>
        </div>
      </form>
    </div>
  );
};

export default AdminExperienceDetailPage;
