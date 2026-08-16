"use client"

import { useState, useEffect } from "react"
import { Utensils } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function LiveFood({ destinationSlug }: { destinationSlug: string }) {
  const [food, setFood] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/food?destination=${destinationSlug}`)
      .then(res => res.json())
      .then(data => {
        setFood(data.food || [])
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

  if (food.length === 0) {
    return <p className="mt-6 text-muted-foreground">No food options found for this destination at the moment.</p>
  }

  return (
    <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {food.map((place, index) => (
        <Card key={index} className="overflow-hidden">
          <div className="aspect-[4/3] w-full overflow-hidden relative">
            <img src={place.images?.[0] || "/placeholder.svg"} className="object-cover w-full h-full" alt={place.name} />
            <Badge className="absolute top-2 right-2 bg-orange-600/90 hover:bg-orange-600">Google Places</Badge>
          </div>
          <CardHeader>
            <CardTitle className="line-clamp-1">{place.name}</CardTitle>
            <CardDescription className="line-clamp-1">
              {place.type} • {place.location}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <div className="flex items-center gap-2">
                <Utensils className="h-4 w-4 text-muted-foreground" />
                <span>{place.cuisine}</span>
              </div>
              <div className="flex items-center gap-2 font-medium">
                <span className="text-sm">Price: {place.priceRange}</span>
              </div>
              <div className="flex items-center gap-4 text-sm mt-2">
                <span className={place.vegOptions ? "text-green-500 font-medium" : "text-muted-foreground"}>
                  Veg {place.vegOptions ? "✓" : "✗"}
                </span>
                <span className={place.nonVegOptions ? "text-red-500 font-medium" : "text-muted-foreground"}>
                  Non-Veg {place.nonVegOptions ? "✓" : "✗"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
