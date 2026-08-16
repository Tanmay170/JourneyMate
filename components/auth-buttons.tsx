"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { onAuthStateChanged, signOut, User } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { LogOut, User as UserIcon } from "lucide-react"

export function AuthButtons() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const handleLogout = async () => {
    await signOut(auth)
    router.push("/")
  }

  if (loading) return <div className="w-32 h-9 animate-pulse bg-white/10 rounded-md"></div>

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm font-medium">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary">
            <UserIcon className="h-4 w-4" />
          </div>
          <span className="hidden md:inline-block">{user.displayName || user.email?.split("@")[0]}</span>
        </div>
        <Link href="/dashboard">
          <Button variant="outline" size="sm" className="glass">Dashboard</Button>
        </Link>
        <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-white">
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-4">
      <Link href="/login">
        <Button variant="outline" size="sm" className="glass">
          Log in
        </Button>
      </Link>
      <Link href="/signup">
        <Button size="sm">Sign up</Button>
      </Link>
    </div>
  )
}
