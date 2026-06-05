/* Markdown renderer for our own trusted content (catalogue bodies, learning
   docs, cookbook recipes). Handles: frontmatter, ATX headings (with id
   anchors), fenced code, tables, ordered/unordered/task lists, blockquotes,
   horizontal rules, inline code/bold/italic/links. Faithful enough to render
   the real repo docs verbatim.
   Pass onToc to collect headings for a table of contents. */

function slugify(s) {
  return String(s).toLowerCase().replace(/[`*_]/g, "").replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-").slice(0, 60);
}

function renderInline(text) {
  let t = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  t = t.replace(/`([^`]+)`/g, (_, c) => `<code>${c}</code>`);
  t = t.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  t = t.replace(/(^|[^*])\*([^*\s][^*]*?)\*(?!\*)/g, "$1<em>$2</em>");
  t = t.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, url) => {
    const ext = /^https?:/.test(url);
    return ext
      ? `<a href="${url}" target="_blank" rel="noopener">${label}</a>`
      : `<a href="${url}">${label}</a>`;
  });
  return t;
}

function Markdown({ source, onToc }) {
  const toc = [];
  const blocks = React.useMemo(() => {
    if (!source) return [];
    const lines = source.split("\n");
    const out = [];
    let i = 0;

    if (lines[0] && lines[0].trim() === "---") {
      let fm = []; i = 1;
      while (i < lines.length && lines[i].trim() !== "---") { fm.push(lines[i]); i++; }
      i++;
      out.push({ t: "fm", c: fm.join("\n") });
    }

    let para = [];
    const flush = () => { if (para.length) { out.push({ t: "p", c: para.join(" ") }); para = []; } };

    while (i < lines.length) {
      const line = lines[i];
      const tr = line.trim();

      if (tr.startsWith("```")) {
        flush();
        let code = []; i++;
        while (i < lines.length && !lines[i].trim().startsWith("```")) { code.push(lines[i]); i++; }
        i++;
        out.push({ t: "code", c: code.join("\n") });
        continue;
      }
      // table: header row followed by a |---| separator
      if (tr.startsWith("|") && i + 1 < lines.length && /^\s*\|?[\s:|-]+\|[\s:|-]*$/.test(lines[i + 1]) && lines[i + 1].includes("-")) {
        flush();
        const splitRow = (r) => r.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
        const head = splitRow(tr);
        i += 2;
        const rows = [];
        while (i < lines.length && lines[i].trim().startsWith("|")) { rows.push(splitRow(lines[i])); i++; }
        out.push({ t: "table", head, rows });
        continue;
      }
      if (tr === "" ) { flush(); i++; continue; }
      if (/^(-{3,}|\*{3,}|_{3,})$/.test(tr)) { flush(); out.push({ t: "hr" }); i++; continue; }
      if (tr.startsWith("#### ")) { flush(); out.push({ t: "h4", c: tr.slice(5) }); i++; continue; }
      if (tr.startsWith("### ")) { flush(); out.push({ t: "h3", c: tr.slice(4) }); i++; continue; }
      if (tr.startsWith("## ")) { flush(); out.push({ t: "h2", c: tr.slice(3) }); i++; continue; }
      if (tr.startsWith("# ")) { flush(); out.push({ t: "h1", c: tr.slice(2) }); i++; continue; }
      if (tr.startsWith("> ")) {
        flush(); let q = [];
        while (i < lines.length && lines[i].trim().startsWith(">")) { q.push(lines[i].trim().replace(/^>\s?/, "")); i++; }
        out.push({ t: "quote", c: q.join(" ") });
        continue;
      }
      if (/^[-*+] /.test(tr)) {
        flush(); let items = [];
        while (i < lines.length && /^\s*[-*+] /.test(lines[i])) {
          const raw = lines[i].replace(/^\s*[-*+] /, "");
          const indent = (lines[i].match(/^\s*/)[0].length);
          items.push({ text: raw, indent });
          i++;
        }
        out.push({ t: "ul", items });
        continue;
      }
      if (/^\d+\. /.test(tr)) {
        flush(); let items = [];
        while (i < lines.length && /^\s*\d+\. /.test(lines[i])) { items.push(lines[i].trim().replace(/^\d+\.\s/, "")); i++; }
        out.push({ t: "ol", items });
        continue;
      }
      para.push(tr); i++;
    }
    flush();
    return out;
  }, [source]);

  // collect TOC from h2/h3
  blocks.forEach((b) => {
    if (b.t === "h2" || b.t === "h3") {
      b.id = slugify(b.c);
      toc.push({ level: b.t === "h2" ? 2 : 3, text: b.c.replace(/[`*]/g, ""), id: b.id });
    }
    if (b.t === "h1") b.id = slugify(b.c);
  });
  React.useEffect(() => { if (onToc) onToc(toc); }, [source]);

  const liHtml = (it) => {
    let s = typeof it === "string" ? it : it.text;
    s = s.replace(/^\[ \]\s/, "☐ ").replace(/^\[[xX]\]\s/, "☑ ");
    return renderInline(s);
  };

  return (
    <div className="md">
      {blocks.map((b, k) => {
        if (b.t === "fm") return <div key={k} className="frontmatter">{b.c}</div>;
        if (b.t === "h1") return <h1 key={k} id={b.id} dangerouslySetInnerHTML={{ __html: renderInline(b.c) }} />;
        if (b.t === "h2") return <h2 key={k} id={b.id} dangerouslySetInnerHTML={{ __html: renderInline(b.c) }} />;
        if (b.t === "h3") return <h3 key={k} id={b.id} dangerouslySetInnerHTML={{ __html: renderInline(b.c) }} />;
        if (b.t === "h4") return <h4 key={k} dangerouslySetInnerHTML={{ __html: renderInline(b.c) }} />;
        if (b.t === "p") return <p key={k} dangerouslySetInnerHTML={{ __html: renderInline(b.c) }} />;
        if (b.t === "hr") return <hr key={k} />;
        if (b.t === "quote") return <blockquote key={k}><p dangerouslySetInnerHTML={{ __html: renderInline(b.c) }} /></blockquote>;
        if (b.t === "ul") return <ul key={k}>{b.items.map((it, j) => <li key={j} style={it.indent >= 2 ? { marginLeft: 18 } : null} dangerouslySetInnerHTML={{ __html: liHtml(it) }} />)}</ul>;
        if (b.t === "ol") return <ol key={k}>{b.items.map((it, j) => <li key={j} dangerouslySetInnerHTML={{ __html: liHtml(it) }} />)}</ol>;
        if (b.t === "code") return <pre key={k}><code>{b.c}</code></pre>;
        if (b.t === "table") return (
          <div key={k} className="md-table-wrap">
            <table className="md-table">
              <thead><tr>{b.head.map((h, j) => <th key={j} dangerouslySetInnerHTML={{ __html: renderInline(h) }} />)}</tr></thead>
              <tbody>{b.rows.map((r, ri) => <tr key={ri}>{r.map((c, ci) => <td key={ci} dangerouslySetInnerHTML={{ __html: renderInline(c) }} />)}</tr>)}</tbody>
            </table>
          </div>
        );
        return null;
      })}
    </div>
  );
}

window.Markdown = Markdown;
window.mdSlugify = slugify;
