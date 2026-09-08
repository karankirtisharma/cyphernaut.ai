"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { $$ } from "@/lib/motion";
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
            scrub: 0.6,
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
            scrub: 0.8,
          },
        },
      );
    });

  });

  /* late-loading images change every trigger's geometry */
  const refresh = () => ScrollTrigger.refresh();
  window.addEventListener("load", refresh);
  const t = window.setTimeout(refresh, 1200);

  signal.addEventListener("abort", () => {
    window.clearTimeout(t);
    window.removeEventListener("load", refresh);
    ctx.revert();
  });
}
