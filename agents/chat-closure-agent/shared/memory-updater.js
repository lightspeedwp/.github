/**
 * Memory Updater Module
 * Integrates chat closure metadata into the 10-family YAML memory system.
 */

const fs = require("fs");
const path = require("path");

/**
 * 10-family YAML structure for memory entries.
 * Standard families: user_defaults, project_context, decision_log,
 * execution_state, handoff, and metadata in frontmatter.
 */

/**
 * Format a memory entry with 10-family YAML structure.
 * Returns structured object with frontmatter and families.
 */
function createMemoryEntry(metadata) {
  const {
    sessionId,
    branch,
    repoType,
    issueNumbers,
    commits,
    projectNames,
    decisions,
    blockers,
    nextSteps,
  } = metadata;

  const timestamp = new Date().toISOString();
  const date = timestamp.split("T")[0];

  return {
    frontmatter: {
      name: `chat-closure-${sessionId || date}`,
      description: `Chat closure for session ending on ${date}`,
      metadata: {
        type: "handoff",
        session_id: sessionId,
        branch,
        repo_type: repoType,
        related_issues: issueNumbers || [],
        related_projects: projectNames || [],
        timestamp,
      },
    },
    families: {
      user_defaults: [
        "Prefers moderate-depth handoffs (summary + links, not full recap)",
        "Likes clear Mermaid diagrams with accessibility descriptions",
        "Uses GitHub issue #-references extensively",
        "Appreciates git-based tracking and commits",
      ],
      project_context: [
        `**Branch**: ${branch}`,
        `**Repo type**: ${repoType}`,
        `**Session date**: ${date}`,
        `**Work scope**: ${describeWorkScope(commits, repoType)}`,
      ],
      decision_log:
        decisions && Object.keys(decisions).length > 0
          ? Object.entries(decisions).map(
              ([key, value]) =>
                `✅ **${key}**: ${value.choice} — ${value.rationale}`,
            )
          : ["(No major decisions documented)"],
      execution_state: [
        `✅ Commits: ${commits ? commits.length : 0} in this session`,
        `✅ Issues referenced: ${issueNumbers ? issueNumbers.join(", ") : "none"}`,
        blockers
          ? `⚠️ **Blockers**: ${blockers.join(", ")}`
          : "✅ No blockers identified",
        `⏳ **Next steps**: ${nextSteps ? nextSteps.join("; ") : "TBD in next session"}`,
      ],
      handoff: [
        `**Summary**: Session work on ${branch} (${repoType}). See project context and execution state for details.`,
        `**Continuation**: Create new chat with continuation prompt template (below).`,
        `**Memory entry**: Save as \`.remember/${date}-session-summary.md\``,
        `**Related issues**: ${issueNumbers ? issueNumbers.join(", ") : "None identified"}`,
      ],
    },
  };
}

/**
 * Format memory entry as Markdown string (frontmatter + families).
 */
function formatMemoryAsMarkdown(entry) {
  const { frontmatter, families } = entry;

  // Build frontmatter
  let markdown = "---\n";
  markdown += `name: ${frontmatter.name}\n`;
  markdown += `description: "${frontmatter.description}"\n`;
  markdown += "metadata:\n";
  Object.entries(frontmatter.metadata).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      markdown += `  ${key}: [${value.map((v) => `"${v}"`).join(", ")}]\n`;
    } else {
      markdown += `  ${key}: "${value}"\n`;
    }
  });
  markdown += "---\n\n";

  // Build families sections
  Object.entries(families).forEach(([familyName, items]) => {
    markdown += `## ${formatFamilyName(familyName)}\n\n`;
    if (Array.isArray(items)) {
      items.forEach((item) => {
        markdown += `- ${item}\n`;
      });
    } else {
      markdown += `${items}\n`;
    }
    markdown += "\n";
  });

  return markdown;
}

/**
 * Update MEMORY.md index with new entry reference.
 */
function updateMemoryIndex(repoPath, entryName, description) {
  const memoryIndex = path.join(repoPath, ".remember", "MEMORY.md");

  if (!fs.existsSync(memoryIndex)) {
    // Create new index
    const indexContent =
      `# Memory Index\n\nCentral registry of session handoff and memory entries.\n\n` +
      `- [${entryName}](./${entryName}.md) — ${description}\n`;
    fs.writeFileSync(memoryIndex, indexContent);
    return { created: true, modified: false };
  }

  // Append to existing index
  const content = fs.readFileSync(memoryIndex, "utf8");
  const newLine = `- [${entryName}](./${entryName}.md) — ${description}\n`;

  // Check if entry already exists
  if (content.includes(`[${entryName}]`)) {
    return { created: false, modified: false, reason: "Entry already exists" };
  }

  // Append to end (before any footer if present)
  const updated = content.replace(/\n$/, "") + "\n" + newLine;
  fs.writeFileSync(memoryIndex, updated);
  return { created: false, modified: true };
}

/**
 * Write memory entry to .remember directory.
 */
function writeMemoryEntry(repoPath, memoryEntry, overwrite = false) {
  const memoryDir = path.join(repoPath, ".remember");
  const filename = `${memoryEntry.frontmatter.name}.md`;
  const filepath = path.join(memoryDir, filename);

  // Create .remember directory if needed
  if (!fs.existsSync(memoryDir)) {
    fs.mkdirSync(memoryDir, { recursive: true });
  }

  // Check for existing file
  if (fs.existsSync(filepath) && !overwrite) {
    return {
      written: false,
      error: "Memory entry already exists",
      path: filepath,
    };
  }

  const markdown = formatMemoryAsMarkdown(memoryEntry);
  fs.writeFileSync(filepath, markdown);

  // Update index
  const indexResult = updateMemoryIndex(
    repoPath,
    memoryEntry.frontmatter.name,
    memoryEntry.frontmatter.description,
  );

  return {
    written: true,
    path: filepath,
    indexUpdated: indexResult.modified || indexResult.created,
  };
}

/**
 * Read and parse existing memory entry.
 */
function readMemoryEntry(repoPath, entryName) {
  const filepath = path.join(repoPath, ".remember", `${entryName}.md`);

  if (!fs.existsSync(filepath)) {
    return { found: false, error: "Memory entry not found" };
  }

  const content = fs.readFileSync(filepath, "utf8");

  // Parse frontmatter
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) {
    return { found: false, error: "Invalid memory entry format" };
  }

  const frontmatterText = frontmatterMatch[1];
  const bodyText = content.substring(frontmatterMatch[0].length).trim();

  return {
    found: true,
    frontmatter: parseFrontmatter(frontmatterText),
    body: bodyText,
  };
}

/**
 * Parse YAML-like frontmatter (simplified parser).
 */
function parseFrontmatter(text) {
  const result = {};
  const lines = text.split("\n");

  for (const line of lines) {
    if (!line.trim() || line.startsWith("#")) continue;

    const colonIndex = line.indexOf(":");
    if (colonIndex === -1) continue;

    const key = line.substring(0, colonIndex).trim();
    const value = line.substring(colonIndex + 1).trim();

    // Handle different value types
    if (value.startsWith("[") && value.endsWith("]")) {
      result[key] = value
        .slice(1, -1)
        .split(",")
        .map((v) => v.trim().replace(/^"/, "").replace(/"$/, ""));
    } else if (value.startsWith('"') && value.endsWith('"')) {
      result[key] = value.slice(1, -1);
    } else {
      result[key] = value;
    }
  }

  return result;
}

/**
 * Format family name from snake_case to Title Case.
 */
function formatFamilyName(familyName) {
  return familyName
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Generate a description of work scope based on commits and repo type.
 */
function describeWorkScope(commits, repoType) {
  if (!commits || commits.length === 0) return "No commits recorded";

  const messageTypes = commits.reduce((acc, c) => {
    const type = c.message.split(":")[0].toLowerCase();
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const types = Object.entries(messageTypes)
    .map(([type, count]) => `${count} ${type}`)
    .join(", ");

  return `${repoType} repo, ${commits.length} commits: ${types}`;
}

/**
 * Main function to create and save a complete memory entry from closure metadata.
 */
function updateMemoryForSessionClosure(
  repoPath,
  coreAnalysisData,
  options = {},
) {
  const {
    decisions = {},
    blockers = [],
    nextSteps = [],
    projectNames = [],
    overwrite = false,
  } = options;

  // Create memory entry
  const memoryEntry = createMemoryEntry({
    sessionId:
      options.sessionId ||
      new Date().toISOString().split("T")[0].replace(/-/g, ""),
    branch: coreAnalysisData.branch,
    repoType: coreAnalysisData.repoType,
    issueNumbers: coreAnalysisData.issueNumbers,
    commits: coreAnalysisData.commits,
    projectNames,
    decisions,
    blockers,
    nextSteps,
  });

  // Write to disk
  const result = writeMemoryEntry(repoPath, memoryEntry, overwrite);

  // Format for display
  const markdown = formatMemoryAsMarkdown(memoryEntry);

  return {
    ...result,
    entry: memoryEntry,
    markdown,
  };
}

// Exports
module.exports = {
  createMemoryEntry,
  formatMemoryAsMarkdown,
  updateMemoryIndex,
  writeMemoryEntry,
  readMemoryEntry,
  parseFrontmatter,
  updateMemoryForSessionClosure,
};
