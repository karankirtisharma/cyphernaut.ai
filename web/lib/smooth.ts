/* Shared handle on the app-wide Locomotive Scroll instance.
   Locomotive v5 runs on native scroll and wraps Lenis, so `lenisInstance`
   is what the page effects talk to (stop/start/scrollTo/on). */

export type Lenis = {
  stop(): void;
  start(): void;
  on(event: string, cb: () => void): void;
  off?(event: string, cb: () => void): void;
  scrollTo(target: unknown, opts?: unknown): void;
};

export type Loco = {
  lenisInstance: Lenis;
  destroy(): void;
  resize?(): void;
  scrollTo(target: unknown, opts?: unknown): void;
};

let instance: Loco | null = null;

export const setLoco = (l: Loco | null) => {
  instance = l;
};
export const getLoco = () => instance;
export const getLenis = () => instance?.lenisInstance ?? null;

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const finePointer = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(hover: hover) and (pointer: fine)").matches;
