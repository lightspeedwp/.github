/**
 * issues.agent.js
 *
 * Applies default triage labels (status, priority, type) to newly opened issues
 * when those label categories are not already present. Runs in advisory mode by
 * default; pass --apply to write labels to GitHub.
 *
 * @module scripts/agents/issues.agent.js
 * @see ../../../.github/agents/issues.agent.md
 */

import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BOT_LOGINS = new Set([
  "dependabot[bot]",
  "app/dependabot",
  "github-actions[bot]",
  "imgbot[bot]",
  "app/imgbot",
]);

const KEYWORD_TYPE_MAP = {
  bug: "type:bug",
  fix: "type:bug",
  defect: "type:bug",
  error: "type:bug",
  feature: "type:feature",
  enhancement: "type:feature",
  docs: "type:documentation",
  documentation: "type:documentation",
  chore: "type:task",
  task: "type:task",
  security: "type:security",
  perf: "type:performance",
  performance: "type:performance",
  a11y: "type:a11y",
};

function log(message) {
  const timestamp = new Date().toISOString();
  console.log(`[issues-agent] ${timestamp} ${message}`);
}

function loadIssuePayload() {
  const eventPath = process.env.GITHUB_EVENT_PATH;
  if (!eventPath || !fs.existsSync(eventPath)) {
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(eventPath, "utf-8"));
  } catch (error) {
    log(`Could not parse event payload: ${error.message}`);
    return null;
  }
}

function detectTypeLabel(title = "", body = "") {
  const content = `${title} ${body}`.toLowerCase();
  for (const keyword of Object.keys(KEYWORD_TYPE_MAP)) {
    if (new RegExp(`\\b${keyword}\\b`).test(content)) {
      return KEYWORD_TYPE_MAP[keyword];
    }
  }
  return null;
}

function buildLabelsToApply(payload) {
  const existingLabels = (payload?.issue?.labels || [])
    .map((l) => (typeof l === "string" ? l : l?.name))
    .filter((name) => typeof name === "string");
  const hasStatus = existingLabels.some((l) => l.startsWith("status:"));
  const hasPriority = existingLabels.some((l) => l.startsWith("priority:"));
  const hasType = existingLabels.some((l) => l.startsWith("type:"));

  const toAdd = [];

  if (!hasStatus) toAdd.push("status:needs-triage");
  if (!hasPriority) toAdd.push("priority:normal");

  if (!hasType) {
    const detected = detectTypeLabel(
      payload?.issue?.title || "",
      payload?.issue?.body || "",
    );
    if (detected) toAdd.push(detected);
  }

  return toAdd;
}

async function applyLabels(payload, labelsToAdd) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    log("GITHUB_TOKEN not set; cannot apply labels.");
    return;
  }

  const repo = process.env.GITHUB_REPOSITORY || "";
  if (!repo.includes("/")) {
    log("GITHUB_REPOSITORY not set; cannot apply labels.");
    return;
  }

  const { getOctokit } = await import("@actions/github");
  const octokit = getOctokit(token);
  const [owner, repoName] = repo.split("/");
  const issueNumber = payload.issue.number;

  try {
    await octokit.rest.issues.addLabels({
      owner,
      repo: repoName,
      issue_number: issueNumber,
      labels: labelsToAdd,
    });
    log(`Applied labels to issue #${issueNumber}: ${labelsToAdd.join(", ")}`);
  } catch (error) {
    log(`Failed to apply labels to issue #${issueNumber}: ${error.message}`);
  }
}

async function runIssuesAgent(options = {}) {
  const dryRun = options.dryRun ?? true;
  const payload = loadIssuePayload();

  log(
    `Running issues agent in ${dryRun ? "advisory" : "apply"} mode for ${
      payload?.repository?.full_name || "local"
    }`,
  );

  if (!payload?.issue) {
    log("No issue payload available; skipping.");
    return;
  }

  const author = payload.issue.user?.login || "";
  const isBot = payload.issue.user?.type === "Bot" || BOT_LOGINS.has(author);

  if (isBot) {
    log(`Skipping bot-authored issue #${payload.issue.number} (${author}).`);
    return;
  }

  const labelsToAdd = buildLabelsToApply(payload);

  if (labelsToAdd.length === 0) {
    log(
      `Issue #${payload.issue.number} already has status, priority, and type labels; nothing to apply.`,
    );
    return;
  }

  log(
    `Issue #${payload.issue.number}: "${payload.issue.title}" — labels to apply: ${labelsToAdd.join(", ")}`,
  );

  if (!dryRun) {
    await applyLabels(payload, labelsToAdd);
  } else {
    log("Advisory mode: no labels written.");
  }

  log("Issues agent finished.");
}

export { runIssuesAgent };

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const dryRun = !process.argv.includes("--apply");
  runIssuesAgent({ dryRun }).catch((error) => {
    console.error("[issues-agent] fatal error", error);
    process.exit(1);
  });
}
