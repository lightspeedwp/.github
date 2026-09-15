const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const CONTRACTS_DIRECTORY = path.resolve(
  __dirname,
  '../../.github/specs/009-audit-branch-cleanup/contracts'
);

function loadSchema(filename) {
  return JSON.parse(fs.readFileSync(path.join(CONTRACTS_DIRECTORY, filename), 'utf8'));
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function expectInvalid(validate, report) {
  expect(validate(report)).toBe(false);
  expect(validate.errors).not.toHaveLength(0);
}

const minimalAuditReport = {
  timestamp: '2026-09-14T12:30:00Z',
  repository: 'lightspeedwp/.github',
  summary: {
    keep_count: 0,
    delete_count: 0,
    discuss_count: 0,
  },
  categories: {
    keep: {},
    delete: [],
    discuss: [],
  },
};

const completeAuditReport = {
  ...minimalAuditReport,
  branch_count: 6,
  summary: {
    keep_count: 4,
    delete_count: 1,
    discuss_count: 1,
  },
  categories: {
    keep: {
      protected: [{ name: 'main', reason: 'protected_branch' }],
      active_pr: [{ name: 'task/branch-audit', pr_number: 3128, pr_status: 'draft' }],
      recent: [
        {
          name: 'fix/recent-change',
          age_days: 0,
          last_commit_date: '2026-09-14T11:30:00Z',
        },
      ],
      excluded: [{ name: 'release/1.2.3', pattern: 'release/.*' }],
    },
    delete: [
      {
        name: 'feat/merged-work',
        type: 'feat',
        merge_status: 'merged_to_develop',
        age_days: 127,
        last_commit_date: '2026-05-10T08:00:00Z',
        merge_commit_sha: 'abc123def456',
        author: 'developer@example.com',
      },
    ],
    discuss: [
      {
        name: 'legacy-branch',
        type: 'unknown',
        reason: 'naming_violation',
        age_days: 95,
        merge_status: 'unmerged',
        recommendation: 'Confirm the owner before taking action',
      },
    ],
  },
  execution: {
    runner_environment: 'local',
    script_version: '2.0.0',
    parameters: { dryRun: true, inactiveDays: 30 },
  },
};

const minimalDeletionCandidates = {
  timestamp: '2026-09-14T12:30:00Z',
  repository: 'lightspeedwp/.github',
  candidates: [],
};

const completeDeletionCandidates = {
  ...minimalDeletionCandidates,
  summary: {
    total_candidates: 1,
    verified_safe: 1,
    verification_failed: 0,
    estimated_storage_freed_mb: 0.25,
  },
  candidates: [
    {
      name: 'feat/merged-work',
      type: 'feat',
      merge_status: 'merged_to_main',
      merge_commit_sha: 'abc123def456',
      merge_date: '2026-05-10T09:00:00Z',
      age_days: 127,
      last_commit_date: '2026-05-10T08:00:00Z',
      author: 'developer@example.com',
      verification_passed: true,
      verification_checks: {
        branch_exists: true,
        is_merged: true,
        no_open_pr: true,
        not_protected: true,
        valid_name: true,
        meets_age_threshold: true,
        not_excluded: true,
      },
    },
  ],
  execution: {
    inactivity_threshold_days: 30,
    protected_branches: ['main', 'develop', 'production'],
    exclusion_patterns: ['release/.*', 'hotfix/.*'],
  },
};

describe('branch cleanup JSON contracts', () => {
  let validateAuditReport;
  let validateDeletionCandidates;

  beforeAll(() => {
    const ajv = new Ajv({ allErrors: true });
    addFormats(ajv);
    validateAuditReport = ajv.compile(loadSchema('audit-report.schema.json'));
    validateDeletionCandidates = ajv.compile(loadSchema('deletion-candidates.schema.json'));
  });

  describe('audit report contract', () => {
    it.each([
      ['minimal report with empty categories', minimalAuditReport],
      ['complete report', completeAuditReport],
    ])('accepts a valid %s', (_description, report) => {
      expect(validateAuditReport(report)).toBe(true);
      expect(validateAuditReport.errors).toBeNull();
    });

    it.each(['timestamp', 'repository', 'summary', 'categories'])(
      'rejects a report without the required %s field',
      (field) => {
        const report = clone(minimalAuditReport);
        delete report[field];

        expectInvalid(validateAuditReport, report);
      }
    );

    it.each(['keep_count', 'delete_count', 'discuss_count'])(
      'rejects a summary without %s',
      (field) => {
        const report = clone(minimalAuditReport);
        delete report.summary[field];

        expectInvalid(validateAuditReport, report);
      }
    );

    it.each(['keep', 'delete', 'discuss'])('rejects categories without %s', (field) => {
      const report = clone(minimalAuditReport);
      delete report.categories[field];

      expectInvalid(validateAuditReport, report);
    });

    it.each([
      ['protected', { reason: 'protected_branch' }],
      ['active_pr', { name: 'task/branch-audit' }],
      ['recent', { name: 'fix/recent-change' }],
      ['excluded', { name: 'release/1.2.3' }],
    ])('rejects an incomplete keep.%s entry', (category, entry) => {
      const report = clone(minimalAuditReport);
      report.categories.keep[category] = [entry];

      expectInvalid(validateAuditReport, report);
    });

    it.each(['name', 'merge_status', 'age_days'])(
      'rejects a deletion entry without %s',
      (field) => {
        const report = clone(completeAuditReport);
        delete report.categories.delete[0][field];

        expectInvalid(validateAuditReport, report);
      }
    );

    it.each(['name', 'reason'])('rejects a discussion entry without %s', (field) => {
      const report = clone(completeAuditReport);
      delete report.categories.discuss[0][field];

      expectInvalid(validateAuditReport, report);
    });

    it.each([
      ['invalid protected reason', ['categories', 'keep', 'protected', 0, 'reason'], 'manual_hold'],
      [
        'invalid pull request status',
        ['categories', 'keep', 'active_pr', 0, 'pr_status'],
        'closed',
      ],
      ['invalid merge status', ['categories', 'delete', 0, 'merge_status'], 'unmerged'],
      ['invalid discussion reason', ['categories', 'discuss', 0, 'reason'], 'recent'],
    ])('rejects an %s enum value', (_description, propertyPath, value) => {
      const report = clone(completeAuditReport);
      const property = propertyPath.pop();
      const parent = propertyPath.reduce((object, key) => object[key], report);
      parent[property] = value;

      expectInvalid(validateAuditReport, report);
    });

    it.each([
      ['top-level timestamp', ['timestamp']],
      ['recent branch date', ['categories', 'keep', 'recent', 0, 'last_commit_date']],
      ['deletion branch date', ['categories', 'delete', 0, 'last_commit_date']],
    ])('rejects an invalid %s', (_description, propertyPath) => {
      const report = clone(completeAuditReport);
      const property = propertyPath.pop();
      const parent = propertyPath.reduce((object, key) => object[key], report);
      parent[property] = '14 September 2026';

      expectInvalid(validateAuditReport, report);
    });

    it.each([
      ['branch_count', ['branch_count']],
      ['summary count', ['summary', 'keep_count']],
      ['pull request number', ['categories', 'keep', 'active_pr', 0, 'pr_number']],
      ['branch age', ['categories', 'delete', 0, 'age_days']],
    ])('rejects a non-integer %s', (_description, propertyPath) => {
      const report = clone(completeAuditReport);
      const property = propertyPath.pop();
      const parent = propertyPath.reduce((object, key) => object[key], report);
      parent[property] = 1.5;

      expectInvalid(validateAuditReport, report);
    });
  });

  describe('deletion candidates contract', () => {
    it.each([
      ['minimal empty list', minimalDeletionCandidates],
      ['complete verified list', completeDeletionCandidates],
    ])('accepts a valid %s', (_description, report) => {
      expect(validateDeletionCandidates(report)).toBe(true);
      expect(validateDeletionCandidates.errors).toBeNull();
    });

    it.each(['timestamp', 'repository', 'candidates'])(
      'rejects a report without the required %s field',
      (field) => {
        const report = clone(minimalDeletionCandidates);
        delete report[field];

        expectInvalid(validateDeletionCandidates, report);
      }
    );

    it.each(['name', 'merge_status', 'age_days', 'verification_passed'])(
      'rejects a candidate without %s',
      (field) => {
        const report = clone(completeDeletionCandidates);
        delete report.candidates[0][field];

        expectInvalid(validateDeletionCandidates, report);
      }
    );

    it.each([
      ['unsupported merge status', ['candidates', 0, 'merge_status'], 'unmerged'],
      ['fractional age', ['candidates', 0, 'age_days'], 30.5],
      ['non-boolean verification result', ['candidates', 0, 'verification_passed'], 'true'],
      ['non-boolean safety check', ['candidates', 0, 'verification_checks', 'no_open_pr'], 1],
      ['non-integer threshold', ['execution', 'inactivity_threshold_days'], 30.5],
      ['non-numeric storage estimate', ['summary', 'estimated_storage_freed_mb'], '0.25'],
    ])('rejects %s', (_description, propertyPath, value) => {
      const report = clone(completeDeletionCandidates);
      const property = propertyPath.pop();
      const parent = propertyPath.reduce((object, key) => object[key], report);
      parent[property] = value;

      expectInvalid(validateDeletionCandidates, report);
    });

    it.each([
      ['report timestamp', ['timestamp']],
      ['merge date', ['candidates', 0, 'merge_date']],
      ['last commit date', ['candidates', 0, 'last_commit_date']],
    ])('rejects an invalid %s', (_description, propertyPath) => {
      const report = clone(completeDeletionCandidates);
      const property = propertyPath.pop();
      const parent = propertyPath.reduce((object, key) => object[key], report);
      parent[property] = 'not-a-date';

      expectInvalid(validateDeletionCandidates, report);
    });

    it('accepts zero-valued counts, age, threshold, and storage estimates', () => {
      const report = clone(completeDeletionCandidates);
      report.summary = {
        total_candidates: 0,
        verified_safe: 0,
        verification_failed: 0,
        estimated_storage_freed_mb: 0,
      };
      report.candidates[0].age_days = 0;
      report.execution.inactivity_threshold_days = 0;

      expect(validateDeletionCandidates(report)).toBe(true);
      expect(validateDeletionCandidates.errors).toBeNull();
    });
  });
});
