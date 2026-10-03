"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

export function ReviewForm({ slug }: { slug: string }) {
  const { status } = useSession()
  const [open, setOpen] = useState(false)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const res = await fetch(`/api/destinations/${slug}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || "Failed to submit review")

      toast.success("Review submitted!", { description: "Thank you for your feedback." })
      setOpen(false)
      setComment("")
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "Failed to submit review")
    } finally {
      setLoading(false)
    }
  }

  if (!open) {
    return (
      <Button
        onClick={() =>
          status === "authenticated"
            ? setOpen(true)
            : router.push(`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`)
        }
      >
        Write a Review
      </Button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 p-6 glass rounded-xl border border-white/10 flex flex-col gap-4">
      <h3 className="font-semibold text-lg">Write your review</h3>
      
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
