const fs = require("fs");
const path = require("path");

const sixMonthsAgo = new Date();
sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

function findMarkdownFiles(dir = ".") {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory() && !entry.name.startsWith(".")) {
      files.push(...findMarkdownFiles(path.join(dir, entry.name)));
    } else if (entry.name.endsWith(".md") && entry.isFile()) {
      files.push(path.join(dir, entry.name));
    }
  }
  return files;
}

const files = findMarkdownFiles();
const changes = [];
const today = new Date().toISOString().split("T")[0];

files.forEach((file) => {
  let content = fs.readFileSync(file, "utf-8");
  const frontmatterMatch = content.match(/^---\n([^]*?)\n---/);

  if (frontmatterMatch) {
    const frontmatter = frontmatterMatch[1];
    const lastUpdatedMatch = frontmatter.match(
      /last_updated:\s*["']?([^"'\n]+)/,
    );

    if (lastUpdatedMatch) {
      const lastUpdated = new Date(lastUpdatedMatch[1]);
      if (lastUpdated < sixMonthsAgo) {
        const newFrontmatter = frontmatter.replace(
          /last_updated:\s*["']?[^"'\n]+/,
          'last_updated: "' + today + '"',
        );
        const newContent = content.replace(
          frontmatterMatch[0],
          "---\n" + newFrontmatter + "\n---",
        );

        changes.push({ file, type: "staleness-update", lastUpdated });
        if (process.env.DRY_RUN !== "true") {
          fs.writeFileSync(file, newContent);
        }
      }
    }
  }
});

console.log("Staleness updates:", changes.length, "files");
console.log(JSON.stringify(changes, null, 2));
