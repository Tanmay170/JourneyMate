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

interface BookingModalProps {
  stayName: string
  stayPrice: string
  destinationName: string
}

export function BookingModal({ stayName, stayPrice, destinationName }: BookingModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate API call for booking
    setTimeout(() => {
      setLoading(false)
      setOpen(false)
      
      // We will save to localStorage for the dashboard mock
      const existingBookings = JSON.parse(localStorage.getItem("mock_bookings") || "[]")
      existingBookings.push({
        id: Math.random().toString(36).substring(7),
        stayName,
        destinationName,
        price: stayPrice,
        date: new Date().toISOString(),
        status: "Confirmed"
      })
      localStorage.setItem("mock_bookings", JSON.stringify(existingBookings))

      toast.success("Booking Confirmed!", {
        description: `Your stay at ${stayName} is confirmed.`
      })
    }, 1500)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
              <Input id="checkin" type="date" className="col-span-3 glass" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="checkout" className="text-right">
                Check-out
              </Label>
              <Input id="checkout" type="date" className="col-span-3 glass" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="guests" className="text-right">
                Guests
              </Label>
              <Input id="guests" type="number" min="1" defaultValue="2" className="col-span-3 glass" required />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Confirming..." : "Confirm Booking"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
