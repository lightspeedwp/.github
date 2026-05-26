#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const pluginDir = path.join(root, "plugins", "lightspeed-github-ops");
const manifests = [
  ".codex-plugin/plugin.json",
  ".claude-plugin/plugin.json",
  "copilot-plugin.json",
];
const errors = [];

if (!fs.existsSync(pluginDir)) {
  errors.push("Missing plugin directory: plugins/lightspeed-github-ops");
} else {
  for (const manifest of manifests) {
    const manifestPath = path.join(pluginDir, manifest);
    if (!fs.existsSync(manifestPath)) {
      errors.push(
        `Missing plugin manifest: plugins/lightspeed-github-ops/${manifest}`,
      );
      continue;
    }
    const data = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    const refs = [];
    if (Array.isArray(data.skills)) refs.push(...data.skills);
    if (Array.isArray(data.agents)) refs.push(...data.agents);
    if (data.includes) {
      if (Array.isArray(data.includes.skills))
        refs.push(...data.includes.skills);
      if (Array.isArray(data.includes.agents))
        refs.push(...data.includes.agents);
    }
    for (const ref of refs) {
      if (ref.startsWith("/") || ref.includes("..")) {
        errors.push(`Unsafe manifest path in ${manifest}: ${ref}`);
        continue;
      }
      const resolved = path.join(pluginDir, ref);
      if (!fs.existsSync(resolved)) {
        errors.push(`Missing referenced plugin file in ${manifest}: ${ref}`);
      }
    }
  }
}

if (errors.length) {
  console.error("Plugin validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("Plugin validation passed.");
