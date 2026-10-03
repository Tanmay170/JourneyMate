"use client"

import { useState } from "react"
import Link from "next/link"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { useSession } from "next-auth/react"
import { Sparkles } from "lucide-react"

import { AuthButtons } from "@/components/auth-buttons"
import { Conversation, ConversationContent, ConversationEmptyState, ConversationScrollButton } from "@/components/ai-elements/conversation"
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message"
import { PromptInput, PromptInputBody, PromptInputFooter, PromptInputSubmit, PromptInputTextarea } from "@/components/ai-elements/prompt-input"
import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion"
import { Shimmer } from "@/components/ai-elements/shimmer"

const SUGGESTIONS = [
  "Plan a 5-day budget trip to Spiti Valley",
  "Best offbeat beaches in South India for solo travellers",
  "Hostels and cafes in Kasol",
]

const MAX_CHARS = 500

export default function ChatPage() {
  const { status: authStatus } = useSession()
  const [input, setInput] = useState("")
  const { messages, sendMessage, status, error, stop } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  })

  const send = (text: string) => {
    const value = text.trim()
    if (!value || value.length > MAX_CHARS) return
    sendMessage({ text: value })
    setInput("")
  }

  return (
    <div className="flex h-screen flex-col">
      <header className="w-full border-b bg-background/60 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <span className="text-primary">Offbeat</span><span>India</span>
          </Link>
          <div className="hidden md:flex md:gap-4">
            <Link href="/destinations" className="text-sm font-medium hover:text-primary">Destinations</Link>
            <Link href="/itinerary" className="text-sm font-medium hover:text-primary">Itinerary Planner</Link>
            <Link href="/chat" className="text-sm font-medium text-primary">Assistant</Link>
          </div>
          <AuthButtons />
        </div>
      </header>

      <main className="container mx-auto flex min-h-0 max-w-3xl flex-1 flex-col py-4">
        {authStatus === "unauthenticated" ? (
          <div className="m-auto text-center">
            <Sparkles className="mx-auto mb-3 h-8 w-8 text-primary" />
            <p className="mb-4 text-muted-foreground">Log in to chat with the travel assistant.</p>
            <Link href="/login?callbackUrl=/chat" className="underline">Log in</Link>
          </div>
        ) : (
          <>
            <Conversation className="min-h-0 flex-1">
              <ConversationContent>
                {messages.length === 0 ? (
                  <ConversationEmptyState
                    title="Ask about offbeat India"
                    description="Itineraries, budget stays, local food and getting around."
                    icon={<Sparkles className="h-6 w-6 text-primary" />}
                  />
                ) : (
                  messages.map((message) => (
                    <Message key={message.id} from={message.role}>
                      <MessageContent>
                        {message.parts.map((part, i) =>
                          part.type === "text" ? (
                            <MessageResponse key={i}>{part.text}</MessageResponse>
                          ) : part.type.startsWith("tool-") ? (
                            <Shimmer key={i}>Checking our destination database…</Shimmer>
                          ) : null,
                        )}
                      </MessageContent>
                    </Message>
                  ))
                )}
                {error && (
                  <p className="text-sm text-destructive">
                    {error.message.includes("log in") ? "Please log in to continue." : "Something went wrong. Please try again."}
                  </p>
                )}
              </ConversationContent>
              <ConversationScrollButton />
            </Conversation>

            {messages.length === 0 && (
              <Suggestions className="my-3">
                {SUGGESTIONS.map((s) => (
                  <Suggestion key={s} suggestion={s} onClick={send} />
                ))}
              </Suggestions>
            )}

            <PromptInput onSubmit={({ text }) => send(text)} className="mt-3">
              <PromptInputBody>
                <PromptInputTextarea
                  value={input}
                  maxLength={MAX_CHARS}
                  onChange={(e) => setInput(e.currentTarget.value)}
                  placeholder="Where do you want to go?"
                />
              </PromptInputBody>
              <PromptInputFooter>
                <span className="text-xs text-muted-foreground">{input.length}/{MAX_CHARS}</span>
                <PromptInputSubmit status={status} onStop={stop} disabled={!input.trim() && status === "ready"} />
              </PromptInputFooter>
            </PromptInput>
          </>
        )}
      </main>
    </div>
  )
}
