# Tech Spec — FIND Real Estate

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | ^19.0.0 | UI framework |
| react-dom | ^19.0.0 | DOM renderer |
| vite | ^6.0.0 | Build tool |
| @vitejs/plugin-react | ^4.4.0 | Vite React plugin |
| tailwindcss | ^4.0.0 | Utility CSS |
| gsap | ^3.12.7 | Core animation engine (ScrollTrigger, DrawSVG, MorphSVG) |
| lenis | ^1.2.3 | Smooth scroll with inertia |
| splitting | ^1.0.6 | Text splitting for stagger animations |
| typescript | ^5.7.0 | Type safety |
| @types/react | ^19.0.0 | React type definitions |
| @types/react-dom | ^19.0.0 | React DOM type definitions |

**Fonts**: Inter + Playfair Display loaded via Google Fonts CDN link in `index.html`. No npm font packages.

**Dev tooling**: `vite-plugin-static-copy` for public assets if needed.

---

## Component Inventory

### Layout Components

| Component | Source | Reuse | Notes |
|-----------|--------|-------|-------|
| Navigation | Custom | Global | Fixed top bar, transparent on hero, solid on scroll. Dynamic text color. |
| Footer | Custom | Global | Dark bg, newsletter input, link grid, massive FIND logotype. |
| CustomCursor | Custom | Global | SVG cursor with velocity-based morphing (dot → arrow → circle). |

### Section Components

| Component | Source | Notes |
|-----------|--------|-------|
| HeroSection | Custom | Pinned scroll sequence with SVG mask reveal. Most complex section. |
| ManifestoSection | Custom | Simple centered text with split color treatment. |
| HorizontalGallery | Custom | Scroll-jacking horizontal image/video scroll (300vh pin). |
| PhilosophySection | Custom | Split layout with isometric arrow graphic + lifestyle photography blend. |
| ProcessSection | Custom | 2-col grid, sticky left heading, numbered steps on right. |
| CareersSection | Custom | Asymmetric 2-col, tall portrait + text. |
| TestimonialsSection | Custom | Numbered pagination (1–5) with crossfade transitions. |
| ServicesAccordion | Custom | Dark bg, 3-row hover-expand accordion (Buy/Sell/Rent). |
| SupportGrid | Custom | 3-column card grid on light bg. |
| BlogSection | Custom | Stacked article rows with date/title left, image right. |
| CTASection | Custom | Centered text over looping background video. |

### Reusable Components

| Component | Source | Used By | Notes |
|-----------|--------|---------|-------|
| PillButton | Custom | Hero, Process, Careers, CTA | Pill-shaped CTA (`rounded-full`, arrow icon). Two variants: dark bg + light text, light bg + dark text. |
| SectionHeader | Custom | Multiple | H2 with optional split-color treatment (dark + gray). |
| SplitColorText | Custom | Manifesto, Careers | Text where first part is dark, second part is gray. |
| AnimatedEntrance | Custom | All sections | Wrapper that triggers fade-up + scale entrance on scroll into view via ScrollTrigger. |

---

## Animation Implementation

### Animation Library Choices

| Animation | Library | Approach | Complexity |
|-----------|---------|----------|------------|
| **Hero SVG mask reveal** | GSAP + ScrollTrigger | Pin hero wrapper (150% scroll distance). Timeline: fade headline → reveal video → re-center logo text → slide mask shapes offscreen → fade video → slide overlay off. | **High** 🔒 |
| **Smooth scrolling** | Lenis | Global Lenis instance with lerp 0.15. Connect to GSAP ticker via `lenis.raf()`. | Low |
| **Horizontal scroll gallery** | GSAP ScrollTrigger | Pin section for 300vh, translate inner track horizontally based on scroll progress. | Medium |
| **Custom cursor morphing** | GSAP | Mousemove listener tracks position + velocity. GSAP tweens SVG path `d` attribute and scale based on speed threshold (8px) and hover target. | Medium |
| **Section entrance animations** | GSAP + ScrollTrigger | Batch pattern: translateY(30px) + opacity 0 → translateY(0) + opacity 1. Stagger children 0.1s. Trigger at `top 80%`. | Low |
| **Image scale-in** | GSAP + ScrollTrigger | Scale 1.05 → 1.0 + opacity 0 → 1 on scroll into view. | Low |
| **Services accordion** | CSS transitions + React state | Hover expands target row (flex-grow transition), compresses siblings. Background image fade-in on expand. | Medium |
| **Testimonials crossfade** | GSAP | On number click: fade out current image + quote, fade in new pair. Duration 0.4s. | Low |
| **Hero text parallax** | GSAP ScrollTrigger | Initial headline translates Y 100px + fades out on scroll. Scrubbed to scroll progress. | Low |
| **Nav color transition** | CSS transition | Background transitions from transparent to white on scroll. Text color adapts via CSS class toggle at scroll threshold. | Low |
| **Splitting text reveals** | Splitting + GSAP | Character/word split on section headers, staggered fade-up entrance. | Medium |

### Animation Architecture

**GSAP ScrollTrigger + Lenis integration**:
- Initialize Lenis globally in `App.tsx`.
- On each Lenis `scroll` event, call `ScrollTrigger.update()`.
- Use `gsap.ticker.add()` to drive Lenis `raf()`.

**Hero sequence critical path**:
- Hero wrapper: `position: fixed`, `z-index: 50`.
- After hero unmounts (SVG overlay slides off), main content at `position: relative`, `z-index: 10` scrolls over.
- Lenis must be locked during the hero pin to ensure consistent scrub behavior.

---

## State & Logic

### Hero Scroll Sequence State Machine

The hero animation is a 4-phase scroll-driven state machine:

| Phase | Scroll % | Action |
|-------|----------|--------|
| 1. Headline exit | 0–20% | Hero H1 fades + translates down. Mask bg fades out. |
| 2. Video reveal | 20–40% | Video opacity 0 → 1. |
| 3. Logo re-center | 40–70% | Logo text scales from 0.9 → 1.0, slides to center. Mask bg fades in. |
| 4. Unmask + exit | 70–100% | F/D mask shapes slide offscreen. Video fades out. SVG overlay slides up offscreen. |

Managed entirely by GSAP ScrollTrigger scrub timeline. No React state needed.

### Cursor State Machine

| State | Trigger | Visual |
|-------|---------|--------|
| Dot | Slow speed, no hover | 6px radius circle |
| Arrow (fast, non-interactive) | Speed > 8px/s, no interactive target | Right-pointing arrow, scale 1x |
| Arrow (fast, interactive) | Speed > 8px/s, hovering interactive | Right-pointing arrow, scale 2.5x |
| Circle (slow, interactive) | Speed ≤ 8px/s, hovering interactive | 10px radius circle, scale 1.5x |

Velocity computed from frame-to-frame mouse delta. All morphs are GSAP tweens on SVG path `d` + scale.

---

## Other Key Decisions

**No shadcn/ui**: This is a bespoke editorial site with zero standard UI patterns (no forms, dialogs, tables, dropdowns). All components are custom-built for the design.

**Video strategy**: All videos are `<video autoPlay muted loop playsInline>` with `object-fit: cover`. Videos are served from `/public/videos/`. For the generated videos, use the video generation tool outputs placed in the public directory.

**SVG mask for hero**: The FIND logo reveal uses an SVG `<mask>` with `<text>` elements. The mask is animated via GSAP manipulating SVG attributes (transform, opacity) — not CSS. This ensures crisp rendering at any viewport size.

**Horizontal scroll**: The aerial perspectives section uses a 300vh tall pinned container. A single inner flex container is translated horizontally via `gsap.to(track, { x: -totalWidth, scrollTrigger: { pin: true, scrub: true } })`. The centered nav links overlay this section with `position: fixed` and dynamic color based on active slide index.

**Responsive approach**: Desktop-first. Mobile breakpoints:
- < 1024px: Horizontal gallery becomes vertical stack. Services accordion becomes tap-to-expand. Custom cursor hidden.
- < 768px: All 2-column layouts collapse to single column. Hero SVG text scales down via `clamp()`.
