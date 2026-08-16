"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function ReviewForm({ destinationId }: { destinationId: string }) {
  const [open, setOpen] = useState(false)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate saving review
    setTimeout(() => {
      setLoading(false)
      setOpen(false)
      toast.success("Review submitted!", {
        description: "Thank you for your feedback."
      })
      
      // In a real app we'd call an API and refresh
      // router.refresh()
    }, 1000)
  }

  if (!open) {
    return <Button onClick={() => setOpen(true)}>Write a Review</Button>
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 p-6 glass rounded-xl border border-white/10 flex flex-col gap-4">
      <h3 className="font-semibold text-lg">Write your review</h3>
      
      <div>
        <label className="text-sm text-muted-foreground mb-1 block">Your Name</label>
        <Input required value={name} onChange={e => setName(e.target.value)} className="glass" placeholder="John Doe" />
      </div>

      <div>
        <label className="text-sm text-muted-foreground mb-1 block">Rating</label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-6 w-6 cursor-pointer ${star <= rating ? "fill-primary text-primary" : "text-muted"}`}
              onClick={() => setRating(star)}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm text-muted-foreground mb-1 block">Comment</label>
        <Textarea required value={comment} onChange={e => setComment(e.target.value)} className="glass min-h-[100px]" placeholder="Tell us about your experience..." />
      </div>

      <div className="flex gap-2 justify-end mt-2">
        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
        <Button type="submit" disabled={loading}>{loading ? "Submitting..." : "Submit Review"}</Button>
      </div>
    </form>
  )
}
