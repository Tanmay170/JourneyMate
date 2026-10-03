"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Calendar, MapPin, CheckCircle, Clock, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DashboardPage() {
  const [bookings, setBookings] = useState<any[]>([])
  const [saved, setSaved] = useState<any[]>([])
  const [itineraries, setItineraries] = useState<any[]>([])

  const deleteItinerary = async (id: string) => {
    const res = await fetch(`/api/itineraries?id=${id}`, { method: "DELETE" })
    if (!res.ok) return toast.error("Could not delete itinerary")
    setItineraries((list) => list.filter((i) => i._id !== id))
  }

  useEffect(() => {
    fetch("/api/bookings")
      .then((res) => (res.ok ? res.json() : { bookings: [] }))
      .then((data) => setBookings(data.bookings))
      .catch(() => {})
    fetch("/api/itineraries")
      .then((res) => (res.ok ? res.json() : { itineraries: [] }))
      .then((data) => setItineraries(data.itineraries))
      .catch(() => {})
    fetch("/api/saved")
      .then((res) => (res.ok ? res.json() : { saved: [] }))
      .then((data) => setSaved(data.saved))
      .catch(() => {})
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/60 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <span className="text-primary">Offbeat</span><span>India</span>
          </Link>
          <div className="hidden md:flex md:gap-4">
            <Link href="/destinations" className="text-sm font-medium hover:text-primary">Destinations</Link>
            <Link href="/stays" className="text-sm font-medium hover:text-primary">Stays</Link>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Your Dashboard</h1>
          <p className="text-muted-foreground mt-2">Manage your bookings, itineraries, and saved destinations.</p>
        </div>

        <Tabs defaultValue="bookings" className="w-full">
          <TabsList className="mb-6 glass">
            <TabsTrigger value="bookings">My Bookings</TabsTrigger>
            <TabsTrigger value="saved">Saved Destinations</TabsTrigger>
            <TabsTrigger value="itineraries">My Itineraries</TabsTrigger>
          </TabsList>
          
          <TabsContent value="bookings">
            {bookings.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {bookings.map((booking) => (
                  <Card key={booking._id} className="glass">
                    <CardHeader>
                      <CardTitle className="flex justify-between items-center">
                        <span className="text-lg">{booking.stayName}</span>
                        <span
                          className={`text-sm font-normal flex items-center gap-1 ${
                            booking.status === "Confirmed" ? "text-green-500" : "text-muted-foreground"
                          }`}
                        >
                          {booking.status === "Confirmed" ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                          {booking.status}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-muted-foreground text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary" /> {booking.destinationName}
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary" /> {new Date(booking.checkInDate).toLocaleDateString()} – {new Date(booking.checkOutDate).toLocaleDateString()} · {booking.guests} guest{booking.guests > 1 ? "s" : ""}
                        </div>
                        <div className="font-semibold text-foreground pt-2 border-t border-border mt-2">
                          {booking.price}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 glass rounded-xl border border-white/10">
                <p className="text-muted-foreground mb-4">You have no upcoming bookings.</p>
                <Link href="/stays">
                  <Button>Explore Stays</Button>
                </Link>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="saved">
            {saved.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {saved.map((dest) => (
                  <Link key={dest._id} href={`/destinations/${dest.slug}`}>
                    <Card className="glass overflow-hidden transition hover:border-primary/50">
                      <img src={dest.image} alt={dest.title} className="h-40 w-full object-cover" />
                      <CardHeader>
                        <CardTitle className="text-lg">{dest.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary" /> {dest.location}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 glass rounded-xl border border-white/10">
                <p className="text-muted-foreground mb-4">You haven't saved any destinations yet.</p>
                <Link href="/destinations">
                  <Button>Explore Destinations</Button>
                </Link>
              </div>
            )}
          </TabsContent>

          <TabsContent value="itineraries">
            {itineraries.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                {itineraries.map((it) => (
                  <Card key={it._id} className="glass">
                    <CardHeader>
                      <CardTitle className="flex items-start justify-between gap-2">
                        <span className="text-lg">{it.title}</span>
                        <Button variant="ghost" size="icon" aria-label="Delete itinerary" onClick={() => deleteItinerary(it._id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-muted-foreground">
                      <p>{it.plan.tripSummary}</p>
                      <details>
                        <summary className="cursor-pointer text-foreground">{it.plan.days.length} days · view plan</summary>
                        <div className="mt-3 space-y-3">
                          {it.plan.days.map((day: any) => (
                            <div key={day.dayNumber}>
                              <div className="font-medium text-foreground">Day {day.dayNumber}: {day.theme}</div>
                              <ul className="list-disc pl-5">
                                {day.activities.map((a: any, i: number) => (
                                  <li key={i}>{a.title}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </details>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 glass rounded-xl border border-white/10">
                <p className="text-muted-foreground mb-4">You haven't created any itineraries yet.</p>
                <Link href="/itinerary">
                  <Button>Plan a Trip</Button>
                </Link>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
