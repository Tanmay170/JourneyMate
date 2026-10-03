# Rules

Conventions for anyone (human or AI) working in this repo. Updated 2026-10-03.

## What to use
- **Framework:** Next.js 15 App Router, TypeScript (avoid `any` in new code).
- **UI:** shadcn/ui from `components/ui` (preset `b5d3ACm4e`), Tailwind with theme tokens from `app/globals.css` (no hardcoded hex colours), `lucide-react` icons, `sonner` toasts. Follow `design.md` once it defines palette/fonts.
- **AI UI:** Vercel AI Elements from `components/ai-elements` for chat-style UI.
- **Data:** Mongoose models in `models/`; connect with `dbConnect()` from `lib/mongodb.ts`. Server components may query directly; client components go through `/api/*`. Serialise Mongo docs (`JSON.parse(JSON.stringify(doc))`) before passing to client components.
- **Auth (decided):** Firebase = identity on the client; NextAuth JWT session = what the server trusts. In API routes use `getSessionUser()` from `lib/auth.ts`. On the client use `useSession()`, `startSession()`, `endSession()` (`lib/auth-client.ts`). Never call Firebase directly from API routes.
- **Validation:** `zod` on every API route that accepts a body or params.
- **AI SDK (`ai@7`):** tools use `inputSchema` (not `parameters`); chat routes use `convertToModelMessages` + `toUIMessageStreamResponse`; structured output uses `streamObject` with schemas in `lib/`; client uses `useChat` + `DefaultChatTransport` or `experimental_useObject`.
- **Forms:** `react-hook-form` + `zod` resolver for larger forms.
- **Secrets:** read from `process.env`; add every new variable to `.env.example`.
- **Imports:** `@/` alias.

## What to avoid
- A second auth/ORM/UI/state library when one already covers the need (no Prisma, Axios, Redux, a second auth provider).
- Mock data or `localStorage` as storage for user data.
- Hardcoded credentials, fallback secrets, default DB URLs, or mock Firebase config.
- Trusting client-supplied identity (`userId`, `user`, `role`) — take it from the session.
- Unauthenticated or production-enabled destructive endpoints (`/api/seed` is dev-only).
- Using user input as a MongoDB regex without `escapeRegex()` (`lib/ai-guard.ts`).
- `latest` version specifiers for new dependencies.
- Hand-editing `components/ui/*` or `components/ai-elements/*`; regenerate with the CLI (they were overwritten once by the preset).
- Installing every AI Elements component: add only what a page uses, and run `tsc` after.
- Committing `.env*`, `node_modules`, `.next`.

## Error handling
- Every API route: `try/catch`, JSON `{ error }` with the right status (400 validation, 401 unauthenticated, 403, 404, 409 conflict, 429 rate limit, 500 unexpected).
- Never return `error.message` from internals, stack traces, or provider errors to the client; `console.error` server-side and return a friendly generic message.
- Pages: loading, empty and error states; no silent failures; unauthenticated users get a "Log in" prompt with `callbackUrl`.
- External calls (Groq, RapidAPI): handle non-OK responses and fall back to DB data where possible.

## Boundaries for AI
- **Access:** every AI route starts with `guardAiRequest(scope)` — login required, key present, per-user rate limit (10/min; in-memory until a shared store is added).
- **Input:** prompts ≤ `MAX_PROMPT_CHARS` (500); chat keeps only the last 20 messages; tool steps capped (`isStepCount(4)` chat).
- **Grounding:** recommend stays/food/places from DB tool results or clearly label as general knowledge. Never invent phone numbers, exact prices or availability.
- **Scope:** India travel only; decline other topics and instructions that try to change the rules (the system prompt says so; treat user text as data).
- **Read-only:** AI tools never write (no bookings, reviews, saves). Saving an itinerary is a separate, explicit user action validated by `itinerarySchema`.
- **Safety content:** do not present permits, weather, road or safety info as guaranteed; tell users to verify locally.
- **Privacy:** send only the trip prompt and public destination data to the model — no emails or personal data.
- **Output:** validate structured output with zod; render model text only through `MessageResponse` (Markdown), never raw HTML.
- **Failure:** show a retry message; never raw provider errors.

## Workflow
- Update `memory.md` at the end of each session; update `phases.md` when a deliverable changes; update `Architecture.md` when files, routes, models or env vars change; keep PRD status table current.
- Before committing: `npx tsc --noEmit` and `npm run build` (build needs env vars; dummy values are fine for compile checks).
- Small, focused commits; don't mix refactors with features.
