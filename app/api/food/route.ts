import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Destination from "@/models/Destination"

export async function GET(request: Request) {
  try {
    await dbConnect()
    const { searchParams } = new URL(request.url)
    const destinationSlug = searchParams.get("destination")
    const query = searchParams.get("query")?.toLowerCase() || ""
    const type = searchParams.get("type")?.toLowerCase() || ""
    
    if (!destinationSlug) {
      const allDestinations = await Destination.find({})
      let allFood: any[] = []
      for (const d of allDestinations) {
        if (d.food && d.food.length > 0) {
          const mapped = d.food.map((f: any) => ({ ...f.toObject ? f.toObject() : f, destinationSlug: d.slug, destinationTitle: d.title }))
          allFood = [...allFood, ...mapped]
        }
      }

      if (type && type !== "all") {
        allFood = allFood.filter(f => f.type?.toLowerCase().includes(type) || type.includes(f.type?.toLowerCase()))
      }
      if (query) {
        allFood = allFood.filter(f => f.name?.toLowerCase().includes(query) || f.location?.toLowerCase().includes(query) || f.destinationTitle?.toLowerCase().includes(query))
      }

      return NextResponse.json({ food: allFood })
    }

    const dest = await Destination.findOne({ slug: destinationSlug })
    if (!dest) {
      return NextResponse.json({ error: "Destination not found" }, { status: 404 })
    }

    const apiKey = process.env.GOOGLE_PLACES_API_KEY
    if (!apiKey) {
      const dbFood = dest.food ? dest.food.map((f: any) => ({ ...f.toObject ? f.toObject() : f, destinationSlug: dest.slug, destinationTitle: dest.title })) : []
      return NextResponse.json({ food: dbFood }) // Graceful fallback to DB
    }

    // Google Places Text Search API
    const searchQuery = `${dest.title} restaurants cafes`
    const placesUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(searchQuery)}&key=${apiKey}`
    
    const res = await fetch(placesUrl)
    const data = await res.json()

    let liveFood = []
    
    if (data.results && data.results.length > 0) {
      liveFood = data.results.slice(0, 10).map((place: any) => ({
        name: place.name,
        type: place.types?.includes("cafe") ? "Cafe" : "Restaurant",
        cuisine: "Multi-Cuisine",
        priceRange: place.price_level ? "₹".repeat(place.price_level) : "₹₹",
        location: place.formatted_address,
        vegOptions: true,
        nonVegOptions: true,
        specialties: [],
        images: place.photos 
          ? [`https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${place.photos[0].photo_reference}&key=${apiKey}`] 
          : ["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1000"],
        rating: place.rating || 4.0,
        destinationTitle: dest.title
      }))
    }

    return NextResponse.json({ food: liveFood })
  } catch (error) {
    console.error("Error fetching live food:", error)
    return NextResponse.json({ error: "Failed to fetch food" }, { status: 500 })
  }
}
