/**
 * Skill: route-pr-template
 * Routes pull requests to correct template based on branch type
 *
 * @param {Object} input - Input object
 * @param {string} input.branchName - Full branch name (e.g. "feat/new-feature")
 * @param {string} input.branchType - Alternative: just branch type (e.g. "feat")
 * @param {Object} input.config - Optional routing configuration
 * @param {string} input.userSelectedTemplate - User override template
 * @returns {Object} Routing result with template info
 */

const BRANCH_TYPE_ROUTING = {
  feat: 'pr_feature.md',
  fix: 'pr_bug.md',
  hotfix: 'pr_hotfix.md',
  release: 'pr_release.md',
  refactor: 'pr_refactor.md',
  chore: 'pr_chore.md',
  docs: 'pr_docs.md',
  test: 'pr_chore.md',
  perf: 'pr_feature.md',
  ci: 'pr_ci.md',
  build: 'pr_ci.md',
  deps: 'pr_dep_update.md',
  security: 'pr_bug.md',
  revert: 'pr_chore.md',
  research: 'pr_feature.md',
  design: 'pr_feature.md',
  a11y: 'pr_feature.md',
  ux: 'pr_feature.md',
  i18n: 'pr_feature.md',
  ops: 'pr_chore.md',
  proto: 'pr_feature.md',
  ds: 'pr_feature.md',
  api: 'pr_feature.md',
  schema: 'pr_feature.md',
  telemetry: 'pr_feature.md',
  content: 'pr_docs.md',
  seo: 'pr_docs.md',
  config: 'pr_chore.md',
  migrate: 'pr_chore.md',
  qa: 'pr_chore.md',
  uat: 'pr_chore.md',
  audit: 'pr_chore.md',
  codex: 'pr_feature.md',
};

export async function routePrTemplate(input) {
  const { branchName, branchType: providedType, userSelectedTemplate } = input;

  // User override takes precedence
  if (userSelectedTemplate) {
    return {
      routed: true,
      template: userSelectedTemplate,
      reason: 'user-override',
      userOverride: true,
      fallback: false,
    };
  }

  // Extract branch type from full branch name
  let branchType = providedType;
  if (!branchType && branchName) {
    const normalisedBranch = branchName.toLowerCase();
    const match = normalisedBranch.match(/^([a-z0-9]+)\/(.+)$/);
    if (match) {
      branchType = match[1];
    }
  }

  if (!branchType || typeof branchType !== "string") {
    return {
      routed: false,
      template: 'pull_request_template.md',
      reason: 'invalid-input',
      fallback: true,
      warning: 'Branch type is required and must be a string',
    };
  }

  // Look up template for branch type
  const template = BRANCH_TYPE_ROUTING[branchType];

  if (template) {
    return {
      routed: true,
      template,
      reason: `${branchType}-type-matched`,
      fallback: false,
    };
  }

  // No matching template - use fallback
  return {
    routed: false,
    template: 'pull_request_template.md',
    reason: 'unknown-branch-type',
    fallback: true,
    warning: `No template found for branch type '${branchType}', using default template`,
  };
}

export default routePrTemplate;
