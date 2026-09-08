"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* A vertical word column with a bracket selector that resizes to whichever
   word is showing. Adapted from Osmo's looping-words snippet.

   Two things changed from the original, both because this one is driven by
   scroll rather than a timer:

   - The original keeps an infinite loop seamless by appending the first <li>
     to the end of the <ul> mid-flight and decrementing its index to
     compensate. A scrubbed range has a start and an end, so none of that
     bookkeeping is needed — the list is rendered once and simply translated.
     That removes the DOM mutation and the index drift with it.
   - Its `currentIndex` was a bare `let` in the component body, closed over by
     memoised callbacks. It survived only because those callbacks never
     re-created; any dependency change would have silently reset the loop, and
     a StrictMode remount inherited a re-ordered list. It is a ref here. */

export interface LoopingWordsProps {
  words: string[];
  /** Element whose scroll progress drives the word index. Falls back to the
   *  component's own section. */
  trigger?: string;
  /** Autoplay instead of scrubbing — kept so the component is reusable. */
  autoplay?: boolean;
  className?: string;
}

export function LoopingWords({
  words,
  trigger,
  autoplay = false,
  className,
}: LoopingWordsProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const selectorRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(0);

  useEffect(() => {
    const root = rootRef.current;
    const list = listRef.current;
    const selector = selectorRef.current;
    if (!root || !list || !selector || words.length === 0) return;

    const step = 100 / words.length;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    /* the bracket sits outside the glyphs rather than touching them */
    const pad = parseFloat(getComputedStyle(root).paddingLeft) || 0;

    /* the bracket tracks the word's measured width, which is the whole point
       of the effect — a fixed-width frame would read as a plain caption */
    const fitSelector = (i: number, instant = false) => {
      const word = list.children[i] as HTMLElement | undefined;
      if (!word) return;
      /* px, not a percentage. The original measured the word against the list
         but applied the result to an element positioned against a different
         box, so the bracket never matched the word it framed. */
      const w = word.getBoundingClientRect().width;
      gsap.to(selector, {
        width: Math.round(w + pad * 2),
        duration: instant ? 0 : 0.5,
        ease: "expo.out",
      });
    };

    const show = (i: number, instant = false) => {
      const next = Math.max(0, Math.min(words.length - 1, i));
      if (next === indexRef.current && !instant) return;
      indexRef.current = next;
      fitSelector(next, instant);
      gsap.to(list, {
        yPercent: -step * next,
        duration: instant ? 0 : 1.2,
        ease: "elastic.out(1, 0.85)",
        overwrite: "auto",
      });
    };

    /* measure once fonts are settled, or the first bracket is sized to
       fallback metrics and visibly snaps when the real face lands */
    let st: ScrollTrigger | undefined;
    let tl: gsap.core.Timeline | undefined;

    const start = () => {
      show(0, true);
      if (reduced) return;

      if (autoplay) {
        tl = gsap.timeline({ repeat: -1, delay: 1 });
        tl.call(() => show((indexRef.current + 1) % words.length)).to({}, { duration: 2 });
        return;
      }

      gsap.registerPlugin(ScrollTrigger);
      const el = (trigger && document.querySelector(trigger)) || root;
      st = ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "bottom bottom",
        /* no pin: the stage is position:sticky in CSS, so ScrollTrigger only
           reads progress and never injects a pin-spacer that would shift every
           section measurement the home page's scroll film depends on */
        onUpdate: (self) => {
          const raw = self.progress * words.length;
          show(Math.floor(Math.min(raw, words.length - 0.001)));
        },
      });
    };

    let cancelled = false;
    document.fonts.ready.then(() => {
      if (!cancelled) start();
    });

    return () => {
      cancelled = true;
      st?.kill();
      tl?.kill();
      gsap.killTweensOf([list, selector]);
    };
  }, [words, trigger, autoplay]);

  return (
    <div ref={rootRef} className={["lw", className].filter(Boolean).join(" ")}>
      <div className="lw-mask">
        <ul className="lw-list" ref={listRef}>
          {words.map((word) => (
            <li className="lw-item" key={word}>
              {word}
            </li>
          ))}
        </ul>
      </div>
      <div className="lw-selector" ref={selectorRef} aria-hidden="true">
        <i className="lw-edge" />
        <i className="lw-edge is-2" />
        <i className="lw-edge is-3" />
        <i className="lw-edge is-4" />
      </div>
    </div>
  );
}

export default LoopingWords;
