import Link from "next/link"
import { MapPin } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface FeaturedDestinationProps {
  title: string
  description: string
  image: string
  category: string
  location: string
  slug: string
}

export function FeaturedDestination({ title, description, image, category, location, slug }: FeaturedDestinationProps) {
  return (
    <div className="relative overflow-hidden rounded-xl">
      <div className="absolute inset-0">
        <img src={image || "/placeholder.svg"} alt={title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/20" />
      </div>
      <div className="relative p-6 sm:p-8 md:p-12">
        <div className="flex flex-col gap-4 text-white md:max-w-[50%]">
          <Badge className="w-fit">{category}</Badge>
          <h3 className="text-2xl font-bold sm:text-3xl md:text-4xl">{title}</h3>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4" />
            <span>{location}</span>
          </div>
          <p className="text-sm text-white/80 sm:text-base">{description}</p>
          <div className="mt-4">
            <Link href={`/destinations/${slug}`}>
              <Button variant="secondary">Explore Destination</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

