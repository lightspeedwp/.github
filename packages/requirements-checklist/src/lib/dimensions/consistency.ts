import { BaseDimension } from './base-dimension';
import { Finding, ParsedSpecification } from '../types';
import { KeywordRegistry } from './keyword-registry';

export class ConsistencyDimension extends BaseDimension {
  id = 'consistency';
  name = 'Consistency';
  description = 'Terminology, naming, section, data-format and tone consistency';
  /**
   * Evaluate terminology, naming, section, data-format, and tone consistency.
   *
   * @returns Five consistency findings in checklist order.
   */
  evaluate(spec: ParsedSpecification): Finding[] {
    const findings: Finding[] = [];

    // CON-001: Check for terminology consistency
    const terminologyIssues = this.checkTerminologyConsistency(spec);
    findings.push(
      this.createFinding(
        'CON-001',
        terminologyIssues <= 2,
        terminologyIssues <= 2
          ? '✓ Terminology is used consistently'
          : `✗ Found ${terminologyIssues} terminology inconsistencies`,
        undefined,
        terminologyIssues > 2
          ? 'Review and standardize terminology throughout the specification'
          : undefined
      )
    );

    // CON-002: Check for naming convention consistency
    const namingConsistency = this.checkNamingConsistency(spec);
    findings.push(
      this.createFinding(
        'CON-002',
        namingConsistency >= 0.8,
        namingConsistency >= 0.8
          ? '✓ Naming conventions are consistent'
          : `✗ Naming consistency score: ${Math.round(namingConsistency * 100)}%`,
        undefined,
        namingConsistency < 0.8
          ? 'Standardize naming conventions (camelCase, snake_case, etc.)'
          : undefined
      )
    );

    // CON-003: Check for consistent section structure
    const sectionConsistency = this.checkSectionConsistency(spec);
    findings.push(
      this.createFinding(
        'CON-003',
        sectionConsistency >= 0.75,
        sectionConsistency >= 0.75
          ? '✓ Sections follow consistent structure'
          : `✗ Section consistency score: ${Math.round(sectionConsistency * 100)}%`,
        undefined,
        sectionConsistency < 0.75
          ? 'Use consistent formatting and structure within each section type'
          : undefined
      )
    );

    // CON-004: Check for data type consistency
    const dataTypeConsistency = this.checkDataTypeConsistency(spec);
    findings.push(
      this.createFinding(
        'CON-004',
        dataTypeConsistency >= 0.7,
        dataTypeConsistency >= 0.7
          ? '✓ Data types and formats appear consistent'
          : `✗ Data type consistency score: ${Math.round(dataTypeConsistency * 100)}%`,
        undefined,
        dataTypeConsistency < 0.7
          ? 'Define standard formats for dates, IDs, enums, and other data structures'
          : undefined
      )
    );

    // CON-005: Check for tone consistency
    const toneConsistency = this.checkToneConsistency(spec);
    findings.push(
      this.createFinding(
        'CON-005',
        toneConsistency >= 0.8,
        toneConsistency >= 0.8
          ? '✓ Tone is consistently professional'
          : `✗ Tone consistency score: ${Math.round(toneConsistency * 100)}%`,
        undefined,
        toneConsistency < 0.8
          ? 'Maintain consistent tone throughout (avoid switching between formal and informal)'
          : undefined
      )
    );

    return findings;
  }

  /**
   * Count registered terminology groups whose standard and an alternate both appear.
   */
  private checkTerminologyConsistency(spec: ParsedSpecification): number {
    const content = spec.raw_content || '';
    let inconsistencies = 0;

    // Check known terminology pairs from keyword registry
    const alternateTerms = KeywordRegistry.consistency.terminology_alternates;
    for (const { standard, variants } of alternateTerms) {
      const standardCount = this.countOccurrences(content, standard);
      const alternateMatches = variants.filter((alt) => this.countOccurrences(content, alt) > 0);
      if (standardCount > 0 && alternateMatches.length > 0) {
        inconsistencies++;
      }
    }

    return inconsistencies;
  }

  /**
   * Calculate the share of detected identifiers that use the most common naming style.
   *
   * @returns A value from 0 to 1, or 1 when no supported naming style is detected.
   */
  private checkNamingConsistency(spec: ParsedSpecification): number {
    const content = spec.raw_content || '';

    // Count different naming conventions
    const camelCaseMatches = content.match(/\b[a-z]+[A-Z][a-zA-Z]*\b/g) || [];
    const snakeCaseMatches = content.match(/\b[a-z]+_[a-z_]*\b/g) || [];
    const pascalCaseMatches = content.match(/\b[A-Z][a-z]+(?:[A-Z][a-z]+)*\b/g) || [];

    const totalMatches =
      camelCaseMatches.length + snakeCaseMatches.length + pascalCaseMatches.length;
    if (totalMatches === 0) return 1;

    // Score based on dominant style (higher if one style dominates)
    const counts = [
      camelCaseMatches.length,
      snakeCaseMatches.length,
      pascalCaseMatches.length,
    ].sort((a, b) => b - a);
    return Math.min(1, counts[0] / totalMatches);
  }

  /**
   * Calculate the proportion of supported parsed sections that contain content.
   */
  private checkSectionConsistency(spec: ParsedSpecification): number {
    // Check that sections with content have reasonable depth and structure
    const sections = [
      spec.overview,
      spec.user_stories,
      spec.functional_requirements,
      spec.success_criteria,
      spec.assumptions,
      spec.edge_cases,
      spec.dependencies,
    ];

    const filledSections = sections.filter(
      (s) => s && (typeof s === 'string' ? s.length > 0 : s.length > 0)
    ).length;
    const totalSections = sections.length;

    return filledSections / totalSections;
  }

  /**
   * Score consistency from the number of detected date and identifier formats.
   *
   * @returns 1 when each category uses at most one format, minus 0.25 per
   * additional format within a category, bounded at zero.
   */
  private checkDataTypeConsistency(spec: ParsedSpecification): number {
    const content = spec.raw_content || '';

    // Check for date format consistency
    const isoDatePattern = /\d{4}-\d{2}-\d{2}/g;
    const slashDatePattern = /\d{2}\/\d{2}\/\d{4}/g;
    const otherDatePattern = /\d{1,2}\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/gi;

    const dateFormats = [
      isoDatePattern.exec(content) ? 1 : 0,
      slashDatePattern.exec(content) ? 1 : 0,
      otherDatePattern.exec(content) ? 1 : 0,
    ].filter((x) => x === 1).length;

    // Check for ID format consistency (UUID vs numeric)
    const uuidPattern = /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi;
    const numericIdPattern = /\bid[:\s=]+\d+\b/gi;

    const idFormats = [
      uuidPattern.test(content) ? 1 : 0,
      numericIdPattern.test(content) ? 1 : 0,
    ].filter((x) => x === 1).length;

    // Score: 1 when each category uses at most one format; penalise only
    // additional formats *within* a category (one date format + one ID
    // format is consistent, not varied).
    const extraFormats = Math.max(0, dateFormats - 1) + Math.max(0, idFormats - 1);
    return Math.max(0, 1 - extraFormats * 0.25);
  }

  /**
   * Score whether the source uses only formal or only informal predefined terms.
   *
   * @returns A value from 0 to 1, or 1 when no tone terms are detected.
   */
  private checkToneConsistency(spec: ParsedSpecification): number {
    const content = spec.raw_content || '';

    // Count formal vs informal language patterns
    const formalPatterns = ['must', 'shall', 'required', 'will be', 'should be'];
    const informalPatterns = ['gotta', 'gonna', 'kinda', "don't", "won't", 'cool', 'awesome'];

    const formalCount = formalPatterns.reduce(
      (sum, pattern) => sum + this.countOccurrences(content, pattern),
      0
    );
    const informalCount = informalPatterns.reduce(
      (sum, pattern) => sum + this.countOccurrences(content, pattern),
      0
    );

    const totalToneWords = formalCount + informalCount;
    if (totalToneWords === 0) return 1;

    // If we have both, that's less consistent
    if (formalCount > 0 && informalCount > 0) {
      return 1 - Math.min(formalCount, informalCount) / totalToneWords;
    }

    return 1; // All one tone is consistent
  }
}
