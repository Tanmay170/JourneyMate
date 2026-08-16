const mongoose = require("mongoose");
require("dotenv").config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

const DestinationSchema = new mongoose.Schema({
  title: String,
  slug: { type: String, unique: true },
  description: String,
  longDescription: String,
  image: String,
  gallery: [String],
  videos: [String],
  category: String,
  region: String,
  location: String,
  bestTimeToVisit: String,
  thingsToDo: [String],
  safetyTips: [String],
  localCulture: String,
  soloTravelerFriendly: Boolean,
  vibe: [String],
  stays: [mongoose.Schema.Types.Mixed],
  food: [mongoose.Schema.Types.Mixed],
  transport: mongoose.Schema.Types.Mixed,
  reviews: [mongoose.Schema.Types.Mixed]
});

const Destination = mongoose.models.Destination || mongoose.model("Destination", DestinationSchema);

const regions = {
  "North India (Himalayas & Valleys)": [
    "Spiti Valley", "Tirthan Valley", "Munsiyari", "Chopta", "Auli", "Kalpa", "Chitkul", "Zanskar", "Pangong", "Nubra Valley", "Kasol", "Kheerganga", "Malana", "Bir Billing"
  ],
  "South India (Ghats & Coasts)": [
    "Gokarna", "Varkala", "Munnar", "Wayanad", "Coorg", "Kodaikanal", "Coonoor", "Yercaud", "Athirappilly", "Maravanthe", "Dhanushkodi", "Gandikota", "Araku Valley", "Pondicherry", "Hampi"
  ],
  "East & Northeast India": [
    "Ziro Valley", "Tawang", "Majuli", "Cherrapunji", "Dawki", "Mawlynnong", "Loktak Lake", "Dzukou Valley", "Sandakphu", "Pelling", "Yumthang Valley", "Tsomgo Lake", "Bodh Gaya", "Sundarbans"
  ],
  "West & Central India": [
    "Rann of Kutch", "Diu", "Saputara", "Pachmarhi", "Bhedaghat", "Mandu", "Orchha", "Khajuraho", "Tarkarli", "Mahabaleshwar", "Lonavala", "Matheran", "Kaas Plateau", "Mount Abu", "Pushkar", "Jaisalmer", "Bundi"
  ]
};

const getImages = (keyword) => [
  `https://images.unsplash.com/photo-1598326269931-64d1732e4d0b?auto=format&fit=crop&q=80&w=1000`,
  `https://images.unsplash.com/photo-1626014903706-039130cb0bd5?auto=format&fit=crop&q=80&w=1000`,
  `https://images.unsplash.com/photo-1605230972233-5c0a0c4f830a?auto=format&fit=crop&q=80&w=1000`,
  `https://images.unsplash.com/photo-1596783074918-c84cb1a5e11d?auto=format&fit=crop&q=80&w=1000`,
  `https://images.unsplash.com/photo-1621217088195-bfdf14dc810f?auto=format&fit=crop&q=80&w=1000`
];

const getVideos = () => [
  "https://www.youtube.com/embed/dQw4w9WgXcQ", // Placeholder for actual destination videos
  "https://www.youtube.com/embed/J---aiyznGQ"
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB...");

    await Destination.deleteMany({});
    console.log("Cleared existing destinations.");

    let destinations = [];

    for (const [region, places] of Object.entries(regions)) {
      for (const place of places) {
        destinations.push({
          title: place,
          slug: place.toLowerCase().replace(/\s+/g, '-'),
          description: `Discover the breathtaking beauty of ${place}, a hidden gem for solo travelers and adventurers.`,
          longDescription: `${place} offers an incredible mix of pristine nature, local culture, and unforgettable experiences. Whether you're looking to hike, eat local cuisine, or just relax in a homestay, ${place} has it all.`,
          image: `https://source.unsplash.com/1000x800/?${encodeURIComponent(place)},india,nature`,
          gallery: getImages(place),
          videos: getVideos(),
          category: ["Mountains", "Beaches", "Cultural", "Spiritual", "Forest"][Math.floor(Math.random() * 5)],
          region: region,
          location: "India",
          bestTimeToVisit: "October to March",
          thingsToDo: ["Local Trekking", "Cafe Hopping", "Photography", "Cultural Tours"],
          safetyTips: ["Carry cash", "Respect local traditions", "Pack accordingly for weather"],
          soloTravelerFriendly: true,
          vibe: ["Adventure", "Chill", "Nature", "Spiritual"].sort(() => 0.5 - Math.random()).slice(0, 2),
          stays: [], // Will be populated dynamically by RapidAPI
          food: [], // Will be populated dynamically by Google Places API
          transport: {
            howToReach: [`Nearest airport is 100km away.`, `Local buses available from major cities.`],
            localTransport: []
          },
          reviews: []
        });
      }
    }

    await Destination.insertMany(destinations);
    console.log(`Successfully seeded ${destinations.length} destinations!`);
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
