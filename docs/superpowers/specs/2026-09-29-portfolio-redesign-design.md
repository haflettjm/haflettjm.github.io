# Portfolio Redesign — Design Spec

Date: 2026-09-29
Owner: Jacob Haflett
Repo: haflettjm.github.io (Nuxt 3 + Tailwind, deployed to GitHub Pages via `gh-pages`)

## 1. Problem

The current site is a single-page terminal emulator: a CRT-styled box where every
piece of content (`about`, `contact`, `skills`, `resume`, `projects`) is locked
behind typing a command. Content is stale (resume stops at "Badger Technologies,
Present" — written roughly three years ago) and the positioning is generic DevOps,
not reflective of where Jacob's career is actually headed. `blog.vue` and
`partners.vue` are routed but entirely empty.

## 2. Goals

- Reposition the site around **AI Engineer** as the lead identity, with cloud/DevOps
  infrastructure experience as the credibility foundation underneath it — not equal
  billing, AI leads.
- Make content scannable without requiring interaction. A recruiter who never types
  a command should still see the resume, projects, and contact info.
- Keep the terminal concept as the site's visual/interaction *language* (monospace
  type, prompt styling, neon glow, scanlines, boot-sequence flavor) — it's
  genre-correct for this audience — but stop using it as a gate.
- Add real motion: a boot-sequence flourish, a typing-effect headline, staggered
  scroll reveals for experience/project sections, a smooth terminal open/close
  transition. Respect `prefers-reduced-motion`.
- Refresh content to reflect current reality: updated experience, new AI/ML/agent
  projects, honest framing of what's production experience vs. active growth.

## 3. Non-goals (this pass)

- **Blog and Partners pages** — currently empty stubs with no defined purpose.
  Not building these blind; they're future scope once there's an actual content
  plan for them. Leave the routes in place but keep them out of primary nav.
- **Go backend integration** — GitHub Pages is static-only hosting, so the WIP Go
  content-generator backend can't run there regardless of this redesign. Content
  continues to ship as static files at build time, same as today.
- **CMS / dynamic content editing** — content stays in versioned files in the repo,
  edited like code.

## 4. Information architecture

Default view is a normal scrollable single page (this is the actual UX change —
today the terminal *is* the whole page):

1. **Hero** — name, "AI Engineer" as the lead role, infra/cloud credibility as
   subhead, primary CTAs (resume, contact, GitHub). Boot-sequence + typing-effect
   animation plays once on load.
2. **Experience** — timeline component, most recent first. Each entry gets a short
   framing line plus 2-4 quantified-impact stat blocks (e.g. "30% perf improvement"
   rendered as a visual stat, not buried in a paragraph). Badger Technologies entry
   reframed to foreground the ML/DataOps substance (pipeline work, model deployment
   infra, ML workload monitoring) instead of generic "DevOps Engineer" language.
3. **Projects** — card grid. Each card: title, one-line description, tag chips
   (tech stack), links (repo/live demo). Needs to include real AI/LLM/agent project
   entries — see open items below; current `projects.md` only has infra/backend
   work.
4. **Skills** — grouped badge clusters. AI/ML group leads (LLM frameworks, RAG,
   agents, vector DBs, applied ML tooling), followed by Cloud/IaC, Containers &
   Orchestration, Backend/Languages, Monitoring, Security. Growth-area items (skills
   actively being built, not yet production-proven) get a distinct visual marker
   rather than being presented identically to production-proven skills.
5. **Contact** — existing links (email, GitHub, phone, location), kept simple.
6. **Terminal toggle** — a persistent small control (e.g. a `>_` icon, fixed
   position) that opens the existing command-line interface as an overlay/panel.
   Same `Terminal.vue` command registry, restyled to match the refreshed visual
   system. This is the "easter egg for people who want to poke at it" — zero
   discovery cost for people who don't.

## 5. Visual system

Extend the existing CRT custom-property system in `assets/styles/tailwind.css`
rather than replacing it — the pink/green neon-on-black identity is worth keeping,
it just needs to be *systematized* instead of hardcoded per component
(`Terminal.vue` currently hardcodes hex colors in scoped `<style>` blocks, separate
from the `--crt-*` vars in `tailwind.css` and again separate from inline hex in
`layouts/default.vue`).

- Consolidate all color/glow/font values into CSS custom properties in one place
  (`assets/styles/tailwind.css` `:root`), remove the duplicated hardcoded hex
  values currently scattered across `Terminal.vue`'s `<style>` block and
  `layouts/default.vue`'s `<style>` block.
- Add a real type scale (currently just one `clamp()` utility, `.text-crt`) and a
  spacing scale, both as tokens, so hero/section headings have deliberate
  hierarchy instead of ad-hoc Tailwind sizing.
- Calm the glow down for body text and long-form content (current
  `text-shadow: 0 0 2px` on every link/paragraph hurts readability at resume-entry
  length); keep strong glow for accent moments (headings, the terminal panel,
  hover states).

## 6. Animation approach

**Library: GSAP + ScrollTrigger** (ScrollTrigger is free as of GSAP 3.13+) for
choreographed, timeline-based sequences:

- Boot-sequence flourish + typing-effect hero headline on load.
- Staggered reveal of experience entries and project cards as they scroll into
  view.
- Terminal panel open/close transition.

Plain CSS transitions handle cheap micro-interactions (hover states, link color
changes) — no need to route those through GSAP.

Why GSAP over lighter alternatives (Anime.js, AOS, native CSS): the boot-sequence
and typing-effect are genuinely timeline/sequence-dependent (ordered steps with
precise timing, not just "fade in on scroll"), which is GSAP's strength.
Anime.js v4 or AOS would be sufficient for the scroll-reveal parts alone but would
mean reaching for a second tool for the sequenced hero animation — one dependency
covers both cases cleanly.

All GSAP-driven animation respects `prefers-reduced-motion: reduce` — reveals
become instant/opacity-only instead of animated when set.

## 7. Content data model

Move Experience, Projects, and Skills off loose prose markdown (which the current
`markdownParser.ts` renders generically) onto small structured data files the new
components can bind to directly — this is what makes the stat blocks, tag chips,
and staggered card reveals possible without re-parsing markdown for structure it
was never designed to carry:

- `content/experience.ts` — array of role objects (company, title, dates, framing
  line, stat blocks).
- `content/projects.ts` — array of project objects (title, description, tags,
  links).
- `content/skills.ts` — grouped skill arrays with a `growth: boolean` flag for
  actively-being-built items.

`about.md`, `resume.md` (as a downloadable/printable artifact), and `contact.md`
stay as plain markdown through the existing `renderMarkdown` pipeline — they're
genuinely prose, not list-of-records data.

## 8. Open content gaps (need input from Jacob before final copy)

These don't block building the system — it gets built against current/placeholder
content — but final copy can't ship without them:

1. **Experience updates since ~2023**: anything changed at Badger Technologies
   (new title, promotion, new responsibilities), any new role since, updated
   metrics.
2. **AI/LLM/agent project specifics**: names, descriptions, tech stack, links for
   the LLM/agent work and applied-ML work referenced in this conversation. Current
   `projects.md` has none of this.
3. **New certs/skills** picked up since the current resume was written.

## 9. Testing / verification

- Manual check in dev server (`deno task dev` / `npx nuxt dev`) at each major
  milestone: hero animation, experience timeline, project cards, terminal toggle.
- Mobile breakpoint check (the current terminal is notably fragile at small
  widths — `Terminal.vue` has manual `clamp()`/`vw` sizing that should get
  revisited as part of the token system).
- `prefers-reduced-motion` check (toggle OS setting, confirm animations degrade
  gracefully).
- Basic Lighthouse pass for animation performance / CLS from the boot sequence.

## 10. Risks

- GSAP adds bundle weight (~50-70KB core + ScrollTrigger, tree-shakeable) — acceptable
  for a portfolio site, but worth confirming Lighthouse performance score stays
  healthy after integration.
- Restructuring Experience/Projects/Skills off markdown onto typed data files is a
  breaking change to the current `commandRegistry` pattern in `Terminal.vue`,
  which assumes every section is a markdown file at `/content/{name}.md`. The
  terminal toggle's command handlers need updating to read from the new data
  files (or render a data-driven view) instead of fetching markdown for those
  three sections specifically.
