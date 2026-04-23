import { ObjectId } from "mongodb";
import { getDb, SIM_STATE } from "../models/state";

export const getPublicDestinations = async (req: any, res: any) => {
  try {
    const db = await getDb();
    if (db) {
      const items = await db.collection("destinations").find({}).toArray();
      res.json(items);
    } else {
      res.json(SIM_STATE.content.destinations);
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch destinations" });
  }
};

export const getPublicDestinationDetails = async (req: any, res: any) => {
  const { id } = req.params;
  try {
    const db = await getDb();
    let destination: any = null;

    if (db) {
      destination = await db.collection("destinations").findOne({ 
        $or: [
          { _id: ObjectId.isValid(id) ? new ObjectId(id) : null },
          { id: id }
        ].filter(q => q !== null)
      });
    } else {
      destination = SIM_STATE.content.destinations.find(d => d.id === id || d._id === id);
    }
    
    if (!destination) return res.status(404).json({ error: "Destination not found" });

    let packages: any[] = [];
    let stays: any[] = [];

    if (db) {
      packages = await db.collection("packages").find({ destination: destination.name }).toArray();
      stays = await db.collection("stays").find({ destination: destination.name }).toArray();
    } else {
      packages = SIM_STATE.content.packages.filter(p => p.destination === destination.name);
      stays = SIM_STATE.content.stays.filter(s => s.destination === destination.name);
    }
    
    res.json({ ...destination, packages, stays });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch destination details" });
  }
};

export const getPublicPackages = async (req: any, res: any) => {
  try {
    const db = await getDb();
    if (db) {
      const items = await db.collection("packages").find({}).toArray();
      res.json(items);
    } else {
      res.json(SIM_STATE.content.packages);
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch packages" });
  }
};

export const getPublicStays = async (req: any, res: any) => {
  try {
    const db = await getDb();
    if (db) {
      const items = await db.collection("stays").find({}).toArray();
      res.json(items);
    } else {
      res.json(SIM_STATE.content.stays);
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stays" });
  }
};

export const getPublicExperiences = async (req: any, res: any) => {
  try {
    const db = await getDb();
    if (db) {
      const items = await db.collection("experiences").find({}).toArray();
      res.json(items);
    } else {
      res.json(SIM_STATE.content.experiences);
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch experiences" });
  }
};

export const getContent = async (req: any, res: any) => {
  const { collection } = req.params;
  try {
    const db = await getDb();
    if (db) {
      const items = await db.collection(collection).find({}).toArray();
      res.json(items);
    } else {
      res.json(SIM_STATE.content[collection] || []);
    }
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch ${collection}` });
  }
};

export const createContent = async (req: any, res: any) => {
  const { collection } = req.params;
  const data = req.body;
  try {
    const db = await getDb();
    const itemData = {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (db) {
      const result = await db.collection(collection).insertOne(itemData);
      res.json({ success: true, id: result.insertedId });
    } else {
      const id = `sim-${collection}-${Date.now()}`;
      if (!SIM_STATE.content[collection]) SIM_STATE.content[collection] = [];
      SIM_STATE.content[collection].push({ ...itemData, _id: id, id: id });
      res.json({ success: true, id: id });
    }
  } catch (error) {
    res.status(500).json({ error: `Failed to create ${collection}` });
  }
};

export const updateContent = async (req: any, res: any) => {
  const { collection, id } = req.params;
  const data = req.body;
  try {
    const db = await getDb();
    if (db) {
      delete data._id;
      await db.collection(collection).updateOne(
        { _id: ObjectId.isValid(id) ? new ObjectId(id) : id },
        { $set: { ...data, updatedAt: new Date() } }
      );
    } else {
      const items = SIM_STATE.content[collection] || [];
      const index = items.findIndex(i => i._id === id || i.id === id);
      if (index !== -1) {
        items[index] = { ...items[index], ...data, updatedAt: new Date().toISOString() };
      }
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: `Failed to update ${collection}` });
  }
};

export const deleteContent = async (req: any, res: any) => {
  const { collection, id } = req.params;
  try {
    const db = await getDb();
    if (db) {
      await db.collection(collection).deleteOne({ _id: ObjectId.isValid(id) ? new ObjectId(id) : id });
    } else {
      const items = SIM_STATE.content[collection] || [];
      const index = items.findIndex(i => i._id === id || i.id === id);
      if (index !== -1) {
        SIM_STATE.content[collection].splice(index, 1);
      }
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: `Failed to delete ${collection}` });
  }
};
