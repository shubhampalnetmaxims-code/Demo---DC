import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { User, Users, Home, Building2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const TRAVELER_TYPES = [
  { id: "individual", label: "Individual", icon: User },
  { id: "family", label: "Family", icon: Home },
  { id: "group", label: "Group", icon: Users },
  { id: "corporate", label: "Corporate", icon: Building2 },
];

export function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    travelerType: "",
    name: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.travelerType) newErrors.travelerType = "Please select a traveler type";
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          navigate("/trip-builder");
        }, 2000);
      } else {
        throw new Error("Failed to save lead");
      }
    } catch (error) {
      setErrors({ submit: "Something went wrong. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValid = formData.travelerType && formData.name && formData.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);

  return (
    <main className="min-h-screen bg-bg-warm pt-32 pb-20 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="bg-white border-primary-olive/10 p-8 md:p-12 rounded-[32px] shadow-xl overflow-hidden relative">
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 bg-primary-olive/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-primary-olive" />
                </div>
                <h2 className="text-3xl font-bold text-primary-olive font-serif mb-2">Saved!</h2>
                <p className="text-text-muted">Continuing to your trip builder...</p>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="text-center mb-10">
                  <h1 className="text-4xl font-bold text-primary-olive font-serif mb-4">
                    Welcome Traveler
                  </h1>
                  <p className="text-text-muted">Tell us a bit about your journey to get started.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Traveler Type Selection */}
                  <div>
                    <label className="block text-sm font-bold text-primary-olive uppercase tracking-widest mb-4">
                      Who are you traveling with?
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {TRAVELER_TYPES.map((type) => {
                        const Icon = type.icon;
                        const isSelected = formData.travelerType === type.id;
                        return (
                          <button
                            key={type.id}
                            type="button"
                            onClick={() => setFormData({ ...formData, travelerType: type.id })}
                            className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                              isSelected
                                ? "border-primary-olive bg-primary-olive/5 text-primary-olive"
                                : "border-primary-olive/5 bg-bg-warm text-text-muted hover:border-primary-olive/20"
                            }`}
                          >
                            <Icon className={`w-6 h-6 mb-2 ${isSelected ? "text-primary-olive" : "text-text-muted"}`} />
                            <span className="text-xs font-bold uppercase tracking-tighter">{type.label}</span>
                          </button>
                        );
                      })}
                    </div>
                    {errors.travelerType && (
                      <p className="text-accent-clay text-xs mt-2 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" /> {errors.travelerType}
                      </p>
                    )}
                  </div>

                  {/* Personal Info */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-primary-olive uppercase tracking-widest mb-2">Full Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full bg-bg-warm border border-primary-olive/10 rounded-xl px-4 py-3 text-text-main focus:outline-none focus:ring-2 focus:ring-primary-olive/20 transition-all"
                      />
                      {errors.name && <p className="text-accent-clay text-xs mt-1">{errors.name}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-primary-olive uppercase tracking-widest mb-2">Email Address</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="john@example.com"
                          className="w-full bg-bg-warm border border-primary-olive/10 rounded-xl px-4 py-3 text-text-main focus:outline-none focus:ring-2 focus:ring-primary-olive/20 transition-all"
                        />
                        {errors.email && <p className="text-accent-clay text-xs mt-1">{errors.email}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-primary-olive uppercase tracking-widest mb-2">Phone (Optional)</label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+27 123 456 789"
                          className="w-full bg-bg-warm border border-primary-olive/10 rounded-xl px-4 py-3 text-text-main focus:outline-none focus:ring-2 focus:ring-primary-olive/20 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {errors.submit && (
                    <div className="p-4 bg-accent-clay/10 border border-accent-clay/20 rounded-xl text-accent-clay text-sm flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" /> {errors.submit}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isSubmitting || !isValid}
                    className="w-full bg-primary-olive hover:bg-primary-olive/90 text-white rounded-full h-14 text-lg font-bold shadow-lg shadow-primary-olive/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {isSubmitting ? "Saving..." : "Continue to Trip Builder"}
                  </Button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </div>
    </main>
  );
}
