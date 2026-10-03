import { NextResponse } from "next/server"
import { z } from "zod"
import mongoose from "mongoose"
import dbConnect from "@/lib/mongodb"
import Itinerary from "@/models/Itinerary"
import { getSessionUser } from "@/lib/auth"
import { itinerarySchema } from "@/lib/itinerary-schema"
import { MAX_PROMPT_CHARS } from "@/lib/ai-guard"

const MAX_PER_USER = 50

const saveSchema = z.object({
  prompt: z.string().trim().min(1).max(MAX_PROMPT_CHARS),
  plan: itinerarySchema,
})

export async function GET() {
  try {
    const user = await getSessionUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    await dbConnect()
    const itineraries = await Itinerary.find({ userId: user.id }).sort({ createdAt: -1 }).lean()
    return NextResponse.json({ itineraries: JSON.parse(JSON.stringify(itineraries)) })
  } catch (error) {
    console.error("Failed to fetch itineraries:", error)
    return NextResponse.json({ error: "Failed to fetch itineraries" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getSessionUser()
    if (!user) return NextResponse.json({ error: "Please log in to save itineraries" }, { status: 401 })

    const parsed = saveSchema.safeParse(await request.json().catch(() => null))
    if (!parsed.success) return NextResponse.json({ error: "Invalid itinerary" }, { status: 400 })

    await dbConnect()
    if ((await Itinerary.countDocuments({ userId: user.id })) >= MAX_PER_USER) {
      return NextResponse.json({ error: `You can save up to ${MAX_PER_USER} itineraries` }, { status: 409 })
    }

    const itinerary = await Itinerary.create({
      userId: user.id,
      title: parsed.data.plan.tripTitle,
      prompt: parsed.data.prompt,
      plan: parsed.data.plan,
    })
    return NextResponse.json({ itinerary: JSON.parse(JSON.stringify(itinerary)) }, { status: 201 })
  } catch (error) {
    console.error("Failed to save itinerary:", error)
    return NextResponse.json({ error: "Failed to save itinerary" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getSessionUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const id = new URL(request.url).searchParams.get("id")
    if (!id || !mongoose.isValidObjectId(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 })

    await dbConnect()
    const result = await Itinerary.deleteOne({ _id: id, userId: user.id })
    if (result.deletedCount === 0) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json({ deleted: true })
  } catch (error) {
    console.error("Failed to delete itinerary:", error)
    return NextResponse.json({ error: "Failed to delete itinerary" }, { status: 500 })
  }
}
