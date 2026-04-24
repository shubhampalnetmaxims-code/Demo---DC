export interface Package {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  destination: string;
}

export interface Stay {
  id: string;
  name: string;
  info: string;
  image: string;
  destination: string;
}

export interface Experience {
  id: string;
  name: string;
  destination: string;
  price: number;
}

export interface Destination {
  id: string;
  name: string;
  heroImage: string;
  description: string;
  highlights: { icon: string; text: string }[];
  packages?: Package[];
  stays?: Stay[];
}

export const staticDestinations: Destination[] = [
  {
    id: "cape-town",
    name: "Cape Town",
    description: "The Mother City, where mountains meet the ocean in spectacular fashion.",
    heroImage: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&q=80",
    highlights: [
      { icon: "Mountain", text: "Table Mountain" },
      { icon: "Compass", text: "Cape Point" },
      { icon: "Waves", text: "V&A Waterfront" },
      { icon: "Map", text: "Kirstenbosch" }
    ]
  },
  {
    id: "botswana",
    name: "Botswana",
    description: "A wilderness like no other, home to the Okavango Delta and Chobe National Park.",
    heroImage: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&q=80",
    highlights: [
      { icon: "Waves", text: "Okavango Delta" },
      { icon: "Compass", text: "Chobe River" },
      { icon: "Star", text: "Makgadikgadi Pans" }
    ]
  },
  {
    id: "johannesburg",
    name: "Johannesburg",
    description: "The heart of South Africa, a vibrant city of culture, history, and commerce.",
    heroImage: "https://images.unsplash.com/photo-1549420019-35ed08bc5095?auto=format&fit=crop&q=80",
    highlights: [
      { icon: "History", text: "Soweto" },
      { icon: "Info", text: "Apartheid Museum" },
      { icon: "Music", text: "Maboneng" },
      { icon: "Map", text: "Sandton" }
    ]
  },
  {
    id: "victoria-falls",
    name: "Victoria Falls",
    description: "The Smoke That Thunders. One of the Seven Natural Wonders of the World.",
    heroImage: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=80",
    highlights: [
      { icon: "Waves", text: "Devil's Pool" },
      { icon: "Compass", text: "Knife Edge Bridge" },
      { icon: "Wind", text: "Helicopter Flight" }
    ]
  },
  {
    id: "serengeti",
    name: "Serengeti",
    description: "Witness the Great Migration in the vast plains of Tanzania.",
    heroImage: "https://images.unsplash.com/photo-1523805081446-99395617521a?auto=format&fit=crop&q=80",
    highlights: [
      { icon: "Star", text: "The Great Migration" },
      { icon: "Waves", text: "River Crossings" },
      { icon: "Compass", text: "Big Five Safari" }
    ]
  },
  {
    id: "kruger-np",
    name: "Kruger National Park",
    description: "One of Africa's largest game reserves, iconic for the Big Five sightings.",
    heroImage: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&q=80",
    highlights: [
      { icon: "Compass", text: "Big Five Safari" },
      { icon: "Map", text: "Guided Bush Walks" },
      { icon: "Moon", text: "Night Drives" }
    ]
  }
];

export const staticPackages: Package[] = [
  {
    id: "cape-luxury",
    name: "Cape Luxury Escape",
    destination: "Cape Town",
    description: "5 days of pure luxury in the heart of Africa's most beautiful city.",
    price: 2450,
    image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&q=80"
  },
  {
    id: "safari-adventure",
    name: "Botswana Safari Adventure",
    destination: "Botswana",
    description: "7 days of wild adventure in the Okavango Delta.",
    price: 4800,
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80"
  },
  {
    id: "victoria-explorer",
    name: "Falls Explorer",
    destination: "Victoria Falls",
    description: "3 days of adrenaline and beauty at the falls.",
    price: 1200,
    image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=80"
  },
  {
    id: "migration-magic",
    name: "Serengeti Migration",
    destination: "Serengeti",
    description: "Witness the greatest show on earth.",
    price: 5500,
    image: "https://images.unsplash.com/photo-1523805081446-99395617521a?auto=format&fit=crop&q=80"
  },
  {
    id: "kruger-safari",
    name: "Kruger Classic Safari",
    destination: "Kruger National Park",
    description: "4 days immersive wildlife experience in the wild.",
    price: 1850,
    image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&q=80"
  }
];

export const staticStays: Stay[] = [
  {
    id: "the-silo",
    name: "The Silo Hotel",
    destination: "Cape Town",
    info: "A magical hotel towering above the V&A Waterfront.",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80"
  },
  {
    id: "chobe-lodge",
    name: "Chobe Game Lodge",
    destination: "Botswana",
    info: "Luxury safari lodge inside Chobe National Park.",
    image: "https://images.unsplash.com/photo-1493246507139-91e8bef99c02?auto=format&fit=crop&q=80"
  },
  {
    id: "victoria-hotel",
    name: "The Victoria Falls Hotel",
    destination: "Victoria Falls",
    info: "Elegance and history overlooking the falls bridge.",
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80"
  },
  {
    id: "serengeti-camp",
    name: "Four Seasons Serengeti",
    destination: "Serengeti",
    info: "Luxury in the heart of the wild.",
    image: "https://images.unsplash.com/photo-1493246507139-91e8bef99c02?auto=format&fit=crop&q=80"
  },
  {
    id: "kruger-lodge",
    name: "Singita Ebano",
    destination: "Kruger National Park",
    info: "Experience the ultimate in private safari luxury.",
    image: "https://images.unsplash.com/photo-1493246507139-91e8bef99c02?auto=format&fit=crop&q=80"
  },
  {
    id: "twelve-apostles",
    name: "Twelve Apostles Hotel",
    destination: "Cape Town",
    info: "Majestic views overlooking the Atlantic Ocean.",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80"
  }
];

export const staticExperiences: Experience[] = [
  { id: "helicopter-tour", name: "Helicopter Harbour Tour", destination: "Cape Town", price: 250 },
  { id: "safari-drive", name: "Big Five Game Drive", destination: "Botswana", price: 150 },
  { id: "devil-pool", name: "Devil's Pool Swim", destination: "Victoria Falls", price: 110 },
  { id: "balloon-serengeti", name: "Hot Air Balloon Safari", destination: "Serengeti", price: 599 },
  { id: "kruger-walk", name: "Guided Wilderness Walk", destination: "Kruger National Park", price: 85 },
  { id: "wine-tasting", name: "Private Wine Tasting", destination: "Cape Town", price: 120 }
];
