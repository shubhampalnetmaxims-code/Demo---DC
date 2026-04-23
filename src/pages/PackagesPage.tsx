import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  X,
  Info,
  Tag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function PackagesPage() {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch("/api/public/packages");
        if (response.ok) {
          const data = await response.json();
          setPackages(data.map((p: any) => ({
            ...p,
            id: p.id || p._id,
            name: p.name || p.title,
            highlights: p.highlights || ["Luxury Accommodation", "Private Guided Tours", "All Transfers Included"]
          })));
        }
      } catch (err) {
        console.error("Failed to fetch packages:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  const handleEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !selectedPackage) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          travelerType: "individual",
          packageId: selectedPackage.id,
          status: "Package Enquiry",
          notes: `Enquiry for ${selectedPackage.name} in ${selectedPackage.destination}`
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          setSelectedPackage(null);
          setFormData({ name: "", email: "" });
        }, 3000);
      }
    } catch (error) {
      console.error("Enquiry failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-bg-warm pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold text-primary-olive font-serif mb-6"
          >
            Curated Offers
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-text-muted max-w-2xl mx-auto text-lg"
          >
            Hand-picked journeys designed by our local experts to showcase the very best of Southern Africa.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="group bg-white border-primary-olive/10 rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 h-full flex flex-col">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={pkg.image} 
                    alt={pkg.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white/90 backdrop-blur-sm text-primary-olive border-none font-bold px-3 py-1 rounded-full shadow-sm">
                      {pkg.destination}
                    </Badge>
                  </div>
                  {pkg.soldOut && (
                    <div className="absolute inset-0 bg-bg-warm/80 backdrop-blur-[2px] flex items-center justify-center">
                      <Badge variant="destructive" className="bg-accent-clay text-white border-none px-6 py-2 text-sm font-bold rounded-full rotate-[-5deg] shadow-lg">
                        SOLD OUT
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="p-8 flex-grow flex flex-col">
                  <h3 className="text-2xl font-bold text-primary-olive font-serif mb-3 group-hover:text-accent-clay transition-colors">
                    {pkg.name}
                  </h3>
                  <p className="text-text-muted text-sm mb-6 line-clamp-2">
                    {pkg.description}
                  </p>

                  <ul className="space-y-2 mb-8 flex-grow">
                    {pkg.highlights.map((h, i) => (
                      <li key={i} className="flex items-center text-xs text-text-main font-medium">
                        <CheckCircle2 className="w-3 h-3 mr-2 text-primary-olive/40" />
                        {h}
                      </li>
                    ))}
                  </ul>

                  <div className="pt-6 border-t border-primary-olive/5 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold">Base Price</p>
                      <p className="text-2xl font-bold text-primary-olive font-serif">${pkg.price}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        disabled={pkg.soldOut}
                        onClick={() => setSelectedPackage(pkg)}
                        className="rounded-full border-primary-olive/20 text-primary-olive hover:bg-primary-olive hover:text-white font-bold"
                      >
                        Enquire
                      </Button>
                      <Button 
                        asChild 
                        size="sm"
                        disabled={pkg.soldOut}
                        className={cn(
                          "rounded-full bg-primary-olive text-white font-bold px-4",
                          pkg.soldOut && "opacity-50 pointer-events-none"
                        )}
                      >
                        <Link to={`/trip-builder?destination=${pkg.destination}&package=${pkg.id}`}>
                          Select <ArrowRight className="w-3 h-3 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Enquiry Modal */}
      <AnimatePresence>
        {selectedPackage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPackage(null)}
              className="absolute inset-0 bg-primary-olive/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden"
            >
              <button 
                onClick={() => setSelectedPackage(null)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-bg-warm transition-colors z-10"
              >
                <X className="w-5 h-5 text-text-muted" />
              </button>

              {isSuccess ? (
                <div className="p-12 text-center">
                  <div className="w-20 h-20 bg-primary-olive/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-primary-olive" />
                  </div>
                  <h2 className="text-3xl font-bold text-primary-olive font-serif mb-2">Thank You!</h2>
                  <p className="text-text-muted">Our experts will contact you shortly with a custom itinerary.</p>
                </div>
              ) : (
                <div className="p-10">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 rounded-xl bg-accent-clay/10 flex items-center justify-center mr-4">
                      <Tag className="w-6 h-6 text-accent-clay" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-primary-olive font-serif">Quick Enquiry</h2>
                      <p className="text-xs text-text-muted font-bold uppercase tracking-widest">{selectedPackage.name}</p>
                    </div>
                  </div>

                  <form onSubmit={handleEnquiry} className="space-y-6">
                    <div>
                      <label className="block text-xs font-bold text-primary-olive uppercase tracking-widest mb-2">Your Name</label>
                      <input
                        required
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full bg-bg-warm border border-primary-olive/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-olive/20"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-primary-olive uppercase tracking-widest mb-2">Email Address</label>
                      <input
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        className="w-full bg-bg-warm border border-primary-olive/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-olive/20"
                      />
                    </div>

                    <div className="bg-bg-warm p-4 rounded-xl border border-primary-olive/5 flex items-start">
                      <Info className="w-4 h-4 text-primary-olive mr-3 mt-0.5" />
                      <p className="text-[10px] text-text-muted leading-relaxed">
                        By submitting, you agree to receive a custom itinerary and occasional travel inspiration from Safari & City Discovery.
                      </p>
                    </div>

                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-primary-olive hover:bg-primary-olive/90 text-white rounded-full h-14 font-bold text-lg shadow-lg shadow-primary-olive/20"
                    >
                      {isSubmitting ? "Sending..." : "Send Enquiry"}
                    </Button>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
