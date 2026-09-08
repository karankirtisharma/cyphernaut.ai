"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { $, $$ } from "@/lib/motion";
import { getLenis, prefersReducedMotion } from "@/lib/smooth";

/* Scroll-linked layer, on top of the existing IntersectionObserver reveals.
   Those fire once and are done; these are scrubbed — tied to scroll position,
   so they run backwards when the reader scrolls back up. Everything here is
   additive: nothing changes layout, and nothing touches an element another
   effect already writes a transform to. */

let registered = false;
let lenisBound = false;

/** Word-splitter that cannot move anything.
 *  The spans are left `inline` and only opacity and filter animate, so line
 *  breaking is byte-identical to the unsplit paragraph. `inline-block` would
 *  have been easier to animate with y-offsets and is exactly why it is not
 *  used — it changes how the line breaks. */
function splitWords(el: HTMLElement) {
  const words: HTMLElement[] = [];
  const walk = (node: Node) => {
    Array.from(node.childNodes).forEach((n) => {
      if (n.nodeType === 3) {
        const text = n.nodeValue;
        if (!text || !text.trim()) return;
        const frag = document.createDocumentFragment();
        text.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) {
            frag.appendChild(document.createTextNode(part));
            return;
          }
          const s = document.createElement("span");
          s.className = "sfx-w";
          s.textContent = part;
          words.push(s);
          frag.appendChild(s);
        });
        node.replaceChild(frag, n);
      } else if (n.nodeType === 1) {
        walk(n);
      }
    });
  };
  walk(el);
  return { words };
}

/** Composed reveal for the services pillars.
 *
 *  The site-wide [data-rise] primitive is a 14px nudge plus a fade, and it is
 *  the wrong tool here twice over. A full-height card needs more travel than a
 *  caption does, and the three .svc rows inside a pillar sit 163px and 191px
 *  apart — far enough that each one crosses the observer line hundreds of
 *  milliseconds after the last, which is why the 60/120ms stagger declared in
 *  the JSX has never actually been visible. This replaces both with one
 *  timeline per pillar and a batch for the rows, so a group that arrives
 *  together animates together. */
function pillarReveals() {
  const pillars = $$<HTMLElement>(".pillar");
  if (!pillars.length) return;

  /* Only now is the pseudo-element hairline safe to swap in for the border:
     initScrollFx is skipped entirely under prefers-reduced-motion, and a
     stylesheet-level swap would leave those readers with no lines at all. */
  pillars.forEach((p) => p.classList.add("pillar-fx"));

  /* the IO in entrances() has already observed these; dropping the attribute
     makes its later data-in write inert rather than a second, fighting fade */
  const take = (els: HTMLElement[]) => {
    els.forEach((el) => el.removeAttribute("data-rise"));
    return els;
  };

  pillars.forEach((pillar) => {
    /* ---- head: the card wipes up, its contents rise inside it ---- */
    const tl = gsap.timeline({
      scrollTrigger: { trigger: pillar, start: "top 78%", once: true },
    });

    const shell = $<HTMLElement>(".pillar-head .shell", pillar);
    if (shell) {
      /* clipPath and opacity only. .shell declares a transition on transform,
         box-shadow and border-color for its hover lift — writing a transform
         here would put a 160ms lag on every frame GSAP sets. The radius is
         carried through the tween so the corners never square off. */
      take([shell]);
      tl.fromTo(
        shell,
        { clipPath: "inset(0% 0% 100% 0% round 24px)", opacity: 0 },
        {
          clipPath: "inset(0% 0% 0% 0% round 24px)",
          opacity: 1,
          duration: 0.9,
          ease: "expo.out",
          /* a clip-path left on the element would keep cutting its hover
             box-shadow, which reaches 24px past the border box */
          onComplete: () => gsap.set(shell, { clearProps: "clipPath" }),
        },
      ).fromTo(
        $$<HTMLElement>(".core > *", shell),
        { y: 26, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "expo.out", stagger: 0.07 },
        0.12,
      );
    }

    /* h2.dl is deliberately not taken: wordReveals() already gives it a
       per-word mask reveal, and globals.css neutralises its data-rise. Only
       the standfirst under it needs driving. */
    const lede = take($$<HTMLElement>(".pillar-head > p[data-rise]", pillar));
    if (lede.length) {
      tl.fromTo(
        lede,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "expo.out" },
        0.14,
      );
    }

    /* ---- rows: line first, then the words it underlines ---- */
    const rows = take($$<HTMLElement>(".svc", pillar));
    if (!rows.length) return;

    rows.forEach((row) => {
      gsap.set($$<HTMLElement>("h4, p", row), { y: 18, opacity: 0 });
      gsap.set($<HTMLElement>(".plus", row), { opacity: 0 });
      gsap.set(row, { "--svc-line": 0 });
    });

    ScrollTrigger.batch(rows, {
      start: "top 88%",
      once: true,
      onEnter: (batch) => {
        batch.forEach((row, i) => {
          const at = i * 0.09;
          gsap.to(row, {
            "--svc-line": 1,
            duration: 0.55,
            ease: "power2.out",
            delay: at,
          });
          gsap.to(row.querySelectorAll("h4, p"), {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power3.out",
            stagger: 0.05,
            delay: at + 0.08,
          });
          /* opacity only: .plus declares its own transform transition for the
             hover state */
          gsap.to(row.querySelectorAll(".plus"), {
            opacity: 1,
            duration: 0.4,
            delay: at + 0.18,
          });
        });
      },
    });
  });
}

/** The launch trajectory: one spine drawn by scroll, three plates docked to it.
 *
 *  Two kinds of motion here, deliberately kept apart. The spine is a progress
 *  indicator, so it is a pure function of scroll — scrub: true, the same as
 *  every other scrubbed effect on the site, and it retraces exactly on the way
 *  back up. The plates are entrances, so they fire once on arrival with a real
 *  ease-out; an entrance tied to scroll position would replay every time the
 *  reader nudged the wheel. */
function trajectory() {
  const root = $<HTMLElement>("[data-traj]");
  const line = $<HTMLElement>(".traj-fill");
  if (!root || !line) return;

  const legs = $$<HTMLElement>("[data-leg]", root);

  /* the head glow fades in over the first slice rather than popping on at 0 */
  ScrollTrigger.create({
    trigger: root,
    start: "top 72%",
    end: "bottom 62%",
    scrub: true,
    onUpdate: (self) => {
      line.style.setProperty("--traj", self.progress.toFixed(4));
      line.style.setProperty(
        "--traj-head",
        Math.min(1, self.progress * 12).toFixed(3),
      );
    },
  });

  legs.forEach((leg) => {
    /* the node lights when the drawn line actually reaches it, which is a
       different point per leg — hence a trigger each rather than one threshold */
    ScrollTrigger.create({
      trigger: leg,
      start: "top 62%",
      onEnter: () => leg.setAttribute("data-lit", ""),
      onLeaveBack: () => leg.removeAttribute("data-lit"),
    });

    const art = $<HTMLElement>("[data-leg-art]", leg);
    const words = $$<HTMLElement>("[data-leg-w]", leg);
    const tl = gsap.timeline({
      scrollTrigger: { trigger: leg, start: "top 74%", once: true },
    });

    /* The hidden state is set here rather than in the stylesheet. A CSS
       pre-hide strands its element for good if the trigger never fires — which
       is exactly what happened when late-loading art changed the section's
       height and left the measurements stale, and is why the illustrations
       were disappearing. Set from JS, the worst case is no animation at all,
       never a missing image. */
    if (art) {
      /* opacity and a small scale, no clip. The art is a cut-out render with
         no frame around it now, so a wipe would cut through the artwork
         itself. 0.96, not 0 — nothing appears out of nothing. */
      tl.fromTo(
        art,
        { opacity: 0, y: 26, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "expo.out" },
      );
    }
    if (words.length) {
      tl.fromTo(
        words,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "expo.out", stagger: 0.06 },
        0.14,
      );
    }
  });
}

export function initScrollFx(signal: AbortSignal) {
  if (prefersReducedMotion()) return;
  if (!registered) {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }

  /* Lenis smooths the scroll, so the native scroll event arrives late and
     ScrollTrigger reads a stale position. Driving update off Lenis's own tick
     keeps the scrub locked to what is actually on screen. */
  /* Subscribed once for the life of the page, not once per mount. The teardown
     used `lenis?.off?.()`, and Locomotive v5 bundles its own minified Lenis —
     if that build has no off(), the optional call silently does nothing and
     every route change leaves another ScrollTrigger.update subscriber behind.
     A module-level guard removes the need to unsubscribe at all. */
  const lenis = getLenis();
  if (lenis && !lenisBound) {
    lenisBound = true;
    lenis.on("scroll", () => ScrollTrigger.update());
  }

  const ctx = gsap.context(() => {
    /* ---- copy that reads in as you scroll through it ---- */
    /* .meas is the measured intro paragraph of a section — the one long block
       in an otherwise sparse layout, and the place the eye needs leading. */
    $$<HTMLElement>(".meas").forEach((el) => {
      /* A remount (StrictMode, or an effect re-run) finds this paragraph
         already split. Reuse those spans rather than returning — bailing out
         here would leave the words in the DOM with no tween attached, and the
         scrub would silently do nothing. */
      const words = el.dataset.sfx
        ? $$<HTMLElement>(".sfx-w", el)
        : splitWords(el).words;
      el.dataset.sfx = "1";
      if (!words.length) return;
      /* Copy that is already on screen at first paint must not start dimmed.
         The trigger would sit part-way through its range with no scroll having
         happened, and half-lit text reads as a rendering bug rather than as an
         effect — the same reason entrances() sweeps what is already in view. */
      if (el.getBoundingClientRect().top < window.innerHeight * 0.88) return;
      gsap.fromTo(
        words,
        { opacity: 0.16, filter: "blur(3px)" },
        {
          opacity: 1,
          filter: "blur(0px)",
          ease: "none",
          stagger: 0.4,
          scrollTrigger: {
            trigger: el,
            /* finishes while the block is still comfortably on screen —
               scrubbing copy that is about to leave the viewport reads as a
               bug, not as an effect */
            start: "top 88%",
            end: "bottom 62%",
            /* true, not a number. Lenis already smooths the scroll position;
               a numeric scrub adds a second, independent catch-up on top of
               it, so this copy trailed the hero, peak and rail — which read
               raw scrollY — by 0.6s. One smoother for the whole page. */
            scrub: true,
            /* will-change is a hint for motion that is about to happen, not a
               label to leave on 50+ inline spans for the life of the page */
            onToggle: ({ isActive }) =>
              words.forEach((w) => {
                w.style.willChange = isActive ? "opacity, filter" : "";
              }),
          },
        },
      );
    });

    /* ---- media parallax ---- */
    /* Only elements nothing else transforms. .tphoto is deliberately excluded:
       photoTilt() writes its transform on pointermove and the two would fight. */
    $$<HTMLElement>("[data-par]").forEach((el) => {
      const depth = Number(el.dataset.par) || 8;
      /* the shots sit in overflow:hidden slots, so a bare translate would
         expose the slot's own background at the leading edge — the constant
         scale is what keeps the frame covered through the whole travel */
      const scale = 1 + (depth * 2) / 100;
      gsap.fromTo(
        el,
        { yPercent: -depth, scale },
        {
          yPercent: depth,
          scale,
          ease: "none",
          scrollTrigger: {
            trigger: el.parentElement ?? el,
            start: "top bottom",
            end: "bottom top",
            /* see .meas above: Lenis is the only smoother */
            scrub: true,
          },
        },
      );
    });

    pillarReveals();
    trajectory();
  });

  /* late-loading images change every trigger's geometry */
  const refresh = () => ScrollTrigger.refresh();
  window.addEventListener("load", refresh);
  const t = window.setTimeout(refresh, 1200);

  signal.addEventListener("abort", () => {
    window.clearTimeout(t);
    window.removeEventListener("load", refresh);
    ctx.revert();
    /* ctx.revert() strips the inline --svc-line, so the class has to go with
       it or the pseudo-element hairlines would revert to scaleX(0) */
    $$(".pillar-fx").forEach((p) => p.classList.remove("pillar-fx"));
  });
}
