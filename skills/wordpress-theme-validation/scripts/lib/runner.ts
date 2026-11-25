/**
 * Runs the selected checks over a theme and applies the allow-list.
 */
import { AllowList, type AllowResult } from './allow-list';
import type { Check, Finding, Theme } from './types';

export interface RunResult extends AllowResult {
  checks: string[];
  errors: number;
  warnings: number;
}

export class Runner {
  constructor(private readonly checks: Check[]) {}

  /**
   * @param only Check ids or id prefixes ("styles" runs every styles/… check). Empty runs all.
   */
  run(theme: Theme, only: string[] = []): RunResult {
    const selected = only.length
      ? this.checks.filter((c) => only.some((id) => c.id === id || c.id.startsWith(`${id}/`)))
      : this.checks;
    const findings: Finding[] = selected.flatMap((check) => check.run(theme));
    const result = new AllowList(theme.config.allow).apply(findings);
    return {
      ...result,
      checks: selected.map((c) => c.id),
      errors: result.kept.filter((f) => f.severity === 'error').length,
      warnings: result.kept.filter((f) => f.severity === 'warning').length,
    };
  }
}
