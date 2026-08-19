/* ──────────────────────────────────────────────────────────────────
   Catalogue data — ported from design_source/data.js
   All paths are real files/folders in lightspeedwp/.github
   ────────────────────────────────────────────────────────────────── */

export const REPO = "lightspeedwp/.github";

export type ItemType =
  | "install"
  | "aiDefault"
  | "workflow"
  | "guardrail"
  | "pack"
  | "script"
  | "schema"
  | "recipe"
  | "mixed";

export interface TypeInfo {
  label: string;
  badge: string;
  note: string;
}

export interface Category {
  id: string;
  label: string;
  type: ItemType | "mixed";
  blurb: string;
  icon: string;
}

export interface CatalogueItem {
  id: string;
  cat: string;
  slug: string;
  name: string;
  description: string;
  type: ItemType;
  tags: string[];
  version: string;
  updated: string;
  applyTo?: string;
  path?: string;
  tree: boolean;
  body?: string | null;
  run?: string | null;
  validates?: string | null;
  dest?: string | null;
  duration?: string | null;
  action?: string | null;
}

export interface UrlSet {
  blob: string;
  raw: string;
  vscode: string;
}

export const TYPES: Record<string, TypeInfo> = {
  install: {
    label: "Installable file",
    badge: "Single-file",
    note: "A single-file Copilot customisation — copy the raw file or install it straight into VS Code.",
  },
  aiDefault: {
    label: "AI default file",
    badge: "AI default",
    note: "A default AI configuration file. Copy or download it into your repository root — it isn't a VS Code customisation.",
  },
  workflow: {
    label: "Installable workflow",
    badge: "Workflow",
    note: "A portable spec paired with a runnable GitHub Action. Copy the spec, or reference the Action with uses:.",
  },
  guardrail: {
    label: "Guardrail config",
    badge: "Guardrail",
    note: "A pre-commit or lint guardrail. Copy the config into place — there's no VS Code install for these.",
  },
  pack: {
    label: "Plugin pack",
    badge: "Pack",
    note: "A versioned, installable bundle of governance and AI-ops. Install the pack or open the folder.",
  },
  script: {
    label: "Script",
    badge: "Reference",
    note: "Run it from the repo. Many scripts are paired with a schema that validates their inputs.",
  },
  schema: {
    label: "Schema",
    badge: "Validates",
    note: "A JSON schema that validates a specific resource type. Goes hand-in-hand with the scripts that read it.",
  },
  recipe: {
    label: "Recipe",
    badge: "Recipe",
    note: "A step-by-step playbook — read it, follow it, copy what you need.",
  },
};

export const CATEGORIES: Category[] = [
  {
    id: "agents",
    label: "Agents",
    type: "install",
    blurb:
      "Specialised AI agents with defined behaviour, scope, and escalation rules.",
    icon: "ph:robot",
  },
  {
    id: "instructions",
    label: "Instructions",
    type: "install",
    blurb:
      "Canonical coding, accessibility, and WordPress standards Copilot must follow.",
    icon: "ph:book-open",
  },
  {
    id: "prompts",
    label: "Prompts",
    type: "install",
    blurb:
      "Reusable prompt templates you can grab and run for common engineering tasks.",
    icon: "ph:chat",
  },
  {
    id: "skills",
    label: "Skills",
    type: "install",
    blurb:
      "Portable, self-contained skill packages the team can run on demand.",
    icon: "ph:sparkle",
  },
  {
    id: "hooks",
    label: "Hooks",
    type: "guardrail",
    blurb:
      "Pre-commit and lint guardrails that enforce quality before code lands.",
    icon: "ph:shield-check",
  },
  {
    id: "workflows",
    label: "Workflows",
    type: "workflow",
    blurb:
      "Portable agentic workflow specs, each paired with a runnable GitHub Action.",
    icon: "ph:git-branch",
  },
  {
    id: "plugins",
    label: "Plugins",
    type: "pack",
    blurb:
      "Installable, versioned plugin packs bundling governance and AI-ops.",
    icon: "ph:puzzle-piece",
  },
  {
    id: "tools",
    label: "Tools",
    type: "mixed",
    blurb:
      "The toolchain layer — AI defaults, scripts, schemas, and editor config.",
    icon: "ph:wrench",
  },
];

export const NAV_GROUPS = {
  browse: [
    "agents",
    "instructions",
    "prompts",
    "skills",
    "hooks",
    "workflows",
    "plugins",
    "tools",
  ],
};

export function urlsFor(item: CatalogueItem, branch: string = "main"): UrlSet {
  const b = branch;
  const p = item.path || "";
  const kind = item.tree ? "tree" : "blob";
  const blob = `https://github.com/${REPO}/${kind}/${b}/${p}`;
  const raw = `https://raw.githubusercontent.com/${REPO}/${b}/${p}`;
  const route: Record<string, string> = {
    instructions: "chat-instructions",
    prompts: "chat-prompt",
    agents: "chat-mode",
    skills: "chat-prompt",
  };
  const vsRoute = route[item.cat] || "chat-instructions";
  const vscode = `vscode:${vsRoute}/install?url=${encodeURIComponent(raw)}`;
  return { blob, raw, vscode };
}

export function installable(item: CatalogueItem): boolean {
  return !item.tree && item.type === "install";
}

export function cloneCmd(branch: string): string {
  return branch === "develop"
    ? `git clone -b develop https://github.com/${REPO}.git`
    : `git clone https://github.com/${REPO}.git`;
}

export function itemRouteId(item: CatalogueItem): string {
  return `${item.cat}--${item.slug}`;
}

/* ── Markdown bodies for representative items ── */
const MD: Record<string, string> = {};

MD["reviewer"] = `---
description: Diff-aware code review focused on standards, a11y, security, and performance.
applyTo: "**"
---

# Code reviewer agent

Given a diff, return a **✅ / ⚠️ summary**, then inline comments
(\`file:line\`) focusing on:

- **Standards** — WordPress Coding Standards (PHP, JS, CSS), naming, structure.
- **Accessibility** — semantic markup, ARIA only where needed, focus order, contrast.
- **Security** — sanitise on input, escape on output, nonces, capability checks.
- **Performance** — block-scoped asset loading, avoid N+1 queries, cache where safe.

Every comment must include a **concrete fix**, not just a flag.

> Pairs with \`instructions/coding-standards.instructions.md\` and \`instructions/a11y.instructions.md\`.`;

MD["plugin-structure"] = `---
description: WordPress block plugin structure conventions — layout, block.json, enqueueing, security, i18n.
applyTo: "**"
tags: [wordpress, plugin, blocks, block-json, php, i18n]
---

# WordPress block plugin structure

You are a WordPress block plugin architect. Follow our block-first
conventions to scaffold and maintain LightSpeed plugins.

## General rules

- Scaffold new blocks with \`@wordpress/create-block\`.
- Use \`block.json\` as the canonical source of block metadata.
- Separate editor assets from front-end assets.
- Register blocks via \`register_block_type()\` pointing at \`block.json\`.
- Apply \`sanitize_*\`, \`esc_*\`, and \`wp_kses_post()\` at all boundaries.
- Use a plugin-specific text domain; run \`wp-scripts i18n make-pot\`.

## Security

\`\`\`php
// Validate, then escape on output
$title = sanitize_text_field( $attributes['title'] ?? '' );
echo '<h2>' . esc_html( $title ) . '</h2>';
\`\`\``;

MD["custom-instructions"] = `---
description: Organisation-wide Copilot behaviour for every LightSpeed repository.
applyTo: "**"
---

# LightSpeed Copilot custom instructions

These are the default instructions surfaced to Copilot across **every**
repo in the \`lightspeedwp\` organisation via the \`.github\` control plane.

## Always

- British English in prose; \`text-domain\` in code stays lowercase-hyphen.
- WordPress Coding Standards for PHP, JS, CSS, HTML.
- Accessibility is non-negotiable: semantic HTML, AA contrast, keyboard paths.
- Sanitise on input, escape on output, nonce every state-changing request.

## Never

- Suggest page-builder shortcodes where a block exists.
- Enqueue editor assets on the front end.
- Invent APIs — cite the WordPress handbook when unsure.`;

MD["a11y"] = `---
description: Accessibility standards for WordPress themes, blocks, and patterns (WCAG 2.2 AA).
applyTo: "**/*.{php,js,jsx,html,css}"
---

# Accessibility instructions

Target **WCAG 2.2 AA** on every surface we ship.

- Use semantic landmarks; one \`<h1>\` per view, no skipped heading levels.
- All interactive controls reachable and operable by keyboard.
- Visible focus styles — never \`outline: none\` without a replacement.
- Colour contrast ≥ 4.5:1 for text, ≥ 3:1 for UI and large text.
- Respect \`prefers-reduced-motion\`; gate non-essential animation.
- Label every input; associate errors with \`aria-describedby\`.`;

MD["release"] = `---
description: Agent that prepares Keep-a-Changelog releases and version bumps.
---

# Release agent

You own the release ritual for LightSpeed packages.

1. Read \`CHANGELOG.md\` (Keep-a-Changelog format).
2. Group merged PRs since the last tag into Added / Changed / Fixed / Removed.
3. Propose the next SemVer version; never bump major without sign-off.
4. Open a release PR; never push tags directly to \`main\`.

Escalate to a maintainer for any breaking change or licence-affecting edit.`;

function item(
  cat: string,
  slug: string,
  name: string,
  description: string,
  opts: Partial<CatalogueItem> = {},
): CatalogueItem {
  return {
    id: `${cat}/${slug}`,
    cat,
    slug,
    name,
    description,
    type: (opts.type as ItemType) || "install",
    tags: opts.tags || [],
    version: opts.version || "v1.0",
    updated: opts.updated || "2026-06",
    applyTo: opts.applyTo,
    path: opts.path,
    tree: !!opts.tree,
    body: opts.body || null,
    run: opts.run || null,
    validates: opts.validates || null,
    dest: opts.dest || null,
    duration: opts.duration || null,
    action: opts.action || null,
  };
}

/* ── PROMPTS ── */
const PROMPT_DEFS: [string, string, string, string[]][] = [
  [
    "agent-setup",
    "Agent setup",
    "Initial agent context, instructions, and configuration to bootstrap a new agent.",
    ["agents", "setup"],
  ],
  [
    "code-generation",
    "Code generation",
    "Code implementation, scaffolding, and generation against project conventions.",
    ["code", "scaffold"],
  ],
  [
    "code-review",
    "Code review",
    "Code review, quality feedback, and standards enforcement on a diff.",
    ["review", "quality"],
  ],
  [
    "debugging",
    "Debugging",
    "Problem diagnosis, root-cause analysis, and resolution of a failing case.",
    ["debug", "diagnosis"],
  ],
  [
    "documentation",
    "Documentation",
    "Documentation creation, updates, and refinement for a feature or module.",
    ["docs"],
  ],
  [
    "testing",
    "Testing",
    "Test suite creation, debugging, and coverage improvements.",
    ["testing", "qa"],
  ],
  [
    "refactoring",
    "Refactoring",
    "Code refactoring, optimisation, and modernisation without behaviour change.",
    ["refactor", "quality"],
  ],
  [
    "review-and-refactor",
    "Review & refactor",
    "A combined pass: review the code, then refactor against the findings.",
    ["review", "refactor"],
  ],
  [
    "create-specification",
    "Create specification",
    "Turn a feature idea into a formal, testable specification.",
    ["specs", "planning"],
  ],
  [
    "create-implementation-plan",
    "Create implementation plan",
    "Produce a phased, testable implementation plan from a spec.",
    ["planning", "specs"],
  ],
  [
    "update-implementation-plan",
    "Update implementation plan",
    "Revise an existing implementation plan as scope or status changes.",
    ["planning"],
  ],
  [
    "plan-breakdown",
    "Plan breakdown",
    "Break a plan into actionable, ordered steps.",
    ["planning"],
  ],
  [
    "create-adr",
    "Create ADR",
    "Capture an architecture decision, its context, and consequences as a numbered record.",
    ["adr", "architecture"],
  ],
  [
    "architecture-blueprint",
    "Architecture blueprint",
    "Generate an architecture blueprint describing a codebase's structure.",
    ["architecture", "docs"],
  ],
  [
    "technology-stack-blueprint",
    "Tech stack blueprint",
    "Document a project's technology stack and the reasons behind it.",
    ["architecture", "docs"],
  ],
  [
    "folder-structure-blueprint",
    "Folder structure blueprint",
    "Document and explain a project's folder structure.",
    ["architecture", "docs"],
  ],
  [
    "readme-blueprint",
    "README blueprint",
    "Blueprint the structure of a project README before writing it.",
    ["docs", "readme"],
  ],
  [
    "create-readme",
    "Create README",
    "Draft a complete, structured README for a project.",
    ["docs", "readme"],
  ],
  [
    "create-agentsmd",
    "Create AGENTS.md",
    "Generate an AGENTS.md describing how AI agents should work in a repo.",
    ["agents", "docs"],
  ],
  [
    "create-llms",
    "Create llms.txt",
    "Generate an llms.txt summary so AI tools understand the project.",
    ["ai", "docs"],
  ],
  [
    "add-frontmatter",
    "Add frontmatter",
    "Add or fix YAML frontmatter on a file against the canonical schema.",
    ["frontmatter", "schema"],
  ],
  [
    "documentation-writer",
    "Documentation writer",
    "Write or refine end-user-facing documentation in our house style.",
    ["docs"],
  ],
  [
    "docs-from-comments",
    "Docs from comments",
    "Generate documentation from inline code comments and signatures.",
    ["docs", "code"],
  ],
  [
    "conventional-commit",
    "Conventional commit",
    "Write a Conventional Commits-formatted commit message for a change.",
    ["git", "commits"],
  ],
  [
    "git-branch-creator",
    "Git branch creator",
    "Suggest a branch name that follows the org branching strategy.",
    ["git", "branching"],
  ],
  [
    "epic-breakdown-product",
    "Epic breakdown — product",
    "Break an epic into product-facing features and outcomes.",
    ["planning", "product"],
  ],
  [
    "epic-breakdown-architecture",
    "Epic breakdown — architecture",
    "Break an epic into architectural and technical work.",
    ["planning", "architecture"],
  ],
  [
    "feature-breakdown-prd",
    "Feature breakdown — PRD",
    "Break a feature down from a product requirements document.",
    ["planning", "product"],
  ],
  [
    "feature-breakdown-implementation",
    "Feature breakdown — implementation",
    "Break a feature into concrete implementation tasks.",
    ["planning"],
  ],
  [
    "test-breakdown",
    "Test breakdown",
    "Break testing work into a structured set of tasks and cases.",
    ["testing", "planning"],
  ],
  [
    "prompt-builder",
    "Prompt builder",
    "Build and refine a reusable prompt, step by step.",
    ["prompts", "ai"],
  ],
  [
    "model-recommendation",
    "Model recommendation",
    "Recommend the right AI model for a given task and budget.",
    ["ai", "models"],
  ],
  [
    "reporting",
    "Reporting",
    "Generate a metrics or status report from project data.",
    ["reporting", "metrics"],
  ],
  [
    "repo-story-time",
    "Repo story time",
    "Narrate a repository's history, structure, and decisions.",
    ["docs", "history"],
  ],
  [
    "project-workflow-analysis-blueprint",
    "Workflow analysis blueprint",
    "Analyse and document a project's end-to-end workflow.",
    ["analysis", "workflow"],
  ],
  [
    "generate-custom-instructions-from-codebase",
    "Custom instructions from codebase",
    "Derive Copilot custom instructions by reading an existing codebase.",
    ["copilot", "instructions"],
  ],
  [
    "python-mcp-server-generator",
    "Python MCP server generator",
    "Scaffold a Python MCP server with the right structure and tooling.",
    ["mcp", "python"],
  ],
  [
    "dockerfile-multi-stage",
    "Multi-stage Dockerfile",
    "Author an optimised multi-stage Dockerfile for a service.",
    ["docker", "devops"],
  ],
  [
    "shuffle-json-data",
    "Shuffle JSON data",
    "Shuffle or transform JSON test fixtures while keeping them valid.",
    ["json", "fixtures"],
  ],
];

const PROMPTS = PROMPT_DEFS.map(([slug, name, desc, tags]) =>
  item("prompts", slug, name, desc, {
    type: "install",
    tags,
    path: `prompts/${slug}.prompt`,
  }),
);

/* ── AI DEFAULTS ── */
const AI_DEFAULT_DEFS: [string, string, string, string][] = [
  [
    "claude",
    "Claude.md",
    "Authoritative Claude-specific guidance and pointers for LightSpeed repositories.",
    "ai/Claude.md",
  ],
  [
    "gemini",
    "Gemini.md",
    "Authoritative Google Gemini configuration and integration guidelines.",
    "ai/Gemini.md",
  ],
  [
    "agents",
    "agents.md",
    "Authoritative index for LightSpeed AI agent governance and implementation sources.",
    "ai/agents.md",
  ],
  [
    "runners",
    "RUNNERS.md",
    "Canonical inventory of JavaScript and Bash runners plus telemetry hooks.",
    "ai/RUNNERS.md",
  ],
];

const AI_DEFAULTS = AI_DEFAULT_DEFS.map(([slug, name, desc, path]) =>
  item("tools", "ai-" + slug, name, desc, {
    type: "aiDefault",
    tags: ["ai", "default", "repo-root"],
    path,
    dest: "repository root",
  }),
);

/* ── SCRIPTS ── */
const SCRIPTS_ITEMS: CatalogueItem[] = [
  item(
    "tools",
    "labeling-agent",
    "Labeling agent runner",
    "Applies the canonical label taxonomy to issues and PRs from content and file paths.",
    {
      type: "script",
      path: "scripts/agents/labeling.agent.js",
      run: "node scripts/agents/labeling.agent.js",
      validates: "labels",
      tags: ["agents", "labels"],
    },
  ),
  item(
    "tools",
    "reviewer-agent",
    "Reviewer agent runner",
    "Posts a ✅/⚠️ PR review summary, categorising changed files by risk and flagging blockers.",
    {
      type: "script",
      path: "scripts/agents/reviewer.agent.js",
      run: "node scripts/agents/reviewer.agent.js",
      tags: ["agents", "review"],
    },
  ),
  item(
    "tools",
    "planner-agent",
    "Planner agent runner",
    "Posts merge-readiness checklists and exit criteria to pull requests.",
    {
      type: "script",
      path: "scripts/agents/planner.agent.js",
      run: "node scripts/agents/planner.agent.js",
      tags: ["agents", "planning"],
    },
  ),
  item(
    "tools",
    "audit-frontmatter",
    "Audit frontmatter",
    "Validates instruction, prompt, and agent frontmatter against the canonical schema.",
    {
      type: "script",
      path: "scripts/audit-frontmatter.js",
      run: "node scripts/audit-frontmatter.js",
      validates: "frontmatter",
      tags: ["validation", "frontmatter"],
    },
  ),
  item(
    "tools",
    "validate-coderabbit",
    "Validate CodeRabbit config",
    "Validates the CodeRabbit configuration against its overrides schema.",
    {
      type: "script",
      path: "scripts/validation/validate-coderabbit-yml.cjs",
      run: "node scripts/validation/validate-coderabbit-yml.cjs",
      validates: "coderabbit",
      tags: ["validation", "yaml"],
    },
  ),
  item(
    "tools",
    "verify-docs-commands",
    "Verify docs commands",
    "Checks that commands referenced in the docs actually exist and run.",
    {
      type: "script",
      path: "scripts/verify-docs-commands.js",
      run: "node scripts/verify-docs-commands.js",
      tags: ["validation", "docs"],
    },
  ),
  item(
    "tools",
    "audit-branding",
    "Audit branding patterns",
    "Audits assets and patterns for brand conformance and reports gaps.",
    {
      type: "script",
      path: "scripts/audit-branding-patterns.js",
      run: "node scripts/audit-branding-patterns.js",
      validates: "branding",
      tags: ["audit", "branding"],
    },
  ),
  item(
    "tools",
    "bump-file-version",
    "Bump file version",
    "Increments the version field on a file's frontmatter following SemVer.",
    {
      type: "script",
      path: "scripts/versioning/bump-file-version.cjs",
      run: "node scripts/versioning/bump-file-version.cjs <file>",
      validates: "version",
      tags: ["versioning"],
    },
  ),
  item(
    "tools",
    "consolidate-issue-types",
    "Consolidate issue types",
    "Reconciles issue types against the canonical issue-types taxonomy.",
    {
      type: "script",
      path: "scripts/consolidate-issue-types.js",
      run: "node scripts/consolidate-issue-types.js",
      tags: ["issues", "governance"],
    },
  ),
  item(
    "tools",
    "fix-staleness-dates",
    "Fix staleness dates",
    "Refreshes last_updated dates across docs to keep staleness honest.",
    {
      type: "script",
      path: "scripts/fix-staleness-dates.js",
      run: "node scripts/fix-staleness-dates.js",
      tags: ["docs", "maintenance"],
    },
  ),
  item(
    "tools",
    "fix-mermaid",
    "Fix Mermaid diagrams",
    "Repairs malformed Mermaid diagram blocks in markdown.",
    {
      type: "script",
      path: "scripts/fix-mermaid-diagrams.js",
      run: "node scripts/fix-mermaid-diagrams.js",
      tags: ["docs", "mermaid"],
    },
  ),
  item(
    "tools",
    "gather-metrics",
    "Gather metrics",
    "Collects repository metrics for the reporting pipeline.",
    {
      type: "script",
      path: "scripts/gather-metrics.js",
      run: "node scripts/gather-metrics.js",
      tags: ["metrics", "reporting"],
    },
  ),
];

/* ── SCHEMAS ── */
const SCHEMAS_ITEMS: CatalogueItem[] = [
  item(
    "tools",
    "frontmatter-schema",
    "Frontmatter schema",
    "The master schema every instruction, prompt, and agent's frontmatter is validated against.",
    {
      type: "schema",
      path: "schema/frontmatter.schema.json",
      validates: "Instructions · Prompts · Agents",
      tags: ["frontmatter", "json"],
    },
  ),
  item(
    "tools",
    "agent-config-schema",
    "Agent config schema",
    "Validates an agent's configuration — name, scope, model, and escalation rules.",
    {
      type: "schema",
      path: "schema/agent-config.schema.json",
      validates: "Agents",
      tags: ["agents", "json"],
    },
  ),
  item(
    "tools",
    "skill-metadata-schema",
    "Skill metadata schema",
    "Validates the metadata block that describes a portable skill package.",
    {
      type: "schema",
      path: "schema/skill-metadata.schema.json",
      validates: "Skills",
      tags: ["skills", "json"],
    },
  ),
  item(
    "tools",
    "skill-agent-config-schema",
    "Skill agent config schema",
    "Validates the agent configuration embedded inside a skill.",
    {
      type: "schema",
      path: "schema/skill-agent-config.schema.json",
      validates: "Skills",
      tags: ["skills", "json"],
    },
  ),
  item(
    "tools",
    "plugin-manifest-schema",
    "Plugin manifest schema",
    "Validates a plugin pack's manifest — contents, dependencies, and version.",
    {
      type: "schema",
      path: "schema/plugin-manifest.schema.json",
      validates: "Plugins",
      tags: ["plugins", "json"],
    },
  ),
  item(
    "tools",
    "changelog-schema",
    "Changelog schema",
    "Validates Keep-a-Changelog entries used by the release process.",
    {
      type: "schema",
      path: "schema/changelog.schema.json",
      validates: "Releases",
      tags: ["changelog", "json"],
    },
  ),
  item(
    "tools",
    "version-schema",
    "Version schema",
    "Validates SemVer version strings across resources and packs.",
    {
      type: "schema",
      path: "schema/version.schema.json",
      validates: "Versioning",
      tags: ["versioning", "json"],
    },
  ),
  item(
    "tools",
    "branding-schema",
    "Branding schema",
    "Validates branding assets and patterns against the brand definition.",
    {
      type: "schema",
      path: "schema/branding-schema.json",
      validates: "Branding audit",
      tags: ["branding", "json"],
    },
  ),
  item(
    "tools",
    "project-fields-schema",
    "Project fields schema",
    "Validates GitHub Project field definitions used by automation.",
    {
      type: "schema",
      path: "schema/project-fields.schema.json",
      validates: "Project boards",
      tags: ["projects", "json"],
    },
  ),
  item(
    "tools",
    "footer-config-schema",
    "Footer config schema",
    "Validates the footer configuration block shared across repos.",
    {
      type: "schema",
      path: "schema/footer-config.schema.json",
      validates: "Footer config",
      tags: ["config", "json"],
    },
  ),
  item(
    "tools",
    "coderabbit-schema",
    "CodeRabbit overrides",
    "Validates CodeRabbit review configuration overrides.",
    {
      type: "schema",
      path: "schema/coderabbit-overrides.v2.json",
      validates: "CodeRabbit config",
      tags: ["coderabbit", "json"],
    },
  ),
  item(
    "tools",
    "schema-registry",
    "Schema registry",
    "The index of every portable schema and what it owns.",
    {
      type: "schema",
      path: "schema/schema-registry.json",
      validates: "All schemas",
      tags: ["registry", "json"],
    },
  ),
];

/* ── CONFIG TOOLS ── */
const CONFIG_TOOLS_ITEMS: CatalogueItem[] = [
  item(
    "tools",
    "vscode",
    "VS Code workspace",
    "Recommended extensions, settings, and tasks for a consistent dev environment.",
    { type: "script", path: ".vscode", tree: true, tags: ["vscode", "setup"] },
  ),
  item(
    "tools",
    "editorconfig",
    "EditorConfig",
    "Cross-editor indentation and whitespace rules.",
    { type: "script", path: ".editorconfig", tags: ["editorconfig", "format"] },
  ),
  item(
    "tools",
    "env-template",
    "Env template",
    "Annotated .env.example covering every variable our tooling expects.",
    { type: "script", path: ".env.example", tags: ["env", "setup"] },
  ),
  item(
    "tools",
    "labels",
    "Labels manifest",
    "The canonical labels.yml every member repo inherits.",
    { type: "script", path: ".github/labels.yml", tags: ["labels", "yaml"] },
  ),
];

export const ITEMS: CatalogueItem[] = [
  /* ── AGENTS ── */
  item(
    "agents",
    "reviewer",
    "Code reviewer",
    "Diff-aware reviewer enforcing standards, a11y, security and performance with concrete fixes.",
    {
      type: "install",
      tags: ["review", "quality", "a11y"],
      path: "agents/reviewer.agent.md",
      body: MD["reviewer"],
    },
  ),
  item(
    "agents",
    "release",
    "Release",
    "Prepares Keep-a-Changelog releases, groups merged PRs, and proposes SemVer bumps.",
    {
      type: "install",
      tags: ["release", "changelog", "git"],
      path: "agents/release.agent.md",
      body: MD["release"],
    },
  ),
  item(
    "agents",
    "adr",
    "ADR author",
    "Captures architecture decisions, context, and consequences as numbered records.",
    {
      type: "install",
      tags: ["adr", "architecture", "docs"],
      path: "agents/adr.agent.md",
    },
  ),
  item(
    "agents",
    "labeling",
    "Labeling",
    "Applies the canonical label taxonomy to issues and PRs from content and paths.",
    {
      type: "install",
      tags: ["labels", "triage", "automation"],
      path: "agents/labeling.agent.md",
    },
  ),
  item(
    "agents",
    "task-planner",
    "Task planner",
    "Decomposes an epic into phased, testable implementation tasks.",
    {
      type: "install",
      tags: ["planning", "epics"],
      path: "agents/task-planner.agent.md",
    },
  ),
  item(
    "agents",
    "reporting",
    "Reporting",
    "Generates metrics and status reports across the organisation's repositories.",
    {
      type: "install",
      tags: ["reporting", "metrics"],
      path: "agents/reporting.agent.md",
    },
  ),
  item(
    "agents",
    "prompt-engineer",
    "Prompt engineer",
    "Drafts and refines reusable prompts and agent system messages.",
    {
      type: "install",
      tags: ["prompts", "ai"],
      path: "agents/prompt-engineer.agent.md",
    },
  ),
  item(
    "agents",
    "testing",
    "Testing",
    "Plans and reviews test coverage against our quality-assurance standard.",
    {
      type: "install",
      tags: ["testing", "qa"],
      path: "agents/testing.agent.md",
    },
  ),
  item(
    "agents",
    "linting",
    "Linting",
    "Runs and explains lint failures across PHP, JS, YAML, and Markdown.",
    {
      type: "install",
      tags: ["lint", "quality"],
      path: "agents/linting.agent.md",
    },
  ),
  item(
    "agents",
    "ai-readiness-estimator",
    "AI Readiness Estimator",
    "Assesses organisational and technical readiness for AI implementation.",
    {
      type: "install",
      tags: ["ai", "assessment", "readiness"],
      path: "agents/ai-readiness-estimator-agent",
      tree: true,
    },
  ),
  item(
    "agents",
    "website-scope-estimator",
    "Website Scope Estimator",
    "Estimates project scope, timeline, and resource requirements for websites.",
    {
      type: "install",
      tags: ["estimation", "planning", "website"],
      path: "agents/website-scope-estimator-agent",
      tree: true,
    },
  ),
  item(
    "agents",
    "playwright-testing",
    "Playwright Testing",
    "Automates browser testing, visual regression detection, and cross-browser validation.",
    {
      type: "install",
      tags: ["testing", "automation", "qa"],
      path: "agents/playwright-testing-agent",
      tree: true,
    },
  ),
  item(
    "agents",
    "zendesk-support",
    "Zendesk Support",
    "Manages support tickets, customer issues, and knowledge base maintenance.",
    {
      type: "install",
      tags: ["support", "integration", "customer"],
      path: "agents/zendesk-support-agent",
      tree: true,
    },
  ),
  item(
    "agents",
    "design-partner",
    "Design Partner",
    "Facilitates design collaboration, feedback collection, and design system management.",
    {
      type: "install",
      tags: ["design", "collaboration", "systems"],
      path: "agents/design-partner-agent",
      tree: true,
    },
  ),
  item(
    "agents",
    "prd-factory-planner",
    "PRD Factory & Planner",
    "Generates and manages Product Requirements Documents with structured planning.",
    {
      type: "install",
      tags: ["prd", "planning", "product"],
      path: "agents/prd-factory-planner-agent",
      tree: true,
    },
  ),
  item(
    "agents",
    "website-content-strategist",
    "Website Content Strategist",
    "Develops content strategies, editorial calendars, and website messaging optimisation.",
    {
      type: "install",
      tags: ["content", "strategy", "website"],
      path: "agents/website-content-strategist-agent",
      tree: true,
    },
  ),
  item(
    "agents",
    "woo-config",
    "WooCommerce Configuration",
    "Automates WooCommerce setup, configuration, and eCommerce optimisation.",
    {
      type: "install",
      tags: ["ecommerce", "woocommerce", "configuration"],
      path: "agents/woo-config-agent",
      tree: true,
    },
  ),
  item(
    "agents",
    "wp-config",
    "WordPress Configuration",
    "Manages WordPress site configuration, plugins, themes, and security.",
    {
      type: "install",
      tags: ["wordpress", "configuration", "setup"],
      path: "agents/wp-config-agent",
      tree: true,
    },
  ),
  item(
    "agents",
    "tour-operator-config",
    "Tour Operator Configuration",
    "Specialises in tour and travel operator workflows, booking systems, and itineraries.",
    {
      type: "install",
      tags: ["travel", "booking", "configuration"],
      path: "agents/tour-operator-config-agent",
      tree: true,
    },
  ),
  item(
    "agents",
    "proposal-desk",
    "Proposal Desk",
    "Automates proposal generation, template management, and contract tracking.",
    {
      type: "install",
      tags: ["proposals", "sales", "automation"],
      path: "agents/proposal-desk-agent",
      tree: true,
    },
  ),
  item(
    "agents",
    "prd",
    "PRD Agent",
    "Manages product requirement documents with AI-assisted creation and validation.",
    {
      type: "install",
      tags: ["prd", "product", "specs"],
      path: "agents/prd-agent",
      tree: true,
    },
  ),
  item(
    "agents",
    "pagespeed",
    "PageSpeed Agent",
    "Monitors, analyses, and optimises website performance using PageSpeed Insights.",
    {
      type: "install",
      tags: ["performance", "optimization", "website"],
      path: "agents/pagespeed-agent",
      tree: true,
    },
  ),
  item(
    "agents",
    "harvest-analytics",
    "Harvest Analytical",
    "Integrates with Harvest for time tracking, project analytics, and resource utilisation.",
    {
      type: "install",
      tags: ["analytics", "reporting", "metrics"],
      path: "agents/harvest-analytical-agent",
      tree: true,
    },
  ),
  item(
    "agents",
    "linear-advisor",
    "Linear Advisor",
    "Provides issue management assistance, triage, and workflow optimisation support.",
    {
      type: "install",
      tags: ["issues", "triage", "management"],
      path: "agents/linear-advisor-agent",
      tree: true,
    },
  ),
  item(
    "agents",
    "client-website-discovery",
    "Client Website Discovery",
    "Facilitates client discovery processes and documents requirements for websites.",
    {
      type: "install",
      tags: ["discovery", "requirements", "client"],
      path: "agents/client-website-discovery-assistant-agent",
      tree: true,
    },
  ),

  /* ── INSTRUCTIONS ── */
  item(
    "instructions",
    "custom-instructions",
    "Org Copilot instructions",
    "The default org-wide Copilot behaviour surfaced across every LightSpeed repository.",
    {
      type: "install",
      tags: ["copilot", "org-wide", "governance"],
      version: "v3.1",
      applyTo: "**",
      path: ".github/custom-instructions.md",
      body: MD["custom-instructions"],
    },
  ),
  item(
    "instructions",
    "coding-standards",
    "Coding standards",
    "Unified WordPress Coding Standards for PHP, JS, CSS, and HTML across all repos.",
    {
      type: "install",
      tags: ["wpcs", "php", "javascript"],
      applyTo: "**",
      path: "instructions/coding-standards.instructions.md",
    },
  ),
  item(
    "instructions",
    "a11y",
    "Accessibility",
    "WCAG 2.2 AA standards for themes, blocks, and patterns — semantics, focus, contrast.",
    {
      type: "install",
      tags: ["a11y", "wcag", "keyboard"],
      version: "v2.0",
      applyTo: "**/*.{php,js,html,css}",
      path: "instructions/a11y.instructions.md",
      body: MD["a11y"],
    },
  ),
  item(
    "instructions",
    "plugin-structure",
    "Plugin structure",
    "Block-first plugin layout, block.json conventions, asset enqueueing, security and i18n.",
    {
      type: "install",
      tags: ["wordpress", "plugin", "block-json"],
      applyTo: "**",
      path: "instructions/plugin-structure.instructions.md",
      body: MD["plugin-structure"],
    },
  ),
  item(
    "instructions",
    "languages",
    "Languages",
    "JS/TS, JSON, YAML, and JSDoc conventions in one consolidated standard.",
    {
      type: "install",
      tags: ["javascript", "typescript", "yaml"],
      applyTo: "**",
      path: "instructions/languages.instructions.md",
    },
  ),
  item(
    "instructions",
    "linting",
    "Linting",
    "ESLint, Prettier, PHPCS, markdownlint, and YAML lint rules and config.",
    {
      type: "install",
      tags: ["eslint", "phpcs", "prettier"],
      applyTo: "**",
      path: "instructions/linting.instructions.md",
    },
  ),
  item(
    "instructions",
    "labeling",
    "Labeling",
    "How labels are named, coloured, and applied across the organisation.",
    {
      type: "install",
      tags: ["labels", "triage"],
      applyTo: "**",
      path: "docs/LABELING.md",
    },
  ),
  item(
    "instructions",
    "quality-assurance",
    "Quality assurance",
    "Testing, Jest, coverage, and CI gates consolidated into one standard.",
    {
      type: "install",
      tags: ["testing", "jest", "ci"],
      applyTo: "**",
      path: "instructions/quality-assurance.instructions.md",
    },
  ),
  item(
    "instructions",
    "spec-driven-workflow",
    "Spec-driven workflow",
    "Spec-first delivery: specification, plan, implementation, validation.",
    {
      type: "install",
      tags: ["specs", "workflow", "planning"],
      applyTo: "**",
      path: "instructions/spec-driven-workflow.instructions.md",
    },
  ),
  item(
    "instructions",
    "file-organisation",
    "File organisation",
    "Where files live and how they're named across LightSpeed repositories.",
    {
      type: "install",
      tags: ["structure", "naming"],
      applyTo: "**",
      path: "instructions/file-organisation.instructions.md",
    },
  ),
  item(
    "instructions",
    "documentation-formats",
    "Documentation formats",
    "Markdown, frontmatter, and Mermaid conventions for all docs.",
    {
      type: "install",
      tags: ["markdown", "frontmatter", "mermaid"],
      applyTo: "**",
      path: "instructions/documentation-formats.instructions.md",
    },
  ),
  item(
    "instructions",
    "community-standards",
    "Community standards",
    "File org, naming, README, and saved-reply conventions for community health.",
    {
      type: "install",
      tags: ["community", "readme"],
      applyTo: "**",
      path: "instructions/community-standards.instructions.md",
    },
  ),

  /* ── PROMPTS ── */
  ...PROMPTS,

  /* ── SKILLS ── */
  item(
    "skills",
    "pr-review",
    "PR review",
    "Portable skill that reviews a pull request against LightSpeed standards.",
    {
      type: "install",
      tags: ["review", "pr", "quality"],
      path: "skills/lightspeed-pr-review",
      tree: true,
    },
  ),
  item(
    "skills",
    "frontmatter-audit",
    "Frontmatter audit",
    "Validates instruction, prompt, and agent frontmatter against the schema.",
    {
      type: "install",
      tags: ["frontmatter", "schema", "audit"],
      path: "skills/lightspeed-frontmatter-audit",
      tree: true,
    },
  ),
  item(
    "skills",
    "label-governance",
    "Label governance",
    "Audits and reconciles labels against the canonical taxonomy.",
    {
      type: "install",
      tags: ["labels", "governance"],
      path: "skills/lightspeed-label-governance",
      tree: true,
    },
  ),
  item(
    "skills",
    "agent-creator",
    "Agent creator",
    "Scaffolds a new agent package — system prompt, references, and checks.",
    {
      type: "install",
      tags: ["agents", "scaffold"],
      path: "skills/design-md-agent/agent-creator",
      tree: true,
    },
  ),
  item(
    "skills",
    "apply-design-system",
    "Apply design system",
    "Applies a design system's tokens and components to a target surface.",
    {
      type: "install",
      tags: ["design-system", "tokens"],
      path: "skills/design-md-agent/apply-design-system",
      tree: true,
    },
  ),
  item(
    "skills",
    "audit-design-system",
    "Audit design system",
    "Audits a surface for design-system conformance and reports gaps.",
    {
      type: "install",
      tags: ["design-system", "audit"],
      path: "skills/design-md-agent/audit-design-system",
      tree: true,
    },
  ),
  item(
    "skills",
    "ai-governance-documentor",
    "AI governance documentor",
    "Generates an AI governance guide from a minimal set of client inputs.",
    {
      type: "install",
      tags: ["governance", "docs", "ai"],
      path: "skills/design-md-agent/ai-governance-documentor",
      tree: true,
    },
  ),

  /* ── HOOKS ── */
  item(
    "hooks",
    "husky",
    "Husky pre-commit",
    "The pre-commit hook chain that runs lint and format checks before code lands.",
    {
      type: "guardrail",
      tags: ["pre-commit", "husky", "git"],
      path: ".husky",
      tree: true,
    },
  ),
  item(
    "hooks",
    "markdownlint",
    "Markdown lint",
    "Enforce heading style, spacing, and list formatting on every markdown change.",
    {
      type: "guardrail",
      tags: ["markdown", "lint"],
      path: ".markdownlint.config.cjs",
    },
  ),
  item(
    "hooks",
    "eslint",
    "ESLint config",
    "Shared ESLint flat config for JS and TS across the organisation.",
    {
      type: "guardrail",
      tags: ["eslint", "javascript"],
      path: ".eslint.config.cjs",
    },
  ),
  item(
    "hooks",
    "spectral",
    "Spectral lint",
    "Lint reusable Actions and workflow YAML for syntax integrity and policy.",
    {
      type: "guardrail",
      tags: ["spectral", "workflows", "yaml"],
      path: ".spectral.yaml",
    },
  ),
  item(
    "hooks",
    "yamllint",
    "YAML lint",
    "Validate YAML indentation and structure before it reaches CI.",
    { type: "guardrail", tags: ["yaml", "lint"], path: ".yamllint.config.cjs" },
  ),
  item(
    "hooks",
    "prettier",
    "Prettier config",
    "Shared formatting rules so every repo writes code the same way.",
    {
      type: "guardrail",
      tags: ["prettier", "format"],
      path: ".prettier.config.cjs",
    },
  ),

  /* ── PLUGINS ── */
  item(
    "plugins",
    "github-ops",
    "LightSpeed GitHub Ops",
    "The flagship installable pack: governance, automation, and AI-ops in one bundle.",
    {
      type: "pack",
      tags: ["pack", "governance", "ai-ops"],
      path: "plugins/lightspeed-github-ops",
      tree: true,
    },
  ),
  item(
    "plugins",
    "plugins-readme",
    "Plugin packs overview",
    "How plugin packs are structured, versioned, and installed.",
    { type: "pack", tags: ["pack", "docs"], path: "plugins/README.md" },
  ),

  /* ── WORKFLOWS ── */
  item(
    "workflows",
    "wordpress-project-onboarding",
    "WordPress project onboarding",
    "Stands up a new WordPress project with every LightSpeed standard, template, and guardrail in place.",
    {
      type: "workflow",
      duration: "2–3 hours",
      tags: ["onboarding", "wordpress", "setup"],
      path: "workflows/wordpress-project-onboarding.md",
      action: ".github/workflows/labeling.yml",
    },
  ),
  item(
    "workflows",
    "wordpress-spec-to-implementation",
    "WordPress spec → implementation",
    "Turns a WordPress PRD into working, tested code through a phased agentic workflow.",
    {
      type: "workflow",
      duration: "4–8 hours",
      tags: ["specs", "implementation", "testing"],
      path: "workflows/wordpress-spec-to-implementation.md",
      action: ".github/workflows/testing.yml",
    },
  ),
  item(
    "workflows",
    "portable-ai-plugin-restructure",
    "Portable AI plugin restructure",
    "Reorganises and ports AI plugins to the portable, manifest-driven structure.",
    {
      type: "workflow",
      duration: "6–10 hours",
      tags: ["plugins", "restructure", "ai-ops"],
      path: "workflows/portable-ai-plugin-restructure.md",
      action: ".github/workflows/linting.yml",
    },
  ),
  item(
    "workflows",
    "release-readiness-validation",
    "Release readiness validation",
    "Validates that a project meets every exit criterion before a release is cut.",
    {
      type: "workflow",
      duration: "1–2 hours",
      tags: ["release", "validation", "ci"],
      path: "workflows/release-readiness-validation.md",
      action: ".github/workflows/release.yml",
    },
  ),
  item(
    "workflows",
    "weekly-governance-sync",
    "Weekly governance sync",
    "Synchronises labels, templates, and standards across every repo on a weekly cadence.",
    {
      type: "workflow",
      duration: "~1 hour",
      tags: ["governance", "sync", "scheduled"],
      path: "workflows/weekly-governance-sync.md",
      action: ".github/workflows/project-meta-sync.yml",
    },
  ),

  /* ── TOOLS ── */
  ...SCRIPTS_ITEMS,
  ...SCHEMAS_ITEMS,
  ...CONFIG_TOOLS_ITEMS,
  ...AI_DEFAULTS,
];

/* ── Helpers ── */

export function getItemsByCategory(cat: string): CatalogueItem[] {
  return ITEMS.filter((i) => i.cat === cat);
}

export function getItemBySlug(
  cat: string,
  slug: string,
): CatalogueItem | undefined {
  return ITEMS.find((i) => i.cat === cat && i.slug === slug);
}

export function getCategoryInfo(id: string): Category | undefined {
  return CATEGORIES.find((c) => c.id === id);
}

export function getCategoryCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const item of ITEMS) {
    counts[item.cat] = (counts[item.cat] || 0) + 1;
  }
  return counts;
}
