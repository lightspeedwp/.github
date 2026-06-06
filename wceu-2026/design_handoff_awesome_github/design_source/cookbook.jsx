/* Cookbook — recipes & playbooks. A list of readable, step-by-step guides
   (read + copy), and a recipe reader that renders the real cookbook markdown
   from the repo. Built to grow: the list shows an honest "expanding" state. */
function CookbookList({ nav }) {
  const recipes = LSLEARN.COOKBOOK_RECIPES;
  return (
    <main>
      <div className="cat-hero">
        <div className="wrap">
          <div className="crumb"><a onClick={() => nav({ view: "home" })}>Home</a> <span>/</span> <span>Cookbook</span></div>
          <span className="eyebrow">Recipes &amp; playbooks</span>
          <h1 className="page-h1">Cookbook</h1>
          <p className="page-lead">Battle-tested, step-by-step recipes for common AI-ops and WordPress tasks. Read one start to finish, or copy the steps into your own plan. This section grows over time — new playbooks land here first.</p>
        </div>
      </div>

      <div className="wrap recipe-wrap">
        <div className="recipe-grid">
          {recipes.map((r) => {
            const doc = (window.LSCONTENT && LSCONTENT.cookbook[r.doc]) || {};
            const mins = LSLEARN.readingTime(doc.body);
            return (
              <article key={r.slug} className="recipe-card" onClick={() => nav({ view: "cookbook", slug: r.slug })}>
                <div className="recipe-top">
                  <span className="recipe-kind">{r.kind}</span>
                  <span className="meta"><SimpleIcon type="clock" size={12} /> {mins} min</span>
                </div>
                <h3>{r.title}</h3>
                <p className="recipe-when"><b>When to use</b> — {r.when}</p>
                <span className="recipe-open">Read recipe <SimpleIcon type="arrow" size={15} /></span>
              </article>
            );
          })}
          <div className="recipe-card recipe-soon">
            <img src="assets/wapuu-rocket.svg" alt="" aria-hidden="true" />
            <div>
              <h3>More recipes incoming</h3>
              <p>The cookbook expands as we capture more repeatable workflows. New playbooks are proposed by PR against <code>cookbook/</code>.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function RecipeReader({ slug, nav, toast }) {
  const { branch } = React.useContext(window.BranchCtx);
  const recipes = LSLEARN.COOKBOOK_RECIPES;
  const idx = recipes.findIndex((r) => r.slug === slug);
  const r = recipes[idx];
  const [toc, setToc] = useState([]);
  if (!r) return <NotFound nav={nav} />;
  const doc = (window.LSCONTENT && LSCONTENT.cookbook[r.doc]) || {};
  const mins = LSLEARN.readingTime(doc.body);
  const blob = `https://github.com/${LSDATA.REPO}/blob/${branch}/${r.src}`;
  const prev = recipes[idx - 1], next = recipes[idx + 1];
  const copyAll = async () => { try { await navigator.clipboard.writeText(doc.body || ""); toast("Copied recipe"); } catch {} };

  return (
    <main className="wrap-prose article">
      <div className="crumb" style={{ marginTop: 28 }}>
        <a onClick={() => nav({ view: "home" })}>Home</a> <span>/</span>
        <a onClick={() => nav({ view: "cookbook" })}>Cookbook</a> <span>/</span> <span>{r.title}</span>
      </div>
      <span className="recipe-kind">{r.kind}</span>
      <h1 className="article-h1">{doc.title || r.title}</h1>
      <p className="article-when"><b>When to use</b> — {r.when}</p>
      <div className="article-meta">
        <span><SimpleIcon type="clock" size={14} /> {mins} min read</span>
        <button className="btn btn-soft btn-sm" onClick={copyAll}><SimpleIcon type="copy" size={14} /> Copy recipe</button>
        <a className="btn btn-ghost btn-sm" href={blob} target="_blank" rel="noopener"><SimpleIcon type="github" size={14} /> View source</a>
      </div>

      <div className="article-layout">
        <div className="article-body"><Markdown source={doc.body} onToc={setToc} /></div>
        {toc.length > 2 && <ArticleToc toc={toc} />}
      </div>

      <div className="article-nav">
        {prev
          ? <a className="art-nav-btn" onClick={() => nav({ view: "cookbook", slug: prev.slug })}><SimpleIcon type="arrowLeft" size={16} /><span><small>Previous</small>{prev.title}</span></a>
          : <span />}
        {next
          ? <a className="art-nav-btn to" onClick={() => nav({ view: "cookbook", slug: next.slug })}><span><small>Next</small>{next.title}</span><SimpleIcon type="arrow" size={16} /></a>
          : <a className="art-nav-btn to" onClick={() => nav({ view: "cookbook" })}><span><small>Back to</small>All recipes</span><SimpleIcon type="arrow" size={16} /></a>}
      </div>
    </main>
  );
}

window.CookbookList = CookbookList;
window.RecipeReader = RecipeReader;
