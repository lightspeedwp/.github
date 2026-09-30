/**
 * Reference Linker
 * Extract PR/issue numbers and build rich links for changelog entries
 */

/**
 * Extract PR references from text
 * Matches patterns like #123, PR #123, pull request #123
 * @param {string} text - Text to search
 * @returns {Array} Array of PR numbers found
 */
function extractPRReferences(text) {
  if (!text) return [];

  const matches = [];
  let match;

  // More strict pattern - look for #123 or explicit PR references
  const strictPattern = /#(\d+)|PR\s+#?(\d+)|pull\s+request\s+#?(\d+)/gi;

  while ((match = strictPattern.exec(text)) !== null) {
    const prNum = match[1] || match[2] || match[3];
    if (prNum && !matches.includes(parseInt(prNum))) {
      matches.push(parseInt(prNum));
    }
  }

  return matches;
}

/**
 * Extract issue references from text
 * Matches patterns like #456 (when not part of PR reference)
 * @param {string} text - Text to search
 * @returns {Array} Array of issue numbers found
 */
function extractIssueReferences(text) {
  if (!text) return [];

  const issuePattern = /(?<!PR\s)#(\d+)/g;
  const matches = [];
  let match;

  while ((match = issuePattern.exec(text)) !== null) {
    const issueNum = parseInt(match[1]);
    if (issueNum && !matches.includes(issueNum)) {
      matches.push(issueNum);
    }
  }

  return matches;
}

/**
 * Build GitHub URL for a PR
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {number} prNumber - PR number
 * @returns {string} Full GitHub PR URL
 */
function buildPRUrl(owner, repo, prNumber) {
  return `https://github.com/${owner}/${repo}/pull/${prNumber}`;
}

/**
 * Build GitHub URL for an issue
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {number} issueNumber - Issue number
 * @returns {string} Full GitHub issue URL
 */
function buildIssueUrl(owner, repo, issueNumber) {
  return `https://github.com/${owner}/${repo}/issues/${issueNumber}`;
}

/**
 * Build Markdown link
 * @param {string} url - URL to link to
 * @param {string} text - Link text
 * @returns {string} Markdown link
 */
function buildMarkdownLink(url, text) {
  return `[${text}](${url})`;
}

/**
 * Enrich entry with validated links
 * @param {Object} entry - Entry to enrich
 * @param {Array} validationResults - Array of { type: 'pr'|'issue', number, valid, url }
 * @returns {Object} Enriched entry with links
 */
function enrichEntryWithLinks(entry, validationResults = []) {
  const enriched = {
    ...entry,
    pr_links: [],
    issue_links: [],
    linked_text: entry.text || "",
  };

  // Build links from validation results
  for (const result of validationResults) {
    if (result.type === "pr") {
      enriched.pr_links.push({
        number: result.number,
        url: result.url,
        valid: result.valid,
      });
    } else if (result.type === "issue") {
      enriched.issue_links.push({
        number: result.number,
        url: result.url,
        valid: result.valid,
      });
    }
  }

  // Generate linked text for Markdown rendering
  let linkedText = enriched.text || "";

  // Replace PR references with links
  for (const prLink of enriched.pr_links) {
    if (prLink.url) {
      const pattern = new RegExp(`#${prLink.number}(?![0-9])`, "g");
      const link = buildMarkdownLink(
        prLink.url,
        `#${prLink.number}`,
      );
      linkedText = linkedText.replace(pattern, link);
    }
  }

  // Replace issue references with links
  for (const issueLink of enriched.issue_links) {
    if (issueLink.url) {
      const pattern = new RegExp(`#${issueLink.number}(?![0-9])`, "g");
      const link = buildMarkdownLink(
        issueLink.url,
        `#${issueLink.number}`,
      );
      linkedText = linkedText.replace(pattern, link);
    }
  }

  enriched.linked_text = linkedText;
  return enriched;
}

/**
 * Format entry with links for external display (user-facing)
 * Removes implementation details, includes context links
 * @param {Object} entry - Entry to format
 * @returns {string} Formatted text for release notes
 */
function formatForReleaseNotes(entry) {
  let output = entry.linked_text || entry.text || "";

  // Remove common implementation details patterns
  // Remove code patterns
  output = output.replace(/`[^`]+`/g, (match) => {
    // Keep link references but strip code blocks
    if (match.includes("http")) {
      return match;
    }
    return "";
  });

  // Remove technical jargon
  const technicalPatterns = [
    /API\s+(?:endpoint|response|request)/gi,
    /(?:HTTP|REST|GraphQL)\s+\d+/gi,
    /database\s+query/gi,
    /algorithm\|process\|optimization/gi,
  ];

  for (const pattern of technicalPatterns) {
    output = output.replace(pattern, "");
  }

  return output.trim();
}

/**
 * Create a reference summary
 * @param {Array} pr_links - PR links array
 * @param {Array} issue_links - Issue links array
 * @returns {string} Summary of references
 */
function createReferenceSummary(pr_links = [], issue_links = []) {
  const parts = [];

  if (pr_links.length > 0) {
    const prTexts = pr_links.map(
      (pr) => `[#${pr.number}](${pr.url})`,
    );
    parts.push(`PR: ${prTexts.join(", ")}`);
  }

  if (issue_links.length > 0) {
    const issueTexts = issue_links.map(
      (issue) => `[#${issue.number}](${issue.url})`,
    );
    parts.push(`Issues: ${issueTexts.join(", ")}`);
  }

  return parts.join(" | ");
}

module.exports = {
  extractPRReferences,
  extractIssueReferences,
  buildPRUrl,
  buildIssueUrl,
  buildMarkdownLink,
  enrichEntryWithLinks,
  formatForReleaseNotes,
  createReferenceSummary,
};
