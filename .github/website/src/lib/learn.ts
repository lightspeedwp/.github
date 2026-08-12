/* ──────────────────────────────────────────────────────────────────
   Learning Centre + Cookbook metadata.
   Lesson bodies are pulled from the repo's real Markdown docs so the
   reader stays in sync with the control plane content.
   ────────────────────────────────────────────────────────────────── */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import matter from "gray-matter";
import { marked, Renderer } from "marked";

const DOCS_ROOT = resolve(process.cwd(), "..", "docs");

export interface Lesson {
  id: string;
  slug: string;
  title: string;
  doc: string;
  src: string;
  learn: string;
  body: string;
  readTime: string;
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

interface LessonSeed {
  slug: string;
  doc: string;
  src: string;
  learn: string;
}

const TRACK_DEFS: Array<{
  id: string;
  label: string;
  icon: string;
  blurb: string;
  lessons: LessonSeed[];
  further: FurtherLink[];
}> = [
  {
    id: "oriented",
    label: "Getting oriented",
    icon: "ph:stack",
    blurb:
      "Start here. How the control plane is put together and how change flows to stable.",
    lessons: [
      {
        slug: "architecture",
        doc: "ARCHITECTURE",
        src: "docs/ARCHITECTURE.md",
        learn:
          "How the .github repo is layered - GitHub-native, portable assets, and docs - and how data flows through it.",
      },
      {
        slug: "branching",
        doc: "BRANCHING_STRATEGY",
        src: "docs/BRANCHING_STRATEGY.md",
        learn:
          "How main and develop relate, how branches are named, and how a change reaches stable.",
      },
    ],
    further: [
      {
        p: "docs/WORKFLOW_COORDINATION.md",
        d: "How workflows coordinate across the org",
      },
      { p: "docs/FRONTMATTER_SCHEMA.md", d: "The frontmatter schema in depth" },
    ],
  },
  {
    id: "governance",
    label: "Governance & labelling",
    icon: "ph:shield-check",
    blurb:
      "The taxonomy and automation that keep work legible across every repository.",
    lessons: [
      {
        slug: "labelling",
        doc: "LABELING",
        src: "docs/LABELING.md",
        learn:
          "The canonical label families, the one-hot rule, and how labelling drives automation.",
      },
      {
        slug: "issue-types",
        doc: "ISSUE_TYPES",
        src: "docs/ISSUE_TYPES.md",
        learn:
          "The issue-type taxonomy and how 32 types map to a handful of project fields.",
      },
      {
        slug: "automation",
        doc: "AUTOMATION",
        src: "docs/AUTOMATION.md",
        learn:
          "Which workflows run on which branch, the agents behind them, and the configs they read.",
      },
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
    icon: "ph:check-circle",
    blurb:
      "The gates a change passes through - linting, testing - and the ritual of shipping it.",
    lessons: [
      {
        slug: "linting",
        doc: "LINTING",
        src: "docs/LINTING.md",
        learn:
          "The linting strategy across PHP, JS, YAML, and Markdown, and how it's enforced.",
      },
      {
        slug: "testing",
        doc: "TESTING",
        src: "docs/TESTING.md",
        learn:
          "The testing approach, coverage expectations, and the CI gates that protect main.",
      },
      {
        slug: "release-process",
        doc: "RELEASE_PROCESS",
        src: "docs/RELEASE_PROCESS.md",
        learn:
          "The end-to-end release ritual - changelog, versioning, tagging, and release notes.",
      },
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
    icon: "ph:robot",
    blurb:
      "How the planner and reviewer agents are built, configured, and run in practice.",
    lessons: [
      {
        slug: "agent-architecture",
        doc: "AGENT_ARCHITECTURE",
        src: "docs/agents/AGENT_ARCHITECTURE.md",
        learn:
          "The module system, interfaces, and logging shared by the planner and reviewer agents.",
      },
      {
        slug: "reviewer-runbook",
        doc: "REVIEWER_RUNBOOK",
        src: "docs/agents/REVIEWER_RUNBOOK.md",
        learn:
          "Deploying, configuring, and troubleshooting the Reviewer agent - env vars and all.",
      },
    ],
    further: [
      { p: "docs/AGENT_CREATION.md", d: "Creating a new agent" },
      { p: "docs/PLUGIN_INSTALLATION_GUIDE.md", d: "Installing plugin packs" },
    ],
  },
];

function titleFromMarkdown(markdown: string, fallback: string): string {
  const heading = markdown.match(/^#\s+(.+)$/m)?.[1];
  return heading?.trim() || fallback;
}

function countWords(markdown: string): number {
  return markdown
    .replace(/^---[\s\S]*?---\s*/m, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function readLesson(seed: LessonSeed, trackId: string): Lesson {
  const absolutePath = resolve(DOCS_ROOT, seed.src.replace(/^docs\//, ""));
  const raw = readFileSync(absolutePath, "utf8");
  const parsed = matter(raw);
  const body = parsed.content.trim();
  const frontmatterTitle =
    typeof parsed.data.title === "string" && parsed.data.title.trim()
      ? parsed.data.title.trim()
      : titleFromMarkdown(body, seed.slug.replace(/-/g, " "));

  return {
    id: `${trackId}/${seed.slug}`,
    slug: seed.slug,
    title: frontmatterTitle,
    doc: seed.doc,
    src: seed.src,
    learn: seed.learn,
    body,
    readTime: `${Math.max(1, Math.round(countWords(body) / 200))} min`,
  };
}

function buildTrack(def: (typeof TRACK_DEFS)[number]): LearnTrack {
  return {
    id: def.id,
    label: def.label,
    icon: def.icon,
    blurb: def.blurb,
    lessons: def.lessons.map((seed) => readLesson(seed, def.id)),
    further: def.further,
  };
}

export const LEARN_TRACKS: LearnTrack[] = TRACK_DEFS.map(buildTrack);

export function getTrack(id: string): LearnTrack | undefined {
  return LEARN_TRACKS.find((t) => t.id === id);
}

export function getLesson(
  trackId: string,
  lessonSlug: string,
): Lesson | undefined {
  const track = getTrack(trackId);
  return track?.lessons.find((l) => l.slug === lessonSlug);
}

export function lessonById(
  id: string,
): { lesson: Lesson; track: LearnTrack } | undefined {
  for (const track of LEARN_TRACKS) {
    const lesson = track.lessons.find((entry) => entry.id === id);
    if (lesson) {
      return { lesson, track };
    }
  }
  return undefined;
}

export function allLessons(): Lesson[] {
  return LEARN_TRACKS.flatMap((track) => track.lessons);
}

export function adjacentLessons(id: string): { prev?: Lesson; next?: Lesson } {
  const lessons = allLessons();
  const index = lessons.findIndex((lesson) => lesson.id === id);
  return {
    prev: index > 0 ? lessons[index - 1] : undefined,
    next:
      index >= 0 && index < lessons.length - 1 ? lessons[index + 1] : undefined,
  };
}

export function getAdjacentLessons(
  trackId: string,
  lessonSlug: string,
): { prev?: Lesson; next?: Lesson } {
  const track = getTrack(trackId);
  if (!track) return {};

  const index = track.lessons.findIndex((lesson) => lesson.slug === lessonSlug);
  if (index === -1) return {};

  return {
    prev: index > 0 ? track.lessons[index - 1] : undefined,
    next:
      index < track.lessons.length - 1 ? track.lessons[index + 1] : undefined,
  };
}

export function renderMarkdown(markdown: string): string {
  let h2Index = 0;
  const renderer = new Renderer();

  renderer.heading = function heading(
    this: Renderer,
    token: { tokens: unknown[]; depth: number },
  ) {
    const content = this.parser.parseInline(token.tokens as never[]);
    if (token.depth === 2) {
      const id = `h-${h2Index++}`;
      return `<h2 id="${id}">${content}</h2>\n`;
    }

    return `<h${token.depth}>${content}</h${token.depth}>\n`;
  };

  return marked.parse(markdown, {
    renderer,
    mangle: false,
    headerIds: false,
  }) as string;
}

export const COOKBOOK_RECIPES: CookbookRecipe[] = [
  {
    slug: "project-planning-and-prd-playbook",
    doc: "project-planning-and-prd-playbook",
    kind: "Playbook",
    src: "cookbook/project-planning-and-prd-playbook.md",
    title: "Project planning & PRD playbook",
    when: "Use at intake - when a project is a brief, not yet a scoped plan.",
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
    when: "Use before shipping a plugin - a final pass over structure, security, and i18n.",
  },
];

export function readingTime(body: string | undefined | null): number {
  if (!body) return 1;
  const words = body.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export function getRecipe(slug: string): CookbookRecipe | undefined {
  return COOKBOOK_RECIPES.find((recipe) => recipe.slug === slug);
}
