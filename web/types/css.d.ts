import "react";

/* The design system drives a lot of its motion through CSS custom properties
   set inline (--d for stagger delay, --rim-op / --bloom-o on the coins).
   React passes these straight through at runtime; TypeScript needs telling. */
declare module "react" {
  interface CSSProperties {
    [key: `--${string}`]: string | number | undefined;
  }
}
