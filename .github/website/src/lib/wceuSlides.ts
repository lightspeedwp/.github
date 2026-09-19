import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import matter from "gray-matter";

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../..",
);
const slidesDir = path.join(repoRoot, "wceu-2026/slides");
const slideFilePattern = /^slide-(\d+)-([a-z0-9-]+)\.md$/;

export type WceuSlide = {
  number: number;
  slug: string;
  title: string;
  description: string;
  keyPoints: string[];
  evidence: string[];
  speaker: string[];
  accessibility: string[];
  sourceFile: string;
  sourceHref: string;
  pageHref: string;
};

let slideCache: WceuSlide[] | null = null;

function extractSectionBullets(lines: string[], sectionName: string) {
  const bullets: string[] = [];
  let currentSection = "";

  for (const line of lines) {
    if (line.startsWith("## ")) {
      currentSection = line.slice(3).trim();
      continue;
    }

    if (line.startsWith("### ")) {
      currentSection = line.slice(4).trim();
      continue;
    }

    if (currentSection === sectionName && line.trim().startsWith("- ")) {
      bullets.push(line.trim().slice(2));
    }
  }

  return bullets;
}

export function resolveWceuReferenceHref(reference: string) {
  if (/^(https?:|mailto:)/i.test(reference)) {
    return reference;
  }

  const base = "https://github.com/lightspeedwp/.github";
  const trimmed = reference.replace(/^\/+/, "");

  if (trimmed.endsWith("/")) {
    return `${base}/tree/develop/${trimmed}`;
  }

  return `${base}/blob/develop/${trimmed}`;
}

export function getWceuSlides(): WceuSlide[] {
  if (slideCache) {
    return slideCache;
  }

  if (!fs.existsSync(slidesDir)) {
    slideCache = [];
    return slideCache;
  }

  const files = fs
    .readdirSync(slidesDir)
    .filter((file) => slideFilePattern.test(file))
    .sort((left, right) => left.localeCompare(right, "en-GB"));

  slideCache = files.map((file) => {
    const match = slideFilePattern.exec(file);

    if (!match) {
      throw new Error(`Unexpected WCEU slide filename: ${file}`);
    }

    const number = Number(match[1]);
    const slug = file.replace(/\.md$/, "");
    const sourceFile = `wceu-2026/slides/${file}`;
    const sourceHref = `https://github.com/lightspeedwp/.github/blob/develop/${sourceFile}`;
    const pageHref = `/wceu-2026/slides/${slug}/`;
    const src = fs.readFileSync(path.join(slidesDir, file), "utf8");
    const { data } = matter(src);
    const lines = src.split(/\r?\n/);

    return {
      number,
      slug,
      title: String(data.title ?? slug),
      description: String(data.description ?? ""),
      keyPoints: extractSectionBullets(lines, "Key points"),
      evidence: extractSectionBullets(lines, "Evidence anchors"),
      speaker: extractSectionBullets(lines, "Speaker expansion notes"),
      accessibility: Array.from(
        new Set([
          ...extractSectionBullets(
            lines,
            "Slide style brief (NotebookLM-safe)",
          ),
          ...lines
            .map((line) => line.trim())
            .filter((line) =>
              /accessibility|contrast|motion|keyboard|readability|colour|color|alt text/i.test(
                line,
              ),
            )
            .map((line) => line.replace(/^- /, "")),
        ]),
      ),
      sourceFile,
      sourceHref,
      pageHref,
    };
  });

  return slideCache;
}

export function getWceuSlide(slug: string) {
  return getWceuSlides().find((slide) => slide.slug === slug);
}

export const wceuAccessibilityGuidance = [
  "Use high contrast and consistent spacing; prioritise readability over decoration.",
  "Avoid relying on colour alone and keep the visual language simple enough for quick scanning.",
  "Use keyboard-friendly navigation, predictable page structures, and minimal motion.",
  "Keep speaker notes and live venue checks as part of the delivery plan.",
  "Treat diagrams, charts, and link labels as accessibility work, not decoration.",
];
