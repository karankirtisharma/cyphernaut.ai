"use client";

import HeroScene from "@/components/hero/HeroScene";
import { LoopingWords } from "@/components/ui/looping-words";
import { GradientButton } from "@/components/ui/shader-button";
import { useHomeMotion } from "@/lib/motion";

export default function HomeView() {
  useHomeMotion();
  return (
    <>
      <div id="ground"></div>

      <main>
        <section className="act hero" id="home" data-act="1">
          <div className="herostage">
            <p className="hero-note hero-note-tr">
              EXPLORE<br />A SMARTER<br />LAUNCH JOURNEY
            </p>

            <div className="hero-visual">
              {/* Cards are DOM, not canvas planes: the reference needs exact
                  percentage positions, crisp small type, real backdrop glass and
                  an edge glow. All of them sit behind the astronaut, so a single
                  layer under the canvas reproduces the depth correctly. */}
              <div className="hero-cards" aria-hidden="true">
                <div className="hcard hcard-b" />
                <div className="hcard hcard-a">
                  <p>
                    STRATEGY<br />INNOVATION<br />GROWTH<br />EXECUTION
                  </p>
                </div>
                <div className="hcard hcard-d">
                  <span className="hcard-dots" />
                  <p className="hcard-name">CYPHERNAUT</p>
                  <p className="hcard-sub">// AI &amp; WEB3 STRATEGY</p>
                </div>
                <div className="hcard hcard-c">
                  <svg className="hcard-chart" viewBox="0 0 68 42">
                    <rect x="0" y="30" width="6" height="12" rx="1.4" />
                    <rect x="12" y="23" width="6" height="19" rx="1.4" />
                    <rect x="24" y="26" width="6" height="16" rx="1.4" />
                    <rect x="36" y="14" width="6" height="28" rx="1.4" />
                    <rect x="48" y="7" width="6" height="35" rx="1.4" />
                    <rect x="60" y="0" width="6" height="42" rx="1.4" />
                  </svg>
                  <p>
                    AI &amp; WEB3<br />STRATEGY<br />REAL<br />VALUE
                  </p>
                </div>
                <div className="hcard hcard-e">
                  <p>
                    BUILD<br />GROW<br />SCALE <i>&#8599;</i>
                  </p>
                </div>
              </div>

              <HeroScene className="hero-3d" />
            </div>

            <div className="heroinner">
              <div className="wrap">
                <div className="herocopy" data-hero-copy>
                  <p className="hero-eyebrow">
                    STRATEGY <i>&rsaquo;</i> INNOVATION <i>&rsaquo;</i> EXECUTION{" "}
                    <i>&rsaquo;</i> GROWTH
                  </p>
                  <h1 className="hero-h1">
                    <span className="hline"><span>EMPOWER</span></span>
                    <span className="hline"><span>AI &amp; WEB3</span></span>
                    <span className="hline"><span className="lime">SUCCESS.</span></span>
                  </h1>
                  <p className="hero-sub" data-hfade>
                    CYPHERNAUT empowers AI and Web3 projects through innovative
                    strategies and cutting-edge solutions.
                  </p>
                  <div className="hero-ctas" data-hfade>
                    <GradientButton href="/services" size="lg">
                      EXPLORE SERVICES <i className="gb-arrow">&#8599;</i>
                    </GradientButton>
                    <a className="hero-ghost" href="/book-a-call">
                      CONTACT US
                      <span className="hero-play" aria-hidden="true">&#9654;</span>
                    </a>
                  </div>
                </div>
                <dl className="hero-stats" data-hfade>
                  <div>
                    <dt>STRATEGY</dt>
                    <dd>AI &amp; WEB3 GROWTH</dd>
                  </div>
                  <div>
                    <dt>INNOVATION</dt>
                    <dd>CUTTING-EDGE SOLUTIONS</dd>
                  </div>
                  <div>
                    <dt>EXECUTION</dt>
                    <dd>FROM IDEA TO IMPACT</dd>
                  </div>
                </dl>
              </div>
            </div>

            <div className="hero-foot">
              <div className="hero-foot-l">
                <svg className="hero-globe" viewBox="0 0 48 48" aria-hidden="true">
                  <circle cx="24" cy="24" r="21" />
                  <ellipse cx="24" cy="24" rx="9" ry="21" />
                  <line x1="3" y1="24" x2="45" y2="24" />
                  <path d="M7 13c5 3 12 5 17 5s12-2 17-5" />
                  <path d="M7 35c5-3 12-5 17-5s12 2 17 5" />
                </svg>
                <span className="hero-note">SHIP<br />WITHOUT<br />LIMITS</span>
              </div>
              <div className="hero-rule" aria-hidden="true"><i /></div>
              <p className="hero-note hero-note-r">MORE<br />THAN<br />A SERVICE</p>
            </div>
          </div>
        </section>

        <section className="act" id="about" data-act="2">
          <div className="wrap g12">
            <div className="hd">
              <h2 className="dl" data-rise>A project nobody has heard of is a private project.</h2>
            </div>
            <div className="bd">
              <p className="meas" data-rise style={{ '--d': '70ms' }}>Cyphernaut builds, launches and grows AI and Web3 projects. Whether it is an AI product, the next memecoin or a DeFi platform, the work is the same: strategy tailored to the project, a launch that lands, and growth that holds.</p>
              <p className="meas" data-rise style={{ '--d': '140ms' }}>Every engagement is end to end. One experienced team carries the project through every step, from the first commit and the first announcement to the growth that follows, in a landscape, AI and on-chain alike, that does not sit still.</p>
              <p className="meas soft" data-rise style={{ '--d': '210ms' }}>End to end. One team from the first announcement to the growth that follows.</p>
            </div>
          </div>
        </section>

        <section className="act" id="services" data-act="3">
          <div className="gridbg"></div>
          <div className="wrap">
            <h2 className="dl" data-rise style={{ maxWidth: '20ch' }}>Everything a project needs.</h2>
            <div className="svc-head" data-rise style={{ '--d': '70ms' }}>
              <p className="soft">Fifteen services, five pillars, one team.</p>
              <a className="ghost" href="/services">All fifteen services<span aria-hidden="true">&#8599;</span></a>
            </div>

            <div className="bento">
              <div className="shell feat b1" data-iris data-card>
                <div className="core">
                  <div className="featart" aria-hidden="true"></div>
                  <div className="pname"><h3 className="dm">LAUNCH</h3></div>
                  <p style={{ maxWidth: '30ch' }}>From the first idea to launch day: the plan, the story, the drop.</p>
                  <div className="rows">
                    <button className="srow" type="button" aria-expanded="false">
                      <span className="srow-n">AI &amp; Crypto Launch Marketing</span>
                      <span className="vh" data-desc>Full-spectrum marketing that puts an AI product or a token in front of the right audience, from pre-launch buzz to post-launch growth.</span>
                      <span className="plus" aria-hidden="true"></span>
                    </button>
                    <button className="srow" type="button" aria-expanded="false">
                      <span className="srow-n">Tokenomics Strategy &amp; Design</span>
                      <span className="vh" data-desc>Sustainable tokenomics models that balance utility, scarcity and incentives to create long-term value for the project and its community. Analysis: in-depth market research. Modeling: sustainable, scalable distribution.</span>
                      <span className="plus" aria-hidden="true"></span>
                    </button>
                    <button className="srow" type="button" aria-expanded="false">
                      <span className="srow-n">NFT Project Promotion &amp; Strategy</span>
                      <span className="vh" data-desc>End-to-end NFT marketing, from pre-mint hype to post-launch community management, so the collection stands out in a crowded marketplace.</span>
                      <span className="plus" aria-hidden="true"></span>
                    </button>
                  </div>
                  <p className="detail" data-detail data-default="From the first idea to launch day: the plan, the story, the drop.">From the first idea to launch day: the plan, the story, the drop.</p>
                </div>
              </div>

              <div className="shell b2" data-wipe data-card style={{ '--d': '90ms' }}>
                <div className="core">
                  <div className="pname"><h3 className="dm">AMPLIFY</h3></div>
                  <p className="soft" style={{ maxWidth: '34ch' }}>The message, on every platform that matters.</p>
                  <div className="rows">
                    <button className="srow" type="button" aria-expanded="false">
                      <span className="srow-n">AI &amp; Web3 Campaigns</span>
                      <span className="vh" data-desc>Campaigns built for where these audiences actually gather: AI and developer communities, decentralized platforms and blockchain-native channels.</span>
                      <span className="plus" aria-hidden="true"></span>
                    </button>
                    <button className="srow" type="button" aria-expanded="false">
                      <span className="srow-n">Social Media Management &amp; Handling</span>
                      <span className="vh" data-desc>Social media across Twitter, Instagram, Discord, Reddit, LinkedIn and Telegram: engaging content that builds community and drives awareness.</span>
                      <span className="plus" aria-hidden="true"></span>
                    </button>
                    <button className="srow" type="button" aria-expanded="false">
                      <span className="srow-n">Content Marketing</span>
                      <span className="vh" data-desc>Articles, whitepapers, videos, tutorials and educational material that establish thought leadership and explain a model or a protocol plainly. Also shareable memecoin avatars and illustrations.</span>
                      <span className="plus" aria-hidden="true"></span>
                    </button>
                  </div>
                  <p className="detail" data-detail data-default="The message, on every platform that matters.">The message, on every platform that matters.</p>
                </div>
              </div>

              <div className="shell b3" data-wipe data-card style={{ '--d': '180ms' }}>
                <div className="core">
                  <div className="pname"><h3 className="dm">COMMUNITY</h3></div>
                  <p className="soft" style={{ maxWidth: '30ch' }}>The people around the project, kept close.</p>
                  <div className="rows">
                    <button className="srow" type="button" aria-expanded="false">
                      <span className="srow-n">Community Engagement Campaigns</span>
                      <span className="vh" data-desc>Targeted engagement campaigns, AMAs, contests, airdrops, giveaways and interactive events that build loyalty and growth.</span>
                      <span className="plus" aria-hidden="true"></span>
                    </button>
                    <button className="srow" type="button" aria-expanded="false">
                      <span className="srow-n">DAO / Community Server Management</span>
                      <span className="vh" data-desc>Discord, Telegram and other community platforms, with active moderation, engagement and governance for the DAO or community.</span>
                      <span className="plus" aria-hidden="true"></span>
                    </button>
                    <button className="srow" type="button" aria-expanded="false">
                      <span className="srow-n">AI &amp; Web3 Community Growth</span>
                      <span className="vh" data-desc>Community building from inception to scale: governance structures, incentive programs and sustainable growth strategies, on-chain or around a model.</span>
                      <span className="plus" aria-hidden="true"></span>
                    </button>
                  </div>
                  <p className="detail" data-detail data-default="The people around the project, kept close.">The people around the project, kept close.</p>
                </div>
              </div>

              <div className="shell b4" data-wipe data-card style={{ '--d': '270ms' }}>
                <div className="core">
                  <div className="pname"><h3 className="dm">REACH &amp; TRUST</h3></div>
                  <p className="soft" style={{ maxWidth: '30ch' }}>The voices, partners and press that make it credible.</p>
                  <div className="rows">
                    <button className="srow" type="button" aria-expanded="false">
                      <span className="srow-n">Influencer Outreach &amp; Campaigns</span>
                      <span className="vh" data-desc>Leading AI and crypto voices, YouTubers and thought leaders, through authentic partnerships and strategic collaborations.</span>
                      <span className="plus" aria-hidden="true"></span>
                    </button>
                    <button className="srow" type="button" aria-expanded="false">
                      <span className="srow-n">AI &amp; Blockchain Partnerships</span>
                      <span className="vh" data-desc>Strategic partnerships with AI labs, blockchain projects and DeFi protocols that expand reach and create mutual value.</span>
                      <span className="plus" aria-hidden="true"></span>
                    </button>
                    <button className="srow" type="button" aria-expanded="false">
                      <span className="srow-n">Reputation Management &amp; PR</span>
                      <span className="vh" data-desc>Strategic PR campaigns, crisis management and positive coverage in AI, crypto and mainstream outlets.</span>
                      <span className="plus" aria-hidden="true"></span>
                    </button>
                  </div>
                  <p className="detail" data-detail data-default="The voices, partners and press that make it credible.">The voices, partners and press that make it credible.</p>
                </div>
              </div>

              <div className="shell b5" data-wipe data-card style={{ '--d': '360ms' }}>
                <div className="core">
                  <div className="pname"><h3 className="dm">BUILD</h3></div>
                  <p className="soft" style={{ maxWidth: '34ch' }}>Production systems, owned end to end and built to scale.</p>
                  <div className="rows">
                    <button className="srow" type="button" aria-expanded="false">
                      <span className="srow-n">AI &amp; LLM Product Development</span>
                      <span className="vh" data-desc>Assistants, copilots, retrieval and agent workflows built on your own data, taken past the demo into production with evaluation, guardrails and monitoring in place.</span>
                      <span className="plus" aria-hidden="true"></span>
                    </button>
                    <button className="srow" type="button" aria-expanded="false">
                      <span className="srow-n">ERP, CRM &amp; Workflow Automation</span>
                      <span className="vh" data-desc>ERP and CRM rollouts, integrations across the tools already in use, and automations that run unattended: migrated, documented and handed over without downtime.</span>
                      <span className="plus" aria-hidden="true"></span>
                    </button>
                    <button className="srow" type="button" aria-expanded="false">
                      <span className="srow-n">Full-Stack Web &amp; Platform Engineering</span>
                      <span className="vh" data-desc>Sites, dashboards, dApps and internal platforms owned end to end, from the first wireframe to production, and built to hold as traffic and headcount grow.</span>
                      <span className="plus" aria-hidden="true"></span>
                    </button>
                  </div>
                  <p className="detail" data-detail data-default="Production systems, owned end to end and built to scale.">Production systems, owned end to end and built to scale.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="act" id="silence" data-act="4">
          {/* sticky in CSS, not pinned by ScrollTrigger — a pin-spacer would
              shift every section box the scroll film measures */}
          <div className="lw-stage">
            <p className="lw-lead" data-silence>
              Then you
            </p>
            <LoopingWords
              words={["launch.", "ship.", "scale.", "compound.", "last."]}
              trigger="#silence"
            />
          </div>
        </section>

        <section className="act" id="peak" data-act="5">
          <div className="peakstage">
            <div className="wrap g12 peakgrid">
              <div className="peakcoin">
                {/* keeps data-coin="peak" so the scroll film's existing scale
                    ramp still drives the stack */}
                <div className="peakshots" data-coin="peak" aria-hidden="true">
                  <div className="pshot pshot-0" />
                  <div className="pshot pshot-1" />
                  <div className="pshot pshot-2" />
                </div>
              </div>
              <div className="peakcopy">
                <div className="pstate" data-state="0">
                  <p className="lbl">Pre-launch</p>
                  <h3 className="dl">Anticipation.</h3>
                  <p>In-depth market research and audience analysis so the messaging resonates with potential investors. Targeted campaigns and community engagement build the anticipation.</p>
                </div>
                <div className="pstate" data-state="1">
                  <p className="lbl">Launch day</p>
                  <h2 className="dxl lime">
                    <span className="hline"><span data-ig>Ignition.</span></span>
                  </h2>
                  <p>Live events, AMAs and social media blitzes, timed to land together, so launch day creates excitement and engagement.</p>
                </div>
                <div className="pstate" data-state="2">
                  <p className="lbl">Post-launch</p>
                  <h3 className="dl">Momentum.</h3>
                  <p>Analytics-driven marketing, community engagement, influencer partnerships and ongoing content, so momentum holds after the launch.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="act" id="outcomes" data-act="6">
          <div className="gridbg"></div>
          <div className="wrap">
            <h2 className="dl" data-rise style={{ maxWidth: '18ch' }}>What comes with it.</h2>
            <div className="olist">
              <div className="oitem" data-rise><h3 className="dm">Increased visibility.</h3><p>Stand out in a crowded AI and crypto landscape and reach the target audience.</p></div>
              <div className="oitem" data-rise style={{ '--d': '60ms' }}><h3 className="dm">Investor confidence.</h3><p>Trust built through transparent communication and strategic marketing.</p></div>
              <div className="oitem" data-rise style={{ '--d': '120ms' }}><h3 className="dm">Future-ready strategies.</h3><p>Solutions for tomorrow's challenges, not only today's.</p></div>
              <div className="oitem" data-rise style={{ '--d': '180ms' }}><h3 className="dm">24/7 support.</h3><p>Round-the-clock assistance when it is needed.</p></div>
            </div>
          </div>
        </section>

        <section className="act" id="team" data-act="7">
          <div className="railstage">
            <div className="rail" data-rail>
              <div className="railitem railhead">
                <h2 className="dl">The crew.</h2>
              </div>
              <article className="railitem tcard">
                <div className="tphoto">
                  <img src="/assets/vasu.webp" width="800" height="1066" alt="Vasu Madaan" loading="lazy" decoding="async" />
                  <span className="tmul"></span><span className="tscrim"></span><span className="tedge"></span>
                </div>
                <h3 className="dm">Vasu Madaan</h3>
                <p className="lbl lime role">CEO &amp; Founder</p>
                <p className="line">Sets strategy and direction for every project and client.</p>
              </article>
              <article className="railitem tcard">
                <div className="tphoto">
                  <img src="/assets/parul.webp" width="800" height="1066" alt="Parul" loading="lazy" decoding="async" />
                  <span className="tmul"></span><span className="tscrim"></span><span className="tedge"></span>
                </div>
                <h3 className="dm">Parul</h3>
                <p className="lbl lime role">Design Specialist</p>
                <p className="line">Designs the visuals that carry the campaigns.</p>
              </article>
              <article className="railitem tcard">
                <div className="tphoto">
                  <img src="/assets/vivyaan.webp" width="800" height="1066" alt="Vivyaan" loading="lazy" decoding="async" />
                  <span className="tmul"></span><span className="tscrim"></span><span className="tedge"></span>
                </div>
                <h3 className="dm">Vivyaan</h3>
                <p className="lbl lime role">Tech Lead</p>
                <p className="line">Builds and integrates the technology behind each launch.</p>
              </article>
              <article className="railitem tcard">
                <div className="tphoto">
                  <img src="/assets/osmium.webp" width="800" height="1066" alt="Osmium" loading="lazy" decoding="async" />
                  <span className="tmul"></span><span className="tscrim"></span><span className="tedge"></span>
                </div>
                <h3 className="dm">Osmium</h3>
                <p className="lbl lime role">Manager</p>
                <p className="line">Runs daily operations and keeps the team on target.</p>
              </article>
              <div className="railitem railnote">
                <p>Four people. Every engagement, end to end.</p>
                <a className="ghost" href="/team" style={{ marginTop: '1.5rem' }}>Meet the crew<span aria-hidden="true">&#8599;</span></a>
              </div>
            </div>
          </div>
        </section>

        <section className="act" id="contact" data-act="8">
          <div className="closestage">
            <div id="spot"></div>
            <div className="closeinner">
              <h2 className="dl" style={{ maxWidth: '22ch' }}>Ready when you are.</h2>
              <p>A 30-minute call about the project: what it is, where it is, and what a launch would take.</p>
              <div id="ctawrap">
                <svg id="closering" viewBox="0 0 260 260" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><circle cx="130" cy="130" r="120"></circle></svg>
                <GradientButton href="/book-a-call" size="lg" id="magnet">Book a call</GradientButton>
              </div>
              <div className="channels lbl">
                <a href="mailto:official@cyphernaut.ai">official@cyphernaut.ai</a>
                <a href="https://wa.me/918655100003" target="_blank" rel="noopener">WhatsApp</a>
                <a href="tel:+918655100003">+91 86551 00003</a>
                <a href="https://www.instagram.com/cyphernaut.ai/" target="_blank" rel="noopener">Instagram</a>
                <a href="https://www.linkedin.com/company/cyphernaut/" target="_blank" rel="noopener">LinkedIn</a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
