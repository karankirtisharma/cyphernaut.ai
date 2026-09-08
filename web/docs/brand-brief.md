# CYPHERNAUT: One-Shot Master Prompt for Claude Design

Attach the five reference images with this prompt. Build the whole site in one pass. Do not ask questions, do not narrate the design back, do not summarise: output the build.

---

## 0. Role and objective

You are building the new **cyphernaut.in**: a single-page, scroll-choreographed marketing site for Cyphernaut, a crypto and Web3 marketing, launch and community agency. The bar is an Awwwards-level cinematic editorial page: clean, crisp, atmospheric, slow, expensive. Nothing on it may read as a template.

Three sources of truth, in this order when they collide:

1. **This document**: the content (§8), the act score (§4, §5), the signature move (§6), the hard rules (§10).
2. **The five reference images**: the visual law for structure, rhythm, type, colour, card language and composition (§1).
3. **The technique libraries** named in §12.

---

## 1. How to read the five reference images

They are the **strict source** for: section rhythm, negative space, the near-black canvas, the acid-lime accent used at roughly 10%, oversized tight grotesk display type, one object that breaks the grid, featured-card emphasis, bento hierarchy, plus-circle affordances, and a motion feel that is slow and heavy.

They are **not the source** for: content, copy, products, pricing, testimonials, logos, statistics, or any section reproduced one-for-one. No phones, headphones or laptops appear on this site. The hero object is defined in §5.

| Ref | What to take from it |
|---|---|
| R1 (crypto hero) | Object breaks the grid on the right, thin lime orbit lines, restrained nav, the one lime featured card in a row of dark cards |
| R2 (long crypto page) | Section rhythm: information, then a large statement, then modules; the close is the brightest thing on the page |
| R3 (headphones) | Diegetic lime light (the accent exists inside the imagery, not only in UI), oversized cropped display type, a guided step layout |
| R4 (mobility) | Type and object physically intersect, cropped display words as texture, small floating annotation pills used sparingly |
| R5 (AI enterprise) | Bento with unequal cells, the lime hero card inside the bento, plus-circle affordances, dark / lime / neutral card rhythm |

---

## 2. The brief

Interview answers, client's words kept where given:

1. **Vibe:** clean, crisp, modern, atmospheric, premium. References: the five attached images.
2. **Journey:** hero, what Cyphernaut is, the services, the launch lifecycle, what comes with it, the team, contact. (Consolidated 80/20 from the old site's seventeen sections; every fact survives, the filler does not.)
3. **Energy:** quiet open, steady build, one loud moment at the launch, then settle to calm.
4. **Feeling and the one moment:** the curve below. The moment is the ignition.
5. **One thing no site does:** a lime orbit line the visitor draws down the whole page with their own scroll (§6).
6. **Range:** premium-minimal with soft-brutalist type. Heavy display, medium radii, hard lime, no glow.
7. **Structure:** distinct scenes, not one unbroken world.
8. **Assets:** the old site's four real team photos (§8.7). Everything else generated inside a 70-credit Higgsfield cap (§9). The old purple logo is retired; the wordmark is set in type.

### The feeling curve (one line per act, emotion first, cause second)

```
1  Curiosity     one black coin lit from one side, and a lime line that starts to draw as the wheel moves
2  Recognition   the visitor's situation named plainly on a near-empty screen
3  Confidence    twelve services as four pillars, one of them lit
4  Stillness     the coin returns, small and dim, one line of copy, nothing else   (authored silence)
5  Awe   PEAK    the coin ignites: the whole screen goes from black to lime in one push, then settles
6  Trust         four outcomes in plain type, quiet after the peak
7  Intimacy      four real faces in the same light as the coin
8  Resolve       the line closes into a ring around one button, and everything stops
```

**The peak**, as a visitor would say it: "You scroll and the coin ignites: the screen goes from black to lime in one push, then settles into a steady burn." It lives in act 5 and has the largest scroll span on the page by a visible margin.

**The tell-someone sentence:** "It's the site where a lime orbit line follows you all the way down, the coin ignites halfway, and the line closes into a ring around the button at the end."

**Authored silence:** act 4 is intentionally near-empty. Do not fill it.

---

## 3. Design tokens

```css
:root {
  --canvas: #070908;        /* off-black with a green cast; never #000 */
  --canvas-lit: #0B120A;    /* the ground during and after ignition */
  --surface: #111413;
  --surface-2: #1A1C1B;
  --ink: #F2F2ED;
  --ink-soft: #A3A69F;      /* tinted, never flat grey */
  --ink-mute: #70736F;
  --accent: #BFFF00;
  --accent-ink: #0A0C08;    /* text on lime */
  --hair: rgba(255,255,255,.10);
  --edge: rgba(255,255,255,.14);   /* 1px top highlight on raised surfaces */
  --font-display: "Archivo", system-ui, sans-serif;
  --font-text: "Geist", system-ui, sans-serif;
  --ease-out: cubic-bezier(.23, 1, .32, 1);
  --ease-drawer: cubic-bezier(.32, .72, 0, 1);
  --r-1: 12px; --r-2: 16px; --r-3: 24px;
  --measure: 62ch;
}
```

**Spacing:** 4px base scale (4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192). Section padding is fluid: `clamp(4rem, 10vw, 9rem)` desktop, never more than `3rem` on phones. More space above a heading than below it, always. Gutters `clamp(1.25rem, 4vw, 4rem)`.

**Type ramp** (desktop / phone; weight; tracking; line-height):

| Role | Size | Weight | Tracking | Leading |
|---|---|---|---|---|
| Display XL (hero, "Ignition.") | `clamp(3.4rem, 8vw, 7.5rem)` / 2.6rem | 800 | -0.035em | 0.94 |
| Display L (section) | `clamp(2.4rem, 5vw, 4.5rem)` / 2rem | 700 | -0.03em | 1.0 |
| Display M (card, name) | 1.5 to 1.75rem | 600 | -0.02em | 1.1 |
| Body | 1.0625rem | 400 | 0 | 1.65 |
| Label | 0.75 to 0.8125rem | 500 | +0.06em | 1.3 |

Light-on-dark compensation is built into those numbers (more leading, one step more weight). `text-wrap: balance` on headings, `pretty` on body. Body measure never exceeds 62ch. Two families only. Uppercase only on labels.

**Accent discipline: 90 / 10.** Lime owns exactly these: the CTA, the featured pillar card, the orbit thread, the coin's rim light, at most one highlighted word per display heading, focus rings, text selection, the caret. Nowhere else. If lime appears in two places on one screen that are not in that list, remove one.

**Ground and texture:** a fixed, `pointer-events: none` grain layer at 4% opacity over the whole page; a 1px technical grid at 3% opacity behind acts 3 and 6 only; no radial mesh gradients, no purple, no blue.

**Depth:** shadows with offset and blur, tinted toward the canvas (`0 24px 48px -24px rgba(4,6,4,.65)`), a 1px `--edge` highlight on the top lip of every raised surface, overlap between elements wherever the composition allows, and exactly three elevation steps. No zero-offset halos.

**Radius:** one scale, held across the page. Buttons are pills. Cards 24px outer with concentric inner radii (24 minus padding). Inputs and rows 12px.

---

## 4. Grammar, chrome, and the act score

**Grammar: filmic one-shot.** A single linear argument with one emotional arc, no visible sequence, no chapter numbers, no progress readout, no hard cuts between grounds. The other seven scroll-craft grammars lost for these reasons: chaptered editorial forbids media above the fold and the references are built on a hero object; live surface needs a real product surface and this is an agency; continuous world needs a video budget that does not exist; typographic poster forbids the object; gallery is for a range and this page is an argument; split stage needs a two-sided argument; rhythmic cutlist is for energy brands at speed and this page is slow.

**Chrome:**

- **Nav:** a fixed 64px bar. Transparent over the hero; once the visitor is 80% through the hero it gains a 1px `--hair` bottom line, a 72% canvas fill and a 12px backdrop blur (the only blur on the page). Left: the wordmark `CYPHERNAUT` in Archivo 800, 0.875rem, tracking +0.14em, ink. Centre-right: three quiet links, `Services`, `Team`, `Contact`, in `--ink-soft`, underline offset 6px on hover, each pointing at a real `id`. Right: one CTA, **Book a call**, a lime pill (`padding: .8rem 1.1rem .8rem 1.5rem`) with the arrow nested in its own 32px dark circle flush with the right padding. On phones: wordmark, CTA, and a two-line hamburger that rotates into an X; the menu is a full-screen canvas overlay whose links rise from a mask 40ms apart.
- **Hero:** a full-bleed layered parallax scene with the coin, a lead-anchored kinetic headline that is already visible at load.
- **Close:** pinned, a spotlight, a magnetic CTA, and the orbit ring.

**The score:**

| # | Act | Feeling | Device | Span (vh) | Ground | Copy anchor |
|---|---|---|---|---|---|---|
| 1 | Hero | Curiosity | parallax + kinetic | 2.2 | `#070908` | lead (left) |
| 2 | Positioning | Recognition | flow + fade-in | 1.0 | `#070908` | split (headline left, prose right) |
| 3 | Services bento | Confidence | reveal (clip-path per card) | 1.8 | `#0A0C0B` | lead heading, then grid |
| 4 | Silence | Stillness | flow, ground only | 0.6 | `#070908` | centre, one line |
| 5 | Ignition (PEAK) | Awe | pin, three states, glow driven by progress | 3.6 | `#070908` to `#0B120A` | trail (right) |
| 6 | Outcomes | Trust | flow + fade-in | 1.0 | `#0B120A` to `#0A0C0B` | lead |
| 7 | Team | Intimacy | pan (rail) + tilt | 2.0 | `#0A0C0B` | rail |
| 8 | Close | Resolve | pin + magnet + spotlight | 1.3 | `#070908` | centre |

Total about 13.5 viewport-heights. Seven device families, no family twice in a row, the peak has the largest span, act 4 is the silence before it, act 8 holds on screen. Ground colours drift between acts (interpolated, small steps, all one family).

---

## 5. Act-by-act build spec

### 5.1 Hero (act 1)

```
┌────────────────────────────────────────────────────────────┐
│ CYPHERNAUT          Services  Team  Contact   [Book a call]│
│                                                            │
│  Crypto projects,                        ╭──── orbit ────╮ │
│  launched into orbit.              ╭─────┼───   ◉ coin   ┼─┼─ exits frame
│                                    ╰─────┼───────────────╯ │
│  Tokenomics, marketing and               ╰───────────────╯ │
│  community for crypto and Web3...                          │
│  [Book a call]                                             │
└────────────────────────────────────────────────────────────┘
```

- **Layout:** 12-column grid. Copy in columns 1 to 6, vertically centred. The coin plane sits in columns 6 to 12 and breaks the grid: its right edge leaves the viewport by about 8% on desktop.
- **Planes, back to front, with scroll lag relative to the page:** far plane, a CSS radial haze (lime at 6% alpha, centred right, 60vw radius) on the canvas, lags 31%; mid plane, the orbit ellipse (the first segment of the Orbit Thread, §6), lags 17%; the coin image (asset A1), lags 20%; front plane, a soft lime haze band along the bottom edge, travels at 1x; copy travels at 1x. Adjacent planes differ by 10 to 30%, never more. A 240px gradient to the canvas sits above every plane at the section floor so the planes never show a clip line. The coin image gets a `mask-image: radial-gradient(...)` so its black background melts into the canvas.
- **Copy, four elements maximum:** `h1` **Crypto projects, launched into orbit.** in two lines, the word `orbit` in lime. One paragraph: *Tokenomics, marketing and community for crypto and Web3 projects, from first announcement to sustained growth.* One CTA: **Book a call** (Calendly link, §8.8). No eyebrow, no avatars, no statistic, no scroll cue.
- **On load:** headline lines rise from an overflow-hidden mask with room for descenders, 70ms apart, 900ms `--ease-out`; the coin scales 0.92 to 1 and rotates -4° to 0 over 1.2s; the orbit ellipse draws 0 to 100% over 1.4s. Then idle: the coin floats ±6px on a 6s sine, and tilts up to 6° toward the pointer on desktop.
- **Scroll:** the headline is visible at progress 0 (greet form) and has faded by 0.7.
- **Phones:** portrait composition; the coin sits centred behind the copy at 60% opacity; the display drops two rungs; use asset A3 if it was generated, else A1 with `object-position: 70% center`.

### 5.2 Positioning (act 2)

- **Layout:** split. Columns 1 to 5: Display L **A project nobody has heard of is a private project.** Columns 7 to 12: the two paragraphs P1 and P2 (§8.2) at body size, 62ch. One closing line under them in `--ink-soft`: *End to end. One team from the first announcement to the growth that follows.*
- **Motion:** fade-in on entry, 14px rise, 620ms, children 70ms apart, fires once.
- No card, no image, no icon.

### 5.3 Services bento (act 3)

```
┌──────────────────────────┬──────────────────────────┐
│  LAUNCH  (lime, tall)    │  AMPLIFY  (dark)         │
│  cols 1-6, rows 1-2      │  cols 7-12, row 1        │
│                          ├────────────┬─────────────┤
│                          │ COMMUNITY  │ REACH&TRUST │
│                          │ cols 7-9   │ cols 10-12  │
└──────────────────────────┴────────────┴─────────────┘
```

- **Heading, lead-anchored:** Display L **Everything a launch needs.** One line under it: *Twelve services, four pillars, one team.*
- **Card anatomy (double-bezel):** outer shell `--surface-2`, 1px `--hair`, 6px padding, 24px radius; inner core `--surface`, 18px radius, 1px `--edge` top highlight. The featured Launch card is lime outside and a slightly deeper lime (`#B4F200`) inside, with `--accent-ink` text.
- **Card content:** pillar name (Display M), the pillar promise (body), then three service rows. Each row is the service name with a 28px plus-circle affordance at the right (R5). A fixed-height **detail line** sits at the bottom of every card and shows the pillar promise by default; hovering or focusing a row crossfades the detail line to that service's description (160ms); on touch, tapping a row toggles it and the plus rotates 45° into a cross. Card heights never change. Every one of the twelve descriptions is real markup in the DOM (a visually hidden span inside its row, which the detail line reads from).
- **Reveal:** each card wipes in with `clip-path` from the bottom, 90ms apart in reading order; the Launch card uses the iris wipe, the only iris on the page.
- **Ground:** the 3% technical grid sits behind this act.
- **Phones:** single column, Launch first, gaps 24px, all rows tap-to-toggle.

### 5.4 Silence (act 4)

- Ground only. The coin (A1) at 22% scale, centred, 35% opacity, no glow. One line in body size, `--ink-soft`, centred: **Then you launch.** This is the only second-person line on the page.
- The line fades in at 0.2, holds to 0.8, is gone by 1. Span 0.6. Nothing else. Do not add a heading, an image, a card, or a cue.

### 5.5 Ignition, the peak (act 5)

- **Pinned stage, span 3.6, dwell 0.4** so the camera settles on the middle state. Coin in columns 2 to 7, copy trail-anchored in columns 8 to 12. The coin is on stage at progress 0, so the stage is never empty.
- **Three states by progress `p`, cue windows overlapping about 15%:**

| p | Label | Display | Body | Coin | Light |
|---|---|---|---|---|---|
| 0.00 to 0.36 | `Pre-launch` | Display L **Anticipation.** | L1 (§8.4) | A1, cold | rim 0%, bloom 0 |
| 0.30 to 0.70 | `Launch day` | Display XL **Ignition.** in lime | L2 | crossfades A1 to A2 over p 0.33 to 0.45 | bloom scales 0.6 to 1.4 and opacity 0 to 0.55; ground drifts `#070908` to `#0B120A`; the Orbit Thread flares (§6) |
| 0.64 to 1.00 | `Post-launch` | Display L **Momentum.** | L3 | A2 | bloom settles to 0.7; thread glow off; ground holds `#0B120A` |

- The bloom is a lime radial gradient behind the coin, blurred, driven by transform and opacity only. **Ignition.** is the second kinetic headline on the page and the last; nothing else on the site splits text.
- The final cue closes with a two-value window ending at 1 (this is not the last act, so nothing holds).
- **Reduced motion:** show the Ignition state static, with the three copy blocks stacked below it.

### 5.6 Outcomes (act 6)

- Heading, lead-anchored: Display L **What comes with it.**
- Four items O1 to O4 (§8.5) as a 2×2 type list: Display M title, one body line. Hairlines between rows only. No cards, no icons, no numbers.
- Fade-in on entry, 60ms stagger. The ground drifts back toward `#0A0C0B`.

### 5.7 Team (act 7)

- A horizontal rail driven by vertical scroll. Items in order: a heading item (Display L **The crew.**), four person cards, a closing note item (*Four people. Every engagement, end to end.*). The heading and the note are rail items so the overflow is wide enough to travel; measure `rail.scrollWidth - innerWidth` and make sure it exceeds half a viewport on desktop.
- **Card:** 3:4 portrait, real photo (§8.7) with the green treatment: `filter: grayscale(1) contrast(1.05)`, a lime multiply layer at 18%, a scrim band across the bottom 40%, and a 1px lime edge light on the right side (a CSS gradient) so the faces sit in the same key light as the coin. Below the image: name (Display M), role (label, lime), one line.
- Items settle in sequence as the rail travels (opacity floor 0.55, first item exempt); tilt 6° toward the pointer on desktop.
- **Reduced motion:** native `overflow-x: auto` with snap; at 1024px and wider under reduced motion, show a 2×2 grid instead.

### 5.8 Close (act 8)

- **Pinned, span 1.3, centred.** Display L **Ready when you are.** One line: *A 30-minute call about the project: what it is, where it is, and what a launch would take.* Then the CTA **Book a call** (magnetic, 0.26; no entrance rise on the magnet element). The Orbit Thread arrives from above and closes into a perfect circle around the button (§6). Below the button, one row in label size with the five channels (§8.8): Email, WhatsApp, Call, Instagram, LinkedIn, each a real link.
- Spotlight on the stage: a lime light at 5% following the pointer, desktop only.
- The content is visible at progress 0 and **holds** (greet and hold). The final screen never goes empty.
- **Footer**, in flow below the pinned act, compact: wordmark, the tagline (§8.9), Quick Links (`Home`, `Services`, `Team`, `Contact`, all real anchors), the copyright line. No newsletter field, no social icon row (the channels are already above).

---

## 6. The signature move: the Orbit Thread

One bespoke interaction that exists on this site alone. Zero images, one SVG, one animation loop.

- **What it is:** a single lime `<path>` that starts as the orbit ellipse around the hero coin and runs the entire page. The visitor's scroll draws it. It passes behind every act, tightens into a small orbit around the coin at the peak, and terminates by closing into a perfect circle around the **Book a call** button in the close.
- **Layer:** an `<svg>` in a `position: absolute; inset: 0` wrapper the height of the document, above the grounds and planes, below all copy, `pointer-events: none`, `aria-hidden="true"`. Stroke `--accent`, 1px, `vector-effect: non-scaling-stroke`, opacity 0.8.
- **Geometry:** compute the anchor points from the real element rectangles at layout time and on resize (the hero coin centre, the peak coin centre, the CTA centre, each act's top edge). Never hard-code pixels. The route: hero ellipse (rx about 46% of the viewport width, ry about 14% of the viewport height, rotated -12°, matching R1), exit on the right, sweep down and left behind act 2's headline, a long shallow S behind the bento cards, a near-straight vertical through act 4, one and a half turns around the peak coin, down the right edge past the team rail, and a closed circle of radius `0.9 × button width` around the CTA. Use `getTotalLength()`.
- **Drawing:** `stroke-dasharray = L`, `stroke-dashoffset = L × (1 − s)` where `s = scrollY / (documentHeight − innerHeight)`, lerped toward its target at 0.12 per frame inside one `requestAnimationFrame` loop. Never write to the DOM from a scroll event. The ring completes exactly at `s = 1`.
- **Markers:** at the top of acts 2 through 8, a 4px lime dot sits on the path at opacity 0. When `s` passes that act, the dot lands (scale 0.5 to 1, 180ms, `--ease-out`) and stays. By the footer there are seven dots: a record of the visit. They are decorative; navigation lives in the bar.
- **Peak flare:** during the Ignition state of act 5 only, stroke-width goes to 2px and the path gets `filter: drop-shadow(0 0 6px var(--accent))`, interpolated in and out over about 0.08 of the act. This is the one place on the page a glow is allowed, because it is the peak.
- **Reduced motion:** the path is fully drawn, no flare, all dots landed.
- **Phones:** same mechanism; the hero ellipse rx grows to about 60% of the viewport width; hide the dots under 700px.

---

## 7. Motion and interaction spec

- **Scroll engine:** Lenis (lerp 0.1, smoothWheel) synchronised with GSAP ScrollTrigger (`lenis.on('scroll', ScrollTrigger.update)`, Lenis driven from `gsap.ticker`, `lagSmoothing(0)`). Every act's progress is a ScrollTrigger with `scrub: true`. Pinned acts pin the stage with a spacer of `span × 100vh`.
- **Only `transform`, `opacity` and `clip-path` move continuously.** Never animate width, height, top, left, margin or padding, and never `transition: all`.
- **Entrances:** opacity 0 to 1 with a 14px rise, 620ms, `--ease-out`, children 30 to 80ms apart, triggered at -12% of the viewport, fired once. Nothing re-hides on scroll-up.
- **Kinetic type:** lines only, never characters. Two headlines on the whole page: the hero and **Ignition.**
- **Micro-interactions:** buttons hover 140ms `--ease-out`, the nested arrow circle translates 2px diagonally and scales 1.05; press `scale(.97)`; focus-visible a 2px lime ring offset 3px. Links: underline offset 4 to 6px, 120ms. Cards: lift 4px with the shadow deepening, 160ms, border brightening to `--edge`. Service rows: detail crossfade 160ms. Nav: fill fades in over 240ms. Hamburger: lines rotate ±45° into an X, 260ms `--ease-drawer`. Menu links: rise from a mask 40ms apart.
- **Pointer, desktop only** (`(hover: hover) and (pointer: fine)`): coin tilt up to 6°, team card tilt 6°, CTA magnet 0.26, close spotlight. Nothing else follows the cursor. No custom cursor.
- **Idle:** the hero coin's ±6px float is the only idle animation on the page.
- **Timing character:** scroll-linked motion is paced by the hand; load and reveal motion is slow and heavy (900 to 1400ms); UI motion is under 300ms. Never bounce. Never `ease-in`. Never `scale(0)`; enter from `scale(.95)`.
- **Reduced motion:** keep the opacity that carries comprehension, drop every position change, draw the thread statically, make the rail a native scroll region, disable tilt, magnet, spotlight and float.
- **Performance:** `will-change: transform` only on the planes and the coin while animating; `backdrop-filter` only on the fixed nav; grain on a fixed pseudo-element; every image lazy except A1; `width` and `height` attributes on every `<img>`, and if one is overridden in CSS both are; total JavaScript under 120KB gzipped.

---

## 8. Content, complete

Every string below appears on the site. Rewrite nothing except to fit a line; add nothing invented, in particular no statistics, no client names, no testimonials, no locations.

### 8.1 Hero
- H1: **Crypto projects, launched into orbit.**
- Paragraph: Tokenomics, marketing and community for crypto and Web3 projects, from first announcement to sustained growth.
- CTA: **Book a call**

### 8.2 Positioning
- Heading: **A project nobody has heard of is a private project.**
- P1: Cyphernaut plans, launches and grows crypto and Web3 projects. Whether it is the next memecoin or a DeFi platform, the work is the same: strategy tailored to the project, a launch that lands, and growth that holds.
- P2: Every engagement is end to end. One experienced team guides the project through every step, from the first announcement to the growth that follows, in a blockchain landscape that does not sit still.
- Closing line: End to end. One team from the first announcement to the growth that follows.

### 8.3 Services (four pillars, twelve services)
- Heading: **Everything a launch needs.** Subline: Twelve services, four pillars, one team.

**LAUNCH** (featured, lime). Promise: *From the first idea to launch day: the plan, the token, the drop.*
1. **Crypto Project Marketing & Launching.** Full-spectrum marketing that puts the project in front of the right audience, from pre-launch buzz to post-launch growth.
2. **Tokenomics Strategy & Design.** Sustainable tokenomics models that balance utility, scarcity and incentives to create long-term value for the project and its community. Analysis: in-depth market research. Modeling: sustainable, scalable distribution.
3. **NFT Project Promotion & Strategy.** End-to-end NFT marketing, from pre-mint hype to post-launch community management, so the collection stands out in a crowded marketplace.

**AMPLIFY.** Promise: *The message, on every platform that matters.*
4. **Web3 Marketing & Campaigns.** Marketing built for the Web3 ecosystem: decentralized platforms and blockchain-native approaches that reach the target audience.
5. **Social Media Management & Handling.** Social media across Twitter, Instagram, Discord, Reddit, LinkedIn and Telegram: engaging content that builds community and drives awareness.
6. **Content Marketing.** Articles, whitepapers, videos, tutorials and educational material that establish thought leadership and explain blockchain plainly. Also shareable memecoin avatars and illustrations.

**COMMUNITY.** Promise: *The people around the project, kept close.*
7. **Community Engagement Campaigns.** Targeted engagement campaigns, AMAs, contests, airdrops, giveaways and interactive events that build loyalty and growth.
8. **DAO / Community Server Management.** Discord, Telegram and other community platforms, with active moderation, engagement and governance for the DAO or community.
9. **Web3 Community Incubation & Growth.** Community building from inception to scale: governance structures, incentive programs and sustainable growth strategies.

**REACH & TRUST.** Promise: *The voices, partners and press that make it credible.*
10. **Influencer Outreach & Campaigns.** Top crypto influencers, YouTubers and thought leaders, through authentic partnerships and strategic collaborations.
11. **Blockchain Partnerships & Collaborations.** Strategic partnerships with other blockchain projects, DeFi protocols and crypto influencers that expand reach and create mutual value.
12. **Reputation Management & PR.** Strategic PR campaigns, crisis management and positive coverage in crypto and mainstream outlets.

### 8.4 Launch lifecycle (the peak)
- Silence line (act 4): **Then you launch.**
- L1, Pre-launch, **Anticipation.**: In-depth market research and audience analysis so the messaging resonates with potential investors. Targeted campaigns and community engagement build the anticipation.
- L2, Launch day, **Ignition.**: Live events, AMAs and social media blitzes, timed to land together, so launch day creates excitement and engagement.
- L3, Post-launch, **Momentum.**: Analytics-driven marketing, community engagement, influencer partnerships and ongoing content, so momentum holds after the launch.

### 8.5 Outcomes
- Heading: **What comes with it.**
- O1 **Increased visibility.** Stand out in a crowded crypto landscape and reach the target audience.
- O2 **Investor confidence.** Trust built through transparent communication and strategic marketing.
- O3 **Future-ready strategies.** Solutions for tomorrow's challenges, not only today's.
- O4 **24/7 support.** Round-the-clock assistance when it is needed.

### 8.6 Team
- Heading: **The crew.** Closing note: Four people. Every engagement, end to end.

### 8.7 Team members and photos
| Name | Role | Line | Photo (download, crop 3:4 with the face in the upper third, WebP 800×1066) |
|---|---|---|---|
| Vasu Madaan | CEO & Founder | Sets strategy and direction for every project and client. | https://www.cyphernaut.in/assets/Vasu-Be3EZFG5.jpg |
| Parul | Design Specialist | Designs the visuals that carry the campaigns. | https://www.cyphernaut.in/assets/parul-DE5yNfpp.jpg |
| Vivyaan | Tech Lead | Builds and integrates the technology behind each launch. | https://www.cyphernaut.in/assets/Vivyaan-BA_cbvYO.jpg |
| Osmium | Manager | Runs daily operations and keeps the team on target. | https://www.cyphernaut.in/assets/osmium-G1xzxYS5.jpg |

These are real people. Do not generate faces. If a photo cannot be fetched, use a `--surface-2` block with the person's initials in Display M and say so in the handoff note.

### 8.8 Contact and close
- Heading: **Ready when you are.** Line: A 30-minute call about the project: what it is, where it is, and what a launch would take.
- CTA **Book a call** → `https://calendly.com/official-cyphernaut/30min` (opens in a new tab)
- Email → `mailto:official@cyphernaut.in` (show `official@cyphernaut.in`)
- WhatsApp → `https://wa.me/918655100003`
- Call → `tel:+918655100003` (show `+91 86551 00003`)
- Instagram → `https://www.instagram.com/cyphernaut.in/`
- LinkedIn → `https://www.linkedin.com/company/cyphernaut/`

### 8.9 Footer and meta
- Tagline: Marketing, tokenomics and community for crypto and Web3 projects.
- Quick Links: Home `#home`, Services `#services`, Team `#team`, Contact `#contact`. Every id exists on the section it names.
- Copyright: © 2026 Cyphernaut. All rights reserved.
- `<title>`: Cyphernaut | Crypto and Web3 launch marketing
- Meta description: Cyphernaut plans, launches and grows crypto and Web3 projects: tokenomics, marketing and community, from first announcement to sustained growth.
- Canonical `https://www.cyphernaut.in/`, `lang="en"`, Open Graph and Twitter card tags with `assets/og.jpg` (a 1200×630 crop of A1), one `h1`, one `h2` per act, a favicon drawn as an inline SVG: a lime ring on a dark circle.
- Copy rules everywhere: no em dashes anywhere visible (use a period, comma, colon or parentheses); none of these words: elevate, seamless, unleash, next-gen, revolutionize, supercharge, cutting-edge, empower; one CTA label on the whole site, **Book a call**.

---

## 9. Image generation: Higgsfield plan

**How the images arrive.** Do not assume you can call an image generator, and do not link to an external image host: a published page blocks images from any outside host silently, so a remote URL renders as nothing. Handle whichever case applies:

- **Case A, images attached.** Two or more coin images are attached alongside the five references (they will be obviously coins on black, not website screenshots). Use them. Embed each one **inline as a base64 `data:` URI** in the HTML, or as an uploaded page asset. Never as a remote link.
- **Case B, no coin images attached.** Build the coin in CSS by the recipe at the end of this section and ship the page complete. Do not leave an empty image slot, do not use a placeholder service, and do not substitute a stock photo.

Either way the page must be finished and self-contained. State in one line at the end of your output which case you used.

**If you do have a working image generator available**, use it with these settings and nothing else: model GPT Image, latest version offered; resolution 1080p or the highest available; quality Max; still images only, no video; a hard ceiling of 70 credits, stopping before any generation that would pass 62. One reroll per asset, only for a defect listed below. Look at every result before using it.

The prompts below are the ones to use, whether you generate the images or the client generates them in Higgsfield and attaches them.

**Style preamble, pasted verbatim at the top of every prompt:**

> Cinematic product photograph of one machined black metal coin, shot on a 35mm anamorphic lens. Low-key studio lighting: a single hard acid-lime (#BFFF00) rim light from the upper right, a faint cool fill from the left, deep falloff into true black. Background is solid near-black #070908, seamless, no gradient banding. The coin is brushed black steel with fine concentric machining rings and a polished bevel edge that catches the lime light; the face is plain. Shallow depth of field, matte film grain, subtle halation on the lit edge. Photographic realism, high dynamic range. No text, no lettering, no numbers, no logo, no symbols, no second object, no hands, no room reflections, no lens flare streaks, no glow blobs, no plastic sheen, not CGI, not clay, not illustration.

**Shots, in priority order:**

| Asset | Ratio | Scene (appended after the preamble) | Used in |
|---|---|---|---|
| **A1** hero coin, cold | 16:9 | The coin sits low and to the right of frame, tilted about 25 degrees toward the camera, lit edge on the upper right. Large empty black space across the upper-left two thirds of the frame. Only the rim is lit; the face is almost fully in shadow. | Acts 1, 4, 5 (cold state), OG image |
| **A2** peak coin, ignited | 16:9 | The same coin centred in frame, facing the camera at a slight tilt. The lime rim light is at full intensity and wraps the whole bevel; a thin lime haze hangs just off the lit edge, still on a #070908 background. Even empty space on both sides. | Act 5 (Ignition, Momentum) |
| **A3** portrait hero, optional | 2:3 or 3:4, whichever is offered | The same coin centred in the lower half of a portrait frame, tilted 25 degrees, rim lit on the upper right, large empty black space above. | Act 1 on phones |
| **A4** macro edge, optional | 16:9 | Extreme macro of the coin's bevel and machining rings, lime light raking across the ridges, everything else falling to black. Subject low in frame, empty black space above. | Launch card background at 20% opacity |

**Reroll only if:** any text, lettering or symbol appears; a second object or a hand appears; the background is not solid black; the coin reads as plastic or CGI; the lit edge is on the wrong side.

**Post-processing:** the image's black must match `--canvas`; melt the edges with a radial `mask-image` so the frame never shows a visible rectangle against the ground; keep A1 under about 300KB and A2 under about 350KB once encoded; set both `width` and `height` attributes on every `<img>`, and if one is overridden in CSS override both; if A3 exists serve it through `<picture>` under 860px.

**Not images at all, build these in code:** the wordmark (type), the favicon (inline SVG), the plus-circle and arrow glyphs (CSS), the Orbit Thread (SVG), the ignition bloom (CSS radial gradient), the technical grid and the grain (CSS), and the team portraits (real photographs, §8.7).

**The CSS coin (Case B, and the fallback if only one image exists).** A round element about 34vw across at its largest: a radial gradient from `#1A1C1B` at 30% to `#050605` at 100% for the body; a `repeating-conic-gradient` at roughly 1% steps in two near-identical dark greys, at about 12% opacity, for the machining rings; a 2px inset ring in `--accent` on the upper-right arc only (a `conic-gradient` border mask from about -60deg to 40deg) for the rim light; a soft `--accent` drop shadow at 20% for contact glow. The ignited state is the same element with the rim arc widened, its opacity raised, and the bloom behind it scaled up. This is driven entirely by `transform`, `opacity` and custom properties, so it animates on the same timeline as the photographic version and act 5 works identically. A page built this way is a complete deliverable, not a degraded one.

---

## 10. Hard rules

Each of these makes a page read as machine-made. Ship-blockers, not preferences.

| Never | Instead |
|---|---|
| Phones, headphones, laptops, clay, low-poly or isometric imagery | The coin, photographic, §9 |
| A scroll cue, arrow, or animated mouse icon | Nothing. They are looking at the hero |
| `01 / 06` section counters or chapter numbers | Delete. Sequence is not information here |
| An eyebrow above every heading | At most one per three sections; this page uses the three peak labels and none elsewhere |
| Em dash anywhere visible | Period, comma, colon, parentheses |
| Centred copy in every act | The anchors in §4: lead, split, lead, centre, trail, lead, rail, centre |
| The same device family in two adjacent acts | The score in §4 |
| A page with no engineered peak, or with three | One peak, act 5, largest span, silence before it |
| An ending that fades to nothing or just becomes a footer | Act 8 holds with content on screen; the footer follows |
| Text baked into a generated image | Real markup, always |
| Invented statistics, counters, client logos, testimonials | None. The brand has no verified figures |
| Gradient text, neon glow, zero-offset halos, purple or blue gradients | Weight and size for emphasis; the one flare is the Orbit Thread at the peak |
| Glass and blur as decoration | Blur only on the fixed nav |
| A grid of identical icon + heading + text cards; three equal feature columns; nested cards | The bento in §5.3, the type list in §5.6 |
| Inter, Roboto, Arial, Helvetica, a serif "for premium" | Archivo and Geist |
| Custom cursors | None |
| Filler verbs (elevate, seamless, unleash, next-gen, revolutionize, supercharge, cutting-edge, empower) | The copy in §8 as written |
| `transition: all`, `ease-in`, animating width / height / top / left, `scale(0)` | §7 |
| A full-frame dark overlay for contrast | A scrim only where text sits; masks over media |
| Autoplaying audio or video | None on the page |
| Two hues | One hue: lime. The old purple is retired |

---

## 11. Output contract

**Deliverable:** one complete `index.html` with a single `<style>` block and a single `<script>` block, fonts via a Google Fonts link (Archivo 600 to 800, Geist 400 and 500), and pinned CDN scripts for GSAP 3.12 or newer, ScrollTrigger, and Lenis 1.1 or newer. No framework, no build step. If the tool's output format is React, keep the same eight-act structure in one page with `useGSAP` and `ReactLenis`, and change nothing else.

**Every asset must be self-contained.** Images are inline `data:` URIs or uploaded page assets, never links to an outside host, because a published page blocks those silently and the slot renders empty. The same applies to the four team photographs: fetch each one, re-encode it, and embed it. If a photograph cannot be fetched, use a `--surface-2` block with that person's initials set in Display M, and say which ones in the closing note. Scripts come only from an allowlisted CDN; stylesheets other than Google Fonts are inlined.

**Completeness is the deliverable.** Count before returning: 8 acts, 12 services with 12 descriptions in the DOM, 4 team members, 6 contact links, 4 footer anchors that resolve, the Orbit Thread, the nav, the meta tags. No `// ...`, no `// rest of code`, no `TODO`, no "similarly for the remaining", no skeleton. Every act is fully built. If the output must pause, stop at the end of an act and end with `[PAUSED: X of 8 acts complete. Send "continue" to resume from: <act name>]`, then resume exactly there with no recap.

**Precedence when anything collides:** §8 content and the §4 score, then §10 and the scroll-craft taste floor, then the five references for look, then the technique libraries in §12, then anything else.

**Verify before returning, by scrolling the built page, not by reading the code:**

- The hero headline is on screen at load, before any scroll.
- Scrolling top to bottom at reading pace, no viewport is empty except act 4, which is meant to be.
- The Orbit Thread draws with the scroll, flares only during Ignition, and closes into a ring around the CTA exactly at the bottom.
- The peak is visibly the biggest change on the page and has the most scroll room.
- The last screen holds with the heading, the CTA and the channels on it.
- Every nav and footer anchor lands on its section.
- Contrast on the rendered page: body 4.5:1 or better, large text 3:1, focus rings 3:1.
- At 390px wide: no horizontal scroll, the hero fits, the bento stacks, the rail scrolls natively, tap targets are 44px or larger.
- With `prefers-reduced-motion`, every piece of content is still reachable.
- The console is clean and no image slot is empty.

---

## 12. Skills to load, in this order

1. **scroll-craft** (the spine). It owns the grammar, the feeling curve, the peak, the device kit, the taste floor (spacing, type, colour, depth, motion, the refuse list) and the verification procedure. Everything in §2 to §7 and §10 is written in its vocabulary. When any other source disagrees with it, scroll-craft wins.
2. **awwwards-animations** (the motion build). Use it for the implementation patterns this page needs: Lenis synchronised with GSAP ScrollTrigger, scrubbed pins, line-split text reveals, the magnetic CTA, the tilt, and the smooth-scroll setup. It supplies the how; §7 supplies the what.
3. **high-end-visual-design** (a component technique library, not a taste authority). Take from it only: the double-bezel card shell, the pill CTA with the nested arrow circle, the fluid nav and hamburger morph, the staggered menu reveal, and the GPU and blur guardrails. Ignore its instructions that conflict with §10: no eyebrow on every heading, no custom cursor, no glass as decoration, no `rounded-[2rem]` everywhere (the radius scale is §3), no radial mesh gradient orbs, no violet or emerald glow, and no font other than Archivo and Geist.

Do not load a second taste skill alongside scroll-craft; two rulebooks on one page produce a page that is neither.
