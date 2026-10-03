import type { User } from "firebase/auth"
import { signOut as firebaseSignOut } from "firebase/auth"
import { signIn, signOut } from "next-auth/react"
import { auth } from "@/lib/firebase"

// Exchange a signed-in Firebase user for the app session cookie.
export async function startSession(user: User) {
  const idToken = await user.getIdToken(true)
  const res = await signIn("firebase", { idToken, redirect: false })
  if (res?.error) throw new Error("Could not start your session. Please try again.")
}

export async function endSession() {
  await Promise.all([firebaseSignOut(auth), signOut({ redirect: false })])
}

export function postLoginPath() {
  const target = new URLSearchParams(window.location.search).get("callbackUrl")
  return target && target.startsWith("/") && !target.startsWith("//") ? target : "/dashboard"
}
