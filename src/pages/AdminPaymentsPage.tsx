import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  Clock, 
  DollarSign, 
  User,
  ShieldAlert
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PaymentData {
  _id: string;
  leadId: string;
  method: string;
  amount: number;
  status: string;
  timestamp: string;
}

export function AdminPaymentsPage() {
  const { paymentId } = useParams();
  const [payment, setPayment] = useState<PaymentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchPayment = async () => {
      // In a real app, we'd have a GET /api/admin/payments/:id
      // For now, let's simulate or fetch from a list if we had one
      setLoading(false);
    };
    fetchPayment();
  }, [paymentId]);

  const handleMarkPaid = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/admin/payments/${paymentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Paid" }),
      });
      if (response.ok) {
        setPayment(prev => prev ? { ...prev, status: "Paid" } : null);
      }
    } catch (error) {
      console.error("Update failed", error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) return <div className="pt-32 text-center">Loading...</div>;

  return (
    <main className="min-h-screen pt-12 pb-20 px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" asChild className="text-text-muted">
            <Link to="/"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard</Link>
          </Button>
          <Badge className="bg-accent-clay/10 text-accent-clay border-none px-4 py-1">Admin Console</Badge>
        </div>

        <Card className="bg-white border-primary-olive/10 rounded-[32px] shadow-xl overflow-hidden">
          <div className="bg-primary-olive p-8 text-white flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold font-serif">Payment Reconciliation</h1>
              <p className="text-sm opacity-70">Verify and approve manual transfers</p>
            </div>
            <ShieldAlert className="w-8 h-8 opacity-20" />
          </div>

          <div className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-bg-warm rounded-2xl border border-primary-olive/5">
                <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest mb-1">Amount</p>
                <p className="text-2xl font-bold text-primary-olive font-serif">$240.00</p>
              </div>
              <div className="p-6 bg-bg-warm rounded-2xl border border-primary-olive/5">
                <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest mb-1">Method</p>
                <p className="text-2xl font-bold text-primary-olive font-serif">EFT</p>
              </div>
              <div className="p-6 bg-bg-warm rounded-2xl border border-primary-olive/5">
                <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest mb-1">Status</p>
                <Badge className={cn(
                  "mt-1 px-3 py-1 rounded-full text-xs font-bold",
                  payment?.status === "Paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                )}>
                  {payment?.status || "Pending Verification"}
                </Badge>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-primary-olive uppercase tracking-widest">Payment Details</h3>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <User className="w-4 h-4 mr-3 text-text-muted" />
                  <span className="text-text-muted mr-2">Lead ID:</span>
                  <span className="font-bold text-text-main">#{paymentId?.slice(-6).toUpperCase()}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Clock className="w-4 h-4 mr-3 text-text-muted" />
                  <span className="text-text-muted mr-2">Received:</span>
                  <span className="font-bold text-text-main">April 16, 2026 08:05 AM</span>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-primary-olive/5 flex gap-4">
              <Button 
                onClick={handleMarkPaid}
                disabled={isUpdating || payment?.status === "Paid"}
                className="bg-primary-olive text-white rounded-full px-8 h-12 font-bold shadow-lg shadow-primary-olive/20"
              >
                {isUpdating ? "Updating..." : "Mark as Paid"}
              </Button>
              <Button variant="outline" className="rounded-full border-primary-olive text-primary-olive font-bold px-8 h-12">
                Flag for Review
              </Button>
            </div>
          </div>
        </Card>

        <div className="mt-8 p-6 bg-accent-clay/5 rounded-2xl border border-accent-clay/10 flex items-start">
          <AlertCircle className="w-5 h-5 text-accent-clay mr-4 mt-0.5" />
          <p className="text-xs text-text-muted leading-relaxed">
            <strong>Warning:</strong> Marking a payment as paid will automatically update the associated lead status to "Deposit Received" and trigger a confirmation email to the traveler. Ensure funds have cleared in the bank account before proceeding.
          </p>
        </div>
      </div>
    </main>
  );
}
