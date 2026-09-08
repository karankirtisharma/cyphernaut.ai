"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { getLenis } from "@/lib/smooth";

/** Camera framing: azimuth / elevation in radians, and the fraction of the
 *  frame the model should span. Distance is solved from these, not guessed. */
const CAM = { az: 0.44, el: 0.15, fill: 0.96 };

/** Max lever throw, radians (~34deg). */
const THROW = 0.6;
/** Past this the switch commits and the page advances. */
const COMMIT = 0.92;

/** Real bounds of a set of meshes, read off the position attributes.
 *  Box3.setFromObject trusts the accessor min/max, and this model's are
 *  wrong — several parts declare min = [0,0,0]. */
function realBounds(obj: THREE.Object3D) {
  const box = new THREE.Box3();
  const v = new THREE.Vector3();
  obj.updateWorldMatrix(true, true);
  obj.traverse((o) => {
    const m = o as THREE.Mesh;
    if (!m.isMesh) return;
    const pos = m.geometry.attributes.position;
    const step = Math.max(1, Math.floor(pos.count / 4000));
    for (let i = 0; i < pos.count; i += step) {
      v.fromBufferAttribute(pos as THREE.BufferAttribute, i);
      m.localToWorld(v);
      box.expandByPoint(v);
    }
  });
  return box;
}


/** The lever's ball joint. Buckets sampled vertices by height and returns the
 *  centroid of the widest band in the lower half — the boot's bulge, which is
 *  where the stick actually pivots. */
function socketPivot(obj: THREE.Object3D, box: THREE.Box3) {
  const BANDS = 24;
  const lo = box.min.y;
  const h = Math.max(1e-6, box.max.y - lo);
  const cx = (box.min.x + box.max.x) / 2;
  const cz = (box.min.z + box.max.z) / 2;
  const rad = new Float64Array(BANDS);
  const sx = new Float64Array(BANDS);
  const sz = new Float64Array(BANDS);
  const n = new Float64Array(BANDS);
  const v = new THREE.Vector3();

  obj.updateWorldMatrix(true, true);
  obj.traverse((o) => {
    const m = o as THREE.Mesh;
    if (!m.isMesh) return;
    const pos = m.geometry.attributes.position;
    const step = Math.max(1, Math.floor(pos.count / 8000));
    for (let i = 0; i < pos.count; i += step) {
      v.fromBufferAttribute(pos as THREE.BufferAttribute, i);
      m.localToWorld(v);
      const b = Math.min(BANDS - 1, Math.max(0, Math.floor(((v.y - lo) / h) * BANDS)));
      rad[b] = Math.max(rad[b], Math.hypot(v.x - cx, v.z - cz));
      sx[b] += v.x;
      sz[b] += v.z;
      n[b] += 1;
    }
  });

  let best = 0;
  for (let i = 1; i < BANDS / 2; i++) if (n[i] > 0 && rad[i] > rad[best]) best = i;
  if (!n[best]) return new THREE.Vector3(cx, box.min.y, cz);
  return new THREE.Vector3(sx[best] / n[best], lo + ((best + 0.5) / BANDS) * h, sz[best] / n[best]);
}

export default function JoystickScene({ className }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch {
      return;
    }
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    /* RoomEnvironment is a bright white studio; at full exposure it lifts the
       blacks and the model reads grey. Pull it down for the reference's
       deep-black, high-contrast PBR. */
    renderer.toneMappingExposure = 0.8;
    host.appendChild(renderer.domElement);
    renderer.domElement.style.cssText =
      "position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none";

    const scene = new THREE.Scene();
    /* a long lens: at 32deg the near base bloats and the lever shrinks behind it */
    const camera = new THREE.PerspectiveCamera(21, 1, 0.01, 100);
    const rig = new THREE.Group();
    scene.add(rig);

    /* No punctual lights at all. Tripo previews the model under a neutral
       studio environment, so the honest equivalent is image-based lighting —
       the materials' own reflections and emissive strips do the work. Added
       directionals only re-tint metal that is already lit correctly. */
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envRT.texture;
    scene.environmentIntensity = 0.72;

    /* lever lives under its own pivot so it can swing independently of the base */
    const pivot = new THREE.Group();
    rig.add(pivot);

    let axis = new THREE.Vector3(1, 0, 0);
    let leverReady = false;
    /* Swing about the camera's own horizontal axis, so dragging down always
       pushes the stick toward the viewer no matter where the camera sits. The
       previous version derived the axis from the shaft's "lean plane", but that
       vector was the bounding-box centre minus itself — identically (0,1,0) —
       so its cross product with world up was zero and it silently fell back to
       world X, swinging the lever diagonally across the socket. */
    const setAxis = () => {
      if (!leverReady) return;
      camera.updateMatrixWorld();
      axis.setFromMatrixColumn(camera.matrixWorld, 0).normalize();
    };
    let loaded = 0;
    let disposed = false;

    const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);

    /* Solved framing. The previous version placed the camera at a fixed
       multiple of the model's radius, which put the frustum's visible height at
       1.00x the largest dimension — a perfect fill with no margin, so the lever
       tip and the base's front edge were clipped by the frame. This fits the
       eight bounding-box corners exactly instead, and re-solves on resize so a
       narrow viewport widens the shot rather than cropping it. */
    let fit: { ctr: THREE.Vector3; corners: THREE.Vector3[] } | null = null;

    const place = () => {
      if (!fit) return;
      const { ctr, corners } = fit;
      const dir = new THREE.Vector3(
        Math.cos(CAM.el) * Math.sin(CAM.az),
        Math.sin(CAM.el),
        Math.cos(CAM.el) * Math.cos(CAM.az),
      );
      /* orientation is distance-independent, so read the basis off a probe */
      camera.position.copy(ctr).addScaledVector(dir, 1);
      camera.lookAt(ctr);
      camera.updateMatrixWorld();
      const right = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 0);
      const up = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 1);

      const tanY = Math.tan((camera.fov * Math.PI) / 360) * CAM.fill;
      const tanX = tanY * camera.aspect;
      const v = new THREE.Vector3();
      let d = 0;
      for (const c of corners) {
        v.subVectors(c, ctr);
        const z = v.dot(dir); /* toward the camera */
        d = Math.max(d, z + Math.abs(v.dot(up)) / tanY, z + Math.abs(v.dot(right)) / tanX);
      }
      camera.position.copy(ctr).addScaledVector(dir, d);
      camera.lookAt(ctr);
      setAxis();
      request();
    };

    const frameCamera = () => {
      const box = realBounds(rig);
      const ctr = box.getCenter(new THREE.Vector3());
      const corners: THREE.Vector3[] = [];
      for (let i = 0; i < 8; i++)
        corners.push(
          new THREE.Vector3(
            i & 1 ? box.max.x : box.min.x,
            i & 2 ? box.max.y : box.min.y,
            i & 4 ? box.max.z : box.min.z,
          ),
        );
      fit = { ctr, corners };
      place();
      /* dev-only handle for tuning the framing from the console */
      if (process.env.NODE_ENV !== "production")
        (window as unknown as { __joyCam?: (az: number, el: number, fill: number) => void }).__joyCam =
          (az, el, fill) => {
            CAM.az = az;
            CAM.el = el;
            CAM.fill = fill;
            place();
          };
      host.setAttribute("data-loaded", "1");
      /* the gate arms on scroll; if loading finished after the reader already
         stopped here, no further scroll event is coming */
      onScroll();
    };

    /* The two parts are ~1.97 MB and this section sits far below the fold, so
       they are fetched on first approach rather than at mount. The observer
       that already gates rendering does the gating; its rootMargin gives the
       download a screen of runway so the switch is built by the time it is
       reached. */
    let loadStarted = false;
    const startLoad = () => {
      if (loadStarted || disposed) return;
      loadStarted = true;

      loader.load("/models/joystick-base.glb", (g) => {
        if (disposed) return;
        rig.add(g.scene);
        if (++loaded === 2) frameCamera();
        request();
      });

      loader.load("/models/joystick-lever.glb", (g) => {
        if (disposed) return;
        const lever = g.scene;
        const b = realBounds(lever);

        /* The pivot is the ball joint, and it is a real feature of the mesh: the
           shaft's cross-section bulges at the boot, narrows to a waist, then
           bulges again at the knob. Sampling that profile puts the ball at ~17.5%
           up the shaft. Hinging at the bounding box's bottom face instead — 0.08
           units too low — let the boot swing clear of the collar and open the gap
           around the socket. */
        const p = socketPivot(lever, b);
        pivot.position.copy(p);
        lever.position.sub(p);
        pivot.add(lever);
        leverReady = true;
        setAxis();

        if (++loaded === 2) frameCamera();
        request();
      });
    };

    /* ---- interaction ---- */
    let target = 0; /* 0 = up, 1 = fully thrown */
    let shown = 0;
    let vel = 0;
    let dragging = false;
    let dragStartY = 0;
    let dragStartTarget = 0;
    let committed = false;
    /* only a deliberate pull advances the page — auto-committing from scroll
       would yank the reader forward mid-scroll for no reason */
    let viaDrag = false;

    /* published on the section, not on this host: .qhint is a sibling and
       custom properties only inherit downward */
    const varTarget = (host.closest("section") as HTMLElement | null) ?? host;
    const setProgress = (v: number) => {
      target = Math.max(0, Math.min(1, v));
      varTarget.style.setProperty("--throw", target.toFixed(3));
      request();
    };

    const el = renderer.domElement;
    el.addEventListener("pointerdown", (e) => {
      dragging = true;
      dragStartY = e.clientY;
      dragStartTarget = target;
      el.setPointerCapture(e.pointerId);
      host.setAttribute("data-dragging", "1");
    });
    el.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      viaDrag = true;
      const span = Math.max(120, host.getBoundingClientRect().height * 0.45);
      setProgress(dragStartTarget + (e.clientY - dragStartY) / span);
    });
    const endDrag = () => {
      if (!dragging) return;
      dragging = false;
      host.removeAttribute("data-dragging");
      if (target < COMMIT) setProgress(0); /* springs back unless committed */
    };
    el.addEventListener("pointerup", endDrag);
    el.addEventListener("pointercancel", endDrag);

    /* ---- the gate ----
       The section pins when it reaches the top of the viewport and only the
       lever releases it forward. An earlier version also released after three
       blocked scroll attempts, which made the gate look broken: one flick of a
       wheel or trackpad fires far more than three wheel events, so it unlocked
       before the reader had finished the gesture. That escape is gone.

       What remains cannot trap anyone:
         - it never arms under reduced motion, before both parts have loaded,
           or if WebGL never started (the component returns early);
         - scrolling up is allowed and simply re-arms on the way back down, so
           the reader is never held against their will, only held *forward*;
         - the keyboard commits it, since a drag is impossible without a pointer. */
    const section = host.closest("section") as HTMLElement | null;
    /* `host` is narrowed non-null by the guard at the top of the effect, but a
       hoisted `function` does not keep that narrowing — capture it. */
    const stage = host;
    let locked = false;
    let passed = false;
    /* re-arming needs the section to have genuinely moved away, or the gate
       flickers on and off at the boundary */
    const REARM_AT = 90;
    let touchY = 0;

    const unlock = () => {
      if (!locked) return;
      locked = false;
      host.removeAttribute("data-locked");
      /* Only hand scrolling back if nothing else is holding it. The mobile
         drawer stops Lenis too and sets overflow:hidden while it is open; an
         unconditional start() here would let the page scroll behind it. */
      if (document.documentElement.style.overflow !== "hidden") getLenis()?.start();
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };
    /* forward release — only the lever earns this */
    const release = () => {
      passed = true;
      unlock();
    };
    /* Upward is served by hand. Lenis is stopped while the gate holds, and
       preventDefault cannot stop it anyway — its wheel listener registered
       first and has already run by the time this one fires. Scrolling the
       window directly is what lets the reader retreat without the gate ever
       releasing forward. */
    const stepBack = (dy: number) => window.scrollBy(0, dy);

    let nudgeAt = 0;
    const blocked = () => {
      window.clearTimeout(nudgeAt);
      host.setAttribute("data-nudge", "1");
      nudgeAt = window.setTimeout(() => host.removeAttribute("data-nudge"), 460);
    };

    function onWheel(e: WheelEvent) {
      if (!locked) return;
      if (e.cancelable) e.preventDefault();
      if (e.deltaY < 0) {
        stepBack(e.deltaY);
        return;
      }
      blocked();
    }
    function onTouchStart(e: TouchEvent) {
      touchY = e.touches[0]?.clientY ?? 0;
    }
    function onTouchMove(e: TouchEvent) {
      if (!locked) return;
      /* A touch that started on the stage is the lever being pulled, and that
         pull travels downward — exactly the direction this handler reads as
         "scrolling back up". Without this the gate released itself the instant
         the reader began the gesture it exists to require. */
      if (stage.contains(e.target as Node)) return;
      const y = e.touches[0]?.clientY ?? 0;
      /* Once the browser has committed to a scroll the event arrives with
         cancelable=false, and preventDefault on it does nothing except log an
         Intervention warning — 42 of them in one session. */
      if (e.cancelable) e.preventDefault();
      const dy = y - touchY;
      touchY = y;
      /* finger travelling down = the reader is retreating upward */
      if (dy > 0) {
        stepBack(-dy);
        return;
      }
      if (dy < -6) blocked();
    }

    let armed = true;
    const lock = () => {
      if (locked || passed || !armed || reduced || loaded < 2 || !section) return;
      locked = true;
      armed = false;
      host.setAttribute("data-locked", "1");
      /* Scroll events coalesce during a fling, so this can fire with the
         section already well past the top. Freezing there pins a misaligned
         view — switch high, hint off-centre, the next section showing — and
         the reader cannot correct it because scrolling is now blocked. Settle
         the section first, then stop. */
      const top = section.getBoundingClientRect().top + window.scrollY;
      if (Math.abs(window.scrollY - top) > 2) window.scrollTo(0, top);
      getLenis()?.stop();
      window.addEventListener("wheel", onWheel, { passive: false });
      window.addEventListener("touchstart", onTouchStart, { passive: true });
      window.addEventListener("touchmove", onTouchMove, { passive: false });
    };

    /* keyboard has no drag, so it gets its own way through */
    host.tabIndex = 0;
    host.setAttribute("role", "button");
    host.setAttribute("aria-label", "Pull the lever to continue");
    host.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " " && e.key !== "ArrowDown") return;
      e.preventDefault();
      viaDrag = true;
      setProgress(1);
    });

    const onScroll = () => {
      if (!section) return;
      const r = section.getBoundingClientRect();
      if (locked) {
        /* they have genuinely retreated past the section — stand down, but stay
           eligible so the gate is waiting again on the way back */
        if (r.top > REARM_AT) {
          unlock();
          armed = true;
        }
      } else if (!passed) {
        if (r.top <= 4 && r.bottom > window.innerHeight * 0.5) lock();
        else if (Math.abs(r.top) > REARM_AT) armed = true;
      }
      if (dragging || locked) return;
      viaDrag = false;
      const span = r.height + window.innerHeight;
      const p = (window.innerHeight - r.top) / span;
      /* rests through the bulk of the section — it should read as a switch
         waiting to be thrown, not a slider that drifts as you scroll */
      setProgress(Math.max(0, Math.min(1, (p - 0.7) / 0.22)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    /* ---- loop ---- */
    let raf = 0;
    let inView = true;
    let visible = document.visibilityState === "visible";

    const render = () => {
      raf = 0;
      if (disposed || !visible || !inView) return;
      if (reduced) {
        shown = target;
      } else {
        /* critically damped spring — a flat lerp decelerates into the target
           and never carries the weight a physical lever should have */
        const dt = 1 / 60;
        const stiffness = 150;
        const damping = 2 * Math.sqrt(stiffness);
        vel += (target - shown) * stiffness * dt - vel * damping * dt;
        shown += vel * dt;
      }
      pivot.setRotationFromAxisAngle(axis, shown * THROW);

      /* `target` is what the reader pulled to; `shown` is the damped value the
         renderer draws. Gating the commit on `shown` made it depend on the
         spring converging, and this is an on-demand loop — with no events to
         keep requesting frames it stalled around 0.6 and the throw was simply
         ignored. Reading the intent instead also fires the moment the lever
         passes the threshold rather than after it settles. */
      if (!committed && viaDrag && target > COMMIT) {
        committed = true;
        host.setAttribute("data-committed", "1");
        release();
        const peak = document.querySelector("#peak");
        if (peak) {
          const y = peak.getBoundingClientRect().top + window.scrollY;
          const lenis = getLenis();
          if (lenis) lenis.scrollTo(y, { duration: 1.4 });
          else window.scrollTo({ top: y, behavior: "smooth" });
        }
      }
      if (target < COMMIT - 0.1) committed = false;

      renderer.render(scene, camera);
      if (Math.abs(target - shown) > 0.0005 || Math.abs(vel) > 0.0005) request();
    };
    function request() {
      if (!disposed && visible && inView && raf === 0) raf = requestAnimationFrame(render);
    }

    const resize = () => {
      const r = host.getBoundingClientRect();
      renderer.setSize(Math.max(1, r.width), Math.max(1, r.height), false);
      camera.aspect = Math.max(0.2, r.width / Math.max(1, r.height));
      camera.updateProjectionMatrix();
      place();
      request();
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(host);
    const io = new IntersectionObserver(
      ([e]) => {
      inView = e?.isIntersecting ?? true;
      if (inView) {
        startLoad();
        request();
      }
      else if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
      },
      /* a screen of runway ahead of the section */
      { rootMargin: "100% 0px" },
    );
    io.observe(host);
    const onVis = () => {
      visible = document.visibilityState === "visible";
      if (visible) request();
    };
    document.addEventListener("visibilitychange", onVis);
    request();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("scroll", onScroll);
      unlock();
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (!m.isMesh) return;
        m.geometry.dispose();
        const mat = m.material;
        (Array.isArray(mat) ? mat : [mat]).forEach((x) => {
          const s = x as THREE.MeshStandardMaterial;
          s.map?.dispose();
          s.dispose();
        });
      });
      envRT.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={hostRef} className={className} />;
}
