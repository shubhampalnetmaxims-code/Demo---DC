import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Clock, 
  Send, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  CreditCard,
  User,
  MessageSquare,
  History,
  Save
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Note {
  _id: string;
  content: string;
  author: string;
  timestamp: string;
}

interface Booking {
  _id: string;
  finalPrice: number;
  depositAmount: number;
  paymentStatus: string;
  createdAt: string;
}

interface Lead {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  travelerType: string;
  destination: string;
  budget?: number;
  status: string;
  timestamp: string;
  selections?: any;
  notes: Note[];
  booking?: Booking;
}

const STATUS_STEPS = ["New", "Contacted", "Quoted", "Won"];

export function AdminLeadDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newNote, setNewNote] = useState("");
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    finalPrice: "",
    depositAmount: ""
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const fetchLeadDetails = async () => {
    try {
      const response = await fetch(`/api/admin/leads/${id}`);
      if (!response.ok) throw new Error("Could not load lead details.");
      const data = await response.json();
      setLead(data);
      if (data.booking) {
        setBookingForm({
          finalPrice: data.booking.finalPrice.toString(),
          depositAmount: data.booking.depositAmount.toString()
        });
      } else if (data.budget) {
        setBookingForm({
          finalPrice: data.budget.toString(),
          depositAmount: (data.budget * 0.2).toString()
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load lead details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeadDetails();
  }, [id]);

  const handleUpdateStatus = async (newStatus: string) => {
    setIsUpdatingStatus(true);
    try {
      const response = await fetch(`/api/admin/leads/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        setLead(prev => prev ? { ...prev, status: newStatus } : null);
        fetchLeadDetails(); // Reload to get the auto-generated note in the timeline
      }
    } catch (err) {
      console.error("Failed to update status", err);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setIsSubmittingNote(true);
    try {
      const response = await fetch("/api/admin/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId: id, content: newNote, author: "Admin" }),
      });
      if (response.ok) {
        setNewNote("");
        fetchLeadDetails();
      }
    } catch (err) {
      console.error("Failed to add note", err);
    } finally {
      setIsSubmittingNote(false);
    }
  };

  const handleSendQuote = async () => {
    if (!lead) return;
    try {
      const response = await fetch("/api/itinerary/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId: id, email: lead.email }),
      });
      if (response.ok) {
        handleUpdateStatus("Quoted");
        alert("Quote and Itinerary sent successfully!");
      }
    } catch (err) {
      console.error("Failed to send quote", err);
    }
  };

  const handleConvertBooking = async () => {
    const errors: Record<string, string> = {};
    if (!bookingForm.finalPrice) errors.finalPrice = "Final price is required";
    if (!bookingForm.depositAmount) errors.depositAmount = "Deposit amount is required";
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const response = await fetch("/api/admin/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId: id,
          finalPrice: parseFloat(bookingForm.finalPrice),
          depositAmount: parseFloat(bookingForm.depositAmount),
          itinerary: lead?.selections
        }),
      });
      if (response.ok) {
        fetchLeadDetails();
        alert("Lead converted to booking successfully!");
      }
    } catch (err) {
      console.error("Failed to convert booking", err);
    }
  };

  const handleMarkPaid = async () => {
    if (!lead?.booking) return;
    try {
      const response = await fetch(`/api/admin/bookings/${lead.booking._id}/pay`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Paid" }),
      });
      if (response.ok) {
        fetchLeadDetails();
        alert("Booking marked as paid!");
      }
    } catch (err) {
      console.error("Failed to mark as paid", err);
    }
  };

  if (loading) return <div className="pt-32 text-center text-text-muted">Loading lead details...</div>;
  if (error || !lead) return <div className="pt-32 text-center text-accent-clay">{error || "Lead not found."}</div>;

  return (
    <main className="min-h-screen pt-12 pb-20 px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild className="rounded-full hover:bg-primary-olive/10 text-primary-olive">
              <Link to="/admin/leads"><ArrowLeft className="w-5 h-5" /></Link>
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-primary-olive font-serif">{lead.name}</h1>
              <p className="text-text-muted">#{lead._id.slice(-6).toUpperCase()} • {lead.travelerType} traveler</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={handleSendQuote}
              className="bg-white border border-primary-olive text-primary-olive hover:bg-primary-olive/5 rounded-full px-6 font-bold"
            >
              <Send className="w-4 h-4 mr-2" /> Send Quote
            </Button>
            {!lead.booking ? (
              <Button 
                onClick={handleConvertBooking}
                className="bg-primary-olive text-white hover:bg-primary-olive/90 rounded-full px-6 font-bold shadow-lg shadow-primary-olive/20"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" /> Convert to Booking
              </Button>
            ) : (
              <Button 
                onClick={handleMarkPaid}
                disabled={lead.booking.paymentStatus === "Paid"}
                className="bg-accent-clay text-white hover:bg-accent-clay/90 rounded-full px-6 font-bold shadow-lg shadow-accent-clay/20"
              >
                <CreditCard className="w-4 h-4 mr-2" /> {lead.booking.paymentStatus === "Paid" ? "Paid" : "Mark as Paid"}
              </Button>
            )}
          </div>
        </div>

        {/* Status Pipeline */}
        <div className="grid grid-cols-4 gap-4 mb-12">
          {STATUS_STEPS.map((step, index) => {
            const isActive = lead.status === step;
            const isCompleted = STATUS_STEPS.indexOf(lead.status) >= index;
            return (
              <div 
                key={step}
                onClick={() => handleUpdateStatus(step)}
                className={cn(
                  "relative p-4 rounded-2xl border-2 transition-all cursor-pointer text-center",
                  isActive ? "border-primary-olive bg-primary-olive/5" : 
                  isCompleted ? "border-primary-olive/40 bg-white" : "border-primary-olive/5 bg-white opacity-50"
                )}
              >
                <p className={cn(
                  "text-[10px] uppercase font-bold tracking-widest mb-1",
                  isCompleted ? "text-primary-olive" : "text-text-muted"
                )}>Step {index + 1}</p>
                <p className={cn(
                  "font-bold font-serif",
                  isCompleted ? "text-primary-olive" : "text-text-muted"
                )}>{step}</p>
                {isCompleted && !isActive && (
                  <CheckCircle2 className="absolute top-2 right-2 w-3 h-3 text-primary-olive" />
                )}
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Details */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="bg-white border-primary-olive/10 p-8 rounded-[32px] shadow-sm">
              <h2 className="text-xl font-bold text-primary-olive font-serif mb-6 flex items-center">
                <User className="w-5 h-5 mr-3 text-accent-clay" /> Traveler Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center text-sm">
                    <Mail className="w-4 h-4 mr-3 text-text-muted" />
                    <span className="text-text-muted w-20">Email:</span>
                    <span className="font-bold text-text-main">{lead.email}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Phone className="w-4 h-4 mr-3 text-text-muted" />
                    <span className="text-text-muted w-20">Phone:</span>
                    <span className="font-bold text-text-main">{lead.phone || "Not provided"}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <History className="w-4 h-4 mr-3 text-text-muted" />
                    <span className="text-text-muted w-20">Created:</span>
                    <span className="font-bold text-text-main">{new Date(lead.timestamp).toLocaleString()}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center text-sm">
                    <MapPin className="w-4 h-4 mr-3 text-text-muted" />
                    <span className="text-text-muted w-20">Destination:</span>
                    <Badge className="bg-bg-warm border-primary-olive/10 text-primary-olive font-bold">
                      {lead.destination}
                    </Badge>
                  </div>
                  <div className="flex items-center text-sm">
                    <DollarSign className="w-4 h-4 mr-3 text-text-muted" />
                    <span className="text-text-muted w-20">Budget:</span>
                    <span className="font-bold text-text-main">${lead.budget?.toLocaleString() || "N/A"}</span>
                  </div>
                </div>
              </div>
            </Card>

            {lead.selections && (
              <Card className="bg-white border-primary-olive/10 p-8 rounded-[32px] shadow-sm">
                <h2 className="text-xl font-bold text-primary-olive font-serif mb-6 flex items-center">
                  <FileText className="w-5 h-5 mr-3 text-accent-clay" /> Trip Selections
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-[10px] text-text-muted uppercase font-bold tracking-widest mb-2">Dates</h3>
                      <p className="text-sm font-bold text-text-main">
                        {new Date(lead.selections.startDate).toLocaleDateString()} — {new Date(lead.selections.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-[10px] text-text-muted uppercase font-bold tracking-widest mb-2">Accommodation</h3>
                      <p className="text-sm font-bold text-text-main">{lead.selections.accommodation.replace(/-/g, ' ')}</p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-[10px] text-text-muted uppercase font-bold tracking-widest mb-2">Experiences</h3>
                      <div className="flex flex-wrap gap-2">
                        {lead.selections.experiences.map((exp: string) => (
                          <Badge key={exp} variant="outline" className="text-[10px] border-primary-olive/10">{exp}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-[10px] text-text-muted uppercase font-bold tracking-widest mb-2">Transport</h3>
                      <div className="flex flex-wrap gap-2">
                        {lead.selections.transport.map((t: string) => (
                          <Badge key={t} variant="outline" className="text-[10px] border-primary-olive/10">{t.replace(/-/g, ' ')}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            <Card className="bg-white border-primary-olive/10 p-8 rounded-[32px] shadow-sm">
              <h2 className="text-xl font-bold text-primary-olive font-serif mb-6 flex items-center">
                <DollarSign className="w-5 h-5 mr-3 text-accent-clay" /> Booking Financials
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-xs font-bold text-primary-olive uppercase tracking-widest mb-2">Final Price (USD)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                      type="number"
                      value={bookingForm.finalPrice}
                      onChange={(e) => setBookingForm({ ...bookingForm, finalPrice: e.target.value })}
                      className={cn(
                        "w-full bg-bg-warm border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-olive/20",
                        formErrors.finalPrice ? "border-accent-clay" : "border-primary-olive/10"
                      )}
                    />
                  </div>
                  {formErrors.finalPrice && <p className="text-accent-clay text-[10px] mt-1 font-bold">{formErrors.finalPrice}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-primary-olive uppercase tracking-widest mb-2">Deposit Amount (USD)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                      type="number"
                      value={bookingForm.depositAmount}
                      onChange={(e) => setBookingForm({ ...bookingForm, depositAmount: e.target.value })}
                      className={cn(
                        "w-full bg-bg-warm border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-olive/20",
                        formErrors.depositAmount ? "border-accent-clay" : "border-primary-olive/10"
                      )}
                    />
                  </div>
                  {formErrors.depositAmount && <p className="text-accent-clay text-[10px] mt-1 font-bold">{formErrors.depositAmount}</p>}
                </div>
              </div>
              <div className="mt-8 flex justify-end">
                <Button 
                  onClick={() => alert("Financials saved locally (simulated)")}
                  className="bg-bg-warm text-primary-olive hover:bg-primary-olive/5 border border-primary-olive/10 rounded-full px-8 font-bold"
                >
                  <Save className="w-4 h-4 mr-2" /> Save Financials
                </Button>
              </div>
            </Card>
          </div>

          {/* Right Column: Timeline & Notes */}
          <div className="space-y-8">
            <Card className="bg-white border-primary-olive/10 p-8 rounded-[32px] shadow-sm flex flex-col h-[600px]">
              <h2 className="text-xl font-bold text-primary-olive font-serif mb-6 flex items-center">
                <MessageSquare className="w-5 h-5 mr-3 text-accent-clay" /> Internal Notes
              </h2>
              
              <div className="flex-grow overflow-y-auto space-y-6 mb-6 pr-2">
                {lead.notes.length === 0 ? (
                  <p className="text-sm text-text-muted text-center py-12 italic">No notes yet.</p>
                ) : (
                  lead.notes.map((note) => (
                    <div key={note._id} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-primary-olive uppercase tracking-widest">{note.author}</span>
                        <span className="text-[10px] text-text-muted">{new Date(note.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                      </div>
                      <div className="p-4 bg-bg-warm rounded-2xl border border-primary-olive/5 text-sm text-text-main">
                        {note.content}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={handleAddNote} className="space-y-3">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a note..."
                  className="w-full bg-bg-warm border border-primary-olive/10 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-olive/20 resize-none"
                  rows={3}
                />
                <Button 
                  type="submit" 
                  disabled={isSubmittingNote || !newNote.trim()}
                  className="w-full bg-primary-olive text-white rounded-full font-bold"
                >
                  {isSubmittingNote ? "Adding..." : "Add Note"}
                </Button>
              </form>
            </Card>

            <Card className="bg-accent-clay text-white p-8 rounded-[32px] shadow-lg">
              <h3 className="text-lg font-bold font-serif mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2" /> Status Summary
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="opacity-70">Current Status</span>
                  <Badge className="bg-white/20 text-white border-none">{lead.status}</Badge>
                </div>
                {lead.booking && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="opacity-70">Payment Status</span>
                    <Badge className={cn(
                      "border-none",
                      lead.booking.paymentStatus === "Paid" ? "bg-green-400" : "bg-yellow-400"
                    )}>
                      {lead.booking.paymentStatus}
                    </Badge>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
