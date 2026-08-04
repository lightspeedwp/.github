#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const Ajv2020 = require("ajv/dist/2020").default;
const addFormats = require("ajv-formats");

function parseArgs(argv) {
  const config = {
    root: process.cwd(),
    examplesOnly: false,
    profilesOnly: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    switch (arg) {
      case "--root":
        config.root = path.resolve(argv[++i]);
        break;
      case "--examples-only":
        config.examplesOnly = true;
        break;
      case "--profiles-only":
        config.profilesOnly = true;
        break;
      case "--help":
      case "-h":
        config.help = true;
        break;
      default:
        throw new Error(`Unknown option: ${arg}`);
    }
  }

  if (config.examplesOnly && config.profilesOnly) {
    throw new Error("Cannot use --examples-only and --profiles-only together.");
  }

  return config;
}

function listFilesRecursive(dir, matcher, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      listFilesRecursive(full, matcher, acc);
    } else if (matcher(full)) {
      acc.push(full);
    }
  }
  return acc;
}

function rel(root, p) {
  return path.relative(root, p).replace(/\\/g, "/");
}

function parseDataFile(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  return yaml.load(raw);
}

function loadJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function collectSourceAssets(root) {
  const agentFiles = fs
    .readdirSync(path.join(root, "agents"), { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".agent.md"))
    .map((entry) => `agents/${entry.name}`)
    .sort();

  const skillFiles = listFilesRecursive(
    path.join(root, "skills"),
    (full) => path.basename(full) === "SKILL.md",
  )
    .map((full) => rel(root, full))
    .sort();

  return { agentFiles, skillFiles };
}

function printHelp() {
  console.log(`Memory Validation Tool

Usage:
  node scripts/validation/validate-memory.js [--root <path>] [--examples-only|--profiles-only]

Checks:
  - Memory schemas, registry, profiles, and example snapshots validate.
  - Profile drift against current agents/*.agent.md and skills/**/SKILL.md.
  - Inventory lock counts and required asset lists are still accurate.
  - Every profile maps to at least one existing example.
`);
}

function main() {
  let config;
  try {
    config = parseArgs(process.argv.slice(2));
  } catch (error) {
    console.error(error.message);
    return 2;
  }

  if (config.help) {
    printHelp();
    return 0;
  }

  const root = config.root;
  const errors = [];

  const schemaDir = path.join(root, "schemas", "memory");
  const registryPath = path.join(
    root,
    "workflows",
    "memory",
    "registry",
    "memory-registry.yaml",
  );
  const lockPath = path.join(
    root,
    "workflows",
    "memory",
    "registry",
    "inventory-lock.json",
  );
  const profilesAgentDir = path.join(
    root,
    "workflows",
    "memory",
    "profiles",
    "agents",
  );
  const profilesSkillDir = path.join(
    root,
    "workflows",
    "memory",
    "profiles",
    "skills",
  );
  const examplesAgentDir = path.join(
    root,
    "workflows",
    "memory",
    "examples",
    "agents",
  );
  const examplesSkillDir = path.join(
    root,
    "workflows",
    "memory",
    "examples",
    "skills",
  );
  const packsDir = path.join(root, "workflows", "memory", "examples", "packs");

  const requiredSchemaFiles = [
    "memory-registry.schema.json",
    "memory-profile.schema.json",
    "memory-record.schema.json",
    "memory-snapshot.schema.json",
    "memory-example-pack.schema.json",
  ];

  for (const schemaFile of requiredSchemaFiles) {
    const full = path.join(schemaDir, schemaFile);
    if (!fs.existsSync(full)) {
      errors.push(`Missing schema file: ${rel(root, full)}`);
    }
  }

  if (errors.length) {
    console.error("Memory validation failed:");
    errors.forEach((e) => console.error(`- ${e}`));
    return 1;
  }

  const registrySchema = loadJson(
    path.join(schemaDir, "memory-registry.schema.json"),
  );
  const profileSchema = loadJson(
    path.join(schemaDir, "memory-profile.schema.json"),
  );
  const recordSchema = loadJson(
    path.join(schemaDir, "memory-record.schema.json"),
  );
  const snapshotSchema = loadJson(
    path.join(schemaDir, "memory-snapshot.schema.json"),
  );
  const packSchema = loadJson(
    path.join(schemaDir, "memory-example-pack.schema.json"),
  );

  const ajv = new Ajv2020({ allErrors: true, strict: false });
  addFormats(ajv);
  ajv.addSchema(recordSchema, "memory-record.schema.json");

  const validateRegistry = ajv.compile(registrySchema);
  const validateProfile = ajv.compile(profileSchema);
  const validateSnapshot = ajv.compile(snapshotSchema);
  const validatePack = ajv.compile(packSchema);

  const profileFiles = [
    ...listFilesRecursive(profilesAgentDir, (full) =>
      full.endsWith(".memory-profile.yaml"),
    ),
    ...listFilesRecursive(profilesSkillDir, (full) =>
      full.endsWith(".memory-profile.yaml"),
    ),
  ].sort();

  const exampleFiles = [
    ...listFilesRecursive(examplesAgentDir, (full) =>
      full.endsWith(".memory.example.yaml"),
    ),
    ...listFilesRecursive(examplesSkillDir, (full) =>
      full.endsWith(".memory.example.yaml"),
    ),
  ].sort();

  const packFiles = listFilesRecursive(
    packsDir,
    (full) => path.basename(full) === "memory-example-pack.yaml",
  ).sort();

  const profilesByPath = new Map();
  const examplesByPath = new Map();
  const profilesBySourcePath = new Map();

  if (!config.examplesOnly) {
    for (const profileFile of profileFiles) {
      const relPath = rel(root, profileFile);
      const data = parseDataFile(profileFile);
      if (!validateProfile(data)) {
        const errText = ajv.errorsText(validateProfile.errors, {
          separator: "; ",
        });
        errors.push(`Invalid profile ${relPath}: ${errText}`);
        continue;
      }

      profilesByPath.set(relPath, data);

      if (!fs.existsSync(path.join(root, data.source_path))) {
        errors.push(
          `Profile source_path does not exist (${relPath}): ${data.source_path}`,
        );
      }

      if (profilesBySourcePath.has(data.source_path)) {
        errors.push(
          `Duplicate profile source_path detected: ${data.source_path}`,
        );
      } else {
        profilesBySourcePath.set(data.source_path, relPath);
      }

      for (const ref of data.example_refs) {
        if (!fs.existsSync(path.join(root, ref))) {
          errors.push(`Profile example_ref missing (${relPath}): ${ref}`);
        }
      }
    }
  }

  if (!config.profilesOnly) {
    for (const exampleFile of exampleFiles) {
      const relPath = rel(root, exampleFile);
      const data = parseDataFile(exampleFile);
      if (!validateSnapshot(data)) {
        const errText = ajv.errorsText(validateSnapshot.errors, {
          separator: "; ",
        });
        errors.push(`Invalid example ${relPath}: ${errText}`);
        continue;
      }

      examplesByPath.set(relPath, data);

      const profileRefPath = path.join(root, data.profile_ref);
      if (!fs.existsSync(profileRefPath)) {
        errors.push(
          `Example profile_ref missing (${relPath}): ${data.profile_ref}`,
        );
      }

      for (const record of data.records) {
        if (record.asset_id !== data.asset_id) {
          errors.push(
            `Record asset_id mismatch in ${relPath}: ${record.record_id}`,
          );
        }
        if (record.asset_type !== data.asset_type) {
          errors.push(
            `Record asset_type mismatch in ${relPath}: ${record.record_id}`,
          );
        }
      }
    }

    for (const packFile of packFiles) {
      const relPath = rel(root, packFile);
      const data = parseDataFile(packFile);
      if (!validatePack(data)) {
        const errText = ajv.errorsText(validatePack.errors, {
          separator: "; ",
        });
        errors.push(`Invalid pack ${relPath}: ${errText}`);
        continue;
      }

      for (const ref of data.profile_refs) {
        if (!fs.existsSync(path.join(root, ref))) {
          errors.push(`Pack profile_ref missing (${relPath}): ${ref}`);
        }
      }
      for (const ref of data.example_refs) {
        if (!fs.existsSync(path.join(root, ref))) {
          errors.push(`Pack example_ref missing (${relPath}): ${ref}`);
        }
      }
    }
  }

  if (!config.examplesOnly && fs.existsSync(registryPath)) {
    const registry = parseDataFile(registryPath);
    if (!validateRegistry(registry)) {
      const errText = ajv.errorsText(validateRegistry.errors, {
        separator: "; ",
      });
      errors.push(`Invalid registry ${rel(root, registryPath)}: ${errText}`);
    } else {
      for (const asset of registry.assets) {
        if (!fs.existsSync(path.join(root, asset.source_path))) {
          errors.push(`Registry source_path missing: ${asset.source_path}`);
        }
        if (!fs.existsSync(path.join(root, asset.profile_path))) {
          errors.push(`Registry profile_path missing: ${asset.profile_path}`);
        }
        if (!fs.existsSync(path.join(root, asset.example_path))) {
          errors.push(`Registry example_path missing: ${asset.example_path}`);
        }
      }
    }
  }

  if (!config.examplesOnly) {
    const { agentFiles, skillFiles } = collectSourceAssets(root);

    const agentProfileSources = new Set(
      profileFiles
        .map((p) => parseDataFile(p))
        .filter((profile) => profile.asset_type === "agent")
        .map((profile) => profile.source_path),
    );

    const skillProfileSources = new Set(
      profileFiles
        .map((p) => parseDataFile(p))
        .filter((profile) => profile.asset_type === "skill")
        .map((profile) => profile.source_path),
    );

    for (const agentPath of agentFiles) {
      if (!agentProfileSources.has(agentPath)) {
        errors.push(`Missing agent profile for source file: ${agentPath}`);
      }
    }

    for (const skillPath of skillFiles) {
      if (!skillProfileSources.has(skillPath)) {
        errors.push(`Missing skill profile for source file: ${skillPath}`);
      }
    }

    for (const profileSource of agentProfileSources) {
      if (!agentFiles.includes(profileSource)) {
        errors.push(
          `Agent profile references non-existent source: ${profileSource}`,
        );
      }
    }

    for (const profileSource of skillProfileSources) {
      if (!skillFiles.includes(profileSource)) {
        errors.push(
          `Skill profile references non-existent source: ${profileSource}`,
        );
      }
    }

    if (fs.existsSync(lockPath)) {
      const lock = loadJson(lockPath);
      const expected = lock.expected_counts || {};
      if (expected.agents !== agentFiles.length) {
        errors.push(
          `Inventory lock mismatch: agents expected ${expected.agents}, found ${agentFiles.length}`,
        );
      }
      if (expected.skills !== skillFiles.length) {
        errors.push(
          `Inventory lock mismatch: skills expected ${expected.skills}, found ${skillFiles.length}`,
        );
      }
      if (expected.profiles !== profileFiles.length) {
        errors.push(
          `Inventory lock mismatch: profiles expected ${expected.profiles}, found ${profileFiles.length}`,
        );
      }
      if (!config.profilesOnly && expected.examples !== exampleFiles.length) {
        errors.push(
          `Inventory lock mismatch: examples expected ${expected.examples}, found ${exampleFiles.length}`,
        );
      }

      const required = lock.required_asset_paths || {};
      const requiredAgents = required.agents || [];
      const requiredSkills = required.skills || [];

      for (const requiredAgent of requiredAgents) {
        if (!agentFiles.includes(requiredAgent)) {
          errors.push(
            `Inventory lock required agent path missing: ${requiredAgent}`,
          );
        }
      }
      for (const requiredSkill of requiredSkills) {
        if (!skillFiles.includes(requiredSkill)) {
          errors.push(
            `Inventory lock required skill path missing: ${requiredSkill}`,
          );
        }
      }
    } else {
      errors.push(`Missing inventory lock: ${rel(root, lockPath)}`);
    }
  }

  if (errors.length > 0) {
    console.error("Memory validation failed:");
    errors.forEach((e) => console.error(`- ${e}`));
    return 1;
  }

  console.log("Memory validation passed.");
  console.log(
    `Profiles: ${profileFiles.length} | Examples: ${exampleFiles.length} | Packs: ${packFiles.length}`,
  );
  return 0;
}

if (require.main === module) {
  process.exit(main());
}

module.exports = { parseArgs, listFilesRecursive, collectSourceAssets, main };
