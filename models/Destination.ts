import mongoose from 'mongoose'

const DestinationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  longDescription: { type: String, required: true },
  image: { type: String, required: true },
  gallery: [{ type: String }],
  videos: [{ type: String }],
  category: { type: String, required: true },
  region: { type: String, required: true }, // e.g., Kumaon, Garhwal, Deccan
  location: { type: String, required: true },
  bestTimeToVisit: { type: String, required: true },
  thingsToDo: [{ type: String }],
  safetyTips: [{ type: String }],
  localCulture: { type: String },
  soloTravelerFriendly: { type: Boolean, default: false },
  vibe: [{ type: String }],
  
  stays: [{
    name: { type: String },
    type: { type: String }, // Hostel, Homestay
    priceRange: { type: String },
    location: { type: String },
    features: [{ type: String }],
    contact: { type: String },
    images: [{ type: String }],
  }],
  
  food: [{
    name: { type: String },
    type: { type: String }, // Cafe, Local Restaurant
    cuisine: { type: String },
    priceRange: { type: String },
    location: { type: String },
    vegOptions: { type: Boolean },
    nonVegOptions: { type: Boolean },
    specialties: [{ type: String }],
    images: [{ type: String }],
  }],
  
  transport: {
    howToReach: [{ type: String }],
    localTransport: [{
      type: { type: String },
      cost: { type: String },
      providers: [{ type: String }],
      contact: { type: String },
      schedule: { type: String },
    }]
  },
  
  reviews: [{
    userId: { type: String },
    user: { type: String },
    rating: { type: Number },
    date: { type: String },
    comment: { type: String },
  }]
}, { timestamps: true })

export default mongoose.models.Destination || mongoose.model('Destination', DestinationSchema)
