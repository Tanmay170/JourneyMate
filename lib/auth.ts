import type { NextAuthOptions } from "next-auth"
import { getServerSession } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"
import { verifyFirebaseIdToken } from "@/lib/firebase-verify"

if (!process.env.NEXTAUTH_SECRET && process.env.NODE_ENV === "production") {
  throw new Error("NEXTAUTH_SECRET is not set")
}

// Firebase handles identity (Google, email, later phone). The client sends the
// Firebase ID token here; we verify it, upsert the user in MongoDB, and issue
// the NextAuth JWT session that middleware and API routes rely on.
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "firebase",
      name: "Firebase",
      credentials: { idToken: { type: "text" } },
      async authorize(credentials) {
        if (!credentials?.idToken) return null

        const identity = await verifyFirebaseIdToken(credentials.idToken)
        if (!identity?.email) return null

        await dbConnect()
        const user = await User.findOneAndUpdate(
          { firebaseUid: identity.uid },
          {
            $set: {
              email: identity.email,
              name: identity.name || identity.email.split("@")[0],
              image: identity.image,
            },
          },
          { upsert: true, new: true, setDefaultsOnInsert: true },
        )

        return { id: user._id.toString(), name: user.name, email: user.email, image: user.image }
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id
      return token
    },
    async session({ session, token }) {
      if (session.user) session.user.id = token.id as string
      return session
    },
  },
  pages: { signIn: "/login", signOut: "/", error: "/login" },
  secret: process.env.NEXTAUTH_SECRET,
}

export async function getSessionUser() {
  const session = await getServerSession(authOptions)
  return session?.user?.id ? session.user : null
}
