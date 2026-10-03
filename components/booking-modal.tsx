"use client"

import { useState } from "react"
import { Calendar, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

interface BookingModalProps {
  stayName: string
  stayPrice: string
  destinationName: string
  destinationSlug: string
}

export function BookingModal({ stayName, stayPrice, destinationName, destinationSlug }: BookingModalProps) {
  const { status } = useSession()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleBook = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    setLoading(true)

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destinationSlug,
          stayName,
          price: stayPrice,
          checkInDate: form.get("checkin"),
          checkOutDate: form.get("checkout"),
          guests: Number(form.get("guests")),
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || "Failed to create booking")

      setOpen(false)
      toast.success("Booking requested!", {
        description: `Your request for ${stayName} is pending. Track it in your dashboard.`,
      })
    } catch (error: any) {
      toast.error(error.message || "Failed to create booking")
    } finally {
      setLoading(false)
    }
  }

  const handleOpenChange = (next: boolean) => {
    if (next && status !== "authenticated") {
      router.push(`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`)
      return
    }
    setOpen(next)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm" className="bg-primary/20 text-primary hover:bg-primary/30">
          Book Now
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] glass border-white/20">
        <DialogHeader>
          <DialogTitle>Book your stay</DialogTitle>
          <DialogDescription>
            {stayName} in {destinationName}
            <div className="font-semibold text-primary mt-1">{stayPrice}</div>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleBook}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="checkin" className="text-right">
                Check-in
              </Label>
              <Input id="checkin" name="checkin" type="date" className="col-span-3 glass" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="checkout" className="text-right">
                Check-out
              </Label>
              <Input id="checkout" name="checkout" type="date" className="col-span-3 glass" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="guests" className="text-right">
                Guests
              </Label>
              <Input id="guests" name="guests" type="number" min="1" defaultValue="2" className="col-span-3 glass" required />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Requesting..." : "Request Booking"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
