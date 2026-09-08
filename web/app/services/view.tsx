"use client";

import { GradientButton } from "@/components/ui/shader-button";
import { usePageMotion } from "@/lib/motion";

export default function ServicesView() {
  usePageMotion();
  return (
    <>
      <main>
        <section className="phero">
          <div className="wrap g12 hero-g">
            <div className="hero-copy">
              <p className="lbl crumb" data-rise>Services</p>
              <h1 className="dxl" data-rise style={{ '--d': '60ms', maxWidth: '16ch' }}>Everything a project needs.</h1>
              <p className="meas soft" data-rise style={{ '--d': '120ms' }}>Fifteen services, five pillars, one team. Every engagement is end to end, from the first announcement to the growth that follows.</p>
            </div>
            <div className="hero-art slot" data-rise style={{ '--d': '180ms' }}>
              <div className="haze"></div>
              <div className="art">
                <span
                  className="hero-art-shot"
                  data-par="6"
                  role="img"
                  aria-label="A gloved hand holding a glowing Cyphernaut token"
                  style={{ backgroundImage: 'url("/assets/services-hand.webp")' }}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="sect" id="launch" style={{ paddingTop: '0' }}>
          <div className="wrap">
            <div className="pillar g12" style={{ borderTop: '0' }}>
              <div className="pillar-head">
                <div className="shell feat" data-rise>
                  <div className="core">
                    <h2 className="dm">LAUNCH</h2>
                    <p style={{ fontSize: '1.125rem' }}>From the first idea to launch day: the plan, the story, the drop.</p>
                    <div className="launch-note">
                      <span className="pill-note" style={{ borderColor: 'rgba(10,12,8,.25)', color: 'rgba(10,12,8,.75)' }}>Featured pillar</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pillar-body">
                <article className="svc" data-rise>
                  <h4 className="ds">AI &amp; Crypto Launch Marketing</h4>
                  <p>Full-spectrum marketing that puts an AI product or a token in front of the right audience, from pre-launch buzz to post-launch growth.</p>
                </article>
                <article className="svc" data-rise style={{ '--d': '60ms' }}>
                  <h4 className="ds">Tokenomics Strategy &amp; Design</h4>
                  <p>Sustainable tokenomics models that balance utility, scarcity and incentives to create long-term value for the project and its community. Analysis: in-depth market research. Modeling: sustainable, scalable distribution.</p>
                </article>
                <article className="svc" data-rise style={{ '--d': '120ms' }}>
                  <h4 className="ds">NFT Project Promotion &amp; Strategy</h4>
                  <p>End-to-end NFT marketing, from pre-mint hype to post-launch community management, so the collection stands out in a crowded marketplace.</p>
                </article>
              </div>
            </div>

            <div className="pillar g12" id="amplify">
              <div className="pillar-head">
                <h2 className="dl" data-rise>Amplify</h2>
                <p className="soft" data-rise style={{ '--d': '60ms', maxWidth: '30ch' }}>The message, on every platform that matters.</p>
              </div>
              <div className="pillar-body">
                <article className="svc" data-rise>
                  <h4 className="ds">AI &amp; Web3 Campaigns</h4>
                  <p>Campaigns built for where these audiences actually gather: AI and developer communities, decentralized platforms and blockchain-native channels.</p>
                </article>
                <article className="svc" data-rise style={{ '--d': '60ms' }}>
                  <h4 className="ds">Social Media Management &amp; Handling</h4>
                  <p>Social media across Twitter, Instagram, Discord, Reddit, LinkedIn and Telegram: engaging content that builds community and drives awareness.</p>
                </article>
                <article className="svc" data-rise style={{ '--d': '120ms' }}>
                  <h4 className="ds">Content Marketing</h4>
                  <p>Articles, whitepapers, videos, tutorials and educational material that establish thought leadership and explain a model or a protocol plainly. Also shareable memecoin avatars and illustrations.</p>
                </article>
              </div>
            </div>

            <div className="pillar g12" id="community">
              <div className="pillar-head">
                <h2 className="dl" data-rise>Community</h2>
                <p className="soft" data-rise style={{ '--d': '60ms', maxWidth: '30ch' }}>The people around the project, kept close.</p>
              </div>
              <div className="pillar-body">
                <article className="svc" data-rise>
                  <h4 className="ds">Community Engagement Campaigns</h4>
                  <p>Targeted engagement campaigns, AMAs, contests, airdrops, giveaways and interactive events that build loyalty and growth.</p>
                </article>
                <article className="svc" data-rise style={{ '--d': '60ms' }}>
                  <h4 className="ds">DAO / Community Server Management</h4>
                  <p>Discord, Telegram and other community platforms, with active moderation, engagement and governance for the DAO or community.</p>
                </article>
                <article className="svc" data-rise style={{ '--d': '120ms' }}>
                  <h4 className="ds">AI &amp; Web3 Community Growth</h4>
                  <p>Community building from inception to scale: governance structures, incentive programs and sustainable growth strategies, on-chain or around a model.</p>
                </article>
              </div>
            </div>

            <div className="pillar g12" id="reach">
              <div className="pillar-head">
                <h2 className="dl" data-rise style={{ maxWidth: '12ch' }}>Reach &amp; trust</h2>
                <p className="soft" data-rise style={{ '--d': '60ms', maxWidth: '30ch' }}>The voices, partners and press that make it credible.</p>
              </div>
              <div className="pillar-body">
                <article className="svc" data-rise>
                  <h4 className="ds">Influencer Outreach &amp; Campaigns</h4>
                  <p>Leading AI and crypto voices, YouTubers and thought leaders, through authentic partnerships and strategic collaborations.</p>
                </article>
                <article className="svc" data-rise style={{ '--d': '60ms' }}>
                  <h4 className="ds">AI &amp; Blockchain Partnerships</h4>
                  <p>Strategic partnerships with AI labs, blockchain projects and DeFi protocols that expand reach and create mutual value.</p>
                </article>
                <article className="svc" data-rise style={{ '--d': '120ms' }}>
                  <h4 className="ds">Reputation Management &amp; PR</h4>
                  <p>Strategic PR campaigns, crisis management and positive coverage in AI, crypto and mainstream outlets.</p>
                </article>
              </div>
            </div>

            <div className="pillar g12" id="build">
              <div className="pillar-head">
                <h2 className="dl" data-rise style={{ maxWidth: '12ch' }}>Build</h2>
                <p className="soft" data-rise style={{ '--d': '60ms', maxWidth: '30ch' }}>The product itself, engineered and shipped.</p>
              </div>
              <div className="pillar-body">
                <article className="svc" data-rise>
                  <h4 className="ds">AI &amp; LLM Product Development</h4>
                  <p>Assistants, copilots, retrieval and agent workflows built on your own data and integrated into a working product rather than left in a demo.</p>
                </article>
                <article className="svc" data-rise style={{ '--d': '60ms' }}>
                  <h4 className="ds">ERP, CRM &amp; Workflow Automation</h4>
                  <p>ERP and CRM implementation, integrations between the tools already in use, and automations that take the repetitive work off the team.</p>
                </article>
                <article className="svc" data-rise style={{ '--d': '120ms' }}>
                  <h4 className="ds">Full-Stack Web &amp; Platform Engineering</h4>
                  <p>Sites, dashboards, dApps and internal platforms, designed and shipped end to end, from the first wireframe to production.</p>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section className="next">
          <div className="wrap g12 next-g">
            <div className="next-copy">
              <h2 className="dl" data-rise>Then you launch.</h2>
              <p className="meas soft" data-rise style={{ '--d': '60ms' }}>Pre-launch, launch day, and the months that follow. The lifecycle page walks through what each phase looks like.</p>
              <a className="ghost" href="/launch" data-rise style={{ '--d': '120ms' }}>The launch lifecycle<span aria-hidden="true">&#8599;</span></a>
            </div>
            <div className="next-art" data-rise style={{ '--d': '180ms' }}>
              <div className="haze"></div>
              <span
                className="next-shot"
                role="img"
                aria-label="A Cyphernaut rocket under thrust"
                data-par="5"
              />
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
