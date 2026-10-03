import { NextResponse } from "next/server"
import { z } from "zod"
import dbConnect from "@/lib/mongodb"
import Destination from "@/models/Destination"
import User from "@/models/User"
import { getSessionUser } from "@/lib/auth"

const bodySchema = z.object({ slug: z.string().min(1).max(200) })

export async function GET() {
  try {
    const user = await getSessionUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    await dbConnect()
    const doc = await User.findById(user.id)
      .populate({ path: "savedDestinations", select: "title slug image location category description" })
      .lean()
    return NextResponse.json({ saved: JSON.parse(JSON.stringify(doc?.savedDestinations ?? [])) })
  } catch (error) {
    console.error("Failed to fetch saved destinations:", error)
    return NextResponse.json({ error: "Failed to fetch saved destinations" }, { status: 500 })
  }
}

async function update(request: Request, op: "$addToSet" | "$pull") {
  try {
    const user = await getSessionUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const parsed = bodySchema.safeParse(await request.json().catch(() => null))
    if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 })

    await dbConnect()
    const destination = await Destination.findOne({ slug: parsed.data.slug }).select("_id")
    if (!destination) return NextResponse.json({ error: "Destination not found" }, { status: 404 })

    await User.updateOne({ _id: user.id }, { [op]: { savedDestinations: destination._id } })
    return NextResponse.json({ saved: op === "$addToSet" })
  } catch (error) {
    console.error("Failed to update saved destinations:", error)
    return NextResponse.json({ error: "Failed to update saved destinations" }, { status: 500 })
  }
}

export const POST = (request: Request) => update(request, "$addToSet")
export const DELETE = (request: Request) => update(request, "$pull")
