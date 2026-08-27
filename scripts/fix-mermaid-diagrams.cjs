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

const markdownFiles = findMarkdownFiles();
const changes = [];

markdownFiles.forEach((file) => {
  let content = fs.readFileSync(file, "utf-8");
  let modified = false;

  content = content.replace(/```mermaid([^]*?)```/g, (match, diagram) => {
    let nextDiagram = diagram.trim();
    if (!nextDiagram) return match;

    if (!nextDiagram.includes("accTitle:")) {
      const firstLine = nextDiagram.split("\n")[0];
      if (firstLine && !firstLine.startsWith("--")) {
        const diagType = firstLine.toLowerCase();
        let title = "Diagram";
        if (diagType.includes("graph")) title = "Graph Diagram";
        if (diagType.includes("flowchart")) title = "Flowchart";
        if (diagType.includes("sequence")) title = "Sequence Diagram";
        if (diagType.includes("gantt")) title = "Gantt Chart";

        nextDiagram = `accTitle: ${title}\n${nextDiagram}`;
        modified = true;
      }
    }

    if (!nextDiagram.includes("accDescr:")) {
      nextDiagram = `${nextDiagram}\naccDescr: Detailed diagram`;
      modified = true;
    }

    nextDiagram = nextDiagram
      .split("\n")
      .map((line) => {
        const rewritten = rewriteColourDeclaration(line);
        if (rewritten !== line) modified = true;
        return rewritten;
      })
      .join("\n");

    return `\`\`\`mermaid\n${nextDiagram}\n\`\`\``;
  });

  if (modified) {
    changes.push({ file, type: "mermaid-update" });
    if (process.env.DRY_RUN !== "true") {
      fs.writeFileSync(file, content);
    }
  }
});

console.log("Mermaid fixes:", changes.length, "files");
console.log(JSON.stringify(changes, null, 2));
