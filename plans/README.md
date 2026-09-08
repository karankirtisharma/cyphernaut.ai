# Animation plans

| # | Plan | Status |
|---|---|---|
| 001 | [Compose the services pillar reveal with GSAP](001-pillar-card-reveal.md) | DONE — commit `2952251` |

No dependencies between plans yet.

## Findings not turned into plans

Recorded so a later pass does not re-derive them.

- **LOW / cohesion** — `[data-rise]` remains the site-wide primitive on the home, launch,
  team and contact pages. Its 620ms duration against 14px of travel has the same
  curve/travel mismatch diagnosed in 001, but on short text elements the mismatch is much
  less visible. Worth revisiting only if those pages get the same card-grade treatment.
- **LOW / performance** — `usePageMotion` runs a permanent rAF loop that calls `catchUp()`
  every 10 frames purely to sweep for unrevealed `[data-rise]` elements. Once every reveal
  on a page has fired the loop has nothing left to do but still runs for the life of the
  page. Cheap, but it never stops.
