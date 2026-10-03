import { NextResponse } from "next/server"
import { z } from "zod"
import dbConnect from "@/lib/mongodb"
import Destination from "@/models/Destination"
import { getSessionUser } from "@/lib/auth"

const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().min(1).max(2000),
})

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    await dbConnect()
    const destination = await Destination.findOne({ slug }).select("reviews").lean()
    if (!destination) {
      return NextResponse.json({ error: "Destination not found" }, { status: 404 })
    }
    return NextResponse.json({ reviews: destination.reviews })
  } catch (error) {
    console.error("Failed to fetch reviews:", error)
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const user = await getSessionUser()
    if (!user) {
      return NextResponse.json({ error: "Please log in to write a review" }, { status: 401 })
    }

    const parsed = reviewSchema.safeParse(await request.json().catch(() => null))
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid review" }, { status: 400 })
    }

    const { slug } = await params
    await dbConnect()

    const review = {
      userId: user.id,
      user: user.name,
      rating: parsed.data.rating,
      comment: parsed.data.comment,
      date: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    }

    // One review per user per destination; the filter makes the check atomic.
    const result = await Destination.updateOne(
      { slug, "reviews.userId": { $ne: user.id } },
      { $push: { reviews: review } },
    )

    if (result.matchedCount === 0) {
      const exists = await Destination.exists({ slug })
      return exists
        ? NextResponse.json({ error: "You have already reviewed this destination" }, { status: 409 })
        : NextResponse.json({ error: "Destination not found" }, { status: 404 })
    }

    return NextResponse.json({ review }, { status: 201 })
  } catch (error) {
    console.error("Failed to add review:", error)
    return NextResponse.json({ error: "Failed to add review" }, { status: 500 })
  }
}
