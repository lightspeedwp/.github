/* Router + mount. Hash-based so refreshes keep place. */
function parseHash() {
  const h = (location.hash || "#/").replace(/^#\/?/, "");
  const parts = h.split("/").filter(Boolean);
  if (parts.length === 0) return { view: "home" };
  if (parts[0] === "getting-started") return { view: "getting-started" };
  if (parts[0] === "onboarding") return { view: "onboarding" };
  if (parts[0] === "learn") return { view: "learn", track: parts[1] ? decodeURIComponent(parts[1]) : null, lesson: parts[2] ? decodeURIComponent(parts[2]) : null };
  if (parts[0] === "cookbook") return { view: "cookbook", slug: parts[1] ? decodeURIComponent(parts[1]) : null };
  if (parts[0] === "glossary") return { view: "glossary", term: parts[1] ? decodeURIComponent(parts[1]) : null };
  if (parts[0] === "references") return { view: "references" };
  if (parts[0] === "why") return { view: "why" };
  if (parts[0] === "item") return { view: "item", id: decodeURIComponent(parts.slice(1).join("/")) };
  if (parts[0] === "c") return { view: "catalogue", cat: parts[1] };
  return { view: "home" };
}
function toHash(route) {
  if (route.view === "home") return "#/";
  if (route.view === "catalogue") return `#/c/${route.cat}`;
  if (route.view === "item") return `#/item/${route.id}`;
  if (route.view === "glossary") return route.term ? `#/glossary/${route.term}` : "#/glossary";
  if (route.view === "learn") return "#/learn" + (route.track ? `/${route.track}` : "") + (route.lesson ? `/${route.lesson}` : "");
  if (route.view === "cookbook") return "#/cookbook" + (route.slug ? `/${route.slug}` : "");
  return `#/${route.view}`;
}

function App() {
  const [theme, setTheme] = useTheme();
  const { branch, setBranch } = useBranchState();
  const [route, setRoute] = useState(parseHash);
  const [searchOpen, setSearchOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);
  const toastTimer = useRef(null);

  const toast = useCallback((msg) => {
    setToastMsg(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(null), 2200);
  }, []);

  const nav = useCallback((r) => {
    location.hash = toHash(r);
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  useEffect(() => {
    const onHash = () => setRoute(parseHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setSearchOpen((o) => !o); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  let body;
  if (route.view === "home") body = <Home nav={nav} />;
  else if (route.view === "catalogue") body = route.cat === "tools" ? <Tools nav={nav} toast={toast} /> : <Catalogue cat={route.cat} nav={nav} toast={toast} />;
  else if (route.view === "item") body = <ItemDetail id={route.id} nav={nav} toast={toast} />;
  else if (route.view === "learn") body = route.lesson ? <LessonReader track={route.track} lesson={route.lesson} nav={nav} toast={toast} /> : (route.track ? <LearnTrack track={route.track} nav={nav} /> : <LearnHome nav={nav} />);
  else if (route.view === "cookbook") body = route.slug ? <RecipeReader slug={route.slug} nav={nav} toast={toast} /> : <CookbookList nav={nav} />;
  else if (route.view === "getting-started") body = <GettingStarted nav={nav} toast={toast} />;
  else if (route.view === "onboarding") body = <Onboarding nav={nav} toast={toast} />;
  else if (route.view === "glossary") body = <Glossary nav={nav} term={route.term} />;
  else if (route.view === "references") body = <References nav={nav} />;
  else if (route.view === "why") body = <Why nav={nav} />;
  else body = <Home nav={nav} />;

  return (
    <BranchCtx.Provider value={{ branch, setBranch }}>
      <Nav route={route} nav={nav} theme={theme} setTheme={setTheme} openSearch={() => setSearchOpen(true)} />
      {body}
      <Footer nav={nav} />
      <SearchPalette open={searchOpen} onClose={() => setSearchOpen(false)} nav={nav} />
      <Toast msg={toastMsg} />
    </BranchCtx.Provider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
