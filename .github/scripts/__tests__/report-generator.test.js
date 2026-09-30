#!/usr/bin/env node

/**
 * Tests for the governance audit report generator.
 *
 * The JSON assertions validate against the real schema in
 * .github/specs/006-governance-audit/contracts/audit-report.contract.md,
 * which is what task T007 requires ("formats ComplianceReport JSON and
 * Markdown per audit-report.contract.md"). Asserting key names alone would
 * not catch a wrong type, an out-of-enum value or a pattern mismatch.
 */

import assert from "assert";
import fs from "fs";
import module from "module";
import os from "os";
import path from "path";
import { fileURLToPath } from "url";

// `require` and `__dirname` are declared by the CommonJS transform Babel
// applies to this file, so binding them here raises a TDZ error under Jest.
// Use distinct names and `import.meta.url` to locate the repo root.
//
// fileURLToPath decodes percent-encoding and strips the leading slash Windows
// paths carry; `new URL(import.meta.url).pathname` does neither, so a
// checkout whose path contains a space would resolve ROOT to a directory that
// does not exist and the suite would fail while loading.
const load = module.createRequire(import.meta.url);
const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(TEST_DIR, "../../../");

const { ComplianceReport, ReportWriter, SEVERITIES, normaliseSeverity } =
  load("../report-generator.cjs");
const { createViolation } = load("../audit-violation.cjs");
const governanceRules = load("../governance-rules.json");

const Ajv = load("ajv");
const addFormats = load("ajv-formats");

// Under Jest the suite is collected by the runner, so it must not exit the
// worker. Standalone (npm run test:report-generator) it owns the exit code.
const RUNNING_UNDER_JEST = typeof process.env.JEST_WORKER_ID === "string";

const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const NC = "\x1b[0m";

let testsTotal = 0;
let testsPassed = 0;
let testsFailed = 0;

function runTest(name, fn) {
  testsTotal++;
  try {
    fn();
    testsPassed++;
    console.log(`${GREEN}✓${NC} ${name}`);
  } catch (error) {
    testsFailed++;
    console.log(`${RED}✗ ${name}${NC}`);
    console.log(`    ${error.message}`);
  }
}

// --- Contract schema --------------------------------------------------------

const contractMarkdown = fs.readFileSync(
  path.join(
    ROOT,
    ".github/specs/006-governance-audit/contracts/audit-report.contract.md",
  ),
  "utf8",
);
const contractSchema = JSON.parse(
  contractMarkdown.match(/```json\s*\n([\s\S]*?)\n```/)[1],
);
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validateContract = ajv.compile(contractSchema);

/** Assert a report's toJSON() satisfies the contract schema. */
function assertContractConforms(report, label) {
  const data = report.toJSON();
  const valid = validateContract(data);
  if (!valid) {
    const detail = validateContract.errors
      .map((e) => `${e.instancePath || "/"} ${e.message}`)
      .join("; ");
    throw new Error(`${label} failed the contract schema: ${detail}`);
  }
  return data;
}

const base = (overrides) =>
  Object.assign(
    {
      id: "violation-20260929-001",
      ruleId: "label-prefix-validation",
      severity: "HIGH",
      file: ".github/labels.yml",
      message: "test violation",
    },
    overrides,
  );

runTest("default report conforms to the contract schema", () => {
  assertContractConforms(new ComplianceReport(), "default report");
});

runTest("report with a real AuditViolation conforms", () => {
  assertContractConforms(
    new ComplianceReport({ violations: [createViolation("r1", "Rule", "HIGH")] }),
    "AuditViolation report",
  );
});

runTest("report with null violation fields conforms", () => {
  assertContractConforms(
    new ComplianceReport({
      violations: [
        { id: null, ruleId: null, severity: null, message: null, file: null },
      ],
    }),
    "null-field report",
  );
});

runTest("report with unrecognised severity conforms", () => {
  assertContractConforms(
    new ComplianceReport({ violations: [base({ severity: "SEVERE" })] }),
    "unrecognised severity report",
  );
});

runTest("report with trends, recommendations and file descriptors conforms", () => {
  assertContractConforms(
    new ComplianceReport({
      filesScanned: [
        { id: "labels-yml", path: ".github/labels.yml", type: "labels" },
      ],
      rulesApplied: ["label-prefix-validation", "yaml-syntax-validation"],
      trends: {
        previousReportId: "audit-20260928-101010",
        violationsTrend: "improving",
        violationsFixed: 4,
        newViolations: 1,
        daysImproving: 2,
      },
      recommendations: [
        {
          priority: "high",
          title: "Add a prefix",
          description: "desc",
          affectedViolations: ["violation-20260929-001"],
          estimatedEffort: "simple",
        },
      ],
    }),
    "full report",
  );
});

runTest("malformed caller input is rejected rather than serialised", () => {
  const report = new ComplianceReport();
  assert.throws(() => report.setTrends("improving"), TypeError);
  assert.throws(() => report.setTrends(7), TypeError);
  assert.doesNotThrow(() => report.setTrends({ violationsTrend: "stable" }));
  assert.doesNotThrow(() => report.setTrends(null));
});

runTest("non-integer and negative counts are coerced to integers", () => {
  const decimal = new ComplianceReport({ filesScanned: 3.7 }).toJSON();
  assert.strictEqual(decimal.summary.totalFiles, 3);
  assertContractConforms(
    new ComplianceReport({ filesScanned: 3.7 }),
    "decimal file count",
  );
  const negative = new ComplianceReport({ filesScanned: -5 }).toJSON();
  assert.strictEqual(negative.summary.totalFiles, 0);
  assertContractConforms(
    new ComplianceReport({ filesScanned: -5 }),
    "negative file count",
  );
});

runTest("non-string rulesApplied and generatedBy are coerced", () => {
  assertContractConforms(
    new ComplianceReport({ rulesApplied: ["ok", 42], generatedBy: 7 }),
    "coerced passthrough fields",
  );
});

runTest("a null entry in violations does not throw", () => {
  const json = new ComplianceReport({ violations: [null] }).toJSON();
  assert.strictEqual(json.violations.length, 1);
  assertContractConforms(
    new ComplianceReport({ violations: [null] }),
    "null violation",
  );
});

runTest("markdown timestamp is UTC and matches the report id", () => {
  const report = new ComplianceReport();
  const md = report.toMarkdown();
  const stamp = report.timestamp.replace("Z", "");
  assert.ok(
    md.includes(stamp),
    `markdown should render the UTC timestamp ${stamp}`,
  );
});

// --- Violation id allocation -------------------------------------------------

const idPattern = new RegExp(
  contractSchema.properties.violations.items.properties.id.pattern,
);

/** Assert every serialised id is unique. */
function assertIdsUnique(json, label) {
  const ids = json.violations.map((v) => v.id);
  const seen = new Set();
  for (const id of ids) {
    assert.ok(
      !seen.has(id),
      `${label}: duplicate violation id ${id} among ${ids.length} violations`,
    );
    seen.add(id);
  }
}

runTest("a passed-through id that collides with a generated one is reallocated", () => {
  // The first violation arrives already carrying the id the second violation
  // would be allocated positionally. Both were conformant, so the old code
  // preserved the first and generated the same value for the second.
  const date = new Date().toISOString().split("T")[0].replace(/-/g, "");
  const json = new ComplianceReport({
    violations: [
      base({ id: `violation-${date}-002` }),
      base({ id: "not-conformant" }),
    ],
  }).toJSON();
  assertIdsUnique(json, "collision with a generated id");
});

runTest("two violations carrying the same conformant id are both reallocated", () => {
  const date = new Date().toISOString().split("T")[0].replace(/-/g, "");
  const json = new ComplianceReport({
    violations: [
      base({ id: `violation-${date}-001` }),
      base({ id: `violation-${date}-001` }),
    ],
  }).toJSON();
  assertIdsUnique(json, "duplicate passed-through id");
});

runTest("a preserved id is still preserved when it does not collide", () => {
  const json = new ComplianceReport({
    violations: [base({ id: "violation-20260929-007" })],
  }).toJSON();
  assert.strictEqual(
    json.violations[0].id,
    "violation-20260929-007",
    "a unique conformant id should be kept as-is",
  );
});

runTest("every reallocated id still matches the contract pattern", () => {
  const date = new Date().toISOString().split("T")[0].replace(/-/g, "");
  const json = new ComplianceReport({
    violations: [
      base({ id: `violation-${date}-002` }),
      base({ id: `violation-${date}-002` }),
      base({ id: `violation-${date}-002` }),
      base({ id: "plain" }),
    ],
  }).toJSON();
  for (const violation of json.violations) {
    assert.match(violation.id, idPattern);
  }
  assertIdsUnique(json, "reallocated ids");
});

runTest("allocation is sequential and never reuses a claimed sequence", () => {
  // The first violation is non-conformant and the second arrives carrying 001.
  // Allocation runs in order, so the first claims 001 and the second finds it
  // taken and steps to 002. The invariant under test is uniqueness, not which
  // of the two ends up with which sequence.
  const date = new Date().toISOString().split("T")[0].replace(/-/g, "");
  const json = new ComplianceReport({
    violations: [
      base({ id: "plain" }),
      base({ id: `violation-${date}-001` }),
    ],
  }).toJSON();
  assertIdsUnique(json, "sequential allocation");
  for (const violation of json.violations) {
    assert.match(violation.id, idPattern);
  }
  assert.strictEqual(json.violations[0].id, `violation-${date}-001`);
  assert.strictEqual(json.violations[1].id, `violation-${date}-002`);
});

runTest("an exhausted sequence range fails loudly rather than duplicating", () => {
  // All 999 sequences are claimed by passed-through ids, so the next
  // violation has nowhere to go and must not silently reuse one.
  const date = new Date().toISOString().split("T")[0].replace(/-/g, "");
  const all = Array.from({ length: 999 }, (_, i) =>
    base({ id: `violation-${date}-${String(i + 1).padStart(3, "0")}` }),
  );
  assert.throws(
    () =>
      new ComplianceReport({
        violations: [...all, base({ id: "overflow" })],
      }).toJSON(),
    RangeError,
    "an exhausted sequence range must fail loudly",
  );
});

// --- Recommendation references ----------------------------------------------

runTest("recommendation references follow the id rewrite", () => {
  // Build the violation first so the recommendation can reference its real
  // source id, which is not the id the contract receives.
  const violation = createViolation("r1", "Rule", "HIGH");
  const sourceId = violation.toJSON().id;
  const json = new ComplianceReport({
    violations: [violation],
    recommendations: [
      {
        priority: "high",
        title: "Fix it",
        description: "desc",
        affectedViolations: [sourceId],
      },
    ],
  }).toJSON();
  assert.notStrictEqual(json.violations[0].id, sourceId);
  assert.strictEqual(
    json.recommendations[0].affectedViolations[0],
    json.violations[0].id,
    `affectedViolations still points at the source id ${sourceId} rather than ` +
      `${json.violations[0].id}`,
  );
});

runTest("recommendation references follow a reallocated id", () => {
  const date = new Date().toISOString().split("T")[0].replace(/-/g, "");
  const json = new ComplianceReport({
    violations: [base({ id: `violation-${date}-002` }), base({ id: "plain" })],
    recommendations: [
      {
        priority: "high",
        title: "t",
        description: "d",
        affectedViolations: [`violation-${date}-002`, "plain"],
      },
    ],
  }).toJSON();
  const known = new Set(json.violations.map((v) => v.id));
  for (const ref of json.recommendations[0].affectedViolations) {
    assert.ok(
      known.has(ref),
      `affectedViolations entry ${ref} does not match any serialised violation id`,
    );
  }
});

runTest("unmatched recommendation references are left intact", () => {
  const json = new ComplianceReport({
    violations: [base()],
    recommendations: [
      {
        priority: "low",
        title: "t",
        description: "d",
        affectedViolations: ["an-id-with-no-violation"],
      },
    ],
  }).toJSON();
  assert.deepStrictEqual(json.recommendations[0].affectedViolations, [
    "an-id-with-no-violation",
  ]);
});

runTest("written report file re-validates against the contract", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "report-contract-"));
  try {
    const written = new ReportWriter(dir).writeJson(
      new ComplianceReport({ violations: [createViolation("r", "R", "HIGH")] }),
    );
    const reread = JSON.parse(fs.readFileSync(written.filepath, "utf8"));
    const valid = validateContract(reread);
    assert.ok(
      valid,
      `written report failed the contract schema: ${JSON.stringify(
        validateContract.errors,
      )}`,
    );
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

// --- Severity normalisation -------------------------------------------------

runTest("uppercase severity is bucketed", () => {
  const bySeverity = new ComplianceReport({
    violations: [base()],
  }).getViolationsBySeverity();
  assert.strictEqual(bySeverity.HIGH.length, 1);
});

runTest("lowercase severity is normalised and bucketed", () => {
  const bySeverity = new ComplianceReport({
    violations: [base({ severity: "critical" })],
  }).getViolationsBySeverity();
  assert.strictEqual(bySeverity.CRITICAL.length, 1);
  assert.strictEqual(bySeverity.UNKNOWN.length, 0);
});

runTest("mixed-case severity is normalised and bucketed", () => {
  const bySeverity = new ComplianceReport({
    violations: [base({ severity: "Medium" })],
  }).getViolationsBySeverity();
  assert.strictEqual(bySeverity.MEDIUM.length, 1);
  assert.strictEqual(bySeverity.UNKNOWN.length, 0);
});

runTest("unrecognised severity is bucketed as UNKNOWN, not dropped", () => {
  const report = new ComplianceReport({
    violations: [
      base(),
      base({ id: "violation-20260929-002", severity: "SEVERE" }),
      base({ id: "violation-20260929-003", severity: "blocker" }),
    ],
  });
  const bySeverity = report.getViolationsBySeverity();
  assert.strictEqual(bySeverity.HIGH.length, 1);
  assert.strictEqual(bySeverity.UNKNOWN.length, 2);
  const stats = report.getViolationStats();
  assert.strictEqual(stats.total, 3, "stats.total must count every violation");
  assert.strictEqual(stats.unknown, 2, "stats must expose the unknown bucket");
});

runTest("every violation lands in exactly one bucket", () => {
  const severities = ["CRITICAL", "high", "Medium", "low", "SEVERE", "", null, 7];
  const report = new ComplianceReport({
    violations: severities.map((severity, i) =>
      base({ id: `violation-20260929-00${i + 1}`, severity }),
    ),
  });
  const bySeverity = report.getViolationsBySeverity();
  const bucketed = Object.values(bySeverity).reduce((n, list) => n + list.length, 0);
  assert.strictEqual(
    bucketed,
    severities.length,
    "buckets must account for every violation exactly once",
  );
  for (const bucket of Object.values(bySeverity)) {
    for (const violation of bucket) {
      assert.ok(
        SEVERITIES.includes(normaliseSeverity(violation.severity)),
        "violation bucketed outside SEVERITIES",
      );
    }
  }
});

runTest("absent severity defaults, malformed severity is an anomaly", () => {
  // Absent means "not supplied", which the contract treats as the default.
  assert.strictEqual(normaliseSeverity(undefined), "MEDIUM");
  assert.strictEqual(normaliseSeverity(null), "MEDIUM");
  assert.strictEqual(normaliseSeverity(""), "MEDIUM");
  assert.strictEqual(normaliseSeverity("   "), "MEDIUM");
  // Present but not a recognised string is an anomaly, not a silent default.
  assert.strictEqual(normaliseSeverity(7), "UNKNOWN");
  assert.strictEqual(normaliseSeverity({}), "UNKNOWN");
  assert.strictEqual(normaliseSeverity("SEVERE"), "UNKNOWN");
});

runTest("every bucket is present even when empty", () => {
  // Asserted against a literal list, not the exported constant, so this
  // fails if SEVERITIES loses a bucket rather than tracking the change.
  const expected = ["CRITICAL", "HIGH", "MEDIUM", "LOW", "UNKNOWN"];
  const bySeverity = new ComplianceReport().getViolationsBySeverity();
  assert.deepStrictEqual(Object.keys(bySeverity).sort(), expected.slice().sort());
  for (const severity of expected) {
    assert.deepStrictEqual(bySeverity[severity], []);
  }
});

// --- Contract-shaped output -------------------------------------------------

runTest("toJSON emits every contract-required key", () => {
  const json = new ComplianceReport().toJSON();
  for (const key of contractSchema.required) {
    assert.ok(
      Object.prototype.hasOwnProperty.call(json, key),
      `missing required contract key: ${key}`,
    );
  }
});

runTest("report id matches the contract pattern", () => {
  const json = new ComplianceReport().toJSON();
  assert.match(
    json.id,
    new RegExp(contractSchema.properties.id.pattern),
  );
});

runTest("report id and timestamp come from the same instant", () => {
  const json = new ComplianceReport().toJSON();
  const parts = json.id.match(/^audit-(\d{4})(\d{2})(\d{2})-(\d{2})(\d{2})(\d{2})$/);
  assert.ok(parts, `id did not parse: ${json.id}`);
  const fromId = `${parts[1]}-${parts[2]}-${parts[3]}T${parts[4]}:${parts[5]}:${parts[6]}`;
  assert.strictEqual(json.timestamp.slice(0, 19), fromId);
});

runTest("violations serialise as an array", () => {
  const json = new ComplianceReport({ violations: [base()] }).toJSON();
  assert.ok(Array.isArray(json.violations));
  assert.strictEqual(json.violations.length, 1);
  assert.strictEqual(json.violations[0].ruleId, "label-prefix-validation");
});

runTest("every serialised severity is in the contract enum", () => {
  const severities = ["CRITICAL", "high", "Medium", "low", "SEVERE", "blocker"];
  const json = new ComplianceReport({
    violations: severities.map((severity, i) =>
      base({ id: `violation-20260929-0${i + 10}`, severity }),
    ),
  }).toJSON();
  const allowed = contractSchema.properties.violations.items.properties.severity.enum;
  for (const violation of json.violations) {
    assert.ok(
      allowed.includes(violation.severity),
      `${violation.severity} is not in the contract enum ${allowed.join(",")}`,
    );
  }
});

runTest("serialised violation ids all match the contract pattern", () => {
  const json = new ComplianceReport({
    violations: [
      { id: "legacy-uuid-style", ruleId: "r", severity: "HIGH", message: "m" },
      { id: "violation-20260929-007", ruleId: "r", severity: "HIGH", message: "m" },
    ],
  }).toJSON();
  const pattern = new RegExp(
    contractSchema.properties.violations.items.properties.id.pattern,
  );
  for (const violation of json.violations) {
    assert.match(violation.id, pattern);
  }
  assert.strictEqual(
    json.violations[1].id,
    "violation-20260929-007",
    "an already-conformant id must be preserved",
  );
});

runTest("location carries line and column when supplied", () => {
  const json = new ComplianceReport({
    violations: [
      base({ location: { path: "a/b.yml", line: 12, column: 3 } }),
    ],
  }).toJSON();
  assert.strictEqual(json.violations[0].location.path, "a/b.yml");
  assert.strictEqual(json.violations[0].location.line, 12);
  assert.strictEqual(json.violations[0].location.column, 3);
});

runTest("location falls back to the legacy file property", () => {
  const json = new ComplianceReport({ violations: [base()] }).toJSON();
  assert.strictEqual(json.violations[0].location.path, ".github/labels.yml");
});

runTest("summary counts match the violations", () => {
  const json = new ComplianceReport({
    filesScanned: [
      { id: "labels-yml", path: ".github/labels.yml", type: "labels" },
      { id: "issue-types", path: ".github/issue-types.yml", type: "labels" },
    ],
    rulesChecked: 8,
    rulesPassed: 6,
    violations: [base({ severity: "CRITICAL" }), base({ id: "violation-20260929-002", severity: "low" })],
  }).toJSON();
  assert.strictEqual(json.summary.totalFiles, 2);
  assert.strictEqual(json.summary.totalRules, 8);
  assert.strictEqual(json.summary.totalViolations, 2);
  assert.strictEqual(json.summary.criticalViolations, 1);
  assert.strictEqual(json.summary.compliancePercentage, 75);
  assert.strictEqual(json.summary.violationsBySeverity.critical, 1);
  assert.strictEqual(json.summary.violationsBySeverity.low, 1);
});

runTest("violationsBySeverity partitions violations[] exactly", () => {
  const json = new ComplianceReport({
    violations: [
      base({ severity: "CRITICAL" }),
      base({ id: "violation-20260929-002", severity: "SEVERE" }),
      base({ id: "violation-20260929-003", severity: "blocker" }),
    ],
  }).toJSON();
  const bySeverity = json.summary.violationsBySeverity;
  assert.deepStrictEqual(Object.keys(bySeverity).sort(), [
    "critical",
    "high",
    "low",
    "medium",
  ]);
  const sum =
    bySeverity.critical + bySeverity.high + bySeverity.medium + bySeverity.low;
  assert.strictEqual(
    sum,
    json.summary.totalViolations,
    "the four contract buckets must sum to totalViolations",
  );
  // The summary must agree with the serialised array, bucket for bucket.
  const tally = {};
  for (const violation of json.violations) {
    tally[violation.severity] = (tally[violation.severity] || 0) + 1;
  }
  for (const key of Object.keys(bySeverity)) {
    assert.strictEqual(
      bySeverity[key],
      tally[key] || 0,
      `summary.${key} disagrees with violations[]`,
    );
  }
  assert.strictEqual(json.summary.unknownSeverities, 2);
});

runTest("unrecognised severity serialises as low, not as a real bucket", () => {
  const json = new ComplianceReport({
    violations: [
      base({ severity: "SEVERE" }),
      base({ id: "violation-20260929-002", severity: 3 }),
    ],
  }).toJSON();
  for (const violation of json.violations) {
    assert.strictEqual(
      violation.severity,
      "low",
      "an unrecognised severity must not inflate a real bucket",
    );
  }
  assert.strictEqual(json.summary.violationsBySeverity.medium, 0);
  assert.strictEqual(json.summary.violationsBySeverity.low, 2);
  assert.strictEqual(json.summary.unknownSeverities, 2);
});

runTest("absent severity is not counted as an anomaly", () => {
  const json = new ComplianceReport({
    violations: [base({ severity: undefined })],
  }).toJSON();
  assert.strictEqual(json.violations[0].severity, "medium");
  assert.strictEqual(json.summary.unknownSeverities, 0);
});

runTest("the contract's 999-violation id limit is enforced", () => {
  const build = (n) =>
    new ComplianceReport({
      violations: Array.from({ length: n }, (_, i) => base({ id: `x-${i}` })),
    });

  const atLimit = build(999).toJSON();
  const pattern = new RegExp(
    contractSchema.properties.violations.items.properties.id.pattern,
  );
  for (const violation of atLimit.violations) {
    assert.match(violation.id, pattern);
  }
  const ids = new Set(atLimit.violations.map((v) => v.id));
  assert.strictEqual(ids.size, 999, "ids must be unique at the limit");

  assert.throws(
    () => build(1000).toJSON(),
    RangeError,
    "1000 violations cannot be given unique contract ids and must fail loudly",
  );
});

runTest("status maps violation severity onto the contract enum", () => {
  const allowed = contractSchema.properties.summary.properties.status.enum;
  const cases = [
    [new ComplianceReport(), "compliant"],
    [new ComplianceReport({ violations: [base({ severity: "LOW" })] }), "warnings"],
    [new ComplianceReport({ violations: [base({ severity: "HIGH" })] }), "violations"],
    [new ComplianceReport({ violations: [base({ severity: "CRITICAL" })] }), "violations"],
  ];
  for (const [report, expected] of cases) {
    const status = report.toJSON().summary.status;
    assert.strictEqual(status, expected, `expected ${expected}, got ${status}`);
    assert.ok(allowed.includes(status), `${status} is not in the contract enum`);
  }
});

runTest("filesScanned is an array and defaults to empty", () => {
  assert.deepStrictEqual(new ComplianceReport().toJSON().filesScanned, []);
  const json = new ComplianceReport({
    filesScanned: [{ id: "labels-yml", path: ".github/labels.yml", type: "labels" }],
  }).toJSON();
  assert.ok(Array.isArray(json.filesScanned));
  assert.strictEqual(json.filesScanned[0].type, "labels");
  assert.strictEqual(
    json.filesScanned[0].status,
    "scanned",
    "the contract defines a status enum; descriptors should default to scanned",
  );
});

runTest("a filesScanned count is honoured in the summary", () => {
  const json = new ComplianceReport({ filesScanned: 7 }).toJSON();
  assert.strictEqual(json.summary.totalFiles, 7);
  assert.deepStrictEqual(json.filesScanned, []);
});

runTest("omitting rulesPassed reports a clean audit, not zero", () => {
  const json = new ComplianceReport({ rulesApplied: ["a", "b"] }).toJSON();
  assert.strictEqual(json.summary.totalRules, 2);
  assert.strictEqual(json.summary.compliancePercentage, 100);
});

runTest("compliancePercentage is clamped to 0-100", () => {
  assert.strictEqual(
    new ComplianceReport({ rulesChecked: 2, rulesPassed: 9 }).toJSON().summary
      .compliancePercentage,
    100,
  );
  assert.strictEqual(
    new ComplianceReport({ rulesChecked: 4, rulesPassed: 0 }).toJSON().summary
      .compliancePercentage,
    0,
  );
});

runTest("violations are not duplicated under a byFile key", () => {
  const json = new ComplianceReport({ violations: [base()] }).toJSON();
  assert.strictEqual(
    Object.prototype.hasOwnProperty.call(json, "byFile"),
    false,
    "byFile duplicated every violation and is not in the contract",
  );
  assert.strictEqual(
    Object.prototype.hasOwnProperty.call(json.violations, "byFile"),
    false,
    "byFile duplicated every violation and is not in the contract",
  );
  const serialised = JSON.stringify(json);
  assert.strictEqual(
    serialised.split("test violation").length - 1,
    1,
    "each violation message must appear exactly once",
  );
});

runTest("generatedBy is a non-empty string", () => {
  const json = new ComplianceReport().toJSON();
  assert.strictEqual(typeof json.generatedBy, "string");
  assert.ok(json.generatedBy.length > 0);
});

// --- Markdown ---------------------------------------------------------------

runTest("toMarkdown tolerates plain-object violations", () => {
  const md = new ComplianceReport({
    violations: [base({ severity: "SEVERE" })],
  }).toMarkdown();
  assert.ok(md.includes("SEVERE"), "plain violation was not rendered");
});

runTest("toMarkdown renders the contract trend field names only", () => {
  const report = new ComplianceReport();
  report.setTrends({
    previousReportId: "audit-20260928-101010",
    violationsTrend: "improving",
    violationsFixed: 4,
    newViolations: 1,
    daysImproving: 2,
  });
  const md = report.toMarkdown();
  for (const label of [
    "Previous Report",
    "Trend",
    "Violations Fixed",
    "New Violations",
    "Days Improving",
  ]) {
    assert.ok(md.includes(label), `markdown is missing the ${label} row`);
  }
  assert.ok(md.includes("improving"), "violationsTrend value not rendered");
  assert.ok(
    !md.includes("Compliance |"),
    "markdown still renders the removed complianceTrend row",
  );
});

runTest("toMarkdown reports the unknown severity count", () => {
  const md = new ComplianceReport({
    violations: [base({ severity: "SEVERE" })],
  }).toMarkdown();
  assert.ok(md.includes("UNKNOWN"));
});

runTest("trends survive toJSON under the contract shape", () => {
  const report = new ComplianceReport();
  report.setTrends({ violationsTrend: "declining", newViolations: 7 });
  const json = report.toJSON();
  assert.strictEqual(json.trends.violationsTrend, "declining");
  assert.strictEqual(json.trends.newViolations, 7);
});

runTest("absent trends are omitted rather than emitted as null", () => {
  const json = new ComplianceReport().toJSON();
  assert.ok(
    !Object.prototype.hasOwnProperty.call(json, "trends"),
    "trends: null violates the contract's object type",
  );
});

// --- ReportWriter naming ----------------------------------------------------

runTest("writer filename matches the configured reportFilePattern", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "report-writer-"));
  try {
    const report = new ComplianceReport();
    const written = new ReportWriter(dir).writeJson(report);

    // Expand the configured pattern from the report's own timestamp, so the
    // assertion cannot drift across a second boundary.
    const now = new Date(report.timestamp);
    const yyyymmdd = now.toISOString().split("T")[0].replace(/-/g, "");
    const hhmmss = now.toISOString().split("T")[1].split(".")[0].replace(/:/g, "");
    const expected =
      governanceRules.reporting.reportFilePattern
        .replace("{YYYYMMDD}", yyyymmdd)
        .replace("{HHMMSS}", hhmmss) + ".json";

    assert.strictEqual(
      written.filename,
      expected,
      `writer produced ${written.filename}, configured pattern expands to ${expected}`,
    );
    assert.ok(fs.existsSync(path.join(dir, expected)));
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

console.log("");
console.log("Test Summary");
console.log(`Total Tests: ${testsTotal}`);
console.log(`${GREEN}Passed: ${testsPassed}${NC}`);
console.log(`${RED}Failed: ${testsFailed}${NC}`);

if (RUNNING_UNDER_JEST) {
  // This file uses a plain assertion harness so it can also run standalone via
  // `npm run test:report-generator`. Under Jest the assertions have already run
  // at module scope, so register one test that reports their result.
  test("governance audit report generator conforms to the contract", () => {
    expect({
      total: testsTotal,
      failed: testsFailed,
    }).toEqual({ total: testsTotal, failed: 0 });
  });
} else if (testsFailed > 0) {
  process.exit(1);
}
