"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getLenis } from "@/lib/smooth";
import { GradientButton } from "@/components/ui/shader-button";

const LINKS = [
  { href: "/services", label: "Services" },
  { href: "/launch", label: "Launch" },
  { href: "/team", label: "Team" },
];

export default function Nav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
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

  const menuLinks = isHome ? LINKS : [{ href: "/", label: "Home" }, ...LINKS];

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
          <a className="mark" href={isHome ? "#home" : "/"}>
            CYPHERNAUT
          </a>
          <div className="navright">
            <nav className="navlinks">
              {LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
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
            <a href={l.href} style={{ transitionDelay: `${i * 40}ms` }}>
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
