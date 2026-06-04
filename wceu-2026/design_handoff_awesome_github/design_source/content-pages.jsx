/* Glossary + References content pages. */
function Glossary({ nav, term }) {
  const groups = LSGLOSSARY.GLOSSARY_GROUPS;
  const [q, setQ] = useState("");
  const [activeGroup, setActiveGroup] = useState(groups[0].id);

  // deep-link scroll
  useEffect(() => {
    if (term) {
      const el = document.getElementById("gl-" + term);
      if (el) { window.scrollTo({ top: el.offsetTop - 80, behavior: "smooth" }); el.classList.remove("flashme"); void el.offsetWidth; }
    } else { window.scrollTo({ top: 0 }); }
  }, [term]);

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActiveGroup(e.target.id.replace("glg-", "")); });
    }, { rootMargin: "-20% 0px -70% 0px" });
    groups.forEach((g) => { const el = document.getElementById("glg-" + g.id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  const termName = (slug) => {
    for (const g of groups) { const t = g.entries.find((e) => e.slug === slug); if (t) return t.term; }
    return slug;
  };

  const ql = q.trim().toLowerCase();
  const filterGroup = (g) => ({ ...g, entries: g.entries.filter((e) => !ql || (e.term + " " + e.def + " " + e.why).toLowerCase().includes(ql)) });
  const shown = groups.map(filterGroup).filter((g) => g.entries.length > 0);

  const jump = (id) => { const el = document.getElementById("glg-" + id); if (el) window.scrollTo({ top: el.offsetTop - 76, behavior: "smooth" }); };

  return (
    <main className="wrap">
      <div className="cat-hero" style={{ borderBottom: "none", paddingBottom: 8, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 32 }}>
        <div>
          <div className="crumb" style={{ marginTop: 28 }}><a onClick={() => nav({ view: "home" })}>Home</a> <span>/</span> <span>Glossary</span></div>
          <span className="eyebrow">Reference</span>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(30px,4.5vw,44px)", letterSpacing: "-.02em", margin: "8px 0 0", color: "var(--fg-1)" }}>Glossary</h1>
          <p style={{ color: "var(--fg-2)", fontSize: 17, lineHeight: 1.6, maxWidth: 600, marginTop: 12 }}>Plain-language definitions for the control-plane, GitHub, and AI-ops vocabulary used across this site. Every term notes why it matters here.</p>
          <label className="filter-input" style={{ maxWidth: 420, marginTop: 20 }}>
            <Icons.search size={17} style={{ color: "var(--fg-3)" }} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter terms…" />
          </label>
        </div>
        <img src="assets/wapuu-astropuu.png" alt="" aria-hidden="true" style={{ height: "clamp(100px, 12vw, 160px)", width: "auto", flex: "none", filter: "drop-shadow(0 12px 28px rgba(9,9,9,.18))", marginTop: 20 }} />
      </div>

      <div className="gl-layout">
        <nav className="gl-nav">
          {groups.map((g) => (
            <a key={g.id} className={activeGroup === g.id ? "on" : ""} onClick={() => jump(g.id)}>{g.label}</a>
          ))}
        </nav>
        <div>
          {shown.length === 0 && <div className="empty"><div className="ico"><Icons.search size={26} /></div><p style={{ color: "var(--fg-2)" }}>No terms match “{q}”.</p></div>}
          {shown.map((g) => (
            <section key={g.id} className="gl-group" id={"glg-" + g.id}>
              <h2>{g.label}</h2>
              <p className="gb">{g.blurb}</p>
              {g.entries.map((e) => (
                <div key={e.slug} className="gl-term" id={"gl-" + e.slug}>
                  <h3>{e.term}</h3>
                  <p className="def">{e.def}</p>
                  <p className="why"><b>Why it matters —</b> {e.why}</p>
                  {e.related && e.related.length > 0 && (
                    <div className="gl-related">
                      <span className="rl">See also</span>
                      {e.related.map((r) => <a key={r} onClick={() => nav({ view: "glossary", term: r })}>{termName(r)}</a>)}
                    </div>
                  )}
                </div>
              ))}
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}

function References({ nav }) {
  const groups = LSGLOSSARY.REFERENCE_GROUPS;
  const { branch } = React.useContext(window.BranchCtx);
  return (
    <main className="wrap-prose" style={{ paddingBottom: 64 }}>
      <div className="cat-hero" style={{ borderBottom: "none", paddingBottom: 8, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 32 }}>
        <div>
          <div className="crumb" style={{ marginTop: 28 }}><a onClick={() => nav({ view: "home" })}>Home</a> <span>/</span> <span>References</span></div>
          <span className="eyebrow">Reference</span>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(30px,4.5vw,44px)", letterSpacing: "-.02em", margin: "8px 0 0", color: "var(--fg-1)" }}>References</h1>
          <p style={{ color: "var(--fg-2)", fontSize: 17, lineHeight: 1.6, maxWidth: 620, marginTop: 12 }}>
            A map of the key files in <code style={{ fontFamily: "var(--font-mono)" }}>lightspeedwp/.github</code>. Links open the <code style={{ fontFamily: "var(--font-mono)", color: "var(--accent)" }}>{branch}</code> branch — switch in the top bar.
          </p>
        </div>
        <img src="assets/wapuu-rocket.svg" alt="" aria-hidden="true" style={{ height: "clamp(100px, 12vw, 160px)", width: "auto", flex: "none", filter: "drop-shadow(0 12px 28px rgba(9,9,9,.18))", marginTop: 20 }} />
      </div>

      <div style={{ paddingTop: 28 }}>
        {groups.map((g) => (
          <section key={g.id} className="ref-group">
            <h2>{g.label}</h2>
            <p className="gb">{g.blurb}</p>
            {g.items.map((it) => (
              <a key={it.p} className="ref-row" href={LSGLOSSARY.refUrl(it.p, branch, it.tree)} target="_blank" rel="noopener">
                <span className="path">{it.p}{it.tree ? "/" : ""}</span>
                <span className="desc">{it.d}</span>
                <span className="ext"><Icons.external size={16} /></span>
              </a>
            ))}
          </section>
        ))}
        <div className="ob-cta" style={{ marginTop: 28 }}>
          <a className="btn btn-primary" href={`https://github.com/${LSDATA.REPO}`} target="_blank" rel="noopener"><Icons.github size={16} /> Open the repository</a>
          <a className="btn btn-ghost" onClick={() => nav({ view: "glossary" })}><Icons.book size={16} /> Glossary</a>
        </div>
      </div>
    </main>
  );
}

Object.assign(window, { Glossary, References });
