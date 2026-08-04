#!/usr/bin/env node
/* eslint-disable no-console */

const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const { getOctokit } = require("@actions/github");

const COMMENT_MARKER = "<!-- metadata-governance -->";
const GHSA_RE = /\bGHSA-[A-Z0-9-]+\b/gi;
const CVE_RE = /\bCVE-\d{4}-\d{4,7}\b/gi;

function readJsonFile(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function readConfig(configPath) {
  return yaml.load(fs.readFileSync(configPath, "utf8"));
}

function normaliseTitle(title) {
  return String(title || "")
    .replace(/^\[[^\]]+\]\s*/, "")
    .replace(/\s+/g, " ")
    .trim();
}

function getActorLogin(event) {
  return (
    event?.sender?.login ||
    event?.issue?.user?.login ||
    event?.pull_request?.user?.login ||
    ""
  );
}

function getItemFromEvent(event) {
  if (event.pull_request) {
    return {
      kind: "pull_request",
      number: event.pull_request.number,
      nodeId: event.pull_request.node_id,
      title: event.pull_request.title || "",
      body: event.pull_request.body || "",
      labels: Array.isArray(event.pull_request.labels)
        ? event.pull_request.labels
        : [],
      milestone: event.pull_request.milestone || null,
      author: event.pull_request.user?.login || "",
    };
  }

  return {
    kind: "issue",
    number: event.issue.number,
    nodeId: event.issue.node_id,
    title: event.issue.title || "",
    body: event.issue.body || "",
    labels: Array.isArray(event.issue.labels) ? event.issue.labels : [],
    milestone: event.issue.milestone || null,
    author: event.issue.user?.login || "",
  };
}

function extractIssueRefs(text) {
  const refs = new Set();
  const source = String(text || "");
  const matches = source.matchAll(/#(\d+)/g);

  for (const match of matches) {
    const value = Number(match[1]);
    if (Number.isInteger(value) && value > 0) {
      refs.add(value);
    }
  }

  return [...refs];
}

function extractSecurityRefs(text) {
  const source = String(text || "");
  return [
    ...new Set([
      ...(source.match(GHSA_RE) || []),
      ...(source.match(CVE_RE) || []),
    ]),
  ];
}

function parseRelationshipHints(body) {
  const lines = String(body || "")
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trim());

  const linkedRefs = new Set();
  const parentRefs = new Set();
  const childRefs = new Set();
  const blocksRefs = new Set();
  const blockedByRefs = new Set();
  const securityRefs = new Set();

  for (const line of lines) {
    const lower = line.toLowerCase();
    const refs = extractIssueRefs(line);

    if (
      lower.startsWith("fixes ") ||
      lower.startsWith("fixes:") ||
      lower.startsWith("closes ") ||
      lower.startsWith("closes:") ||
      lower.startsWith("resolves ") ||
      lower.startsWith("resolves:") ||
      lower.startsWith("relates to ") ||
      lower.startsWith("relates to:") ||
      lower.startsWith("related to ") ||
      lower.startsWith("related to:")
    ) {
      refs.forEach((ref) => linkedRefs.add(ref));
    } else if (
      lower.startsWith("parent issue:") ||
      lower.startsWith("parent:")
    ) {
      refs.forEach((ref) => parentRefs.add(ref));
    } else if (
      lower.startsWith("child issue:") ||
      lower.startsWith("child issues:") ||
      lower.startsWith("child:") ||
      lower.startsWith("children:") ||
      lower.startsWith("sub-issues:") ||
      lower.startsWith("sub-issue:")
    ) {
      refs.forEach((ref) => childRefs.add(ref));
    } else if (lower.startsWith("blocks:") || lower.startsWith("blocks ")) {
      refs.forEach((ref) => blocksRefs.add(ref));
    } else if (
      lower.startsWith("blocked by:") ||
      lower.startsWith("blocked by ")
    ) {
      refs.forEach((ref) => blockedByRefs.add(ref));
    }

    if (/security alert|security advisory|ghsa|cve/i.test(line)) {
      extractSecurityRefs(line).forEach((ref) => securityRefs.add(ref));
    }
  }

  return {
    linkedRefs: [...linkedRefs],
    parentRefs: [...parentRefs],
    childRefs: [...childRefs],
    blocksRefs: [...blocksRefs],
    blockedByRefs: [...blockedByRefs],
    securityRefs: [...securityRefs],
    hasBidirectionalBlocking:
      blocksRefs.size > 0 || blockedByRefs.size > 0,
  };
}

function formatRelationshipComment(item, hints, milestoneSummary, assignee) {
  const lines = [
    COMMENT_MARKER,
    "## Metadata governance",
    `- Item: #${item.number}`,
    `- Assignee: ${assignee || item.author || "unassigned"}`,
    `- Milestone: ${milestoneSummary || "none"}`,
  ];

  if (hints.linkedRefs.length > 0) {
    lines.push(
      `- Linked issues/PRs: ${hints.linkedRefs.map((ref) => `#${ref}`).join(", ")}`,
    );
  }

  if (hints.parentRefs.length > 0) {
    lines.push(
      `- Parent issue: ${hints.parentRefs.map((ref) => `#${ref}`).join(", ")}`,
    );
  }

  if (hints.childRefs.length > 0) {
    lines.push(
      `- Child issues: ${hints.childRefs.map((ref) => `#${ref}`).join(", ")}`,
    );
  }

  if (hints.blocksRefs.length > 0) {
    lines.push(
      `- Blocks: ${hints.blocksRefs.map((ref) => `#${ref}`).join(", ")}`,
    );
  }

  if (hints.blockedByRefs.length > 0) {
    lines.push(
      `- Blocked by: ${hints.blockedByRefs.map((ref) => `#${ref}`).join(", ")}`,
    );
  }

  if (hints.securityRefs.length > 0) {
    lines.push(`- Security linkage: ${hints.securityRefs.join(", ")}`);
  }

  return lines.join("\n");
}

function buildAssigneeCandidates(item, defaultAssignee) {
  const candidates = [];
  if (item.author) candidates.push(item.author);
  if (defaultAssignee && defaultAssignee !== item.author)
    candidates.push(defaultAssignee);
  return candidates;
}

async function assignIssue(github, owner, repo, number, candidates) {
  for (const candidate of candidates) {
    if (!candidate) continue;

    try {
      await github.rest.issues.addAssignees({
        owner,
        repo,
        issue_number: number,
        assignees: [candidate],
      });
      return candidate;
    } catch (error) {
      console.info(
        `Assignee '${candidate}' could not be applied to #${number}: ${error.message}`,
      );
    }
  }

  return "";
}

async function updateIssueMilestone(
  github,
  owner,
  repo,
  number,
  milestoneNumber,
) {
  if (!milestoneNumber) return;

  await github.rest.issues.update({
    owner,
    repo,
    issue_number: number,
    milestone: milestoneNumber,
  });
}

function isDependabotPullRequest(item) {
  return (
    item.kind === "pull_request" &&
    /^(dependabot\[bot\]|app\/dependabot)$/.test(item.author || "")
  );
}

async function resolveLinkedIssueMilestone(github, owner, repo, references) {
  for (const ref of references) {
    try {
      const { data } = await github.rest.issues.get({
        owner,
        repo,
        issue_number: ref,
      });

      if (data.milestone?.number) {
        return data.milestone;
      }
    } catch (error) {
      console.info(
        `Linked issue #${ref} could not be read for milestone inheritance: ${error.message}`,
      );
    }
  }

  return null;
}

async function addSubIssueRelationship(
  github,
  owner,
  repo,
  parentNumber,
  childNumber,
) {
  void github;
  void owner;
  void repo;
  console.info(
    `Skipping sub-issue relationship ${parentNumber} -> ${childNumber}: relationship sync is disabled.`,
  );
  return false;
}

async function upsertComment(github, owner, repo, number, body) {
  const comments = await github.paginate(github.rest.issues.listComments, {
    owner,
    repo,
    issue_number: number,
    per_page: 100,
  });

  const existing = comments.find(
    (comment) =>
      comment.user?.type === "Bot" && comment.body?.includes(COMMENT_MARKER),
  );

  if (existing) {
    await github.rest.issues.updateComment({
      owner,
      repo,
      comment_id: existing.id,
      body,
    });
    return "updated";
  }

  await github.rest.issues.createComment({
    owner,
    repo,
    issue_number: number,
    body,
  });
  return "created";
}

async function syncItemMetadata({ github, owner, repo, event, config }) {
  const item = getItemFromEvent(event);
  const hints = parseRelationshipHints(item.body);
  const defaultAssignee = config?.defaults?.issue?.assignee || "";
  const assignee = await assignIssue(
    github,
    owner,
    repo,
    item.number,
    buildAssigneeCandidates(item, defaultAssignee),
  );

  let milestoneSummary = item.milestone?.title || "";
  if (!milestoneSummary) {
    const linkedMilestone = await resolveLinkedIssueMilestone(
      github,
      owner,
      repo,
      [...new Set([...hints.linkedRefs, ...extractIssueRefs(item.body)])],
    );

    if (linkedMilestone) {
      await updateIssueMilestone(
        github,
        owner,
        repo,
        item.number,
        linkedMilestone.number,
      );
      milestoneSummary = linkedMilestone.title;
    } else if (isDependabotPullRequest(item)) {
      milestoneSummary = "";
    }
  }

  const hasRelationshipMetadata =
    hints.linkedRefs.length > 0 ||
    hints.parentRefs.length > 0 ||
    hints.childRefs.length > 0 ||
    hints.blocksRefs.length > 0 ||
    hints.blockedByRefs.length > 0 ||
    hints.securityRefs.length > 0;

  if (item.kind === "issue" || hasRelationshipMetadata) {
    if (item.kind === "issue") {
      for (const parentRef of hints.parentRefs) {
        try {
          await addSubIssueRelationship(
            github,
            owner,
            repo,
            parentRef,
            item.number,
          );
        } catch (error) {
          console.info(
            `Parent relationship ${parentRef} -> #${item.number} could not be added: ${error.message}`,
          );
        }
      }

      for (const childRef of hints.childRefs) {
        try {
          await addSubIssueRelationship(
            github,
            owner,
            repo,
            item.number,
            childRef,
          );
        } catch (error) {
          console.info(
            `Child relationship #${item.number} -> ${childRef} could not be added: ${error.message}`,
          );
        }
      }
    }

    if (hasRelationshipMetadata) {
      const message = formatRelationshipComment(
        item,
        hints,
        milestoneSummary,
        assignee,
      );
      await upsertComment(github, owner, repo, item.number, message);
    }
  }

  return {
    assignee,
    milestone: milestoneSummary,
    relationships: hints,
  };
}

async function run() {
  const eventPath = process.env.GITHUB_EVENT_PATH;
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPOSITORY || "";

  if (!eventPath) throw new Error("GITHUB_EVENT_PATH is required");
  if (!token) throw new Error("GITHUB_TOKEN is required");
  if (!repo.includes("/")) throw new Error("GITHUB_REPOSITORY is required");

  const [owner, repoName] = repo.split("/");
  const event = readJsonFile(eventPath);
  const configPath = process.env.ISSUE_FIELDS_CONFIG
    ? path.resolve(process.env.ISSUE_FIELDS_CONFIG)
    : path.resolve(".github/issue-fields.yml");
  const config = readConfig(configPath);
  const github = getOctokit(token);

  const result = await syncItemMetadata({
    github,
    owner,
    repo: repoName,
    event,
    config,
  });

  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(
      process.env.GITHUB_OUTPUT,
      [
        `metadata_assignee=${result.assignee || ""}`,
        `metadata_milestone=${result.milestone || ""}`,
        `metadata_linked_refs=${result.relationships.linkedRefs.join(",")}`,
        `metadata_parent_refs=${result.relationships.parentRefs.join(",")}`,
        `metadata_child_refs=${result.relationships.childRefs.join(",")}`,
        `metadata_blocks_refs=${result.relationships.blocksRefs.join(",")}`,
        `metadata_blocked_by_refs=${result.relationships.blockedByRefs.join(",")}`,
        `metadata_security_refs=${result.relationships.securityRefs.join(",")}`,
      ].join("\n") + "\n",
    );
  }

  return result;
}

if (require.main === module) {
  run().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}

module.exports = {
  addSubIssueRelationship,
  assignIssue,
  buildAssigneeCandidates,
  extractIssueRefs,
  formatRelationshipComment,
  getActorLogin,
  getItemFromEvent,
  normaliseTitle,
  parseRelationshipHints,
  run,
  syncItemMetadata,
};
