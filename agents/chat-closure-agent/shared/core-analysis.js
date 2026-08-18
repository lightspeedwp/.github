/**
 * Core Analysis Module
 * Extracts git metadata and analyzes repository state for chat closure workflows.
 */

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

/**
 * Parse branch name into type, scope, and title.
 * Expected format: {type}/{scope}-{title}
 * Example: feat/chat-closure-agent-impl → { type: 'feat', scope: 'chat-closure', title: 'agent-impl' }
 */
function parseBranchName(branchName) {
  const pattern = /^([a-z]+)\/([\w-]+)-(.+)$/;
  const match = branchName.match(pattern);

  if (!match) {
    throw new Error(
      `Invalid branch name format: "${branchName}". Expected: {type}/{scope}-{title}`,
    );
  }

  return {
    type: match[1],
    scope: match[2],
    title: match[3],
  };
}

/**
 * Detect repository type by checking for marker files.
 */
function detectRepoType(repoPath = ".") {
  const checkFile = (filePath) => fs.existsSync(path.join(repoPath, filePath));

  // Control-plane detection
  if (checkFile(".github/projects/active") && checkFile(".github/labels.yml")) {
    return "control-plane";
  }

  // WordPress plugin detection
  if (checkFile("plugin.php") && checkFile("composer.json")) {
    return "wordpress-plugin";
  }

  // WordPress theme detection
  if (checkFile("style.css") && checkFile("theme.json")) {
    return "wordpress-theme";
  }

  throw new Error(`Unknown repository type at ${repoPath}`);
}

/**
 * Get recent commits from git repository.
 */
function getRecentCommits(repoPath = ".", count = 20) {
  try {
    const format = "%H%n%s%n%an%n%ai%n---";
    const gitLog = execFileSync(
      "git",
      ["-C", repoPath, "log", `--format=${format}`, `-n`, String(count)],
      { encoding: "utf8" },
    );

    const commits = [];
    const entries = gitLog.split("---").filter((e) => e.trim());

    for (const entry of entries) {
      const lines = entry
        .trim()
        .split("\n")
        .filter((l) => l.trim());
      if (lines.length >= 4) {
        commits.push({
          hash: lines[0],
          message: lines[1],
          author: lines[2],
          date: lines[3],
        });
      }
    }

    return commits;
  } catch (error) {
    throw new Error(`Failed to get commits from ${repoPath}: ${error.message}`);
  }
}

/**
 * Extract issue numbers from commit messages.
 * Looks for #XXXX pattern in commit messages.
 */
function extractIssueNumbers(commits) {
  const issueSet = new Set();
  const issuePattern = /#(\d+)/g;

  for (const commit of commits) {
    const matches = commit.message.matchAll(issuePattern);
    for (const match of matches) {
      issueSet.add(`#${match[1]}`);
    }
  }

  return Array.from(issueSet).sort((a, b) => {
    const numA = parseInt(a.slice(1), 10);
    const numB = parseInt(b.slice(1), 10);
    return numB - numA;
  });
}

/**
 * Read memory system state from .remember directory.
 */
function readMemoryState(repoPath = ".") {
  const memoryDir = path.join(repoPath, ".remember");
  const memoryIndex = path.join(memoryDir, "MEMORY.md");

  const result = {
    exists: fs.existsSync(memoryDir),
    indexExists: fs.existsSync(memoryIndex),
    files: [],
    lastUpdated: null,
  };

  if (result.exists) {
    result.files = fs
      .readdirSync(memoryDir)
      .filter((f) => f.endsWith(".md") && f !== "MEMORY.md");
  }

  if (result.indexExists) {
    const stat = fs.statSync(memoryIndex);
    result.lastUpdated = stat.mtime.toISOString();
  }

  return result;
}

/**
 * Analyze git state (clean/dirty, staged, uncommitted).
 */
function analyzeGitState(repoPath = ".") {
  try {
    const status = execFileSync(
      "git",
      ["-C", repoPath, "status", "--porcelain"],
      { encoding: "utf8" },
    );

    const lines = status.split("\n").filter((l) => l.trim());
    const staged = [];
    const uncommitted = [];

    for (const line of lines) {
      const status_code = line.slice(0, 2);
      const file = line.slice(3);

      if (status_code[0] !== " ") {
        staged.push(file);
      }
      if (status_code[1] !== " ") {
        uncommitted.push(file);
      }
    }

    return {
      isClean: lines.length === 0,
      staged,
      uncommitted,
      hasChanges: lines.length > 0,
    };
  } catch (error) {
    throw new Error(`Failed to analyze git state: ${error.message}`);
  }
}

/**
 * Get current git branch name.
 */
function getCurrentBranch(repoPath = ".") {
  try {
    return execFileSync("git", ["-C", repoPath, "branch", "--show-current"], {
      encoding: "utf8",
    }).trim();
  } catch (error) {
    throw new Error(`Failed to get current branch: ${error.message}`);
  }
}

/**
 * Main analysis function that orchestrates all metadata extraction.
 */
function analyzeRepository(repoPath = ".") {
  const branch = getCurrentBranch(repoPath);
  const parsedBranch = parseBranchName(branch);
  const repoType = detectRepoType(repoPath);
  const commits = getRecentCommits(repoPath);
  const issueNumbers = extractIssueNumbers(commits);
  const gitState = analyzeGitState(repoPath);
  const memoryState = readMemoryState(repoPath);

  return {
    branch,
    parsedBranch,
    repoType,
    commits,
    issueNumbers,
    gitState,
    memoryState,
    timestamp: new Date().toISOString(),
  };
}

// Exports
module.exports = {
  parseBranchName,
  detectRepoType,
  getRecentCommits,
  extractIssueNumbers,
  readMemoryState,
  analyzeGitState,
  getCurrentBranch,
  analyzeRepository,
};
