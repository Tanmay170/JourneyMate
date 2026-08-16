import Link from "next/link"
import { notFound } from "next/navigation"
import { Calendar, Clock, Compass, MapPin, Star, Utensils, Car, Bed, Info, Shield, Users } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getDestinationBySlug } from "@/lib/db"
import { BookingModal } from "@/components/booking-modal"
import { ReviewForm } from "@/components/review-form"
import { LiveStays } from "@/components/live-stays"
import { LiveFood } from "@/components/live-food"
import { AuthButtons } from "@/components/auth-buttons"

export default async function DestinationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const destination = await getDestinationBySlug(slug)
  
  if (!destination) {
    notFound()
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <span className="text-primary">Offbeat</span>
            <span>India</span>
          </Link>
          <div className="hidden md:flex md:gap-4">
            <Link href="/destinations" className="text-sm font-medium hover:text-primary">
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
          <AuthButtons />
        </div>
      </header>
      <main className="flex-1">
        <div className="relative h-[50vh] w-full">
          <img
            src={destination.image || "/placeholder.svg"}
            alt={destination.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="container">
              <Badge className="mb-2">{destination.category}</Badge>
              <h1 className="text-3xl font-bold text-white md:text-4xl lg:text-5xl">{destination.title}</h1>
              <div className="mt-2 flex items-center gap-2 text-white">
                <MapPin className="h-4 w-4" />
                <span>{destination.location}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="container py-8">
          <div className="flex flex-col gap-8 lg:flex-row">
            <div className="flex-1 lg:w-2/3">
              <Tabs defaultValue="overview">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="stays">Stays</TabsTrigger>
                  <TabsTrigger value="food">Food</TabsTrigger>
                  <TabsTrigger value="transport">Transport</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="mt-6">
                  <div className="grid gap-6">
                    <div>
                      <h2 className="text-2xl font-bold">About {destination.title}</h2>
                      <p className="mt-2 text-muted-foreground">{destination.longDescription}</p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <Calendar className="h-5 w-5 text-primary" />
                            Best Time to Visit
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p>{destination.bestTimeToVisit}</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <Compass className="h-5 w-5 text-primary" />
                            Things to Do
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="ml-5 list-disc space-y-1">
                            {destination.thingsToDo.map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <Shield className="h-5 w-5 text-primary" />
                            Safety Tips
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="ml-5 list-disc space-y-1">
                            {destination.safetyTips.map((tip, index) => (
                              <li key={index}>{tip}</li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <Users className="h-5 w-5 text-primary" />
                            Local Culture
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p>{destination.localCulture}</p>
                        </CardContent>
                      </Card>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Gallery</h3>
                      <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                        {destination.gallery?.map((image: string, index: number) => (
                          <img
                            key={index}
                            src={image || "/placeholder.svg"}
                            alt={`${destination.title} - Image ${index + 1}`}
                            className="aspect-square rounded-md object-cover hover:opacity-80 transition-opacity cursor-pointer"
                          />
                        ))}
                      </div>
                    </div>
                    {destination.videos && destination.videos.length > 0 && (
                      <div className="mt-4">
                        <h3 className="text-xl font-bold mb-4">Videos</h3>
                        <div className="grid gap-4 md:grid-cols-2">
                          {destination.videos.map((vid: string, index: number) => (
                            <div key={index} className="aspect-video rounded-md overflow-hidden bg-muted">
                              <iframe 
                                src={vid} 
                                className="w-full h-full border-0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              ></iframe>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="stays" className="mt-6">
                  <div>
                    <h2 className="text-2xl font-bold">Places to Stay</h2>
                    <p className="mt-2 text-muted-foreground">
                      Find budget-friendly accommodations in and around {destination.title}
                    </p>
                    <LiveStays destinationSlug={destination.slug} destinationName={destination.title} />
                  </div>
                </TabsContent>
                <TabsContent value="food" className="mt-6">
                  <div>
                    <h2 className="text-2xl font-bold">Food Options</h2>
                    <p className="mt-2 text-muted-foreground">
                      Explore local cuisine and dining options in {destination.title}
                    </p>
                    <LiveFood destinationSlug={destination.slug} />
                  </div>
                </TabsContent>
                <TabsContent value="transport" className="mt-6">
                  <div>
                    <h2 className="text-2xl font-bold">Transport Options</h2>
                    <p className="mt-2 text-muted-foreground">How to reach and get around {destination.title}</p>
                    <div className="mt-6 grid gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>How to Reach</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {destination.transport.howToReach.map((item, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                      <h3 className="text-xl font-bold">Local Transport</h3>
                      <div className="grid gap-6 md:grid-cols-3">
                        {destination.transport.localTransport.map((transport, index) => (
                          <Card key={index}>
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                <Car className="h-5 w-5 text-primary" />
                                {transport.type}
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="grid gap-2">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">Cost:</span>
                                  <span>{transport.cost}</span>
                                </div>
                                <div>
                                  <span className="font-medium">Providers:</span>
                                  <ul className="ml-5 mt-1 list-disc text-sm">
                                    {transport.providers.map((provider, idx) => (
                                      <li key={idx}>{provider}</li>
                                    ))}
                                  </ul>
                                </div>
                                {transport.contact && (
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">Contact:</span>
                                    <span>{transport.contact}</span>
                                  </div>
                                )}
                                {transport.schedule && (
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">Schedule:</span>
                                    <span>{transport.schedule}</span>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="reviews" className="mt-6">
                  <div>
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold">Traveler Reviews</h2>
                    </div>
                    <ReviewForm destinationId={destination.id || destination._id || ""} />
                    <div className="mt-6 grid gap-6">
                      {destination.reviews.map((review, index) => (
                        <Card key={index}>
                          <CardContent className="pt-6">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-muted" />
                                <div>
                                  <h4 className="font-medium">{review.user}</h4>
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    <span>{review.date}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating ? "fill-primary text-primary" : "text-muted"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="mt-4">{review.comment}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            <div className="lg:w-1/3">
              <div className="sticky top-24 grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Plan Your Trip</CardTitle>
                    <CardDescription>Create a custom itinerary for {destination.title}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">Create Itinerary</Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Weather</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Current</p>
                        <p className="text-2xl font-bold">12°C</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">High / Low</p>
                        <p>18°C / 5°C</p>
                      </div>
                    </div>
                    <Separator className="my-4" />
                    <div className="grid grid-cols-3 gap-2 text-center text-sm">
                      <div>
                        <p className="text-muted-foreground">Tomorrow</p>
                        <p className="font-medium">14°C</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Day 3</p>
                        <p className="font-medium">15°C</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Day 4</p>
                        <p className="font-medium">13°C</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Map</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video rounded-md bg-muted">
                      {/* Google Maps would be integrated here */}
                      <div className="flex h-full items-center justify-center">
                        <p className="text-sm text-muted-foreground">Google Maps Integration</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="border-t bg-muted/50">
        <div className="container py-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="text-xl font-bold">
                <span className="text-primary">Offbeat</span> India
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Discover India&apos;s hidden gems and plan your perfect adventure with our community-driven travel
                guide.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium">Explore</h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <Link href="/destinations" className="text-muted-foreground hover:text-foreground">
                    Destinations
                  </Link>
                </li>
                <li>
                  <Link href="/stays" className="text-muted-foreground hover:text-foreground">
                    Stays
                  </Link>
                </li>
                <li>
                  <Link href="/food" className="text-muted-foreground hover:text-foreground">
                    Food
                  </Link>
                </li>
                <li>
                  <Link href="/itinerary" className="text-muted-foreground hover:text-foreground">
                    Itinerary Planner
                  </Link>
                </li>
                <li>
                  <Link href="/transport" className="text-muted-foreground hover:text-foreground">
                    Transport
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium">Company</h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-foreground">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium">Connect</h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Facebook
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    YouTube
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Offbeat India. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

