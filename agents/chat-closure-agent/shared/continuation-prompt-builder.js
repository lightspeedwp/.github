/**
 * Continuation Prompt Builder Module
 * Generates professional handoff prompts for chat session closure.
 */

/**
 * Extract 1-2 sentence summary from git metadata.
 * Combines branch scope with commit messages to create context.
 */
function extractContextSummary(coreAnalysisData) {
  const { parsedBranch, commits, repoType } = coreAnalysisData;

  if (!commits || commits.length === 0) {
    return `Working on ${parsedBranch.scope} in ${repoType} repository.`;
  }

  // Get recent commit subjects
  const recentWork = commits
    .slice(0, 3)
    .map((c) => {
      const subj = c.message.split(":")[1]?.trim() || c.message;
      return subj.substring(0, 50);
    })
    .join(", ");

  return `Implementing ${parsedBranch.scope} in ${repoType}. Recent work: ${recentWork}.`;
}

/**
 * Format projects list as Markdown bullet points.
 */
function formatProjectsList(projects) {
  if (!projects || projects.length === 0) {
    return "- (No active projects found)\n";
  }

  return projects
    .map((proj) => `- [${proj.name}](${proj.link}) — ${proj.description}`)
    .join("\n");
}

/**
 * Format issues as Markdown table.
 */
function formatIssuesTable(issues) {
  if (!issues || issues.length === 0) {
    return (
      "| Issue | Type | Status |\n" +
      "|-------|------|--------|\n" +
      "| (None found) | | |\n"
    );
  }

  let markdown = "| Issue | Type | Status |\n" + "|-------|------|--------|\n";

  issues.forEach((issue) => {
    markdown += `| ${issue.number} | ${issue.type || "task"} | ${issue.status || "open"} |\n`;
  });

  return markdown;
}

/**
 * Format PRs as Markdown table.
 */
function formatPRsTable(prs) {
  if (!prs || prs.length === 0) {
    return (
      "| PR | Title | Status |\n" +
      "|----|-------|--------|\n" +
      "| (None submitted yet) | | |\n"
    );
  }

  let markdown = "| PR | Title | Status |\n" + "|----|-------|--------|\n";

  prs.forEach((pr) => {
    markdown += `| ${pr.number} | ${pr.title} | ${pr.status || "review"} |\n`;
  });

  return markdown;
}

/**
 * Format branch status (commits ahead, changes).
 */
function formatBranchStatus(coreAnalysisData) {
  const { branch, commits, gitState } = coreAnalysisData;

  let markdown = `- **Branch:** ${branch}\n`;
  markdown += `- **Commits in session:** ${commits ? commits.length : 0}\n`;
  markdown += `- **Working directory:** ${gitState.isClean ? "clean ✓" : "dirty (has changes)"}\n`;

  if (!gitState.isClean) {
    if (gitState.staged.length > 0) {
      markdown += `  - **Staged:** ${gitState.staged.length} file(s)\n`;
    }
    if (gitState.uncommitted.length > 0) {
      markdown += `  - **Uncommitted:** ${gitState.uncommitted.length} file(s)\n`;
    }
  }

  return markdown;
}

/**
 * Summarize memory updates from closure metadata.
 */
function summarizeMemoryUpdates(memory) {
  if (!memory) return ["(No memory updates recorded)"];

  const updates = [];

  if (memory.decisions && Object.keys(memory.decisions).length > 0) {
    updates.push(
      `✅ ${Object.keys(memory.decisions).length} key decisions documented`,
    );
  }

  if (memory.nextSteps && memory.nextSteps.length > 0) {
    updates.push(`⏳ ${memory.nextSteps.length} continuation tasks identified`);
  }

  if (memory.blockers && memory.blockers.length > 0) {
    updates.push(
      `⚠️ ${memory.blockers.length} blocker(s): ${memory.blockers.join(", ")}`,
    );
  }

  return updates.length > 0 ? updates : ["(No major updates recorded)"];
}

/**
 * Build complete continuation prompt with all sections.
 */
function buildContinuationPrompt(coreAnalysisData, options = {}) {
  const {
    sessionId,
    projects = [],
    issues = [],
    prs = [],
    memory = {},
  } = options;

  const timestamp = new Date().toISOString();
  const contextSummary = extractContextSummary(coreAnalysisData);
  const memoryUpdates = summarizeMemoryUpdates(memory);

  let markdown = `# Continuation Prompt — Chat Session Handoff\n\n`;
  markdown += `**Session ID:** ${sessionId || "unknown"}\n`;
  markdown += `**Created:** ${timestamp}\n`;
  markdown += `**Branch:** ${coreAnalysisData.branch}\n\n`;

  // Context summary
  markdown += `## Context Summary\n\n`;
  markdown += `${contextSummary}\n\n`;

  // Active projects
  markdown += `## Active Projects\n\n`;
  markdown += formatProjectsList(projects);
  markdown += `\n`;

  // Related issues
  markdown += `## Related Issues\n\n`;
  markdown += formatIssuesTable(issues);
  markdown += `\n`;

  // Related PRs
  markdown += `## Related PRs\n\n`;
  markdown += formatPRsTable(prs);
  markdown += `\n`;

  // Branch status
  markdown += `## Current Branch Status\n\n`;
  markdown += formatBranchStatus(coreAnalysisData);
  markdown += `\n`;

  // Memory updates
  markdown += `## Key Memory Updates\n\n`;
  memoryUpdates.forEach((update) => {
    markdown += `- ${update}\n`;
  });
  markdown += `\n`;

  // Next steps
  markdown += `## Continuation Tasks\n\n`;
  if (memory.nextSteps && memory.nextSteps.length > 0) {
    memory.nextSteps.forEach((step, i) => {
      markdown += `${i + 1}. ${step}\n`;
    });
  } else {
    markdown += `1. (Review related issues and PRs)\n`;
    markdown += `2. (Continue implementation or testing)\n`;
    markdown += `3. (Update memory with progress)\n`;
  }
  markdown += `\n`;

  // Reference materials
  markdown += `## Reference Materials\n\n`;
  markdown += `- [Project README](../../../.github/projects/active/chat-closure-agent-2026-08-12/README.md)\n`;
  markdown += `- [Decision Log](../../../.github/projects/active/chat-closure-agent-2026-08-12/DECISIONS.md)\n`;
  markdown += `- [Implementation Phases](../../../.github/projects/active/chat-closure-agent-2026-08-12/PHASES.md)\n`;

  return {
    title: `Continuation Prompt — Chat Session Handoff`,
    markdown,
    sections: {
      contextSummary,
      projects,
      issues,
      prs,
      branchStatus: coreAnalysisData.branch,
      memoryUpdates,
    },
  };
}

/**
 * Validate continuation prompt structure.
 */
function validatePrompt(prompt) {
  const errors = [];

  if (!prompt.markdown || typeof prompt.markdown !== "string") {
    errors.push("Missing or invalid markdown content");
  }

  if (prompt.markdown.length < 200) {
    errors.push("Prompt too short (< 200 characters)");
  }

  if (
    !prompt.markdown.includes("Context Summary") ||
    !prompt.markdown.includes("Branch Status")
  ) {
    errors.push("Missing required sections");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Format prompt for display (console or file).
 */
function formatPromptForDisplay(prompt, format = "markdown") {
  if (format === "markdown") {
    return prompt.markdown;
  }

  if (format === "text") {
    // Strip markdown syntax for plain text
    return prompt.markdown
      .replace(/#+\s+/g, "")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/\*\*/g, "")
      .replace(/\|/g, "")
      .replace(/`/g, "");
  }

  return prompt.markdown;
}

// Exports
module.exports = {
  extractContextSummary,
  formatProjectsList,
  formatIssuesTable,
  formatPRsTable,
  formatBranchStatus,
  summarizeMemoryUpdates,
  buildContinuationPrompt,
  validatePrompt,
  formatPromptForDisplay,
};
