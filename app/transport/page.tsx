"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Car, Train, Plane, MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function TransportPage() {
  const [transportData, setTransportData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTransport() {
      setLoading(true)
      try {
        const res = await fetch("/api/transport")
        const data = await res.json()
        setTransportData(data.transport || [])
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }

    fetchTransport()
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
            <Link href="/food" className="text-sm font-medium hover:text-primary">Food</Link>
            <Link href="/itinerary" className="text-sm font-medium hover:text-primary">Itinerary Planner</Link>
            <Link href="/transport" className="text-sm font-medium text-primary">Transport</Link>
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
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold tracking-tight">Transport Guide</h1>
            <p className="text-muted-foreground mt-4">Find how to reach offbeat destinations and local transport options.</p>
          </div>

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 mt-8">
              {[1, 2].map((i) => (
                <div key={i} className="h-[400px] rounded-xl glass animate-pulse" />
              ))}
            </div>
          ) : (
            <motion.div layout className="grid gap-6 lg:grid-cols-2 mt-8">
              <AnimatePresence>
                {transportData.map((data, i) => (
                  <motion.div
                    key={i}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card className="glass overflow-hidden h-full border-white/10">
                      <CardHeader className="bg-primary/5">
                        <CardTitle className="text-2xl flex items-center gap-2">
                          <MapPin className="text-primary h-6 w-6" /> {data.destinationTitle}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <h3 className="font-semibold text-lg mb-3">How to Reach</h3>
                        <ul className="space-y-3 mb-6">
                          {data.howToReach.map((method: string, j: number) => {
                            let Icon = Car
                            if (method.toLowerCase().includes("air")) Icon = Plane
                            if (method.toLowerCase().includes("train")) Icon = Train
                            return (
                              <li key={j} className="flex items-start gap-3 text-muted-foreground">
                                <Icon className="h-5 w-5 mt-0.5 text-primary/70 shrink-0" />
                                <span>{method}</span>
                              </li>
                            )
                          })}
                        </ul>

                        <h3 className="font-semibold text-lg mb-3">Local Transport</h3>
                        <Accordion type="single" collapsible className="w-full">
                          {data.localTransport.map((local: any, j: number) => (
                            <AccordionItem key={j} value={`item-${j}`}>
                              <AccordionTrigger className="hover:no-underline">
                                <div className="flex items-center justify-between w-full pr-4">
                                  <span>{local.type}</span>
                                  <span className="text-primary text-sm font-normal">{local.cost}</span>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className="text-muted-foreground">
                                <p className="mb-1"><span className="font-medium text-foreground">Providers:</span> {local.providers.join(", ")}</p>
                                {local.contact && <p className="mb-1"><span className="font-medium text-foreground">Contact:</span> {local.contact}</p>}
                                {local.schedule && <p><span className="font-medium text-foreground">Schedule:</span> {local.schedule}</p>}
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                        
                        <div className="mt-6 text-right">
                           <Link href={`/destinations/${data.destinationSlug}`}>
                              <Button variant="outline" size="sm" className="glass">View Destination</Button>
                           </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  )
}
