"use client"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { Search, MapPin } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DestinationCard } from "@/components/destination-card"
import type { Destination } from "@/types/destination"

function DestinationsContent() {
  const searchParams = useSearchParams()
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [query, setQuery] = useState(searchParams.get("query") || "")
  const [category, setCategory] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDestinations() {
      setLoading(true)
      try {
        const url = new URL("/api/destinations", window.location.origin)
        if (query) url.searchParams.set("query", query)
        if (category && category !== "all") url.searchParams.set("category", category)
        
        const res = await fetch(url.toString())
        const data = await res.json()
        setDestinations(data.destinations || [])
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }

    // debounce
    const timeout = setTimeout(() => {
      fetchDestinations()
    }, 300)
    return () => clearTimeout(timeout)
  }, [query, category])

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/60 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <span className="text-primary">Offbeat</span>
            <span>India</span>
          </Link>
          <div className="hidden md:flex md:gap-4">
            <Link href="/destinations" className="text-sm font-medium text-primary">
              Destinations
            </Link>
            <Link href="/stays" className="text-sm font-medium hover:text-primary">
              Stays
            </Link>
            <Link href="/food" className="text-sm font-medium hover:text-primary">
              Food
            </Link>
            <Link href="/itinerary" className="text-sm font-medium hover:text-primary">
              Itinerary Planner
            </Link>
            <Link href="/transport" className="text-sm font-medium hover:text-primary">
              Transport
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="glass">Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>
      
      <main className="flex-1 container py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Explore Destinations</h1>
              <p className="text-muted-foreground mt-2">Find your next offbeat adventure.</p>
            </div>
            
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-9 glass"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>

          <Tabs value={category} onValueChange={setCategory} className="w-full">
            <TabsList className="glass h-auto flex-wrap p-1">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="Mountains">Mountains</TabsTrigger>
              <TabsTrigger value="Cultural">Cultural</TabsTrigger>
              <TabsTrigger value="Spiritual">Spiritual</TabsTrigger>
              <TabsTrigger value="Island">Island</TabsTrigger>
              <TabsTrigger value="Beaches">Beaches</TabsTrigger>
            </TabsList>
          </Tabs>

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-[300px] rounded-xl glass animate-pulse" />
              ))}
            </div>
          ) : (
            <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence>
                {destinations.length > 0 ? (
                  destinations.map((dest) => (
                    <motion.div
                      key={dest.slug || dest._id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                    >
                      <DestinationCard {...dest} />
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full py-12 text-center text-muted-foreground">
                    No destinations found matching your criteria.
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

export default function DestinationsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading destinations...</div>}>
      <DestinationsContent />
    </Suspense>
  )
}
