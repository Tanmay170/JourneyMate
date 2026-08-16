"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Bed, MapPin, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function StaysPage() {
  const [stays, setStays] = useState<any[]>([])
  const [query, setQuery] = useState("")
  const [type, setType] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStays() {
      setLoading(true)
      try {
        const url = new URL("/api/stays", window.location.origin)
        if (query) url.searchParams.set("query", query)
        if (type && type !== "all") url.searchParams.set("type", type)
        
        const res = await fetch(url.toString())
        const data = await res.json()
        setStays(data.stays || [])
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }

    const timeout = setTimeout(() => {
      fetchStays()
    }, 300)
    return () => clearTimeout(timeout)
  }, [query, type])

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/60 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <span className="text-primary">Offbeat</span><span>India</span>
          </Link>
          <div className="hidden md:flex md:gap-4">
            <Link href="/destinations" className="text-sm font-medium hover:text-primary">Destinations</Link>
            <Link href="/stays" className="text-sm font-medium text-primary">Stays</Link>
            <Link href="/food" className="text-sm font-medium hover:text-primary">Food</Link>
            <Link href="/itinerary" className="text-sm font-medium hover:text-primary">Itinerary Planner</Link>
            <Link href="/transport" className="text-sm font-medium hover:text-primary">Transport</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="glass">Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Authentic Stays</h1>
              <p className="text-muted-foreground mt-2">Discover eco-stays, hidden hostels, and local homestays.</p>
            </div>
            
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search stays..."
                className="pl-9 glass"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>

          <Tabs value={type} onValueChange={setType} className="w-full">
            <TabsList className="glass h-auto flex-wrap p-1">
              <TabsTrigger value="all">All Stays</TabsTrigger>
              <TabsTrigger value="Homestay">Homestays</TabsTrigger>
              <TabsTrigger value="Hostel">Hostels</TabsTrigger>
              <TabsTrigger value="Hotel">Hotels</TabsTrigger>
              <TabsTrigger value="Resort">Resorts</TabsTrigger>
            </TabsList>
          </Tabs>

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-[350px] rounded-xl glass animate-pulse" />
              ))}
            </div>
          ) : (
            <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-8">
              <AnimatePresence>
                {stays.length > 0 ? (
                  stays.map((stay, index) => (
                    <motion.div
                      key={stay.id || index}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      whileHover={{ y: -5 }}
                    >
                      <Card className="glass overflow-hidden h-full flex flex-col border-white/10 hover:shadow-primary/20 hover:shadow-xl transition-all">
                        <div className="aspect-video w-full bg-muted/20 relative overflow-hidden">
                          {stay.images && stay.images.length > 0 ? (
                            <img src={stay.images[0]} alt={stay.name} className="absolute inset-0 h-full w-full object-cover transition-transform hover:scale-105" />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Bed className="h-10 w-10 text-primary/40" />
                            </div>
                          )}
                        </div>
                        <CardHeader>
                          <div className="text-xs text-primary font-semibold tracking-wider uppercase mb-1">{stay.type}</div>
                          <CardTitle className="text-xl">{stay.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="mt-auto">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                            <MapPin className="h-4 w-4 text-primary" /> {stay.location}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-lg">{stay.priceRange.split(' ')[0]}</span>
                            <Link href={`/destinations/${stay.destinationSlug}`}>
                              <Button variant="secondary" size="sm" className="bg-primary/20 text-primary hover:bg-primary/30">Book</Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full py-12 text-center text-muted-foreground">
                    No stays found matching your search.
                  </div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  )
}
