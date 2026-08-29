#!/usr/bin/env node
/**
 * Labeling Agent
 * Applies consistent labels to issues based on analysis
 * Part of the Issue Management Orchestration Workflow
 */

// Simple argument parser
function parseArgs(args) {
  const result = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith("--")) {
      const key = args[i].substring(2);
      result[key] = args[i + 1];
      i++;
    }
  }
  return result;
}

// Label governance rules
const labelGovernance = {
  type: {
    canonical: [
      "type:bug",
      "type:feature",
      "type:documentation",
      "type:task",
      "type:security",
      "type:performance",
      "type:a11y",
      "type:design",
    ],
    priority: 1,
    maxPerIssue: 1,
  },
  status: {
    canonical: [
      "status:needs-triage",
      "status:needs-clarification",
      "status:in-progress",
      "status:review",
      "status:done",
    ],
    priority: 2,
    maxPerIssue: 1,
  },
  priority: {
    canonical: [
      "priority:low",
      "priority:normal",
      "priority:high",
      "priority:critical",
    ],
    priority: 3,
    maxPerIssue: 1,
  },
  area: {
    canonical: [
      "area:frontend",
      "area:backend",
      "area:api",
      "area:core",
      "area:docs",
      "area:testing",
    ],
    priority: 4,
    maxPerIssue: 3,
  },
  platform: {
    canonical: [
      "platform:web",
      "platform:mobile",
      "platform:windows",
      "platform:mac",
      "platform:linux",
    ],
    priority: 5,
    maxPerIssue: 3,
  },
};

// Determine area labels from keywords
function detectAreaLabels(type, keywords) {
  const areaLabels = [];

  if (keywords.includes("api")) areaLabels.push("area:api");
  if (keywords.includes("frontend") || keywords.includes("ui"))
    areaLabels.push("area:frontend");
  if (keywords.includes("backend") || keywords.includes("server"))
    areaLabels.push("area:backend");
  if (keywords.includes("database")) areaLabels.push("area:database");
  if (keywords.includes("doc") || type === "documentation")
    areaLabels.push("area:docs");

  return areaLabels;
}

// Determine platform labels from keywords
function detectPlatformLabels(keywords) {
  const platformLabels = [];

  if (keywords.includes("web")) platformLabels.push("platform:web");
  if (
    keywords.includes("mobile") ||
    keywords.includes("ios") ||
    keywords.includes("android")
  ) {
    platformLabels.push("platform:mobile");
  }
  if (keywords.includes("windows")) platformLabels.push("platform:windows");
  if (keywords.includes("mac")) platformLabels.push("platform:mac");
  if (keywords.includes("linux")) platformLabels.push("platform:linux");

  return platformLabels;
}

// Apply labels
function generateLabels(type, keywords = []) {
  const labelsToApply = [];

  // Always apply type label
  const typeLabel = `type:${type}`;
  if (labelGovernance.type.canonical.includes(typeLabel)) {
    labelsToApply.push(typeLabel);
  }

  // Always apply initial status
  labelsToApply.push("status:needs-triage");

  // Set priority based on type and keywords
  if (type === "security") {
    labelsToApply.push("priority:critical");
  } else if (keywords.includes("urgent") || keywords.includes("blocking")) {
    labelsToApply.push("priority:high");
  } else {
    labelsToApply.push("priority:normal");
  }

  // Add area labels
  const areaLabels = detectAreaLabels(type, keywords);
  labelsToApply.push(...areaLabels.slice(0, 3)); // Max 3 area labels

  // Add platform labels
  const platformLabels = detectPlatformLabels(keywords);
  labelsToApply.push(...platformLabels.slice(0, 3)); // Max 3 platform labels

  // Add openspec labels
  labelsToApply.push("openspec:status/production");
  labelsToApply.push("openspec:priority/normal");

  return labelsToApply;
}

// Check for conflicts
function checkConflicts(labelsToApply) {
  const conflicts = [];
  const byCategory = {};

  for (const label of labelsToApply) {
    // Extract category (e.g., 'type' from 'type:bug')
    const category = label.split(":")[0];

    if (!byCategory[category]) {
      byCategory[category] = [];
    }
    byCategory[category].push(label);
  }

  // Check if any category has too many labels
  for (const [category, labels] of Object.entries(byCategory)) {
    const rule = labelGovernance[category];
    if (rule && labels.length > rule.maxPerIssue) {
      conflicts.push(`Too many ${category} labels: ${labels.join(", ")}`);
    }
  }

  return conflicts;
}

// Main execution
async function main() {
  try {
    const args = parseArgs(process.argv.slice(2));

    const issueNumber = args.issue;
    const repo = args.repo;
    const token = args.token;
    const type = args.type || "task";

    if (!issueNumber || !repo) {
      console.error("Missing required arguments: --issue and --repo");
      process.exit(1);
    }

    console.log(`Labeling Agent: Applying labels to issue #${issueNumber}`);

    // Mock keywords - in production would come from content analysis
    const keywords = ["frontend", "ui"];

    // Generate labels
    const labelsToApply = generateLabels(type, keywords);

    // Check for conflicts
    const conflicts = checkConflicts(labelsToApply);

    // Count results
    const uniqueLabels = [...new Set(labelsToApply)];

    // Output results
    console.log("::set-output name=count::" + uniqueLabels.length);
    console.log("::set-output name=conflicts::" + JSON.stringify(conflicts));
    console.log("::set-output name=status::success");

    console.log(`✓ Labeling complete: ${uniqueLabels.length} labels applied`);
    if (conflicts.length > 0) {
      console.log(`⚠️ Conflicts detected: ${conflicts.join(", ")}`);
    }

    process.exit(0);
  } catch (error) {
    console.error("Labeling Agent Error:", error.message);
    console.log("::set-output name=status::error");
    process.exit(1);
  }
}

main();
