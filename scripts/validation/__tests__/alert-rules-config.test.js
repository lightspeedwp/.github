/**
 * Tests for `.github/config/metrics/alert-rules.yml`.
 *
 * This PR removes a trailing Markdown "Notes on Alert Configuration" section
 * that had been appended after a second `---` YAML document separator. That
 * trailing content was not part of the structured configuration, and its
 * presence turned the file into a multi-document YAML stream (structured
 * config + a loose markdown "document"). This test locks in that the file is
 * now a single, valid YAML document containing only the structured alert
 * configuration.
 */

const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

const CONFIG_PATH = path.join(
  __dirname,
  "../../../.github/config/metrics/alert-rules.yml",
);

describe(".github/config/metrics/alert-rules.yml", () => {
  let raw;
  let config;

  beforeAll(() => {
    raw = fs.readFileSync(CONFIG_PATH, "utf8");
    config = yaml.load(raw);
  });

  it("parses as a single valid YAML document", () => {
    const documents = yaml.loadAll(raw);
    expect(documents).toHaveLength(1);
    expect(config).toEqual(expect.any(Object));
  });

  it("contains exactly one YAML document separator (the header)", () => {
    const separators = raw.match(/^---\s*$/gm) || [];
    expect(separators).toHaveLength(1);
  });

  it("does not contain the retired markdown notes section", () => {
    expect(raw).not.toMatch(/Notes on Alert Configuration/);
    expect(raw).not.toMatch(/## Design Principles/);
    expect(raw).not.toMatch(/## Integration Points/);
    expect(raw).not.toMatch(/## Customization/);
    expect(raw).not.toMatch(/## Status Tracking/);
  });

  it("exposes all expected top-level configuration sections", () => {
    expect(Object.keys(config)).toEqual(
      expect.arrayContaining([
        "metadata",
        "health_score_thresholds",
        "collection_failures",
        "performance",
        "components",
        "slack_notifications",
        "aggregation",
        "actions",
        "recovery",
        "suppression",
        "monitoring",
        "testing",
      ]),
    );
  });

  it("keeps the testing/validation section intact as the final section", () => {
    expect(config.testing).toEqual({
      test_alert_workflow: {
        trigger: "workflow_dispatch",
        test_scenarios: [
          "health_score_critical",
          "api_error_401",
          "timeout_exceeded",
          "missing_data",
        ],
        expected_slack_messages: 4,
      },
      validation: {
        schema_validation: true,
        runbook_links_valid: true,
        slack_webhook_available: true,
      },
    });
  });

  it("keeps the four health-score severity tiers with numeric thresholds", () => {
    const tiers = ["healthy", "warning", "critical", "severe"];
    tiers.forEach((tier) => {
      const entry = config.health_score_thresholds[tier];
      expect(entry).toBeDefined();
      expect(typeof entry.min).toBe("number");
      expect(typeof entry.max).toBe("number");
      expect(typeof entry.alert).toBe("boolean");
    });
  });

  it("keeps recovery runbook mappings referencing existing runbook filenames", () => {
    Object.values(config.recovery).forEach((entry) => {
      expect(entry.runbook).toMatch(/^RUNBOOK_[A-Z_]+\.md$/);
      expect(typeof entry.severity).toBe("string");
    });
  });

  it("does not silently coerce validation flags to strings", () => {
    // Negative/boundary case: validation flags must be booleans, not the
    // string "true"/"false", to avoid falsy/truthy bugs in consuming code.
    Object.values(config.testing.validation).forEach((value) => {
      expect(typeof value).toBe("boolean");
    });
  });
});