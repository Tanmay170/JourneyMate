import dbConnect from "@/lib/mongodb"
import DestinationModel from "@/models/Destination"

// Types
export interface Destination {
  id?: string
  _id?: string
  title: string
  slug: string
  description: string
  longDescription: string
  image: string
  gallery: string[]
  videos?: string[]
  category: string
  location: string
  bestTimeToVisit: string
  thingsToDo: string[]
  safetyTips: string[]
  localCulture: string
  stays: Stay[]
  food: FoodPlace[]
  transport: Transport
  reviews: Review[]
}

export interface Stay {
  id: string
  name: string
  type: string
  priceRange: string
  location: string
  features: string[]
  contact: string
}

export interface FoodPlace {
  id: string
  name: string
  type: string
  cuisine: string
  priceRange: string
  location: string
  vegOptions: boolean
  nonVegOptions: boolean
  specialties: string[]
}

export interface Transport {
  howToReach: string[]
  localTransport: LocalTransport[]
}

export interface LocalTransport {
  type: string
  cost: string
  providers: string[]
  contact?: string
  schedule?: string
}

export interface Review {
  id: string
  userId: string
  user: string
  rating: number
  date: string
  comment: string
}

export interface User {
  id: string
  name: string
  email: string
  image?: string
}

// Mock data
const destinations: Destination[] = [
  {
    id: "1",
    title: "Spiti Valley",
    slug: "spiti-valley",
    description: "A cold desert mountain valley located high in the Himalayas in Himachal Pradesh",
    longDescription:
      "Spiti Valley, located in the northeastern part of Himachal Pradesh, is a desert mountain valley that's known for its pristine landscapes, ancient monasteries, and unique culture. With an average altitude of 12,500 feet above sea level, it offers breathtaking views of snow-capped mountains, crystal clear rivers, and starry night skies.",
    image: "/images/spiti_valley.png",
    gallery: [
      "/images/spiti_valley.png",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    category: "Mountains",
    location: "Himachal Pradesh",
    bestTimeToVisit: "May to October",
    thingsToDo: [
      "Visit Key Monastery",
      "Trek to Chandratal Lake",
      "Explore Kibber Village",
      "Stargazing",
      "Visit Dhankar Monastery",
    ],
    safetyTips: [
      "Acclimatize properly to avoid altitude sickness",
      "Carry warm clothes even in summer",
      "Keep emergency contacts handy",
      "Travel in groups if possible",
      "Inform someone about your itinerary",
    ],
    localCulture:
      "Spiti Valley has a rich Buddhist culture with influences from Tibetan traditions. The locals are known for their hospitality and simple lifestyle. The valley is home to some of the oldest monasteries in the region.",
    stays: [
      {
        id: "s1",
        name: "Zostel Spiti",
        type: "Hostel",
        priceRange: "₹800-1500 per night",
        location: "Kaza",
        features: ["Dormitories", "Private rooms", "Common area", "Cafe"],
        contact: "+91 9876543210",
      },
      {
        id: "s2",
        name: "Deyzor",
        type: "Hotel",
        priceRange: "₹2500-4000 per night",
        location: "Kaza",
        features: ["Private rooms", "Restaurant", "Mountain views", "Hot water"],
        contact: "+91 9876543211",
      },
      {
        id: "s3",
        name: "Himalayan Homestay",
        type: "Homestay",
        priceRange: "₹1200-2000 per night",
        location: "Kibber Village",
        features: ["Authentic experience", "Home-cooked meals", "Cultural immersion"],
        contact: "+91 9876543212",
      },
    ],
    food: [
      {
        id: "f1",
        name: "The Himalayan Cafe",
        type: "Cafe",
        cuisine: "Multi-cuisine",
        priceRange: "₹200-500 per person",
        location: "Kaza Market",
        vegOptions: true,
        nonVegOptions: true,
        specialties: ["Tibetan Thukpa", "Momos", "Israeli dishes", "Continental breakfast"],
      },
      {
        id: "f2",
        name: "Sol Cafe",
        type: "Cafe",
        cuisine: "Continental, Tibetan",
        priceRange: "₹250-600 per person",
        location: "Kaza",
        vegOptions: true,
        nonVegOptions: true,
        specialties: ["Sea buckthorn juice", "Tibetan bread", "Espresso coffee"],
      },
      {
        id: "f3",
        name: "Taste of Spiti",
        type: "Local Restaurant",
        cuisine: "Local Spitian, Tibetan",
        priceRange: "₹150-400 per person",
        location: "Near Key Monastery",
        vegOptions: true,
        nonVegOptions: false,
        specialties: ["Thentuk", "Skyu", "Chhurpi soup", "Butter tea"],
      },
    ],
    transport: {
      howToReach: [
        "By Road: From Delhi to Manali (12-14 hours), then Manali to Kaza (10-12 hours)",
        "By Air: Nearest airport is Kullu-Manali Airport (Bhuntar), then take a taxi to Kaza",
        "By Train: Nearest railway station is Joginder Nagar, then take a bus or taxi to Kaza",
      ],
      localTransport: [
        {
          type: "Bike Rental",
          cost: "₹1000-1500 per day",
          providers: ["Himalayan Bike Rentals", "Spiti Adventures"],
          contact: "+91 9876543213",
        },
        {
          type: "Taxi",
          cost: "₹2500-3500 per day",
          providers: ["Spiti Taxi Association", "Local drivers"],
          contact: "+91 9876543214",
        },
        {
          type: "Bus",
          cost: "₹300-500 per journey",
          providers: ["HRTC (Himachal Road Transport Corporation)"],
          schedule: "Limited service, usually one bus per day from Kaza to major villages",
        },
      ],
    },
    reviews: [
      {
        id: "r1",
        userId: "u1",
        user: "Rahul Sharma",
        rating: 5,
        date: "August 2023",
        comment:
          "One of the most beautiful places I've ever visited. The landscapes are breathtaking and the local culture is fascinating. Highly recommend visiting Key Monastery and Chandratal Lake.",
      },
      {
        id: "r2",
        userId: "u2",
        user: "Priya Patel",
        rating: 4,
        date: "July 2023",
        comment:
          "Amazing experience! The roads are quite challenging but the views make it all worth it. Make sure to acclimatize properly to avoid altitude sickness.",
      },
      {
        id: "r3",
        userId: "u3",
        user: "Alex Johnson",
        rating: 5,
        date: "September 2023",
        comment:
          "Spiti Valley is a hidden gem. The starry night skies are unbelievable. Stayed at a homestay in Kibber and had the most authentic experience with the locals.",
      },
    ],
  },
  {
    id: "2",
    title: "Ziro Valley",
    slug: "ziro-valley",
    description: "Home to the Apatani tribe and famous for its paddy-cum-fish cultivation",
    longDescription:
      "Ziro Valley in Arunachal Pradesh is known for its distinctive paddy-cum-fish cultivation method and is home to the Apatani tribe. The valley offers stunning landscapes with rice fields, pine-covered hills, and a unique cultural experience.",
    image: "/images/ziro_valley.png",
    gallery: [
      "/images/ziro_valley.png",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    category: "Cultural",
    location: "Arunachal Pradesh",
    bestTimeToVisit: "March to October",
    thingsToDo: [
      "Attend Ziro Music Festival (September)",
      "Visit Apatani villages",
      "Trek to Talle Valley Wildlife Sanctuary",
      "Explore Meghna Cave Temple",
      "Experience local rice beer tasting",
    ],
    safetyTips: [
      "Obtain Inner Line Permit before visiting",
      "Respect local customs and traditions",
      "Carry cash as ATMs are limited",
      "Book accommodations in advance",
      "Hire local guides for village visits",
    ],
    localCulture:
      "The Apatani tribe is known for their sustainable farming practices and unique cultural traditions. Women traditionally wore large nose plugs and facial tattoos, though this practice is now limited to the older generation.",
    stays: [
      {
        id: "s4",
        name: "Ziro Valley Resort",
        type: "Resort",
        priceRange: "₹2500-4000 per night",
        location: "Old Ziro",
        features: ["Cottages", "Restaurant", "Valley views", "Cultural programs"],
        contact: "+91 9876543215",
      },
      {
        id: "s5",
        name: "Apatani Homestay",
        type: "Homestay",
        priceRange: "₹1000-1800 per night",
        location: "Hong Village",
        features: ["Traditional house", "Home-cooked meals", "Cultural immersion"],
        contact: "+91 9876543216",
      },
      {
        id: "s6",
        name: "Blue Pine Hotel",
        type: "Hotel",
        priceRange: "₹1800-3000 per night",
        location: "New Ziro",
        features: ["Modern rooms", "Restaurant", "Wi-Fi", "Room service"],
        contact: "+91 9876543217",
      },
    ],
    food: [
      {
        id: "f4",
        name: "Apatani Kitchen",
        type: "Local Restaurant",
        cuisine: "Apatani, North Eastern",
        priceRange: "₹200-400 per person",
        location: "Hong Village",
        vegOptions: true,
        nonVegOptions: true,
        specialties: ["Bamboo shoot pickle", "Smoked meat", "Rice beer", "Fish curry"],
      },
      {
        id: "f5",
        name: "Ziro Cafe",
        type: "Cafe",
        cuisine: "Multi-cuisine",
        priceRange: "₹250-500 per person",
        location: "New Ziro",
        vegOptions: true,
        nonVegOptions: true,
        specialties: ["Momos", "Thukpa", "Coffee", "Sandwiches"],
      },
      {
        id: "f6",
        name: "Valley View Restaurant",
        type: "Restaurant",
        cuisine: "North Indian, Chinese",
        priceRange: "₹300-600 per person",
        location: "Old Ziro",
        vegOptions: true,
        nonVegOptions: true,
        specialties: ["Butter chicken", "Noodles", "Paneer dishes", "Local thalis"],
      },
    ],
    transport: {
      howToReach: [
        "By Air: Nearest airport is Tezpur (Assam), then 4-5 hours drive",
        "By Train: Nearest railway station is North Lakhimpur (Assam), then 3-4 hours drive",
        "By Road: From Itanagar (state capital), 4-5 hours drive",
      ],
      localTransport: [
        {
          type: "Shared Sumo/Taxi",
          cost: "₹200-300 per person",
          providers: ["Local taxi stand"],
          contact: "Available at taxi stands",
        },
        {
          type: "Private Taxi",
          cost: "₹2000-3000 per day",
          providers: ["Local drivers"],
          contact: "+91 9876543218",
        },
        {
          type: "Two-wheeler Rental",
          cost: "₹800-1200 per day",
          providers: ["Ziro Bike Rentals"],
          contact: "+91 9876543219",
        },
      ],
    },
    reviews: [
      {
        id: "r4",
        userId: "u4",
        user: "Vikram Singh",
        rating: 5,
        date: "October 2023",
        comment:
          "Ziro Valley is a cultural paradise! The Apatani villages are fascinating, and the rice fields create a stunning landscape. Don't miss trying the local rice beer.",
      },
      {
        id: "r5",
        userId: "u5",
        user: "Meera Reddy",
        rating: 4,
        date: "September 2023",
        comment:
          "Visited during the Ziro Music Festival and had an amazing time. The combination of music, nature, and culture is perfect. Homestays provide the best experience.",
      },
      {
        id: "r6",
        userId: "u6",
        user: "David Miller",
        rating: 5,
        date: "April 2023",
        comment:
          "One of the most unique places I've visited in India. The sustainable farming practices of the Apatani tribe are impressive. Highly recommend hiring a local guide.",
      },
    ],
  },
  {
    id: "3",
    title: "Majuli",
    slug: "majuli",
    description: "The world's largest river island and hub of Assamese neo-Vaishnavite culture",
    longDescription:
      "Majuli, nestled in the Brahmaputra River, is the world's largest river island. It's a lush green, pollution-free freshwater island that attracts tourists from all over the world. Majuli is the cultural capital of Assam and the cradle of Assamese civilization.",
    image: "/images/majuli.png",
    gallery: [
      "/images/majuli.png",
    ],
    category: "Cultural",
    location: "Assam",
    bestTimeToVisit: "October to March",
    thingsToDo: [
      "Visit Satras (Neo-Vaishnavite Monasteries)",
      "Bird watching",
      "Boat ride in the Brahmaputra",
      "Experience local Mishing tribe culture",
    ],
    safetyTips: [
      "Avoid monsoon season due to heavy floods",
      "Carry insect repellent",
      "Dress modestly when visiting Satras",
    ],
    localCulture:
      "Majuli is deeply rooted in neo-Vaishnavite culture. The island is dotted with Satras, which are institutional centers that impart cultural and religious teachings. The Mishing tribe also has a significant presence, known for their unique stilt houses and vibrant festivals.",
    stays: [
      {
        id: "s7",
        name: "Yggdrasill Bamboo Cottage",
        type: "Cottage",
        priceRange: "₹1500-2500 per night",
        location: "Kamalabari",
        features: ["Bamboo architecture", "River view", "Eco-friendly"],
        contact: "+91 9876543220",
      },
    ],
    food: [
      {
        id: "f7",
        name: "Mishing Kitchen",
        type: "Local Restaurant",
        cuisine: "Mishing, Assamese",
        priceRange: "₹200-400 per person",
        location: "Garamur",
        vegOptions: true,
        nonVegOptions: true,
        specialties: ["Apong (Rice Beer)", "Smoked Pork", "Fish Curry in Bamboo"],
      },
    ],
    transport: {
      howToReach: [
        "By Air: Nearest airport is Jorhat, then take a ferry from Nimati Ghat to Majuli",
        "By Train: Nearest station is Jorhat, followed by a ferry",
      ],
      localTransport: [
        {
          type: "Bicycle Rental",
          cost: "₹150-300 per day",
          providers: ["Local shops"],
          contact: "+91 9876543221",
        },
      ],
    },
    reviews: [],
  },
  {
    id: "4",
    title: "Tawang",
    slug: "tawang",
    description: "Home to the 400-year-old Tawang Monastery, the largest monastery in India",
    longDescription:
      "Tawang, located at an altitude of about 10,000 feet, is known for its beautiful monasteries, high altitude passes, and scenic lakes. It holds immense spiritual significance for Buddhists and offers spectacular views of the Himalayas.",
    image: "/images/tawang.png",
    gallery: [
      "/images/tawang.png",
    ],
    category: "Spiritual",
    location: "Arunachal Pradesh",
    bestTimeToVisit: "March to May, September to October",
    thingsToDo: [
      "Visit Tawang Monastery",
      "See Sela Pass",
      "Explore Madhuri Lake (Sangetsar Lake)",
      "Pay respects at Tawang War Memorial",
    ],
    safetyTips: [
      "Inner Line Permit (ILP) required",
      "Prepare for sub-zero temperatures in winter",
      "Roads can be treacherous; hire experienced drivers",
    ],
    localCulture:
      "Tawang is predominantly inhabited by the Monpa people, who follow Tibetan Buddhism. The culture is heavily influenced by Buddhist traditions, visible in their festivals like Losar (New Year).",
    stays: [
      {
        id: "s8",
        name: "Hotel Tawang Holiday",
        type: "Hotel",
        priceRange: "₹3000-5000 per night",
        location: "Old Market",
        features: ["Heaters provided", "Restaurant", "Valley views"],
        contact: "+91 9876543222",
      },
    ],
    food: [
      {
        id: "f8",
        name: "The Dragon",
        type: "Restaurant",
        cuisine: "Tibetan, Monpa",
        priceRange: "₹300-600 per person",
        location: "Old Market",
        vegOptions: true,
        nonVegOptions: true,
        specialties: ["Thukpa", "Zan", "Momos"],
      },
    ],
    transport: {
      howToReach: [
        "By Air: Nearest airport is Salonibari Airport in Tezpur (Assam), 300+ km away",
        "By Road: Long drive from Tezpur or Guwahati via Sela Pass",
      ],
      localTransport: [
        {
          type: "Private Taxi",
          cost: "₹3000-4500 per day",
          providers: ["Local Taxi Union"],
          contact: "+91 9876543223",
        },
      ],
    },
    reviews: [],
  }
]


// Mock database functions
export async function getDestinations() {
  return destinations
}

export async function getDestinationBySlug(slug: string) {
  await dbConnect()
  const dest = await DestinationModel.findOne({ slug }).lean()
  if (!dest) return null;
  // Convert ObjectId to string and clean up for Client Components
  return JSON.parse(JSON.stringify(dest))
}

export async function getDestinationsByCategory(category: string) {
  return destinations.filter((d) => d.category === category)
}

export async function searchDestinations(query: string) {
  const lowercaseQuery = query.toLowerCase()
  return destinations.filter(
    (d) =>
      d.title.toLowerCase().includes(lowercaseQuery) ||
      d.description.toLowerCase().includes(lowercaseQuery) ||
      d.location.toLowerCase().includes(lowercaseQuery) ||
      d.category.toLowerCase().includes(lowercaseQuery),
  )
}

export async function addReview(destinationId: string, review: Omit<Review, "id">) {
  const destination = destinations.find((d) => d.id === destinationId)
  if (!destination) return null

  const newReview = {
    ...review,
    id: `r${Date.now()}`,
  }

  destination.reviews.push(newReview)
  return newReview
}

