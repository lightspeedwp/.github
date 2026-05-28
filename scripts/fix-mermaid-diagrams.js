const fs = require("fs");
const path = require("path");

function findReadmeFiles(dir = ".") {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory() && !entry.name.startsWith(".")) {
      files.push(...findReadmeFiles(path.join(dir, entry.name)));
    } else if (entry.name === "README.md" && entry.isFile()) {
      files.push(path.join(dir, entry.name));
    }
  }
  return files;
}

const readmes = findReadmeFiles();
const changes = [];

readmes.forEach((file) => {
  let content = fs.readFileSync(file, "utf-8");
  let modified = false;

  // Fix Mermaid diagram formatting and add accessibility
  content = content.replace(/```mermaid([^]*?)```/g, (match, diagram) => {
    // Add accTitle if missing
    if (!diagram.includes("accTitle:") && diagram.trim()) {
      const firstLine = diagram.trim().split("\n")[0];
      if (firstLine && !firstLine.startsWith("--")) {
        const diagType = firstLine.toLowerCase();
        let title = "Diagram";
        if (diagType.includes("graph")) title = "Graph Diagram";
        if (diagType.includes("flowchart")) title = "Flowchart";
        if (diagType.includes("sequence")) title = "Sequence Diagram";
        if (diagType.includes("gantt")) title = "Gantt Chart";

        modified = true;
        return (
          "```mermaid\naccTitle: " + title + "\n" + diagram.trim() + "\n```"
        );
      }
    }

    // Add accDescr if missing
    if (!diagram.includes("accDescr:")) {
      modified = true;
      return (
        "```mermaid\n" + diagram.trim() + "\naccDescr: Detailed diagram\n```"
      );
    }

    return match;
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
