/**
 * Audience Context Detection
 * Identifies intended audience from workflow context and configuration
 */

const VALID_AUDIENCES = ['author', 'peer', 'stakeholder', 'integration'];

const AUDIENCE_CONTEXTS = {
  author: {
    name: 'Author (Pre-Review)',
    stage: 'pre-review',
    timeAlloted: 30,
    focus: ['self-check', 'identify gaps', 'clarify ambiguities'],
    role: 'specification author',
    canApprove: false,
    canGate: false,
  },
  peer: {
    name: 'Peer Reviewer',
    stage: 'peer-review',
    timeAlloted: 45,
    focus: ['verify', 'feedback', 'quality assurance'],
    role: 'team member or technical lead',
    canApprove: true,
    canGate: false,
  },
  stakeholder: {
    name: 'Stakeholder (Gate Decision)',
    stage: 'gate-decision',
    timeAlloted: 15,
    focus: ['go/no-go', 'decision', 'executive summary'],
    role: 'product owner, stakeholder, or business lead',
    canApprove: true,
    canGate: true,
  },
  integration: {
    name: 'Integration Reviewer',
    stage: 'dependency-check',
    timeAlloted: 30,
    focus: ['dependency', 'cross-project alignment', 'parallel work capability'],
    role: 'architect or dependency manager',
    canApprove: false,
    canGate: false,
  },
};

/**
 * Detect audience from workflow context
 * @param {Object} context - Workflow context object
 * @returns {Object} {audience, confidence}
 */
function detectAudience(context = {}) {
  const { workflowStage, actor, decisionAuthority, checksDependencies, canApprove } = context;

  // Check for explicit stage/role indicators
  if (workflowStage === 'pre-review' || actor === 'spec-author') {
    return { audience: 'author', confidence: 0.95 };
  }

  if (
    workflowStage === 'peer-review' ||
    (actor === 'team-member' && canApprove) ||
    actor === 'reviewer'
  ) {
    return { audience: 'peer', confidence: 0.9 };
  }

  if (workflowStage === 'gate-decision' || decisionAuthority) {
    return { audience: 'stakeholder', confidence: 0.9 };
  }

  if (workflowStage === 'dependency-check' || checksDependencies) {
    return { audience: 'integration', confidence: 0.85 };
  }

  // Fallback to author with low confidence
  return { audience: 'author', confidence: 0.4 };
}

/**
 * Validate if audience is valid
 * @param {string} audience - Audience identifier
 * @returns {boolean}
 */
function validateAudience(audience) {
  return VALID_AUDIENCES.includes(audience);
}

/**
 * Get audience context details
 * @param {string} audience - Audience identifier
 * @returns {Object} Audience context
 */
function getAudienceContext(audience) {
  if (!validateAudience(audience)) {
    throw new Error(`Invalid audience: ${audience}`);
  }
  return AUDIENCE_CONTEXTS[audience];
}

/**
 * Get all audience contexts
 * @returns {Object} All audience contexts
 */
function getAllAudienceContexts() {
  return AUDIENCE_CONTEXTS;
}

module.exports = {
  detectAudience,
  validateAudience,
  getAudienceContext,
  getAllAudienceContexts,
  VALID_AUDIENCES,
  AUDIENCE_CONTEXTS,
};
