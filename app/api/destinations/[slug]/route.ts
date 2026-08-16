import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Destination from "@/models/Destination"

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await dbConnect()
    const { slug } = await params
    const destination = await Destination.findOne({ slug })

    if (!destination) {
      return NextResponse.json({ error: "Destination not found" }, { status: 404 })
    }

    return NextResponse.json({ destination })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch destination" }, { status: 500 })
  }
}

