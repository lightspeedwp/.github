const fs = require("fs");
const os = require("os");
const path = require("path");
const { execFileSync } = require("child_process");

const scriptPath = path.join(__dirname, "../validate-memory.js");
const repoRoot = path.resolve(__dirname, "../../..");

function mkdirp(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeJson(filePath, data) {
  mkdirp(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function copySchemas(tempRoot) {
  const schemaSrc = path.join(repoRoot, "schemas", "memory");
  const schemaDst = path.join(tempRoot, "schemas", "memory");
  mkdirp(schemaDst);
  for (const file of fs.readdirSync(schemaSrc)) {
    fs.copyFileSync(path.join(schemaSrc, file), path.join(schemaDst, file));
  }
}

function buildTempRepo() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "validate-memory-"));
  copySchemas(root);

  mkdirp(path.join(root, "agents"));
  mkdirp(path.join(root, "skills", "demo-skill"));
  fs.writeFileSync(
    path.join(root, "agents", "demo.agent.md"),
    "---\nfile_type: agent\n---\n",
  );
  fs.writeFileSync(
    path.join(root, "skills", "demo-skill", "SKILL.md"),
    "---\nname: demo\n---\n",
  );

  mkdirp(path.join(root, "workflows", "memory", "profiles", "agents"));
  mkdirp(path.join(root, "workflows", "memory", "profiles", "skills"));
  mkdirp(path.join(root, "workflows", "memory", "examples", "agents"));
  mkdirp(path.join(root, "workflows", "memory", "examples", "skills"));
  mkdirp(
    path.join(root, "workflows", "memory", "examples", "packs", "minimal"),
  );
  mkdirp(path.join(root, "workflows", "memory", "registry"));

  const agentProfilePath =
    "workflows/memory/profiles/agents/demo.memory-profile.yaml";
  const skillProfilePath =
    "workflows/memory/profiles/skills/demo-skill.memory-profile.yaml";
  const agentExamplePath =
    "workflows/memory/examples/agents/demo.memory.example.yaml";
  const skillExamplePath =
    "workflows/memory/examples/skills/demo-skill.memory.example.yaml";

  const baseProfile = (assetType, assetId, sourcePath, exampleRef) => ({
    schema_version: "1.0.0",
    asset_id: assetId,
    asset_type: assetType,
    source_path: sourcePath,
    scope: "project",
    retention: {
      mode: "rolling",
      ttl_days: 90,
      archive_after_days: 180,
      deletion_policy: "manual-review",
    },
    sensitivity: "internal",
    memory_options: [
      {
        id: "project-context",
        family: "project_context",
        description: "Project context memory option.",
        required: true,
        update_strategy: "per_run",
        storage_scope: "project",
      },
    ],
    required_keys: ["project_context.repo"],
    validation_rules: [
      {
        rule: "required keys must exist",
        level: "error",
        error_message: "Missing required keys.",
      },
    ],
    example_refs: [exampleRef],
  });

  const baseSnapshot = (assetType, assetId, profileRef, sourcePath) => ({
    schema_version: "1.0.0",
    snapshot_id: `${assetType}-snapshot`,
    asset_id: assetId,
    asset_type: assetType,
    profile_ref: profileRef,
    created_at: "2026-05-26T12:00:00Z",
    run_context: {
      workspace: "lightspeedwp/.github",
      trigger: "test",
      actor: "jest",
    },
    records: [
      {
        record_id: `${assetType}-record`,
        asset_id: assetId,
        asset_type: assetType,
        key: "project_context.repo",
        family: "project_context",
        value: { repo: "lightspeedwp/.github", source: sourcePath },
        status: "confirmed",
        confidence: 0.9,
        source: "test",
        updated_at: "2026-05-26T12:00:00Z",
      },
    ],
  });

  writeJson(
    path.join(root, agentProfilePath),
    baseProfile(
      "agent",
      "agent:demo",
      "agents/demo.agent.md",
      agentExamplePath,
    ),
  );
  writeJson(
    path.join(root, skillProfilePath),
    baseProfile(
      "skill",
      "skill:demo-skill",
      "skills/demo-skill/SKILL.md",
      skillExamplePath,
    ),
  );
  writeJson(
    path.join(root, agentExamplePath),
    baseSnapshot(
      "agent",
      "agent:demo",
      agentProfilePath,
      "agents/demo.agent.md",
    ),
  );
  writeJson(
    path.join(root, skillExamplePath),
    baseSnapshot(
      "skill",
      "skill:demo-skill",
      skillProfilePath,
      "skills/demo-skill/SKILL.md",
    ),
  );

  writeJson(
    path.join(root, "workflows", "memory", "registry", "memory-registry.yaml"),
    {
      schema_version: "1.0.0",
      generated_at: "2026-05-26T12:00:00Z",
      counts: {
        agent_count: 1,
        skill_count: 1,
        profile_count: 2,
        example_count: 2,
      },
      option_families: [
        "user_defaults",
        "project_context",
        "decision_log",
        "risks_blockers",
        "execution_state",
        "qa_gates",
        "tool_runtime_constraints",
        "compliance_privacy",
        "output_preferences",
        "handoff",
      ],
      assets: [
        {
          asset_id: "agent:demo",
          asset_type: "agent",
          source_path: "agents/demo.agent.md",
          profile_path: agentProfilePath,
          example_path: agentExamplePath,
        },
        {
          asset_id: "skill:demo-skill",
          asset_type: "skill",
          source_path: "skills/demo-skill/SKILL.md",
          profile_path: skillProfilePath,
          example_path: skillExamplePath,
        },
      ],
    },
  );

  writeJson(
    path.join(root, "workflows", "memory", "registry", "inventory-lock.json"),
    {
      schema_version: "1.0.0",
      generated_at: "2026-05-26T12:00:00Z",
      expected_counts: {
        agents: 1,
        skills: 1,
        profiles: 2,
        examples: 2,
      },
      required_asset_paths: {
        agents: ["agents/demo.agent.md"],
        skills: ["skills/demo-skill/SKILL.md"],
      },
    },
  );

  writeJson(
    path.join(
      root,
      "workflows",
      "memory",
      "examples",
      "packs",
      "minimal",
      "memory-example-pack.yaml",
    ),
    {
      schema_version: "1.0.0",
      pack_id: "minimal",
      description: "Minimal memory test pack for validation.",
      profile_refs: [agentProfilePath, skillProfilePath],
      example_refs: [agentExamplePath, skillExamplePath],
      coverage: {
        agent_profiles: 1,
        skill_profiles: 1,
        agent_examples: 1,
        skill_examples: 1,
      },
    },
  );

  return root;
}

describe("validate-memory", () => {
  it("passes on a complete minimal memory workspace", () => {
    const root = buildTempRepo();
    const output = execFileSync(
      process.execPath,
      [scriptPath, "--root", root],
      {
        encoding: "utf8",
        stdio: "pipe",
      },
    );

    expect(output).toMatch(/Memory validation passed/);
  });

  it("fails when a skill profile is missing", () => {
    const root = buildTempRepo();
    fs.unlinkSync(
      path.join(
        root,
        "workflows",
        "memory",
        "profiles",
        "skills",
        "demo-skill.memory-profile.yaml",
      ),
    );

    expect(() =>
      execFileSync(process.execPath, [scriptPath, "--root", root], {
        encoding: "utf8",
        stdio: "pipe",
      }),
    ).toThrow(/Missing skill profile for source file/);
  });
});
