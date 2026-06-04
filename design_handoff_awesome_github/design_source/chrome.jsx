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

/* Mega menu structure for Browse dropdown */
const BROWSE_MENU_SECTIONS = [
  {
    title: "CATALOGUES",
    items: [
      { id: "agents", label: "Agents", icon: "robot", desc: "Specialised AI agents" },
      { id: "instructions", label: "Instructions", icon: "book", desc: "Canonical standards" },
      { id: "prompts", label: "Prompts", icon: "chat", desc: "Reusable templates" },
      { id: "skills", label: "Skills", icon: "sparkles", desc: "Self-contained packages" },
    ],
  },
  {
    title: "MORE",
    items: [
      { id: "hooks", label: "Hooks", icon: "shield", desc: "Quality guardrails" },
      { id: "workflows", label: "Workflows", icon: "workflow", desc: "Agentic workflows" },
      { id: "plugins", label: "Plugins", icon: "puzzle", desc: "Plugin packs" },
      { id: "tools", label: "Tools", icon: "wrench", desc: "Toolchain layer" },
    ],
  },
  {
    title: "COOK & LEARN",
    items: [
      { id: "cookbook", label: "Cookbook", icon: "recipe", desc: "Step-by-step recipes" },
      { id: "learn", label: "Learning Centre", icon: "grad", desc: "Learning tracks" },
    ],
  },
  {
    title: "RESOURCES",
    items: [
      { id: "onboarding", label: "Onboarding journey", icon: "bolt", desc: "Getting started" },
      { id: "getting-started", label: "Getting started", icon: "download", desc: "First steps" },
      { id: "why", label: "Why this exists", icon: "layers", desc: "Learn the vision" },
      { id: "glossary", label: "Glossary", icon: "book", desc: "Key terms" },
      { id: "references", label: "References", icon: "github", desc: "Full references" },
    ],
  },
];

const RESOURCE_LINKS = [
  { id: "onboarding", label: "Onboarding journey", icon: "bolt" },
  { id: "getting-started", label: "Getting started", icon: "download" },
  { id: "why", label: "Why this exists", icon: "layers" },
  { id: "glossary", label: "Glossary", icon: "book" },
  { id: "references", label: "References", icon: "github" },
];

function useClickAway(ref, onAway) {
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) onAway(); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [onAway]);
}

function Dropdown({ label, active, children, isMega }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useClickAway(ref, () => setOpen(false));
  useEffect(() => {
    const esc = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, []);
  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button className={"nav-btn" + (open ? " open" : "") + (active ? " active" : "")} onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        {label} <Icons.chevron className="chev" size={15} />
      </button>
      {open && (
        <div className={isMega ? "dropdown-mega" : ""} onClick={() => setOpen(false)}>
          {children}
        </div>
      )}
    </div>
  );
}

function Nav({ route, nav, theme, setTheme, openSearch }) {
  const [drawer, setDrawer] = useState(false);
  const isCat = (id) => route.view === "catalogue" && route.cat === id;
  const isPage = (id) => route.view === id;
  const catActive = route.view === "catalogue";
  const resActive = PAGE_IDS.includes(route.view);

  useEffect(() => { setDrawer(false); }, [route]);
  useEffect(() => { document.body.style.overflow = drawer ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [drawer]);

  const goPage = (id) => nav(PAGE_IDS.includes(id) ? { view: id } : { view: "catalogue", cat: id });

  return (
    <React.Fragment>
    <header className="nav">
      <div className="wrap nav-inner">
        <a className="nav-brand" onClick={() => nav({ view: "home" })}>
          <img src={theme === "dark" ? "assets/LS-Agency-Site-Icon-Light-Blue.svg" : "assets/LS-Agency-Site-Icon-Blue.svg"} alt="LightSpeed" />
          <b>Awesome<span className="tld"> GitHub</span></b>
        </a>

        <nav className="nav-primary">
          <Dropdown label="Browse" active={catActive} isMega={true}>
            <div className="dropdown dd-mega">
              {BROWSE_MENU_SECTIONS.map((section) => (
                <div key={section.title} className="dd-section">
                  <h6 className="dd-section-title">{section.title}</h6>
                  <div className="dd-section-items">
                    {section.items.map((item) => {
                      const isNav = ["cookbook", "learn"].includes(item.id);
                      return (
                        <a
                          key={item.id}
                          className="dd-mega-item"
                          onClick={() => nav(isNav ? { view: item.id } : { view: "catalogue", cat: item.id })}
                        >
                          <span className="dmi-icon">{Icons[item.icon] ? Icons[item.icon]({ size: 24 }) : <Icons.layers size={24} />}</span>
                          <span className="dmi-text">
                            <b>{item.label}</b>
                            <span>{item.desc}</span>
                          </span>
                        </a>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </Dropdown>
        </nav>

        <div className="nav-actions">
          <button className="search-trigger" onClick={openSearch} aria-label="Search">
            <Icons.search size={16} />
            <span className="stxt">Search resources</span>
            <span className="kbd">⌘K</span>
          </button>
          <div className="nav-extra">
            <BranchToggle />
            <button className="icon-btn" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label="Toggle theme">
              {theme === "dark" ? <Icons.sun size={18} /> : <Icons.moon size={18} />}
            </button>
            <a className="icon-btn" href={`https://github.com/${LSDATA.REPO}`} target="_blank" rel="noopener" aria-label="GitHub repository">
              <Icons.github size={18} />
            </a>
          </div>
          <button className="icon-btn burger" onClick={() => setDrawer(true)} aria-label="Open menu">
            <Icons.menu size={20} />
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
              <button className="icon-btn" onClick={() => setDrawer(false)} aria-label="Close menu"><Icons.close size={20} /></button>
            </div>
            <div className="drawer-body">
              <button className="search-trigger" style={{ width: "100%", marginBottom: 4 }} onClick={() => { setDrawer(false); openSearch(); }}>
                <Icons.search size={16} /> <span className="stxt" style={{ display: "inline" }}>Search resources</span>
              </button>

              {BROWSE_MENU_SECTIONS.map((section) => (
                <div key={section.title} className="drawer-sec">
                  <h6>{section.title}</h6>
                  {section.items.map((item) => {
                    const isNav = ["cookbook", "learn"].includes(item.id);
                    const isActive = isNav ? isPage(item.id) : isCat(item.id);
                    return (
                      <a
                        key={item.id}
                        className={"drawer-link" + (isActive ? " active" : "")}
                        onClick={() => nav(isNav ? { view: item.id } : { view: "catalogue", cat: item.id })}
                      >
                        <span className="dli">{Icons[item.icon] ? Icons[item.icon]({ size: 18 }) : <Icons.layers size={18} />}</span>
                        {item.label}
                      </a>
                    );
                  })}
                </div>
              ))}

              <div className="drawer-sec">
                <h6>Install source</h6>
                <div className="drawer-row"><span className="rl">Branch</span><BranchToggle /></div>
                <div className="drawer-row"><span className="rl">Theme</span>
                  <button className="icon-btn" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label="Toggle theme">
                    {theme === "dark" ? <Icons.sun size={18} /> : <Icons.moon size={18} />}
                  </button>
                </div>
              </div>

              <div className="drawer-sec">
                <h6>External</h6>
                <a className="drawer-link" href={`https://github.com/${LSDATA.REPO}`} target="_blank" rel="noopener"><span className="dli"><Icons.github size={18} /></span>.github repository <span className="ext"><Icons.external size={15} /></span></a>
                <a className="drawer-link" href="https://lightspeedwp.agency/" target="_blank" rel="noopener"><span className="dli"><Icons.bolt size={18} /></span>LightSpeed site <span className="ext"><Icons.external size={15} /></span></a>
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
  return <div className="toast"><Icons.check size={16} style={{ color: "var(--c-brand-green-500)" }} />{msg}</div>;
}

Object.assign(window, { Nav, Footer, Toast, useTheme, useBranchState, BranchToggle });
