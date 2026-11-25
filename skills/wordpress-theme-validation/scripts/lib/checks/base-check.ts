/**
 * Common plumbing for checks: identity and a finding factory.
 */
import { BlockMarkup } from '../block-markup';
import type { Check, Finding, Severity, Theme } from '../types';

export abstract class BaseCheck implements Check {
  abstract readonly id: string;
  abstract readonly severity: Severity;
  abstract readonly description: string;

  abstract run(theme: Theme): Finding[];

  protected finding(
    file: string,
    message: string,
    hint: string,
    where: { line?: number; path?: string } = {}
  ): Finding {
    return { check: this.id, severity: this.severity, file, message, hint, ...where };
  }

  /** Templates, parts and patterns, as block markup. */
  protected markup(theme: Theme): BlockMarkup[] {
    return [...theme.templates, ...theme.parts, ...theme.patterns].map(
      (file) => new BlockMarkup(file)
    );
  }
}
