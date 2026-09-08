"use client";

import { useEffect } from "react";
import { finePointer, prefersReducedMotion } from "@/lib/smooth";
import { initScrollFx } from "@/lib/scrollFx";

/* ---------------------------------------------------------------- utils */
export const $ = <T extends Element>(s: string, r: ParentNode = document) =>
  r.querySelector<T>(s);
export const $$ = <T extends Element>(s: string, r: ParentNode = document) =>
  Array.from(r.querySelectorAll<T>(s));
export const clamp = (v: number, a: number, b: number) =>
  Math.min(b, Math.max(a, v));
export const inv = (a: number, b: number, v: number) =>
  clamp((v - a) / (b - a), 0, 1);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** rAF loop that is guaranteed to stop when the effect tears down. */
export function loop(fn: (t: number) => void) {
  let id = 0;
  const tick = (t: number) => {
    fn(t);
    id = requestAnimationFrame(tick);
  };
  id = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(id);
}

/* --------------------------------------------------- scroll-in entrances */
export function entrances(signal: AbortSignal) {
  const reveal = (el: Element) => el.setAttribute("data-in", "1");
  const io = new IntersectionObserver(
    (es) =>
      es.forEach((e) => {
        if (e.isIntersecting || e.boundingClientRect.top < 0) {
          reveal(e.target);
          io.unobserve(e.target);
        }
      }),
    { rootMargin: "0px 0px -12% 0px" },
  );
  $$("[data-rise],[data-wipe],[data-iris]").forEach((el) => io.observe(el));
  signal.addEventListener("abort", () => io.disconnect());

  /* anything already on screen must never wait for an intersection */
  return () =>
    $$(
      "[data-rise]:not([data-in]),[data-wipe]:not([data-in]),[data-iris]:not([data-in])",
    ).forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.9) reveal(el);
    });
}

/* ------------------------------------------- coin stills, when they exist */
export function assetProbe(signal: AbortSignal) {
  $$("[data-asset]").forEach((el) => {
    const n = el.getAttribute("data-asset");
    ["webp", "jpg", "png"].forEach((ext) => {
      const im = new Image();
      im.onload = () => {
        if (signal.aborted || el.classList.contains("filled")) return;
        (el as HTMLElement).style.backgroundImage = `url("/assets/${n}.${ext}")`;
        el.classList.add("filled");
      };
      im.src = `/assets/${n}.${ext}`;
    });
  });
}

/* ------------------------------------------------- magnetic CTA behaviour */
export function magnetics(signal: AbortSignal) {
  if (!finePointer()) return;
  $$<HTMLElement>(".cta:not(#magnet), .btn-wrapper-root:not(#magnet), .ghost").forEach((el) => {
    el.classList.add("mag");
    const pull = el.classList.contains("ghost") ? 0.16 : 0.24;
    let raf = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;

    const run = () => {
      cx += (tx - cx) * 0.18;
      cy += (ty - cy) * 0.18;
      el.style.setProperty("--mx", `${cx.toFixed(2)}px`);
      el.style.setProperty("--my", `${cy.toFixed(2)}px`);
      raf =
        Math.abs(tx - cx) > 0.08 || Math.abs(ty - cy) > 0.08
          ? requestAnimationFrame(run)
          : 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(run);
    };

    el.addEventListener(
      "pointermove",
      (e) => {
        if (e.pointerType !== "mouse") return;
        const r = el.getBoundingClientRect();
        tx = (e.clientX - (r.left + r.width / 2)) * pull;
        ty = (e.clientY - (r.top + r.height / 2)) * pull;
        kick();
      },
      { signal },
    );
    const rest = () => {
      tx = 0;
      ty = 0;
      kick();
    };
    el.addEventListener("pointerleave", rest, { signal });
    el.addEventListener("blur", rest, { signal });
    signal.addEventListener("abort", () => {
      cancelAnimationFrame(raf);
      el.classList.remove("mag");
      el.style.removeProperty("--mx");
      el.style.removeProperty("--my");
    });
  });
}

/* -------------------------------------------- word-level heading reveals */
const SPLIT = "h1.dxl,h2.dxl,h2.dl,h3.dl,h2.ds,h3.dm";
const SKIP =
  ".pstate,#menu,.railitem,.tcard,[data-card],.srow,[data-detail],.cta,.ghost";

export function wordReveals(signal: AbortSignal) {
  const wrap = (el: Element) => {
    const walk = (node: Node) => {
      Array.from(node.childNodes).forEach((n) => {
        if (n.nodeType === 3) {
          const text = n.nodeValue;
          if (!text || !text.trim()) return;
          const frag = document.createDocumentFragment();
          text.split(/(\s+)/).forEach((p) => {
            if (!p) return;
            if (/^\s+$/.test(p)) {
              frag.appendChild(document.createTextNode(p));
              return;
            }
            const w = document.createElement("span");
            w.className = "rv-w";
            const i = document.createElement("span");
            i.textContent = p;
            w.appendChild(i);
            frag.appendChild(w);
          });
          node.replaceChild(frag, n);
        } else if (
          n.nodeType === 1 &&
          !(n as Element).classList.contains("rv-w")
        ) {
          walk(n);
        }
      });
    };
    walk(el);
    const ws = $$<HTMLElement>(".rv-w>span", el);
    if (!ws.length) return false;
    ws.forEach((s, i) =>
      s.style.setProperty("--rd", `${Math.min(i * 36, 520)}ms`),
    );
    el.setAttribute("data-rv", "1");
    return true;
  };

  const pending: Element[] = [];
  const show = (el: Element) => {
    el.setAttribute("data-rv-in", "");
    io.unobserve(el);
  };

  /* `top < 0` catches headings jumped past by an anchor or a restored
     scroll position, which never produce an intersecting entry */
  const io = new IntersectionObserver(
    (es) =>
      es.forEach((e) => {
        if (e.isIntersecting || e.boundingClientRect.top < 0) show(e.target);
      }),
    { rootMargin: "0px 0px -10% 0px" },
  );

  $$(SPLIT).forEach((el) => {
    if (el.closest(SKIP) || el.querySelector(".hline")) return;
    /* A remount (StrictMode, or an effect re-run) sees headings this pass
       already wrapped. Skip re-wrapping them, but still observe: the previous
       pass's observer was disconnected on teardown, so bailing out entirely
       here would leave the words parked off-screen for good. */
    if (!el.hasAttribute("data-rv") && !wrap(el)) return;
    if (el.hasAttribute("data-rv-in")) return;
    pending.push(el);
    io.observe(el);
  });

  const sweep = () => {
    for (let i = pending.length - 1; i >= 0; i--) {
      const el = pending[i];
      if (el.hasAttribute("data-rv-in")) {
        pending.splice(i, 1);
        continue;
      }
      if (el.getBoundingClientRect().top < window.innerHeight * 0.92) show(el);
    }
  };

  let sraf = 0;
  const onScroll = () => {
    if (!sraf) {
      sraf = requestAnimationFrame(() => {
        sraf = 0;
        sweep();
      });
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true, signal });
  const t = window.setTimeout(sweep, 400);

  signal.addEventListener("abort", () => {
    io.disconnect();
    window.clearTimeout(t);
    cancelAnimationFrame(sraf);
  });
}

/* ------------------------------------------------------ team photo tilt */
export function photoTilt(signal: AbortSignal) {
  if (!finePointer()) return;
  $$<HTMLElement>(".tcard, .person").forEach((c) => {
    const ph = $<HTMLElement>(".tphoto", c);
    if (!ph) return;
    c.addEventListener(
      "pointermove",
      (e) => {
        const r = c.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        ph.style.transform = `perspective(900px) rotateY(${(x * 6).toFixed(
          2,
        )}deg) rotateX(${(-y * 6).toFixed(2)}deg)`;
      },
      { signal },
    );
    c.addEventListener(
      "pointerleave",
      () => {
        ph.style.transition = "transform .3s var(--ease-out)";
        ph.style.transform = "none";
        window.setTimeout(() => {
          ph.style.transition = "";
        }, 320);
      },
      { signal },
    );
  });
}

/* ------------------------------------------ contact spotlight + magnet */
function contactPointer(signal: AbortSignal) {
  const stage = $<HTMLElement>(".stage");
  const spot = $<HTMLElement>("#spot");
  const magnet = $<HTMLElement>("#magnet");
  if (!finePointer() || !stage || !spot) return null;

  let mx = 0;
  let my = 0;
  let near = false;

  window.addEventListener(
    "pointermove",
    (e) => {
      mx = e.clientX;
      my = e.clientY;
      const r = stage.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) {
        spot.style.setProperty(
          "--mx",
          `${((e.clientX - r.left) / r.width) * 100}%`,
        );
        spot.style.setProperty(
          "--my",
          `${((e.clientY - r.top) / r.height) * 100}%`,
        );
        spot.style.opacity = "1";
      } else {
        spot.style.opacity = "0";
      }
    },
    { passive: true, signal },
  );

  if (!magnet) return null;
  return () => {
    const r = magnet.getBoundingClientRect();
    const dx = mx - (r.left + r.width / 2);
    const dy = my - (r.top + r.height / 2);
    const n =
      Math.hypot(dx, dy) < 260 && r.top < window.innerHeight && r.bottom > 0;
    if (n !== near) {
      near = n;
      magnet.style.transition = n
        ? "transform .08s linear"
        : "transform .4s var(--ease-out)";
    }
    magnet.style.transform = n
      ? `translate3d(${(dx * 0.26).toFixed(1)}px,${(dy * 0.26).toFixed(1)}px,0)`
      : "translate3d(0,0,0)";
  };
}

/* ================================================================= hooks */

/** Everything the four inner pages need. Each piece feature-detects off the
 *  DOM, which is exactly how the four prototype scripts differed from one
 *  another: the asset probe, the photo tilt and the contact
 *  spotlight simply no-op when their markup is not on the page. */
export function usePageMotion() {
  useEffect(() => {
    const ac = new AbortController();
    const rm = prefersReducedMotion();

    const catchUp = entrances(ac.signal);
    assetProbe(ac.signal);
    photoTilt(ac.signal);
    if (!rm) {
      magnetics(ac.signal);
      wordReveals(ac.signal);
      initScrollFx(ac.signal);
    }
    const drawMagnet = rm ? null : contactPointer(ac.signal);

    let fc = 0;
    const stop = loop(() => {
      if (fc++ % 10 === 0) catchUp();
      drawMagnet?.();
    });

    return () => {
      stop();
      ac.abort();
    };
  }, []);
}

export { useHomeMotion } from "@/lib/homeMotion";
