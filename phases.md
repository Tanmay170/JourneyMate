# Project Phases

Four phases, each with its own spec and deliverables. Feature scope comes from `PRD.md` (see its status table); items marked _(PRD n)_ refer to its feature numbers.

**CURRENT PHASE: ▶ Phase 3 — AI & Live Integrations** (Phase 2 code-complete; blocked only on items in "Needed from you" below)

| Phase | Name | Status |
|---|---|---|
| 1 | Foundation & Content | ✅ Mostly done (real seed content + place-detail gaps remain) |
| 2 | Auth & User Data | ✅ Code complete — awaiting your config + manual test |
| 3 | AI & Live Integrations | ▶ In progress (code written) |
| 4 | Polish, Testing & Launch | ⏳ Not started |

---

## Phase 1 — Foundation & Content  ✅
**Spec:** Next.js 15 app, Tailwind + shadcn UI, MongoDB models, browsable destination content.

**Deliverables**
- [x] App scaffold, layout, theme provider, page transitions
- [x] `Destination` model + `/api/seed` (62 destinations)
- [x] Home, Destinations (+ detail), Stays, Food, Transport pages and APIs
- [ ] Replace template seed data with real content and images for at least the featured destinations
- [ ] Add missing place-detail fields from PRD 4: nearest airport / railway / bus station, "what to expect", rating summary
- [x] Removed `lib/db.ts` mock data and unused `use-toast`/`resizable`; added `.env.example`
- [ ] Remove duplicate `use-mobile` hooks, rename package from `my-v0-project`, pin `latest` deps

**Exit criteria:** every browse page loads real DB data with no mock fallbacks.

---

## Phase 2 — Auth & User Data  ✅ code complete
**Spec:** one working auth system protecting user routes; user-owned data stored in MongoDB.

**Decision (2026-10-03):** Firebase = identity (Google, email, phone planned per PRD); NextAuth = session layer. Client signs in with Firebase, sends the ID token to NextAuth's `firebase` credentials provider, which verifies it, upserts the `User` in Mongo and issues the JWT session.

**Deliverables** _(code written and typechecked; not yet tested end to end — needs Mongo + Firebase env)_
- [x] One auth flow; demo credentials, Google-via-NextAuth and `user-auth-form` removed
- [x] No fallback secrets / mock Firebase config / default DB URL
- [x] Middleware + API routes use the same session (`lib/auth.ts`)
- [x] Authenticated user upserted into `User` collection
- [x] Reviews persisted in Mongo; author from session; one per user; validated with zod
- [x] Saved destinations: `/api/saved`, `SaveButton`, dashboard tab
- [x] Bookings persisted via `Booking` model (`/api/bookings`, status Pending, no payment)
- [x] `GET /api/seed` blocked in production
- [x] `lib/db.ts` mock removed; types moved to `types/destination.ts`
- [ ] Phone-number sign-in (PRD 1) — Firebase phone auth + reCAPTCHA UI
- [ ] Onboarding + preference selection (PRD 2) — needs `User.preferences`
- [ ] Manual end-to-end test with real env vars


### 🔑 Needed from you to finish Phase 2 (and run Phase 3)
1. **Create `.env.local`** from `.env.example` (never commit it):
   - `MONGODB_URI` — e.g. a free MongoDB Atlas cluster; allow your IP in Atlas network access.
   - `NEXTAUTH_SECRET` — run `openssl rand -base64 32`; `NEXTAUTH_URL=http://localhost:3000`.
   - `NEXT_PUBLIC_FIREBASE_*` (6 values) — Firebase console → Project settings → Your apps → Web app.
   - `GROQ_API_KEY` — console.groq.com (Phase 3 AI features).
2. **Firebase console → Authentication → Sign-in method:** enable **Google** and **Email/Password**; under Settings → Authorized domains make sure `localhost` (and your deploy domain later) is listed.
3. **Seed the database once:** run `npm run dev`, open `http://localhost:3000/api/seed` (dev only).
4. **Decide scope:** do you want **phone-number sign-in** and **onboarding/preferences** in Phase 2 (they are PRD features 1–2), or deferred to Phase 4? For phone auth also enable the **Phone** provider in Firebase (needs billing plan for real SMS; test numbers work free).
5. **Run the manual test:** sign up → log out → log in (email and Google) → save a destination → post a review → request a booking → check Dashboard → open `/itinerary`, generate and save a trip → open `/chat`.
   Tell me any errors and I'll fix them.

**Exit criteria:** sign up → log in → save a destination → post a review → log out, all persisted and route-protected.

---

## Phase 3 — AI & Live Integrations  ▶ CURRENT
**Spec:** AI features are grounded in DB data, bounded by `rules.md`, and fail gracefully.

**Deliverables** _(code written, typechecked and `next build` passes with dummy env; AI calls not tested against real Groq)_
- [x] Itinerary generator hardened: login required, prompt ≤ 500 chars, per-user rate limit (10/min, in-memory), regex-injection fix, no stack traces to client, India-only/no-invented-details prompt rules
- [x] Chat assistant: `/api/chat` migrated to `ai@7` (`inputSchema`, `convertToModelMessages`, `toUIMessageStreamResponse`), same guard + boundaries; new `/chat` page built with AI Elements (Conversation, Message, PromptInput, Suggestions)
- [x] Itineraries saved per user (`Itinerary` model, `/api/itineraries`, "Save itinerary" button, dashboard tab with view/delete)
- [x] Safe error UI for AI routes
- [ ] Verify with a real `GROQ_API_KEY` (Groq structured output was flaky per `test-groq.ts`; fallback: `structuredOutputs: false` or switch to `generateObject`)
- [ ] Replace in-memory rate limit with a shared store before multi-instance deploy
- [ ] Live stays via RapidAPI behind a feature flag with DB fallback _(already falls back when `RAPIDAPI_KEY` is unset)_ — needs your RapidAPI key + decision _(PRD)_
- [ ] Maps/itinerary map view (PRD 7) — needs a maps provider decision (Google Maps vs Mapbox vs Leaflet/OSM) and key
- [x] Design tooling installed: shadcn preset `b5d3ACm4e` applied, AI Elements added (see `design.md`)

**Exit criteria:** itinerary and chat work for a logged-in user; AI route failures show a friendly message.

---

## Phase 4 — Polish, Testing & Launch
**Spec:** production-ready quality, plus any PRD features the owner decides to include.

**Deliverables**
- [ ] Fill in `design.md` (palette, fonts, type scale) — **needed from you**; then apply consistently across pages (they still use pre-preset `glass`/teal styling) and reconcile `Outfit` vs Manrope
- [ ] Remaining PRD features not yet scheduled: packages (PRD 10), groups (PRD 11), local guides (PRD 8), transport/service booking and payments (PRD 9) — need scoping decisions
- [ ] Mobile responsiveness pass; accessibility pass
- [ ] Loading, empty and error states on every page
- [ ] Tests for API routes and critical flows; `npm run build` and `npm run lint` clean
- [ ] SEO metadata, image optimisation (`next/image`, real hosts in `next.config.mjs`)
- [ ] Deploy (e.g. Vercel + MongoDB Atlas) with env vars documented

**Exit criteria:** clean build, passing tests, deployed URL.
