import { NextResponse } from "next/server"
import { getDestinationBySlug, addReview } from "@/lib/db"

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const destination = await getDestinationBySlug(slug)

    if (!destination) {
      return NextResponse.json({ error: "Destination not found" }, { status: 404 })
    }

    return NextResponse.json({ reviews: destination.reviews })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const destination = await getDestinationBySlug(slug)

    if (!destination) {
      return NextResponse.json({ error: "Destination not found" }, { status: 404 })
    }

    const body = await request.json()

    // Validate request body
    if (!body.userId || !body.user || !body.rating || !body.comment) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const newReview = await addReview(destination.id || "", {
      userId: body.userId,
      user: body.user,
      rating: body.rating,
      date: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      comment: body.comment,
    })

    return NextResponse.json({ review: newReview }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to add review" }, { status: 500 })
  }
}

