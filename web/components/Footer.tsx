"use client";

import { usePathname } from "next/navigation";

/* Brand marks are filled glyphs, drawn on a shared 24px grid so the row reads
   as one set rather than a pair of borrowed logos. */
const SOCIAL = [
  {
    label: "Discord",
    href: "https://discord.gg/TJdsdy2Pq",
    d: "M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.865-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.058a.082.082 0 0 0 .031.056 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.1 13.1 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .078-.011c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .079.01c.12.099.246.198.373.292a.077.077 0 0 1-.007.128c-.598.35-1.22.652-1.873.891a.077.077 0 0 0-.04.107c.36.698.772 1.363 1.225 1.993a.076.076 0 0 0 .084.029 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.055c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.029ZM8.02 15.331c-1.183 0-2.157-1.086-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.211 0 2.176 1.095 2.157 2.419 0 1.333-.956 2.419-2.157 2.419Zm7.975 0c-1.183 0-2.157-1.086-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.211 0 2.176 1.095 2.157 2.419 0 1.333-.946 2.419-2.157 2.419Z",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/cyphernaut/",
    d: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065Zm1.782 13.019H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z",
  },
];

export default function Footer() {
  const isHome = usePathname() === "/";

  return (
    <footer className="fzone">
      {/* the earth limb is the footer's ground plane: bottom-anchored so the
          glow lands under the wordmark at every width */}
      <div className="fzone-bg" aria-hidden="true" />
      <div className="fzone-veil" aria-hidden="true" />

      <div className="wrap fzone-in">
        <p className="fz-orbit">Ideas to impact</p>

        <div className="fz-top">
          <div className="fz-brand">
            <p className="fz-name">CYPHERNAUT</p>
            <p className="fz-tag">
              Software, marketing and community for AI and Web3 projects.
            </p>
            <ul className="fz-social">
              {SOCIAL.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={s.label}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d={s.d} />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
            <p className="fz-creed">
              Build <i>&#183;</i> Launch <i>&#183;</i> Grow <i>&#183;</i> Together
            </p>
          </div>

          <nav className="fz-links" aria-label="Footer">
            <p className="fz-lbl">Quick links</p>
            <a href={isHome ? "#home" : "/"}>Home</a>
            <a href="/services">Services</a>
            <a href="/launch">Launch</a>
            <a href="/team">Team</a>
            <a href="/book-a-call">Contact</a>
          </nav>

          <a className="fz-cta" href="/book-a-call">
            <span className="fz-cta-t">
              Let&#8217;s
              <br />
              build
              <br />
              something
              <br />
              bigger.
            </span>
            <svg className="fz-cta-a" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 17 17 7M8.5 7H17v8.5" />
            </svg>
          </a>
        </div>

        {/* aria-hidden: .fz-name above already carries the brand, so this
            oversized repeat would otherwise read out twice */}
        <p className="fmark" aria-hidden="true">
          CYPHERNAUT
        </p>

        <div className="fz-bot">
          <p className="fz-limits">
            Ship
            <br />
            without
            <br />
            limits
          </p>
          <div className="fz-bot-r">
            <p className="fz-copy">&#169; 2026 Cyphernaut. All rights reserved.</p>
            <p className="fz-disc">
              Strategy <i>/</i> Community <i>/</i> Execution <i>/</i> Growth
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
