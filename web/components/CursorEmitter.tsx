"use client";

import { useEffect } from "react";

/* A lime dot that replaces the native pointer: it carries velocity squash,
   swells over anything clickable and pinches on press.

   This began as the Codrops SVG emitter — a dot trailing rings of gradient
   strokes — and the trail is gone. Over a page this dense it read as a target
   reticle rather than a cursor. With the rings gone the SVG went too: one div
   moved by a composited transform is cheaper and crisper than per-frame
   setAttribute on SVG geometry. */

const HOT = 2.1; /* multiplier over anything clickable */
const PRESS = 0.68;
const SPEED = 0.5;
const MAX_SQUEEZE = 0.6;
const ACCELERATOR = 1000;

const HOT_SELECTOR =
  'a[href],button,[role="button"],summary,label,input,select,textarea,.qstage';

export default function CursorEmitter() {
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduced.matches) return;

    const host = document.createElement("div");
    host.className = "cursor-emitter";
    host.setAttribute("aria-hidden", "true");
    const dot = document.createElement("i");
    dot.className = "cursor-dot";
    host.appendChild(dot);
    document.body.appendChild(host);
    document.documentElement.classList.add("has-emitter");

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let px = x;
    let py = y;
    let hot = false;
    let pressed = false;
    let scale = 1;

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      const over = !!(e.target as Element | null)?.closest?.(HOT_SELECTOR);
      if (over !== hot) {
        hot = over;
        host.classList.toggle("hot", hot);
      }
    };
    const onDown = () => {
      pressed = true;
    };
    const onUp = () => {
      pressed = false;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("pointercancel", onUp, { passive: true });

    /* the dot means nothing once the pointer is off the page */
    const onOut = (e: PointerEvent) => {
      if (!e.relatedTarget) host.style.opacity = "0";
    };
    const onOver = () => {
      host.style.opacity = "1";
    };
    document.addEventListener("pointerout", onOut);
    document.addEventListener("pointerover", onOver);

    let raf = 0;
    let running = true;
    const frame = () => {
      if (!running) return;
      const dx = x - px;
      const dy = y - py;
      px += dx * SPEED;
      py += dy * SPEED;

      /* velocity stretches the dot along its heading and pinches it across —
         the squash is what makes a plain circle read as momentum */
      const squeeze = Math.min(Math.hypot(dx, dy) / ACCELERATOR, MAX_SQUEEZE);
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

      /* eased, not snapped: a hard size jump on hover reads as a glitch */
      const target = (hot ? HOT : 1) * (pressed ? PRESS : 1);
      scale += (target - scale) * 0.18;

      dot.style.transform =
        `translate3d(${px.toFixed(1)}px,${py.toFixed(1)}px,0)` +
        ` translate(-50%,-50%) rotate(${angle.toFixed(2)}deg)` +
        ` scale(${(scale * (1 + squeeze)).toFixed(3)},${(scale * (1 - squeeze)).toFixed(3)})`;

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const onVis = () => {
      const visible = document.visibilityState === "visible";
      if (visible && !running) {
        running = true;
        raf = requestAnimationFrame(frame);
      } else if (!visible) {
        running = false;
        cancelAnimationFrame(raf);
      }
    };
    document.addEventListener("visibilitychange", onVis);

    /* a pointer arriving from a touch or a pen should hand the page back its
       own cursor rather than leave a stranded dot */
    const onFineChange = () => {
      if (!fine.matches) teardown();
    };
    fine.addEventListener("change", onFineChange);

    let torn = false;
    function teardown() {
      if (torn) return;
      torn = true;
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      document.removeEventListener("pointerout", onOut);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("visibilitychange", onVis);
      fine.removeEventListener("change", onFineChange);
      document.documentElement.classList.remove("has-emitter");
      host.remove();
    }
    return teardown;
  }, []);

  return null;
}
