/**
 * GitHub Control-Plane Validation Rules
 * Task 3.2: Framework-Specific Validation Rules
 *
 * Validates prompts targeting `.github/` workflows, scripts, and governance.
 * Rules cover: workflow syntax, naming conventions, permissions, labels, and best practices.
 *
 * @version 1.0.0
 * @phase 3.2
 */

/**
 * GitHub control-plane validation rules (50+ rules)
 * Organized by category for clarity
 */
export const githubRules = {
  // === WORKFLOW SYNTAX & STRUCTURE (Rules 1-8) ===

  rule_001_workflow_version() {
    return {
      name: "Workflow Must Specify on: Trigger",
      severity: "error",
      pattern: /^(name:|jobs:)/m,
      description:
        "All workflows must explicitly define 'on:' section with trigger events",
      example:
        "on:\n  pull_request:\n    paths:\n      - '.github/workflows/**'",
      fix: "Add 'on:' section with appropriate GitHub event(s)",
    };
  },

  rule_002_workflow_name_format() {
    return {
      name: "Workflow Name Format",
      severity: "warning",
      pattern: /^name:\s*[A-Z][a-zA-Z\s\-0-9]*$/m,
      description:
        "Workflow names should be clear, descriptive, and human-readable",
      example: "name: Feature Branch Labeling",
      fix: "Use title case with hyphens (no underscores)",
    };
  },

  rule_003_jobs_require_runs_on() {
    return {
      name: "Jobs Must Specify runs-on",
      severity: "error",
      pattern: /^jobs:[\s\S]*?runs-on:/m,
      description:
        "All job definitions must include 'runs-on:' runner specification",
      example: "runs-on: ubuntu-latest",
      fix: "Add 'runs-on:' with ubuntu-latest, macos-latest, or custom runner",
    };
  },

  rule_004_steps_require_name() {
    return {
      name: "Workflow Steps Should Have Names",
      severity: "warning",
      pattern: /^(\s+)-\s(name:|uses:|run:)/m,
      description: "Steps should include 'name:' for clarity in logs",
      example: "- name: Check out repository",
      fix: "Add descriptive 'name:' field to each step",
    };
  },

  rule_005_action_versions_pinned() {
    return {
      name: "GitHub Actions Must Use Pinned Versions",
      severity: "error",
      pattern: /uses:\s*[\w-]+\/[\w-]+@(v?\d+\.?\d*\.?\d*|[a-f0-9]{7,40})/,
      description:
        "All 'uses:' actions must pin to specific version or commit SHA",
      example:
        "uses: actions/checkout@v4\nuses: actions/setup-node@a1b9a2480000000000000000",
      fix: "Replace @main/@master with @v4, @v3.x, or full commit SHA",
    };
  },

  rule_006_workflow_permissions_explicit() {
    return {
      name: "Workflow Permissions Must Be Explicit",
      severity: "warning",
      pattern: /^permissions:/m,
      description:
        "Define explicit 'permissions:' to follow least-privilege principle",
      example: "permissions:\n  contents: read\n  pull-requests: write",
      fix: "Add 'permissions:' section with minimum required scopes",
    };
  },

  rule_007_concurrency_for_workflow_files() {
    return {
      name: "High-Frequency Workflows Should Use Concurrency",
      severity: "info",
      pattern: /on:[\s\S]*(push|pull_request):/m,
      description:
        "Workflows triggered on push/PR should define 'concurrency:' to prevent duplicates",
      example:
        "concurrency:\n  group: ${{ github.workflow }}-${{ github.ref }}",
      fix: "Add 'concurrency:' group to avoid simultaneous runs",
    };
  },

  rule_008_workflow_timeout_set() {
    return {
      name: "Long-Running Jobs Should Have Timeouts",
      severity: "warning",
      pattern: /^jobs:[\s\S]*?timeout-minutes:/m,
      description:
        "Jobs with potentially long execution should define 'timeout-minutes:'",
      example: "timeout-minutes: 30",
      fix: "Add 'timeout-minutes:' with realistic max duration",
    };
  },

  // === NAMING CONVENTIONS (Rules 9-15) ===

  rule_009_workflow_file_naming() {
    return {
      name: "Workflow Files Use Kebab-Case Naming",
      severity: "warning",
      pattern: /^[a-z0-9]+(-[a-z0-9]+)*\.ya?ml$/,
      description:
        "Workflow filenames should be lowercase kebab-case (no underscores/spaces)",
      example: "feature-labeling.yml, dependency-validation.yml",
      fix: "Rename to lowercase kebab-case: feature_labeling.yml → feature-labeling.yml",
    };
  },

  rule_010_job_names_descriptive() {
    return {
      name: "Job Names Should Be Descriptive",
      severity: "warning",
      pattern: /^jobs:[\s\S]*?\n\s+[a-z-]+:\s*$/m,
      description: "Job identifiers should clearly indicate their purpose",
      example: "validate-labels:\n  runs-on: ubuntu-latest",
      fix: "Use descriptive kebab-case names: job1 → validate-labels",
    };
  },

  rule_011_step_names_actionable() {
    return {
      name: "Step Names Should Be Action-Oriented",
      severity: "info",
      pattern: /- name: [A-Z][^:\n]*(:|$)/m,
      description:
        "Step names should start with verbs (Check, Validate, Install, Deploy, etc.)",
      example: "- name: Validate workflow syntax",
      fix: "Rephrase step names with action verbs",
    };
  },

  rule_012_branch_naming_consistency() {
    return {
      name: "Branch Names Follow Governance Rules",
      severity: "warning",
      pattern: /^(feat|fix|hotfix|release|docs|chore|test|ci)\/[a-z0-9-]+$/,
      description: "When creating branches, use {type}/{scope}-{title} format",
      example: "feat/labeling-governance, fix/branch-validation",
      fix: "Align with BRANCHING_STRATEGY.md conventions",
    };
  },

  rule_013_environment_names_lowercase() {
    return {
      name: "Environment Names Are Lowercase",
      severity: "warning",
      pattern:
        /^(environment:\s|environments:[\s\S]*?environment:)\s*[a-z][a-z0-9-]*$/m,
      description: "Environment identifiers must be lowercase with hyphens",
      example: "environment: production-us-east",
      fix: "Convert to lowercase: PROD-EAST → prod-east",
    };
  },

  rule_014_secret_names_uppercase() {
    return {
      name: "Secret References Use UPPERCASE_SNAKE_CASE",
      severity: "error",
      pattern: /\$\{\{\s*secrets\.[A-Z_]+\s*\}\}/,
      description:
        "GitHub Secrets should be referenced in UPPERCASE_SNAKE_CASE",
      example: "echo ${{ secrets.GITHUB_TOKEN }}",
      fix: "Use uppercase: secrets.github_token → secrets.GITHUB_TOKEN",
    };
  },

  rule_015_variable_names_consistent() {
    return {
      name: "GitHub Variables Use Consistent Naming",
      severity: "info",
      pattern: /\$\{\{\s*vars\.[a-zA-Z_]+\s*\}\}/,
      description: "Custom variables should use consistent case and style",
      example: "vars.REGISTRY_URL, vars.deployment_timeout",
      fix: "Choose style and apply consistently",
    };
  },

  // === PERMISSIONS & SECURITY (Rules 16-25) ===

  rule_016_no_default_permissions() {
    return {
      name: "Do Not Use Default Permissions",
      severity: "error",
      pattern: /permissions:\s*(read-all|write-all)/,
      description:
        "'read-all' and 'write-all' violate least-privilege; use specific scopes",
      example: "permissions:\n  contents: read\n  pull-requests: write",
      fix: "Replace with minimal required permissions",
    };
  },

  rule_017_token_permissions_minimal() {
    return {
      name: "GITHUB_TOKEN Permissions Must Be Minimal",
      severity: "warning",
      pattern: /permissions:/m,
      description: "Only request permissions your workflow actually needs",
      example: "permissions: { contents: read }",
      fix: "Audit actual usage and remove unnecessary permissions",
    };
  },

  rule_018_secrets_not_logged() {
    return {
      name: "Secrets Must Not Be Echoed or Logged",
      severity: "error",
      pattern: /run:\s*echo\s*\$\{\{\s*secrets\./,
      description:
        "Never output secrets to logs; GitHub masks most patterns but don't risk it",
      example:
        "❌ run: echo ${{ secrets.GITHUB_TOKEN }}\n✅ run: some-action-using-token",
      fix: "Remove echo/logging of secrets, pass as environment variable to action instead",
    };
  },

  rule_019_checkout_always_happens_early() {
    return {
      name: "Checkout Step Should Be First or Early",
      severity: "info",
      pattern: /- uses:\s*actions\/checkout@/,
      description:
        "The checkout action typically runs first to set up repository context",
      example: "steps:\n  - uses: actions/checkout@v4\n  - name: ...",
      fix: "Move checkout to first step unless a setup step precedes it",
    };
  },

  rule_020_no_hardcoded_credentials() {
    return {
      name: "No Hardcoded Credentials in Workflow Files",
      severity: "error",
      pattern: /(password|token|api[_-]?key|secret):\s*[^$].*\S/i,
      description:
        "All credentials must come from GitHub Secrets or Variables, never hardcoded",
      example:
        "❌ password: my-secret\n✅ password: ${{ secrets.DATABASE_PASSWORD }}",
      fix: "Replace hardcoded values with ${{ secrets.VAR_NAME }}",
    };
  },

  rule_021_branch_protection_enforced() {
    return {
      name: "Critical Workflows Require Branch Protection",
      severity: "warning",
      pattern: /workflow_dispatch:|schedule:/m,
      description:
        "Workflows with manual dispatch or scheduled triggers should require approval on critical branches",
      example: "Require PR approval before merge to main",
      fix: "Configure branch protection rules in GitHub settings",
    };
  },

  rule_022_oidc_preferred_over_pat() {
    return {
      name: "Prefer OIDC Token Over Personal Access Token",
      severity: "info",
      pattern: /\$\{\{\s*secrets\.(GITHUB_TOKEN|PAT|PERSONAL_ACCESS_TOKEN)/,
      description:
        "For cloud access, use GitHub's OIDC token instead of PAT when possible",
      example:
        "with:\n  aws-role-to-assume: arn:aws:iam::ACCOUNT:role/GitHubActionsRole",
      fix: "Configure OIDC in cloud provider and use aws-actions/configure-aws-credentials@v4",
    };
  },

  rule_023_secrets_are_masked() {
    return {
      name: "Verify Secrets Will Be Masked in Logs",
      severity: "warning",
      pattern: /\$\{\{\s*secrets\./,
      description:
        "GitHub automatically masks known secret names, but verify no patterns slip through",
      example: "Ensure sensitive output is suppressed or masked",
      fix: "Test workflow logs to confirm secrets are masked (not visible)",
    };
  },

  rule_024_no_pull_request_write_from_fork() {
    return {
      name: "Limit pull_request_target Write Permissions",
      severity: "warning",
      pattern: /pull_request_target:/m,
      description:
        "'pull_request_target' has write access from fork; use 'pull_request' for safety",
      example: "on:\n  pull_request:  # Use this for most cases",
      fix: "Switch to 'pull_request' trigger unless you have explicit reason for 'pull_request_target'",
    };
  },

  rule_025_environment_secrets_documented() {
    return {
      name: "Environment-Specific Secrets Are Documented",
      severity: "info",
      pattern: /environment:/m,
      description:
        "If using environments with specific secrets, document the mapping",
      example: "environment: production\n# Uses: PROD_API_KEY",
      fix: "Add comments explaining which secrets/variables apply to each environment",
    };
  },

  // === LABELS & GOVERNANCE (Rules 26-35) ===

  rule_026_label_names_have_family_prefix() {
    return {
      name: "Label Names Include Family Prefix",
      severity: "error",
      pattern: /^(type|status|priority|area|meta):[a-z0-9-]+$/,
      description:
        "All labels must use canonical family:name format (type:, status:, priority:, area:, meta:)",
      example: "type:bug, status:in-progress, priority:critical, area:ci",
      fix: "Use .github/labels.yml as source of truth; all labels must have family prefix",
    };
  },

  rule_027_no_bare_labels() {
    return {
      name: "No Bare Label Names (Must Have Family Prefix)",
      severity: "error",
      pattern: /^(bug|feature|urgent|ci|docs|help)$/m,
      description:
        "Bare labels without family prefix are not allowed (e.g., ❌ 'bug', use ✅ 'type:bug')",
      example: "✅ labels: [type:bug, status:needs-triage]",
      fix: "Prefix all labels: bug → type:bug, feature → type:feature, etc.",
    };
  },

  rule_028_label_case_consistent() {
    return {
      name: "Label Names Use Lowercase with Hyphens",
      severity: "warning",
      pattern: /labels:[\s\S]*?[A-Z]/,
      description:
        "All label values must be lowercase with hyphens (no spaces, no underscores)",
      example: "✅ type:feature, ✅ status:in-progress, ❌ Type:Feature",
      fix: "Convert to lowercase: Type:Feature → type:feature",
    };
  },

  rule_029_labels_come_from_canonical_set() {
    return {
      name: "Labels Must Come From .github/labels.yml",
      severity: "error",
      pattern: /labels:/m,
      description:
        "All labels used must be defined in .github/labels.yml (158 canonical labels)",
      example:
        "labels: [type:feature, status:in-progress]  # Both in labels.yml",
      fix: "Reference .github/labels.yml and only use labels defined there",
    };
  },

  rule_030_dependabot_labels_specific() {
    return {
      name: "Dependabot PRs Get Type and Meta Labels",
      severity: "warning",
      pattern: /dependabot/i,
      description:
        "Dependabot PRs should get appropriate type: label + meta:dependabot label",
      example: "labels: [type:deps, meta:dependabot-security]",
      fix: "Apply specific labels based on PR type (deps, dependabot-security, etc.)",
    };
  },

  rule_031_issue_labels_assigned() {
    return {
      name: "Issues Should Be Auto-Labeled on Creation",
      severity: "info",
      pattern: /issues:/m,
      description:
        "Workflow should assign appropriate labels to new issues (type:, status:needs-triage, etc.)",
      example:
        "Issue templates trigger labeling.yml which assigns type: and initial status:",
      fix: "Configure issue templates with frontmatter labels or add workflow automation",
    };
  },

  rule_032_label_descriptions_clear() {
    return {
      name: "Label Descriptions Must Be Clear",
      severity: "info",
      pattern: /description:/m,
      description:
        "In labels.yml, each label should have a clear, actionable description",
      example:
        "- name: type:feature\n  description: 'New capability or user-visible enhancement'",
      fix: "Add or improve label descriptions in .github/labels.yml",
    };
  },

  rule_033_status_labels_mutually_exclusive() {
    return {
      name: "Status Labels Should Be Mutually Exclusive",
      severity: "warning",
      pattern: /status:/m,
      description:
        "Only one status: label per issue (status:needs-triage, status:in-progress, etc.)",
      example:
        "❌ [status:needs-triage, status:in-progress]\n✅ [status:in-progress]",
      fix: "Remove conflicting status labels; maintain one active status per issue",
    };
  },

  rule_034_priority_label_clear_hierarchy() {
    return {
      name: "Priority Labels Follow Hierarchy",
      severity: "info",
      pattern: /priority:/m,
      description:
        "Priority labels should follow consistent hierarchy (critical, important, normal, low)",
      example:
        "priority:critical, priority:important, priority:normal, priority:low",
      fix: "Use canonical priority levels from labels.yml",
    };
  },

  rule_035_area_labels_cover_scope() {
    return {
      name: "Area Labels Describe Affected System",
      severity: "info",
      pattern: /area:/m,
      description:
        "Area labels clearly identify which part of system is affected",
      example: "area:ci, area:docs, area:labels, area:security, area:workflows",
      fix: "Assign area: labels matching affected system components",
    };
  },

  // === PR & ISSUE TEMPLATES (Rules 36-42) ===

  rule_036_pr_template_has_sections() {
    return {
      name: "PR Template Includes DoR and DoD",
      severity: "warning",
      pattern: /## Definition of (Ready|Done)/,
      description:
        "PR templates should include Definition of Ready and Definition of Done sections",
      example:
        "## Definition of Ready\n- [ ] Code reviewed\n## Definition of Done\n- [ ] Tests passing",
      fix: "Add DoR and DoD sections to PR template files",
    };
  },

  rule_037_issue_template_completeness() {
    return {
      name: "Issue Templates Are Comprehensive",
      severity: "info",
      pattern: /^---[\s\S]*?title:/m,
      description:
        "Issue templates should have frontmatter with type, name, description, labels",
      example:
        "---\nname: Feature Request\ndescription: ...\nlabels: [type:feature, status:needs-triage]",
      fix: "Add or update issue template frontmatter",
    };
  },

  rule_038_template_routing_configured() {
    return {
      name: "Template Routing Config Updated",
      severity: "warning",
      pattern: /PULL_REQUEST_TEMPLATE.*config\.yml/,
      description: "PR/issue routing config must map branch types to templates",
      example: ".github/PULL_REQUEST_TEMPLATE/config.yml",
      fix: "Update routing config when adding new templates",
    };
  },

  rule_039_template_sections_match_type() {
    return {
      name: "Template Sections Match Issue Type",
      severity: "info",
      pattern: /## /m,
      description:
        "Different issue types should have different template sections",
      example:
        "Bug: [Reproduction, Expected, Actual]\nFeature: [Problem, Solution, Impact]",
      fix: "Review template sections and ensure they match issue type",
    };
  },

  rule_040_template_validation_workflow() {
    return {
      name: "Template Enforcement Workflow Runs",
      severity: "warning",
      pattern: /template-enforcement\.yml/,
      description: "Workflow should validate all issues/PRs against templates",
      example: ".github/workflows/template-enforcement.yml",
      fix: "Ensure template-enforcement workflow is configured and active",
    };
  },

  rule_041_template_placeholder_removed() {
    return {
      name: "Template Placeholders Removed Before Merge",
      severity: "warning",
      pattern: /\[TODO\]|\[PLACEHOLDER\]|\[EDIT.*?\]/i,
      description:
        "PR/issue should not contain template placeholders like [TODO], [PLACEHOLDER]",
      example: "✅ Clear, specific content\n❌ [TODO: Add description]",
      fix: "Remove all template placeholders before submitting",
    };
  },

  rule_042_links_to_related_issues() {
    return {
      name: "PR Links to Related Issues",
      severity: "info",
      pattern: /(Resolves|Fixes|Closes|Relates to)?\s*#\d+/m,
      description:
        "PRs should link to related issues using Resolves, Fixes, Closes, or Relates to",
      example: "Resolves #1234\nRelates to #5678",
      fix: "Add issue links using markdown: Resolves #issue-number",
    };
  },

  // === SCRIPTS & AUTOMATION (Rules 43-50) ===

  rule_043_scripts_use_shebang() {
    return {
      name: "Bash Scripts Have Correct Shebang",
      severity: "error",
      pattern: /^#!/,
      description:
        "Shell scripts should start with shebang (#!/bin/bash or #!/usr/env node)",
      example: "#!/bin/bash\n#!/usr/env node",
      fix: "Add appropriate shebang as first line",
    };
  },

  rule_044_scripts_executable_permission() {
    return {
      name: "Executable Scripts Have +x Permission",
      severity: "warning",
      pattern: /\.sh$|\.js$/,
      description:
        "Bash and Node scripts invoked directly should have executable permissions (chmod +x)",
      example: "chmod +x .github/scripts/validation/validate.sh",
      fix: "Grant executable permission: git update-index --chmod=+x script.sh",
    };
  },

  rule_045_validation_scripts_have_tests() {
    return {
      name: "Validation Scripts Have Corresponding Tests",
      severity: "info",
      pattern: /scripts\/.*validation/,
      description:
        "Each validation script should have unit tests in .github/scripts/__tests__/",
      example:
        ".github/scripts/validation/validate.sh → .github/scripts/__tests__/validate.test.js",
      fix: "Create test file for each validation script",
    };
  },

  rule_046_automation_scripts_idempotent() {
    return {
      name: "Automation Scripts Are Idempotent",
      severity: "warning",
      pattern: /^\s*#.*automation/im,
      description:
        "Scripts that run on every push should be idempotent (safe to run multiple times)",
      example: "Check before creating; update instead of recreate",
      fix: "Add guard clauses to prevent duplicate operations",
    };
  },

  rule_047_script_error_handling() {
    return {
      name: "Scripts Include Error Handling",
      severity: "warning",
      pattern: /^#!/,
      description:
        "Scripts should include error handling (set -e, exit codes, error messages)",
      example: "#!/bin/bash\nset -e\ntrap 'echo \"Error on line $LINENO\"' ERR",
      fix: "Add set -e and error trapping for robustness",
    };
  },

  rule_048_workflow_call_inputs_documented() {
    return {
      name: "Workflow Call Inputs Are Documented",
      severity: "info",
      pattern: /workflow_call:|inputs:/m,
      description: "Reusable workflows should document all input parameters",
      example:
        "on:\n  workflow_call:\n    inputs:\n      branch: { description: 'Target branch' }",
      fix: "Add descriptions for all workflow_call inputs",
    };
  },

  rule_049_workflow_outputs_documented() {
    return {
      name: "Workflow Call Outputs Are Documented",
      severity: "info",
      pattern: /workflow_call:/m,
      description:
        "Reusable workflows should document any outputs they provide",
      example:
        "on:\n  workflow_call:\n    outputs:\n      result: { value: ${{ jobs.X.outputs.Y }} }",
      fix: "Add documented outputs section to reusable workflow",
    };
  },

  rule_050_ci_status_badge_correct() {
    return {
      name: "README Has Correct CI Status Badge",
      severity: "info",
      pattern: /badge.*workflow.*status/i,
      description:
        "README.md should include CI status badge pointing to correct workflow",
      example:
        "[![CI](https://github.com/org/repo/actions/workflows/ci.yml/badge.svg)](...)",
      fix: "Update badge URLs if workflow name/path changes",
    };
  },

  // === DOCUMENTATION & STANDARDS (Rules 51+) ===

  rule_051_workflow_has_description_comment() {
    return {
      name: "Workflow File Has Descriptive Comment Block",
      severity: "info",
      pattern: /^#.*\n#.*GitHub Workflow/im,
      description:
        "Complex workflows should have a comment block explaining purpose and triggers",
      example:
        "# Validates branch naming conventions\n# Triggered on: push to develop, PR to main",
      fix: "Add comment block at top of workflow file",
    };
  },

  rule_052_complex_jobs_documented() {
    return {
      name: "Complex Jobs Include Step Comments",
      severity: "info",
      pattern: /^\s+-\s*(name|run):/m,
      description:
        "Unclear steps should have comments explaining their purpose",
      example: "# Check branch naming convention\n- name: Validate branch",
      fix: "Add explanatory comments for non-obvious steps",
    };
  },
};

/**
 * Validation engine
 * Checks a prompt/workflow text against all GitHub rules
 *
 * @param {string} text - Workflow or prompt text to validate
 * @param {Object} options - Validation options
 * @returns {Array<Object>} Array of findings {rule, severity, message}
 */
export function validateGitHub(text, options = {}) {
  const findings = [];
  const { strict = false } = options;

  Object.entries(githubRules).forEach(([key, ruleFn]) => {
    const rule = ruleFn();
    const matches = rule.pattern ? text.match(rule.pattern) : true;

    if (!matches && strict) {
      findings.push({
        rule: rule.name,
        severity: rule.severity,
        message: rule.description,
        suggestion: rule.fix,
        key,
      });
    }
  });

  return findings;
}

export default { githubRules, validateGitHub };
