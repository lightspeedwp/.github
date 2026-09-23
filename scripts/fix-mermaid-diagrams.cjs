const fs = require("fs");
const path = require("path");

const PALETTE = {
  information: {
    fill: "#dbeafe",
    color: "#1e3a5f",
    stroke: "#1e3a5f",
  },
  success: {
    fill: "#dcfce7",
    color: "#14532d",
    stroke: "#14532d",
  },
  warning: {
    fill: "#fef3c7",
    color: "#4a2c00",
    stroke: "#b45309",
  },
  error: {
    fill: "#fee2e2",
    color: "#7f1d1d",
    stroke: "#b91c1c",
  },
  documentation: {
    fill: "#f3e8ff",
    color: "#3b0764",
    stroke: "#7e22ce",
  },
  neutral: {
    fill: "#f1f5f9",
    color: "#0f172a",
    stroke: "#334155",
  },
  highlight: {
    fill: "#ecfdf5",
    color: "#064e3b",
    stroke: "#059669",
  },
};

const FILL_TO_ROLE = new Map([
  ["#dbeafe", "information"],
  ["#e1f5fe", "information"],
  ["#d9f2ff", "information"],
  ["#e0f2fe", "information"],
  ["#bae6fd", "information"],
  ["#c7d2fe", "information"],
  ["#dcfce7", "success"],
  ["#e8f5e8", "success"],
  ["#d1fae5", "success"],
  ["#c8e6c9", "success"],
  ["#ecfccb", "success"],
  ["#fef3c7", "warning"],
  ["#fff3e0", "warning"],
  ["#fee2e2", "error"],
  ["#ffebee", "error"],
  ["#ffcdd2", "error"],
  ["#ffe4e6", "error"],
  ["#f3e8ff", "documentation"],
  ["#f3e5f5", "documentation"],
  ["#fce4ec", "documentation"],
  ["#e2e8f0", "neutral"],
  ["#f1f5f9", "neutral"],
  ["#ecfdf5", "highlight"],
]);

function findMarkdownFiles(dir = ".") {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".git") continue;
      // Generated reports are historical records; never rewrite them.
      // Compared relative to the working directory, whatever `dir` form
      // (relative or absolute) the walk started from.
      const relative = path.relative(
        process.cwd(),
        path.resolve(dir, entry.name),
      );
      if (relative === path.join(".github", "reports")) continue;
      files.push(...findMarkdownFiles(path.join(dir, entry.name)));
      continue;
    }

    if (entry.isFile() && /\.(md|mdx)$/i.test(entry.name)) {
      files.push(path.join(dir, entry.name));
    }
  }

  return files;
}

function rewriteColourDeclaration(line) {
  const match = line.match(/^(\s*)(style|classDef)\s+(\S+)\s+(.+)$/);
  if (!match) return line;

  const [, indent, keyword, target, props] = match;
  const fillMatch = props.match(/(?<!-)\bfill\s*:\s*([^,;\s]+)/i);
  if (!fillMatch) return line;

  const role = FILL_TO_ROLE.get(fillMatch[1].trim().toLowerCase());
  if (!role) return line;

  const palette = PALETTE[role];
  let rewritten = props;

  if (/\bfill\s*:/.test(rewritten)) {
    rewritten = rewritten.replace(
      /(?<!-)\bfill\s*:\s*([^,;\s]+)/i,
      `fill:${palette.fill}`,
    );
  } else {
    rewritten = `fill:${palette.fill},${rewritten}`;
  }

  if (/\bcolor\s*:/.test(rewritten)) {
    rewritten = rewritten.replace(
      /(?<!-)\bcolor\s*:\s*([^,;\s]+)/i,
      `color:${palette.color}`,
    );
  } else {
    rewritten += `,color:${palette.color}`;
  }

  if (/\bstroke\s*:/.test(rewritten)) {
    rewritten = rewritten.replace(
      /(?<!-)\bstroke\s*:\s*([^,;\s]+)/i,
      `stroke:${palette.stroke}`,
    );
  } else {
    rewritten += `,stroke:${palette.stroke}`;
  }

  return `${indent}${keyword} ${target} ${rewritten}`;
}

const ACC_LINE = /^\s*acc(Title|Descr)\s*:/;

/**
 * Index of the diagram-type line: the first line that is not blank, not a
 * `%%` comment or `%%{init}%%` directive, not inside a leading `---`
 * frontmatter block and not an accessibility statement. Mermaid detects the
 * diagram type from this line, so accTitle/accDescr must come after it
 * (#3490). Returns -1 when there is no such line.
 */
const ACC_BLOCK_START = /^\s*accDescr\s*\{/;

/**
 * Length in lines of a multi-line `accDescr { ... }` block starting at
 * `start` (0 when `lines[start]` does not open one).
 */
function accBlockLength(lines, start) {
  if (!ACC_BLOCK_START.test(lines[start] || "")) return 0;
  if (lines[start].includes("}")) return 1;
  const close = lines.findIndex((line, i) => i > start && line.trim() === "}");
  return close === -1 ? lines.length - start : close - start + 1;
}

function findTypeLineIndex(lines) {
  let index = 0;
  const skipBlankAndComments = () => {
    while (index < lines.length) {
      const blockLength = accBlockLength(lines, index);
      if (blockLength > 0) {
        index += blockLength;
      } else if (
        lines[index].trim() === "" ||
        lines[index].trim().startsWith("%%") ||
        ACC_LINE.test(lines[index])
      ) {
        index += 1;
      } else {
        break;
      }
    }
  };

  skipBlankAndComments();
  if (lines[index]?.trim() === "---") {
    const close = lines.findIndex(
      (line, i) => i > index && line.trim() === "---",
    );
    if (close === -1) return -1;
    index = close + 1;
    skipBlankAndComments();
  }

  return index < lines.length ? index : -1;
}

// Diagram types verified to accept accTitle/accDescr directly after the type
// line, by a full mermaid 12.0.0 parse under a DOM (happy-dom). mindmap,
// sankey-beta and block-beta reject them (a mindmap reads them as extra root
// nodes: "There can be only one root").
const ACC_TYPES = [
  "flowchart",
  "flowchart-elk",
  "graph",
  "sequenceDiagram",
  "classDiagram",
  "stateDiagram",
  "stateDiagram-v2",
  "erDiagram",
  "journey",
  "gantt",
  "pie",
  "quadrantChart",
  "requirementDiagram",
  "gitGraph",
  "C4Context",
  "C4Container",
  "C4Component",
  "C4Dynamic",
  "C4Deployment",
  "timeline",
  "xychart-beta",
  "packet-beta",
  "architecture-beta",
  "kanban",
];
const NO_ACC_TYPES = ["mindmap", "sankey-beta", "block-beta"];
// Boilerplate this script used to inject; removed again from blocks that
// cannot carry it (typeless snippets, sankey-beta, block-beta).
const INJECTED =
  /^\s*(accTitle: (Diagram|Flowchart|Graph Diagram|Sequence Diagram|Gantt Chart)|accDescr: Detailed diagram)\s*$/;

function diagramKind(typeLine) {
  const keyword = typeLine.trim().split(/[\s:;{]/)[0];
  if (ACC_TYPES.includes(keyword)) return "acc";
  if (NO_ACC_TYPES.includes(keyword)) return "no-acc";
  return "unknown";
}

function titleFor(typeLine) {
  const type = typeLine.trim().toLowerCase();
  if (type.startsWith("flowchart")) return "Flowchart";
  if (type.startsWith("graph")) return "Graph Diagram";
  if (type.startsWith("sequencediagram")) return "Sequence Diagram";
  if (type.startsWith("gantt")) return "Gantt Chart";
  return "Diagram";
}

/**
 * Ensure a diagram has accTitle and accDescr directly after its type line,
 * moving any found above the type line, and apply palette fixes.
 * Idempotent: fixing an already-fixed diagram returns it unchanged.
 * @param {string} diagram - Diagram source between the fences
 * @returns {string}
 */
// `accTitle "text"` without a colon is a parse error in mermaid 12; the
// documented single-line form is `accTitle: text`.
const NO_COLON_ACC = /^(\s*)acc(Title|Descr)\s+"(.*)"\s*$/;

function fixDiagram(diagram) {
  const lines = diagram
    .replace(/^\n+|\s+$/g, "")
    .split("\n")
    .map((line) => line.replace(NO_COLON_ACC, "$1acc$2: $3"));
  const typeIndex = findTypeLineIndex(lines);
  const typeLine = typeIndex === -1 ? "" : lines[typeIndex];

  // Typeless snippets (e.g. a list of style lines) and types that reject
  // accessibility statements: never inject, and drop earlier injections.
  if (typeIndex === -1 || diagramKind(typeLine) !== "acc") {
    return lines
      .filter((line) => !INJECTED.test(line))
      .map((line) => rewriteColourDeclaration(line))
      .join("\n");
  }

  // Split everything above the type line into accessibility statements
  // (single lines or whole `accDescr { ... }` blocks) and other lines.
  const misplaced = [];
  const before = [];
  for (let i = 0; i < typeIndex;) {
    const blockLength = accBlockLength(lines, i);
    if (blockLength > 0) {
      misplaced.push(lines.slice(i, i + blockLength));
      i += blockLength;
    } else if (ACC_LINE.test(lines[i])) {
      misplaced.push([lines[i]]);
      i += 1;
    } else {
      before.push(lines[i]);
      i += 1;
    }
  }

  // Identical accessibility statements repeated after the type line are
  // dropped (keep the first), so earlier double insertions collapse.
  const seen = new Set();
  const deduplicated = lines.slice(typeIndex + 1).filter((line) => {
    if (!ACC_LINE.test(line)) return true;
    const key = line.trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  // Boilerplate this script once injected is also dropped wherever an
  // author-written statement of the same kind exists (for example a
  // generic "accDescr: Detailed diagram" next to an `accDescr { ... }`).
  const authored = (kind) =>
    [...lines.slice(0, typeIndex), ...deduplicated].some(
      (line) =>
        new RegExp(`^\\s*${kind}\\s*[:{]`).test(line) && !INJECTED.test(line),
    );
  const after = deduplicated.filter((line) => {
    if (!INJECTED.test(line)) return true;
    return !authored(
      line.trim().startsWith("accTitle") ? "accTitle" : "accDescr",
    );
  });

  const indent = (after.find((line) => line.trim() !== "") || "").match(
    /^\s*/,
  )[0];
  // Both forms count: `accDescr: text` and the multi-line `accDescr { ... }`.
  const isAcc = (name, line) => new RegExp(`^\\s*${name}\\s*[:{]`).test(line);
  // A misplaced statement is dropped when the same kind already follows the
  // type line, so moving it never produces a duplicate.
  const accLines = misplaced
    .filter((statement) => {
      const name = statement[0].trim().startsWith("accTitle")
        ? "accTitle"
        : "accDescr";
      return !after.some((other) => isAcc(name, other));
    })
    .flatMap((statement) => {
      // Re-indent the statement as a unit, keeping a block's inner layout.
      const base = statement[0].match(/^\s*/)[0].length;
      const strip = new RegExp(`^[ \\t]{0,${base}}`);
      return statement.map((line) => `${indent}${line.replace(strip, "")}`);
    });
  const has = (name) =>
    [...accLines, ...after].some((line) => isAcc(name, line));

  if (!has("accTitle"))
    accLines.unshift(`${indent}accTitle: ${titleFor(typeLine)}`);
  if (!has("accDescr")) accLines.push(`${indent}accDescr: Detailed diagram`);

  return [...before, typeLine, ...accLines, ...after]
    .map((line) => rewriteColourDeclaration(line))
    .join("\n");
}

const MarkdownIt = require("markdown-it");

const markdown = new MarkdownIt();

/**
 * Every mermaid fenced block in a Markdown document, located with a
 * CommonMark parser (markdown-it) so blocks are found exactly as GitHub
 * renders them: ```mermaid written inline in prose, or quoted inside
 * another code block, is not a diagram (#3490, #3492).
 *
 * `line` is the 1-based line of the opening fence; `source` is the raw
 * text between the fences; `open`/`close` are 0-based line indexes of the
 * fence lines (`close` is -1 when the fence is never closed).
 * @returns {{line: number, source: string, open: number, close: number}[]}
 */
function findMermaidBlocks(content) {
  const lines = content.split("\n");
  const blocks = [];
  for (const token of markdown.parse(content, {})) {
    if (token.type !== "fence" || !token.map) continue;
    if (token.info.trim().split(/\s+/)[0] !== "mermaid") continue;
    const [open, end] = token.map;
    const last = end - 1;
    const closed =
      last > open &&
      new RegExp(`^\\s*${token.markup[0]}{${token.markup.length},}\\s*$`).test(
        lines[last] ?? "",
      );
    const close = closed ? last : -1;
    const source = lines.slice(open + 1, closed ? last : end).join("\n");
    if (!source.trim()) continue;
    blocks.push({ line: open + 1, source, open, close });
  }
  return blocks;
}

/**
 * Apply fixDiagram to every mermaid block in a Markdown document.
 * @returns {{content: string, modified: boolean}}
 */
function fixMarkdown(content) {
  const lines = content.split("\n");
  let modified = false;
  // Replace from the bottom up so earlier line indexes stay valid.
  for (const block of findMermaidBlocks(content).reverse()) {
    if (block.close === -1) continue; // unclosed fence: report, never rewrite
    const fixed = fixDiagram(block.source);
    // Leave blocks untouched unless the fix changes their content, so
    // formatting-only differences cause no churn.
    if (fixed === block.source.replace(/^\n+|\s+$/g, "")) continue;
    lines.splice(
      block.open + 1,
      block.close - block.open - 1,
      ...fixed.split("\n"),
    );
    modified = true;
  }
  return { content: lines.join("\n"), modified };
}

async function main() {
  const changes = [];
  const outputs = [];

  findMarkdownFiles().forEach((file) => {
    const { content, modified } = fixMarkdown(fs.readFileSync(file, "utf-8"));
    if (modified) {
      changes.push({ file, type: "mermaid-update" });
      outputs.push({ file, content });
      if (process.env.DRY_RUN !== "true") {
        fs.writeFileSync(file, content);
      }
    }
  });

  console.log("Mermaid fixes:", changes.length, "files");
  console.log(JSON.stringify(changes, null, 2));

  // Self-check (#3492): every diagram in every file this run changed must
  // pass Mermaid's own parser, so an automated run (the docs bot) fails
  // before it can open a PR that breaks diagrams, as #3435 did.
  if (outputs.length > 0) {
    const { parseFile } = await import("./validation/mermaid-parse.mjs");
    const failures = [];
    for (const { file, content } of outputs) {
      failures.push(...(await parseFile(file, content)));
    }
    if (failures.length > 0) {
      failures.forEach((failure) =>
        console.error(`${failure.file}:${failure.line}: ${failure.message}`),
      );
      console.error(
        `Mermaid self-check failed: ${failures.length} diagram(s) in fixed files do not parse.`,
      );
      process.exitCode = 1;
    }
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}

module.exports = {
  diagramKind,
  findMermaidBlocks,
  fixDiagram,
  fixMarkdown,
  findTypeLineIndex,
  rewriteColourDeclaration,
};
