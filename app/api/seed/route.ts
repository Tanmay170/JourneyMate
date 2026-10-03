import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Destination from '@/models/Destination'

const hashString = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
};

const regions = {
  "North India": [
    "Spiti Valley", "Tirthan Valley", "Munsiyari", "Chopta", "Auli", "Kalpa", "Chitkul", "Zanskar", "Pangong", "Nubra Valley", "Kasol", "Kheerganga", "Malana", "Bir Billing", "Kaza", "Tabo"
  ],
  "South India": [
    "Gokarna", "Varkala", "Munnar", "Wayanad", "Coorg", "Kodaikanal", "Coonoor", "Yercaud", "Athirappilly", "Maravanthe", "Dhanushkodi", "Gandikota", "Araku Valley", "Pondicherry", "Hampi"
  ],
  "East & Northeast India": [
    "Ziro Valley", "Tawang", "Majuli", "Cherrapunji", "Dawki", "Mawlynnong", "Loktak Lake", "Dzukou Valley", "Sandakphu", "Pelling", "Yumthang Valley", "Tsomgo Lake", "Bodh Gaya", "Sundarbans", "Kaziranga"
  ],
  "West & Central India": [
    "Rann of Kutch", "Diu", "Saputara", "Pachmarhi", "Bhedaghat", "Mandu", "Orchha", "Khajuraho", "Tarkarli", "Mahabaleshwar", "Lonavala", "Matheran", "Kaas Plateau", "Mount Abu", "Pushkar", "Jaisalmer"
  ]
};

const getImages = (keyword: string) => {
  const safeKeyword = encodeURIComponent(keyword.replace(/\s+/g, ','));
  return [
    `https://loremflickr.com/1000/800/${safeKeyword},india?random=1`,
    `https://loremflickr.com/1000/800/${safeKeyword},india?random=2`,
    `https://loremflickr.com/1000/800/${safeKeyword},india?random=3`
  ];
};

const getVideos = () => [
  "https://www.youtube.com/embed/dQw4w9WgXcQ"
];

const getCategory = (place: string) => {
  const lower = place.toLowerCase();
  if (lower.match(/valley|mountain|pass|auli|chopta|sandakphu|pelling|kaza|kalpa|chitkul/)) return "Mountains";
  if (lower.match(/beach|gokarna|varkala|diu|tarkarli|maravanthe|dhanushkodi/)) return "Beaches";
  if (lower.match(/temple|mathura|pushkar|varanasi|rishikesh|bodh gaya|spiti|tabo|monastery/)) return "Spiritual";
  if (lower.match(/forest|national park|sundarbans|kaziranga|wildlife|wayanad|coorg/)) return "Forest";
  if (lower.match(/island|majuli/)) return "Island";
  return "Cultural";
};

export async function GET() {
  // Destructive (wipes all destinations): development only.
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 })
  }

  try {
    await dbConnect()
    await Destination.deleteMany({})
    
    let destinations = []

    for (const [region, places] of Object.entries(regions)) {
      for (const place of places) {
        destinations.push({
          title: place,
          slug: place.toLowerCase().replace(/\s+/g, '-'),
          description: `Discover the breathtaking beauty of ${place}, a hidden gem for solo travelers and adventurers.`,
          longDescription: `${place} offers an incredible mix of pristine nature, local culture, and unforgettable experiences. Whether you're looking to hike, eat local cuisine, or just relax in a homestay, ${place} has it all.`,
          image: getImages(place)[0],
          gallery: getImages(place),
          videos: getVideos(),
          category: getCategory(place),
          region: region,
          location: "India",
          bestTimeToVisit: "October to March",
          thingsToDo: ["Local Trekking", "Cafe Hopping", "Photography", "Cultural Tours"],
          safetyTips: ["Carry cash", "Respect local traditions", "Pack accordingly for weather"],
          soloTravelerFriendly: true,
          vibe: ["Adventure", "Chill", "Nature", "Spiritual"].sort(() => 0.5 - Math.random()).slice(0, 2),
          stays: [
            {
              name: `${place} Eco Retreat`,
              type: "Hostel",
              priceRange: "₹800-1500 per night",
              location: place,
              features: ["Dormitories", "Private rooms", "Common area", "Cafe"],
              contact: "+91 9876543210",
              images: [`https://loremflickr.com/1000/800/hostel,india?lock=${hashString(place + 'hostel')}`]
            },
            {
              name: `Authentic ${place} Homestay`,
              type: "Homestay",
              priceRange: "₹1200-2000 per night",
              location: place,
              features: ["Authentic experience", "Home-cooked meals", "Cultural immersion"],
              contact: "+91 9876543212",
              images: [`https://loremflickr.com/1000/800/homestay,india?lock=${hashString(place + 'homestay')}`]
            }
          ],
          food: [
            {
              name: `The Great ${place} Cafe`,
              type: "Cafe",
              cuisine: "Multi-cuisine",
              priceRange: "₹200-500 per person",
              location: place,
              vegOptions: true,
              nonVegOptions: true,
              specialties: ["Local delicacies", "Momos", "Thukpa"],
              images: [`https://loremflickr.com/1000/800/cafe,india?lock=${hashString(place + 'cafe1')}`]
            },
            {
              name: `${place} Traditional Diner`,
              type: "Local Restaurant",
              cuisine: "Local cuisine",
              priceRange: "₹150-400 per person",
              location: place,
              vegOptions: true,
              nonVegOptions: false,
              specialties: ["Authentic thali", "Street food style"],
              images: [`https://loremflickr.com/1000/800/food,india?lock=${hashString(place + 'food2')}`]
            }
          ],
          transport: {
            howToReach: [`Nearest airport is 100km away.`, `Local buses available from major cities.`],
            localTransport: []
          },
          reviews: []
        });
      }
    }

    await Destination.insertMany(destinations)
    
    return NextResponse.json({ message: "Database seeded successfully with 62 destinations!", count: destinations.length })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
