import * as yaml from 'yaml';
import { ChecklistResult } from '../types';

/**
 * Format ChecklistResult as JSON, YAML, or human-readable text
 */
export class ResultFormatter {
  /**
   * Serialize a result as JSON.
   *
   * @param pretty - Whether to indent the output by two spaces.
   */
  static toJson(result: ChecklistResult, pretty: boolean = true): string {
    return JSON.stringify(result, null, pretty ? 2 : 0);
  }

  /**
   * Format result to YAML string
   */
  static toYaml(result: ChecklistResult): string {
    return yaml.stringify(result, {
      indent: 2,
      lineWidth: 100,
    });
  }

  /**
   * Render scores, failed findings, specification metadata, and timing as a text report.
   */
  static toText(result: ChecklistResult): string {
    const lines: string[] = [];

    lines.push('╔════════════════════════════════════════════╗');
    lines.push('║  Requirements Quality Checklist Results    ║');
    lines.push('╚════════════════════════════════════════════╝');
    lines.push('');

    // Overall score
    lines.push(`📊 Overall Quality Score: ${result.overall_score}/100`);
    lines.push(
      `🆔 Result: ${result.id} | Template: ${result.template} (${result.audience}) | ${result.passed ? '✅ PASS' : '❌ FAIL'}`
    );
    lines.push('');

    // Dimension scores
    lines.push('📋 Dimension Scores:');
    for (const [dimension, score] of Object.entries(result.dimension_scores)) {
      const status = result.dimension_status[dimension] === 'pass' ? '✅' : '⚠️';
      const bar = this.createScoreBar(score);
      lines.push(`  ${status} ${dimension.padEnd(25)} ${bar} ${score}%`);
    }
    lines.push('');

    // Findings by dimension
    const findingsByDim = result.findings_by_dimension || {};
    if (Object.keys(findingsByDim).length > 0) {
      lines.push('🔍 Issues Found:');
      for (const [dimension, findings] of Object.entries(findingsByDim)) {
        if (findings.length > 0) {
          lines.push(`\n  ${dimension.toUpperCase()}`);
          for (const finding of findings) {
            if (finding.status === 'fail') {
              lines.push(`    ❌ [${finding.item_id}] ${finding.message}`);
              if (finding.evidence) {
                lines.push(`       Evidence: "${finding.evidence}"`);
              }
              if (finding.suggestion) {
                lines.push(`       💡 Suggestion: ${finding.suggestion}`);
              }
            }
          }
        }
      }
    } else {
      lines.push('✅ No issues found!');
    }

    lines.push('');
    lines.push('📁 Specification:');
    lines.push(`  Path: ${result.spec_reference.path} (${result.spec_reference.format})`);
    if (result.spec_reference.author) {
      lines.push(`  Author: ${result.spec_reference.author}`);
    }
    if (result.spec_reference.version) {
      lines.push(`  Version: ${result.spec_reference.version}`);
    }

    lines.push('');
    lines.push(`⏱️  Completion time: ${result.completion_time_ms}ms`);
    lines.push(`📅 Generated: ${new Date(result.generated_at).toLocaleString()}`);

    return lines.join('\n');
  }

  /**
   * Render a rounded filled-and-empty score bar for a percentage.
   *
   * @param width - Number of character cells in the bar.
   */
  private static createScoreBar(score: number, width: number = 20): string {
    const filled = Math.round((score / 100) * width);
    const empty = width - filled;
    const bar = '█'.repeat(filled) + '░'.repeat(empty);
    return `[${bar}]`;
  }

  /**
   * Serialize a result in the requested format.
   *
   * @returns JSON when the runtime format value is unrecognized.
   */
  static format(result: ChecklistResult, format: 'json' | 'yaml' | 'text' = 'json'): string {
    switch (format) {
      case 'json':
        return this.toJson(result);
      case 'yaml':
        return this.toYaml(result);
      case 'text':
        return this.toText(result);
      default:
        return this.toJson(result);
    }
  }
}
