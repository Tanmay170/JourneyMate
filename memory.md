# Memory — Project State

_Last updated: 2026-10-03. `npm install` done; `tsc --noEmit` clean; `next build` passes with dummy env vars. **Nothing has been run against real MongoDB / Firebase / Groq** (no credentials yet), so Phases 2–3 are compile-verified only. Nothing is committed to git._

## What has happened so far
- 2026-10-03: cloned `Tanmay170/JourneyMate` (code name **Offbeat India**; product name in PRD: Journey Mate). Two prior commits from 2026-08-16.
- Planning docs created and filled: `PRD.md` and `design.md` (owner), `memory.md`, `phases.md`, `Architecture.md`, `rules.md` (maintained by Claude).
- **Phase 2 (auth & user data) coded:** Firebase identity → NextAuth session (`lib/auth.ts`, `lib/auth-client.ts`, `lib/firebase-verify.ts`); reviews, saved destinations and bookings persisted in Mongo with session identity; seed endpoint dev-only; `lib/db.ts` mock and `user-auth-form` removed; `.env.example`; fixed `types/next-auth.d.ts` (was replacing module types).
- **Design tooling installed:** `shadcn init --preset b5d3ACm4e --force` (style `radix-maia`, base `zinc`; re-generated `components/ui/*`, `globals.css`, `lib/utils.ts`, layout font → Manrope) and `npx ai-elements` (removed `agent`, `context`, `schema-display`, `voice-selector` — fail typecheck). Pre-change backup exists only in the session scratchpad. Existing pages are **not** restyled yet.
- **Phase 3 (AI) coded:** `lib/ai-guard.ts` (login + rate limit + prompt cap), hardened `/api/generate-itinerary`, `/api/chat` migrated to `ai@7`, new `/chat` page (AI Elements), `Itinerary` model + `/api/itineraries` + "Save itinerary" + dashboard tab, `lib/itinerary-schema.ts`. Deleted unused `hooks/use-toast.ts`, `components/ui/resizable.tsx`; de-duplicated `tailwind.config.ts`.
- All six docs synced to this state on 2026-10-03 (PRD and design.md have appended status sections; the owner's original text is untouched).

## Current phase
**Phase 3 — AI & live integrations** (see `phases.md`). Phase 2 is code-complete, waiting on owner setup + manual test.

## Waiting on the owner
1. `.env.local` (Mongo URI, NEXTAUTH_SECRET, 6 Firebase vars, GROQ_API_KEY) — see `.env.example`.
2. Firebase console: enable Google + Email/Password; `localhost` in authorized domains.
3. Open `/api/seed` once in dev to load destinations.
4. Decide: phone sign-in + onboarding now or Phase 4?
5. Fill in `design.md` (palette, fonts, type scale).
6. PRD scoping: payments, maps provider, groups chat approach, local-guide accounts, packages.
7. Run the manual test checklist in `phases.md` and report errors.

## Component status

### Working by code inspection / build (not runtime-tested)
| Area | Files |
|---|---|
| Destinations schema + 62-place seed (dev only) | `models/Destination.ts`, `app/api/seed/route.ts` |
| Browse pages + APIs: home, destinations (+detail), stays, food, transport | `app/*`, `app/api/*` |
| Auth: login, signup, navbar, middleware, session | `lib/auth*.ts`, `app/login`, `app/signup`, `components/auth-buttons.tsx`, `middleware.ts` |
| Reviews (one per user), saved destinations, bookings (Pending) | `app/api/destinations/[slug]/reviews`, `app/api/saved`, `app/api/bookings`, matching components |
| Dashboard: bookings, saved, itineraries | `app/dashboard/page.tsx` |
| AI itinerary generator + save | `app/itinerary/page.tsx`, `app/api/generate-itinerary`, `app/api/itineraries` |
| AI chat assistant | `app/chat/page.tsx`, `app/api/chat` |

### Not built (PRD)
Phone sign-in (1), onboarding/preferences (2), nearest airport/rail/bus + "what to expect" fields (4), maps (7), local guide profiles (8), transport/service booking & payments (9), packages (10), groups (11).

### Known issues / risks
1. AI routes untested against real Groq; structured output was flaky before (`test-groq.ts`). Fallback: `structuredOutputs: false` / `generateObject`.
2. Rate limiter is in-memory (per server instance).
3. Pages still use pre-preset `glass`/teal styling; `Outfit` on `<body>` conflicts with Manrope; `design.md` palette/fonts undefined.
4. Seed data is template content (`loremflickr` images, placeholder YouTube video, same stays/food per place); only 5 local images.
5. Phone-only users can't sign in (`authorize` requires email).
6. Housekeeping: duplicate `use-mobile` hooks, package name `my-v0-project`, `latest` deps (`@auth/core`, `nodemailer`), stray `.gitignore` entry, no tests, `next lint` not run.

## File currently being worked on
None. Next code once unblocked: phone auth (`app/login/page.tsx`, `lib/auth.ts`), onboarding/preferences (`models/User.ts`), maps (after provider decision).

## Decisions made
- Firebase = identity, NextAuth = session (2026-10-03; phone sign-in requires Firebase).
- Bookings are Pending requests; no payments yet.
- AI = Groq `llama-3.3-70b-versatile` via Vercel AI SDK; login required for all AI routes.
- Live stays via RapidAPI stay optional; falls back to DB when `RAPIDAPI_KEY` unset.

## Env vars
`MONGODB_URI`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `NEXT_PUBLIC_FIREBASE_{API_KEY,AUTH_DOMAIN,PROJECT_ID,STORAGE_BUCKET,MESSAGING_SENDER_ID,APP_ID}`, `GROQ_API_KEY`, `RAPIDAPI_KEY` (optional). `GOOGLE_CLIENT_ID/SECRET` are no longer used.
