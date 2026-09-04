#!/usr/bin/env node
/* global console, process */
/* eslint-disable no-console */
/**
 * sync-issue-fields.cjs
 *
 * Sets the GitHub native issue type on an issue based on its type:* labels,
 * using the canonical mapping in .github/issue-fields.yml.
 *
 * Supports two modes (set via the MODE environment variable):
 *   event    (default) — processes the single issue from GITHUB_EVENT_PATH
 *   bulk               — processes all open issues in the repository
 *
 * Reads:
 *   GITHUB_TOKEN        - Token with issues:write + project scope
 *   GITHUB_REPOSITORY   - "owner/repo"
 *   GITHUB_EVENT_PATH   - Path to the webhook event JSON (event mode only)
 *   ISSUE_FIELDS_CONFIG - Optional path to issue-fields.yml (defaults to
 *                         .github/issue-fields.yml)
 *   MODE                - "event" (default) or "bulk"
 *   DRY_RUN             - "true" to report without applying changes
 *
 * Outputs (GITHUB_OUTPUT):
 *   native_type_set     - Name of the native type that was applied, or ""
 *   native_type_id      - ID of the type that was applied, or ""
 */

"use strict";

const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const { getOctokit } = require("@actions/github");

// ─── Helpers ──────────────────────────────────────────────────────────────────

function readConfig(configPath) {
  return yaml.load(fs.readFileSync(configPath, "utf8"));
}

function readJsonFile(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

/**
 * Derive the project field "Type" value from the issue's labels using the
 * canonical project_field_mappings.Type table.
 *
 * @param {string[]} labelNames
 * @param {Record<string,string>} typeMapping  e.g. { "type:bug": "Bug", ... }
 * @returns {string} Mapped project field value (e.g. "Bug", "Feature") or "".
 */
function deriveTypeFromLabels(labelNames, typeMapping) {
  if (!typeMapping || typeof typeMapping !== "object") return "";
  for (const label of labelNames) {
    if (Object.prototype.hasOwnProperty.call(typeMapping, label)) {
      return typeMapping[label];
    }
  }
  return "";
}

/**
 * Query the organisation's enabled issue types via GraphQL and return a map of
 * { [lowercaseName]: id }.
 *
 * @param {import("@octokit/core").Octokit} octokit
 * @param {string} org
 * @returns {Promise<Map<string, string>>}
 */
async function fetchOrgIssueTypes(octokit, org) {
  const query = `
    query FetchOrgIssueTypes($org: String!) {
      organization(login: $org) {
        issueTypes(first: 50) {
          nodes {
            id
            name
            isEnabled
          }
        }
      }
    }
  `;

  let data;
  try {
    data = await octokit.graphql(query, { org });
  } catch (err) {
    // If the org doesn't have issue types enabled, this query will throw.
    console.info(`Could not fetch org issue types: ${err.message}`);
    return new Map();
  }

  const nodes = data?.organization?.issueTypes?.nodes ?? [];
  const map = new Map();
  for (const node of nodes) {
    if (node.isEnabled !== false) {
      map.set(node.name.toLowerCase(), node.id);
    }
  }
  return map;
}

/**
 * Set the native issue type on a GitHub issue via GraphQL.
 *
 * @param {import("@octokit/core").Octokit} octokit
 * @param {string} issueNodeId   - The global node ID of the issue
 * @param {string|null} typeId   - The node ID of the issue type, or null to clear
 * @returns {Promise<string>}    - The applied type name, or ""
 */
async function setIssueType(octokit, issueNodeId, typeId) {
  const mutation = `
    mutation SetIssueType($issueId: ID!, $typeId: ID) {
      updateIssue(input: { id: $issueId, typeId: $typeId }) {
        issue {
          id
          issueType {
            id
            name
          }
        }
      }
    }
  `;

  const result = await octokit.graphql(mutation, {
    issueId: issueNodeId,
    typeId: typeId ?? null,
  });

  return result?.updateIssue?.issue?.issueType?.name ?? "";
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function run() {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPOSITORY || "";
  const dryRun = (process.env.DRY_RUN || "false").toLowerCase() === "true";
  const mode = (process.env.MODE || "event").toLowerCase();

  if (!token) throw new Error("GITHUB_TOKEN is required");
  if (!repo.includes("/")) throw new Error("GITHUB_REPOSITORY is required");

  const [owner, repoName] = repo.split("/");

  // Read canonical config
  const configPath = process.env.ISSUE_FIELDS_CONFIG
    ? path.resolve(process.env.ISSUE_FIELDS_CONFIG)
    : path.resolve(".github/issue-fields.yml");
  const config = readConfig(configPath);

  const typeMapping = config?.project_field_mappings?.Type ?? {};
  const enabledTypes = new Set(
    (config?.organization_issue_fields?.enabled_issue_types ?? []).map((t) =>
      t.toLowerCase(),
    ),
  );

  const octokit = getOctokit(token);

  if (mode === "bulk") {
    return runBulk({ octokit, owner, repo: repoName, typeMapping, enabledTypes, dryRun });
  }

  return runEvent({ octokit, owner, typeMapping, enabledTypes, dryRun });
}

/**
 * Process the single issue from the GitHub event payload (event mode).
 */
async function runEvent({ octokit, owner, typeMapping, enabledTypes, dryRun }) {
  const eventPath = process.env.GITHUB_EVENT_PATH;
  if (!eventPath) throw new Error("GITHUB_EVENT_PATH is required");

  const event = readJsonFile(eventPath);

  // Only process issues (not PRs)
  if (!event.issue) {
    console.info("Event is not an issue — skipping native type sync.");
    return { nativeTypeSet: "", nativeTypeId: "" };
  }

  const issue = event.issue;
  const labelNames = (issue.labels ?? []).map((l) => l.name).filter(Boolean);
  const issueNodeId = issue.node_id;
  const issueNumber = issue.number;

  // Derive target native type name from labels
  const targetTypeName = deriveTypeFromLabels(labelNames, typeMapping);

  if (!targetTypeName) {
    console.info(
      `#${issueNumber}: no type:* label matched — skipping native type sync.`,
    );
    writeOutputs({ nativeTypeSet: "", nativeTypeId: "" });
    return { nativeTypeSet: "", nativeTypeId: "" };
  }

  if (!enabledTypes.has(targetTypeName.toLowerCase())) {
    console.info(
      `#${issueNumber}: target type "${targetTypeName}" is not in enabled_issue_types — skipping.`,
    );
    writeOutputs({ nativeTypeSet: "", nativeTypeId: "" });
    return { nativeTypeSet: "", nativeTypeId: "" };
  }

  // Fetch org issue types to get the ID for targetTypeName
  const orgTypeMap = await fetchOrgIssueTypes(octokit, owner);

  if (orgTypeMap.size === 0) {
    console.info(
      `Org "${owner}" has no enabled issue types or access is insufficient — skipping.`,
    );
    writeOutputs({ nativeTypeSet: "", nativeTypeId: "" });
    return { nativeTypeSet: "", nativeTypeId: "" };
  }

  const typeId = orgTypeMap.get(targetTypeName.toLowerCase());

  if (!typeId) {
    const available = [...orgTypeMap.keys()].join(", ");
    console.info(
      `#${issueNumber}: type "${targetTypeName}" not found in org types (available: ${available}).`,
    );
    writeOutputs({ nativeTypeSet: "", nativeTypeId: "" });
    return { nativeTypeSet: "", nativeTypeId: "" };
  }

  console.info(
    `#${issueNumber}: setting native type → "${targetTypeName}" (${typeId})` +
      (dryRun ? " [DRY RUN]" : ""),
  );

  let appliedName = "";
  if (!dryRun) {
    appliedName = await setIssueType(octokit, issueNodeId, typeId);
    console.info(`#${issueNumber}: native type set to "${appliedName}"`);
  } else {
    appliedName = targetTypeName;
  }

  writeOutputs({ nativeTypeSet: appliedName, nativeTypeId: typeId });
  return { nativeTypeSet: appliedName, nativeTypeId: typeId };
}

/**
 * Process all open issues in the repository (bulk mode).
 *
 * @param {{ octokit: import("@octokit/core").Octokit, owner: string, repo: string,
 *           typeMapping: Record<string,string>, enabledTypes: Set<string>,
 *           dryRun: boolean }} options
 * @returns {Promise<{ applied: string[], skipped: string[], errors: string[] }>}
 */
async function runBulk({ octokit, owner, repo, typeMapping, enabledTypes, dryRun }) {
  console.info("Bulk mode — fetching all open issues...");

  const orgTypeMap = await fetchOrgIssueTypes(octokit, owner);

  if (orgTypeMap.size === 0) {
    console.info(
      `Org "${owner}" has no enabled issue types or access is insufficient — skipping bulk sync.`,
    );
    return { applied: [], skipped: [], errors: [] };
  }

  // Paginate all open issues
  const issues = await octokit.paginate(octokit.rest.issues.listForRepo, {
    owner,
    repo,
    state: "open",
    per_page: 100,
  });

  const openIssues = issues.filter((i) => !i.pull_request);
  console.info(`Processing ${openIssues.length} open issue(s).`);

  const result = { applied: [], skipped: [], errors: [] };

  for (const issue of openIssues) {
    const labelNames = (issue.labels ?? []).map((l) => l.name).filter(Boolean);
    const targetTypeName = deriveTypeFromLabels(labelNames, typeMapping);

    if (!targetTypeName || !enabledTypes.has(targetTypeName.toLowerCase())) {
      result.skipped.push(`#${issue.number}: no matching enabled type`);
      continue;
    }

    const typeId = orgTypeMap.get(targetTypeName.toLowerCase());
    if (!typeId) {
      result.skipped.push(`#${issue.number}: type "${targetTypeName}" not in org types`);
      continue;
    }

    console.info(
      `#${issue.number}: native type → "${targetTypeName}"${dryRun ? " [DRY RUN]" : ""}`,
    );

    if (!dryRun) {
      try {
        await setIssueType(octokit, issue.node_id, typeId);
        result.applied.push(`#${issue.number} → ${targetTypeName}`);
      } catch (err) {
        result.errors.push(`#${issue.number}: ${err.message}`);
      }
    } else {
      result.applied.push(`#${issue.number} → ${targetTypeName} [DRY RUN]`);
    }
  }

  return result;
}

function writeOutputs({ nativeTypeSet, nativeTypeId }) {
  const outputFile = process.env.GITHUB_OUTPUT;
  if (!outputFile) return;
  fs.appendFileSync(
    outputFile,
    [`native_type_set=${nativeTypeSet}`, `native_type_id=${nativeTypeId}`].join(
      "\n",
    ) + "\n",
  );
}

if (require.main === module) {
  run().catch((err) => {
    console.error(err.message);
    process.exitCode = 1;
  });
}

module.exports = {
  deriveTypeFromLabels,
  fetchOrgIssueTypes,
  setIssueType,
  run,
  runEvent,
  runBulk,
};
