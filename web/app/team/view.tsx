"use client";

import { GradientButton } from "@/components/ui/shader-button";
import { usePageMotion } from "@/lib/motion";

export default function TeamView() {
  usePageMotion();
  return (
    <>
      <main>
        <section className="phero">
          <div className="wrap">
            <p className="lbl crumb" data-rise>Team</p>
            <h1 className="dxl" data-rise style={{ '--d': '60ms', maxWidth: '12ch' }}>The crew.</h1>
            <p className="meas soft" data-rise style={{ '--d': '120ms' }}>Four people. Every engagement, end to end.</p>
          </div>
        </section>

        <section className="sect" style={{ paddingTop: '0' }}>
          <div className="wrap">
            <div className="crew">
              <article className="person" data-rise>
                <div className="tphoto">
                  <img src="/assets/vasu.webp" width="800" height="1066" alt="Vasu Madaan" loading="lazy" decoding="async" />
                  <span className="tmul"></span><span className="tscrim"></span><span className="tedge"></span>
                </div>
                <h2 className="dm">Vasu Madaan</h2>
                <p className="lbl lime role">CEO &amp; Founder</p>
                <p className="line">Sets strategy and direction for every project and client.</p>
              </article>
              <article className="person" data-rise style={{ '--d': '70ms' }}>
                <div className="tphoto">
                  <img src="/assets/parul.webp" width="800" height="1066" alt="Parul" loading="lazy" decoding="async" />
                  <span className="tmul"></span><span className="tscrim"></span><span className="tedge"></span>
                </div>
                <h2 className="dm">Parul</h2>
                <p className="lbl lime role">Design Specialist</p>
                <p className="line">Designs the visuals that carry the campaigns.</p>
              </article>
              <article className="person" data-rise style={{ '--d': '140ms' }}>
                <div className="tphoto">
                  <img src="/assets/vivyaan.webp" width="800" height="1066" alt="Vivyaan" loading="lazy" decoding="async" />
                  <span className="tmul"></span><span className="tscrim"></span><span className="tedge"></span>
                </div>
                <h2 className="dm">Vivyaan</h2>
                <p className="lbl lime role">Tech Lead</p>
                <p className="line">Builds and integrates the technology behind each launch.</p>
              </article>
              <article className="person" data-rise style={{ '--d': '210ms' }}>
                <div className="tphoto">
                  <img src="/assets/osmium.webp" width="800" height="1066" alt="Osmium" loading="lazy" decoding="async" />
                  <span className="tmul"></span><span className="tscrim"></span><span className="tedge"></span>
                </div>
                <h2 className="dm">Osmium</h2>
                <p className="lbl lime role">Manager</p>
                <p className="line">Runs daily operations and keeps the team on target.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="quiet">
          <div className="wrap g12 quiet-g">
            <h2 className="dl" data-rise style={{ maxWidth: '16ch' }}>One team, end to end.</h2>
            <div className="bd">
              <p className="meas" data-rise style={{ '--d': '60ms' }}>Every engagement is end to end. One experienced team guides the project through every step, from the first announcement to the growth that follows, in a blockchain landscape that does not sit still.</p>
              <p className="meas soft" data-rise style={{ '--d': '120ms' }}>End to end. One team from the first announcement to the growth that follows.</p>
              <a className="ghost" href="/services" data-rise style={{ '--d': '180ms' }}>What the team does<span aria-hidden="true">&#8599;</span></a>
            </div>
          </div>
        </section>

        <section className="band">
          <div className="wrap inner" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.75rem' }}>
            <h2 className="dl" data-rise style={{ maxWidth: '22ch' }}>Ready when you are.</h2>
            <p data-rise style={{ '--d': '60ms' }}>A 30-minute call about the project: what it is, where it is, and what a launch would take.</p>
            <GradientButton href="/book-a-call" size="lg" data-rise style={{ '--d': '120ms' }}>Book a call</GradientButton>
          </div>
        </section>
      </main>
    </>
  );
}
