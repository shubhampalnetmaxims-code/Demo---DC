import { MongoClient, ObjectId } from "mongodb";
import bcrypt from "bcryptjs";

// Simulation Data (In-memory fallback for prototyping)
export const SIM_STATE = {
  admin_users: [
    {
      _id: "sim-admin-1",
      name: "Super Admin",
      email: "admin@gmail.com",
      password: "", // Will be hashed below
      role: "admin",
      createdAt: new Date()
    }
  ],
  leads: [
    {
      _id: "sim-lead-1",
      name: "Alex Johnson",
      email: "alex@example.com",
      phone: "+27 82 123 4567",
      travelerType: "Couple",
      destination: "Cape Town",
      status: "New",
      origin: "Website Concierge",
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      selections: {
        startDate: new Date(Date.now() + 604800000).toISOString(),
        endDate: new Date(Date.now() + 1209600000).toISOString(),
        accommodation: "table-mountain-retreat",
        experiences: ["Private Wine Tour", "Helicopter Flight"],
        transport: ["Airport Transfer"]
      }
    }
  ],
  notes: [] as any[],
  payments: [] as any[],
  bookings: [] as any[],
  content: {
    destinations: [
      {
        id: "cape-town",
        name: "Cape Town",
        description: "The Mother City, where mountains meet the ocean in spectacular fashion.",
        heroImage: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&q=80",
        highlights: ["Table Mountain", "Cape Point", "V&A Waterfront", "Kirstenbosch"],
        createdAt: new Date().toISOString()
      },
      {
        id: "botswana",
        name: "Botswana",
        description: "A wilderness like no other, home to the Okavango Delta and Chobe National Park.",
        heroImage: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&q=80",
        highlights: ["Okavango Delta", "Chobe River", "Makgadikgadi Pans"],
        createdAt: new Date().toISOString()
      },
      {
        id: "johannesburg",
        name: "Johannesburg",
        description: "The heart of South Africa, a vibrant city of culture, history, and commerce.",
        heroImage: "https://images.unsplash.com/photo-1549420019-35ed08bc5095?auto=format&fit=crop&q=80",
        highlights: ["Soweto", "Apartheid Museum", "Maboneng", "Sandton"],
        createdAt: new Date().toISOString()
      },
      {
        id: "victoria-falls",
        name: "Victoria Falls",
        description: "The Smoke That Thunders. One of the Seven Natural Wonders of the World.",
        heroImage: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=80",
        highlights: ["Devil's Pool", "Knife Edge Bridge", "Helicopter Flight"],
        createdAt: new Date().toISOString()
      },
      {
        id: "serengeti",
        name: "Serengeti",
        description: "Witness the Great Migration in the vast plains of Tanzania.",
        heroImage: "https://images.unsplash.com/photo-1523805081446-99395617521a?auto=format&fit=crop&q=80",
        highlights: ["The Great Migration", "River Crossings", "Big Five Safari"],
        createdAt: new Date().toISOString()
      },
      {
        id: "kruger-np",
        name: "Kruger National Park",
        description: "One of Africa's largest game reserves, iconic for the Big Five sightings.",
        heroImage: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&q=80",
        highlights: ["Big Five Safari", "Guided Bush Walks", "Night Drives"],
        createdAt: new Date().toISOString()
      }
    ],
    packages: [
      {
        id: "cape-luxury",
        name: "Cape Luxury Escape",
        destination: "Cape Town",
        description: "5 days of pure luxury in the heart of Africa's most beautiful city.",
        price: 2450,
        itinerary: "Day 1: Arrival & Sunset at Table Mountain. Day 2: Winelands Tour. Day 3: Cape Point & Penguins.",
        image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&q=80",
        createdAt: new Date().toISOString()
      },
      {
        id: "safari-adventure",
        name: "Botswana Safari Adventure",
        destination: "Botswana",
        description: "7 days of wild adventure in the Okavango Delta.",
        price: 4800,
        itinerary: "Day 1-3: Okavango Delta Camp. Day 4-5: Chobe River Cruise. Day 6: Elephant encounters.",
        image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80",
        createdAt: new Date().toISOString()
      },
      {
        id: "victoria-explorer",
        name: "Falls Explorer",
        destination: "Victoria Falls",
        description: "3 days of adrenaline and beauty at the falls.",
        price: 1200,
        itinerary: "Day 1: Guided Falls Walk. Day 2: Sunset Cruise. Day 3: Bungee or Helicopter.",
        image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=80",
        createdAt: new Date().toISOString()
      },
      {
        id: "migration-magic",
        name: "Serengeti Migration",
        destination: "Serengeti",
        description: "Witness the greatest show on earth.",
        price: 5500,
        itinerary: "Day 1-4: Mobile Camp following the herds. Day 5: Hot Air Balloon Safari.",
        image: "https://images.unsplash.com/photo-1523805081446-99395617521a?auto=format&fit=crop&q=80",
        createdAt: new Date().toISOString()
      },
      {
        id: "kruger-safari",
        name: "Kruger Classic Safari",
        destination: "Kruger National Park",
        description: "4 days immersive wildlife experience in the wild.",
        price: 1850,
        itinerary: "Day 1: Arrival & Evening Drive. Day 2-3: Full day safaris. Day 4: Morning bush walk.",
        image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&q=80",
        createdAt: new Date().toISOString()
      }
    ],
    stays: [
      {
        id: "the-sililo",
        name: "The Silo Hotel",
        destination: "Cape Town",
        type: "Luxury Hotel",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80",
        description: "A magical hotel towering above the V&A Waterfront."
      },
      {
        id: "chobe-lodge",
        name: "Chobe Game Lodge",
        destination: "Botswana",
        type: "Eco Lodge",
        image: "https://images.unsplash.com/photo-1493246507139-91e8bef99c02?auto=format&fit=crop&q=80",
        description: "Luxury safari lodge inside Chobe National Park."
      },
      {
        id: "victoria-hotel",
        name: "The Victoria Falls Hotel",
        destination: "Victoria Falls",
        type: "Historical Luxury",
        image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80",
        description: "Elegance and history overlooking the falls bridge."
      },
      {
        id: "serengeti-camp",
        name: "Four Seasons Serengeti",
        destination: "Serengeti",
        type: "Luxury Safari Lodge",
        image: "https://images.unsplash.com/photo-1493246507139-91e8bef99c02?auto=format&fit=crop&q=80",
        description: "Luxury in the heart of the wild."
      },
      {
        id: "kruger-lodge",
        name: "Singita Ebano",
        destination: "Kruger National Park",
        type: "Luxury Lodge",
        image: "https://images.unsplash.com/photo-1493246507139-91e8bef99c02?auto=format&fit=crop&q=80",
        description: "Experience the ultimate in private safari luxury."
      },
      {
        id: "twelve-apostles",
        name: "Twelve Apostles Hotel",
        destination: "Cape Town",
        type: "Coastal Luxury",
        image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80",
        description: "Majestic views overlooking the Atlantic Ocean."
      }
    ],
    experiences: [
      { id: "helicopter-tour", name: "Helicopter Harbour Tour", destination: "Cape Town", price: 250 },
      { id: "safari-drive", name: "Big Five Game Drive", destination: "Botswana", price: 150 },
      { id: "devil-pool", name: "Devil's Pool Swim", destination: "Victoria Falls", price: 110 },
      { id: "balloon-serengeti", name: "Hot Air Balloon Safari", destination: "Serengeti", price: 599 },
      { id: "kruger-walk", name: "Guided Wilderness Walk", destination: "Kruger National Park", price: 85 },
      { id: "wine-tasting", name: "Private Wine Tasting", destination: "Cape Town", price: 120 }
    ]
  } as Record<string, any[]>
};

// Hash simulation password
bcrypt.hash("Admin@123", 10).then(hash => {
  SIM_STATE.admin_users[0].password = hash;
});

export const simQuery = (collection: any[], query: any) => {
  return collection.filter(item => {
    for (const key in query) {
      if (key === "$or") {
        return query.$or.some((sub: any) => simQuery([item], sub).length > 0);
      }
      if (typeof query[key] === "object" && query[key].$regex) {
        const regex = new RegExp(query[key].$regex, query[key].$options || "");
        if (!regex.test(item[key])) return false;
      } else if (item[key] !== query[key]) {
        return false;
      }
    }
    return true;
  });
};

let dbClient: MongoClient | null = null;

export async function getDb() {
  if (!dbClient) {
    const uri = process.env.MONGODB_URI;
    if (!uri) return null;
    dbClient = new MongoClient(uri);
    await dbClient.connect();
    await seedAdminUser();
  }
  return dbClient.db("safari_discovery");
}

async function seedAdminUser() {
  const db = dbClient?.db("safari_discovery");
  if (!db) return;
  const adminEmail = "admin@gmail.com";
  const existing = await db.collection("admin_users").findOne({ email: adminEmail });
  if (!existing) {
    const hashedPassword = await bcrypt.hash("Admin@123", 10);
    await db.collection("admin_users").insertOne({
      name: "Super Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
      createdAt: new Date()
    });
    console.log("Default admin user seeded in MongoDB");
  }
}
