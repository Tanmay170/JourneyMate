"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Sparkles, MapPin, Loader2, Calendar, Coffee, BedDouble, Navigation, Camera } from "lucide-react"
import { experimental_useObject as useObject } from "@ai-sdk/react"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

const itinerarySchema = z.object({
  tripTitle: z.string(),
  tripSummary: z.string(),
  days: z.array(z.object({
    dayNumber: z.number(),
    theme: z.string(),
    activities: z.array(z.object({
      time: z.string(),
      title: z.string(),
      description: z.string(),
      type: z.enum(["Activity", "Food", "Travel", "Stay", "Relaxation"])
    }))
  })),
  recommendedStays: z.array(z.object({
    name: z.string(),
    description: z.string(),
    priceRange: z.string()
  })).optional(),
  localFoodSpecialties: z.array(z.string()).optional()
})

type Itinerary = z.infer<typeof itinerarySchema>

export default function ItineraryPage() {
  const [prompt, setPrompt] = useState("")
  
  const { submit, object, isLoading, error } = useObject({
    api: '/api/generate-itinerary',
    schema: itinerarySchema,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return
    submit({ prompt })
  }

  const getActivityIcon = (type: string | undefined) => {
    switch (type) {
      case 'Food': return <Coffee className="h-4 w-4" />
      case 'Travel': return <Navigation className="h-4 w-4" />
      case 'Stay': return <BedDouble className="h-4 w-4" />
      case 'Relaxation': return <Calendar className="h-4 w-4" />
      default: return <Camera className="h-4 w-4" />
    }
  }

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
            <Link href="/food" className="text-sm font-medium hover:text-primary">Food</Link>
            <Link href="/itinerary" className="text-sm font-medium text-primary">Itinerary Planner</Link>
            <Link href="/transport" className="text-sm font-medium hover:text-primary">Transport</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="glass">Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight flex items-center justify-center gap-3">
              <Sparkles className="h-8 w-8 text-primary" /> Smart Itinerary Generator
            </h1>
            <p className="text-muted-foreground mt-2">
              Tell us your vibe, duration, and destination. Groq AI will instantly generate a tailored trip!
            </p>
          </div>

          <Card className="glass border-white/10 shadow-2xl p-4">
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
              <Input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. 5 days in Spiti Valley, adventure focus, budget stays..."
                className="flex-1 glass text-lg p-6"
                disabled={isLoading && !object}
              />
              <Button 
                type="submit" 
                disabled={isLoading || !prompt.trim()} 
                className="h-auto px-8 text-lg"
              >
                {isLoading && !object ? (
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                ) : (
                  <Sparkles className="h-5 w-5 mr-2" />
                )}
                Generate
              </Button>
            </form>
          </Card>

          {error && (
            <Card className="bg-destructive/10 border-destructive/20 text-destructive p-4">
              <p>Failed to generate itinerary. {error.message}</p>
            </Card>
          )}

          {object && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card className="glass border-primary/20 overflow-hidden relative">
                {isLoading && (
                  <div className="absolute top-0 left-0 w-full h-1 bg-primary/20 overflow-hidden">
                    <div className="h-full bg-primary animate-pulse w-1/3" />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-3xl text-primary flex items-center gap-2">
                    <MapPin className="h-6 w-6" /> {object?.tripTitle || "Crafting your trip..."}
                  </CardTitle>
                  <CardDescription className="text-lg">
                    {object?.tripSummary || ""}
                  </CardDescription>
                </CardHeader>
              </Card>

              {object?.days && object.days.length > 0 && (
                <div className="space-y-6">
                  {object.days.map((day: any, idx: number) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <Card className="glass border-white/5">
                        <CardHeader className="pb-3 border-b border-white/5">
                          <CardTitle className="text-xl flex items-center gap-2">
                            <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm">Day {day?.dayNumber}</span>
                            {day?.theme}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <div className="space-y-4">
                            {day?.activities?.map((act: any, actIdx: number) => (
                              <div key={actIdx} className="flex gap-4 group">
                                <div className="flex flex-col items-center">
                                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0 border border-white/10 group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                                    {getActivityIcon(act?.type)}
                                  </div>
                                  {actIdx !== (day.activities?.length || 0) - 1 && (
                                    <div className="w-px h-full bg-border my-1" />
                                  )}
                                </div>
                                <div className="pb-4">
                                  <span className="text-sm text-primary font-medium">{act?.time}</span>
                                  <h4 className="text-lg font-semibold">{act?.title}</h4>
                                  <p className="text-muted-foreground">{act?.description}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}

              {(object?.recommendedStays?.length || 0) > 0 && (
                <Card className="glass border-white/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <BedDouble className="h-5 w-5 text-primary" /> Recommended Stays
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      {object?.recommendedStays?.map((stay: any, idx: number) => (
                        <div key={idx} className="bg-muted/30 p-4 rounded-xl border border-white/5">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold">{stay?.name}</h4>
                            <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">{stay?.priceRange}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{stay?.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {(object?.localFoodSpecialties?.length || 0) > 0 && (
                <Card className="glass border-white/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Coffee className="h-5 w-5 text-primary" /> Must-Try Local Food
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {object?.localFoodSpecialties?.map((food: string, idx: number) => (
                        <span key={idx} className="bg-secondary text-secondary-foreground px-3 py-1.5 rounded-lg text-sm font-medium">
                          {food}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  )
}
