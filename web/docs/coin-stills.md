# Coin stills — `a1`–`a4`

The coin you see on the site is drawn in CSS (`.coin-body` + `.coin-rings` +
`.coin-bevel` + `.coin-rim`). It is a placeholder. The app probes for real
images at runtime and swaps them in the moment they exist — no code change
needed, just drop the files in.

## Where the files go

```
web/public/assets/a1.webp
web/public/assets/a2.webp
web/public/assets/a4.webp
```

`.webp` is preferred; `.jpg` and `.png` are also probed, in that order. Until a
file exists the probe 404s and the CSS coin stays — those 404s in the console
are expected, not a fault.

## Who reads which file

| File | Consumer | Shape needed |
|---|---|---|
| `a1` | Home hero coin, the "quiet" coin, and the **cold** layer of the peak. Launch hero panel. | Round cutout, transparent |
| `a2` | The **ignited** layer of the peak (crossfades over `a1` on scroll). Launch × 2 and Services lifecycle panels. | Round cutout, transparent |
| `a4` | Services hero panel only | Full-bleed rectangular macro |
| `a3` | **Not referenced anywhere.** The original spec listed it; no code reads it. Skip it. | — |

## Transparent background is required for `a1` and `a2`

Not a preference — the page's ground colour animates as you scroll, interpolating
`#070908` → `#0A0C0B` → `#0B120A` through the peak section. Any baked-in
background reads as a rectangle sliding against that shifting ground.

`.coinstill` in `globals.css` used to hide this with a radial mask that faded a
solid black background out at the edges. That mask has been removed, because
against a real cutout it eats the coin's own lime rim. The rule is now
`background-size: contain` with no mask, so the alpha silhouette composites
directly onto whatever the ground colour currently is.

`a4` is the exception: it sits inside `.slot`, which is a bordered card with its
own solid `#050605` fill, so a full-bleed image with a baked background is fine
there.

## The constraint that decides how you generate these

**`a1` and `a2` must be the same coin at the same camera angle.** The peak
section crossfades between them as you scroll — `a1` is the cold coin, `a2` is
the same coin with the rim light hot. Only the lighting may change. If the two
images show different coins or different angles, the crossfade reads as a
glitch rather than an ignition.

Two independent text-to-image generations will not hold object identity. So:

1. Generate `a1` first, and keep going until you have one you're happy with.
2. Produce `a2` by **editing `a1`** — an image-to-image / inpaint / "edit this
   image" pass on the actual `a1` file, not a fresh generation from the prompt.
   Ask only for the lighting change. This is what preserves identity.

If you can only get one usable image, supply `a1` alone. The peak still works —
`.coin-bloom` is not hidden by `.hasstill`, so the lime halo still swells on
scroll — but you lose the rim sweep, so the ignition reads noticeably weaker.

## Budget

Three files, not four — `a3` is dead (nothing reads it), so skip it and save a
quarter of the spend. Ceiling for this batch is **50 credits**. Order of value
if you run short: `a1` first (it feeds the home hero, the quiet coin and the
cold half of the peak), then `a2`, then `a4` (one Services panel only).

## If Higgsfield cannot output a transparent background

Its GPT Image integration may not expose an alpha/transparent option. If you
only get solid backgrounds, **tell me before dropping the files in** — the
radial mask in `.coinstill` that used to dissolve a solid `#070908` backdrop has
been removed in favour of alpha, and a solid-background still will render as a
visible dark rectangle against the scroll-animated ground. Restoring it is a
one-line change, but it has to match what the files actually are.

If you can only get solid backgrounds, generate on `#070908` exactly (the
original spec's value) so the restored mask blends cleanly.

## Prompts

Paste this preamble at the top of every prompt:

> Cinematic product photograph of one machined black metal coin, shot on a 35mm
> anamorphic lens. Low-key studio lighting: a single hard acid-lime (#BFFF00)
> rim light from the upper right, a faint cool fill from the left, deep falloff
> into shadow. **Transparent background — the coin cut out, alpha channel, no
> backdrop, no floor, no shadow cast onto anything.** The coin is brushed black
> steel with fine concentric machining rings and a polished bevel edge that
> catches the lime light; the face is plain. Shallow depth of field, matte film
> grain, subtle halation on the lit edge. Photographic realism, high dynamic
> range. No text, no lettering, no numbers, no logo, no symbols, no second
> object, no hands, no room reflections, no lens flare streaks, no glow blobs,
> no plastic sheen, not CGI, not clay, not illustration.

Then append one of:

| Save as | Ratio | Scene |
|---|---|---|
| `a1.webp` | 1:1 | The coin centred and square in frame, tilted about 25 degrees toward the camera, lit edge on the upper right. Only the rim is lit; the face is almost fully in shadow. The coin fills most of the frame with a small even margin. |
| `a2.webp` | 1:1 | *(edit `a1`, do not regenerate)* Same coin, same angle, same framing. Raise the lime rim light to full intensity so it wraps the whole bevel, and add a thin lime haze just off the lit edge. Change nothing else. |
| `a4.webp` | 16:9 | Extreme macro of the coin's bevel and machining rings, lime light raking across the ridges, everything else falling to black. Subject low in frame, empty black space above. A solid `#070908` background is fine for this one. |

**Reroll if:** any text, lettering or symbol appears; a second object or a hand
appears; the cutout has a halo or leftover background fringe; the coin reads as
plastic or CGI; the lit edge is on the wrong side.

## After you add them

Square the cutouts (`a1`/`a2`) to a 1:1 canvas with the coin centred — the CSS
sizes them with `background-size: contain` inside a square box, so an off-centre
or non-square canvas will sit visibly off-axis. Re-encode to WebP with the alpha
channel preserved; keep each under ~300KB.
