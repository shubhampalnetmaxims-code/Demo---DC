import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  CreditCard, 
  Building2, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ShieldCheck,
  Info,
  Copy,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const BANK_DETAILS = {
  bank: "Standard Bank South Africa",
  accountName: "VAYA Discovery (PTY) LTD",
  accountNumber: "123456789",
  branchCode: "051001",
  reference: "LEAD-REF-XYZ"
};

function DummyCheckoutForm({ amount, leadId, onSuccess }: { amount: number, leadId: string, onSuccess: () => void }) {
  const [processing, setProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setProcessing(true);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId,
          method: "Card (Simulated)",
          amount,
          status: "Succeeded"
        }),
      });
      onSuccess();
    } catch (err) {
      console.error("Simulation log failed", err);
      onSuccess(); // Still succeed in simulation mode
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="p-4 bg-bg-warm rounded-xl border border-primary-olive/10">
          <label className="block text-[10px] text-text-muted uppercase font-bold tracking-widest mb-1">Card Number</label>
          <input 
            type="text" 
            placeholder="4242 4242 4242 4242" 
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            className="w-full bg-transparent border-none focus:ring-0 text-sm font-mono"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-bg-warm rounded-xl border border-primary-olive/10">
            <label className="block text-[10px] text-text-muted uppercase font-bold tracking-widest mb-1">Expiry</label>
            <input 
              type="text" 
              placeholder="MM / YY" 
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              className="w-full bg-transparent border-none focus:ring-0 text-sm font-mono"
            />
          </div>
          <div className="p-4 bg-bg-warm rounded-xl border border-primary-olive/10">
            <label className="block text-[10px] text-text-muted uppercase font-bold tracking-widest mb-1">CVC</label>
            <input 
              type="text" 
              placeholder="123" 
              value={cvc}
              onChange={(e) => setCvc(e.target.value)}
              className="w-full bg-transparent border-none focus:ring-0 text-sm font-mono"
            />
          </div>
        </div>
      </div>
      
      <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-center gap-3">
        <Info className="w-4 h-4 text-blue-500" />
        <p className="text-[10px] text-blue-700 font-bold uppercase tracking-wider">Simulation Mode: No real transaction will occur.</p>
      </div>

      <Button 
        type="submit" 
        disabled={processing}
        className="w-full bg-primary-olive text-white rounded-full h-14 font-bold text-lg shadow-lg shadow-primary-olive/20"
      >
        {processing ? (
          <span className="flex items-center justify-center">
            <span className="animate-pulse mr-2">Processing Simulation...</span>
          </span>
        ) : `Simulate Payment of $${amount.toFixed(2)}`}
      </Button>
    </form>
  );
}

export function PaymentsPage() {
  const [searchParams] = useSearchParams();
  const [method, setMethod] = useState<"card" | "eft">("card");
  const [isSuccess, setIsSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const total = parseFloat(searchParams.get("total") || "0");
  const leadId = searchParams.get("leadId") || "sim-lead-123";
  const deposit = total * 0.2;

  const handleEFTConfirm = async () => {
    setIsSuccess(true);
    // Silent log for simulation
    fetch("/api/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        leadId,
        method: "EFT (Simulated)",
        amount: deposit,
        status: "Pending"
      }),
    }).catch(() => {});
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isSuccess) {
    return (
      <main className="min-h-screen bg-bg-warm pt-32 pb-20 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white border-primary-olive/10 p-12 rounded-[32px] text-center shadow-xl">
            <div className="w-20 h-20 bg-primary-olive/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-primary-olive" />
            </div>
            <h1 className="text-4xl font-bold text-primary-olive font-serif mb-4">Payment {method === "eft" ? "Initiated" : "Received"}!</h1>
            <p className="text-text-muted mb-8 max-w-md mx-auto">
              {method === "eft" 
                ? "Please complete the transfer using the details provided. We'll update your status once the funds clear."
                : "Your deposit has been successfully processed. You'll receive a receipt via email shortly."}
            </p>
            <Button asChild className="bg-primary-olive text-white rounded-full font-bold px-12 h-12">
              <Link to="/">Back to Home</Link>
            </Button>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bg-warm pt-32 pb-20 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Payment Selection */}
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-primary-olive font-serif mb-4">Secure Deposit</h1>
            <p className="text-text-muted">Complete your booking by paying a 20% deposit.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setMethod("card")}
              className={cn(
                "p-6 rounded-3xl border-2 transition-all text-left",
                method === "card" ? "border-primary-olive bg-primary-olive/5" : "border-primary-olive/5 bg-white"
              )}
            >
              <CreditCard className={cn("w-8 h-8 mb-4", method === "card" ? "text-primary-olive" : "text-text-muted")} />
              <p className="font-bold text-primary-olive">Credit Card</p>
              <p className="text-xs text-text-muted">Instant & Secure</p>
            </button>
            <button
              onClick={() => setMethod("eft")}
              className={cn(
                "p-6 rounded-3xl border-2 transition-all text-left",
                method === "eft" ? "border-primary-olive bg-primary-olive/5" : "border-primary-olive/5 bg-white"
              )}
            >
              <Building2 className={cn("w-8 h-8 mb-4", method === "eft" ? "text-primary-olive" : "text-text-muted")} />
              <p className="font-bold text-primary-olive">Bank Transfer</p>
              <p className="text-xs text-text-muted">EFT / Wire</p>
            </button>
          </div>

          <Card className="p-8 bg-white border-primary-olive/10 rounded-[32px] shadow-lg">
            {method === "card" ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-bold text-primary-olive font-serif">Card Details</h2>
                  <div className="flex gap-2">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4 opacity-50" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4 opacity-50" />
                  </div>
                </div>
                <DummyCheckoutForm amount={deposit} leadId={leadId} onSuccess={() => setIsSuccess(true)} />
                <div className="flex items-center justify-center gap-2 text-[10px] text-text-muted uppercase tracking-widest font-bold">
                  <ShieldCheck className="w-3 h-3" /> Simulation Mode Active
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-primary-olive font-serif">Bank Details</h2>
                <div className="space-y-4">
                  {[
                    { label: "Bank", value: BANK_DETAILS.bank },
                    { label: "Account Name", value: BANK_DETAILS.accountName },
                    { label: "Account Number", value: BANK_DETAILS.accountNumber },
                    { label: "Branch Code", value: BANK_DETAILS.branchCode },
                    { label: "Reference", value: `VAYA-${leadId.slice(-6).toUpperCase()}` },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-bg-warm rounded-xl border border-primary-olive/5">
                      <div>
                        <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest">{item.label}</p>
                        <p className="text-sm font-bold text-text-main">{item.value}</p>
                      </div>
                      <button 
                        onClick={() => copyToClipboard(item.value)}
                        className="p-2 hover:bg-primary-olive/10 rounded-lg transition-colors"
                      >
                        {copied ? <Check className="w-4 h-4 text-primary-olive" /> : <Copy className="w-4 h-4 text-text-muted" />}
                      </button>
                    </div>
                  ))}
                </div>
                <div className="p-4 bg-accent-clay/10 rounded-xl flex items-start">
                  <Info className="w-4 h-4 text-accent-clay mr-3 mt-0.5" />
                  <p className="text-[10px] text-text-main leading-relaxed">
                    Please use the reference provided. Send proof of payment to concierge@vaya-discovery.com for faster processing.
                  </p>
                </div>
                <Button 
                  onClick={handleEFTConfirm}
                  className="w-full bg-primary-olive text-white rounded-full h-14 font-bold text-lg"
                >
                  Confirm Transfer Sent
                </Button>
              </div>
            )}
          </Card>
        </div>

        {/* Summary Panel */}
        <div className="lg:col-span-1">
          <div className="sticky top-32 space-y-6">
            <Card className="bg-primary-olive text-white p-8 rounded-[32px] shadow-2xl border-none">
              <h3 className="text-2xl font-bold font-serif mb-6">Payment Summary</h3>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm border-b border-white/10 pb-2">
                  <span className="opacity-70">Total Trip Cost</span>
                  <span className="font-bold">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm border-b border-white/10 pb-2">
                  <span className="opacity-70">Deposit Percentage</span>
                  <span className="font-bold">20%</span>
                </div>
                <div className="pt-4 flex justify-between items-end">
                  <span className="text-sm opacity-70">Amount Due Now</span>
                  <span className="text-4xl font-bold font-serif">${deposit.toFixed(2)}</span>
                </div>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl text-xs leading-relaxed opacity-80">
                The remaining balance of ${(total - deposit).toFixed(2)} is due 60 days prior to departure.
              </div>
            </Card>
          </div>
        </div>

      </div>
    </main>
  );
}
