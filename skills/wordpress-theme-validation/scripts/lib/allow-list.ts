/**
 * Applies the theme's recorded debt (`allow` in .theme-validation.json) to findings.
 */
import { wildcard } from './text';
import type { AllowEntry, Finding } from './types';

export interface AllowResult {
  kept: Finding[];
  allowed: Finding[];
  /** Entries whose `max` was exceeded: the debt grew, so nothing they cover is allowed. */
  exceeded: { entry: AllowEntry; count: number }[];
  /** Entries that matched nothing: the debt was paid off and the entry can go. */
  unused: AllowEntry[];
}

export class AllowList {
  constructor(private readonly entries: AllowEntry[] = []) {}

  apply(findings: Finding[]): AllowResult {
    const allowedSet = new Set<Finding>();
    const exceeded: AllowResult['exceeded'] = [];
    const unused: AllowEntry[] = [];

    for (const entry of this.entries) {
      const file = wildcard(entry.file);
      const matches = findings.filter(
        (f) =>
          f.check === entry.check &&
          file.test(f.file) &&
          (entry.path === undefined || f.path === entry.path)
      );
      if (!matches.length) {
        unused.push(entry);
      } else if (entry.max !== undefined && matches.length > entry.max) {
        exceeded.push({ entry, count: matches.length });
      } else {
        matches.forEach((f) => allowedSet.add(f));
      }
    }

    return {
      kept: findings.filter((f) => !allowedSet.has(f)),
      allowed: findings.filter((f) => allowedSet.has(f)),
      exceeded,
      unused,
    };
  }
}
