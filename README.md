# Mayank Rana — Built From First Principles

A production-ready personal portfolio for **Mayank Rana** (Software Engineer,
CSE-AI undergraduate at IIIT Bhopal): a normal scrolling website where rough
engineering ideas progressively transform into polished, working systems.

One visual story runs throughout: **Thought → Structure → System → Result.**

## Stack

- **Vite + React + TypeScript** (fully static build, no server)
- **Zero animation/physics/WebGL dependencies** — scroll-driven SVG, canvas
  instruments, and CSS transitions owned by the components themselves
- Plain CSS with a token system (`src/tokens.css`) — no UI framework, no icon library
- Type roles: Newsreader (editorial serif) + DM Sans (technical sans) +
  IBM Plex Mono (diagnostics only), all `display=swap` with system fallbacks

## Project structure

```
portfolio-book/
├── index.html                  # SEO, OG/Twitter cards, JSON-LD Person schema
├── public/
│   ├── favicon.svg
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
│   │   ├── motion.tsx          # silent OS motion preference
│   │   └── reveal.tsx          # useInView, useScrollProgress, usePageProgress
│   └── components/
│       ├── Nav.tsx             # sticky nav, progress line, mobile menu
│       ├── Hero.tsx            # giant statement + scroll-morphing signature line
│       ├── ProofStrip.tsx      # four evidence blocks with line drawings
│       ├── ProjectChapter.tsx  # alternating chapter + in-place case study
│       ├── GatewayVisual.tsx   # sketch → live route + failover simulation
│       ├── DigitVisual.tsx     # math → pipeline → drawable classifier canvas
│       ├── DashVisual.tsx      # unstable bars → pooling rig + frame graph
│       ├── ToolsVisual.tsx     # server crossed out → local before/after demo
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

Update the `canonical` URL in `index.html` to the final domain.

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

- Normal document scroll everywhere: no hijacking, no snapping, no forced
  horizontal movement. Scroll drives pacing through passive listeners + rAF.
- Signature line morphs request-path → neural curve → frame graph → search
  tree from hero scroll progress (lerped polylines, identical point counts).
- Project visuals evolve rough → polished across scroll stages, then stay
  live: failover replays, drawable classifier, pooling toggle, local processor.
- Case studies expand in place (grid-rows animation) keeping the title on
  screen; anchor `#hash` links work natively, plus a mount-time deep-link
  scroll for fresh loads (browsers scroll before React mounts content).
- Canvas loops start only when their stage is reached, pause when the tab
  hides, and clean up on unmount. Reduced motion renders static states.
- The digit classifier is a real on-device template matcher (28×28 MSE over
  font-rendered prototypes), honestly labeled as illustrative of the deployed
  CNN pipeline. Dash frame data is measured live; Tools timing is measured
  with `performance.now()`. Only documented project results are stated.
- **Show layer** (`components/motion.tsx`, `StatementStrip`, `WorkIndex`,
  `Marquee`): a sticky scroll-linked statement strip (transform only, never
  layout); a fast-scan project index whose hover preview follows the cursor
  (dimming siblings, touch devices get plain anchor rows); magnetic CTAs and
  subtle 3D figure tilt (pointer-fine only, inert on touch/reduced motion);
  a one-shot text decode on the hero kicker; a pure-CSS tech ticker; a
  keyboard-operable before/after comparison slider; copy-email feedback plus
  a live IST clock; scrollspy nav highlighting. All progressive enhancement —
  every control works statically without its motion.

## Design rationale

- **One idea, everywhere.** Every project evolves from rough thought to
  working system — hero line, architectures, pipeline, pooling rig, browser
  boundary, skill symbols, timeline, finale monogram.
- **Editorial first.** Warm paper, ink text, one vermilion accent, per-project
  engineering colors in lines and states only. Asymmetry, margin discipline,
  cropped numerals — every scene composed to survive as a static screenshot.
- **Four motions only.** Line drawing, mask reveals, in-place expansion,
  subtle depth. No fade-up-everywhere, no bouncy easing, no typewriters,
  no cursors, no floating logos.
- **Familiar shell.** Sticky nav with progress line, standard anchors, mobile
  menu, stacked mobile layouts, browser Back working normally.

## Performance decisions

- No WebGL, no animation libraries, no icon library (inline SVG only).
- Passive scroll listeners with rAF throttling; state updates only past
  epsilon thresholds; canvases idle until visible.
- Fonts `display=swap` with system fallbacks; only three families.
- Targets: < ~170 KB compressed JS (~86 KB today), systemic 60 FPS,
  zero console errors.

## Accessibility decisions

- Semantic landmarks, single `h1`, logical heading order, skip link.
- Full keyboard model (all buttons/links native; drawer-free nav); visible
  focus rings; 44 px minimum targets; menu returns focus on close.
- Canvas demos all have text alternatives (diagnostic readouts beside them).
- `prefers-reduced-motion` freezes scroll morphs, packets, and canvas loops;
  simulations resolve to static documented states.
- Native scroll behavior is never altered on any device.

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
