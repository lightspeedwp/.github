#!/usr/bin/env node
/**
 * Agent Hooks Dispatcher
 *
 * Runs the registered agent/plugin validation hooks across every multi-provider
 * agent (a directory containing AGENT.md) and every plugin listed in
 * plugins/PLUGIN_MANIFEST.json. This is the CI entrypoint that makes the hooks
 * in hooks/hook-registry.json actually execute, rather than only being
 * registered.
 *
 * Exit code 1 if any hook reports errors.
 *
 * @module scripts/validation/validate-agent-hooks
 */

const fs = require("fs");
const path = require("path");

const root = process.cwd();
const specValidator = require(path.join(root, "hooks/agent-spec-validator"));
const consistency = require(
  path.join(root, "hooks/multi-provider-consistency-checker"),
);
const security = require(path.join(root, "hooks/agent-security-auditor"));
const pluginIntegrity = require(
  path.join(root, "hooks/plugin-integrity-checker"),
);

let hadError = false;
const warn = [];

function report(label, result) {
  for (const w of result.warnings || []) warn.push(`${label}: ${w}`);
  if (!result.valid) {
    hadError = true;
    console.error(`❌ ${label}`);
    for (const e of result.errors) console.error(`   - ${e}`);
  } else {
    console.log(`✅ ${label}`);
  }
}

// Discover multi-provider agents: any directory (recursively under agents/)
// that contains an AGENT.md file.
function findAgentDirs(baseDir) {
  const out = [];
  if (!fs.existsSync(baseDir)) return out;
  const walk = (dir) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    // Exact-case match (case-insensitive filesystems must not match agent.md).
    if (entries.some((e) => e.isFile() && e.name === "AGENT.md")) out.push(dir);
    for (const entry of entries) {
      if (entry.isDirectory() && !entry.name.startsWith(".")) {
        walk(path.join(dir, entry.name));
      }
    }
  };
  walk(baseDir);
  return out;
}

console.log("🔍 Running agent/plugin validation hooks\n");

const agentDirs = findAgentDirs(path.join(root, "agents"));
for (const dir of agentDirs) {
  const rel = path.relative(root, dir);
  report(`agent-spec-validator (${rel})`, specValidator.validate(dir));
  report(`multi-provider-consistency-checker (${rel})`, consistency.validate(dir));
  report(`agent-security-auditor (${rel})`, security.validate(dir));
}

const registryPath = path.join(root, "plugins/PLUGIN_MANIFEST.json");
if (fs.existsSync(registryPath)) {
  const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));
  for (const plugin of registry.plugins || []) {
    const pluginPath = path.join(root, plugin.path);
    if (fs.existsSync(pluginPath)) {
      report(
        `plugin-integrity-checker (${plugin.path})`,
        pluginIntegrity.validate(pluginPath),
      );
      report(
        `agent-security-auditor (${plugin.path})`,
        security.validate(pluginPath),
      );
    }
  }
}

if (warn.length) {
  console.log("\nWarnings:");
  for (const w of warn) console.log(`  ⚠️  ${w}`);
}

if (!agentDirs.length) {
  console.log("\nNo multi-provider agents (AGENT.md) found.");
}

if (hadError) {
  console.error("\nAgent hook validation failed.");
  process.exit(1);
}
console.log("\nAgent hook validation passed.");
