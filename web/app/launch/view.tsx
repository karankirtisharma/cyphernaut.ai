"use client";

import { GradientButton } from "@/components/ui/shader-button";
import { usePageMotion } from "@/lib/motion";

export default function LaunchView() {
  usePageMotion();
  return (
    <>
      <main>
        <section className="phero">
          <div className="wrap">
            <p className="lbl crumb" data-rise>The launch lifecycle</p>
            <h1 className="dxl" data-rise style={{ '--d': '60ms', maxWidth: '14ch' }}>Then you launch.</h1>
            <p className="meas soft" data-rise style={{ '--d': '120ms' }}>Pre-launch, launch day, and the months that follow. Three phases, one team, no handover.</p>
          </div>
        </section>

        <section className="phase">
          <div className="wrap g12 phase-g">
            <div className="phase-art slot" data-rise>
              <div className="haze"></div>
              <div className="art">
                <span className="phase-shot" data-par="7" style={{ backgroundImage: 'url("/assets/peak-anticipation.webp")' }} />
              </div>
            </div>
            <div className="phase-copy">
              <p className="lbl lime" data-rise>Pre-launch</p>
              <h2 className="dl" data-rise style={{ '--d': '60ms' }}>Anticipation.</h2>
              <p data-rise style={{ '--d': '120ms' }}>In-depth market research and audience analysis so the messaging resonates with potential investors. Targeted campaigns and community engagement build the anticipation.</p>
            </div>
          </div>
        </section>

        <section className="phase phase-alt lit">
          <div className="wrap g12 phase-g">
            <div className="phase-art slot" data-rise>
              <div className="haze"></div>
              <div className="art">
                <span className="phase-shot" data-par="7" style={{ backgroundImage: 'url("/assets/peak-ignition.webp")' }} />
              </div>
            </div>
            <div className="phase-copy">
              <p className="lbl lime" data-rise>Launch day</p>
              <h2 className="dxl lime" data-rise style={{ '--d': '60ms' }}>Ignition.</h2>
              <div className="rule" data-rise style={{ '--d': '120ms' }}></div>
              <p data-rise style={{ '--d': '180ms' }}>Live events, AMAs and social media blitzes, timed to land together, so launch day creates excitement and engagement.</p>
            </div>
          </div>
        </section>

        <section className="phase">
          <div className="wrap g12 phase-g">
            <div className="phase-art slot" data-rise>
              <div className="haze"></div>
              <div className="art">
                <span className="phase-shot" data-par="7" style={{ backgroundImage: 'url("/assets/peak-momentum.webp")' }} />
              </div>
            </div>
            <div className="phase-copy">
              <p className="lbl lime" data-rise>Post-launch</p>
              <h2 className="dl" data-rise style={{ '--d': '60ms' }}>Momentum.</h2>
              <p data-rise style={{ '--d': '120ms' }}>Analytics-driven marketing, community engagement, influencer partnerships and ongoing content, so momentum holds after the launch.</p>
              <a className="ghost" href="/services" data-rise style={{ '--d': '180ms' }}>The twelve services<span aria-hidden="true">&#8599;</span></a>
            </div>
          </div>
        </section>

        <section className="sect" style={{ borderTop: '1px solid var(--hair)' }}>
          <div className="wrap">
            <h2 className="dl" data-rise style={{ maxWidth: '18ch' }}>What comes with it.</h2>
            <div className="tlist" style={{ marginTop: 'clamp(2.5rem,5vw,4rem)' }}>
              <div className="titem" data-rise style={{ borderTop: '0' }}><h3 className="dm">Increased visibility.</h3><p>Stand out in a crowded crypto landscape and reach the target audience.</p></div>
              <div className="titem" data-rise style={{ '--d': '60ms', borderTop: '0' }}><h3 className="dm">Investor confidence.</h3><p>Trust built through transparent communication and strategic marketing.</p></div>
              <div className="titem" data-rise style={{ '--d': '120ms' }}><h3 className="dm">Future-ready strategies.</h3><p>Solutions for tomorrow's challenges, not only today's.</p></div>
              <div className="titem" data-rise style={{ '--d': '180ms' }}><h3 className="dm">24/7 support.</h3><p>Round-the-clock assistance when it is needed.</p></div>
            </div>
            <p className="soft" data-rise style={{ '--d': '240ms', marginTop: 'clamp(2.5rem,5vw,4rem)', maxWidth: '46ch' }}>End to end. One team from the first announcement to the growth that follows.</p>
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
