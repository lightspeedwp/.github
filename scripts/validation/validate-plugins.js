#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const errors = [];
const registryPath = path.join(root, "plugins", "PLUGIN_MANIFEST.json");
const manifests = [
  "copilot-plugin.json",
  ".claude-plugin/plugin.json",
  ".codex-plugin/plugin.json",
  ".gemini-plugin/plugin.json",
];
const requiredSkillFiles = [
  "metadata.yml",
  "agents/claude.yaml",
  "agents/copilot.yaml",
  "agents/gemini.yaml",
  "agents/codex.yaml",
];

function isSafeRelativeRef(ref) {
  return !ref.startsWith("/") && !ref.includes("..");
}

function collectManifestRefs(data) {
  const refs = [];
  if (Array.isArray(data.skills)) refs.push(...data.skills);
  if (Array.isArray(data.agents)) refs.push(...data.agents);
  if (data.includes) {
    if (Array.isArray(data.includes.skills)) refs.push(...data.includes.skills);
    if (Array.isArray(data.includes.agents)) refs.push(...data.includes.agents);
  }
  return refs;
}

function validateReferencedSkillPackage(
  pluginPath,
  pluginLabel,
  manifest,
  ref,
) {
  if (!ref.endsWith("/SKILL.md")) return;

  const skillDir = path.join(pluginPath, path.dirname(ref));
  for (const requiredFile of requiredSkillFiles) {
    const requiredPath = path.join(skillDir, requiredFile);
    if (!fs.existsSync(requiredPath)) {
      errors.push(
        `Missing required skill manifest file for ${pluginLabel}/${manifest}: ${path.join(path.dirname(ref), requiredFile).replace(/\\/g, "/")}`,
      );
    }
  }
}

function validatePlugin(pluginPath, pluginLabel) {
  for (const manifest of manifests) {
    const manifestPath = path.join(pluginPath, manifest);
    if (!fs.existsSync(manifestPath)) {
      errors.push(`Missing plugin manifest: ${pluginLabel}/${manifest}`);
      continue;
    }

    let data;
    try {
      data = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    } catch (error) {
      errors.push(
        `Invalid JSON in ${pluginLabel}/${manifest}: ${error.message}`,
      );
      continue;
    }

    const refs = collectManifestRefs(data);
    for (const ref of refs) {
      if (typeof ref !== "string") {
        errors.push(`Non-string manifest ref in ${pluginLabel}/${manifest}`);
        continue;
      }
      if (!isSafeRelativeRef(ref)) {
        errors.push(
          `Unsafe manifest path in ${pluginLabel}/${manifest}: ${ref}`,
        );
        continue;
      }
      const resolved = path.join(pluginPath, ref);
      if (!fs.existsSync(resolved)) {
        errors.push(
          `Missing referenced plugin file in ${pluginLabel}/${manifest}: ${ref}`,
        );
        continue;
      }
      validateReferencedSkillPackage(pluginPath, pluginLabel, manifest, ref);
    }
  }
}

if (!fs.existsSync(registryPath)) {
  errors.push("Missing plugin registry: plugins/PLUGIN_MANIFEST.json");
} else {
  let registry;
  try {
    registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));
  } catch (error) {
    errors.push(
      `Invalid JSON in plugins/PLUGIN_MANIFEST.json: ${error.message}`,
    );
  }

  if (registry && Array.isArray(registry.plugins)) {
    for (const plugin of registry.plugins) {
      if (!plugin || typeof plugin.path !== "string") {
        errors.push("Invalid plugin entry in PLUGIN_MANIFEST.json");
        continue;
      }
      if (!isSafeRelativeRef(plugin.path)) {
        errors.push(
          `Unsafe plugin path in PLUGIN_MANIFEST.json: ${plugin.path}`,
        );
        continue;
      }
      const pluginPath = path.join(root, plugin.path);
      if (!fs.existsSync(pluginPath)) {
        errors.push(`Missing plugin directory: ${plugin.path}`);
        continue;
      }
      validatePlugin(pluginPath, plugin.path);
    }
  } else {
    errors.push("plugins/PLUGIN_MANIFEST.json must include a plugins array");
  }
}

if (errors.length) {
  console.error("Plugin validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("Plugin validation passed.");
