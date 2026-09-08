"use client";

import { GradientButton } from "@/components/ui/shader-button";
import { usePageMotion } from "@/lib/motion";

export default function BookView() {
  usePageMotion();
  return (
    <>
      <main>
        <section className="stage">
          <div id="spot"></div>
          <div className="stage-in">
            <p className="lbl soft">Contact</p>
            <h1 className="dxl" style={{ maxWidth: '18ch' }}>Ready when you are.</h1>
            <p>A 30-minute call about the project: what it is, where it is, and what a launch would take.</p>
            <div className="ringwrap">
              <svg className="ring" viewBox="0 0 260 260" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><circle cx="130" cy="130" r="120"></circle></svg>
              <GradientButton href="https://calendly.com/official-cyphernaut/30min" size="lg" id="magnet" target="_blank" rel="noopener">Book a call</GradientButton>
            </div>
          </div>
        </section>

        <section className="sect" style={{ borderTop: '1px solid var(--hair)', paddingTop: 'clamp(3rem,6vw,5rem)' }}>
          <div className="wrap">
            <p className="lbl soft" data-rise>The thirty minutes</p>
            <h2 className="dl" data-rise style={{ '--d': '60ms', maxWidth: '20ch', marginTop: '1.25rem' }}>What the call covers.</h2>
            <div className="covers">
              <div className="cover" data-rise>
                <p className="lbl k">What it is</p>
                <p className="ds">The project, in your words.</p>
              </div>
              <div className="cover" data-rise style={{ '--d': '70ms' }}>
                <p className="lbl k">Where it is</p>
                <p className="ds">Idea, pre-launch or live.</p>
              </div>
              <div className="cover" data-rise style={{ '--d': '140ms' }}>
                <p className="lbl k">What a launch would take</p>
                <p className="ds">The pillars the project needs.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="sect" id="channels" style={{ borderTop: '1px solid var(--hair)' }}>
          <div className="wrap g12 two">
            <h2 className="dl" data-rise style={{ maxWidth: '14ch' }}>Or reach us directly.</h2>
            <div className="bd">
              <div className="chan" data-rise style={{ '--d': '60ms' }}>
                <a href="mailto:official@cyphernaut.in">
                  <span className="k">Email</span>
                  <span className="v">official@cyphernaut.in</span>
                </a>
                <a href="https://wa.me/918655100003" target="_blank" rel="noopener">
                  <span className="k">WhatsApp</span>
                  <span className="v">+91 86551 00003</span>
                </a>
                <a href="tel:+918655100003">
                  <span className="k">Call</span>
                  <span className="v">+91 86551 00003</span>
                </a>
                <a href="https://www.instagram.com/cyphernaut.in/" target="_blank" rel="noopener">
                  <span className="k">Instagram</span>
                  <span className="v">cyphernaut.in</span>
                </a>
                <a href="https://www.linkedin.com/company/cyphernaut/" target="_blank" rel="noopener">
                  <span className="k">LinkedIn</span>
                  <span className="v">Cyphernaut</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
