#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const YAML = require("js-yaml");
const Ajv = require("ajv");

const root = process.cwd();
const skillsDir = path.join(root, "skills");
const errors = [];

const platformFiles = ["claude", "copilot", "gemini", "codex"];
const ajv = new Ajv({ allErrors: true, strict: false });

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function readYaml(filePath) {
  return YAML.load(fs.readFileSync(filePath, "utf8"));
}

function isSafeRelativeRef(ref) {
  return !ref.startsWith("/") && !ref.includes("..");
}

function collectSkillPaths(basePath, relativeRoot = "") {
  const found = [];
  if (!fs.existsSync(basePath)) return found;
  const entries = fs.readdirSync(basePath, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (entry.name.startsWith(".")) continue;
    const absolute = path.join(basePath, entry.name);
    const relative = path.join(relativeRoot, entry.name).replace(/\\/g, "/");
    const skillMd = path.join(absolute, "SKILL.md");
    if (fs.existsSync(skillMd)) {
      found.push({ absolute, relative });
    }
    found.push(...collectSkillPaths(absolute, relative));
  }
  return found;
}

function formatAjvErrors(ajvErrors) {
  if (!Array.isArray(ajvErrors)) return "Unknown schema validation error";
  return ajvErrors
    .map((err) => `${err.instancePath || "(root)"} ${err.message}`)
    .join("; ");
}

function ensureFileExists(filePath, message) {
  if (!fs.existsSync(filePath)) {
    errors.push(message);
    return false;
  }
  return true;
}

function loadStrictScope() {
  const registryPath = path.join(root, "skills", "SKILL_REGISTRY.json");
  if (!fs.existsSync(registryPath)) return [];
  const registry = readJson(registryPath);
  const scope = [];
  for (const [key, value] of Object.entries(registry)) {
    if (!key.endsWith("PlatformYamlScope")) continue;
    if (!Array.isArray(value)) continue;
    scope.push(...value);
  }
  return scope.filter((entry) => typeof entry === "string");
}

function validateScopedSkillManifests(strictScope) {
  const metadataSchemaPath = path.join(
    root,
    "schema",
    "skill-metadata.schema.json",
  );
  const agentSchemaPath = path.join(
    root,
    "schema",
    "skill-agent-config.schema.json",
  );
  if (!ensureFileExists(metadataSchemaPath, "Missing metadata schema")) return;
  if (!ensureFileExists(agentSchemaPath, "Missing skill agent schema")) return;

  const metadataSchema = readJson(metadataSchemaPath);
  const agentSchema = readJson(agentSchemaPath);
  const validateMetadata = ajv.compile(metadataSchema);
  const validateAgent = ajv.compile(agentSchema);

  for (const ref of strictScope) {
    if (!isSafeRelativeRef(ref)) {
      errors.push(
        `Unsafe strict scope reference in SKILL_REGISTRY.json: ${ref}`,
      );
      continue;
    }
    const skillPath = path.join(root, ref);
    const displayRef = ref.replace(/\\/g, "/");
    const skillMd = path.join(skillPath, "SKILL.md");
    if (
      !ensureFileExists(
        skillMd,
        `Missing SKILL.md in strict scope: ${displayRef}`,
      )
    ) {
      continue;
    }

    const metadataPath = path.join(skillPath, "metadata.yml");
    if (
      !ensureFileExists(
        metadataPath,
        `Missing metadata.yml: ${displayRef}/metadata.yml`,
      )
    ) {
      continue;
    }

    let metadata;
    try {
      metadata = readYaml(metadataPath);
    } catch (error) {
      errors.push(
        `Invalid YAML in ${displayRef}/metadata.yml: ${error.message}`,
      );
      continue;
    }
    if (!validateMetadata(metadata)) {
      errors.push(
        `Schema validation failed for ${displayRef}/metadata.yml: ${formatAjvErrors(
          validateMetadata.errors,
        )}`,
      );
    }

    for (const platform of platformFiles) {
      const platformPath = path.join(skillPath, "agents", `${platform}.yaml`);
      const platformRef = `${displayRef}/agents/${platform}.yaml`;
      if (
        !ensureFileExists(platformPath, `Missing platform YAML: ${platformRef}`)
      ) {
        continue;
      }
      let platformConfig;
      try {
        platformConfig = readYaml(platformPath);
      } catch (error) {
        errors.push(`Invalid YAML in ${platformRef}: ${error.message}`);
        continue;
      }
      if (!validateAgent(platformConfig)) {
        errors.push(
          `Schema validation failed for ${platformRef}: ${formatAjvErrors(
            validateAgent.errors,
          )}`,
        );
      }
    }
  }
}

for (const entry of fs.readdirSync(skillsDir, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  if (entry.name.startsWith(".")) continue;
  const skillPath = path.join(skillsDir, entry.name);
  const skillMd = path.join(skillPath, "SKILL.md");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.name)) {
    errors.push(`Invalid skill folder name: ${entry.name}`);
  }
  if (!fs.existsSync(skillMd)) {
    const hasNestedSkill = fs
      .readdirSync(skillPath, { withFileTypes: true })
      .some(
        (child) =>
          child.isDirectory() &&
          fs.existsSync(path.join(skillPath, child.name, "SKILL.md")),
      );
    if (!hasNestedSkill) {
      errors.push(`Missing SKILL.md: skills/${entry.name}/SKILL.md`);
    }
  }
}

const pluginDir = path.join(root, "plugins");
if (fs.existsSync(pluginDir)) {
  for (const plugin of fs.readdirSync(pluginDir, { withFileTypes: true })) {
    if (!plugin.isDirectory()) continue;
    if (plugin.name.startsWith(".")) continue;
    const pluginSkills = path.join(pluginDir, plugin.name, "skills");
    if (!fs.existsSync(pluginSkills)) continue;
    const discovered = collectSkillPaths(
      pluginSkills,
      `plugins/${plugin.name}/skills`,
    );
    for (const item of discovered) {
      const folderName = path.basename(item.absolute);
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(folderName)) {
        errors.push(`Invalid plugin skill folder name: ${item.relative}`);
      }
    }
  }
}

const strictScope = loadStrictScope();
validateScopedSkillManifests(strictScope);

if (errors.length) {
  console.error("Skill validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("Skill validation passed.");
