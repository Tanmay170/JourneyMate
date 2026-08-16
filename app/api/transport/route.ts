import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Destination from "@/models/Destination"

export async function GET(request: Request) {
  try {
    await dbConnect()
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("query")?.toLowerCase()

    const destinations = await Destination.find({})
    let allTransport: any[] = []

    destinations.forEach(dest => {
      if (dest.transport && dest.transport.localTransport) {
        dest.transport.localTransport.forEach((t: any) => {
          allTransport.push({
            ...t._doc || t,
            destinationSlug: dest.slug,
            destinationTitle: dest.title,
            howToReach: dest.transport.howToReach
          })
        })
      }
    })

    if (query) {
      allTransport = allTransport.filter(t => 
        t.type?.toLowerCase().includes(query) || 
        t.destinationTitle?.toLowerCase().includes(query)
      )
    }

    return NextResponse.json({ transport: allTransport })
  } catch (error) {
    console.error("Error fetching transport:", error)
    return NextResponse.json({ error: "Failed to fetch transport" }, { status: 500 })
  }
}
