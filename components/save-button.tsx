"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Bookmark } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

export function SaveButton({ slug }: { slug: string }) {
  const { status } = useSession()
  const router = useRouter()
  const [saved, setSaved] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (status !== "authenticated") return
    fetch("/api/saved")
      .then((res) => (res.ok ? res.json() : { saved: [] }))
      .then((data) => setSaved(data.saved.some((d: { slug: string }) => d.slug === slug)))
      .catch(() => {})
  }, [status, slug])

  const toggle = async () => {
    if (status !== "authenticated") {
      router.push(`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`)
      return
    }
    setBusy(true)
    try {
      const res = await fetch("/api/saved", {
        method: saved ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      })
      if (!res.ok) throw new Error()
      setSaved(!saved)
      toast.success(saved ? "Removed from saved" : "Saved to your dashboard")
    } catch {
      toast.error("Could not update saved destinations")
    } finally {
      setBusy(false)
    }
  }

  return (
    <Button variant="secondary" size="sm" onClick={toggle} disabled={busy} className="glass">
      <Bookmark className={`mr-2 h-4 w-4 ${saved ? "fill-primary text-primary" : ""}`} />
      {saved ? "Saved" : "Save"}
    </Button>
  )
}
