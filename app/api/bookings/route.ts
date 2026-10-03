import { NextResponse } from "next/server"
import { z } from "zod"
import dbConnect from "@/lib/mongodb"
import Destination from "@/models/Destination"
import Booking from "@/models/Booking"
import { getSessionUser } from "@/lib/auth"

const bookingSchema = z
  .object({
    destinationSlug: z.string().min(1).max(200),
    stayName: z.string().min(1).max(200),
    price: z.string().min(1).max(100),
    checkInDate: z.coerce.date(),
    checkOutDate: z.coerce.date(),
    guests: z.number().int().min(1).max(20),
  })
  .refine((b) => b.checkOutDate > b.checkInDate, { message: "Check-out must be after check-in" })

export async function GET() {
  try {
    const user = await getSessionUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    await dbConnect()
    const bookings = await Booking.find({ userId: user.id }).sort({ createdAt: -1 }).lean()
    return NextResponse.json({ bookings: JSON.parse(JSON.stringify(bookings)) })
  } catch (error) {
    console.error("Failed to fetch bookings:", error)
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
  }
}

// Records a booking request as Pending. Payments are out of scope for this phase.
export async function POST(request: Request) {
  try {
    const user = await getSessionUser()
    if (!user) return NextResponse.json({ error: "Please log in to book" }, { status: 401 })

    const parsed = bookingSchema.safeParse(await request.json().catch(() => null))
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid booking" }, { status: 400 })
    }

    await dbConnect()
    const destination = await Destination.findOne({ slug: parsed.data.destinationSlug }).select("_id title slug")
    if (!destination) return NextResponse.json({ error: "Destination not found" }, { status: 404 })

    const booking = await Booking.create({
      userId: user.id,
      destinationId: destination._id,
      destinationSlug: destination.slug,
      destinationName: destination.title,
      stayName: parsed.data.stayName,
      price: parsed.data.price,
      checkInDate: parsed.data.checkInDate,
      checkOutDate: parsed.data.checkOutDate,
      guests: parsed.data.guests,
    })

    return NextResponse.json({ booking: JSON.parse(JSON.stringify(booking)) }, { status: 201 })
  } catch (error) {
    console.error("Failed to create booking:", error)
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
  }
}
