export interface FirebaseIdentity {
  uid: string
  email?: string
  name?: string
  image?: string
}

// Verifies a Firebase ID token through the Identity Toolkit REST API.
// Uses the public web API key, so no service account is needed.
export async function verifyFirebaseIdToken(idToken: string): Promise<FirebaseIdentity | null> {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
  if (!apiKey) throw new Error("NEXT_PUBLIC_FIREBASE_API_KEY is not set")

  const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
    cache: "no-store",
  })
  if (!res.ok) return null

  const data = await res.json()
  const user = data.users?.[0]
  if (!user?.localId) return null

  return { uid: user.localId, email: user.email, name: user.displayName, image: user.photoUrl }
}
