const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const { deriveProjectFieldValues } = require("../derive-project-fields.cjs");

/**
 * Field-parity regression suite.
 *
 * These tests are the safety net for the "issue-field pipeline is a no-op"
 * class of bug: the derivation scripts compute a value that does not exist as
 * an option on the target single-select, so the write silently lands nothing.
 *
 * The suite asserts, from the canonical config alone, that every value the
 * automation can EMIT for Status / Priority / Type / Effort is a member of the
 * option set the config DECLARES for that field. If someone renames an option
 * in one place and not the other, or reintroduces the old Urgent/High/Medium/
 * Low Priority vocabulary, these tests fail instead of the workflow silently
 * writing empty fields.
 */

const REPO_ROOT = path.resolve(__dirname, "../../../..");

function loadYaml(relativePath) {
  return yaml.load(fs.readFileSync(path.join(REPO_ROOT, relativePath), "utf8"));
}

const issueFields = loadYaml(".github/issue-fields.yml");
const issueTypes = loadYaml(".github/issue-types.yml");

const mappings = issueFields.project_field_mappings || {};
const orgFields = issueFields.organization_issue_fields || {};

// --- Canonical option sets (the surfaces the automation writes to) ----------

// Status has no dedicated option list in config; the mapping values ARE the
// declared board options, so the canonical set is their distinct values.
const statusOptions = new Set(Object.values(mappings.Status || {}));

// Priority options are declared in field_usage and MUST match the mapping.
const priorityOptions = new Set(orgFields.field_usage?.Priority?.values || []);

// Type options are the canonical Issue Type names.
const typeOptions = new Set((issueTypes.issue_types || []).map((t) => t.name));

// Effort options come from the custom-field definition.
const effortField = (orgFields.custom_fields || []).find(
  (f) => f.key === "Effort",
);
const effortOptions = new Set(effortField?.options || []);

// Representative events spanning the derivation branches (open issue, ready
// issue, closed issue, open PR, merged PR, content-inferred bug).
const REPRESENTATIVE_EVENTS = [
  {
    name: "new triage issue",
    input: {
      labels: ["status:needs-triage", "priority:normal", "type:task"],
      eventName: "issues",
      eventAction: "opened",
    },
  },
  {
    name: "ready feature issue",
    input: {
      labels: ["status:ready", "priority:important", "type:feature"],
      eventName: "issues",
      eventAction: "edited",
      itemCreatedAt: "2026-06-18T10:15:00Z",
      milestoneDueOn: "2026-07-18T00:00:00Z",
    },
  },
  {
    name: "closed issue",
    input: {
      labels: ["type:bug"],
      eventName: "issues",
      eventAction: "closed",
    },
  },
  {
    name: "open PR without labels",
    input: {
      labels: [],
      eventName: "pull_request",
      eventAction: "opened",
      title: "Refine metadata sync behaviour",
      body: "Improve how project metadata is allocated.",
    },
  },
  {
    name: "merged PR",
    input: {
      labels: [],
      eventName: "pull_request",
      eventAction: "closed",
      prMerged: true,
    },
  },
  {
    name: "content-inferred critical bug",
    input: {
      labels: [],
      eventName: "pull_request",
      eventAction: "opened",
      title: "Urgent bug: project metadata stays blank",
      body: "This bug blocks release and should be fixed immediately.",
      headRef: "fix/metadata-governance-sync",
    },
  },
];

describe("issue-field vocabulary parity", () => {
  test("Priority field_usage values match project_field_mappings values", () => {
    const mappingValues = new Set(Object.values(mappings.Priority || {}));
    expect([...mappingValues].sort()).toEqual([...priorityOptions].sort());
  });

  test("every mapped Status value is a declared Status option", () => {
    for (const value of Object.values(mappings.Status || {})) {
      expect(statusOptions.has(value)).toBe(true);
    }
  });

  test("every mapped Priority value is a declared Priority option", () => {
    expect(priorityOptions.size).toBeGreaterThan(0);
    for (const value of Object.values(mappings.Priority || {})) {
      expect(priorityOptions.has(value)).toBe(true);
    }
  });

  test("every mapped Type value is a canonical Issue Type name", () => {
    expect(typeOptions.size).toBeGreaterThan(0);
    for (const value of Object.values(mappings.Type || {})) {
      expect(typeOptions.has(value)).toBe(true);
    }
  });

  test("Effort default is a declared Effort option", () => {
    expect(effortOptions.size).toBeGreaterThan(0);
    expect(effortOptions.has(effortField.default)).toBe(true);
  });
});

describe("derived values are always writable options", () => {
  test.each(REPRESENTATIVE_EVENTS)(
    "$name derives Status/Priority/Type/Effort that exist as options",
    ({ input }) => {
      const result = deriveProjectFieldValues({ cfg: issueFields, ...input });

      expect(statusOptions.has(result.status)).toBe(true);
      expect(priorityOptions.has(result.priority)).toBe(true);
      expect(typeOptions.has(result.type)).toBe(true);
      // Effort may be blank if no default is configured, but when present it
      // must be a valid option.
      if (result.effort) {
        expect(effortOptions.has(result.effort)).toBe(true);
      }
    },
  );
});
