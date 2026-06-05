/* Tools — the toolchain layer, as a sectioned reference page rather than a flat
   grid: AI default files, Scripts (grouped by area, with run commands), Schemas
   (paired with what they validate), and editor/config. Each section declares
   its own interaction type. */
function ToolSection({ id, title, intro, type, children }) {
  return (
    <section className="tool-sec" id={id}>
      <div className="tool-sec-head">
        <div>
          <h2>{title}</h2>
          <p>{intro}</p>
        </div>
        {type && (
          <div className="type-note compact">
            <TypeBadge type={type} />
            <span>{LSDATA.TYPES[type].note}</span>
          </div>
        )}
      </div>
      {children}
    </section>
  );
}

function Tools({ nav, toast }) {
  const aiDefaults = LSDATA.ITEMS.filter((i) => i.type === "aiDefault");
  const secNav = [
    { id: "ai-defaults", label: "AI defaults" },
    { id: "scripts", label: "Scripts" },
    { id: "schemas", label: "Schemas" },
    { id: "config", label: "Editor & config" },
  ];
  const jump = (id) => { const el = document.getElementById(id); if (el) window.scrollTo({ top: el.offsetTop - 76, behavior: "smooth" }); };

  return (
    <main>
      <div className="cat-hero">
        <div className="wrap">
          <div className="crumb"><a onClick={() => nav({ view: "home" })}>Home</a> <span>/</span> <span>Tools</span></div>
          <div className="tools-hero">
            <div>
              <span className="cat-ico" style={{ width: 52, height: 52 }}><SimpleIcon type="wrench" size={26} /></span>
              <div>
                <h1>Tools</h1>
                <p>The toolchain layer behind the catalogues — the AI defaults, scripts, schemas, and editor config that make everything else run. This is a reference, not a one-click install: each group tells you how it's actually used.</p>
              </div>
            </div>
            <img className="tools-wapuu" src="assets/wapuu-astropuu.png" alt="" aria-hidden="true" />
          </div>
          <div className="tool-secnav">
            {secNav.map((s) => <a key={s.id} onClick={() => jump(s.id)}>{s.label}</a>)}
          </div>
        </div>
      </div>

      <div className="wrap tools-body">
        <ToolSection id="ai-defaults" title="AI default files" type="aiDefault"
          intro="Default AI configuration that lives at your repository root — read automatically by Claude, Gemini, and the runners. Copy or download each into place; they are not VS Code customisations.">
          <div className="item-grid">
            {aiDefaults.map((it) => <ItemCard key={it.id} item={it} nav={nav} toast={toast} />)}
          </div>
        </ToolSection>

        <ToolSection id="scripts" title="Scripts" type="script"
          intro="What's available and how to run it. Scripts are grouped by area; many are paired with a schema that validates their inputs — that pairing is called out on each card.">
          {LSDATA.SCRIPTS.map((g) => (
            <div className="script-group" key={g.area}>
              <h3 className="script-area"><SimpleIcon type="terminal" size={16} /> {g.area}</h3>
              <div className="item-grid">
                {g.items.map((it) => <ItemCard key={it.id} item={it} nav={nav} toast={toast} />)}
              </div>
            </div>
          ))}
        </ToolSection>

        <ToolSection id="schemas" title="Schemas" type="schema"
          intro="The JSON schemas that validate every resource type. Scripts and schemas go hand-in-hand — each card names exactly what it validates.">
          <div className="item-grid">
            {LSDATA.SCHEMAS.map((it) => <ItemCard key={it.id} item={it} nav={nav} toast={toast} />)}
          </div>
        </ToolSection>

        <ToolSection id="config" title="Editor & config" type="script"
          intro="Cross-editor and environment configuration that keeps every workstation consistent.">
          <div className="item-grid">
            {LSDATA.CONFIG_TOOLS.map((it) => <ItemCard key={it.id} item={it} nav={nav} toast={toast} />)}
          </div>
        </ToolSection>
      </div>
    </main>
  );
}

window.Tools = Tools;
