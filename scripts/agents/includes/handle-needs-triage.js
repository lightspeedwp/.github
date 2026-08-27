/**
 * Handle-Needs-Triage Handler
 *
 * Routes issues to appropriate metadata handlers based on missing fields.
 * Orchestrates Phase 2 analysis results to Phase 3 remediation handlers.
 */

import { analyzeIssue } from "./issue-analyzer.js";
import { generateSuggestions } from "./metadata-suggester.js";
import { validateTemplate } from "./template-validator.js";
import {
  parseRelationships,
  validateRelationships,
} from "./relationship-mapper.js";

/**
 * Analyze issue and determine which handlers to route to
 */
export function assessTriageNeeds(issue) {
  const analysis = analyzeIssue(issue);
  const suggestions = generateSuggestions(analysis, 70);
  const validation = validateTemplate(issue.body, analysis.type?.type);
  const relationships = parseRelationships(issue.body);
  const relationshipValidation = validateRelationships(relationships);

  const needs = {
    needsType: !suggestions.type || analysis.type.confidence < 70,
    needsAreas: suggestions.areas.length === 0,
    needsPriority: !suggestions.priority || analysis.priority.confidence < 70,
    needsAssignee: suggestions.assignees.length === 0,
    needsMilestone: !suggestions.milestone,
    needsProject: !suggestions.project,
    needsRelationships: !relationshipValidation.isValid,
    needsTemplate: !validation.overview.isComplete,
    needsCustomFields: false, // Set based on domain/team/risk
  };

  // Count how many fields need remediation
  const remediationCount = Object.values(needs).filter((v) => v).length;

  return {
    needs,
    remediationCount,
    analysis,
    suggestions,
    validation,
    relationships,
    relationshipValidation,
  };
}

/**
 * Determine handler priority order
 * Process highest-impact handlers first
 */
export function getHandlerPriority(needs) {
  const handlers = [];

  // High-impact handlers first
  if (needs.needsTemplate) {
    handlers.push({ handler: "template-fix", priority: 1, impact: "high" });
  }
  if (needs.needsType) {
    handlers.push({ handler: "type-assignment", priority: 2, impact: "high" });
  }
  if (needs.needsAreas) {
    handlers.push({ handler: "area-labeling", priority: 3, impact: "high" });
  }

  // Medium-impact handlers
  if (needs.needsPriority) {
    handlers.push({
      handler: "priority-assessment",
      priority: 4,
      impact: "medium",
    });
  }
  if (needs.needsAssignee) {
    handlers.push({
      handler: "assignee-suggestion",
      priority: 5,
      impact: "medium",
    });
  }

  // Lower-impact handlers
  if (needs.needsMilestone) {
    handlers.push({
      handler: "milestone-assignment",
      priority: 6,
      impact: "low",
    });
  }
  if (needs.needsProject) {
    handlers.push({
      handler: "project-assignment",
      priority: 7,
      impact: "low",
    });
  }
  if (needs.needsRelationships) {
    handlers.push({
      handler: "relationship-mapping",
      priority: 8,
      impact: "low",
    });
  }
  if (needs.needsCustomFields) {
    handlers.push({ handler: "custom-fields", priority: 9, impact: "low" });
  }

  return handlers.sort((a, b) => a.priority - b.priority);
}

/**
 * Generate remediation plan for issue
 */
export function generateRemediationPlan(issue, triageAssessment) {
  const { needs, analysis, suggestions, validation } = triageAssessment;

  const plan = {
    issueNumber: issue.number,
    issuTitle: issue.title,
    handlers: getHandlerPriority(needs),
    recommendations: {
      type: suggestions.type || null,
      areas: suggestions.areas || [],
      priority: suggestions.priority || null,
      assignees: suggestions.assignees || [],
      milestone: suggestions.milestone || null,
      project: suggestions.project || null,
      templateFixes: validation.recommendations || [],
      relationshipFixes: !triageAssessment.relationshipValidation.isValid
        ? triageAssessment.relationshipValidation.issues
        : [],
    },
    confidence: {
      overall: analysis.confidence.overall,
      type: analysis.type?.confidence || 0,
      areas: suggestions.areas[0]?.confidence || 0,
      priority: suggestions.priority?.confidence || 0,
    },
    autoApplyEligible:
      analysis.confidence.overall >= 85 &&
      validation.overview.completeness >= 80 &&
      triageAssessment.relationshipValidation.isValid,
  };

  return plan;
}

/**
 * Format remediation plan for logging/reporting
 */
export function formatRemediationPlan(plan) {
  let output = `\n📋 Remediation Plan: #${plan.issueNumber}\n`;
  output += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

  output += `**Handlers to Execute:** ${plan.handlers.length}\n`;
  plan.handlers.forEach((h) => {
    output += `  ${h.priority}. ${h.handler} (${h.impact} impact)\n`;
  });

  output += `\n**Confidence:** ${plan.confidence.overall}%\n`;
  output += `**Auto-Apply:** ${plan.autoApplyEligible ? "✅ Yes" : "❌ No"}\n\n`;

  if (plan.recommendations.type) {
    output += `**Type:** ${plan.recommendations.type.suggestion}\n`;
  }

  if (plan.recommendations.areas.length > 0) {
    output += `**Areas:** ${plan.recommendations.areas.map((a) => a.label).join(", ")}\n`;
  }

  if (plan.recommendations.templateFixes.length > 0) {
    output += `**Template Issues:** ${plan.recommendations.templateFixes.length} to fix\n`;
  }

  return output;
}

/**
 * Execute remediation plan (orchestrator wrapper)
 * Delegates to specific handlers
 */
export async function executeRemediationPlan(issue, plan, handlers) {
  const results = {
    issueNumber: issue.number,
    executed: [],
    failed: [],
    skipped: [],
  };

  for (const handlerConfig of plan.handlers) {
    try {
      const handler = handlers[handlerConfig.handler];
      if (!handler) {
        results.skipped.push({
          handler: handlerConfig.handler,
          reason: "Handler not found",
        });
        continue;
      }

      const result = await handler(issue, plan.recommendations);
      results.executed.push({
        handler: handlerConfig.handler,
        result,
      });
    } catch (error) {
      results.failed.push({
        handler: handlerConfig.handler,
        error: error.message,
      });
    }
  }

  return results;
}

/**
 * Generate remediation report
 */
export function generateRemediationReport(plan, executionResults) {
  const summary = {
    issueNumber: plan.issueNumber,
    handlers: {
      total: plan.handlers.length,
      executed: executionResults.executed.length,
      failed: executionResults.failed.length,
      skipped: executionResults.skipped.length,
    },
    suggestions: {
      type: plan.recommendations.type ? 1 : 0,
      areas: plan.recommendations.areas.length,
      priority: plan.recommendations.priority ? 1 : 0,
      assignees: plan.recommendations.assignees.length,
      milestone: plan.recommendations.milestone ? 1 : 0,
      project: plan.recommendations.project ? 1 : 0,
    },
    success: executionResults.failed.length === 0,
  };

  return summary;
}
