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
