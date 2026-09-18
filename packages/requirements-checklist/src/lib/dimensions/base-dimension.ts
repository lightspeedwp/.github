import { Finding, ParsedSpecification } from '../types';
import { SpecificationEvidence } from '../types';

/**
 * Base class for quality dimensions
 * Provides common functionality for evaluating specifications
 */
export abstract class BaseDimension {
  abstract id: string;
  abstract name: string;
  abstract description: string;

  /**
   * Evaluate a specification against this dimension's checks.
   *
   * @returns One pass-or-fail finding per dimension check.
   */
  abstract evaluate(spec: ParsedSpecification): Finding[];

  /**
   * Find the first regular-expression match in the specification's raw content.
   *
   * @param patterns - Regular-expression source strings checked in order.
   * @param caseSensitive - Whether matching preserves case; defaults to case-insensitive matching.
   * @returns Match status and up to 50 characters of surrounding evidence.
   * @throws {SyntaxError} If a pattern is not a valid regular expression.
   */
  protected searchInSpec(
    spec: ParsedSpecification,
    patterns: string[],
    caseSensitive: boolean = false
  ): { matched: boolean; evidence: SpecificationEvidence | undefined } {
    const content = spec.raw_content;

    for (const pattern of patterns) {
      const regex = new RegExp(pattern, caseSensitive ? 'g' : 'gi');

      const matches = content.matchAll(regex);
      for (const match of matches) {
        if (match.index !== undefined) {
          // Extract context around match
          const startContext = Math.max(0, match.index - 50);
          const endContext = Math.min(content.length, match.index + match[0].length + 50);

          return {
            matched: true,
            evidence: {
              matched_text: match[0],
              context_before: content.substring(startContext, match.index),
              context_after: content.substring(match.index + match[0].length, endContext),
            },
          };
        }
      }
    }

    return { matched: false, evidence: undefined };
  }

  /**
   * Partition section names by whether their parsed content is nonempty.
   */
  protected checkRequiredSections(
    spec: ParsedSpecification,
    sections: string[]
  ): { present: string[]; missing: string[] } {
    const present: string[] = [];
    const missing: string[] = [];

    for (const section of sections) {
      const content = this.getSectionContent(spec, section);
      if (content && content.trim().length > 0) {
        present.push(section);
      } else {
        missing.push(section);
      }
    }

    return { present, missing };
  }

  /**
   * Read a parsed section by converting spaces in its name to underscores.
   *
   * @returns String content, joined array content, or `undefined` for an absent or unsupported value.
   */
  protected getSectionContent(spec: ParsedSpecification, section: string): string | undefined {
    const sectionKey = section.toLowerCase().replace(/\s+/g, '_') as keyof ParsedSpecification;

    const value = spec[sectionKey];
    if (Array.isArray(value)) {
      return value.join('\n');
    }
    return typeof value === 'string' ? value : undefined;
  }

  /**
   * Extract an exact, case-insensitive level-two Markdown section.
   *
   * @returns Trimmed content through the next level-two heading, or `undefined` if absent.
   */
  protected extractSection(content: string, sectionName: string): string | undefined {
    const headerRegex = new RegExp(`^## ${sectionName}\\s*$`, 'im');

    const match = content.match(headerRegex);
    if (!match || match.index === undefined) {
      return undefined;
    }

    const startIdx = match.index + match[0].length;
    const nextHeaderIdx = content.indexOf('\n## ', startIdx);
    const endIdx = nextHeaderIdx === -1 ? content.length : nextHeaderIdx;

    return content.substring(startIdx, endIdx).trim();
  }

  /**
   * Count case-insensitive matches for a regular-expression source string.
   *
   * @throws {SyntaxError} If the pattern is not a valid regular expression.
   */
  protected countOccurrences(content: string, pattern: string): number {
    const regex = new RegExp(pattern, 'gi');
    const matches = content.match(regex);
    return matches ? matches.length : 0;
  }

  /**
   * Create a finding for this dimension and map the boolean result to pass or fail.
   */
  protected createFinding(
    itemId: string,
    passed: boolean,
    message: string,
    evidence?: string,
    suggestion?: string
  ): Finding {
    return {
      item_id: itemId,
      dimension: this.name,
      status: passed ? 'pass' : 'fail',
      message,
      evidence,
      suggestion,
    };
  }
}
