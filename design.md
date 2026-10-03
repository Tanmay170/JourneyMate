color and theme 
fonts
typography

shad cn coponents :
pnpm dlx shadcn@latest init --preset b5d3ACm4e --template next

vercel ai elements :

npx ai-elements

---

## Setup status (maintained by Claude — last updated 2026-10-03)
- ✅ `shadcn init --preset b5d3ACm4e --template next` **has been run** (with `--force`; npm used instead of pnpm). Result in `components.json`: style `radix-maia`, base colour `zinc`, CSS variables on, `lucide` icons. All `components/ui/*` were re-generated and `app/globals.css` / `lib/utils.ts` updated.
- ✅ `npx ai-elements` **has been run**. Components are in `components/ai-elements/*`. Four were removed because they fail typecheck with the installed packages: `agent`, `context`, `schema-display`, `voice-selector`. Only `/chat` uses AI Elements so far.
- ✅ `TooltipProvider` added to `components/providers.tsx` (required by the new components).

## Current implemented tokens (what the code does today — not yet a design decision)
- **Theme:** dark mode forced (`<html class="dark">`); light tokens also defined. Primary is teal (`oklch(0.511 0.096 186)`), neutrals are zinc, `--radius: 0.625rem`.
- **Fonts:** Manrope for `--font-sans` and `--font-heading`; `Outfit` is still applied on `<body>` (conflicts with the above).
- **Custom utility:** `.glass` (translucent background + blur + faint white border) used across older pages.
- **Not yet applied:** existing pages (home, destinations, stays, dashboard, …) still use hardcoded `glass`/teal styling from before the preset. Restyle is Phase 4.

## Still to define (needed from you)
Colour palette (brand/primary/accent, light vs dark default), font choices and type scale (headings/body sizes and weights), and any imagery/illustration style. Once filled in above, I'll map them into `globals.css` tokens and update the pages.
