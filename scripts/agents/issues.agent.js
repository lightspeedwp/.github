/**
 * issues.agent.js
 *
 * Advisory implementation for the Issues agent. Provides lightweight
 * recommendations without mutating GitHub state. Extend with API calls when
 * ready to automate labelling and enrichment.
 * @module scripts/agents/issues.agent.js
 * @see ../../agents/issues.agent.md
 */


const fs = require("fs");
const path = require("path");
const __filename = __filename || process.argv[1];
const __dirname = __dirname || path.dirname(__filename);

const DEFAULT_LABELS = ["status:needs-triage", "priority:normal"];
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
    if (content.includes(keyword)) {
      return KEYWORD_TYPE_MAP[keyword];
    }
  }
  return null;
}

function buildRecommendations(payload) {
  const labels = new Set(DEFAULT_LABELS);
  const title = payload?.issue?.title || "";
  const body = payload?.issue?.body || "";
  const detectedType = detectTypeLabel(title, body);

  if (detectedType) {
    labels.add(detectedType);
  }

  return {
    labels: Array.from(labels),
    detectedType,
  };
}

async function runIssuesAgent(options = {}) {
  const dryRun = options.dryRun ?? true;
  const payload = loadIssuePayload();
  const repoRoot = path.resolve(__dirname, "..", "..");

  log(
    `Running issues agent in ${dryRun ? "advisory" : "apply"} mode for ${
      payload?.repository?.full_name || "local"
    }`,
  );

  if (!payload?.issue) {
    log("No issue payload available; exiting after advisory run.");
    return;
  }

  const recommendations = buildRecommendations(payload);

  log(
    `Issue #${payload.issue.number}: "${payload.issue.title}" — recommended labels: ${recommendations.labels.join(
      ", ",
    )}`,
  );

  if (!dryRun) {
    // TODO: Implement apply mode automation (labels/comments) once the full agent workflow is ready.
    log("Apply mode requested but automation is not implemented yet.");
  }

  log(`Working directory: ${repoRoot}`);
  log("Issues agent finished without errors.");
}


module.exports = {
  runIssuesAgent,
};

if (require.main === module) {
  const dryRun = !process.argv.includes("--apply");
  runIssuesAgent({ dryRun }).catch((error) => {
    console.error("[issues-agent] fatal error", error);
    process.exit(1);
  });
}
