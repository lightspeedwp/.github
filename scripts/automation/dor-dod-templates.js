/**
 * DoR/DoD Template Mapping
 * Maps issue types to their Definition of Ready and Definition of Done sections
 */

const TEMPLATES = {
  'type:task': {
    name: 'Task',
    dor: `## Definition of Ready (DoR)

- [ ] Task described and scoped
- [ ] Acceptance criteria listed
- [ ] Estimate added if relevant`,
    dod: `## Definition of Done (DoD)

- [ ] Task completed and documented
- [ ] Changelog entry prepared for PR
- [ ] PR uses correct branch prefix`,
  },
  'type:bug': {
    name: 'Bug',
    dor: `## Definition of Ready (DoR)

- [ ] Bug is reproducible and clearly described
- [ ] Steps to reproduce written
- [ ] Environment details provided
- [ ] Screenshots/logs included (if possible)
- [ ] Linked to existing issues/PRs (if any)
- [ ] Estimate added (if relevant)
- [ ] Ready for triage`,
    dod: `## Definition of Done (DoD)

- [ ] Bug confirmed and reproducible
- [ ] Fix implemented and tested (all supported browsers/devices)
- [ ] Follows WordPress coding standards
- [ ] Documentation updated (if needed)
- [ ] Changelog entry prepared for PR
- [ ] QA performed
- [ ] Accessibility: no WCAG 2.2 AA regressions
- [ ] Security: no OWASP Top 10 vulnerabilities introduced`,
  },
  'type:feature': {
    name: 'Feature',
    dor: `## Definition of Ready (DoR)

- [ ] Problem statement and outcome defined
- [ ] Acceptance criteria written (Given/When/Then)
- [ ] Designs/specs/references attached (if relevant)
- [ ] Dependencies mapped
- [ ] Estimate added
- [ ] Stakeholders/approvers listed
- [ ] Milestone/iteration assigned (if applicable)`,
    dod: `## Definition of Done (DoD)

- [ ] All acceptance criteria met
- [ ] Tests added/updated; CI green
- [ ] Accessibility: WCAG 2.2 AA compliance verified
- [ ] Security: input validated, output escaped
- [ ] Performance: no measurable regression introduced
- [ ] Docs/changelog updated
- [ ] Feature toggles/rollout considered
- [ ] QA verified/UAT approved (if applicable)`,
  },
  'type:design': {
    name: 'Design',
    dor: `## Definition of Ready (DoR)

- [ ] Design goal/scope defined
- [ ] Artefact/objective listed
- [ ] Accessibility criteria mapped
- [ ] Dependencies mapped`,
    dod: `## Definition of Done (DoD)

- [ ] All design acceptance criteria met
- [ ] Documentation/changelog updated
- [ ] Design reviewed and approved
- [ ] PR uses correct branch prefix (design/)`,
  },
  'type:epic': {
    name: 'Epic',
    dor: `## Definition of Ready (DoR)

- [ ] Epic goal and scope defined
- [ ] Linked stories/tasks listed
- [ ] Milestones and timeline mapped
- [ ] Dependencies/blockers identified
- [ ] Estimate added (if applicable)
- [ ] Stakeholders/approvers listed`,
    dod: `## Definition of Done (DoD)

- [ ] All linked stories/tasks completed and closed
- [ ] Documentation/changelog updated
- [ ] QA and testing complete
- [ ] Milestone closed and release notes prepared`,
  },
  'type:story': {
    name: 'Story',
    dor: `## Definition of Ready (DoR)

- [ ] User need/outcome defined
- [ ] Acceptance criteria written
- [ ] Designs/specs attached (if relevant)
- [ ] Dependencies mapped
- [ ] Estimate added`,
    dod: `## Definition of Done (DoD)

- [ ] All acceptance criteria met
- [ ] Documentation/changelog updated
- [ ] Tests added/updated
- [ ] PR uses correct branch prefix
- [ ] QA verified/UAT approved (if applicable)`,
  },
  'type:improvement': {
    name: 'Improvement',
    dor: `## Definition of Ready (DoR)

- [ ] Problem/opportunity defined
- [ ] Acceptance criteria written
- [ ] Designs attached (if relevant)
- [ ] Dependencies mapped
- [ ] Estimate added (if relevant)`,
    dod: `## Definition of Done (DoD)

- [ ] All acceptance criteria met and demonstrated
- [ ] Documentation and changelog updated
- [ ] Tests added/updated
- [ ] Correct labels/types applied
- [ ] PR uses correct branch prefix`,
  },
  'type:chore': {
    name: 'Chore',
    dor: `## Definition of Ready (DoR)

- [ ] Task/goal described and scoped
- [ ] Confirms it does not fit Code Refactor or Maintenance templates
- [ ] Acceptance criteria listed
- [ ] Estimate added (if applicable)`,
    dod: `## Definition of Done (DoD)

- [ ] Affected files, labels, or settings updated and documented
- [ ] PR uses correct branch prefix (chore/)
- [ ] Approved by at least one maintainer`,
  },
  'type:refactor': {
    name: 'Code Refactor',
    dor: `## Definition of Ready (DoR)

- [ ] Refactoring goals and scope defined
- [ ] Code area(s) and impact listed
- [ ] Estimate added
- [ ] Dependencies mapped`,
    dod: `## Definition of Done (DoD)

- [ ] Code meets org coding standards
- [ ] Documentation updated (if needed)
- [ ] Changelog entry prepared for PR
- [ ] Tests passing with no regressions`,
  },
  'type:build-ci': {
    name: 'Build/CI',
    dor: `## Definition of Ready (DoR)

- [ ] Build/CI goal and scope defined
- [ ] Checklist prepared
- [ ] Estimate added`,
    dod: `## Definition of Done (DoD)

- [ ] All checklist and acceptance criteria completed
- [ ] Documentation/changelog updated
- [ ] Approved by maintainer`,
  },
  'type:test': {
    name: 'Testing',
    dor: `## Definition of Ready (DoR)

- [ ] Purpose, scope, and audience defined
- [ ] Target file and action type specified
- [ ] Acceptance criteria listed
- [ ] Estimate added (if applicable)`,
    dod: `## Definition of Done (DoD)

- [ ] All acceptance criteria met and verified
- [ ] Changelog entry prepared for PR
- [ ] Test passes all required scenarios and environments
- [ ] Documentation updated (if needed)
- [ ] PR uses correct branch prefix (test/)
- [ ] Approved by at least one maintainer`,
  },
  'type:performance': {
    name: 'Performance',
    dor: `## Definition of Ready (DoR)

- [ ] Performance issue and reproduction steps clear
- [ ] Related logs/screenshots provided
- [ ] Acceptance criteria listed
- [ ] Estimate added (if relevant)
- [ ] Milestone or release assigned (if applicable)`,
    dod: `## Definition of Done (DoD)

- [ ] Issue fixed and verified against benchmarks
- [ ] Changelog entry prepared for PR
- [ ] Performance improvement measured and documented`,
  },
  'type:a11y': {
    name: 'Accessibility',
    dor: `## Definition of Ready (DoR)

- [ ] Issue/goal described
- [ ] Area/flows listed
- [ ] Acceptance criteria mapped
- [ ] Estimate added`,
    dod: `## Definition of Done (DoD)

- [ ] All acceptance criteria met
- [ ] Fix/improvement verified in target environments
- [ ] Documentation/changelog updated
- [ ] PR uses correct branch prefix (a11y/)
- [ ] Stakeholder/maintainer reviewed`,
  },
  'type:security': {
    name: 'Security',
    dor: `## Definition of Ready (DoR)

- [ ] Security issue/context described
- [ ] Steps to reproduce, evidence, or impact provided
- [ ] Acceptance criteria listed
- [ ] Estimate added (if applicable)`,
    dod: `## Definition of Done (DoD)

- [ ] Fix or improvement implemented and verified
- [ ] Documentation/changelog updated
- [ ] PR uses correct branch prefix (security/)
- [ ] Approved by at least one maintainer`,
  },
  'type:documentation': {
    name: 'Documentation',
    dor: `## Definition of Ready (DoR)

- [ ] Documentation need is clear and well-defined
- [ ] Related docs/issues or files linked
- [ ] Acceptance criteria listed
- [ ] Estimate added if relevant
- [ ] Milestone/release assigned (if applicable)`,
    dod: `## Definition of Done (DoD)

- [ ] Documentation meets org standards and guidelines
- [ ] Changelog entry prepared for PR
- [ ] Documentation is complete and accessible`,
  },
  'type:research': {
    name: 'Research',
    dor: `## Definition of Ready (DoR)

- [ ] Research goal/objective defined
- [ ] Background/context described
- [ ] Approach/methods listed
- [ ] Estimate added if relevant`,
    dod: `## Definition of Done (DoD)

- [ ] Research performed and findings documented
- [ ] Recommendations/next steps proposed
- [ ] Documentation updated (if applicable)`,
  },
  'type:audit': {
    name: 'Audit',
    dor: `## Definition of Ready (DoR)

- [ ] Audit scope, checklist, and goals defined
- [ ] Areas/components listed
- [ ] Dependencies and standards mapped`,
    dod: `## Definition of Done (DoD)

- [ ] Audit performed and findings documented
- [ ] Remediation actions assigned
- [ ] Documentation/changelog updated (if applicable)
- [ ] PR uses correct branch prefix (audit/)`,
  },
};

/**
 * Get template for an issue type
 * @param {string} typeLabel - Label name (e.g., 'type:bug')
 * @returns {object|null} Template object with dor and dod, or null if not found
 */
function getTemplate(typeLabel) {
  return TEMPLATES[typeLabel] || null;
}

/**
 * Get all available templates
 * @returns {object} All templates mapped by type label
 */
function getAllTemplates() {
  return TEMPLATES;
}

/**
 * Check if a body contains a DoR section
 * @param {string} body - Issue body
 * @returns {boolean}
 */
function hasDoR(body) {
  if (!body) return false;
  return /## definition of ready|## dor\b|### definition of ready|### dor\b/i.test(body);
}

/**
 * Check if a body contains a DoD section
 * @param {string} body - Issue body
 * @returns {boolean}
 */
function hasDoD(body) {
  if (!body) return false;
  return /## definition of done|## dod\b|### definition of done|### dod\b/i.test(body);
}

/**
 * Detect issue type from labels array
 * @param {array} labels - Labels array from GitHub API
 * @returns {string|null} Type label (e.g., 'type:bug') or null if none found
 */
function detectTypeFromLabels(labels) {
  if (!Array.isArray(labels)) return null;
  const typeLabel = labels.find(l => l.name && l.name.startsWith('type:'));
  return typeLabel ? typeLabel.name : null;
}

module.exports = {
  TEMPLATES,
  getTemplate,
  getAllTemplates,
  hasDoR,
  hasDoD,
  detectTypeFromLabels,
};
