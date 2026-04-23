import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  MessageSquare, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Send,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { destinations } from "@/lib/data";
import { cn } from "@/lib/utils";

const WHATSAPP_NUMBER = "27123456789"; // Example South African number
const WHATSAPP_MESSAGE = "Hi Safari & City Discovery, I'd like to chat about planning a trip!";

export function ConciergePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    destination: "Cape Town",
    budget: 5000,
    message: ""
  });

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
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
        body: JSON.stringify({
          ...formData,
          travelerType: "Individual",
          status: "New",
          origin: "Website Concierge",
          timestamp: new Date()
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
      }
    } catch (error) {
      setErrors({ submit: "Failed to send message. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const logWhatsAppClick = async () => {
    try {
      await fetch("/api/whatsapp-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: "unknown"
        }),
      });
    } catch (e) {
      // Silent fail
    }
  };

  return (
    <main className="min-h-screen bg-bg-warm pt-32 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold text-primary-olive font-serif mb-6"
          >
            Personal Concierge
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-text-muted max-w-2xl mx-auto text-lg"
          >
            Our dedicated travel experts are here to craft your perfect Southern African escape.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Contact Info & WhatsApp */}
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 bg-white border-primary-olive/10 rounded-3xl shadow-sm">
                <Clock className="w-6 h-6 text-accent-clay mb-4" />
                <h3 className="font-bold text-primary-olive font-serif mb-2">Response Time</h3>
                <p className="text-sm text-text-muted">We typically reply within 24 hours.</p>
              </Card>
              <Card className="p-6 bg-white border-primary-olive/10 rounded-3xl shadow-sm">
                <MessageSquare className="w-6 h-6 text-accent-clay mb-4" />
                <h3 className="font-bold text-primary-olive font-serif mb-2">Expert Advice</h3>
                <p className="text-sm text-text-muted">Local insights from certified guides.</p>
              </Card>
            </div>

            <div className="bg-primary-olive text-white p-8 rounded-[32px] shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
              <h2 className="text-3xl font-bold font-serif mb-4">Instant Chat</h2>
              <p className="opacity-80 mb-8">
                Prefer a quicker conversation? Chat with us directly on WhatsApp for immediate assistance.
              </p>
              <Button 
                asChild
                onClick={logWhatsAppClick}
                className="w-full bg-white text-primary-olive hover:bg-white/90 rounded-full h-14 font-bold text-lg"
              >
                <a 
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center"
                >
                  Chat on WhatsApp <ExternalLink className="w-5 h-5 ml-2" />
                </a>
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center p-4 bg-white rounded-2xl border border-primary-olive/5">
                <Phone className="w-5 h-5 text-primary-olive mr-4" />
                <div>
                  <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest">Call Us</p>
                  <p className="text-text-main font-bold">+27 12 345 6789</p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-white rounded-2xl border border-primary-olive/5">
                <Mail className="w-5 h-5 text-primary-olive mr-4" />
                <div>
                  <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest">Email Us</p>
                  <p className="text-text-main font-bold">concierge@vaya-discovery.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <Card className="bg-white border-primary-olive/10 p-8 md:p-10 rounded-[32px] shadow-xl">
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
                  <h2 className="text-3xl font-bold text-primary-olive font-serif mb-2">Message Sent</h2>
                  <p className="text-text-muted">We'll reply in 24h. Thank you for reaching out!</p>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsSuccess(false)}
                    className="mt-8 rounded-full border-primary-olive text-primary-olive font-bold"
                  >
                    Send Another Message
                  </Button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-primary-olive uppercase tracking-widest mb-2">Name *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={cn(
                          "w-full bg-bg-warm border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-olive/20",
                          errors.name ? "border-accent-clay" : "border-primary-olive/10"
                        )}
                        placeholder="Your Name"
                      />
                      {errors.name && <p className="text-accent-clay text-[10px] mt-1 font-bold">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-primary-olive uppercase tracking-widest mb-2">Email *</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={cn(
                          "w-full bg-bg-warm border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-olive/20",
                          errors.email ? "border-accent-clay" : "border-primary-olive/10"
                        )}
                        placeholder="email@example.com"
                      />
                      {errors.email && <p className="text-accent-clay text-[10px] mt-1 font-bold">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-primary-olive uppercase tracking-widest mb-2">Phone</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-bg-warm border border-primary-olive/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-olive/20"
                        placeholder="+27..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-primary-olive uppercase tracking-widest mb-2">Destination</label>
                      <select
                        value={formData.destination}
                        onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                        className="w-full bg-bg-warm border border-primary-olive/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-olive/20"
                      >
                        {Object.values(destinations).map(d => (
                          <option key={d.id} value={d.name}>{d.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="block text-xs font-bold text-primary-olive uppercase tracking-widest">Budget (USD)</label>
                      <span className="text-sm font-bold text-primary-olive">${formData.budget}</span>
                    </div>
                    <input
                      type="range"
                      min="1000"
                      max="20000"
                      step="500"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: parseInt(e.target.value) })}
                      className="w-full h-2 bg-bg-warm rounded-lg appearance-none cursor-pointer accent-primary-olive"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-primary-olive uppercase tracking-widest mb-2">Your Message</label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-bg-warm border border-primary-olive/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-olive/20 resize-none"
                      placeholder="Tell us about your dream trip..."
                    />
                  </div>

                  {errors.submit && (
                    <div className="p-4 bg-accent-clay/10 border border-accent-clay/20 rounded-xl text-accent-clay text-xs flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" /> {errors.submit}
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-primary-olive hover:bg-primary-olive/90 text-white rounded-full h-14 font-bold text-lg shadow-lg shadow-primary-olive/20"
                  >
                    {isSubmitting ? "Sending..." : "Submit Inquiry"} <Send className="w-4 h-4 ml-2" />
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </Card>
        </div>
      </div>
    </main>
  );
}
