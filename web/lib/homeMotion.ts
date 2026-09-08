"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { finePointer, prefersReducedMotion, getLenis } from "@/lib/smooth";
import {
  $,
  $$,
  clamp,
  inv,
  lerp,
  loop,
  entrances,
  magnetics,
  wordReveals,
  photoTilt,
} from "@/lib/motion";
import { initScrollFx } from "@/lib/scrollFx";

const hex = (h: string): [number, number, number] => [
  parseInt(h.slice(1, 3), 16),
  parseInt(h.slice(3, 5), 16),
  parseInt(h.slice(5, 7), 16),
];
const mix = (a: number[], b: number[], t: number) =>
  `rgb(${a.map((v, i) => Math.round(lerp(v, b[i], t))).join(",")})`;

type Box = { x: number; y: number; top: number; w: number; h: number };

/** The home page's scroll film: hero parallax, the ground colour ramp,
 *  the coin ignition at the peak, the crew rail
 *  and the ground-colour shift.
 *
 *  This stays imperative on purpose. It is one continuous rAF pass over
 *  geometry measured from the live layout — expressing it as React state
 *  would mean a re-render per frame for no benefit. What React adds here is
 *  a guaranteed teardown: every listener, observer and rAF is torn down on
 *  unmount so client-side navigation cannot leak a second loop.
 */
export function useHomeMotion() {
  useEffect(() => {
    const ac = new AbortController();
    const { signal } = ac;
    const D = document;
    const rm = prefersReducedMotion();
    const fine = finePointer();

    /* ---- shared behaviours ---- */
    const catchUp = entrances(signal);
    if (!rm) {
      magnetics(signal);
      wordReveals(signal);
      photoTilt(signal);
      initScrollFx(signal);
    }

    /* ---- in-page anchors ride the smooth scroller ---- */
    const goTo = (sel: string) => {
      const el = $(sel);
      if (!el) return;
      const y = el.getBoundingClientRect().top + window.scrollY - 40;
      const lenis = getLenis();
      if (lenis) lenis.scrollTo(y, { duration: 1.2 });
      else window.scrollTo({ top: y, behavior: "smooth" });
    };
    $$<HTMLAnchorElement>('a[href^="#"]').forEach((a) =>
      a.addEventListener(
        "click",
        (e) => {
          const h = a.getAttribute("href");
          if (!h || h === "#" || !$(h)) return;
          e.preventDefault();
          goTo(h);
        },
        { signal },
      ),
    );

    /* ---- load entrance ---- */
    if (!rm) {
      /* Without this, a throttled or backgrounded tab feeds the ticker huge
         frame deltas and GSAP clamps them, leaving the entrance tweens stuck
         at their `from` values. The prototype set it for the same reason. */
      gsap.ticker.lagSmoothing(0);
      gsap.fromTo(
        "[data-hfade]",
        { opacity: 0, y: 14 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "expo.out",
          stagger: 0.09,
          delay: 0.5,
        },
      );
    }

    /* ---- service rows ---- */
    $$<HTMLElement>("[data-card]").forEach((card) => {
      const detail = $<HTMLElement>("[data-detail]", card);
      if (!detail) return;
      const def = detail.getAttribute("data-default") || "";
      const rows = $$<HTMLElement>(".srow", card);
      let locked: HTMLElement | null = null;

      const put = (txt: string) => {
        if (detail.textContent === txt) return;
        detail.style.opacity = "0";
        window.setTimeout(() => {
          detail.textContent = txt;
          detail.style.opacity = "1";
        }, 160);
      };

      rows.forEach((row) => {
        const txt = $("[data-desc]", row)?.textContent || "";
        row.addEventListener(
          "pointerenter",
          (e) => {
            if (e.pointerType === "mouse" && !locked) put(txt);
          },
          { signal },
        );
        row.addEventListener("focus", () => !locked && put(txt), { signal });
        row.addEventListener("blur", () => !locked && put(def), { signal });
        row.addEventListener(
          "click",
          () => {
            if (locked === row) {
              locked = null;
              row.setAttribute("aria-expanded", "false");
              put(def);
            } else {
              rows.forEach((r) => r.setAttribute("aria-expanded", "false"));
              locked = row;
              row.setAttribute("aria-expanded", "true");
              put(txt);
            }
          },
          { signal },
        );
      });

      card.addEventListener(
        "pointerleave",
        (e) => {
          if (e.pointerType === "mouse" && !locked) put(def);
        },
        { signal },
      );
    });

    /* ---- refs ---- */
    const hero = $<HTMLElement>("#home");
    const coinPlane = $<HTMLElement>('[data-plane="coin"]');
    const farPlane = $<HTMLElement>('[data-plane="far"]');
    const heroCopy = $<HTMLElement>("[data-hero-copy]");
    const act2 = $<HTMLElement>("#about");
    const act3 = $<HTMLElement>("#services");
    const silence = $<HTMLElement>("#silence");
    const sLine = $<HTMLElement>("[data-silence]");
    const peak = $<HTMLElement>("#peak");
    const peakCoin = $<HTMLElement>('[data-coin="peak"]');
    const states = $$<HTMLElement>(".pstate");
    const shots = $$<HTMLElement>(".pshot");

    /* The three phase plates are 908 KB of CSS background. Marking the frame
       live on first approach is what moves that off the critical path — a
       screen of rootMargin gives them time to decode before they are needed. */
    const shotFrame = $<HTMLElement>(".peakshots");
    if (shotFrame) {
      const shotIO = new IntersectionObserver(
        ([e]) => {
          if (!e?.isIntersecting) return;
          shotFrame.setAttribute("data-live", "1");
          shotIO.disconnect();
        },
        { rootMargin: "100% 0px" },
      );
      shotIO.observe(shotFrame);
      signal.addEventListener("abort", () => shotIO.disconnect());
    }
    const act6 = $<HTMLElement>("#outcomes");
    const team = $<HTMLElement>("#team");
    const rail = $<HTMLElement>("[data-rail]");
    const railItems = $$<HTMLElement>(".railitem");
    const close = $<HTMLElement>("#contact");
    const magnet = $<HTMLElement>("#magnet");
    const spot = $<HTMLElement>("#spot");
    const ground = $<HTMLElement>("#ground");
    const ring = $<SVGCircleElement>("#closering circle");

    /* coinPlane / farPlane belonged to the old coin hero and are absent from
       the rebuilt one. They stay optional — requiring them here would
       early-return and take the peak, rail and ground with them. */
    if (
      !hero ||
      !heroCopy ||
      !act2 ||
      !act3 ||
      !silence ||
      !sLine ||
      !peak ||
      !peakCoin ||
      !act6 ||
      !team ||
      !rail ||
      !close ||
      !ground
    ) {
      return () => ac.abort();
    }


    let RL = 0;
    if (ring) {
      RL = ring.getTotalLength();
      ring.style.strokeDasharray = String(RL);
      ring.style.strokeDashoffset = String(RL);
    }

    /* ---- orbit thread geometry ---- */
    let railTravel = 0;
    let docScroll = 1;
    let stops: { y: number; c: number[] }[] = [];

    const build = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const docH = D.documentElement.scrollHeight;
      const foot = D.querySelector("footer");
      const footTop = foot
        ? foot.getBoundingClientRect().top + window.scrollY
        : docH;
      docScroll = Math.max(1, Math.min(docH - vh, footTop - vh * 0.96));

      const box = (el: Element): Box => {
        const r = el.getBoundingClientRect();
        return {
          x: r.left + r.width / 2,
          y: r.top + window.scrollY + r.height / 2,
          top: r.top + window.scrollY,
          w: r.width,
          h: r.height,
        };
      };

      const b2 = box(act2);
      const b3 = box(act3);
      const b4 = box(silence);
      const b5 = box(peak);
      const b6 = box(act6);
      const b7 = box(team);
      const b8 = box(close);

      railTravel = Math.max(0, rail.scrollWidth - window.innerWidth + 32);

      const cv = hex("#070908");
      const lit = hex("#0B120A");
      const midc = hex("#0A0C0B");
      stops = [
        { y: 0, c: cv },
        { y: b2.top, c: cv },
        { y: b3.top, c: midc },
        { y: b4.top, c: cv },
        { y: b5.top, c: cv },
        { y: b5.top + b5.h * 0.45, c: lit },
        { y: b6.top, c: lit },
        { y: b6.top + b6.h, c: midc },
        { y: b7.top + b7.h, c: midc },
        { y: b8.top, c: cv },
        { y: docH, c: cv },
      ];
    };

    /* ---- pointer state ---- */
    let px = 0.5;
    let py = 0.5;
    let mx = 0;
    let my = 0;
    if (fine && !rm) {
      window.addEventListener(
        "pointermove",
        (e) => {
          px = e.clientX / window.innerWidth;
          py = e.clientY / window.innerHeight;
          mx = e.clientX;
          my = e.clientY;
          if (!spot) return;
          const r = close.getBoundingClientRect();
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
    }

    /* ---- the loop ---- */
    let s = 0;
    let ignited = false;

    const prog = (el: Element) => {
      const r = el.getBoundingClientRect();
      const tot = r.height - window.innerHeight;
      return tot > 4
        ? clamp(-r.top / tot, 0, 1)
        : clamp(
            (window.innerHeight - r.top) / (window.innerHeight + r.height),
            0,
            1,
          );
    };

    let fc = 0;
    const frame = (t: number) => {
      if (fc++ % 20 === 0) catchUp();
      const vh = window.innerHeight;
      const sy = window.scrollY;

      /* hero */
      const hp = prog(hero);
      if (!rm) {
        const scrolled = Math.max(0, sy);
        if (farPlane)
          farPlane.style.transform = `translate3d(0,${(scrolled * 0.31).toFixed(1)}px,0)`;
        if (coinPlane)
          coinPlane.style.transform = `translate(0,-50%) translate3d(0,${(scrolled * 0.2).toFixed(1)}px,0)`;
        const fade = 1 - inv(0.45, 0.85, hp);
        heroCopy.style.opacity = fade.toFixed(3);
        heroCopy.style.transform = `translate3d(0,${(-30 * inv(0.45, 0.9, hp)).toFixed(1)}px,0)`;
      }

      /* silence */
      if (!rm) {
        const sp = prog(silence);
        sLine.style.opacity = (
          inv(0.15, 0.3, sp) *
          (1 - inv(0.8, 1, sp))
        ).toFixed(3);
      }

      /* peak */
      const pp = prog(peak);
      if (!rm) {
        const on1 = inv(0.3, 0.42, pp);
        const on2 = inv(0.64, 0.74, pp);
        const op = [1 - on1, on1 * (1 - on2), on2];
        states.forEach((st, i) => {
          st.style.opacity = op[i].toFixed(3);
          st.style.transform = `translate3d(0,${(16 * (1 - op[i])).toFixed(1)}px,0)`;
          st.style.pointerEvents = op[i] > 0.5 ? "auto" : "none";
        });
        /* the phase illustrations crossfade on exactly the copy's timeline, so
           the picture and the words always name the same phase */
        shots.forEach((el, i) => {
          el.style.opacity = (op[i] ?? 0).toFixed(3);
        });
        peakCoin.style.transform = `scale(${lerp(0.96, 1.04, inv(0.3, 0.62, pp)).toFixed(3)})`;
        const ig = $<HTMLElement>("[data-ig]");
        if (ig && !ignited && pp > 0.31) {
          ignited = true;
          ig.style.animation = "rise .9s var(--ease-out) both";
        }
      }

      /* crew rail */
      if (!rm) {
        const tp = prog(team);
        rail.style.transform = `translate3d(${(-railTravel * tp).toFixed(1)}px,0,0)`;
        const cxv = window.innerWidth / 2;
        railItems.forEach((it, i) => {
          const r = it.getBoundingClientRect();
          const dist = Math.abs(r.left + r.width / 2 - cxv) / window.innerWidth;
          it.style.opacity =
            i === 0 ? "1" : String(clamp(1 - dist * 0.9, 0.55, 1));
        });
      }

      /* ground */
      if (stops.length) {
        const y = sy + vh * 0.5;
        let i = 0;
        while (i < stops.length - 2 && y > stops[i + 1].y) i++;
        const a = stops[i];
        const b = stops[i + 1];
        ground.style.backgroundColor = mix(a.c, b.c, inv(a.y, b.y, y));
      }

      /* The closing ring rides the same scroll scalar the thread used to.
         `s` is eased rather than raw so the ring still draws smoothly. */
      if (RL && ring) {
        if (rm) {
          ring.style.strokeDashoffset = "0";
        } else {
          s += (clamp(sy / docScroll, 0, 1) - s) * 0.12;
          ring.style.strokeDashoffset = (RL * (1 - inv(0.8, 1, s))).toFixed(1);
        }
      }

      /* the closing magnet */
      if (fine && !rm && magnet) {
        const r = magnet.getBoundingClientRect();
        const dx = mx - (r.left + r.width / 2);
        const dy = my - (r.top + r.height / 2);
        const near =
          Math.hypot(dx, dy) < 260 && r.top < window.innerHeight && r.bottom > 0;
        magnet.style.transform = near
          ? `translate3d(${(dx * 0.26).toFixed(1)}px,${(dy * 0.26).toFixed(1)}px,0)`
          : "translate3d(0,0,0)";
        magnet.style.transition = near
          ? "transform .08s linear"
          : "transform .4s var(--ease-out)";
      }
    };

    if (!rm) {
      const ig0 = $<HTMLElement>("[data-ig]");
      if (ig0) ig0.style.transform = "translateY(112%)";
    }
    build();
    const stop = loop(frame);

    /* ---- relayout ---- */
    let rt = 0;
    const onResize = () => {
      window.clearTimeout(rt);
      rt = window.setTimeout(build, 180);
    };
    window.addEventListener("resize", onResize, { signal });
    D.fonts?.ready.then(() => window.setTimeout(build, 60));
    $$("img").forEach((im) => im.addEventListener("load", onResize, { signal }));
    const t1 = window.setTimeout(build, 900);
    const t2 = window.setTimeout(build, 2200);

    return () => {
      stop();
      window.clearTimeout(rt);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      ac.abort();
    };
  }, []);
}
