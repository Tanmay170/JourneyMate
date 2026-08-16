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
      let allStays: any[] = []
      for (const d of allDestinations) {
        if (d.stays && d.stays.length > 0) {
          const mapped = d.stays.map((s: any) => ({ ...s.toObject ? s.toObject() : s, destinationSlug: d.slug, destinationTitle: d.title }))
          allStays = [...allStays, ...mapped]
        }
      }

      if (type && type !== "all") {
        allStays = allStays.filter(s => s.type?.toLowerCase().includes(type) || type.includes(s.type?.toLowerCase()))
      }
      if (query) {
        allStays = allStays.filter(s => s.name?.toLowerCase().includes(query) || s.location?.toLowerCase().includes(query) || s.destinationTitle?.toLowerCase().includes(query))
      }

      return NextResponse.json({ stays: allStays })
    }

    const dest = await Destination.findOne({ slug: destinationSlug })
    if (!dest) {
      return NextResponse.json({ error: "Destination not found" }, { status: 404 })
    }

    const rapidApiKey = process.env.RAPIDAPI_KEY
    if (!rapidApiKey) {
      const dbStays = dest.stays ? dest.stays.map((s: any) => ({ ...s.toObject ? s.toObject() : s, destinationSlug: dest.slug, destinationTitle: dest.title })) : []
      return NextResponse.json({ stays: dbStays }) // Graceful fallback to DB
    }

    // Step 1: Search for location ID using RapidAPI Booking.com
    const locationRes = await fetch(`https://booking-com15.p.rapidapi.com/api/v1/hotels/searchDestination?query=${encodeURIComponent(dest.title)}`, {
      headers: {
        'X-RapidAPI-Key': rapidApiKey,
        'X-RapidAPI-Host': 'booking-com15.p.rapidapi.com'
      }
    })
    
    const locationData = await locationRes.json()
    const locationId = locationData.data?.[0]?.dest_id || null

    let liveStays = []

    if (locationId) {
      // Step 2: Fetch hotels for that location (dummy dates for general availability)
      const checkin = new Date()
      checkin.setDate(checkin.getDate() + 14) // 2 weeks from now
      const checkout = new Date(checkin)
      checkout.setDate(checkout.getDate() + 2)

      const inDate = checkin.toISOString().split('T')[0]
      const outDate = checkout.toISOString().split('T')[0]

      const hotelsRes = await fetch(`https://booking-com15.p.rapidapi.com/api/v1/hotels/searchHotels?dest_id=${locationId}&search_type=CITY&arrival_date=${inDate}&departure_date=${outDate}&adults=1&room_qty=1&page_number=1`, {
        headers: {
          'X-RapidAPI-Key': rapidApiKey,
          'X-RapidAPI-Host': 'booking-com15.p.rapidapi.com'
        }
      })
      
      const hotelsData = await hotelsRes.json()

      if (hotelsData.data && hotelsData.data.hotels) {
        liveStays = hotelsData.data.hotels.slice(0, 10).map((hotel: any) => ({
          name: hotel.property.name,
          type: "Hotel / Hostel",
          priceRange: hotel.property.priceBreakdown?.grossPrice?.value ? `₹${Math.round(hotel.property.priceBreakdown.grossPrice.value * 90)}` : "₹1500 - ₹3000",
          location: `${hotel.property.wishlistName || dest.title}`,
          features: ["Free WiFi", "Live Booking"],
          contact: "Book via Booking.com",
          images: hotel.property.photoUrls || ["https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1000"],
          rating: hotel.property.reviewScore || 4.0,
          destinationTitle: dest.title
        }))
      }
    }

    return NextResponse.json({ stays: liveStays })
  } catch (error) {
    console.error("Error fetching live stays:", error)
    return NextResponse.json({ error: "Failed to fetch stays" }, { status: 500 })
  }
}
