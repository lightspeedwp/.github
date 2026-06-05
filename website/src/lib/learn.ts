/* ──────────────────────────────────────────────────────────────────
   Learning Centre + Cookbook metadata — ported from learn-data.js
   ────────────────────────────────────────────────────────────────── */

export interface Lesson {
  slug: string;
  doc: string;
  src: string;
  learn: string;
}

export interface FurtherLink {
  p: string;
  d: string;
}

export interface LearnTrack {
  id: string;
  label: string;
  icon: string;
  blurb: string;
  lessons: Lesson[];
  further: FurtherLink[];
}

export interface CookbookRecipe {
  slug: string;
  doc: string;
  kind: "Playbook" | "Example" | "Checklist";
  src: string;
  title: string;
  when: string;
}

export const LEARN_TRACKS: LearnTrack[] = [
  {
    id: "oriented",
    label: "Getting oriented",
    icon: "layers",
    blurb: "Start here. How the control plane is put together and how change flows to stable.",
    lessons: [
      { slug: "architecture", doc: "ARCHITECTURE", src: "docs/ARCHITECTURE.md", learn: "How the .github repo is layered — GitHub-native, portable assets, and docs — and how data flows through it." },
      { slug: "branching", doc: "BRANCHING_STRATEGY", src: "docs/BRANCHING_STRATEGY.md", learn: "How main and develop relate, how branches are named, and how a change reaches stable." },
    ],
    further: [
      { p: "docs/WORKFLOW_COORDINATION.md", d: "How workflows coordinate across the org" },
      { p: "docs/FRONTMATTER_SCHEMA.md", d: "The frontmatter schema in depth" },
    ],
  },
  {
    id: "governance",
    label: "Governance & labelling",
    icon: "shield",
    blurb: "The taxonomy and automation that keep work legible across every repository.",
    lessons: [
      { slug: "labelling", doc: "LABELING", src: "docs/LABELING.md", learn: "The canonical label families, the one-hot rule, and how labelling drives automation." },
      { slug: "issue-types", doc: "ISSUE_TYPES", src: "docs/ISSUE_TYPES.md", learn: "The issue-type taxonomy and how 32 types map to a handful of project fields." },
      { slug: "automation", doc: "AUTOMATION", src: "docs/AUTOMATION.md", learn: "Which workflows run on which branch, the agents behind them, and the configs they read." },
    ],
    further: [
      { p: "docs/LABEL_STRATEGY.md", d: "Label strategy rationale" },
      { p: "docs/LABEL_COLOR_STRATEGY.md", d: "Label colour strategy" },
      { p: "docs/LABEL_INVENTORY.md", d: "Full label inventory" },
      { p: "docs/ISSUE_FIELDS.md", d: "Project field definitions" },
      { p: "docs/ISSUE_CREATION_GUIDE.md", d: "Issue creation guide" },
      { p: "docs/METRICS.md", d: "Metrics and reporting" },
    ],
  },
  {
    id: "quality",
    label: "Quality & release",
    icon: "check",
    blurb: "The gates a change passes through — linting, testing — and the ritual of shipping it.",
    lessons: [
      { slug: "linting", doc: "LINTING", src: "docs/LINTING.md", learn: "The linting strategy across PHP, JS, YAML, and Markdown, and how it's enforced." },
      { slug: "testing", doc: "TESTING", src: "docs/TESTING.md", learn: "The testing approach, coverage expectations, and the CI gates that protect main." },
      { slug: "release-process", doc: "RELEASE_PROCESS", src: "docs/RELEASE_PROCESS.md", learn: "The end-to-end release ritual — changelog, versioning, tagging, and release notes." },
    ],
    further: [
      { p: "docs/VERSIONING.md", d: "Versioning policy" },
      { p: "docs/HUSKY_PRECOMMITS.md", d: "Husky pre-commit hooks" },
      { p: "docs/PR_CREATION_PROCESS.md", d: "Pull-request creation process" },
    ],
  },
  {
    id: "agents",
    label: "Working with agents",
    icon: "robot",
    blurb: "How the planner and reviewer agents are built, configured, and run in practice.",
    lessons: [
      { slug: "agent-architecture", doc: "AGENT_ARCHITECTURE", src: "docs/agents/AGENT_ARCHITECTURE.md", learn: "The module system, interfaces, and logging shared by the planner and reviewer agents." },
      { slug: "reviewer-runbook", doc: "REVIEWER_RUNBOOK", src: "docs/agents/REVIEWER_RUNBOOK.md", learn: "Deploying, configuring, and troubleshooting the Reviewer agent — env vars and all." },
    ],
    further: [
      { p: "docs/AGENT_CREATION.md", d: "Creating a new agent" },
      { p: "docs/PLUGIN_INSTALLATION_GUIDE.md", d: "Installing plugin packs" },
    ],
  },
];

export const COOKBOOK_RECIPES: CookbookRecipe[] = [
  {
    slug: "project-planning-and-prd-playbook",
    doc: "project-planning-and-prd-playbook",
    kind: "Playbook",
    src: "cookbook/project-planning-and-prd-playbook.md",
    title: "Project planning & PRD playbook",
    when: "Use at intake — when a project is a brief, not yet a scoped plan.",
  },
  {
    slug: "spec-driven-workflow-example",
    doc: "spec-driven-workflow-example",
    kind: "Example",
    src: "cookbook/spec-driven-workflow-example.md",
    title: "Spec-driven workflow example",
    when: "Use when you want a worked example of turning a spec into working code.",
  },
  {
    slug: "wordpress-plugin-checklist",
    doc: "wordpress-plugin-checklist",
    kind: "Checklist",
    src: "cookbook/wordpress-plugin-checklist.md",
    title: "WordPress plugin checklist",
    when: "Use before shipping a plugin — a final pass over structure, security, and i18n.",
  },
];

export function readingTime(body: string | undefined | null): number {
  if (!body) return 1;
  const words = body.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export function getTrack(id: string): LearnTrack | undefined {
  return LEARN_TRACKS.find((t) => t.id === id);
}

export function getLesson(trackId: string, lessonSlug: string): Lesson | undefined {
  const track = getTrack(trackId);
  return track?.lessons.find((l) => l.slug === lessonSlug);
}

export function getAdjacentLessons(trackId: string, lessonSlug: string): { prev?: Lesson; next?: Lesson } {
  const track = getTrack(trackId);
  if (!track) return {};
  const idx = track.lessons.findIndex((l) => l.slug === lessonSlug);
  return { prev: idx > 0 ? track.lessons[idx - 1] : undefined, next: idx < track.lessons.length - 1 ? track.lessons[idx + 1] : undefined };
}

export function getRecipe(slug: string): CookbookRecipe | undefined {
  return COOKBOOK_RECIPES.find((r) => r.slug === slug);
}
