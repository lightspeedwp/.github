/* Chrome: theme + branch context, responsive nav (dropdowns + burger drawer), footer, toast. */
const { useState, useEffect, useRef, useCallback, useContext } = React;

/* ── theme ── */
function useTheme() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("ag-theme");
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("ag-theme", theme);
  }, [theme]);
  return [theme, setTheme];
}

/* ── branch context (main = stable, develop = testing) ── */
const BranchCtx = React.createContext({ branch: "main", setBranch: () => {} });
window.BranchCtx = BranchCtx;
function useBranchState() {
  const [branch, setBranchRaw] = useState(() => localStorage.getItem("ag-branch") || "main");
  const setBranch = useCallback((b) => { setBranchRaw(b); localStorage.setItem("ag-branch", b); }, []);
  return { branch, setBranch };
}

function BranchToggle({ compact }) {
  const { branch, setBranch } = useContext(BranchCtx);
  return (
    <div className="branch" role="group" aria-label="Install source branch">
      <button className={branch === "main" ? "on" : ""} onClick={() => setBranch("main")} title="Stable branch">
        <span className="bdot" /> main
      </button>
      <button className={branch === "develop" ? "on" : ""} onClick={() => setBranch("develop")} title="Testing branch">
        <span className="bdot" /> dev
      </button>
    </div>
  );
}

const PAGE_IDS = ["onboarding", "why", "getting-started", "glossary", "references", "cookbook", "learn"];
const RESOURCE_LINKS = [
  { id: "onboarding", label: "Onboarding journey", icon: "bolt" },
  { id: "getting-started", label: "Getting started", icon: "download" },
  { id: "why", label: "Why this exists", icon: "layers" },
  { id: "glossary", label: "Glossary", icon: "book" },
  { id: "references", label: "References", icon: "github" },
];

function SimpleIcon({ type, size = 18, theme = "dark" }) {
  const s = size;
  if (type === "search") return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>;
  if (type === "github") return <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.6.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>;
  if (type === "theme") return theme === "dark" ?
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg> :
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;
  if (type === "close") return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
  if (type === "sun") return <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" strokeWidth="2"/><line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" strokeWidth="2"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" strokeWidth="2"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" strokeWidth="2"/><line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" strokeWidth="2"/><line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="2"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" strokeWidth="2"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" strokeWidth="2"/></svg>;
  if (type === "moon") return <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;
  if (type === "external") return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>;
  if (type === "bolt") return <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
  if (type === "check") return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>;
  if (type === "check2") return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>;
  if (type === "recipe") return <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 9h2v2H7zm0 4h2v2H7zm0-8h2v2H7zm4 4h2v2h-2zm0 4h2v2h-2zm0-8h2v2h-2zm4 4h2v2h-2zm0 4h2v2h-2zm0-8h2v2h-2z"/></svg>;
  if (type === "grad") return <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82M12 3L1 9l11 6.36L23 9M5 6.57L12 11.29l7-4.72"/></svg>;
  if (type === "layers") return <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5M2 17l10 5 10-5M2 12l10 5 10-5"/></svg>;
  if (type === "book") return <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20v-2H6.5C5.12 15 4 16.12 4 17.5v2zM20 8H7.82A2.995 2.995 0 0 0 4 10.5a4 4 0 0 0 4 4h12V8zm0-6H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>;
  if (type === "download") return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;
  if (type === "copy") return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>;
  if (type === "arrow") return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
  if (type === "arrowLeft") return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>;
  if (type === "clock") return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
  if (type === "shield") return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
  if (type === "sparkles") return <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>;
  if (type === "terminal") return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>;
  if (type === "vscode") return <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M3 2h2.5L20 12l-14.5 10H3V2z" opacity="0.3"/><path d="M3 2h2.5L20 12l-14.5 10H3V2z"/></svg>;
  if (type === "workflow") return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="2"/><circle cx="6" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="18" cy="12" r="2"/></svg>;
  if (type === "wrench") return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 1 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>;
  if (type === "puzzle") return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l-2 2v7c0 1 .8 1.8 1.8 1.8h4.4c1 0 1.8.8 1.8 1.8v1.8c0 1 .8 1.8 1.8 1.8h4c1 0 1.8-.8 1.8-1.8V8c0-.6.4-1 1-1h3"/></svg>;
  return null;
}


function Nav({ route, nav, theme, setTheme, openSearch }) {
  const [drawer, setDrawer] = useState(false);
  const isPage = (id) => route.view === id;
  const isCat = (id) => route.view === "catalogue" && route.cat === id;

  useEffect(() => { setDrawer(false); }, [route]);
  useEffect(() => { document.body.style.overflow = drawer ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [drawer]);

  return (
    <React.Fragment>
    <header className="nav">
      <div className="wrap nav-inner">
        <a className="nav-brand" onClick={() => nav({ view: "home" })}>
          <img src={theme === "dark" ? "assets/LS-Agency-Site-Icon-Light-Blue.svg" : "assets/LS-Agency-Site-Icon-Blue.svg"} alt="LightSpeed" />
          <b>Awesome<span className="tld"> GitHub</span></b>
        </a>

        <nav className="nav-primary">
          <button className={"nav-btn" + (route.view === "catalogue" ? " active" : "")} onClick={() => nav({ view: "catalogue", cat: "agents" })}>Browse</button>
          <button className={"nav-btn" + (isPage("cookbook") ? " active" : "")} onClick={() => nav({ view: "cookbook" })}>Cookbook</button>
          <button className={"nav-btn" + (isPage("learn") ? " active" : "")} onClick={() => nav({ view: "learn" })}>Learn</button>
          <button className={"nav-btn" + (isPage("why") || isPage("getting-started") || isPage("glossary") || isPage("references") ? " active" : "")} onClick={() => nav({ view: "why" })}>Resources</button>
        </nav>

        <div className="nav-actions">
          <button className="search-trigger" onClick={openSearch} aria-label="Search">
            <SimpleIcon type="search" size={16} />
            <span className="stxt">Search resources</span>
            <span className="kbd">⌘K</span>
          </button>
          <div className="nav-extra">
            <BranchToggle />
            <button className="icon-btn" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label="Toggle theme">
              <SimpleIcon type="theme" size={18} theme={theme} />
            </button>
            <a className="icon-btn" href={`https://github.com/${LSDATA.REPO}`} target="_blank" rel="noopener" aria-label="GitHub repository">
              <SimpleIcon type="github" size={18} />
            </a>
          </div>
          <button className="icon-btn burger" onClick={() => setDrawer(true)} aria-label="Open menu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
        </div>
      </div>
    </header>

      {drawer && (
        <React.Fragment>
          <div className="drawer-scrim" onClick={() => setDrawer(false)} />
          <div className="drawer" role="dialog" aria-label="Menu">
            <div className="drawer-head">
              <a className="nav-brand" onClick={() => nav({ view: "home" })}>
                <img src={theme === "dark" ? "assets/LS-Agency-Site-Icon-Light-Blue.svg" : "assets/LS-Agency-Site-Icon-Blue.svg"} alt="" />
                <b>Awesome<span className="tld"> GitHub</span></b>
              </a>
              <button className="icon-btn" onClick={() => setDrawer(false)} aria-label="Close menu"><SimpleIcon type="close" size={20} /></button>
            </div>
            <div className="drawer-body">
              <button className="search-trigger" style={{ width: "100%", marginBottom: 4 }} onClick={() => { setDrawer(false); openSearch(); }}>
                <SimpleIcon type="search" size={16} /> <span className="stxt" style={{ display: "inline" }}>Search resources</span>
              </button>

              <div className="drawer-sec">
                <h6>Browse</h6>
                {LSDATA.CATEGORIES.map((c) => (
                  <a key={c.id} className={"drawer-link" + (isCat(c.id) ? " active" : "")} onClick={() => nav({ view: "catalogue", cat: c.id })}>
                    <span className="dli"><CatIco id={c.id} size={18} /></span>{c.label}
                  </a>
                ))}
              </div>

              <div className="drawer-sec">
                <h6>Cook &amp; learn</h6>
                <a className={"drawer-link" + (isPage("cookbook") ? " active" : "")} onClick={() => nav({ view: "cookbook" })}><span className="dli"><SimpleIcon type="recipe" size={18} /></span>Cookbook</a>
                <a className={"drawer-link" + (isPage("learn") ? " active" : "")} onClick={() => nav({ view: "learn" })}><span className="dli"><SimpleIcon type="grad" size={18} /></span>Learning Centre</a>
              </div>

              <div className="drawer-sec">
                <h6>Resources</h6>
                {RESOURCE_LINKS.map((r) => (
                  <a key={r.id} className={"drawer-link" + (isPage(r.id) ? " active" : "")} onClick={() => nav({ view: r.id })}><span className="dli"><SimpleIcon type={r.icon} size={18} /></span>{r.label}</a>
                ))}
              </div>

              <div className="drawer-sec">
                <h6>Install source</h6>
                <div className="drawer-row"><span className="rl">Branch</span><BranchToggle /></div>
                <div className="drawer-row"><span className="rl">Theme</span>
                  <button className="icon-btn" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label="Toggle theme">
                    {theme === "dark" ? <SimpleIcon type="sun" size={18} /> : <SimpleIcon type="moon" size={18} />}
                  </button>
                </div>
              </div>

              <div className="drawer-sec">
                <h6>External</h6>
                <a className="drawer-link" href={`https://github.com/${LSDATA.REPO}`} target="_blank" rel="noopener"><span className="dli"><SimpleIcon type="github" size={18} /></span>.github repository <span className="ext"><SimpleIcon type="external" size={15} /></span></a>
                <a className="drawer-link" href="https://lightspeedwp.agency/" target="_blank" rel="noopener"><span className="dli"><SimpleIcon type="bolt" size={18} /></span>LightSpeed site <span className="ext"><SimpleIcon type="external" size={15} /></span></a>
              </div>
            </div>
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

function Footer({ nav }) {
  return (
    <footer className="foot">
      <div className="foot-halo" />
      <div className="wrap foot-inner">
        <div className="foot-top">
          <div className="foot-brand">
            <img src="assets/LS-Agency-Logo-White.svg" alt="LightSpeed" />
            <p>Installable AI governance for the LightSpeed WordPress &amp; WooCommerce team.</p>
          </div>
          <div className="foot-cols">
            <div className="foot-col">
              <h5>Catalogues</h5>
              {LSDATA.CATEGORIES.slice(0, 4).map((c) => <a key={c.id} onClick={() => nav({ view: "catalogue", cat: c.id })}>{c.label}</a>)}
            </div>
            <div className="foot-col">
              <h5>More</h5>
              {LSDATA.CATEGORIES.slice(4).map((c) => <a key={c.id} onClick={() => nav({ view: "catalogue", cat: c.id })}>{c.label}</a>)}
            </div>
            <div className="foot-col">
              <h5>Learn</h5>
              <a onClick={() => nav({ view: "learn" })}>Learning Centre</a>
              <a onClick={() => nav({ view: "cookbook" })}>Cookbook</a>
              <a onClick={() => nav({ view: "onboarding" })}>Onboarding journey</a>
              <a onClick={() => nav({ view: "getting-started" })}>Getting started</a>
            </div>
            <div className="foot-col">
              <h5>Reference</h5>
              <a onClick={() => nav({ view: "glossary" })}>Glossary</a>
              <a onClick={() => nav({ view: "references" })}>References</a>
              <a href="https://lightspeedwp.agency/" target="_blank" rel="noopener">LightSpeed site</a>
            </div>
          </div>
        </div>
        <div className="foot-bottom">
          <span>© 2026 LightSpeed · Crafted with care in WordPress.</span>
          <span>GPL-3.0</span>
        </div>
      </div>
    </footer>
  );
}

function Toast({ msg }) {
  if (!msg) return null;
  const CheckIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--c-brand-green-500)" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>;
  return <div className="toast"><CheckIcon />{msg}</div>;
}

Object.assign(window, { Nav, Footer, Toast, useTheme, useBranchState, BranchToggle, SimpleIcon });
