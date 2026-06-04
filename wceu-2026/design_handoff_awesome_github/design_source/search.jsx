/* ⌘K command palette — searches all catalogue items + categories. */
function SearchPalette({ open, onClose, nav }) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) { setQ(""); setSel(0); setTimeout(() => inputRef.current && inputRef.current.focus(), 30); }
  }, [open]);

  const results = React.useMemo(() => {
    const term = q.trim().toLowerCase();
    const items = LSDATA.ITEMS;
    if (!term) return items.slice(0, 7);
    return items.filter((it) => {
      const hay = (it.name + " " + it.description + " " + it.tags.join(" ") + " " + it.cat).toLowerCase();
      return term.split(/\s+/).every((w) => hay.includes(w));
    }).slice(0, 12);
  }, [q]);

  useEffect(() => { setSel(0); }, [q]);

  const go = useCallback((it) => {
    if (!it) return;
    onClose();
    nav({ view: "item", id: it.id });
  }, [onClose, nav]);

  const onKey = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => Math.min(s + 1, results.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); go(results[sel]); }
    else if (e.key === "Escape") { onClose(); }
  };

  if (!open) return null;
  const catLabel = (id) => (LSDATA.CATEGORIES.find((c) => c.id === id) || {}).label || id;

  return (
    <div className="palette-scrim" onClick={onClose}>
      <div className="palette" onClick={(e) => e.stopPropagation()}>
        <div className="palette-input">
          <SimpleIcon type="search" size={20} style={{ color: "var(--fg-3)" }} />
          <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={onKey}
                 placeholder="Search agents, instructions, skills…" />
          <span className="kbd">esc</span>
        </div>
        <div className="palette-results">
          {results.length === 0 && (
            <div style={{ padding: "28px 16px", textAlign: "center", color: "var(--fg-3)", fontSize: 14 }}>
              No resources match “{q}”.
            </div>
          )}
          {results.length > 0 && <div className="palette-group">{q.trim() ? "Results" : "Popular"}</div>}
          {results.map((it, idx) => {
            const catIcon = (LSDATA.CATEGORIES.find((c) => c.id === it.cat) || {}).icon || "layers";
            return (
            <div key={it.id} className={"palette-item" + (idx === sel ? " sel" : "")}
                 onMouseEnter={() => setSel(idx)} onClick={() => go(it)}>
              <span className="pi-mark"><SimpleIcon type={catIcon} size={16} /></span>
              <div style={{ minWidth: 0 }}>
                <div className="pi-name">{it.name}</div>
                <div className="pi-desc" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 380 }}>{it.description}</div>
              </div>
              <span className="pi-cat">{catLabel(it.cat)}</span>
            </div>
            );
          })}
        </div>
        <div className="palette-foot">
          <span><span className="kbd">↑↓</span> navigate</span>
          <span><span className="kbd">↵</span> open</span>
          <span><span className="kbd">esc</span> close</span>
        </div>
      </div>
    </div>
  );
}

window.SearchPalette = SearchPalette;
