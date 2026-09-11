"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { getLoco, prefersReducedMotion } from "@/lib/smooth";

/* Route transition: the growing-glass-bubble wipe from the CodePen slider
   (SLIDER_CONFIG's default effect, "glass", at its Default preset).

   Adapted rather than copied wholesale:
   - The original is a six-image slider driven by three.js and Tweakpane. Both
     are dropped: a layout-level three import would pull ~600 KB onto every
     route, and this project already does its WebGL by hand in
     shader-background.tsx, so the same raw-GL pattern is used here.
   - Only the `glass` branch ships. The other four effects are ~250 lines of
     GLSL that nothing reaches, and at the Default preset every global
     multiplier is 1.0, so the parameter uniforms fold into constants below.
   - The slider's "slides" become route plates drawn on a 2D canvas — the
     destination's name on the brand ground. That gives the refraction real
     detail to bend and tells the reader where they are going. */

const FADE_IN = 200;
const WIPE = 850;
const FADE_OUT = 380;
/* if a push never resolves, do not strand the reader behind an opaque curtain */
const SAFETY = 4000;

const LABELS: Record<string, string> = {
  "/about": "CYPHERNAUT",
  "/services": "SERVICES",
  "/launch": "LAUNCH",
  "/team": "TEAM",
  "/book-a-call": "BOOK A CALL",
};
const labelFor = (p: string) => LABELS[p.replace(/\/+$/, "") || "/"] ?? "CYPHERNAUT";

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main(){ vUv = aPos * 0.5 + 0.5; gl_Position = vec4(aPos, 0.0, 1.0); }`;

/* glassEffect, transcribed from the CodePen with the Default-preset constants
   folded in (every global multiplier is 1.0 there, so the colour-enhancement
   mix became a no-op and is dropped). */
const FRAG = `
precision highp float;
uniform sampler2D uTexture1;
uniform sampler2D uTexture2;
uniform float uProgress;
uniform vec2 uResolution;
uniform vec2 uTexture1Size;
uniform vec2 uTexture2Size;
varying vec2 vUv;

const float GLASS_STRENGTH = 0.08;
const float CHROMATIC = 0.02;
const float WAVE_DISTORTION = 0.025;
const float CLEAR_CENTER = 0.3;
const float SURFACE_RIPPLES = 0.004;
const float LIQUID_FLOW = 0.015;
const float RIM_WIDTH = 0.05;
const float EDGE_WIDTH = 0.025;

vec2 getCoverUV(vec2 uv, vec2 texSize){
  vec2 s = uResolution / texSize;
  float scale = max(s.x, s.y);
  vec2 scaled = texSize * scale;
  vec2 offset = (uResolution - scaled) * 0.5;
  return (uv * uResolution - offset) / scaled;
}
float noise(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float smoothNoise(vec2 p){
  vec2 i = floor(p); vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(noise(i), noise(i + vec2(1.0,0.0)), f.x),
             mix(noise(i + vec2(0.0,1.0)), noise(i + vec2(1.0,1.0)), f.x), f.y);
}

void main(){
  vec2 uv = vUv;
  float progress = uProgress;

  float brightnessPhase = smoothstep(0.8, 1.0, progress);
  float rimLightIntensity = 0.08 * (1.0 - brightnessPhase);
  float glassEdgeOpacity = 0.06 * (1.0 - brightnessPhase);

  vec2 center = vec2(0.5);
  vec2 p = uv * uResolution;
  vec2 uv1 = getCoverUV(uv, uTexture1Size);
  vec2 uv2Base = getCoverUV(uv, uTexture2Size);

  float maxRadius = length(uResolution) * 0.85;
  float bubbleRadius = progress * maxRadius;
  vec2 sphereCenter = center * uResolution;

  float dist = length(p - sphereCenter);
  float normalizedDist = dist / max(bubbleRadius, 0.001);
  vec2 direction = (dist > 0.0) ? (p - sphereCenter) / dist : vec2(0.0);
  float inside = smoothstep(bubbleRadius + 3.0, bubbleRadius - 3.0, dist);

  float distanceFactor = smoothstep(CLEAR_CENTER, 1.0, normalizedDist);
  float time = progress * 5.0;

  vec2 liquidSurface = vec2(
    smoothNoise(uv * 100.0 + time * 0.3),
    smoothNoise(uv * 100.0 + time * 0.2 + 50.0)
  ) - 0.5;
  liquidSurface *= SURFACE_RIPPLES * distanceFactor;

  vec2 distortedUV = uv2Base;
  if (inside > 0.0) {
    float refractionOffset = GLASS_STRENGTH * pow(distanceFactor, 1.5);
    vec2 flowDirection = normalize(direction + vec2(sin(time), cos(time * 0.7)) * 0.3);
    distortedUV -= flowDirection * refractionOffset;

    float wave1 = sin(normalizedDist * 22.0 - time * 3.5);
    float wave2 = sin(normalizedDist * 35.0 + time * 2.8) * 0.7;
    float wave3 = sin(normalizedDist * 50.0 - time * 4.2) * 0.5;
    float combinedWave = (wave1 + wave2 + wave3) / 3.0;

    float waveOffset = combinedWave * WAVE_DISTORTION * distanceFactor;
    distortedUV -= direction * waveOffset + liquidSurface;

    vec2 flowOffset = vec2(
      sin(time + normalizedDist * 10.0),
      cos(time * 0.8 + normalizedDist * 8.0)
    ) * LIQUID_FLOW * distanceFactor * inside;
    distortedUV += flowOffset;
  }

  vec4 newImg;
  if (inside > 0.0) {
    float aberration = CHROMATIC * pow(distanceFactor, 1.2);
    float r = texture2D(uTexture2, distortedUV + direction * aberration * 1.2).r;
    float g = texture2D(uTexture2, distortedUV + direction * aberration * 0.2).g;
    float b = texture2D(uTexture2, distortedUV - direction * aberration * 0.8).b;
    newImg = vec4(r, g, b, 1.0);
  } else {
    newImg = texture2D(uTexture2, uv2Base);
  }

  if (inside > 0.0 && rimLightIntensity > 0.0) {
    float rim = smoothstep(1.0 - RIM_WIDTH, 1.0, normalizedDist) *
                (1.0 - smoothstep(1.0, 1.01, normalizedDist));
    newImg.rgb += rim * rimLightIntensity;
    float edge = smoothstep(1.0 - EDGE_WIDTH, 1.0, normalizedDist) *
                 (1.0 - smoothstep(1.0, 1.01, normalizedDist));
    newImg.rgb = mix(newImg.rgb, vec3(1.0), edge * glassEdgeOpacity);
  }

  vec4 currentImg = texture2D(uTexture1, uv1);
  if (progress > 0.95) {
    vec4 pure = texture2D(uTexture2, uv2Base);
    newImg = mix(newImg, pure, (progress - 0.95) / 0.05);
  }
  gl_FragColor = mix(currentImg, newImg, inside);
}`;

/* power2.inOut, the CodePen's tween ease */
const ease = (t: number) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

type GL = WebGLRenderingContext;

function compile(gl: GL, type: number, src: string) {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

export default function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const first = useRef(true);
  /* the curtain's imperative handle, populated once WebGL is up */
  const api = useRef<{
    open: (from: string, to: string) => void;
    wipe: () => void;
  } | null>(null);

  /* ---- the curtain ---- */
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const canvas = document.createElement("canvas");
    canvas.className = "pt-curtain";
    canvas.setAttribute("aria-hidden", "true");
    const gl = (canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      premultipliedAlpha: false,
    }) ?? null) as GL | null;
    if (!gl) return;
    document.body.appendChild(canvas);

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    const prog = gl.createProgram();
    if (!vs || !fs || !prog) {
      canvas.remove();
      return;
    }
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      canvas.remove();
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const loc = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const u = {
      t1: gl.getUniformLocation(prog, "uTexture1"),
      t2: gl.getUniformLocation(prog, "uTexture2"),
      progress: gl.getUniformLocation(prog, "uProgress"),
      res: gl.getUniformLocation(prog, "uResolution"),
      s1: gl.getUniformLocation(prog, "uTexture1Size"),
      s2: gl.getUniformLocation(prog, "uTexture2Size"),
    };
    gl.uniform1i(u.t1, 0);
    gl.uniform1i(u.t2, 1);

    const mkTexture = () => {
      const t = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, t);
      /* the plates are not power-of-two, so clamp and skip mipmaps */
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      return t;
    };
    const tex1 = mkTexture();
    const tex2 = mkTexture();

    /* ---- route plates ---- */
    let displayFont = "900 120px Archivo, system-ui, sans-serif";
    const probe = document.createElement("span");
    probe.style.cssText = "position:absolute;visibility:hidden;font-family:var(--font-display)";
    document.body.appendChild(probe);
    const family = getComputedStyle(probe).fontFamily;
    probe.remove();
    if (family) displayFont = `900 120px ${family}`;

    const plate = document.createElement("canvas");
    const pctx = plate.getContext("2d");

    const drawPlate = (label: string) => {
      const w = Math.min(window.innerWidth, 1600);
      const h = Math.min(window.innerHeight, 1000);
      plate.width = w;
      plate.height = h;
      if (!pctx) return plate;
      pctx.fillStyle = "#070908";
      pctx.fillRect(0, 0, w, h);

      const glow = pctx.createRadialGradient(
        w * 0.32, h * 0.34, 0,
        w * 0.32, h * 0.34, Math.max(w, h) * 0.72,
      );
      glow.addColorStop(0, "rgba(191,255,0,0.16)");
      glow.addColorStop(0.5, "rgba(191,255,0,0.04)");
      glow.addColorStop(1, "rgba(191,255,0,0)");
      pctx.fillStyle = glow;
      pctx.fillRect(0, 0, w, h);

      /* the label is the point of the plate: it is what the bubble refracts,
         and it says where the reader is going */
      const size = Math.min(w * 0.11, 132);
      pctx.font = displayFont.replace("120px", `${Math.round(size)}px`);
      pctx.textAlign = "center";
      pctx.textBaseline = "middle";
      pctx.fillStyle = "#F2F2ED";
      pctx.fillText(label, w / 2, h / 2);

      const metrics = pctx.measureText(label);
      pctx.fillStyle = "#BFFF00";
      pctx.fillRect(
        w / 2 - metrics.width / 2,
        h / 2 + size * 0.72,
        metrics.width,
        Math.max(2, size * 0.022),
      );
      return plate;
    };

    const upload = (tex: WebGLTexture | null, label: string) => {
      const src = drawPlate(label);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
      return [src.width, src.height] as const;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(u.res, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    let progress = 0;
    const draw = () => {
      gl.uniform1f(u.progress, progress);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, tex1);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, tex2);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const open = (from: string, to: string) => {
      resize();
      const a = upload(tex1, from);
      gl.uniform2f(u.s1, a[0], a[1]);
      const b = upload(tex2, to);
      gl.uniform2f(u.s2, b[0], b[1]);
      progress = 0;
      draw();
      canvas.style.transitionDuration = `${FADE_IN}ms`;
      canvas.classList.add("on");
    };

    const wipe = () => {
      cancelAnimationFrame(raf);
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / WIPE);
        progress = ease(t);
        draw();
        if (t < 1) {
          raf = requestAnimationFrame(step);
          return;
        }
        canvas.style.transitionDuration = `${FADE_OUT}ms`;
        canvas.classList.remove("on");
      };
      raf = requestAnimationFrame(step);
    };

    api.current = { open, wipe };

    return () => {
      api.current = null;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      gl.deleteTexture(tex1);
      gl.deleteTexture(tex2);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      canvas.remove();
    };
  }, []);

  /* ---- run the wipe once the new route has rendered ---- */
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    window.scrollTo(0, 0);
    getLoco()?.resize?.();
    api.current?.wipe();
  }, [pathname]);

  /* ---- delegated navigation ----
     Content links stay plain <a href> so they remain crawlable and behave for
     middle-click and modifier-click; this upgrades an ordinary click into a
     router.push with the curtain in between. Hovering prefetches. */
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const internal = (a: HTMLAnchorElement | null) => {
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return null;
      const href = a.getAttribute("href") || "";
      if (!href || href.startsWith("#")) return null;
      let url: URL;
      try {
        url = new URL(a.href, location.href);
      } catch {
        return null;
      }
      if (url.origin !== location.origin) return null;
      if (url.pathname === location.pathname) return null;
      return url.pathname + url.search;
    };

    let navigating = false;
    let safety = 0;

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as
        | HTMLAnchorElement
        | null;
      const to = internal(a);
      if (!to || navigating) return;
      e.preventDefault();
      navigating = true;

      api.current?.open(labelFor(location.pathname), labelFor(to));
      window.setTimeout(() => router.push(to), FADE_IN);
      window.clearTimeout(safety);
      safety = window.setTimeout(() => {
        navigating = false;
        api.current?.wipe();
      }, SAFETY);
    };

    const clear = () => {
      navigating = false;
      window.clearTimeout(safety);
    };

    const onHover = (e: PointerEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href]") as
        | HTMLAnchorElement
        | null;
      const to = internal(a);
      if (to) router.prefetch(to);
    };

    document.addEventListener("click", onClick);
    document.addEventListener("pointerenter", onHover, true);
    return () => {
      clear();
      document.removeEventListener("click", onClick);
      document.removeEventListener("pointerenter", onHover, true);
    };
  }, [router, pathname]);

  return null;
}
