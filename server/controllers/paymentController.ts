import { ObjectId } from "mongodb";
import Stripe from "stripe";
import { getDb, SIM_STATE } from "../models/state";

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY) 
  : null;

export const createPaymentIntent = async (req: any, res: any) => {
  const { amount, leadId } = req.body;
  if (!stripe) return res.status(500).json({ error: "Stripe is not configured" });

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "usd",
      metadata: { leadId },
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: "Failed to create payment intent" });
  }
};

export const logPayment = async (req: any, res: any) => {
  const { leadId, method, amount, status } = req.body;
  try {
    const db = await getDb();
    const paymentData = {
      _id: db ? new ObjectId() : `pay-${Date.now()}`,
      leadId: db ? new ObjectId(leadId) : leadId,
      method,
      amount,
      status: status || "Pending",
      timestamp: new Date().toISOString(),
    };

    if (db) {
      await db.collection("payments").insertOne(paymentData as any);
      if (status === "Succeeded") {
        await db.collection("leads").updateOne(
          { _id: new ObjectId(leadId) },
          { $set: { status: "Deposit Received" } }
        );
      }
    } else {
      SIM_STATE.payments.push(paymentData);
      if (status === "Succeeded") {
        const lead = SIM_STATE.leads.find(l => l._id === leadId);
        if (lead) lead.status = "Deposit Received";
      }
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to log payment" });
  }
};

export const updatePaymentStatus = async (req: any, res: any) => {
  const { paymentId } = req.params;
  const { status } = req.body;
  try {
    const db = await getDb();
    if (db) {
      const result = await db.collection("payments").findOneAndUpdate(
        { _id: new ObjectId(paymentId) },
        { $set: { status } },
        { returnDocument: "after" }
      );
      if (result && status === "Paid") {
        await db.collection("leads").updateOne(
          { _id: result.leadId },
          { $set: { status: "Deposit Received" } }
        );
      }
      res.json({ success: true });
    }
  } catch (error) {
    res.status(500).json({ error: "Payment update failed" });
  }
};
