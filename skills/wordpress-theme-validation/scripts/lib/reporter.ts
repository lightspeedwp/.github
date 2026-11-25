/**
 * Formats a run result as plain text (for people) or JSON (for agents and CI).
 */
import type { RunResult } from './runner';
import type { Finding } from './types';

export type Format = 'text' | 'json';

export class Reporter {
  constructor(private readonly format: Format) {}

  render(root: string, result: RunResult): string {
    return this.format === 'json' ? this.json(root, result) : this.text(root, result);
  }

  private json(root: string, result: RunResult): string {
    return `${JSON.stringify(
      {
        root,
        checks: result.checks,
        summary: {
          errors: result.errors,
          warnings: result.warnings,
          allowed: result.allowed.length,
        },
        findings: result.kept,
        allowed: result.allowed,
        exceeded: result.exceeded,
        unused: result.unused,
      },
      null,
      2
    )}\n`;
  }

  private text(root: string, result: RunResult): string {
    const lines = [`Theme: ${root}`, `Checks run: ${result.checks.length}`, ''];
    const sorted = [...result.kept].sort(
      (a, b) =>
        Number(a.severity === 'warning') - Number(b.severity === 'warning') ||
        a.file.localeCompare(b.file) ||
        (a.line ?? 0) - (b.line ?? 0)
    );
    for (const finding of sorted) {
      lines.push(this.line(finding));
    }
    for (const { entry, count } of result.exceeded) {
      lines.push(
        `DEBT GREW  ${entry.check}  ${entry.file}${entry.path ? ` ${entry.path}` : ''}: ${count} found, allow-list says ${entry.max}`
      );
    }
    for (const entry of result.unused) {
      lines.push(
        `UNUSED     ${entry.check}  ${entry.file}: nothing matches this allow-list entry; remove it`
      );
    }
    if (lines.length > 3) {
      lines.push('');
    }
    lines.push(
      `${result.errors} error(s), ${result.warnings} warning(s), ${result.allowed.length} allowed by .theme-validation.json`
    );
    return `${lines.join('\n')}\n`;
  }

  private line(f: Finding): string {
    const where = `${f.file}${f.line ? `:${f.line}` : ''}${f.path ? ` (${f.path})` : ''}`;
    return `${f.severity === 'error' ? 'ERROR  ' : 'WARNING'}  ${f.check}  ${where}\n         ${f.message}\n         Fix: ${f.hint}`;
  }
}
