import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Destination from "@/models/Destination"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("query")
  const category = searchParams.get("category")

  try {
    await dbConnect()
    let filter: any = {}

    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: 'i' } },
        { location: { $regex: query, $options: 'i' } },
        { region: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
        { vibe: { $regex: query, $options: 'i' } },
      ]
    }

    if (category && category !== "all") {
      filter.category = category
    }

    const destinations = await Destination.find(filter)
    return NextResponse.json({ destinations })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch destinations" }, { status: 500 })
  }
}

