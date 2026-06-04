/* Learning Centre — a calm, self-paced reading space (à la Linear's Learn).
   Tracks → ordered lessons → prose-first reader with a sticky in-article TOC,
   reading progress, read-state persisted in localStorage, and prev/next.
   Lesson BODIES are the real repo docs (LSCONTENT.docs), rendered faithfully;
   only intros, "what you'll learn", reading time, and the TOC are authored. */

/* ── read-state (localStorage) ── */
function useReadState() {
  const [read, setRead] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem("ag-learn-read") || "[]")); }
    catch { return new Set(); }
  });
  const persist = (s) => { localStorage.setItem("ag-learn-read", JSON.stringify([...s])); };
  const mark = useCallback((key, val) => {
    setRead((prev) => {
      const s = new Set(prev);
      if (val === false) s.delete(key); else s.add(key);
      persist(s); return s;
    });
  }, []);
  return { read, mark };
}

/* flatten all lessons in curriculum order, carrying track context */
function allLessons() {
  const out = [];
  LSLEARN.LEARN_TRACKS.forEach((t) => t.lessons.forEach((l) => out.push({ ...l, track: t, key: t.id + "/" + l.slug })));
  return out;
}
function lessonTitle(l) {
  const d = (window.LSCONTENT && LSCONTENT.docs[l.doc]) || {};
  if (d.title) return d.title;
  return l.slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function NotFound({ nav }) {
  return (
    <main className="wrap notfound">
      <img src="assets/wapuu-astropuu.png" alt="" aria-hidden="true" />
      <h1>Lost in orbit</h1>
      <p>That page drifted off. Let's get you back to something solid.</p>
      <div className="ob-cta" style={{ justifyContent: "center" }}>
        <a className="btn btn-primary" onClick={() => nav({ view: "home" })}>Back home <Icons.arrow size={16} /></a>
        <a className="btn btn-ghost" onClick={() => nav({ view: "learn" })}><Icons.grad size={16} /> Learning Centre</a>
      </div>
    </main>
  );
}

/* ── sticky in-article table of contents with scrollspy ── */
function ArticleToc({ toc }) {
  const [active, setActive] = useState(toc[0] && toc[0].id);
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: "-12% 0px -75% 0px" });
    toc.forEach((h) => { const el = document.getElementById(h.id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [toc]);
  const jump = (id) => { const el = document.getElementById(id); if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: "smooth" }); };
  return (
    <aside className="article-toc">
      <p className="rail-title">On this page</p>
      <ul>
        {toc.map((h) => (
          <li key={h.id} className={"lv" + h.level + (active === h.id ? " on" : "")}>
            <a onClick={() => jump(h.id)}>{h.text}</a>
          </li>
        ))}
      </ul>
    </aside>
  );
}

/* ── Learning Centre home: tracks overview ── */
function LearnHome({ nav }) {
  const { read } = useReadState();
  const tracks = LSLEARN.LEARN_TRACKS;
  const total = tracks.reduce((n, t) => n + t.lessons.length, 0);
  const doneCount = [...read].filter((k) => allLessons().some((l) => l.key === k)).length;

  return (
    <main>
      <section className="learn-hero">
        <div className="hero-grid-bg" />
        <div className="wrap learn-hero-inner">
          <div className="learn-hero-text">
            <span className="eyebrow">Learning Centre</span>
            <h1>Learn the control plane,<br /><span className="hl">at your own pace.</span></h1>
            <p className="lead">Short, self-paced tracks built from the real governance docs. Read straight through, or dip into the lesson you need. We keep your place as you go.</p>
            <div className="learn-progress-bar">
              <div className="lpb-track"><div className="lpb-fill" style={{ width: (total ? (doneCount / total) * 100 : 0) + "%" }} /></div>
              <span className="lpb-label">{doneCount} of {total} lessons read</span>
            </div>
          </div>
          <img className="learn-hero-wapuu" src="assets/wapuu-yoduu.png" alt="" aria-hidden="true" />
        </div>
      </section>

      <div className="wrap learn-tracks">
        {tracks.map((t, ti) => {
          const Fn = Icons[t.icon] || Icons.layers;
          const doneInTrack = t.lessons.filter((l) => read.has(t.id + "/" + l.slug)).length;
          return (
            <section className="track-card" key={t.id}>
              <div className="track-head">
                <span className="track-ico"><Fn size={20} /></span>
                <div>
                  <span className="track-no">Track {ti + 1}</span>
                  <h2>{t.label}</h2>
                </div>
                <span className="track-count">{doneInTrack}/{t.lessons.length}</span>
              </div>
              <p className="track-blurb">{t.blurb}</p>
              <ol className="lesson-list">
                {t.lessons.map((l, li) => {
                  const d = (window.LSCONTENT && LSCONTENT.docs[l.doc]) || {};
                  const mins = LSLEARN.readingTime(d.body);
                  const done = read.has(t.id + "/" + l.slug);
                  return (
                    <li key={l.slug} className={done ? "done" : ""} onClick={() => nav({ view: "learn", track: t.id, lesson: l.slug })}>
                      <span className="lesson-tick">{done ? <Icons.check2 size={18} /> : <span className="tick-no">{li + 1}</span>}</span>
                      <span className="lesson-main">
                        <b>{lessonTitle(l)}</b>
                        <small>{l.learn}</small>
                      </span>
                      <span className="lesson-min"><Icons.clock size={13} /> {mins}m</span>
                    </li>
                  );
                })}
              </ol>
            </section>
          );
        })}
      </div>
    </main>
  );
}

/* ── Lesson reader ── */
function LessonReader({ track, lesson, nav, toast }) {
  const { branch } = React.useContext(window.BranchCtx);
  const { read, mark } = useReadState();
  const [toc, setToc] = useState([]);
  const [progress, setProgress] = useState(0);

  const flat = allLessons();
  const idx = flat.findIndex((l) => l.track.id === track && l.slug === lesson);
  const cur = flat[idx];

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const p = max > 0 ? Math.min(100, (h.scrollTop / max) * 100) : 0;
      setProgress(p);
      if (p > 92 && cur) mark(cur.key, true);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [idx]);

  if (!cur) return <NotFound nav={nav} />;
  const d = (window.LSCONTENT && LSCONTENT.docs[cur.doc]) || {};
  const mins = LSLEARN.readingTime(d.body);
  const blob = `https://github.com/${LSDATA.REPO}/blob/${branch}/${cur.src}`;
  const isRead = read.has(cur.key);
  const prev = flat[idx - 1], next = flat[idx + 1];

  return (
    <main>
      <div className="progress" style={{ width: progress + "%" }} />
      <div className="wrap-prose article">
        <div className="crumb" style={{ marginTop: 28 }}>
          <a onClick={() => nav({ view: "learn" })}>Learning Centre</a> <span>/</span>
          <a onClick={() => nav({ view: "learn", track: cur.track.id })}>{cur.track.label}</a> <span>/</span>
          <span>{lessonTitle(cur)}</span>
        </div>
        <span className="eyebrow">{cur.track.label}</span>
        <h1 className="article-h1">{lessonTitle(cur)}</h1>
        <p className="article-when"><b>What you'll learn</b> — {cur.learn}</p>
        <div className="article-meta">
          <span><Icons.clock size={14} /> {mins} min read</span>
          <button className={"btn btn-sm " + (isRead ? "btn-soft" : "btn-ghost")} onClick={() => { mark(cur.key, !isRead); toast(isRead ? "Marked unread" : "Marked as read"); }}>
            <Icons.check2 size={14} /> {isRead ? "Read" : "Mark as read"}
          </button>
          <a className="btn btn-ghost btn-sm" href={blob} target="_blank" rel="noopener"><Icons.github size={14} /> View source</a>
        </div>

        <div className="article-layout">
          <div className="article-body"><Markdown source={d.body} onToc={setToc} /></div>
          {toc.length > 2 && <ArticleToc toc={toc} />}
        </div>

        <div className="article-foot-src">
          <span>Source — verbatim from <code>{cur.src}</code> on the <code>{branch}</code> branch.</span>
          <a href={blob} target="_blank" rel="noopener">View on GitHub <Icons.external size={13} /></a>
        </div>

        <div className="article-nav">
          {prev
            ? <a className="art-nav-btn" onClick={() => nav({ view: "learn", track: prev.track.id, lesson: prev.slug })}><Icons.arrowLeft size={16} /><span><small>{prev.track.label}</small>{lessonTitle(prev)}</span></a>
            : <span />}
          {next
            ? <a className="art-nav-btn to" onClick={() => nav({ view: "learn", track: next.track.id, lesson: next.slug })}><span><small>{next.track.label}</small>{lessonTitle(next)}</span><Icons.arrow size={16} /></a>
            : <a className="art-nav-btn to" onClick={() => nav({ view: "learn" })}><span><small>Finished</small>Back to tracks</span><Icons.arrow size={16} /></a>}
        </div>
      </div>
    </main>
  );
}

/* ── Track view: header + ordered lessons + further reading ── */
function LearnTrack({ track, nav }) {
  const { read } = useReadState();
  const t = LSLEARN.LEARN_TRACKS.find((x) => x.id === track);
  const { branch } = React.useContext(window.BranchCtx);
  if (!t) return <NotFound nav={nav} />;
  const Fn = Icons[t.icon] || Icons.layers;
  return (
    <main className="wrap-prose" style={{ paddingBottom: 64 }}>
      <div className="cat-hero" style={{ borderBottom: "none", paddingBottom: 8, paddingLeft: 0, paddingRight: 0 }}>
        <div className="crumb" style={{ marginTop: 28 }}><a onClick={() => nav({ view: "learn" })}>Learning Centre</a> <span>/</span> <span>{t.label}</span></div>
        <div className="track-head" style={{ marginTop: 8 }}>
          <span className="track-ico"><Fn size={22} /></span>
          <div><span className="track-no">Track</span><h1 className="page-h1" style={{ margin: 0 }}>{t.label}</h1></div>
        </div>
        <p className="page-lead">{t.blurb}</p>
      </div>
      <ol className="lesson-list big">
        {t.lessons.map((l, li) => {
          const d = (window.LSCONTENT && LSCONTENT.docs[l.doc]) || {};
          const mins = LSLEARN.readingTime(d.body);
          const done = read.has(t.id + "/" + l.slug);
          return (
            <li key={l.slug} className={done ? "done" : ""} onClick={() => nav({ view: "learn", track: t.id, lesson: l.slug })}>
              <span className="lesson-tick">{done ? <Icons.check2 size={18} /> : <span className="tick-no">{li + 1}</span>}</span>
              <span className="lesson-main"><b>{lessonTitle(l)}</b><small>{l.learn}</small></span>
              <span className="lesson-min"><Icons.clock size={13} /> {mins}m</span>
            </li>
          );
        })}
      </ol>
      {t.further && t.further.length > 0 && (
        <div className="further">
          <h3>Further reading</h3>
          <p className="gb">Not every doc is a lesson. These go deeper — read them on GitHub.</p>
          {t.further.map((f) => (
            <a key={f.p} className="ref-row" href={`https://github.com/${LSDATA.REPO}/blob/${branch}/${f.p}`} target="_blank" rel="noopener">
              <span className="path">{f.p.split("/").pop()}</span>
              <span className="desc">{f.d}</span>
              <span className="ext"><Icons.external size={16} /></span>
            </a>
          ))}
        </div>
      )}
    </main>
  );
}

Object.assign(window, { LearnHome, LearnTrack, LessonReader, ArticleToc, NotFound, useReadState });
