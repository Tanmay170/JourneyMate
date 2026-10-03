"use client"

import { useState, useEffect } from "react"
import { Bed, Info } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookingModal } from "@/components/booking-modal"

export function LiveStays({ destinationSlug, destinationName }: { destinationSlug: string, destinationName: string }) {
  const [stays, setStays] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/stays?destination=${destinationSlug}`)
      .then(res => res.json())
      .then(data => {
        setStays(data.stays || [])
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [destinationSlug])

  if (loading) {
    return <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map(i => <div key={i} className="h-64 rounded-xl glass animate-pulse" />)}
    </div>
  }

  if (stays.length === 0) {
    return <p className="mt-6 text-muted-foreground">No stays found for this destination at the moment.</p>
  }

  return (
    <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {stays.map((stay, index) => (
        <Card key={index} className="overflow-hidden">
          <div className="aspect-[4/3] w-full overflow-hidden relative">
            <img src={stay.images?.[0] || "/placeholder.svg"} className="object-cover w-full h-full" alt={stay.name} />
            <Badge className="absolute top-2 right-2 bg-blue-600/90 hover:bg-blue-600">Live Availability</Badge>
          </div>
          <CardHeader>
            <CardTitle className="line-clamp-1">{stay.name}</CardTitle>
            <CardDescription className="line-clamp-1">
              {stay.type} • {stay.location}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <div className="flex items-center gap-2">
                <Bed className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold text-lg">{stay.priceRange}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Info className="h-4 w-4" />
                <span>Contact: {stay.contact}</span>
              </div>
              <div className="mt-4 pt-4 border-t border-border flex justify-end">
                <BookingModal stayName={stay.name} stayPrice={stay.priceRange} destinationName={destinationName} destinationSlug={destinationSlug} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
