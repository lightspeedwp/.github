/* Item detail (GitHub-style file view + install sidebar), Getting started, Why. */
function ItemDetail({ id, nav, toast }) {
  const item = LSDATA.ITEMS.find((it) => it.id === id);
  const { branch } = React.useContext(window.BranchCtx);
  const [mode, setMode] = useState("render");
  if (!item) {
    return (
      <main className="wrap" style={{ padding: "80px 24px" }}>
        <div className="empty"><div className="ico"><Icons.close size={26} /></div>
          <p style={{ fontSize: 16, color: "var(--fg-2)" }}>That resource could not be found.</p>
          <button className="btn btn-primary btn-sm" style={{ marginTop: 12 }} onClick={() => nav({ view: "home" })}>Back home</button>
        </div>
      </main>
    );
  }
  const meta = catMeta(item.cat);
  const u = LSDATA.urlsFor(item, branch);
  const synth = () => {
    if (item.body) return item.body;
    if (item.type === "script") {
      return `# ${item.name}\n\n${item.description}\n\n## Run it\n\n\`\`\`bash\n${item.run || "node " + item.path}\n\`\`\`\n\n${item.validates ? `> Validates **${item.validates}** — pairs with the matching schema in \`schema/\`.\n\n` : ""}**Path** — \`${item.path}\``;
    }
    if (item.type === "schema") {
      return `# ${item.name}\n\n${item.description}\n\n> **Validates** — ${item.validates}. This schema goes hand-in-hand with the scripts that read it; see the Scripts section of Tools.\n\n**Path** — \`${item.path}\``;
    }
    if (item.type === "aiDefault") {
      return `# ${item.name}\n\n${item.description}\n\n> **Where it goes** — drop this file into your repository root. It's a default AI configuration, read automatically by your AI tooling — not a VS Code customisation.\n\n**Path** — \`${item.path}\``;
    }
    if (item.type === "workflow") {
      return `# ${item.name}\n\n${item.description}\n\n## Two layers\n\nThis is a **portable spec** — it describes *what* the workflow automates in plain terms. The runnable **GitHub Action** (\`${item.action}\`) is the *how*.\n\n- Copy the spec into \`workflows/\` to adopt the process.\n- Reference the Action with \`uses:\` to run it in CI.\n\n${item.duration ? `**Typical duration** — ${item.duration}\n\n` : ""}**Spec** — \`${item.path}\``;
    }
    return `# ${item.name}\n\n${item.description}\n\n> This resource lives in the \`.github\` repository. Open it on GitHub to read the full source, or copy it into your project's \`.github/\` folder to adopt it.\n\n**Path** — \`${item.path || "—"}\`\n\n**Tags** — ${item.tags.join(", ")}`;
  };
  const body = synth();

  const fileName = item.path ? item.path.split("/").pop() : `${item.slug}.md`;

  const copyRaw = async () => {
    const text = item.type === "script" && item.run ? item.run : (item.body || u.raw);
    try { await navigator.clipboard.writeText(text); toast(item.type === "script" ? "Copied run command" : (item.body ? "Copied raw markdown" : "Copied raw file URL")); }
    catch { toast("Copy failed"); }
  };
  const download = () => {
    const b = new Blob([body], { type: "text/markdown" });
    const u2 = URL.createObjectURL(b);
    const a = document.createElement("a"); a.href = u2; a.download = fileName; a.click();
    URL.revokeObjectURL(u2); toast("Downloaded " + fileName);
  };

  const related = LSDATA.ITEMS.filter((x) => x.cat === item.cat && x.id !== item.id).slice(0, 3);

  return (
    <main className="wrap">
      <div className="detail">
        <div>
          <div className="crumb" style={{ marginTop: 28 }}>
            <a onClick={() => nav({ view: "home" })}>Home</a> <span>/</span>
            <a onClick={() => nav({ view: "catalogue", cat: item.cat })}>{meta.label}</a> <span>/</span>
            <span>{item.name}</span>
          </div>
          <div className="file-card">
            <div className="file-bar">
              <CatIco id={item.cat} size={16} />
              <span className="fname">{fileName}</span>
              <div className="seg">
                <button className={mode === "render" ? "on" : ""} onClick={() => setMode("render")}>Render</button>
                <button className={mode === "raw" ? "on" : ""} onClick={() => setMode("raw")}>Raw</button>
              </div>
            </div>
            {mode === "render" ? (
              <div className="file-body"><Markdown source={body} /></div>
            ) : (
              <div className="file-body raw"><pre className="raw-pre">{body}</pre></div>
            )}
          </div>

          {related.length > 0 && (
            <div style={{ marginTop: 36 }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--fg-1)", margin: "0 0 14px" }}>More in {meta.label}</h3>
              <div className="item-grid">
                {related.map((r) => <ItemCard key={r.id} item={r} nav={nav} toast={toast} />)}
              </div>
            </div>
          )}
        </div>

        <aside className="aside">
          <div className="install-card">
            <h4>{LSDATA.TYPES[item.type] ? LSDATA.TYPES[item.type].label : "Install"}</h4>
            <p className="install-note">{LSDATA.TYPES[item.type] && LSDATA.TYPES[item.type].note}</p>
            <div className="stack">
              <button className="btn btn-primary" onClick={copyRaw}>
                <Icons.copy size={16} /> {item.type === "script" ? "Copy command" : "Copy"}
              </button>
              {item.type === "install" && !item.tree && <a className="btn btn-ghost" href={u.vscode}><Icons.vscode size={16} /> Install in VS Code</a>}
              {item.type === "install" && !item.tree && <a className="btn btn-ghost" href={u.vscode.replace(/^vscode:/, "vscode-insiders:")}><Icons.vscode size={16} /> VS Code Insiders</a>}
              {item.type === "aiDefault" && <button className="btn btn-ghost" onClick={download}><Icons.download size={16} /> Download</button>}
              {item.type === "workflow" && item.action && <a className="btn btn-ghost" href={`https://github.com/${LSDATA.REPO}/blob/${branch}/${item.action}`} target="_blank" rel="noopener"><Icons.workflow size={16} /> View runnable Action</a>}
              <a className="btn btn-ghost" href={u.blob} target="_blank" rel="noopener"><Icons.github size={16} /> {item.tree ? "Open folder on GitHub" : "View on GitHub"}</a>
            </div>
            {item.type === "aiDefault" && <p className="repo-root-hint"><Icons.layers size={13} /> Drop into your <code>repository root</code></p>}
            <p style={{ fontSize: 12, color: "var(--fg-3)", margin: "14px 0 0", lineHeight: 1.5 }}>
              From the <code style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--accent)" }}>{branch}</code> branch{branch === "main" ? " (stable)" : " (testing)"}. Switch in the top bar.
            </p>
          </div>

          {item.validates && (
            <div className="install-card">
              <h4>Validation</h4>
              <p className="install-note" style={{ marginBottom: 0 }}>
                {item.type === "script"
                  ? <>This script reads the <strong>{item.validates}</strong> schema.</>
                  : <>Validates <strong>{item.validates}</strong>.</>}
                {" "}Scripts and schemas go hand-in-hand — find the pair in <a className="inline-link" onClick={() => nav({ view: "catalogue", cat: "tools" })}>Tools</a>.
              </p>
            </div>
          )}

          <div className="install-card">
            <h4>Details</h4>
            <div className="kv">
              <div className="row"><span className="k">Type</span><span className="v"><TypeBadge type={item.type} /></span></div>
              {item.duration && <div className="row"><span className="k">Duration</span><span className="v">{item.duration}</span></div>}
              {item.applyTo && <div className="row"><span className="k">Applies to</span><span className="v" style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>{item.applyTo}</span></div>}
              {item.path && <div className="row"><span className="k">Path</span><span className="v" style={{ fontFamily: "var(--font-mono)", fontSize: 11, wordBreak: "break-all" }}>{item.path}</span></div>}
            </div>
            <div className="item-tags" style={{ marginTop: 16 }}>
              {item.tags.map((t) => <span key={t} className="tag">{t}</span>)}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

function GettingStarted({ nav, toast }) {
  const { branch } = React.useContext(window.BranchCtx);
  const clone = LSDATA.cloneCmd(branch);
  const copy = async (txt) => { try { await navigator.clipboard.writeText(txt); toast("Copied"); } catch {} };
  const steps = [
    { h: "Set the org default", p: <>Create a repository literally named <code>.github</code> in your organisation. GitHub treats it as the source of community-health defaults for every other repo.</> },
    { h: "Pull in the LightSpeed defaults", p: <>Clone <code>lightspeedwp/.github</code> and copy the <code>instructions/</code>, <code>prompts/</code>, and <code>agents/</code> folders into your <code>.github/</code>. Nothing else needs configuring — inheritance is automatic.</> },
    { h: "Load Copilot custom instructions", p: <>Open VS Code, install the org Copilot instructions from any card, and Copilot will follow LightSpeed standards on every suggestion in that workspace.</> },
    { h: "Run your first review", p: <>Open a pull request and trigger the <strong>Code reviewer</strong> agent. You'll get a ✅ / ⚠️ summary with inline, fixable comments against our standards.</> },
  ];
  return (
    <main className="wrap-prose" style={{ paddingBottom: 64 }}>
      <div className="cat-hero" style={{ borderBottom: "none", paddingBottom: 0 }}>
        <div className="crumb" style={{ marginTop: 28 }}><a onClick={() => nav({ view: "home" })}>Home</a> <span>/</span> <span>Getting started</span></div>
        <span className="eyebrow">Onboarding</span>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px,5vw,46px)", letterSpacing: "-.02em", margin: "8px 0 0", color: "var(--fg-1)" }}>Up and running in ten minutes</h1>
        <p style={{ color: "var(--fg-2)", fontSize: 18, lineHeight: 1.6, maxWidth: 620, marginTop: 14 }}>
          The <code style={{ fontFamily: "var(--font-mono)" }}>.github</code> repository is your AI control plane. Adopt it once and every project inherits the same agents, standards, and guardrails.
        </p>
      </div>

      <div style={{ background: "var(--panel-2)", border: "1px solid var(--hair)", borderRadius: "var(--radius-lg)", padding: "16px 18px", margin: "28px 0", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
        <span className="path-pill"><Icons.github size={15} /> {clone}</span>
        <button className="btn btn-soft btn-sm" onClick={() => copy(clone)}><Icons.copy size={14} /> Copy</button>
      </div>

      <div className="steps">
        {steps.map((s, i) => (
          <div className="step" key={i}>
            <span className="num">{i + 1}</span>
            <div><h4>{s.h}</h4><p>{s.p}</p></div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 36, display: "flex", gap: 12, flexWrap: "wrap" }}>
        <a className="btn btn-primary" onClick={() => nav({ view: "catalogue", cat: "instructions" })}>Browse instructions <Icons.arrow size={16} /></a>
        <a className="btn btn-ghost" onClick={() => nav({ view: "why" })}>Why this exists</a>
      </div>
    </main>
  );
}

function Why({ nav }) {
  return (
    <main className="wrap-prose" style={{ paddingBottom: 64 }}>
      <div className="cat-hero" style={{ borderBottom: "none", paddingBottom: 0 }}>
        <div className="crumb" style={{ marginTop: 28 }}><a onClick={() => nav({ view: "home" })}>Home</a> <span>/</span> <span>Why this exists</span></div>
        <span className="eyebrow">The model</span>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px,5vw,46px)", letterSpacing: "-.02em", margin: "8px 0 0", color: "var(--fg-1)" }}>One repo to govern them all</h1>
      </div>
      <div className="md" style={{ marginTop: 24, fontSize: 16.5 }}>
        <p>As an agency we run dozens of WordPress and WooCommerce repositories at once. Without a shared baseline, every project drifts: different review standards, different Copilot behaviour, different definitions of "done". AI made that drift faster, not slower.</p>
        <p>The <code>.github</code> repository fixes this at the source. GitHub gives every organisation a special repo whose community-health files become the <strong>default for every other repository</strong>. We extend that idea to AI: the agents, instructions, skills, and workflows defined here are the canonical way LightSpeed works.</p>
        <h2>What you get</h2>
        <ul>
          <li><strong>Consistency by inheritance</strong> — fix a standard once and it propagates everywhere, with no copy-paste.</li>
          <li><strong>Installable, not aspirational</strong> — each resource is a real file you copy or install in a click.</li>
          <li><strong>Versioned governance</strong> — frontmatter-validated, reviewed, and changelogged like any other code.</li>
          <li><strong>WordPress-first</strong> — every standard assumes block themes, FSE, and <code>block.json</code>-first plugins.</li>
        </ul>
        <blockquote><p>This site is the discovery layer. The repository is the control plane. The team is the beneficiary.</p></blockquote>
        <h2>How adoption works</h2>
        <p>New repositories inherit the defaults automatically. Existing repositories can override any file locally when they genuinely need to — GitHub always prefers the repo-local version. Standards evolve through pull requests against <code>lightspeedwp/.github</code>, reviewed by the maintainers listed in <code>CODEOWNERS</code>.</p>
      </div>
      <div style={{ marginTop: 32, display: "flex", gap: 12, flexWrap: "wrap" }}>
        <a className="btn btn-primary" onClick={() => nav({ view: "getting-started" })}>Get started <Icons.arrow size={16} /></a>
        <a className="btn btn-ghost" href={`https://github.com/${LSDATA.REPO}`} target="_blank" rel="noopener"><Icons.github size={16} /> View the repository</a>
      </div>
    </main>
  );
}

Object.assign(window, { ItemDetail, GettingStarted, Why });
