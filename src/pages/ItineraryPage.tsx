import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { 
  Printer, 
  MapPin, 
  Calendar, 
  Hotel, 
  Compass, 
  Car, 
  ArrowLeft,
  Download,
  Mail,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ItineraryData {
  travelerType: string;
  name: string;
  email: string;
  selections: {
    destination: string;
    startDate: string;
    endDate: string;
    accommodation: string;
    experiences: string[];
    transport: string[];
  };
  status: string;
  timestamp: string;
  itinerary: {
    generatedAt: string;
    summary: string;
    details: any;
  };
}

export function ItineraryPage() {
  const { leadId } = useParams();
  const [data, setData] = useState<ItineraryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        const response = await fetch(`/api/itinerary/${leadId}`);
        if (!response.ok) throw new Error("Itinerary not found");
        const json = await response.json();
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load itinerary");
        console.error("Admin Alert: Itinerary fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    if (leadId) fetchItinerary();
  }, [leadId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-warm flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-olive"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-bg-warm flex flex-col items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md rounded-[32px] border-primary-olive/10">
          <h1 className="text-2xl font-bold text-primary-olive font-serif mb-4">Oops!</h1>
          <p className="text-text-muted mb-6">{error || "We couldn't find that itinerary."}</p>
          <Button asChild className="bg-primary-olive text-white rounded-full px-8">
            <Link to="/">Return Home</Link>
          </Button>
        </Card>
      </div>
    );
  }

  const { selections } = data;
  const startDate = new Date(selections.startDate).toLocaleDateString();
  const endDate = new Date(selections.endDate).toLocaleDateString();

  return (
    <main className="min-h-screen bg-bg-warm pt-32 pb-20 px-4 print:pt-0 print:pb-0 print:bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Controls - Hidden on Print */}
        <div className="flex justify-between items-center mb-8 print:hidden">
          <Button variant="ghost" asChild className="text-text-muted hover:text-primary-olive">
            <Link to="/trip-builder"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Builder</Link>
          </Button>
          <div className="flex gap-3">
            <Button onClick={handlePrint} variant="outline" className="rounded-full border-primary-olive text-primary-olive font-bold">
              <Printer className="w-4 h-4 mr-2" /> Print Itinerary
            </Button>
          </div>
        </div>

        {/* Itinerary Card */}
        <Card className="bg-white border-primary-olive/10 rounded-[40px] shadow-2xl overflow-hidden print:shadow-none print:border-none print:rounded-none">
          {/* Header */}
          <div className="bg-primary-olive p-12 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32" />
            <div className="relative z-10">
              <p className="text-xs font-bold uppercase tracking-[0.2em] mb-4 opacity-80">Custom Travel Proposal</p>
              <h1 className="text-5xl md:text-6xl font-bold font-serif mb-6">{selections.destination}</h1>
              <div className="flex flex-wrap gap-6 text-sm font-medium">
                <div className="flex items-center"><Calendar className="w-4 h-4 mr-2 opacity-70" /> {startDate} — {endDate}</div>
                <div className="flex items-center"><MapPin className="w-4 h-4 mr-2 opacity-70" /> Southern Africa</div>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-12 space-y-12">
            {/* Traveler Info */}
            <div className="flex justify-between items-start border-b border-primary-olive/5 pb-8">
              <div>
                <h3 className="text-[10px] text-text-muted uppercase font-bold tracking-widest mb-1">Prepared For</h3>
                <p className="text-xl font-bold text-text-main">{data.name}</p>
                <p className="text-sm text-text-muted">{data.email}</p>
              </div>
              <div className="text-right">
                <h3 className="text-[10px] text-text-muted uppercase font-bold tracking-widest mb-1">Reference</h3>
                <p className="text-sm font-mono text-primary-olive font-bold">#{leadId?.slice(-6).toUpperCase()}</p>
              </div>
            </div>

            {/* Itinerary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <section>
                  <h3 className="text-xs font-bold text-primary-olive uppercase tracking-widest mb-4 flex items-center">
                    <Hotel className="w-4 h-4 mr-2 text-accent-clay" /> Accommodation
                  </h3>
                  <div className="p-6 bg-bg-warm rounded-3xl border border-primary-olive/5">
                    <p className="font-bold text-text-main text-lg">{selections.accommodation.replace(/-/g, ' ')}</p>
                    <p className="text-sm text-text-muted mt-1 italic">Premier Luxury Suite</p>
                  </div>
                </section>

                <section>
                  <h3 className="text-xs font-bold text-primary-olive uppercase tracking-widest mb-4 flex items-center">
                    <Car className="w-4 h-4 mr-2 text-accent-clay" /> Transport & Logistics
                  </h3>
                  <div className="space-y-3">
                    {selections.transport.length > 0 ? selections.transport.map(t => (
                      <div key={t} className="flex items-center text-sm text-text-main font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent-clay mr-3" />
                        {t.replace(/-/g, ' ')}
                      </div>
                    )) : <p className="text-sm text-text-muted italic">No transport selected</p>}
                  </div>
                </section>
              </div>

              <div className="space-y-8">
                <section>
                  <h3 className="text-xs font-bold text-primary-olive uppercase tracking-widest mb-4 flex items-center">
                    <Compass className="w-4 h-4 mr-2 text-accent-clay" /> Curated Experiences
                  </h3>
                  <div className="space-y-4">
                    {selections.experiences.map(exp => (
                      <div key={exp} className="p-4 bg-white border border-primary-olive/10 rounded-2xl flex items-center">
                        <CheckCircle2 className="w-4 h-4 text-primary-olive mr-3" />
                        <span className="text-sm font-bold text-text-main">{exp}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>

            {/* Footer / Summary */}
            <div className="pt-12 border-t border-primary-olive/10 flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="text-center md:text-left">
                <p className="text-sm text-text-muted max-w-xs">
                  This is a preliminary itinerary. Our concierge will contact you to finalize details and confirm availability.
                </p>
              </div>
              <div className="bg-bg-warm px-10 py-6 rounded-3xl border border-primary-olive/10 text-center">
                <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest mb-1">Estimated Total</p>
                <p className="text-4xl font-bold text-primary-olive font-serif">$4,850</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Post-Itinerary Actions */}
        <div className="mt-12 flex flex-col items-center gap-6 print:hidden">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-accent-clay/10 flex items-center justify-center">
              <Mail className="w-6 h-6 text-accent-clay" />
            </div>
            <p className="text-sm text-text-muted font-medium">A copy of this itinerary has been sent to your email.</p>
          </div>
          <div className="flex gap-4">
            <Button asChild className="bg-primary-olive hover:bg-primary-olive/90 text-white rounded-full px-12 h-14 font-bold text-lg shadow-xl shadow-primary-olive/20">
              <Link to={`/payments?total=4850&leadId=${leadId}`}>Pay Deposit</Link>
            </Button>
            <Button asChild variant="outline" className="border-primary-olive text-primary-olive rounded-full px-12 h-14 font-bold text-lg">
              <Link to="/concierge">Finalize with Concierge</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
