"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Calendar, MapPin, CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DashboardPage() {
  const [bookings, setBookings] = useState<any[]>([])

  useEffect(() => {
    const savedBookings = JSON.parse(localStorage.getItem("mock_bookings") || "[]")
    setBookings(savedBookings)
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
                {bookings.map((booking, i) => (
                  <Card key={i} className="glass">
                    <CardHeader>
                      <CardTitle className="flex justify-between items-center">
                        <span className="text-lg">{booking.stayName}</span>
                        <span className="text-sm font-normal text-green-500 flex items-center gap-1">
                          <CheckCircle className="h-4 w-4" /> {booking.status}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-muted-foreground text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary" /> {booking.destinationName}
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary" /> Booked on: {new Date(booking.date).toLocaleDateString()}
                        </div>
                        <div className="font-semibold text-foreground pt-2 border-t border-border mt-2">
                          Total: {booking.price}
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
             <div className="text-center py-20 glass rounded-xl border border-white/10">
                <p className="text-muted-foreground mb-4">You haven't saved any destinations yet.</p>
                <Link href="/destinations">
                  <Button>Explore Destinations</Button>
                </Link>
              </div>
          </TabsContent>

          <TabsContent value="itineraries">
             <div className="text-center py-20 glass rounded-xl border border-white/10">
                <p className="text-muted-foreground mb-4">You haven't created any itineraries yet.</p>
                <Link href="/itinerary">
                  <Button>Plan a Trip</Button>
                </Link>
              </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
