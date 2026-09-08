"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/* The canvas carries the astronaut plate only. The reference's glass cards
   moved to the DOM (.hero-cards), where exact percentage placement, crisp
   small type and real backdrop glass are all cheaper and sharper than plane
   geometry with texture-baked text. */

export default function HeroScene({ className }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    /* custom properties inherit downward only, and .hero-labels is a sibling of
       this canvas, not a child — publish onto the shared parent or the labels
       never see --px/--py */
    const varTarget = (host.closest(".hero-visual") as HTMLElement | null) ?? host;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch {
      return; /* no WebGL — the CSS fallback poster stays visible */
    }
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    host.appendChild(renderer.domElement);
    renderer.domElement.style.cssText =
      "display:block;width:100%;height:100%;position:absolute;inset:0";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0, 7.2);

    /* Plate geometry, needed before the texture loads so resize() can fit.
       The astronaut's opaque pixels run to the plate's left and bottom edges
       exactly (alpha bbox x 0.000-0.940, y 0.032-1.000), so there is no
       transparent margin on those sides to absorb an overflow — whatever the
       frustum fails to cover is cut off the boot. */
    const PLATE_H = 4.32;
    const PLATE_W = PLATE_H * (1210 / 1300);
    const PLATE_Z = 0.4;
    const X_OFF = -0.44;
    const FLOAT = 0.09;
    const RZ = 0.014; /* the idle roll widens the swept box slightly */
    const halfH =
      (PLATE_H / 2) * Math.cos(RZ) + (PLATE_W / 2) * Math.sin(RZ) + FLOAT;
    const halfW =
      (PLATE_W / 2) * Math.cos(RZ) +
      (PLATE_H / 2) * Math.sin(RZ) +
      Math.abs(X_OFF) +
      FLOAT;

    /* A perspective camera has a fixed *vertical* fov, so the horizontal
       extent is whatever the aspect gives — as the visual box narrows the
       sides collapse and the plate is cropped. Solving both axes and taking
       the further distance means the astronaut shrinks on a narrow box rather
       than losing a foot. */
    const fitCamera = () => {
      const tanV = Math.tan((camera.fov * Math.PI) / 360);
      const dV = halfH / tanV;
      const dH = halfW / (tanV * Math.max(0.2, camera.aspect));
      /* 5%, not 2%. The astronaut's opaque pixels reach the plate's left and
         bottom edges exactly, so the fit has no tolerance of its own — any
         rounding in the canvas size or DPR shaves real content off the boot.
         The cost is a marginally smaller astronaut; the alternative is a
         cropped one. */
      camera.position.z = PLATE_Z + Math.max(dV, dH) * 1.05;
      camera.updateProjectionMatrix();
    };

    const group = new THREE.Group();
    scene.add(group);

    const disposables: Array<{ dispose(): void }> = [];
    const track = <T extends { dispose(): void }>(o: T) => {
      disposables.push(o);
      return o;
    };

    /* ---- astronaut ---- */
    let astro: THREE.Mesh | null = null;
    const loader = new THREE.TextureLoader();
    loader.load(
      "/assets/astronaut.webp",
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
        track(tex);
        /* geometry and placement live with fitCamera() above, so the camera
           solve and the plate can never disagree */
        const geo = track(new THREE.PlaneGeometry(PLATE_W, PLATE_H));
        const mat = track(
          new THREE.MeshBasicMaterial({
            map: tex,
            transparent: true,
            depthWrite: false,
          }),
        );
        astro = new THREE.Mesh(geo, mat);
        astro.position.set(X_OFF, 0, PLATE_Z);
        group.add(astro);
        host.setAttribute("data-loaded", "1");
        request();
      },
      undefined,
      () => {
        /* texture missing — cards still render, poster stays as backdrop */
        host.setAttribute("data-loaded", "1");
      },
    );

    /* ---- sizing ---- */
    let w = 0;
    let h = 0;
    const resize = () => {
      const r = host.getBoundingClientRect();
      w = Math.max(1, r.width);
      h = Math.max(1, r.height);
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      fitCamera();
    };
    resize();

    /* ---- pointer parallax ---- */
    let px = 0;
    let py = 0;
    let cx = 0;
    let cy = 0;
    if (fine && !reduced) {
      window.addEventListener(
        "pointermove",
        (e) => {
          px = (e.clientX / window.innerWidth - 0.5) * 2;
          py = (e.clientY / window.innerHeight - 0.5) * 2;
          request();
        },
        { passive: true },
      );
    }

    /* ---- loop, paused when off screen or hidden ---- */
    let raf = 0;
    let visible = document.visibilityState === "visible";
    let inView = true;
    let disposed = false;
    const start = performance.now();

    const render = (now: number) => {
      raf = 0;
      if (disposed || !visible || !inView) return;
      const t = reduced ? 0 : (now - start) / 1000;

      cx += (px - cx) * 0.05;
      cy += (py - cy) * 0.05;

      /* publish the smoothed pointer so the HTML card labels overlaid on top
         can ride the same parallax — otherwise they visibly slide off the
         3D cards they are supposed to be sitting on */
      varTarget.style.setProperty("--px", cx.toFixed(4));
      varTarget.style.setProperty("--py", cy.toFixed(4));

      group.rotation.y = cx * 0.05;
      group.rotation.x = -cy * 0.03;

      if (astro) {
        astro.position.y = reduced ? 0 : Math.sin(t * 0.42) * FLOAT;
        astro.rotation.z = reduced ? 0 : Math.sin(t * 0.3) * 0.014;
        astro.position.x = X_OFF + cx * FLOAT;
        astro.rotation.y = cx * 0.05;
      }

      renderer.render(scene, camera);

      const settling = Math.abs(px - cx) > 0.001 || Math.abs(py - cy) > 0.001;
      if (!reduced || settling) request();
    };
    function request() {
      if (!disposed && visible && inView && raf === 0)
        raf = requestAnimationFrame(render);
    }

    const ro = new ResizeObserver(() => {
      resize();
      request();
    });
    ro.observe(host);

    const io = new IntersectionObserver(([e]) => {
      inView = e?.isIntersecting ?? true;
      if (inView) request();
      else if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    });
    io.observe(host);

    const onVis = () => {
      visible = document.visibilityState === "visible";
      if (visible) request();
      else if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };
    document.addEventListener("visibilitychange", onVis);
    request();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={hostRef} className={className} aria-hidden="true" />;
}
