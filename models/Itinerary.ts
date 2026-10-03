import mongoose from 'mongoose'

const ItinerarySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true },
  prompt: { type: String, required: true },
  plan: { type: mongoose.Schema.Types.Mixed, required: true }, // validated against lib/itinerary-schema.ts
}, { timestamps: true })

export default mongoose.models.Itinerary || mongoose.model('Itinerary', ItinerarySchema)
