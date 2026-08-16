"use client"

import { useState } from "react"
import Link from "next/link"
import { MapPin, ChevronLeft, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface DestinationCardProps {
  title: string
  description: string
  image: string
  gallery?: string[]
  category: string
  location: string
  slug: string
}

export function DestinationCard({ title, description, image, gallery = [], category, location, slug }: DestinationCardProps) {
  const images = gallery.length > 0 ? gallery : [image]
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <Link href={`/destinations/${slug}`}>
      <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
        <Card className="glass overflow-hidden transition-all hover:shadow-primary/20 hover:shadow-xl border-white/5 relative group">
          <div className="aspect-[4/3] w-full overflow-hidden relative">
            <AnimatePresence initial={false}>
              <motion.img
                key={currentIndex}
                src={images[currentIndex] || "/placeholder.svg"}
                alt={title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            </AnimatePresence>
            
            {images.length > 1 && (
              <div className="absolute inset-0 flex items-center justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/80" onClick={prevImage}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/80" onClick={nextImage}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
            
            {images.length > 1 && (
              <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 z-10">
                {images.map((_, i) => (
                  <div key={i} className={`h-1.5 w-1.5 rounded-full ${i === currentIndex ? 'bg-white' : 'bg-white/40'}`} />
                ))}
              </div>
            )}
          </div>
          <CardContent className="p-4 relative z-20 bg-background/80 backdrop-blur-sm">
            <Badge variant="secondary" className="mb-2 bg-primary/20 text-primary hover:bg-primary/30 border-none">
              {category}
            </Badge>
            <h3 className="line-clamp-1 text-xl font-bold">{title}</h3>
            <p className="line-clamp-2 mt-2 text-sm text-muted-foreground">{description}</p>
          </CardContent>
          <CardFooter className="flex items-center gap-2 p-4 pt-0 text-sm text-muted-foreground relative z-20 bg-background/80 backdrop-blur-sm">
            <MapPin className="h-4 w-4 text-primary" />
            <span>{location}</span>
          </CardFooter>
        </Card>
      </motion.div>
    </Link>
  )
}
