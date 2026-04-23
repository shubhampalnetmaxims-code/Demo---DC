export interface Package {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

export interface Stay {
  id: string;
  name: string;
  info: string;
  image: string;
}

export interface Destination {
  id: string;
  name: string;
  heroImage: string;
  highlights: { icon: string; text: string }[];
  packages: Package[];
  stays: Stay[];
}

export const destinations: Record<string, Destination> = {
  "cape-town": {
    id: "cape-town",
    name: "Cape Town",
    heroImage: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&q=80&w=1920",
    highlights: [
      { icon: "Mountain", text: "Table Mountain Views" },
      { icon: "Wine", text: "World-class Vineyards" },
      { icon: "Waves", text: "Pristine Atlantic Beaches" },
      { icon: "Compass", text: "Cape of Good Hope" },
    ],
    packages: [
      {
        id: "cape-city-explorer",
        name: "City Explorer",
        description: "A 5-day journey through the heart of the Mother City.",
        price: 1200,
        image: "https://images.unsplash.com/photo-1576485290814-1c72aa4bbb8e?auto=format&fit=crop&q=80&w=800",
      },
      {
        id: "cape-wine-safari",
        name: "Wine & Dine Safari",
        description: "Taste the finest wines of Stellenbosch and Franschhoek.",
        price: 1500,
        image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=800",
      },
      {
        id: "cape-adventure",
        name: "Coastal Adventure",
        description: "Shark cage diving and paragliding off Signal Hill.",
        price: 1800,
        image: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&q=80&w=800",
      },
    ],
    stays: [
      {
        id: "silo-hotel",
        name: "The Silo Hotel",
        info: "Luxury stay in a converted grain silo at the V&A Waterfront.",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800",
      },
      {
        id: "mount-nelson",
        name: "Belmond Mount Nelson",
        info: "The iconic pink lady of Cape Town, offering timeless elegance.",
        image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800",
      },
      {
        id: "twelve-apostles",
        name: "Twelve Apostles Hotel",
        info: "Breathtaking sunset views between the mountains and the sea.",
        image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=800",
      },
    ],
  },
  "johannesburg": {
    id: "johannesburg",
    name: "Johannesburg",
    heroImage: "https://images.unsplash.com/photo-1545153996-802497637515?auto=format&fit=crop&q=80&w=1920",
    highlights: [
      { icon: "History", text: "Apartheid Museum" },
      { icon: "Music", text: "Vibrant Maboneng District" },
      { icon: "Shopping", text: "Sandton City Luxury" },
      { icon: "Trees", text: "World's Largest Urban Forest" },
    ],
    packages: [
      {
        id: "joburg-culture",
        name: "Urban Culture",
        description: "Explore the street art and history of Soweto and Maboneng.",
        price: 900,
        image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=80&w=800",
      },
      {
        id: "joburg-gold",
        name: "Gold Reef Experience",
        description: "A deep dive into the gold mining history of the city.",
        price: 1100,
        image: "https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&q=80&w=800",
      },
      {
        id: "joburg-safari-day",
        name: "Lion Park Day Trip",
        description: "Get up close with the kings of the jungle just outside the city.",
        price: 1300,
        image: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&q=80&w=800",
      },
    ],
    stays: [
      {
        id: "saxon-hotel",
        name: "Saxon Hotel & Spa",
        info: "An oasis of luxury where Nelson Mandela stayed.",
        image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=800",
      },
      {
        id: "four-seasons-westcliff",
        name: "Four Seasons Westcliff",
        info: "Hillside retreat with panoramic views of the zoo lake.",
        image: "https://images.unsplash.com/photo-1582719478250-c89cae4df85b?auto=format&fit=crop&q=80&w=800",
      },
      {
        id: "the-winston",
        name: "The Winston Hotel",
        info: "Boutique elegance in the heart of Rosebank.",
        image: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&q=80&w=800",
      },
    ],
  },
  "botswana": {
    id: "botswana",
    name: "Botswana",
    heroImage: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=1920",
    highlights: [
      { icon: "Elephant", text: "Chobe National Park" },
      { icon: "Water", text: "Okavango Delta" },
      { icon: "Star", text: "Makgadikgadi Salt Pans" },
      { icon: "Camera", text: "Unrivaled Wildlife Photography" },
    ],
    packages: [
      {
        id: "delta-dream",
        name: "Delta Dream",
        description: "A 7-day luxury safari in the heart of the Okavango Delta.",
        price: 4500,
        image: "https://images.unsplash.com/photo-1523805009345-7448845a9e53?auto=format&fit=crop&q=80&w=800",
      },
      {
        id: "chobe-river",
        name: "Chobe River Cruise",
        description: "Witness the massive elephant herds from the water.",
        price: 3200,
        image: "https://images.unsplash.com/photo-1535941339077-2dd1c7963098?auto=format&fit=crop&q=80&w=800",
      },
      {
        id: "kalahari-stars",
        name: "Kalahari Star Gazing",
        description: "Sleep under the stars in the vast salt pans.",
        price: 3800,
        image: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?auto=format&fit=crop&q=80&w=800",
      },
    ],
    stays: [
      {
        id: "mombo-camp",
        name: "Mombo Camp",
        info: "The 'Place of Plenty', renowned for its high concentration of wildlife.",
        image: "https://images.unsplash.com/photo-1493246507139-91e8bef99c02?auto=format&fit=crop&q=80&w=800",
      },
      {
        id: "sandibe-lodge",
        name: "Sandibe Okavango Safari Lodge",
        info: "Architectural masterpiece inspired by the pangolin.",
        image: "https://images.unsplash.com/photo-1544124499-58912cbddaad?auto=format&fit=crop&q=80&w=800",
      },
      {
        id: "jack-camp",
        name: "Jack's Camp",
        info: "Classic 1940s style safari camp in the Makgadikgadi.",
        image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=800",
      },
    ],
  },
};
