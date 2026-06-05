/* eslint-disable no-undef */
/* Glossary — expanded from wceu-2026/references/glossary.md for a general
   WordCamp audience. Each entry: plain-language definition + why it matters
   here + related terms (slugs) for cross-linking. */
const GLOSSARY_GROUPS = [
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
        def: "Assigning work to an AI agent via issues or API so it can plan and execute autonomously.",
        why: "Scales human decision-making across many repos.",
        related: ["agent"],
      },
      {
        slug: "llm",
        term: "LLM",
        def: "A large language model — a neural network trained on vast text to generate human-like language. The foundation for assistants like Claude and Copilot.",
        why: "The raw capability our governance shapes into reliable behaviour.",
        related: ["copilot", "prompt-engineering"],
      },
    ],
  },
  {
    id: "architecture",
    label: "Architecture",
    blurb:
      "The design principles that keep the system portable and predictable.",
    entries: [
      {
        slug: "single-source-of-truth",
        term: "Single source of truth",
        def: "One authoritative location for each piece of information or configuration.",
        why: "Prevents drift and conflicting versions across repos.",
        related: ["control-plane", "canonical-assets"],
      },
      {
        slug: "hub-and-spoke",
        term: "Hub-and-spoke model",
        def: "A topology where a central repo (the hub, .github) distributes standards and plugins to many repos (the spokes).",
        why: "Consistency at the centre, autonomy at the edges.",
        related: ["control-plane", "repository-inheritance"],
      },
      {
        slug: "inheritance-boundaries",
        term: "Inheritance boundaries",
        def: "Clear rules for what flows from the parent .github repo to child repos — and what doesn't.",
        why: "Makes inheritance predictable and prevents surprise side effects.",
        related: ["repository-inheritance"],
      },
      {
        slug: "modular-architecture",
        term: "Modular architecture",
        def: "Building systems from independent, interchangeable components with clear responsibilities.",
        why: "Lets each catalogue evolve without breaking the others.",
        related: ["decoupling"],
      },
      {
        slug: "decoupling",
        term: "Decoupling",
        def: "Separating concerns so a change in one part doesn't cascade — e.g. hooks separate from workflows.",
        why: "The reason hooks and workflows can each evolve on their own.",
        related: ["hooks-layer", "workflow-layer"],
      },
      {
        slug: "portability",
        term: "Portability",
        def: "Using an asset in many repos without modification — requires explicit assumptions and no hard-coded paths.",
        why: "The precondition for installable, distributable plugin packs.",
        related: ["portable-assets", "plugin-distribution"],
      },
      {
        slug: "scalability",
        term: "Scalability",
        def: "Handling more repos and complexity without a proportional rise in overhead.",
        why: "Achieved through automation and reusable standards instead of more manual review.",
        related: ["ai-driven-governance"],
      },
    ],
  },
  {
    id: "wordpress",
    label: "WordPress context",
    blurb: "Where the control plane meets the WordPress ecosystem.",
    entries: [
      {
        slug: "wp-agent-skills",
        term: "WordPress Agent-Skills",
        def: "A WordPress-ecosystem effort providing reusable AI agent skills for project governance and automation.",
        why: "A future integration target — LightSpeed skills aligning with a community standard.",
        related: ["skill", "gpl"],
      },
      {
        slug: "gpl",
        term: "GPL-3.0",
        def: "The GNU General Public Licence v3 — open source, requiring derivative works to stay open.",
        why: "Aligns the repo with WordPress's own licensing and the agent-skills project.",
        related: ["wp-agent-skills"],
      },
      {
        slug: "wp-plugin",
        term: "WordPress plugin",
        def: "A package that extends WordPress without modifying core, following WordPress Coding Standards and the hooks system.",
        why: "The kind of work every standard in this repo assumes you're shipping.",
        related: ["block-editor"],
      },
      {
        slug: "block-editor",
        term: "Block editor (Gutenberg)",
        def: "WordPress's block-based content editor supporting custom blocks, patterns, and variations.",
        why: "Our instructions are block-first and FSE-first by default.",
        related: ["wp-plugin"],
      },
    ],
  },
];

/* References — real files in lightspeedwp/.github. Branch-aware. */
const refUrl = (p, branch, tree) =>
  `https://github.com/lightspeedwp/.github/${tree ? "tree" : "blob"}/${branch || "main"}/${p}`;
const REFERENCE_GROUPS = [
  {
    id: "positioning",
    label: "Core positioning",
    blurb: "Repository purpose, AI rules, and control-plane framing.",
    items: [
      {
        p: "README.md",
        d: "Repository purpose, architecture, and control-plane framing.",
      },
      { p: "AGENTS.md", d: "Global AI rules and operating standards." },
      { p: "CLAUDE.md", d: "Repository boundaries and practical conventions." },
    ],
  },
  {
    id: "governance",
    label: "Governance & standards",
    blurb: "The canonical standards every repo inherits.",
    items: [
      {
        p: "instructions/coding-standards.instructions.md",
        d: "Unified coding standards.",
      },
      {
        p: "instructions/file-organisation.instructions.md",
        d: "Where files live and how they're named.",
      },
      {
        p: "instructions/labeling.instructions.md",
        d: "Labelling conventions and rules.",
      },
      {
        p: "instructions/spec-driven-workflow.instructions.md",
        d: "Spec-first delivery workflow.",
      },
      {
        p: "docs/AUTOMATION_GOVERNANCE.md",
        d: "Automation governance policies.",
      },
    ],
  },
  {
    id: "triage",
    label: "Labels, templates & triage",
    blurb: "The machinery that keeps triage consistent.",
    items: [
      { p: ".github/labels.yml", d: "Canonical organisation labels." },
      { p: ".github/labeler.yml", d: "Automated labelling rules." },
      { p: ".github/issue-types.yml", d: "Issue type definitions." },
      {
        p: ".github/ISSUE_TEMPLATE",
        d: "Org-wide issue templates.",
        tree: true,
      },
      {
        p: ".github/PULL_REQUEST_TEMPLATE",
        d: "Org-wide PR templates.",
        tree: true,
      },
      { p: "docs/ISSUE_TYPES.md", d: "Issue type strategy." },
      { p: "docs/LABEL_STRATEGY.md", d: "Label strategy and taxonomy." },
    ],
  },
  {
    id: "pivot",
    label: "Plugin packs",
    blurb: "From governance hub to installable plugin pack.",
    items: [
      {
        p: "plugins/README.md",
        d: "How plugin packs are structured and installed.",
      },
      {
        p: "plugins/lightspeed-github-ops",
        d: "The flagship GitHub-ops pack.",
        tree: true,
      },
      {
        p: "docs/ROADMAP.md",
        d: "Where the control plane and packs are heading.",
      },
    ],
  },
  {
    id: "ai",
    label: "AI assets & portability",
    blurb: "The agents and skills that travel between repos.",
    items: [
      { p: "agents/agent.md", d: "Primary agent index." },
      { p: "agents/README.md", d: "Agents overview." },
      { p: "skills/README.md", d: "Skills overview." },
      {
        p: "skills/lightspeed-pr-review",
        d: "A portable PR-review skill package.",
        tree: true,
      },
    ],
  },
  {
    id: "release",
    label: "Release, quality & reporting",
    blurb: "How work ships and gets measured.",
    items: [
      { p: "docs/RELEASE_PROCESS.md", d: "Release ritual and versioning." },
      { p: "docs/TESTING.md", d: "Testing standards." },
      { p: "docs/METRICS.md", d: "What we measure and why." },
      { p: "docs/WORKFLOWS.md", d: "Workflow inventory." },
      { p: ".github/workflows", d: "Reusable GitHub Actions.", tree: true },
    ],
  },
];

window.LSGLOSSARY = { GLOSSARY_GROUPS, REFERENCE_GROUPS, refUrl };
