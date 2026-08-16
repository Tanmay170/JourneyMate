"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Utensils, MapPin, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function FoodPage() {
  const [food, setFood] = useState<any[]>([])
  const [query, setQuery] = useState("")
  const [type, setType] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFood() {
      setLoading(true)
      try {
        const url = new URL("/api/food", window.location.origin)
        if (query) url.searchParams.set("query", query)
        if (type && type !== "all") url.searchParams.set("type", type)
        
        const res = await fetch(url.toString())
        const data = await res.json()
        setFood(data.food || [])
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }

    const timeout = setTimeout(() => {
      fetchFood()
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
            <Link href="/stays" className="text-sm font-medium hover:text-primary">Stays</Link>
            <Link href="/food" className="text-sm font-medium text-primary">Food</Link>
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
              <h1 className="text-4xl font-bold tracking-tight">Local Cuisines</h1>
              <p className="text-muted-foreground mt-2">Discover authentic local food options and hidden cafes.</p>
            </div>
            
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search food..."
                className="pl-9 glass"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>

          <Tabs value={type} onValueChange={setType} className="w-full">
            <TabsList className="glass h-auto flex-wrap p-1">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="Cafe">Cafes</TabsTrigger>
              <TabsTrigger value="Local Restaurant">Local Restaurants</TabsTrigger>
              <TabsTrigger value="Restaurant">Restaurants</TabsTrigger>
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
                {food.length > 0 ? (
                  food.map((f, index) => (
                    <motion.div
                      key={f._id || f.id || index}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      whileHover={{ y: -5 }}
                    >
                      <Card className="glass overflow-hidden h-full flex flex-col border-white/10 hover:shadow-primary/20 hover:shadow-xl transition-all">
                        <div className="aspect-video w-full bg-muted/20 relative overflow-hidden">
                          {f.images && f.images.length > 0 ? (
                            <img src={f.images[0]} alt={f.name} className="absolute inset-0 h-full w-full object-cover transition-transform hover:scale-105" />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Utensils className="h-10 w-10 text-primary/40" />
                            </div>
                          )}
                        </div>
                        <CardHeader>
                          <div className="text-xs text-primary font-semibold tracking-wider uppercase mb-1">{f.type}</div>
                          <CardTitle className="text-xl">{f.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="mt-auto">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <MapPin className="h-4 w-4 text-primary" /> {f.location}
                          </div>
                          <div className="text-sm mb-4">
                            <span className="font-medium">Cuisine:</span> {f.cuisine}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-sm">{f.priceRange}</span>
                            <Link href={`/destinations/${f.destinationSlug}`}>
                              <Button variant="secondary" size="sm" className="bg-primary/20 text-primary hover:bg-primary/30">View</Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full py-12 text-center text-muted-foreground">
                    No food options found matching your search.
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
