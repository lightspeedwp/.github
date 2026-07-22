/* ──────────────────────────────────────────────────────────────────
   Glossary data — ported from glossary-data.js
   ────────────────────────────────────────────────────────────────── */

import { REPO } from "./catalogue";

export interface GlossaryEntry {
  slug: string;
  term: string;
  def: string;
  why: string;
  related: string[];
}

export interface GlossaryGroup {
  id: string;
  label: string;
  blurb: string;
  entries: GlossaryEntry[];
}

export interface ReferenceItem {
  p: string;
  d: string;
  tree?: boolean;
}

export interface ReferenceGroup {
  id: string;
  label: string;
  blurb: string;
  items: ReferenceItem[];
}

export function refUrl(
  path: string,
  branch: string = "main",
  tree: boolean = false,
): string {
  const kind = tree ? "tree" : "blob";
  return `https://github.com/${REPO}/${kind}/${branch}/${path}`;
}

export const GLOSSARY_GROUPS: GlossaryGroup[] = [
  {
    id: "lightspeed",
    label: "LightSpeed terms",
    blurb:
      "The vocabulary specific to how LightSpeed runs the .github control plane.",
    entries: [
      {
        slug: "control-plane",
        term: "Control plane",
        def: "A single repository — here, .github — that governs configuration, automation, and standards across an entire organisation or fleet of repositories.",
        why: "It's the whole idea of the site: one place to change a standard, and every repo moves with it.",
        related: [
          "single-source-of-truth",
          "hub-and-spoke",
          "repository-inheritance",
        ],
      },
      {
        slug: "canonical-assets",
        term: "Canonical assets",
        def: "Source-of-truth files — instructions, schemas, workflows, prompts — maintained in one place and inherited or distributed everywhere else.",
        why: "Stops the same instruction file from drifting into five slightly different copies.",
        related: ["single-source-of-truth", "portable-assets"],
      },
      {
        slug: "hooks-layer",
        term: "Hooks layer",
        def: 'A semantic abstraction over automation. A hook describes what should happen ("label new issues") without saying where or how it runs.',
        why: "Lets us talk about intent separately from GitHub Actions plumbing — the same hook can target different runners.",
        related: ["workflow-layer", "decoupling"],
      },
      {
        slug: "workflow-layer",
        term: "Workflow layer",
        def: "The GitHub Actions implementation that turns hook declarations into executable CI/CD jobs.",
        why: "The mechanics live here, so hooks stay portable and the engine can change underneath them.",
        related: ["hooks-layer", "github-actions", "decoupling"],
      },
      {
        slug: "plugin-pack",
        term: "Plugin pack",
        def: "A curated, versioned bundle of capabilities — governance, automation, and AI-ops — distributed as a reusable collection.",
        why: "It's the pivot of the whole model — the repo stops being only a governance hub and becomes something you install.",
        related: ["manifest", "plugin-distribution", "portable-assets"],
      },
      {
        slug: "manifest",
        term: "Manifest",
        def: "A structured JSON or YAML file that declares what a plugin pack contains, its dependencies, and its configuration.",
        why: "Makes a pack discoverable and validatable by machines — adoption without manual copying.",
        related: ["plugin-pack", "schema-validation"],
      },
      {
        slug: "plugin-distribution",
        term: "Plugin distribution",
        def: "Packaging and delivering reusable plugins from the .github control plane out to consuming repositories.",
        why: "Teams adopt capabilities without forking or hand-copying files.",
        related: ["plugin-pack", "portable-assets"],
      },
      {
        slug: "portable-assets",
        term: "Portable assets",
        def: "Agents, instructions, hooks, and workflows designed to work outside the repo they were born in — no hard-coded paths or local assumptions.",
        why: "Portability is what makes the plugin-pack model possible.",
        related: ["canonical-assets", "portability"],
      },
      {
        slug: "repository-inheritance",
        term: "Repository inheritance",
        def: "A repo automatically picking up configuration, workflows, and templates from a parent .github repo.",
        why: "New projects get the standards for free on day one.",
        related: ["control-plane", "inheritance-boundaries"],
      },
      {
        slug: "template-system",
        term: "Template system",
        def: "A framework for generating consistent files — issue templates, PR templates, docs — across repos using frontmatter and placeholders.",
        why: "Every repo asks for the same structured information without anyone re-writing the forms.",
        related: ["frontmatter", "issue-template", "pull-request-template"],
      },
      {
        slug: "frontmatter",
        term: "Frontmatter",
        def: "A block of YAML metadata at the top of a Markdown file, fenced by ---. Declares properties, schemas, and automation rules.",
        why: "It's how every catalogue item carries its description, version, tags, and apply-to scope.",
        related: ["schema-validation", "canonical-assets"],
      },
    ],
  },
  {
    id: "github",
    label: "GitHub basics",
    blurb: "The GitHub primitives the control plane is built on.",
    entries: [
      {
        slug: "github-actions",
        term: "GitHub Actions",
        def: "GitHub's built-in CI/CD platform for running scripts, tests, and deployments triggered by repository events.",
        why: "It's the engine the workflow layer compiles down to.",
        related: ["workflow", "workflow-layer"],
      },
      {
        slug: "workflow",
        term: "Workflow",
        def: "A YAML automation file in .github/workflows/ describing jobs triggered by GitHub events.",
        why: "The reusable building block we publish in the Workflows catalogue.",
        related: ["github-actions", "workflow-layer"],
      },
      {
        slug: "issue-template",
        term: "Issue template",
        def: "A pre-formatted Markdown file that populates the New Issue form to capture structured information.",
        why: "Surfaced org-wide from the control plane so every repo triages the same way.",
        related: ["template-system", "label"],
      },
      {
        slug: "pull-request-template",
        term: "Pull request template",
        def: "A pre-formatted file that guides contributors through a PR, often with testing, docs, and accessibility checklists.",
        why: "Keeps review quality consistent across every repo.",
        related: ["template-system"],
      },
      {
        slug: "label",
        term: "Label",
        def: "A tag on issues and PRs used to categorise, prioritise, and filter work.",
        why: "Canonical labels live in the control plane so triage means the same thing everywhere.",
        related: ["automation-rule"],
      },
      {
        slug: "automation-rule",
        term: "Automation rule",
        def: "A condition-and-action spec that auto-applies labels, assigns reviewers, or closes issues based on metadata or content.",
        why: "Powers governance that runs itself instead of relying on memory.",
        related: ["label", "ai-driven-governance"],
      },
      {
        slug: "semantic-versioning",
        term: "Semantic versioning",
        def: "A MAJOR.MINOR.PATCH scheme that signals the nature of a change.",
        why: "Every resource and plugin pack is versioned so teams can adopt updates predictably.",
        related: ["plugin-pack", "manifest"],
      },
    ],
  },
  {
    id: "aiops",
    label: "AI-ops concepts",
    blurb: "How AI gets governed, not just used.",
    entries: [
      {
        slug: "agent",
        term: "Agent",
        def: "An AI-powered system that autonomously performs tasks — labelling issues, drafting release notes, reviewing code — given instructions and context.",
        why: "The Agents catalogue is exactly these, scoped and versioned.",
        related: ["skill", "copilot", "task-delegation"],
      },
      {
        slug: "skill",
        term: "Skill",
        def: "A self-contained, reusable automation capability bundling logic, docs, and examples so it travels across projects.",
        why: "Skills are the portable recipes in the Skills catalogue.",
        related: ["agent", "portable-assets"],
      },
      {
        slug: "ai-driven-governance",
        term: "AI-driven governance",
        def: "Using AI agents to enforce standards, policies, and conventions across repositories.",
        why: "The point of the whole repo — consistency at a scale humans can't review by hand.",
        related: ["agent", "automation-rule", "control-plane"],
      },
      {
        slug: "copilot",
        term: "Copilot",
        def: "GitHub Copilot, an AI assistant that generates code, docs, and automation, and can be steered by custom instructions.",
        why: "Our instructions install straight into Copilot so it follows LightSpeed standards.",
        related: ["prompt-engineering", "agent"],
      },
      {
        slug: "prompt-engineering",
        term: "Prompt engineering",
        def: "Crafting instructions and context to guide an AI agent toward consistent, high-quality behaviour.",
        why: "Why our prompts and instructions are versioned, reviewed assets — not throwaway text.",
        related: ["copilot", "llm"],
      },
      {
        slug: "schema-validation",
        term: "Schema validation",
        def: "Automated checking that data — frontmatter, issue metadata, config — matches a declared structure.",
        why: "Keeps every catalogue item valid before it ships.",
        related: ["frontmatter", "manifest"],
      },
      {
        slug: "task-delegation",
        term: "Task delegation",
        def: "Handing a well-scoped task — with context, constraints, and exit criteria — to an AI agent to complete.",
        why: "The whole workflow layer is built on this model.",
        related: ["agent", "skill"],
      },
      {
        slug: "llm",
        term: "LLM",
        def: "Large Language Model — the generative AI foundation underlying Copilot, Claude, and other agents.",
        why: "Understanding the model helps you write instructions that work reliably.",
        related: ["copilot", "prompt-engineering"],
      },
    ],
  },
  {
    id: "architecture",
    label: "Architecture patterns",
    blurb: "The structural patterns that make the control plane composable.",
    entries: [
      {
        slug: "single-source-of-truth",
        term: "Single source of truth",
        def: "One canonical location for each piece of configuration or content — no copies that can drift.",
        why: "Why the .github repo exists: one place to update, every dependent picks it up.",
        related: ["canonical-assets", "control-plane"],
      },
      {
        slug: "hub-and-spoke",
        term: "Hub-and-spoke",
        def: "A topology where one central repo (the hub) distributes standards and configuration to many satellite repos (the spokes).",
        why: "The architectural pattern behind org-wide inheritance.",
        related: ["control-plane", "repository-inheritance"],
      },
      {
        slug: "inheritance-boundaries",
        term: "Inheritance boundaries",
        def: "The explicit rules about which configurations flow automatically from the hub versus which must be opted into.",
        why: "Prevents accidental override of org-level standards by repo-level config.",
        related: ["repository-inheritance", "single-source-of-truth"],
      },
      {
        slug: "modular-architecture",
        term: "Modular architecture",
        def: "Designing systems as independent, composable units that can be combined without tight coupling.",
        why: "What lets skills, hooks, and workflows be portable across repos.",
        related: ["decoupling", "portability"],
      },
      {
        slug: "decoupling",
        term: "Decoupling",
        def: "Separating the intent of an action (the hook) from its implementation (the workflow) so each can change independently.",
        why: "The hooks-layer / workflow-layer split is a direct application of this.",
        related: ["hooks-layer", "workflow-layer", "modular-architecture"],
      },
      {
        slug: "portability",
        term: "Portability",
        def: "The property of a component that lets it run in multiple environments without modification.",
        why: "Portable assets are the whole point of the Skills and Workflows catalogues.",
        related: ["portable-assets", "modular-architecture"],
      },
      {
        slug: "scalability",
        term: "Scalability",
        def: "The ability of the control plane to govern more repos without proportionally more effort.",
        why: "Automation and AI-driven governance are how we scale standards across a growing organisation.",
        related: ["ai-driven-governance", "single-source-of-truth"],
      },
    ],
  },
  {
    id: "wordpress",
    label: "WordPress context",
    blurb:
      "WordPress-specific terms that shape how we build plugins and agents.",
    entries: [
      {
        slug: "wp-agent-skills",
        term: "WP agent skills",
        def: "Agent skills tuned to WordPress conventions — block.json, WPCS, i18n, and the wp-scripts toolchain.",
        why: "Our Skills catalogue includes WordPress-specific automation so agents follow platform conventions.",
        related: ["skill", "agent"],
      },
      {
        slug: "gpl",
        term: "GPL",
        def: "The GNU General Public Licence — the open-source licence WordPress and most of its ecosystem use.",
        why: "All code we ship for WordPress must be GPL-compatible.",
        related: [],
      },
      {
        slug: "wp-plugin",
        term: "WordPress plugin",
        def: "A PHP package that extends WordPress using its hooks and APIs, registered via the main plugin file header.",
        why: "Our plugin-structure instruction governs how LightSpeed plugins are built.",
        related: ["gpl"],
      },
      {
        slug: "block-editor",
        term: "Block editor",
        def: "The Gutenberg-based editor that replaced the classic editor in WordPress 5.0, powered by React and block.json.",
        why: "Block-first development is our default — agents and instructions enforce it.",
        related: ["wp-plugin"],
      },
    ],
  },
];

export const REFERENCE_GROUPS: ReferenceGroup[] = [
  {
    id: "positioning",
    label: "Positioning & strategy",
    blurb:
      "The high-level docs that explain why the repo exists and how it's structured.",
    items: [
      { p: "README.md", d: "Repo overview and entry point" },
      { p: "docs/ARCHITECTURE.md", d: "How the repo layers are organised" },
      { p: "AGENTS.md", d: "Global AI rules for every agent" },
    ],
  },
  {
    id: "governance",
    label: "Governance & labelling",
    blurb: "The standards that make issues and PRs legible across every repo.",
    items: [
      { p: ".github/labels.yml", d: "Canonical label taxonomy" },
      { p: "docs/LABELING.md", d: "Labelling strategy and one-hot rule" },
      { p: "docs/ISSUE_TYPES.md", d: "32-type issue taxonomy" },
      { p: "docs/AUTOMATION.md", d: "Which workflows run where" },
    ],
  },
  {
    id: "triage",
    label: "Triage & templates",
    blurb:
      "Templates and forms that capture structured data from contributors.",
    items: [
      {
        p: ".github/ISSUE_TEMPLATE",
        d: "Issue template directory",
        tree: true,
      },
      { p: ".github/pull_request_template.md", d: "PR template" },
      {
        p: ".github/DISCUSSION_TEMPLATE",
        d: "Discussion templates",
        tree: true,
      },
    ],
  },
  {
    id: "ai",
    label: "AI defaults & agents",
    blurb: "The canonical AI configuration files and agent sources.",
    items: [
      { p: "ai/Claude.md", d: "Claude-specific guidance" },
      { p: "ai/Gemini.md", d: "Gemini configuration" },
      { p: "ai/agents.md", d: "Agent governance index" },
      { p: "agents", d: "All agent source files", tree: true },
    ],
  },
  {
    id: "quality",
    label: "Quality & release",
    blurb: "The gates a change passes through and the release ritual.",
    items: [
      { p: "docs/LINTING.md", d: "Linting strategy" },
      { p: "docs/TESTING.md", d: "Testing approach and CI gates" },
      { p: "docs/RELEASE_PROCESS.md", d: "Release ritual" },
      { p: "docs/BRANCHING_STRATEGY.md", d: "Branch naming and protection" },
    ],
  },
  {
    id: "pivot",
    label: "Plugin-pack pivot",
    blurb: "The docs describing the plugin-distribution model.",
    items: [
      { p: "plugins", d: "Plugin packs directory", tree: true },
      { p: "plugins/README.md", d: "Plugin packs overview" },
      { p: "docs/PLUGIN_INSTALLATION_GUIDE.md", d: "Installation guide" },
    ],
  },
];

/* ── Helpers ── */

export function getAllEntries(): GlossaryEntry[] {
  return GLOSSARY_GROUPS.flatMap((g) => g.entries);
}

export function getEntry(slug: string): GlossaryEntry | undefined {
  return getAllEntries().find((e) => e.slug === slug);
}

export function getRelatedEntries(entry: GlossaryEntry): GlossaryEntry[] {
  return entry.related
    .map((slug) => getEntry(slug))
    .filter(Boolean) as GlossaryEntry[];
}
