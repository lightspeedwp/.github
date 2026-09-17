/**
 * Audience-Aware Checklist Generator
 * Generates checklists tailored to specific audiences
 */

const { validateAudience, getAudienceContext } = require('./audience-detector');
const { renderGuidance } = require('./guidance-renderer');

/**
 * Generate audience-specific checklist
 * @param {Object} baseChecklist - Base checklist with items
 * @param {string} audience - Target audience
 * @returns {Object} Rendered checklist for audience
 */
function renderAudienceChecklist(baseChecklist, audience) {
  if (!validateAudience(audience)) {
    throw new Error(`Invalid audience: ${audience}`);
  }

  const context = getAudienceContext(audience);
  const guidance = renderGuidance(audience);

  // Base checklist copy
  const checklist = {
    ...baseChecklist,
    audience,
    context,
    guidance,
    estimatedTime: context.timeAlloted,
  };

  // Audience-specific customizations
  switch (audience) {
    case 'author':
      return enhanceAuthorChecklist(checklist);
    case 'peer':
      return enhancePeerChecklist(checklist);
    case 'stakeholder':
      return enhanceStakeholderChecklist(checklist);
    case 'integration':
      return enhanceIntegrationChecklist(checklist);
    default:
      return checklist;
  }
}

/**
 * Enhance checklist for author audience
 * @param {Object} checklist - Base checklist
 * @returns {Object} Author-enhanced checklist
 */
function enhanceAuthorChecklist(checklist) {
  const uncheckedItems = checklist.items.filter(
    (item) => item.state !== 'checked' && item.state !== 'verified'
  );

  return {
    ...checklist,
    highlighted: {
      uncheckedCount: uncheckedItems.length,
      uncheckedItems: uncheckedItems.map((item) => item.id),
    },
    tips: [
      "Read items in order; don't skip around",
      'Use the Guidance section in each item',
      'Mark gaps and ambiguities as you find them',
      'Spend extra time on Completeness and Scenario Coverage',
      'If an item takes >5 minutes, you may have a gap worth addressing',
    ],
    nextSteps: [
      'Update your specification with findings',
      'Recheck items you fixed',
      'Attach this checklist to your PR',
      'Request peer review',
    ],
  };
}

/**
 * Enhance checklist for peer audience
 * @param {Object} checklist - Base checklist
 * @returns {Object} Peer-enhanced checklist
 */
function enhancePeerChecklist(checklist) {
  const failedItems = checklist.items.filter(
    (item) => item.state === 'unchecked' || item.state === 'gap' || item.state === 'ambiguity'
  );

  const priorityGroups = {
    critical: failedItems.filter(
      (item) => item.dimension === 'Completeness' || item.dimension === 'Clarity'
    ),
    important: failedItems.filter(
      (item) => item.dimension === 'Consistency' || item.dimension === 'Measurability'
    ),
    helpful: failedItems.filter(
      (item) =>
        item.dimension === 'Dependencies' ||
        item.dimension === 'Ambiguities' ||
        item.dimension === 'Edge Cases'
    ),
  };

  return {
    ...checklist,
    prioritized: {
      failedItems,
      failedCount: failedItems.length,
      byPriority: priorityGroups,
    },
    feedbackGuidance: [
      'Start with critical gaps (Completeness, Clarity)',
      'Verify gaps author flagged as their own assessment',
      'Note new gaps you discover',
      'Use constructive language in feedback',
    ],
    verificationSteps: [
      'Read spec section for this item',
      'Compare against item guidance',
      "Check if it's clear enough for a developer",
      'Mark verified or updated gap',
    ],
    nextSteps: [
      'Update checklist with your findings',
      'Summarize critical vs. important gaps',
      'Recommend: "Ready for implementation" or "Needs revision"',
      'Provide feedback to author',
    ],
  };
}

/**
 * Enhance checklist for stakeholder audience
 * @param {Object} checklist - Base checklist
 * @returns {Object} Stakeholder-enhanced checklist
 */
function enhanceStakeholderChecklist(checklist) {
  const checkedCount = checklist.items.filter((item) => item.state === 'checked').length;
  const totalCount = checklist.items.length;
  const completionPercent = Math.round((checkedCount / totalCount) * 100);

  const criticalItems = checklist.items.filter(
    (item) =>
      item.priority === 'critical' ||
      item.dimension === 'Completeness' ||
      item.dimension === 'Clarity'
  );

  const gapItems = checklist.items.filter((item) => item.state === 'gap');
  const ambiguityItems = checklist.items.filter(
    (item) => item.state === 'ambiguity' || item.state === 'critical-ambiguity'
  );

  const recommendation =
    completionPercent >= 85 && gapItems.length <= 2 && ambiguityItems.length <= 2
      ? 'READY'
      : completionPercent >= 70 && gapItems.length <= 5
        ? 'CONDITIONAL'
        : 'NOT READY';

  return {
    ...checklist,
    decision: {
      recommendation,
      rationale:
        recommendation === 'READY'
          ? 'Specification is mature; team is ready to implement'
          : recommendation === 'CONDITIONAL'
            ? 'Specification has minor gaps; can proceed with resolution in parallel'
            : 'Specification needs revision; implement after gaps are addressed',
    },
    executiveSummary: {
      completionPercent,
      checkedCount,
      totalCount,
      gapCount: gapItems.length,
      ambiguityCount: ambiguityItems.length,
    },
    criticalItems: criticalItems.map((item) => ({
      id: item.id,
      question: item.question,
      dimension: item.dimension,
      status: item.state,
    })),
    timeline: {
      estimatedReady: 'Within 1–2 days' + (gapItems.length > 2 ? ', or 1 week if major gaps' : ''),
      blockers: gapItems.length > 3 ? 'Yes, address before implementation' : 'No',
    },
    nextSteps: [
      recommendation === 'READY' ? 'Approve specification; proceed with implementation' : null,
      recommendation === 'CONDITIONAL'
        ? 'Approve with conditions; resolve noted gaps in parallel'
        : null,
      recommendation === 'NOT READY'
        ? 'Request revision; set resubmission date (suggest 3–5 days)'
        : null,
    ].filter(Boolean),
  };
}

/**
 * Enhance checklist for integration audience
 * @param {Object} checklist - Base checklist
 * @returns {Object} Integration-enhanced checklist
 */
function enhanceIntegrationChecklist(checklist) {
  const dependencyItems = checklist.items.filter((item) => item.dimension === 'Dependencies');
  const clarityItems = checklist.items.filter((item) => item.dimension === 'Clarity');

  const unclearedDependencies = dependencyItems.filter((item) => item.state !== 'checked');
  const unclarifiedIntegrations = clarityItems.filter(
    (item) => item.dimension === 'Clarity' && item.state !== 'checked'
  );

  return {
    ...checklist,
    dependencyCheck: {
      dependencyItems: dependencyItems.map((item) => ({
        id: item.id,
        question: item.question,
        status: item.state,
      })),
      unclearedCount: unclearedDependencies.length,
      risks: unclearedDependencies.length > 2 ? 'HIGH' : 'LOW',
    },
    crossProjectAlignment: {
      questionsToAsk: [
        "Does this work depend on another team's project?",
        "Does another team's project depend on this work?",
        'Are timeline dependencies clear and locked?',
        'Are API/integration contracts documented?',
        'Can this work proceed in parallel, or must it wait?',
      ],
      assessmentNeeded: unclearedDependencies.length > 0,
    },
    parallelWorkCapability: {
      canProceedInParallel:
        unclearedDependencies.length <= 2 && unclarifiedIntegrations.length <= 2,
      blockedTeams: unclearedDependencies.length > 2 ? ['Dependent teams'] : [],
      recommendations: [
        'Verify all integration contracts before starting implementation',
        'Document dependency timeline with dependent teams',
        'Plan for mocking/stubbing integration until dependencies are ready',
      ],
    },
    nextSteps: [
      'Create dependency map for this specification',
      'Verify integration readiness with dependent teams',
      'Document any blocking dependencies',
      'Plan parallel work streams',
      'Gate implementation until critical dependencies are clear',
    ],
  };
}

module.exports = {
  renderAudienceChecklist,
  enhanceAuthorChecklist,
  enhancePeerChecklist,
  enhanceStakeholderChecklist,
  enhanceIntegrationChecklist,
};
