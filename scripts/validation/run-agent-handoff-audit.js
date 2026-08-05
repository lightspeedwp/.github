#!/usr/bin/env node
/**
 * Audit agent handoff relationships for cycles and missing targets.
 * @module scripts/validation/run-agent-handoff-audit
 * @see ../../agents/agent.md
 */

const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

const REPO_ROOT = path.resolve(__dirname, "..", "..");
const AGENTS_DIR = path.join(REPO_ROOT, ".github", "agents");

function readAgentFiles() {
  if (!fs.existsSync(AGENTS_DIR)) return [];
  return fs
    .readdirSync(AGENTS_DIR)
    .filter((f) => f.endsWith(".agent.md"))
    .map((f) => path.join(AGENTS_DIR, f));
}

function extractFrontmatter(content) {
  const m = content.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return null;
  try {
    return yaml.load(m[1]);
  } catch (_e) {
    return null;
  }
}

function buildGraph(agentFiles) {
  const graph = {}; // agent -> [targets]
  const agentsByName = {};

  for (const file of agentFiles) {
    const name = path.basename(file).replace(/\.agent\.md$/, "");
    agentsByName[name] = file;
    const content = fs.readFileSync(file, "utf8");
    const fm = extractFrontmatter(content) || {};
    const handoffs = Array.isArray(fm.handoffs) ? fm.handoffs : [];
    graph[name] = handoffs
      .filter((h) => h && typeof h.agent === "string")
      .map((h) => h.agent);
  }

  return { graph, agentsByName };
}

// detect cycles using DFS
function findCycles(graph) {
  const visited = new Set();
  const stack = new Set();
  const cycles = [];

  function dfs(node, path) {
    if (stack.has(node)) {
      const idx = path.indexOf(node);
      cycles.push(path.slice(idx).concat(node));
      return;
    }
    if (visited.has(node)) return;
    visited.add(node);
    stack.add(node);
    const neighbors = graph[node] || [];
    for (const nb of neighbors) {
      dfs(nb, path.concat(nb));
    }
    stack.delete(node);
  }

  for (const node of Object.keys(graph)) {
    if (!visited.has(node)) dfs(node, [node]);
  }

  // dedupe cycles (normalize)
  const norm = new Set();
  const unique = [];
  for (const c of cycles) {
    const s = c.join("->");
    if (!norm.has(s)) {
      norm.add(s);
      unique.push(c);
    }
  }
  return unique;
}

function findMissingTargets(graph, agentsByName) {
  const missing = [];
  for (const [a, targets] of Object.entries(graph)) {
    for (const t of targets) {
      if (!agentsByName[t]) missing.push({ from: a, to: t });
    }
  }
  return missing;
}

function main() {
  const files = readAgentFiles();
  if (files.length === 0) {
    console.log("No agent files found under", AGENTS_DIR);
    process.exit(0);
  }
  const { graph, agentsByName } = buildGraph(files);
  const cycles = findCycles(graph);
  const missing = findMissingTargets(graph, agentsByName);

  console.log("\nAgent Handoff Audit");
  console.log("====================");
  console.log(`Agents scanned: ${Object.keys(graph).length}`);

  if (cycles.length === 0) {
    console.log("\nNo circular handoffs detected.");
  } else {
    console.log(`\nFound ${cycles.length} circular handoff(s):`);
    cycles.forEach((c, i) => {
      console.log(`  ${i + 1}. ${c.join(" -> ")}`);
    });
  }

  if (missing.length === 0) {
    console.log("\nNo missing handoff targets.");
  } else {
    console.log(`\nMissing handoff targets (${missing.length}):`);
    missing.forEach((m) => console.log(`  - ${m.from} -> ${m.to}`));
  }

  // Also print a simple adjacency list for review
  console.log("\nAdjacency list:");
  for (const [k, vs] of Object.entries(graph)) {
    console.log(`  - ${k}: ${vs.join(", ") || "(none)"}`);
  }

  // Exit non-zero if cycles exist
  if (cycles.length > 0) process.exit(2);
}

main();
