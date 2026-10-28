# Mayank Rana — Built From First Principles

A production-ready personal portfolio for **Mayank Rana** (Software Engineer,
CSE-AI undergraduate at IIIT Bhopal): a normal scrolling website where rough
engineering ideas progressively transform into polished, working systems.

One visual story runs throughout: **Thought → Structure → System → Result.**

## Stack

- **Vite + React + TypeScript** (fully static build, no server)
- **Lenis 1.3.27** for smooth wheel scrolling inside normal document flow —
  no scroll hijacking, snapping, or pinned horizontal sections
- **No GSAP, Framer Motion, WebGL, or physics engine** — scroll-driven SVG,
  canvas instruments, and CSS transitions owned by the components themselves
- Plain CSS with a token system (`src/tokens.css`) — no UI framework, no icon library
- Type roles: Newsreader (editorial serif) + DM Sans (technical sans) +
  system monospace (diagnostics only), all `display=swap` with system fallbacks

## Project structure

```
portfolio-book/
├── index.html                  # SEO, OG/Twitter cards, JSON-LD Person schema
├── public/
│   ├── favicon.svg
│   ├── og-cover.png            # 1200×630 social card
│   ├── apple-touch-icon.png
│   ├── manifest.webmanifest
│   └── assets/Mayank_Rana_SWE.pdf   # downloadable resume
├── src/
│   ├── main.tsx                # entry
│   ├── App.tsx                 # page composition (normal scroll, no hijack)
│   ├── tokens.css              # palette, type, motion tokens
│   ├── index.css               # editorial system + responsive + reduced motion
│   ├── data/
│   │   └── portfolio.ts        # ★ facts: profile, projects (+case studies,
│   │                           #   code excerpts), skills index, journey
│   ├── lib/
│   │   ├── scroll.ts           # one shared passive scroll + rAF loop
│   │   ├── reveal.tsx          # useInView, useScrollProgress
│   │   └── smooth.ts           # Lenis mount, anchor scrolling, scroll lock
│   └── components/
│       ├── motion.tsx          # Magnetic, Tilt, Parallax, ScaleIn, Scramble
│       ├── Nav.tsx             # sticky nav, progress line, mobile menu dialog
│       ├── Hero.tsx            # masked headline + scroll-morphing signature line
│       ├── ProofStrip.tsx      # four evidence blocks with counters
│       ├── ProjectChapter.tsx  # alternating chapter + in-place case study
│       ├── GatewayVisual.tsx   # sketch → live route + failover simulation
│       ├── DigitVisual.tsx     # math → pipeline → drawable classifier canvas
│       ├── DashVisual.tsx      # unstable bars → pooling rig + frame graph
│       ├── ToolsVisual.tsx     # server crossed out → local before/after demo
│       ├── WorkIndex.tsx       # hover-preview project index
│       ├── StatementStrip.tsx  # sticky scroll-linked statement
│       ├── Marquee.tsx         # pure-CSS tech ticker
│       ├── SkillsIndex.tsx     # numbered index + draw-on-view symbols
│       ├── About.tsx           # asymmetric statement + education
│       ├── Journey.tsx         # vertical timeline, line draws with scroll
│       ├── Contact.tsx         # dark finale + MR monogram completion
│       └── icons.tsx           # inline SVG icons (no library)
```

## Installation & local development

Requirements: Node.js 20+.

```powershell
cd portfolio-book
npm install
npm run dev      # local dev server (default http://localhost:5173)
```

## Production build & preview

```powershell
npm run build    # type-checks (tsc -b) and emits dist/
npm run preview  # serve the production build locally
```

Fully static (`dist/`), deployable anywhere with `base: './'`.

## Deployment

**GitHub Pages:** `npm run build`, publish `dist/` (e.g. `npx gh-pages -d dist`,
or a workflow running `npm ci && npm run build`).

**Netlify:** build command `npm run build`, publish directory `dist`.

**Vercel:** framework preset “Vite”, build `npm run build`, output `dist`.

Update the `canonical` URL in `index.html` once the final domain is known.

## Content model — changing information later

- Portfolio facts → `src/data/portfolio.ts` (profile, projects, skills, journey).
- Each project carries its case study: `constraints`, `implementation`,
  `learned`, and a 5–8 line `code` excerpt. Excerpts are captioned
  illustrations of real stack patterns — keep them short, honest, and ASCII-safe
  (non-ASCII source bytes have corrupted builds before; prefer entities).
- Skills index groups, journey entries, and contact links render directly from
  the same file — no duplicated content anywhere.
- Resume: overwrite `public/assets/Mayank_Rana_SWE.pdf` (keep the filename).

## Interaction architecture

- **Normal document scroll everywhere.** Lenis smooths wheel input on
  pointer-fine devices only; it never hijacks, snaps, pins, or limits scroll.
  Touch keeps native momentum. Anchors are ordinary links resolved through
  `lib/smooth.ts`, with a mount-time deep-link pass after fonts settle. Under
  `prefers-reduced-motion` Lenis is never mounted and native scrolling returns.
- **One scroll loop.** `lib/scroll.ts` owns a single passive scroll/resize
  listener plus one rAF loop. Every scrubbed effect subscribes; none adds its
  own listener. `lib/reveal.tsx` adds IntersectionObserver reveals and
  epsilon-gated progress updates, so React re-renders only on meaningful change.
- **Motion vocabulary (eight effects, chosen once):** masked headline reveals;
  scroll parallax on figures; stagger fade-ups for editorial blocks; proof
  counters that run once on entry; a CSS tech marquee; figure depth/scale;
  a 2px scroll-progress line; and a contact finale that scales into place.
  Magnetic CTAs, card tilt, the before/after slider, the work-index hover
  preview, and the sticky statement strip layer on top, all transform-only.
- **Signature line** morphs request-path → neural curve → frame graph → search
  tree from hero scroll progress (lerped polylines, identical point counts).
- **Project visuals** evolve rough → polished across scroll stages, then stay
  live: failover replays, drawable classifier, pooling toggle, local processor.
  Telemetry rows reserve their height, so simulations never shift layout.
- **Case studies** expand in place (grid-rows animation) keeping the title on
  screen. Canvas loops start only when their stage is reached, pause when the
  tab hides, and clean up on unmount.
- **Honest demos.** The digit classifier is a real on-device template matcher
  (28×28 MSE over font-rendered prototypes), labeled as illustrative of the
  deployed CNN pipeline. Dash frame data is measured live; Tools timing uses
  `performance.now()`. Only documented project results are stated.
- **Navigation.** Glass sticky nav with scrollspy (`aria-current`), a hairline
  progress bar, and a focus-trapped mobile dialog that locks scroll and returns
  focus on close. Copy-email announces through a live region with a stable
  accessible name; the IST clock is live text.
- **Reduced motion.** Lenis, marquee, grain, parallax, scramble, and scroll
  morphs switch off; simulations resolve to their static documented states.

## Design rationale

- **One idea, everywhere.** Every project evolves from rough thought to
  working system — hero line, architectures, pipeline, pooling rig, browser
  boundary, skill symbols, timeline, finale monogram.
- **Editorial first.** Warm paper, ink text, one vermilion accent, per-project
  engineering colors in lines and states only. Asymmetry, margin discipline,
  cropped numerals — every scene composed to survive as a static screenshot.
- **A deliberately small motion vocabulary.** Masked reveals, scroll parallax,
  stagger, counters, one marquee, figure depth, a progress line, and a single
  finale scale-up. No fade-up-everywhere, no bouncy easing, no typewriters,
  no cursor spotlights, no floating logos.
- **Familiar shell.** Sticky nav with progress line, standard anchors, mobile
  menu, stacked mobile layouts, browser Back working normally.

## Performance decisions

- No WebGL, no GSAP/Framer Motion, no icon library (inline SVG only).
- Lenis is the only motion dependency and all scrubbed effects share one
  passive listener + rAF loop; state updates only past epsilon thresholds;
  canvases idle until visible.
- Fonts `display=swap` with system fallbacks; only three families.
- Targets: < ~110 KB compressed JS (~97 KB today), 60 FPS+, zero console errors.

## Accessibility decisions

- Semantic landmarks, single `h1`, logical heading order, skip link.
- Full keyboard model; the mobile menu is a modal dialog with a focus trap,
  Escape handling, scroll lock, and focus return; visible focus rings; 44 px
  minimum targets.
- Canvas demos all have text alternatives (diagnostic readouts beside them).
- `prefers-reduced-motion` removes Lenis, the marquee, grain, and scroll
  morphs; simulations resolve to static documented states.
- Native scrolling is never altered when reduced motion is requested.

## Verified in this pass

- `npm run build` (tsc + Vite) and `npm run lint` (oxlint) are clean.
- Chrome production preview: zero console errors and zero failed requests.
- No horizontal overflow at 1440×900, 768×1024, or 375×812.
- Document height stays 10,659 px while scrolling; the sticky nav stays 67 px
  at rest and after scroll, so anchor targets do not drift.
- Nav anchors settle 72–73 px below the viewport top; deep links land at 72 px.
- Counters finish at 800+, 25%, 97%, 60 FPS; the contact finale resolves to
  `matrix(1, 0, 0, 1, 0, 0)` at the page bottom.
- Copy-email width is stable at 232 px before/after; feedback is announced.
- Scripted-scroll frame timing: 6.94 ms average, 7.2 ms p95 (headless Chrome,
  144 Hz host) — comfortably inside a 60 FPS budget.
- Reduced motion: Lenis not mounted, marquee/grain disabled, static visuals.

## Browser & viewport testing checklist

- [ ] Chrome, Edge, Firefox, Safari, Android Chrome, iOS Safari (where possible)
- [ ] 320×568 · 360×800 · 390×844 · 412×915 · 768×1024 · 820×1180 · 1024×768 ·
      1280×800 · 1440×900 · 1920×1080 · landscape phone ~844×390
- [ ] Hero statement + signature line read in one screen; proof strip concise
- [ ] All four visuals evolve on scroll; every demo engages and resets
- [ ] Case studies expand in place without losing the title
- [ ] Skills symbols draw on entry; timeline draws downward; monogram completes
- [ ] Mobile menu opens/closes/navigates; sections stack without overlap
- [ ] Deep links (`#work` … `#contact`) land correctly on fresh loads
- [ ] Resume downloads; external links open safely (`rel="noopener"`)
- [ ] No horizontal overflow anywhere; CPU-throttled pass; zero console errors
