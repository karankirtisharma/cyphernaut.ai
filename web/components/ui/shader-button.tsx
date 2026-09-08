"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// Two deviations from the source drop, both forced by this codebase:
//
// 1. Renders an <a> when `href` is given. Every CTA on this site is a link,
//    and PageTransition upgrades clicks by delegating on `a[href]` — a <button>
//    would break the route transition, middle-click and crawlability.
// 2. The styles live in globals.css rather than an inline <style>. React does
//    not de-duplicate plain <style> children, so seven CTAs would ship seven
//    identical copies of the same ~4KB block into the DOM.

const GRADIENT_LAYERS = [
  { delay: "0s", duration: "25s" },
  { delay: "0.15s", duration: "15.9s" },
  { delay: "0.53s", duration: "26.4s" },
  { delay: "0.45s", duration: "17.8s" },
  { delay: "1.6s", duration: "19.2s" },
  { delay: "1.6s", duration: "29.2s" },
  { delay: "1.6s", duration: "20.2s" },
];

export interface GradientButtonProps
  extends React.HTMLAttributes<HTMLElement> {
  /** Renders an anchor instead of a button. */
  href?: string;
  target?: string;
  rel?: string;
  /** Larger CTA scale, matching the design system's `.cta-lg`. */
  size?: "md" | "lg";
  type?: "button" | "submit" | "reset";
  children?: React.ReactNode;
  /* the motion layer keys off data-rise / data-hfade on these CTAs */
  [key: `data-${string}`]: unknown;
}

export const GradientButton = React.forwardRef<
  HTMLElement,
  GradientButtonProps
>(
  (
    { className, children = "Start", href, size = "md", type = "button", ...props },
    ref,
  ) => {
    const inner = (
      <>
        {/* the source's .light-bar was a blurred white sheen; over lime it read
            as a washed-out film across the label, so it is gone */}
        {GRADIENT_LAYERS.map((layer, index) => (
          <div
            key={index}
            className="gradient-layer"
            style={{
              animationDelay: layer.delay,
              animationDuration: layer.duration,
            }}
          />
        ))}
        {/* The label is painted twice — once through color-dodge, once through
            multiply — because that pair is what makes the effect read. Only the
            top copy is exposed, so the accessible name is not duplicated. */}
        <div className="gradient-bg" aria-hidden="true">
          {children}
        </div>
        <div className="text-overlay">{children}</div>
      </>
    );

    const classes = cn("btn-wrapper-root", size === "lg" && "gb-lg", className);

    if (href) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={classes}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {inner}
        </a>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type={type}
        className={classes}
        {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {inner}
      </button>
    );
  },
);

GradientButton.displayName = "GradientButton";
