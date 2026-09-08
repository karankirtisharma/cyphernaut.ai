"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/* The wordmark opens centred, then flies into its slot in the nav — a FLIP
   (First / Last / Invert / Play): measure where it ends up, work out the delta,
   and animate the transform. Nothing about the nav's own layout changes, so the
   mark lands pixel-exact at any width instead of being hand-positioned.

   The hero holds its pre-state behind the overlay and only starts once the
   flight is underway, so the two read as one continuous entrance rather than a
   curtain lifting on an animation that already finished. */

const MIN_HOLD = 520; /* ms — below this the overlay reads as a flash */
/* How much larger the centred mark is than its nav slot. The reference this
   was matched against holds the logo at roughly 1.3x and lets the *travel* be
   the effect; scaling 3-4x turns it into a splash screen that happens to
   shrink. Derived from the nav mark's own font-size so the ratio is identical
   at every viewport. */
const PRESENT_SCALE = 1.7;
const MAX_WAIT = 2000; /* ms — never hold the page hostage to a slow texture */

export default function Preloader() {
  /* StrictMode invokes this effect twice in development. The first pass owns
     the animation; a destructive cleanup would tear the overlay out of the DOM
     before it ever ran, and React would not re-create the node on the second
     pass because its own tree still says it is mounted. So the guard is a ref
     and the teardown is non-destructive. */
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    const root = document.documentElement;
    const overlay = document.getElementById("pre");
    const mark = document.getElementById("pre-mark");
    const navMark = document.querySelector<HTMLElement>("#nav .mark");

    /* The overlay is React-rendered so it can be in the server HTML and cover
       the hero from first paint. That means it must never be detached here —
       React removes it on its own schedule and throws NotFoundError if the node
       is already gone. Hiding it is the only safe teardown. */
    const hide = () => overlay?.setAttribute("data-done", "1");
    const finish = () => {
      root.setAttribute("data-intro", "go");
      root.setAttribute("data-intro-landed", "1");
      hide();
    };
    if (!overlay || !mark) {
      finish();
      return;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const started = performance.now();
    /* nothing may leave the reader stuck behind an opaque overlay */
    const bail = window.setTimeout(finish, MAX_WAIT + 2600);

    /* the hero's canvas sets data-loaded once its texture is decoded; other
       routes have no such stage, so they resolve immediately */
    const heroReady = () =>
      new Promise<void>((resolve) => {
        const stage = document.querySelector(".hero-3d");
        if (!stage) return resolve();
        if (stage.hasAttribute("data-loaded")) return resolve();
        const mo = new MutationObserver(() => {
          if (stage.hasAttribute("data-loaded")) {
            mo.disconnect();
            resolve();
          }
        });
        mo.observe(stage, { attributes: true, attributeFilter: ["data-loaded"] });
      });

    const wait = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms));

    /* match the nav mark's own metrics, scaled — guarantees the flight is a
       pure translate plus a known scale, with no font mismatch to drift */
    if (navMark) {
      const navFont = parseFloat(getComputedStyle(navMark).fontSize);
      if (navFont) mark.style.fontSize = `${(navFont * PRESENT_SCALE).toFixed(2)}px`;
    }

    const run = async () => {
      await Promise.race([
        Promise.all([document.fonts.ready, heroReady()]),
        wait(MAX_WAIT),
      ]);
      /* fonts settle after the mark is on screen, so measure only now —
         a FLIP against fallback metrics lands in the wrong place */
      await wait(Math.max(0, MIN_HOLD - (performance.now() - started)));
      if (overlay.hasAttribute("data-done")) return;

      if (reduced || !navMark) {
        gsap.to(overlay, {
          opacity: 0,
          duration: 0.4,
          ease: "power2.out",
          onStart: finish,
          onComplete: hide,
        });
        return;
      }

      const to = navMark.getBoundingClientRect();
      const from = mark.getBoundingClientRect();
      const scale = to.width / from.width;

      const tl = gsap.timeline({
        onComplete: () => {
          window.clearTimeout(bail);
          hide();
        },
      });
      tl.to(mark, {
        /* transform-origin at the top-left makes the translate land the two
           boxes' corners together, and the scale then matches their sizes */
        transformOrigin: "0 0",
        x: to.left - from.left,
        y: to.top - from.top,
        scale,
        duration: 0.82,
        ease: "expo.inOut",
      })
        .to(overlay, { opacity: 0, duration: 0.5, ease: "power2.inOut" }, 0.2)
        /* the page is already showing through by here, so the hero's own
           entrance overlaps the tail of the flight instead of queueing after it */
        .add(() => root.setAttribute("data-intro", "go"), 0.34)
        /* hand off to the real mark just before the clone stops moving */
        .add(() => root.setAttribute("data-intro-landed", "1"), 0.72);
    };

    run();
    return () => window.clearTimeout(bail);
  }, []);

  return (
    <div id="pre" aria-hidden="true">
      <span id="pre-mark">CYPHERNAUT</span>
    </div>
  );
}
