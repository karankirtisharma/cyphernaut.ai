"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getLenis } from "@/lib/smooth";
import { GradientButton } from "@/components/ui/shader-button";

const LINKS = [
  /* native: / is the WebGL deck, a static file outside the app router, so this
     one needs a real navigation rather than a client-side push. Without it
     there was no way off /about and back to the site root at all. */
  { href: "/", label: "Home", native: true },
  { href: "/services", label: "Services" },
  { href: "/launch", label: "Launch" },
  { href: "/team", label: "Team" },
];

export default function Nav() {
  const pathname = usePathname();
  /* The Cyphernaut site now lives under /about — / is the WebGL entry page,
     which is a static file outside the app router. "Home" here means the page
     this nav belongs to, so every check below follows it. */
  /* trailingSlash is on in next.config, so usePathname() hands back "/about/".
     The old check compared against "/" — the one path with no trailing slash to
     differ on — which is why a bare equality worked there and not here. */
  const isHome = pathname.replace(/\/+$/, "") === "/about";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  /* the home page's nav is transparent until the hero is cleared */
  useEffect(() => {
    if (!isHome) return;
    const onScroll = () =>
      setScrolled(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  /* the drawer locks the page behind it */
  useEffect(() => {
    const lenis = getLenis();
    document.documentElement.style.overflow = open ? "hidden" : "";
    if (open) lenis?.stop();
    else lenis?.start();
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  /* close on route change */
  useEffect(() => setOpen(false), [pathname]);

  /* Escape closes it. Without this the only way out is the burger or picking a
     link, which leaves keyboard users with no way to dismiss and go nowhere. */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  /* "Home" is the deck at / and lives in LINKS. Off /about the Cyphernaut page
     needs its own way back, so it slots in behind Home as "About" — the name
     the deck's own nav uses for it — rather than a second "Home". */
  const menuLinks = isHome
    ? LINKS
    : [LINKS[0], { href: "/about", label: "About" }, ...LINKS.slice(1)];

  return (
    <>
      <header
        id="nav"
        className={[
          isHome ? "nav-hero" : "nav-solid",
          isHome && scrolled ? "on" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <div className="wrap">
          <a className="mark" href={isHome ? "#home" : "/about"}>
            CYPHERNAUT
          </a>
          <div className="navright">
            <nav className="navlinks">
              {LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  data-native={l.native ? "" : undefined}
                  aria-current={pathname === l.href ? "page" : undefined}
                >
                  {l.label}
                </a>
              ))}
            </nav>
            <GradientButton href="/book-a-call">Book a call</GradientButton>
            <button
              id="burger"
              className={open ? "on" : undefined}
              type="button"
              aria-label="Menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              <i />
              <i />
            </button>
          </div>
        </div>
      </header>

      <div id="menu" className={open ? "on" : undefined}>
        {menuLinks.map((l, i) => (
          <span key={l.href}>
            <a
              href={l.href}
              data-native={l.native ? "" : undefined}
              style={{ transitionDelay: `${i * 40}ms` }}
            >
              {l.label}
            </a>
          </span>
        ))}
        <span>
          <a
            href="/book-a-call"
            style={{ transitionDelay: `${menuLinks.length * 40}ms` }}
          >
            Book a call
          </a>
        </span>
      </div>
    </>
  );
}
