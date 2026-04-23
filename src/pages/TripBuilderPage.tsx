import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { 
  Calendar, 
  MapPin, 
  Hotel, 
  Compass, 
  Car, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  Printer,
  ArrowRight,
  CreditCard,
  ChevronLeft,
  Clock,
  Phone,
  LayoutDashboard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Hardcoded Options & Prices
const TRANSPORT_OPTIONS = [
  { id: "car-rental", label: "Car Rental", price: 150 },
  { id: "airport-transfer", label: "Airport Transfer", price: 50 },
];

export function TripBuilderPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dbDestinations, setDbDestinations] = useState<any[]>([]);
  const [dbStays, setDbStays] = useState<any[]>([]);
  const [dbExperiences, setDbExperiences] = useState<any[]>([]);

  // Selections State
  const [step, setStep] = useState<"onboarding" | "builder" | "payment">("onboarding");
  const [selections, setSelections] = useState({
    travelerType: "Individual",
    destination: searchParams.get("destination") || "Cape Town",
    name: "",
    email: "",
    startDate: null as Date | null,
    endDate: null as Date | null,
    accommodation: searchParams.get("stay") || "",
    experiences: [] as string[],
    transport: [] as string[],
  });

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [destRes, staysRes, expRes] = await Promise.all([
          fetch("/api/public/destinations"),
          fetch("/api/public/stays"),
          fetch("/api/public/experiences")
        ]);

        if (destRes.ok) {
          const dests = await destRes.json();
          setDbDestinations(dests);
        }
        if (staysRes.ok) {
          const stays = await staysRes.json();
          setDbStays(stays);
        }
        if (expRes.ok) {
          const exps = await expRes.json();
          setDbExperiences(exps);
        }
      } catch (err) {
        console.warn("Failed to fetch builder data", err);
      }
    };
    fetchAllData();
  }, []);

  // Derived Data
  const destinationList = useMemo(() => dbDestinations, [dbDestinations]);
  
  const currentDestination = useMemo(() => {
    const dbDest = dbDestinations.find(d => d.name === selections.destination);
    const stays = dbStays
      .filter(s => s.destination === selections.destination)
      .map(s => ({ ...s, info: s.info || s.description }));
    const experiences = dbExperiences
      .filter(e => e.destination === selections.destination)
      .map(e => ({ text: e.name }));

    if (dbDest) {
      return {
        ...dbDest,
        stays: stays.length > 0 ? stays : (dbDest.stays || []),
        highlights: experiences.length > 0 
          ? experiences 
          : (dbDest.highlights?.map((h: any) => typeof h === 'string' ? { text: h } : h) || [])
      };
    }
    
    return { 
      name: selections.destination, 
      stays: stays, 
      highlights: experiences 
    };
  }, [selections.destination, dbDestinations, dbStays, dbExperiences]);

  const totalPrice = useMemo(() => {
    let total = 0;
    
    // Accommodation Price (Mocked)
    if (selections.accommodation) total += 450;
    
    // Experiences Price (Mocked)
    total += selections.experiences.length * 120;
    
    // Transport Price
    selections.transport.forEach(id => {
      const opt = TRANSPORT_OPTIONS.find(o => o.id === id);
      if (opt) total += opt.price;
    });

    return total;
  }, [selections]);

  // Handlers
  const toggleExperience = (id: string) => {
    setSelections(prev => {
      if (prev.experiences.includes(id)) {
        return { ...prev, experiences: prev.experiences.filter(e => e !== id) };
      }
      if (prev.experiences.length >= 3) return prev;
      return { ...prev, experiences: [...prev.experiences, id] };
    });
  };

  const toggleTransport = (id: string) => {
    setSelections(prev => ({
      ...prev,
      transport: prev.transport.includes(id) 
        ? prev.transport.filter(t => t !== id)
        : [...prev.transport, id]
    }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!selections.startDate || !selections.endDate) newErrors.dates = "Please select travel dates";
    if (selections.startDate && selections.endDate && selections.endDate < selections.startDate) {
      newErrors.dates = "Return date must be after departure";
    }
    if (!selections.accommodation) newErrors.accommodation = "Please select a stay";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOnboarding = (type: string) => {
    setSelections(prev => ({ ...prev, travelerType: type }));
    setStep("builder");
  };

  const handleEnquiry = async (status: "Enquiry" | "Urgent" | "Lead") => {
    if (!validate()) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selections,
          status: status === "Urgent" ? "Urgent Enquiry" : "New",
          travelerInfo: {
            name: selections.name || "Valued Traveler", 
            email: selections.email || "pending@contact.com",
            phone: "",
            travelerType: selections.travelerType,
            origin: "Trip Builder"
          }
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (status === "Urgent") {
          // Proceed to simulated payment
          setStep("payment");
        } else {
          if (result.leadId) {
            navigate(`/itinerary/${result.leadId}`);
          } else {
            setIsSuccess(true);
          }
        }
      } else {
        throw new Error("Failed to send enquiry");
      }
    } catch (error) {
      setErrors({ submit: "Failed to send enquiry. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const [paymentLoading, setPaymentLoading] = useState(false);
  const handlePayment = async () => {
    setPaymentLoading(true);
    // Simulate payment processing
    setTimeout(async () => {
      setIsSuccess(true);
      setPaymentLoading(false);
    }, 1500);
  };

  if (step === "onboarding") {
    return (
      <main className="min-h-screen bg-bg-warm flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl w-full text-center"
        >
          <div className="inline-block px-3 py-1 bg-accent-clay/10 text-accent-clay text-[10px] font-bold uppercase tracking-widest rounded mb-6">
            Step 1 / 3
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary-olive font-serif mb-4">Who's traveling?</h1>
          <p className="text-text-muted mb-12">Select your travel party type to help us personalize your safari.</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {["Individual", "Family", "Group", "Corporate"].map(type => (
              <button
                key={type}
                onClick={() => handleOnboarding(type)}
                className="group bg-white p-8 rounded-[32px] border border-primary-olive/10 hover:border-primary-olive hover:shadow-xl transition-all"
              >
                <div className="w-12 h-12 bg-bg-warm rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-olive group-hover:text-white transition-colors">
                  <Compass className="w-6 h-6" />
                </div>
                <p className="font-bold text-primary-olive">{type}</p>
              </button>
            ))}
          </div>
        </motion.div>
      </main>
    );
  }

  if (step === "payment") {
    return (
      <main className="min-h-screen bg-bg-warm pt-32 pb-20 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white border-primary-olive/10 p-10 rounded-[40px] shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-accent-clay" />
            <h2 className="text-3xl font-bold text-primary-olive font-serif mb-2">Secure Deposit</h2>
            <p className="text-text-muted mb-8 italic">Lock in your dates with a 20% commitment deposit.</p>
            
            <div className="space-y-6">
              <div className="bg-bg-warm p-6 rounded-2xl border border-primary-olive/5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-text-muted uppercase">Total Trip Estimate</span>
                  <span className="text-xl font-bold text-primary-olive font-serif">${totalPrice}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-primary-olive/10">
                  <span className="text-sm font-bold text-primary-olive uppercase">20% Deposit Due</span>
                  <span className="text-2xl font-bold text-accent-clay font-serif">${(totalPrice * 0.2).toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-4">
                 <div className="p-4 bg-bg-warm rounded-2xl border-2 border-primary-olive flex items-center gap-4">
                    <div className="p-2 bg-primary-olive rounded-lg">
                       <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-primary-olive">Credit / Debit Card</p>
                      <p className="text-[10px] text-text-muted">Encrypted & Secure</p>
                    </div>
                 </div>
                 
                 <div className="space-y-3">
                    <input type="text" placeholder="Card Number" className="w-full bg-bg-warm border border-primary-olive/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-olive/20" />
                    <div className="grid grid-cols-2 gap-3">
                       <input type="text" placeholder="MM/YY" className="w-full bg-bg-warm border border-primary-olive/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-olive/20" />
                       <input type="text" placeholder="CVV" className="w-full bg-bg-warm border border-primary-olive/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-olive/20" />
                    </div>
                 </div>
              </div>

              <Button 
                onClick={handlePayment}
                disabled={paymentLoading}
                className="w-full bg-primary-olive hover:bg-primary-olive/90 text-white rounded-full h-14 font-bold text-lg mt-4 shadow-xl shadow-primary-olive/20"
              >
                {paymentLoading ? "Processing Encryption..." : `Pay $${(totalPrice * 0.2).toFixed(2)}`}
              </Button>
              
              <div className="flex justify-center items-center gap-4 pt-4 opacity-50 grayscale">
                 <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" referrerPolicy="no-referrer" />
                 <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" referrerPolicy="no-referrer" />
              </div>
            </div>
          </Card>
        </div>
      </main>
    );
  }

  if (isSuccess) {
    return (
      <main className="min-h-screen bg-bg-warm pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white border-primary-olive/10 p-12 rounded-[32px] text-center shadow-xl">
            <div className="w-20 h-20 bg-primary-olive/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-primary-olive" />
            </div>
            <h1 className="text-4xl font-bold text-primary-olive font-serif mb-4">Enquiry Sent!</h1>
            <p className="text-text-muted mb-8 max-w-md mx-auto">
              Your custom itinerary for {selections.destination} has been generated and sent to our concierge team.
            </p>
            
            <div className="bg-bg-warm rounded-2xl p-8 text-left mb-8 border border-primary-olive/5">
              <h2 className="text-xl font-bold text-primary-olive font-serif mb-4 flex items-center">
                <Printer className="w-5 h-5 mr-2" /> Itinerary Preview
              </h2>
              <div className="space-y-3 text-sm">
                <p><strong>Destination:</strong> {selections.destination}</p>
                <p><strong>Dates:</strong> {selections.startDate?.toLocaleDateString()} - {selections.endDate?.toLocaleDateString()}</p>
                <p><strong>Stay:</strong> {selections.accommodation.replace(/-/g, ' ')}</p>
                <p><strong>Experiences:</strong> {selections.experiences.join(', ')}</p>
                <p><strong>Transport:</strong> {selections.transport.join(', ')}</p>
                <p className="pt-4 border-t border-primary-olive/10 text-lg font-bold">Total Estimated: ${totalPrice}</p>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Button onClick={() => window.print()} variant="outline" className="rounded-full border-primary-olive text-primary-olive font-bold px-8">
                Print PDF
              </Button>
              <Button asChild className="bg-primary-olive text-white rounded-full font-bold px-8">
                <Link to="/">Back to Home</Link>
              </Button>
            </div>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bg-warm pt-32 pb-20 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Builder Steps */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white p-8 rounded-[32px] border border-primary-olive/10 shadow-sm">
            <h2 className="text-2xl font-bold text-primary-olive font-serif mb-6 flex items-center">
              <MapPin className="w-6 h-6 mr-2 text-accent-clay" /> 1. Destination
            </h2>
            <select 
              value={selections.destination}
              onChange={(e) => setSelections({ ...selections, destination: e.target.value })}
              className="w-full bg-bg-warm border border-primary-olive/10 rounded-xl px-4 py-3 text-text-main focus:outline-none focus:ring-2 focus:ring-primary-olive/20"
            >
              {destinationList.map(d => (
                <option key={d.id} value={d.name}>{d.name}</option>
              ))}
            </select>
          </section>

          <section className="bg-white p-8 rounded-[32px] border border-primary-olive/10 shadow-sm">
            <h2 className="text-2xl font-bold text-primary-olive font-serif mb-6 flex items-center">
              <Calendar className="w-6 h-6 mr-2 text-accent-clay" /> 2. Travel Dates
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2">Departure</label>
                <DatePicker
                  selected={selections.startDate}
                  onChange={(date) => setSelections({ ...selections, startDate: date })}
                  selectsStart
                  startDate={selections.startDate}
                  endDate={selections.endDate}
                  placeholderText="Select date"
                  className="w-full bg-bg-warm border border-primary-olive/10 rounded-xl px-4 py-3"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2">Return</label>
                <DatePicker
                  selected={selections.endDate}
                  onChange={(date) => setSelections({ ...selections, endDate: date })}
                  selectsEnd
                  startDate={selections.startDate}
                  endDate={selections.endDate}
                  minDate={selections.startDate || undefined}
                  placeholderText="Select date"
                  className="w-full bg-bg-warm border border-primary-olive/10 rounded-xl px-4 py-3"
                />
              </div>
            </div>

            <div className="mt-8 space-y-4 pt-8 border-t border-primary-olive/5">
              <h3 className="text-sm font-bold text-primary-olive uppercase tracking-widest">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  value={selections.name}
                  onChange={(e) => setSelections({...selections, name: e.target.value})}
                  className="w-full bg-bg-warm border border-primary-olive/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-olive/20"
                />
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  value={selections.email}
                  onChange={(e) => setSelections({...selections, email: e.target.value})}
                  className="w-full bg-bg-warm border border-primary-olive/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-olive/20"
                />
              </div>
            </div>

            {errors.dates && <p className="text-accent-clay text-xs mt-2 flex items-center"><AlertCircle className="w-3 h-3 mr-1" /> {errors.dates}</p>}
          </section>

          <section className="bg-white p-8 rounded-[32px] border border-primary-olive/10 shadow-sm">
            <h2 className="text-2xl font-bold text-primary-olive font-serif mb-6 flex items-center">
              <Hotel className="w-6 h-6 mr-2 text-accent-clay" /> 3. Accommodation
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentDestination.stays.map(stay => (
                <button
                  key={stay.id}
                  onClick={() => setSelections({ ...selections, accommodation: stay.id })}
                  className={cn(
                    "p-4 rounded-2xl border-2 text-left transition-all",
                    selections.accommodation === stay.id 
                      ? "border-primary-olive bg-primary-olive/5" 
                      : "border-primary-olive/5 hover:border-primary-olive/20"
                  )}
                >
                  <p className="font-bold text-primary-olive">{stay.name}</p>
                  <p className="text-xs text-text-muted">{stay.info}</p>
                </button>
              ))}
            </div>
            {errors.accommodation && <p className="text-accent-clay text-xs mt-2 flex items-center"><AlertCircle className="w-3 h-3 mr-1" /> {errors.accommodation}</p>}
          </section>

          <section className="bg-white p-8 rounded-[32px] border border-primary-olive/10 shadow-sm">
            <h2 className="text-2xl font-bold text-primary-olive font-serif mb-6 flex items-center">
              <Compass className="w-6 h-6 mr-2 text-accent-clay" /> 4. Experiences (Max 3)
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {currentDestination.highlights.map(h => (
                <button
                  key={h.text}
                  onClick={() => toggleExperience(h.text)}
                  className={cn(
                    "p-3 rounded-xl border text-xs font-bold uppercase tracking-tighter transition-all",
                    selections.experiences.includes(h.text)
                      ? "bg-primary-olive text-white border-primary-olive"
                      : "bg-bg-warm text-text-muted border-primary-olive/10 hover:border-primary-olive/30"
                  )}
                >
                  {h.text}
                </button>
              ))}
            </div>
          </section>

          <section className="bg-white p-8 rounded-[32px] border border-primary-olive/10 shadow-sm">
            <h2 className="text-2xl font-bold text-primary-olive font-serif mb-6 flex items-center">
              <Car className="w-6 h-6 mr-2 text-accent-clay" /> 5. Transport
            </h2>
            <div className="flex flex-wrap gap-4">
              {TRANSPORT_OPTIONS.map(opt => (
                <label key={opt.id} className="flex items-center space-x-2 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={selections.transport.includes(opt.id)}
                    onChange={() => toggleTransport(opt.id)}
                    className="w-5 h-5 rounded border-primary-olive/20 text-primary-olive focus:ring-primary-olive"
                  />
                  <span className="text-sm font-medium text-text-main group-hover:text-primary-olive transition-colors">
                    {opt.label} (+${opt.price})
                  </span>
                </label>
              ))}
            </div>
          </section>
        </div>

        {/* Summary Panel */}
        <div className="lg:col-span-1">
          <div className="sticky top-32 space-y-6">
            <Card className="bg-primary-olive text-white p-8 rounded-[32px] shadow-2xl border-none overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
              
              <h3 className="text-2xl font-bold font-serif mb-6">Trip Summary</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm border-b border-white/10 pb-2">
                  <span className="opacity-70">Destination</span>
                  <span className="font-bold">{selections.destination}</span>
                </div>
                <div className="flex justify-between text-sm border-b border-white/10 pb-2">
                  <span className="opacity-70">Accommodation</span>
                  <span className="font-bold truncate max-w-[150px]">
                    {selections.accommodation ? selections.accommodation.replace(/-/g, ' ') : "Not selected"}
                  </span>
                </div>
                <div className="flex justify-between text-sm border-b border-white/10 pb-2">
                  <span className="opacity-70">Experiences</span>
                  <span className="font-bold">{selections.experiences.length} selected</span>
                </div>
                <div className="pt-4 flex justify-between items-end">
                  <span className="text-sm opacity-70">Estimated Total</span>
                  <span className="text-4xl font-bold font-serif">${totalPrice}</span>
                </div>
              </div>

              <div className="space-y-3">
                <Button 
                  onClick={() => handleEnquiry("Enquiry")}
                  disabled={isSubmitting}
                  className="w-full bg-white text-primary-olive hover:bg-white/90 rounded-full h-12 font-bold"
                >
                  {isSubmitting ? "Processing..." : "Enquire Now"}
                </Button>
                <Button 
                  onClick={() => handleEnquiry("Urgent")}
                  disabled={isSubmitting}
                  variant="outline" 
                  className="w-full border-white/20 text-white hover:bg-white/10 rounded-full h-12 font-bold"
                >
                  Request Booking
                </Button>
              </div>

              {errors.submit && (
                <p className="text-accent-clay text-xs mt-4 text-center font-bold">{errors.submit}</p>
              )}
            </Card>

            <div className="bg-accent-clay/10 p-6 rounded-2xl border border-accent-clay/20">
              <p className="text-xs text-accent-clay font-bold flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" /> PRO TIP
              </p>
              <p className="text-sm text-text-main mt-2">
                Our local experts can help you refine this itinerary. Enquire now to start the conversation!
              </p>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
