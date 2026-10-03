import { NextResponse } from "next/server"
import { getSessionUser } from "@/lib/auth"

// Per-instance, in-memory limiter. Good enough for one server process; swap for
// Redis/Upstash if the app is deployed across several serverless instances.
const hits = new Map<string, number[]>()

function allow(key: string, limit: number, windowMs: number) {
  const now = Date.now()
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs)
  if (recent.length >= limit) {
    hits.set(key, recent)
    return false
  }
  recent.push(now)
  hits.set(key, recent)
  return true
}

export const MAX_PROMPT_CHARS = 500

type Guard = { user: NonNullable<Awaited<ReturnType<typeof getSessionUser>>> } | { response: NextResponse }

// Login required + GROQ key present + 10 AI requests per user per minute.
export async function guardAiRequest(scope: string): Promise<Guard> {
  const user = await getSessionUser()
  if (!user) {
    return { response: NextResponse.json({ error: "Please log in to use the AI assistant" }, { status: 401 }) }
  }
  if (!process.env.GROQ_API_KEY) {
    console.error("GROQ_API_KEY is not configured")
    return { response: NextResponse.json({ error: "The AI assistant is not available right now" }, { status: 503 }) }
  }
  if (!allow(`${scope}:${user.id}`, 10, 60_000)) {
    return { response: NextResponse.json({ error: "Too many requests. Please wait a minute." }, { status: 429 }) }
  }
  return { user }
}

export function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}
