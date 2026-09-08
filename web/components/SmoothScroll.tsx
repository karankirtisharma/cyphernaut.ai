"use client";

import { useEffect } from "react";
import { setLoco, prefersReducedMotion, type Loco } from "@/lib/smooth";

/** Owns the single Locomotive Scroll instance for the whole app.
 *  Mounted once in the root layout so smooth scrolling survives
 *  client-side route changes instead of being torn down per page. */
export default function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    let cancelled = false;
    let inst: Loco | null = null;

    import("locomotive-scroll").then(({ default: LocomotiveScroll }) => {
      if (cancelled) return;
      inst = new LocomotiveScroll({
        lenisOptions: { lerp: 0.1, smoothWheel: true, wheelMultiplier: 1 },
      }) as unknown as Loco;
      setLoco(inst);
    });

    return () => {
      cancelled = true;
      setLoco(null);
      inst?.destroy();
    };
  }, []);

  return null;
}
