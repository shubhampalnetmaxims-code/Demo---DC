import { ObjectId } from "mongodb";
import { getDb, SIM_STATE, simQuery } from "../models/state";

export const getLeads = async (req: any, res: any) => {
  const { status, destination, search } = req.query;
  try {
    const db = await getDb();
    const query: any = {};
    if (status) query.status = status;
    if (destination) query.destination = destination;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }

    if (db) {
      const leads = await db.collection("leads").find(query).sort({ timestamp: -1 }).toArray();
      res.json(leads);
    } else {
      const leads = simQuery(SIM_STATE.leads, query)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      res.json(leads);
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch leads" });
  }
};

export const getLeadDetails = async (req: any, res: any) => {
  const { id } = req.params;
  try {
    const db = await getDb();
    let lead: any = null;
    let notes: any[] = [];
    let booking: any = null;

    if (db) {
      lead = await db.collection("leads").findOne({ _id: new ObjectId(id) });
      if (lead) {
        notes = await db.collection("notes").find({ leadId: new ObjectId(id) }).sort({ timestamp: -1 }).toArray();
        booking = await db.collection("bookings").findOne({ leadId: new ObjectId(id) });
      }
    } else {
      lead = SIM_STATE.leads.find(l => l._id === id);
      if (lead) {
        notes = SIM_STATE.notes.filter(n => n.leadId === id).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        booking = SIM_STATE.bookings.find(b => b.leadId === id);
      }
    }

    if (!lead) return res.status(404).json({ error: "Lead not found" });
    res.json({ ...lead, notes, booking });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch lead details" });
  }
};

export const createLead = async (req: any, res: any) => {
  const data = req.body;
  try {
    const db = await getDb();
    const leadData = {
      ...data,
      status: data.status || "New",
      timestamp: new Date().toISOString(),
    };

    if (db) {
      const result = await db.collection("leads").insertOne(leadData);
      res.json({ success: true, leadId: result.insertedId });
    } else {
      const id = `sim-${Date.now()}`;
      SIM_STATE.leads.push({ ...leadData, _id: id });
      res.json({ success: true, leadId: id });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to create lead" });
  }
};

export const updateLeadStatus = async (req: any, res: any) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const db = await getDb();
    const noteData = {
      leadId: db ? new ObjectId(id) : id,
      content: `Status changed to ${status}`,
      author: req.admin?.name || "System",
      timestamp: new Date().toISOString()
    };

    if (db) {
      await db.collection("leads").updateOne(
        { _id: new ObjectId(id) },
        { $set: { status, updatedAt: new Date() } }
      );
      await db.collection("notes").insertOne(noteData);
    } else {
      const lead = SIM_STATE.leads.find(l => l._id === id);
      if (lead) lead.status = status;
      SIM_STATE.notes.push({ ...noteData, _id: `note-${Date.now()}` });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to update status" });
  }
};

export const logPageView = async (req: any, res: any) => {
  const { destination } = req.body;
  try {
    const db = await getDb();
    if (db) {
      await db.collection("page_views").insertOne({
        destination,
        timestamp: new Date(),
      });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to log view" });
  }
};

export const getDashboardStats = async (req: any, res: any) => {
  try {
    const db = await getDb();
    let leads: any[] = [];
    let views: any[] = [];
    let payments: any[] = [];

    if (db) {
      leads = await db.collection("leads").find({}).toArray();
      views = await db.collection("page_views").find({}).toArray();
      payments = await db.collection("payments").find({}).toArray();
    } else {
      leads = SIM_STATE.leads;
      payments = SIM_STATE.payments;
      // views simulated?
    }

    const stats = {
      totalLeads: leads.length,
      newLeads: leads.filter(l => l.status === "New").length,
      wonLeads: leads.filter(l => l.status === "Won" || l.status === "Deposit Received").length,
      totalRevenue: payments.filter(p => p.status === "Succeeded" || p.status === "Paid").reduce((acc, p) => acc + (p.amount || 0), 0),
      popularDestinations: [] as any[]
    };

    // Calculate popular destinations
    const destMap: Record<string, number> = {};
    leads.forEach(l => {
      destMap[l.destination] = (destMap[l.destination] || 0) + 1;
    });
    stats.popularDestinations = Object.entries(destMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch dashboard stats" });
  }
};
