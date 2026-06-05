/* Views: Home + Catalogue. Shared item card. */
function catMeta(id) { return LSDATA.CATEGORIES.find((c) => c.id === id) || {}; }
function itemsIn(id) { return LSDATA.ITEMS.filter((it) => it.cat === id); }
function CatIco({ id, size }) {
  const m = catMeta(id);
  return <SimpleIcon type={m.icon || "layers"} size={size} />;
}

/* Type-aware copy: scripts copy their run command, embedded items copy their
   body, everything else copies a branch-aware raw URL (honest — we link to the
   real file rather than faking its contents). */
function itemCopyText(item, u) {
  if (item.type === "script" && item.run) return item.run;
  if (item.body) return item.body;
  return u.raw;
}
function copyToastFor(item) {
  if (item.type === "script") return "Copied run command";
  if (item.body) return "Copied to clipboard";
  return "Copied raw file URL";
}

/* The right set of actions for an item, by type. Used on cards (compact) and
   surfaces the install matrix consistently. */
function ItemActions({ item, toast, compact }) {
  const { branch } = React.useContext(window.BranchCtx);
  const u = LSDATA.urlsFor(item, branch);
  const sz = compact ? "btn-sm" : "";
  const stop = (e) => e.stopPropagation();
  const doCopy = async (e) => {
    stop(e);
    try { await navigator.clipboard.writeText(itemCopyText(item, u)); toast(copyToastFor(item)); }
    catch { toast("Copy failed — open the file instead"); }
  };
  const t = item.type;
  const copyLabel = t === "script" ? "Copy command" : "Copy";
  return (
    <React.Fragment>
      <button className={"btn btn-soft " + sz} onClick={doCopy}><SimpleIcon type="copy" size={15} /> {copyLabel}</button>
      {t === "install" && !item.tree && (
        <a className={"btn btn-ghost " + sz} href={u.vscode} onClick={stop}><SimpleIcon type="vscode" size={15} /> Install</a>
      )}
      {t === "aiDefault" && (
        <a className={"btn btn-ghost " + sz} href={u.raw} target="_blank" rel="noopener" onClick={stop}><SimpleIcon type="download" size={15} /> Raw</a>
      )}
      {t === "pack" && (
        <a className={"btn btn-ghost " + sz} href={u.blob} target="_blank" rel="noopener" onClick={stop}><SimpleIcon type="puzzle" size={15} /> Open pack</a>
      )}
      {(t === "workflow" || t === "guardrail" || t === "schema" || t === "script") && (
        <a className={"btn btn-ghost " + sz} href={u.blob} target="_blank" rel="noopener" onClick={stop}><SimpleIcon type="github" size={15} /> View</a>
      )}
    </React.Fragment>
  );
}

function TypeBadge({ type }) {
  const m = LSDATA.TYPES[type];
  if (!m) return null;
  return <span className={"type-badge tb-" + type}>{m.badge}</span>;
}

function ItemCard({ item, nav, toast }) {
  const t = item.type;
  return (
    <article className="item-card" onClick={() => nav({ view: "item", id: item.id })}>
      <div className="item-top">
        <span className="item-mark"><CatIco id={item.cat} size={18} /></span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3>{item.name}</h3>
          <div className="meta-row">
            <TypeBadge type={t} />
            {item.duration && <span className="meta"><SimpleIcon type="clock" size={12} /> {item.duration}</span>}
            {item.validates && <span className="meta">validates {item.validates}</span>}
            {item.dest && <span className="meta">→ {item.dest}</span>}
            {!item.duration && !item.validates && !item.dest && <span className="meta">{item.version} · {item.updated}</span>}
          </div>
        </div>
      </div>
      <p>{item.description}</p>
      {item.run && <code className="run-pill">{item.run}</code>}
      <div className="item-tags">
        {item.tags.slice(0, 4).map((t) => <span key={t} className="tag">{t}</span>)}
      </div>
      <div className="item-actions">
        <ItemActions item={item} toast={toast} compact />
        <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4, color: "var(--fg-3)", fontSize: 13, fontWeight: 600 }}>
          Open <SimpleIcon type="arrow" size={15} />
        </span>
      </div>
    </article>
  );
}

function Home({ nav }) {
  return (
    <main>
      <section className="hero">
        <div className="hero-grid-bg" />
        <div className="wrap hero-inner">
          <span className="repo-chip"><span className="dot" /> github.com/{LSDATA.REPO}</span>
          <h1>Install AI governance,<br /><span className="hl">not opinions.</span></h1>
          <p className="lead">
            One <code style={{ fontFamily: "var(--font-mono)", fontSize: ".82em", background: "var(--panel-2)", padding: "2px 7px", borderRadius: 6, border: "1px solid var(--hair)" }}>.github</code> repository
            governs every LightSpeed repo. Browse and grab the agents, instructions, prompts, skills, and workflows
            we use to ship WordPress &amp; WooCommerce work — then learn how it all fits together, at your own pace.
          </p>
          <div className="hero-cta">
            <a className="btn btn-primary" onClick={() => nav({ view: "onboarding" })}>Start here <SimpleIcon type="arrow" size={16} /></a>
            <a className="btn btn-ghost" href="#catalogues" onClick={(e) => { e.preventDefault(); const el = document.getElementById("catalogues"); if (el) window.scrollTo({ top: el.offsetTop - 60, behavior: "smooth" }); }}>Browse catalogues</a>
          </div>
          <div className="stats">
            <div className="stat"><div className="n">8</div><div className="l">catalogues</div></div>
            <div className="stat"><div className="n">{LSDATA.ITEMS.filter((i) => i.cat === "prompts").length}</div><div className="l">ready-to-grab prompts</div></div>
            <div className="stat"><div className="n">10</div><div className="l">learning lessons</div></div>
            <div className="stat"><div className="n">1</div><div className="l">control plane</div></div>
          </div>
        </div>
      </section>

      <section className="section" id="catalogues">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="eyebrow">Browse resources</span>
              <h2>Eight catalogues, one source of truth</h2>
            </div>
            <p>Every resource maps to a real file in the <code style={{ fontFamily: "var(--font-mono)" }}>.github</code> repo. Pick a catalogue to filter and install.</p>
          </div>
          <div className="cat-grid">
            {LSDATA.CATEGORIES.map((c) => {
              const n = itemsIn(c.id).length;
              return (
                <a key={c.id} className="cat-card" onClick={() => nav({ view: "catalogue", cat: c.id })}>
                  <span className="cat-ico"><CatIco id={c.id} size={20} /></span>
                  <h3>{c.label}<span className="count">{n}</span></h3>
                  <p>{c.blurb}</p>
                  <span className="go">Explore <SimpleIcon type="arrow" size={14} /></span>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--panel-2)", borderTop: "1px solid var(--hair)", borderBottom: "1px solid var(--hair)" }}>
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="eyebrow">Why a control plane</span>
              <h2>Consistency you install once</h2>
            </div>
          </div>
          <div className="feat-grid">
            <div className="feat">
              <span className="fi"><SimpleIcon type="layers" size={20} /></span>
              <h4>Inherited by every repo</h4>
              <p>Issue templates, Copilot instructions, and labels defined here are surfaced across every LightSpeed repository automatically — no copy-paste drift.</p>
            </div>
            <div className="feat">
              <span className="fi"><SimpleIcon type="bolt" size={20} /></span>
              <h4>One-click install</h4>
              <p>Copy the raw file, or push it straight into VS Code as a Copilot customisation. Every card carries the same install actions.</p>
            </div>
            <div className="feat">
              <span className="fi"><SimpleIcon type="shield" size={20} /></span>
              <h4>Governed &amp; versioned</h4>
              <p>Each resource is frontmatter-validated and versioned. Standards change in one place, and the whole team moves together.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="cook-learn-grid">
            <a className="cl-card" onClick={() => nav({ view: "learn" })}>
              <img src="assets/wapuu-yoduu.png" alt="" aria-hidden="true" />
              <div>
                <span className="eyebrow">Learning Centre</span>
                <h3>Learn it at your own pace</h3>
                <p>Short, self-paced tracks built from the real governance docs — read straight through or dip into the lesson you need. We keep your place.</p>
                <span className="go">Open the Learning Centre <SimpleIcon type="arrow" size={14} /></span>
              </div>
            </a>
            <a className="cl-card" onClick={() => nav({ view: "cookbook" })}>
              <img src="assets/wapuu-rocket.svg" alt="" aria-hidden="true" />
              <div>
                <span className="eyebrow">Cookbook</span>
                <h3>Follow a recipe</h3>
                <p>Battle-tested, step-by-step playbooks for planning, spec-driven delivery, and shipping WordPress plugins. Read and copy.</p>
                <span className="go">Browse recipes <SimpleIcon type="arrow" size={14} /></span>
              </div>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

function Catalogue({ cat, nav, toast }) {
  const meta = catMeta(cat);
  const all = itemsIn(cat);
  const [query, setQuery] = useState("");
  const [activeTags, setActiveTags] = useState([]);

  const allTags = React.useMemo(() => {
    const s = new Set();
    all.forEach((it) => it.tags.forEach((t) => s.add(t)));
    return [...s].sort();
  }, [cat]);

  const filtered = all.filter((it) => {
    const q = query.trim().toLowerCase();
    const matchQ = !q || (it.name + " " + it.description + " " + it.tags.join(" ")).toLowerCase().includes(q);
    const matchT = activeTags.length === 0 || activeTags.every((t) => it.tags.includes(t));
    return matchQ && matchT;
  });

  const toggleTag = (t) => setActiveTags((a) => a.includes(t) ? a.filter((x) => x !== t) : [...a, t]);

  return (
    <main>
      <div className="cat-hero">
        <div className="wrap">
          <div className="crumb">
            <a onClick={() => nav({ view: "home" })}>Home</a> <span>/</span> <span>{meta.label}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span className="cat-ico" style={{ width: 52, height: 52 }}><CatIco id={cat} size={26} /></span>
            <div>
              <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px,3.4vw,40px)", letterSpacing: "-.02em", margin: 0, color: "var(--fg-1)" }}>{meta.label}</h1>
              <p style={{ color: "var(--fg-2)", margin: "4px 0 0", maxWidth: 620 }}>{meta.blurb}</p>
            </div>
          </div>
          {LSDATA.TYPES[meta.type] && (
            <div className="type-note">
              <TypeBadge type={meta.type} />
              <span>{LSDATA.TYPES[meta.type].note}</span>
            </div>
          )}
          <div className="cat-toolbar">
            <label className="filter-input">
              <span style={{ color: "var(--fg-3)", display: "flex" }}><SimpleIcon type="search" size={17} /></span>
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={`Filter ${all.length} ${meta.label.toLowerCase()}…`} />
            </label>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--fg-3)" }}>{filtered.length} / {all.length}</span>
          </div>
          {allTags.length > 0 && (
            <div className="tag-row" style={{ paddingBottom: 18 }}>
              {allTags.map((t) => (
                <span key={t} className={"chip" + (activeTags.includes(t) ? " on" : "")} onClick={() => toggleTag(t)}>{t}</span>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="wrap">
        {filtered.length === 0 ? (
          <div className="empty">
            <div className="ico"><SimpleIcon type="search" size={26} /></div>
            <p style={{ fontSize: 16, color: "var(--fg-2)", margin: 0 }}>No {meta.label.toLowerCase()} match your filter.</p>
            <button className="btn btn-ghost btn-sm" style={{ marginTop: 16 }} onClick={() => { setQuery(""); setActiveTags([]); }}>Clear filters</button>
          </div>
        ) : (
          <div className="item-grid">
            {filtered.map((it) => <ItemCard key={it.id} item={it} nav={nav} toast={toast} />)}
          </div>
        )}
      </div>
    </main>
  );
}

Object.assign(window, { Home, Catalogue, ItemCard, ItemActions, TypeBadge, CatIco, catMeta, itemsIn });
