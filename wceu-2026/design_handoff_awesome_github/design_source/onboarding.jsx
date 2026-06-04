/* Onboarding journey — the narrative page. Scrollspy rail + brand SVG diagrams. */
const CHAPTERS = [
  { id: "problem", n: "01", t: "The problem" },
  { id: "insight", n: "02", t: "The insight" },
  { id: "layers", n: "03", t: "The layers" },
  { id: "pivot", n: "04", t: "The pivot" },
  { id: "adopt", n: "05", t: "Adopt it" },
  { id: "horizon", n: "06", t: "The horizon" },
];

function Gloss({ term, nav, children }) {
  return <a className="gloss" onClick={() => nav({ view: "glossary", term })}>{children}</a>;
}

/* ── hub-and-spoke SVG ── */
function HubSpoke() {
  const spokes = [
    { x: 90, y: 60, l: "site-theme" },
    { x: 510, y: 60, l: "woo-shop" },
    { x: 60, y: 200, l: "client-a" },
    { x: 540, y: 200, l: "client-b" },
    { x: 200, y: 280, l: "plugin-x" },
    { x: 400, y: 280, l: "plugin-y" },
  ];
  return (
    <svg className="diagram" viewBox="0 0 600 320" role="img" aria-label="Hub and spoke: the .github repo at the centre distributes standards to many repositories.">
      {spokes.map((s, i) => (
        <line key={i} x1="300" y1="160" x2={s.x + 55} y2={s.y + 18} stroke="var(--border-strong)" strokeWidth="1.5" strokeDasharray="4 4" />
      ))}
      {spokes.map((s, i) => (
        <g key={"n" + i}>
          <rect x={s.x} y={s.y} width="110" height="36" rx="8" fill="var(--panel-2)" stroke="var(--hair)" />
          <text x={s.x + 55} y={s.y + 23} textAnchor="middle" className="mono" fontSize="12" fill="var(--fg-2)">{s.l}</text>
        </g>
      ))}
      <circle cx="300" cy="160" r="58" fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth="1.5" />
      <circle cx="300" cy="160" r="58" fill="none" stroke="var(--accent)" strokeWidth="1.5" opacity="0.35">
        <animate attributeName="r" values="58;72;58" dur="3.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.35;0;0.35" dur="3.5s" repeatCount="indefinite" />
      </circle>
      <text x="300" y="156" textAnchor="middle" className="mono" fontSize="15" fontWeight="600" fill="var(--accent)">.github</text>
      <text x="300" y="174" textAnchor="middle" className="node-label" fontSize="10" fill="var(--fg-2)">control plane</text>
    </svg>
  );
}

/* ── layer stack SVG (hooks over workflows) ── */
function LayerStack() {
  return (
    <svg className="diagram" viewBox="0 0 600 220" role="img" aria-label="Hooks layer describes what should happen; the workflow layer implements how, on GitHub Actions.">
      <g>
        <rect x="60" y="20" width="480" height="64" rx="10" fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth="1.5" />
        <text x="84" y="48" className="node-label" fontSize="15" fontWeight="700" fill="var(--accent)">Hooks layer</text>
        <text x="84" y="68" fontSize="12" fill="var(--fg-2)">Semantic intent — what should happen ("label new issues")</text>
      </g>
      <g stroke="var(--border-strong)" strokeWidth="1.5">
        <line x1="300" y1="84" x2="300" y2="116" markerEnd="url(#arr)" />
      </g>
      <defs>
        <marker id="arr" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto"><path d="M1 1 L8 5 L1 9" fill="none" stroke="var(--border-strong)" strokeWidth="1.5" /></marker>
      </defs>
      <text x="318" y="104" fontSize="11" className="mono" fill="var(--fg-3)">compiles to</text>
      <g>
        <rect x="60" y="118" width="480" height="64" rx="10" fill="var(--panel-2)" stroke="var(--hair)" strokeWidth="1.5" />
        <text x="84" y="146" className="node-label" fontSize="15" fontWeight="700" fill="var(--fg-1)">Workflow layer</text>
        <text x="84" y="166" fontSize="12" fill="var(--fg-2)">GitHub Actions implementation — how it runs, in CI</text>
      </g>
    </svg>
  );
}

function Onboarding({ nav, toast }) {
  const { branch } = React.useContext(window.BranchCtx);
  const [active, setActive] = useState("problem");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setProgress(max > 0 ? Math.min(100, (h.scrollTop / max) * 100) : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: "-30% 0px -60% 0px" });
    CHAPTERS.forEach((c) => { const el = document.getElementById(c.id); if (el) obs.observe(el); });
    return () => { window.removeEventListener("scroll", onScroll); obs.disconnect(); };
  }, []);

  const jump = (id) => { const el = document.getElementById(id); if (el) window.scrollTo({ top: el.offsetTop - 76, behavior: "smooth" }); };
  const copyClone = async () => { try { await navigator.clipboard.writeText(LSDATA.cloneCmd(branch)); toast("Copied clone command"); } catch {} };

  const blocks = [
    { cat: "instructions", t: "Instructions", d: "The standards Copilot must follow." },
    { cat: "agents", t: "Agents", d: "Scoped AI workers with rules." },
    { cat: "skills", t: "Skills", d: "Portable, reusable task recipes." },
    { cat: "workflows", t: "Workflows", d: "Reusable GitHub Actions." },
    { cat: "hooks", t: "Hooks", d: "Guardrails before code lands." },
    { cat: "tools", t: "Tools", d: "MCP servers and helpers." },
  ];

  return (
    <main>
      <div className="progress" style={{ width: progress + "%" }} />
      <section className="ob-hero">
        <div className="hero-grid-bg" />
        <div className="wrap inner">
          <span className="eyebrow">Onboarding · The .github control plane</span>
          <h1>One <code style={{ fontFamily: "var(--font-mono)", fontSize: ".72em", background: "var(--panel-2)", padding: "2px 10px", borderRadius: 8, border: "1px solid var(--hair)", color: "var(--accent)" }}>.github</code> repo<br />to <span className="hl">rule them all</span>.</h1>
          <p className="lead">From central governance to installable AI-ops plugins — why the repository exists, how it works, and how your team adopts it.</p>
          <div className="ob-meta">
            <span className="ob-tag"><Icons.bolt size={15} style={{ color: "var(--accent)" }} /> 6 chapters</span>
            <span className="ob-tag"><Icons.book size={15} style={{ color: "var(--accent)" }} /> ~10 min read</span>
            <span className="ob-tag"><Icons.github size={15} /> grounded in lightspeedwp/.github</span>
          </div>
        </div>
      </section>

      <div className="wrap ob-layout">
        <div className="ob-main">
          {/* 01 problem */}
          <section className="chapter" id="problem">
            <span className="ch-no">01 — Where it hurts</span>
            <h2>Drift, at agency scale</h2>
            <p>We run dozens of WordPress and WooCommerce repositories at once. Each one was born with good intentions — and then quietly drifted. Different review bars. Different definitions of "done". Different ideas about what Copilot should and shouldn't suggest.</p>
            <p>AI didn't fix that. It <strong>accelerated</strong> it. Every repo with its own ad-hoc prompts and conventions produces confident, inconsistent output faster than anyone can review. The bottleneck stopped being writing code and became <strong>trusting it</strong>.</p>
            <div className="callout"><span className="lbl">The question</span><p>What if consistency was something you <em>installed once</em>, instead of something you policed forever?</p></div>
          </section>

          {/* 02 insight */}
          <section className="chapter" id="insight">
            <span className="ch-no">02 — The mental model</span>
            <h2>A control plane, not a folder</h2>
            <p>GitHub hands every organisation one specially-named repository: <code>.github</code>. Its community-health files automatically become the <strong>default for every other repo</strong> in the org. We took that built-in mechanism and pushed it further — turning it into a <Gloss term="control-plane" nav={nav}>control plane</Gloss> for everything, including AI.</p>
            <p>It's a <Gloss term="hub-and-spoke" nav={nav}>hub-and-spoke</Gloss> model: one hub holds the <Gloss term="canonical-assets" nav={nav}>canonical assets</Gloss>, and every repository <Gloss term="repository-inheritance" nav={nav}>inherits</Gloss> them. Fix a standard once, in one place, and the whole fleet moves with it — no copy-paste, no drift.</p>
            <div className="figure"><HubSpoke /><div className="cap">One hub of truth; many repos inherit. Edit the centre, and the edges follow.</div></div>
            <div className="callout"><span className="lbl">Single source of truth</span><p>Every standard, template, and agent has exactly one authoritative home. There is no "which version is right?" because there is only one version.</p></div>
          </section>

          {/* 03 layers */}
          <section className="chapter" id="layers">
            <span className="ch-no">03 — What's inside</span>
            <h2>The building blocks</h2>
            <p>The repo isn't a monolith — it's a set of portable layers, each with a clear job. Every one is published as a catalogue on this site, so you can browse, copy, or install any piece on its own.</p>
            <div className="block-grid">
              {blocks.map((b) => (
                <a key={b.cat} className="block" onClick={() => nav({ view: "catalogue", cat: b.cat })}>
                  <span className="bi"><CatIco id={b.cat} size={18} /></span>
                  <span><b>{b.t}</b><span>{b.d}</span></span>
                </a>
              ))}
            </div>
            <p>The subtle move is how automation is split. The <Gloss term="hooks-layer" nav={nav}>hooks layer</Gloss> describes <em>what</em> should happen in plain, portable terms. The <Gloss term="workflow-layer" nav={nav}>workflow layer</Gloss> handles <em>how</em> — the GitHub Actions plumbing. <Gloss term="decoupling" nav={nav}>Decoupling</Gloss> the two means a hook can outlive the engine that runs it.</p>
            <div className="figure"><LayerStack /><div className="cap">Intent on top, mechanics below. Each evolves without breaking the other.</div></div>
          </section>

          {/* 04 pivot */}
          <section className="chapter" id="pivot">
            <span className="ch-no">04 — The turn</span>
            <h2>From governance to a plugin you install</h2>
            <p>Here's the shift that matters most. A control plane that only governs <em>your</em> org is useful. A control plane whose pieces are <Gloss term="portable-assets" nav={nav}>portable</Gloss> — packaged with a <Gloss term="manifest" nav={nav}>manifest</Gloss>, versioned, and <Gloss term="plugin-distribution" nav={nav}>distributable</Gloss> — becomes something else entirely: an <strong>installable AI-ops plugin pack</strong>.</p>
            <div className="pivot">
              <div className="state"><h5>Governance repo</h5><p>Standards that live in one org and are inherited by its repos.</p></div>
              <div className="arrow"><Icons.arrow size={26} /></div>
              <div className="state to"><h5>Installable plugin pack</h5><p>The same assets, packaged and versioned, ready to drop into any project.</p></div>
            </div>
            <p>Adoption stops requiring a fork or a hand-copy. You install a <Gloss term="plugin-pack" nav={nav}>plugin pack</Gloss> the way you'd install any dependency, and you get the agents, instructions, and guardrails with it.</p>
          </section>

          {/* 05 adopt */}
          <section className="chapter" id="adopt">
            <span className="ch-no">05 — Your turn</span>
            <h2>Adopt it in four steps</h2>
            <div style={{ background: "var(--panel-2)", border: "1px solid var(--hair)", borderRadius: "var(--radius-md)", padding: "14px 16px", margin: "0 0 20px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <span className="path-pill"><Icons.github size={15} /> {LSDATA.cloneCmd(branch)}</span>
              <button className="btn btn-soft btn-sm" onClick={copyClone}><Icons.copy size={14} /> Copy</button>
            </div>
            <div className="steps">
              {[
                { h: "Set the org default", p: <>Create a repo literally named <code>.github</code> in your org. GitHub treats it as the source of defaults for every other repo.</> },
                { h: "Pull in the LightSpeed assets", p: <>Copy the <code>instructions/</code>, <code>prompts/</code>, and <code>agents/</code> folders into your <code>.github/</code>. Inheritance is automatic — and your local files always win where they exist (your <Gloss term="inheritance-boundaries" nav={nav}>inheritance boundaries</Gloss>).</> },
                { h: "Load Copilot instructions", p: <>Install the org Copilot instructions from any catalogue card; Copilot now follows LightSpeed standards in that workspace.</> },
                { h: "Run your first review", p: <>Open a PR and trigger the <strong>Code reviewer</strong> agent for a ✅ / ⚠️ summary with inline, fixable comments.</> },
              ].map((s, i) => (
                <div className="step" key={i}><span className="num">{i + 1}</span><div><h4>{s.h}</h4><p>{s.p}</p></div></div>
              ))}
            </div>
            <div className="ob-cta">
              <a className="btn btn-primary" onClick={() => nav({ view: "catalogue", cat: "instructions" })}>Browse instructions <Icons.arrow size={16} /></a>
              <a className="btn btn-ghost" href={`https://github.com/${LSDATA.REPO}`} target="_blank" rel="noopener"><Icons.github size={16} /> Open the repository</a>
            </div>
          </section>

          {/* 06 horizon */}
          <section className="chapter" id="horizon">
            <span className="ch-no">06 — What's next</span>
            <h2>The horizon</h2>
            <p>The plugin-pack model points outward. The next step is aligning our skills with <Gloss term="wp-agent-skills" nav={nav}>WordPress Agent-Skills</Gloss> — a community standard for reusable AI capabilities — and keeping everything <Gloss term="gpl" nav={nav}>GPL-3.0</Gloss>, in step with WordPress itself. Governance that started inside one agency becomes something the wider ecosystem can install.</p>
            <div className="ack">
              <span className="ai"><Icons.sparkles size={20} /></span>
              <p>With thanks to <a href="https://github.com/github/awesome-copilot" target="_blank" rel="noopener">github/awesome-copilot</a> — the catalogue model that inspired the structure of this site. We've reframed it for WordPress agencies and the control-plane idea.</p>
            </div>
            <div className="ob-cta">
              <a className="btn btn-primary" onClick={() => nav({ view: "home" })}>Explore the catalogues <Icons.arrow size={16} /></a>
              <a className="btn btn-ghost" onClick={() => nav({ view: "glossary" })}><Icons.book size={16} /> Read the glossary</a>
            </div>
          </section>
        </div>

        <aside className="ob-rail">
          <p className="rail-title">On this page</p>
          <ol>
            {CHAPTERS.map((c) => (
              <li key={c.id}><a className={active === c.id ? "on" : ""} onClick={() => jump(c.id)}>{c.t}</a></li>
            ))}
          </ol>
        </aside>
      </div>
    </main>
  );
}

window.Onboarding = Onboarding;
