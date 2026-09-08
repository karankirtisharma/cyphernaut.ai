# 001 — Compose the services pillar reveal with GSAP

**Repo commit:** `2952251`
**Status:** DONE
**Scope:** `/services` pillar blocks only. No other page's `[data-rise]` behaviour changes.

## Problem

`[data-rise]` (globals.css:251) is a single 14px-translate + fade used site-wide, driven by a
one-shot IntersectionObserver in `lib/motion.ts:entrances()`. On the services pillars it fails
in four measurable ways:

1. A `.shell.feat` card and a one-line label get the same 14px nudge.
2. The `--d: 0/60/120ms` staggers on `.svc` never happen. Measured row pitch inside a pillar is
   163px / 191px, so each row crosses the trigger line hundreds of ms apart and observes itself.
3. `cubic-bezier(.23,1,.32,1)` over 620ms with 14px of travel puts the whole visible move in the
   first ~150ms; the rest is imperceptible settle, so it reads as a crossfade.
4. Trigger is threshold 0 with `rootMargin: 0 0 -12% 0` — the reveal begins on the first visible
   pixel and completes below the fold.

## Target

- Card surface (`.shell`) mask-reveals upward; its `.core` contents rise inside it.
- Rows are grouped by `ScrollTrigger.batch` so rows entering together stagger together.
- Each row's hairline draws left→right, then `h4` and `p` rise, then `.plus` fades.
- `h2.dl` in pillars 2–4 is **left alone** — `wordReveals()` already gives it a per-word mask
  reveal, and globals.css:840 already neutralises its `data-rise`.

## Values

| Element | From | To | Duration | Ease |
|---|---|---|---|---|
| `.shell` | `clipPath: inset(0 0 100% 0 round 24px)`, opacity 0 | `inset(0 0 0% 0 round 24px)`, 1 | 0.9 | `expo.out` |
| `.core > *` | y 26, opacity 0 | 0, 1 | 0.7 | `expo.out`, stagger 0.07 |
| head `p` (pillars 2–4) | y 20, opacity 0 | 0, 1 | 0.7 | `expo.out` |
| `.svc::before` line | `scaleX: 0` | 1 | 0.55 | `power2.out` |
| `.svc h4, .svc p` | y 18, opacity 0 | 0, 1 | 0.6 | `power3.out`, stagger 0.05 |
| `.svc .plus` | opacity 0 | 1 | 0.4, delay 0.18 | `none` |
| row-to-row | — | — | stagger 0.09 | — |

Head trigger `start: "top 78%"`, rows batch `start: "top 88%"`, both `once: true`.

## Constraints

- **Do not write `transform` to `.shell` or `.plus`.** Both declare CSS `transition: transform`
  (globals.css:83, 396); GSAP's per-frame writes would be lagged by it. `.shell` gets `clipPath`
  + `opacity` only (neither is in its transition list); `.plus` gets `opacity` only.
- The `::before` hairline must only replace the border when the effect actually runs. Gate it on
  a class JS adds inside the reveal (`html.pillar-fx`), never on `[data-cn]` — `initScrollFx` is
  skipped under `prefers-reduced-motion`, which would otherwise erase every hairline.
- `::before` on `.svc` (a grid container) must be `position:absolute` so it is not laid out as a
  grid item.
- Remove `data-rise` from every element taken over, so the IO fade cannot double-drive it.
- No JSX changes: the `--d` inline styles become inert but are harmless.

## Verify

- `npm run build` clean.
- On `/services`, each pillar's rows stagger visibly as a group, not one-by-one.
- The lime LAUNCH card wipes up with its corner radius intact (no square corners mid-tween).
- Hairlines are present and static with `prefers-reduced-motion: reduce`.
- `.shell:hover` lift still works after the reveal.
- Feel-check at 0.25× scroll speed: the block should read as constructing itself, not fading.
