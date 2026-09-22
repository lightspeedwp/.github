#!/usr/bin/env node

/**
 * Phase 4: Structure Audit (T036-T038, T043)
 * Generates structure audit reports and remediation recommendations
 */

import fs from 'fs';
import path from 'path';
import StructureChecker from './lib/structure-checker.js';

const ROOT_DIR = process.cwd();
const REPORTS_DIR = path.join(ROOT_DIR, 'agents', 'reports');

// Ensure reports directory exists
if (!fs.existsSync(REPORTS_DIR)) {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

/**
 * T036: Generate structure audit report
 */
function generateStructureAudit() {
  console.log('\n[T036] Generating structure audit report...');

  const checker = new StructureChecker({ rootDir: ROOT_DIR });
  const results = checker.checkAllAgents();
  const auditReport = checker.generateSummary();

  const reportPath = path.join(REPORTS_DIR, 'structure-audit.json');
  fs.writeFileSync(reportPath, JSON.stringify(auditReport, null, 2));
  console.log(`✓ Structure audit report saved: ${reportPath}`);

  return auditReport;
}

/**
 * T037 & T038: Identify missing components and create remediation recommendations
 */
function generateRemediationRecommendations(auditReport) {
  console.log('\n[T037-T038] Generating remediation recommendations...');

  const recommendations = {
    timestamp: auditReport.timestamp,
    summary: {
      agentsAudited: auditReport.summary.total,
      conformant: auditReport.summary.conformant,
      nonConformant: auditReport.summary.nonConformant,
      conformancePercentage: auditReport.summary.conformancePercentage,
    },
    recommendations: [],
  };

  // Analyze each non-conformant agent
  for (const agentResult of auditReport.details) {
    if (!agentResult.conformant) {
      const recommendation = {
        agent: agentResult.agent,
        path: agentResult.path,
        status: 'needs-remediation',
        componentCount: agentResult.componentCount,
        maxComponents: agentResult.maxComponents,
        missing: agentResult.missing,
        issues: agentResult.issues,
        steps: [],
      };

      // Generate remediation steps for missing components
      for (const missing of agentResult.missing) {
        const step = {
          component: missing.component,
          type: missing.type,
          action:
            missing.type === 'file'
              ? `Create ${missing.component} file in agent directory`
              : `Create ${missing.component}/ directory in agent directory`,
          reference: `See .github/docs/AGENT_FOLDER_STRUCTURE.md for template and requirements`,
        };

        if (missing.component === 'AGENT.md') {
          step.template = '.github/templates/agent-structure-template/AGENT.md';
        } else if (missing.component === 'CHANGELOG.md') {
          step.template = '.github/templates/agent-structure-template/CHANGELOG.md';
          step.reference = `.github/docs/CHANGELOG_FORMAT.md`;
        } else if (missing.component === 'package.json') {
          step.template = '.github/templates/agent-structure-template/package.json';
          step.reference = '.github/docs/PACKAGE_JSON_REQUIREMENTS.md';
        } else if (missing.component === 'README.md') {
          step.template = '.github/templates/agent-structure-template/README.md';
        }

        recommendation.steps.push(step);
      }

      // Generate remediation steps for validation issues
      if (agentResult.issues.length > 0) {
        const errorIssues = agentResult.issues.filter((i) => i.severity === 'error');
        const warningIssues = agentResult.issues.filter((i) => i.severity === 'warning');

        if (errorIssues.length > 0) {
          recommendation.steps.push({
            type: 'validation-error',
            count: errorIssues.length,
            issues: errorIssues,
            action: 'Fix validation errors before component is considered conformant',
            severity: 'error',
          });
        }

        if (warningIssues.length > 0) {
          recommendation.steps.push({
            type: 'validation-warning',
            count: warningIssues.length,
            issues: warningIssues,
            action: 'Address warnings to improve conformance quality',
            severity: 'warning',
          });
        }
      }

      // Estimate effort
      const missingCount = agentResult.missing.length;
      const issueCount = agentResult.issues.length;
      let estimatedEffort = 'low';
      if (missingCount >= 3 || issueCount >= 3) {
        estimatedEffort = 'high';
      } else if (missingCount >= 2 || issueCount >= 2) {
        estimatedEffort = 'medium';
      }
      recommendation.estimatedEffort = estimatedEffort;

      recommendations.recommendations.push(recommendation);
    }
  }

  // Sort by estimated effort (high first)
  const effortOrder = { high: 0, medium: 1, low: 2 };
  recommendations.recommendations.sort(
    (a, b) => effortOrder[a.estimatedEffort] - effortOrder[b.estimatedEffort]
  );

  const reportPath = path.join(REPORTS_DIR, 'structure-remediation-recommendations.json');
  fs.writeFileSync(reportPath, JSON.stringify(recommendations, null, 2));
  console.log(`✓ Remediation recommendations saved: ${reportPath}`);

  return recommendations;
}

/**
 * T043: Generate summary report
 */
function generateSummaryReport(auditReport, recommendations) {
  console.log('\n[T043] Generating summary report...');

  const summary = {
    timestamp: new Date().toISOString(),
    phase: 'Phase 4: User Story 2 - Standardize Agent Folder Structure',
    tasks: ['T036', 'T037', 'T038', 'T043'],
    audit: {
      totalAgentsAudited: auditReport.summary.total,
      conformantAgents: auditReport.summary.conformant,
      nonConformantAgents: auditReport.summary.nonConformant,
      conformancePercentage: auditReport.summary.conformancePercentage,
    },
    deviations: {
      total: recommendations.recommendations.length,
      byEffort: {
        high: recommendations.recommendations.filter((r) => r.estimatedEffort === 'high').length,
        medium: recommendations.recommendations.filter((r) => r.estimatedEffort === 'medium')
          .length,
        low: recommendations.recommendations.filter((r) => r.estimatedEffort === 'low').length,
      },
      byMissingComponent: {},
    },
    nextSteps: [
      'Review structure-remediation-recommendations.json for prioritized remediation plan',
      'Create branches for each non-conformant agent (prioritize high-effort agents)',
      'Apply remediation steps using templates in .github/templates/agent-structure-template/',
      'Re-run structure validation to verify conformance',
      'Update Phase 4 tasks status when all agents are conformant',
    ],
  };

  // Analyze deviations by component
  for (const recommendation of recommendations.recommendations) {
    for (const missing of recommendation.missing) {
      if (!summary.deviations.byMissingComponent[missing.component]) {
        summary.deviations.byMissingComponent[missing.component] = 0;
      }
      summary.deviations.byMissingComponent[missing.component]++;
    }
  }

  const reportPath = path.join(REPORTS_DIR, 'structure-audit-summary.json');
  fs.writeFileSync(reportPath, JSON.stringify(summary, null, 2));
  console.log(`✓ Summary report saved: ${reportPath}`);

  return summary;
}

/**
 * Print human-readable report to console
 */
function printReport(auditReport, recommendations, summary) {
  console.log('\n' + '='.repeat(70));
  console.log('Phase 4: Structure Audit Results');
  console.log('='.repeat(70));

  console.log(`\n📊 AUDIT SUMMARY:`);
  console.log(`   Total agents audited: ${summary.audit.totalAgentsAudited}`);
  console.log(
    `   Conformant: ${summary.audit.conformantAgents} (${summary.audit.conformancePercentage}%)`
  );
  console.log(`   Non-conformant: ${summary.audit.nonConformantAgents}`);

  if (summary.deviations.total > 0) {
    console.log(`\n📋 REMEDIATION PRIORITIES:`);
    console.log(`   High effort: ${summary.deviations.byEffort.high} agents`);
    console.log(`   Medium effort: ${summary.deviations.byEffort.medium} agents`);
    console.log(`   Low effort: ${summary.deviations.byEffort.low} agents`);

    console.log(`\n🔧 MOST COMMON MISSING COMPONENTS:`);
    const sortedComponents = Object.entries(summary.deviations.byMissingComponent)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    for (const [component, count] of sortedComponents) {
      console.log(`   ${component}: ${count} agents missing`);
    }
  }

  console.log(`\n📈 REPORTS GENERATED:`);
  console.log(`   agents/reports/structure-audit.json`);
  console.log(`   agents/reports/structure-remediation-recommendations.json`);
  console.log(`   agents/reports/structure-audit-summary.json`);

  console.log('\n' + '='.repeat(70));
}

// Run audit
try {
  console.log('Starting Phase 4 Structure Audit (T036-T038, T043)...');

  const auditReport = generateStructureAudit();
  const recommendations = generateRemediationRecommendations(auditReport);
  const summary = generateSummaryReport(auditReport, recommendations);

  printReport(auditReport, recommendations, summary);

  console.log('\n✅ Phase 4 audit complete');
  process.exit(0);
} catch (error) {
  console.error('\n❌ Phase 4 audit failed:');
  console.error(error.message);
  process.exit(1);
}
