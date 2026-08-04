/**
 * Phosphor Icons loader — reads SVG assets from @phosphor-icons/core at build time.
 * All reads happen at SSG build time; zero runtime cost.
 */
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

export type PhosphorWeight =
  "regular" | "bold" | "fill" | "light" | "duotone" | "thin";

const cache = new Map<string, string>();

export function getPhosphorSvg(
  name: string,
  weight: PhosphorWeight = "regular",
  size: number = 24,
): string {
  const key = `${name}:${weight}:${size}`;
  if (cache.has(key)) return cache.get(key)!;

  try {
    const file = require.resolve(
      `@phosphor-icons/core/assets/${weight}/${name}.svg`,
    );
    const raw = readFileSync(file, "utf-8");
    // Phosphor SVGs use viewBox="0 0 256 256"; inject width/height
    const result = raw.replace(
      "<svg ",
      `<svg width="${size}" height="${size}" `,
    );
    cache.set(key, result);
    return result;
  } catch {
    const fallback = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 256 256" fill="currentColor"><rect x="32" y="32" width="192" height="192" rx="16" opacity=".2"/></svg>`;
    cache.set(key, fallback);
    return fallback;
  }
}
