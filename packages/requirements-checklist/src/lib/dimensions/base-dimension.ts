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
   * Evaluate specification against this dimension
   * Returns array of findings (pass/fail per item)
   */
  abstract evaluate(spec: ParsedSpecification): Finding[];

  /**
   * Search for text patterns in specification
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
   * Check if all required sections are present
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
   * Get content for a specific section
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
   * Extract section from markdown content
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
   * Count occurrences of pattern in content
   */
  protected countOccurrences(content: string, pattern: string): number {
    const regex = new RegExp(pattern, 'gi');
    const matches = content.match(regex);
    return matches ? matches.length : 0;
  }

  /**
   * Create a finding from evaluation
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
