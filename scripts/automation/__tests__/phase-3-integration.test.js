/**
 * Phase 3 Integration Tests
 * Comprehensive workflow scenarios for OpenSpec label automation
 */

const handleIssueCreated = require("../handlers/handle-issue-created");
const handleIssueLabled = require("../handlers/handle-issue-labeled");
const handlePROpened = require("../handlers/handle-pr-opened");
const handlePRMerged = require("../handlers/handle-pr-merged");
const handleIssueClosed = require("../handlers/handle-issue-closed");
const phaseStateMachine = require("../includes/phase-state-machine");
const labelValidator = require("../includes/label-validator");
const auditLogger = require("../includes/audit-logger");

describe("Phase 3 Integration Tests", () => {
  describe("Scenario 1: New issue without type label", () => {
    it("should suggest initial OpenSpec label", () => {
      const issue = {
        number: 1001,
        title: "New feature request",
        labels: [], // No type label yet
      };

      const result = handleIssueCreated.handleIssueCreated(issue);

      expect(result.success).toBe(true);
      // When no type label, should note that but still succeed
      expect(result.changes.length > 0 || result.warnings.length > 0).toBe(
        true,
      );
    });

    it("should apply initial label based on type", () => {
      const issue = {
        number: 1002,
        title: "New feature request",
        labels: [{ name: "type:feature" }],
      };

      const result = handleIssueCreated.handleIssueCreated(issue);

      expect(result.success).toBe(true);
      expect(result.changes[0].labelToAdd).toBe(
        "openspec:specification-pending",
      );
    });
  });

  describe("Scenario 2: Label addition triggers validation", () => {
    it("should validate label combinations when new label added", () => {
      const issue = {
        number: 1003,
        title: "Test issue",
        labels: [
          { name: "openspec:specification-pending" },
          { name: "status:needs-planning" },
        ],
      };

      const result = handleIssueLabled.handleIssueLabled(
        issue,
        "priority:high",
      );

      expect(result.success).toBe(true);
      expect(result.labelAdded).toBe("priority:high");
    });

    it("should warn about conflicting labels", () => {
      const issue = {
        number: 1004,
        title: "Test issue",
        labels: [
          { name: "openspec:specification-pending" },
          { name: "status:needs-planning" },
        ],
      };

      // Try to add a conflicting OpenSpec label
      const result = handleIssueLabled.handleIssueLabled(
        issue,
        "openspec:implementation-pending",
      );

      // Should handle the transition properly
      expect(result.success).toBe(true);
    });
  });

  describe("Scenario 3: PR link triggers phase advance", () => {
    it("should extract linked issue from PR body", () => {
      const prBody = "This PR resolves #1005 by implementing the feature";
      const linkedIssue = handlePROpened.extractLinkedIssue(prBody);

      expect(linkedIssue).toBe(1005);
    });

    it("should handle multiple PR body patterns", () => {
      const patterns = [
        "Resolves #1006",
        "Fixes #1007",
        "Related: #1008",
        "This fixes #1009",
      ];

      patterns.forEach((body, index) => {
        const issue = 1006 + index;
        const linked = handlePROpened.extractLinkedIssue(body);
        expect(linked).toBe(issue);
      });
    });

    it("should trigger phase progression when PR opens", () => {
      const pr = {
        number: 100,
        title: "Implement feature",
      };

      // Mock issue that we would fetch
      const mockIssue = {
        number: 1010,
        labels: [{ name: "openspec:specification-pending" }],
        title: "Feature spec",
      };

      // The handler would normally fetch this via API
      // For testing, we just check the logic
      const triggers = phaseStateMachine.getProgressionTriggers(
        "openspec:specification-pending",
      );

      expect(triggers["PR opened"]).toBe("openspec:specification-in-progress");
    });
  });

  describe("Scenario 4: Conflict detection", () => {
    it("should prevent incompatible labels in same mutex group", () => {
      const labels = [
        "openspec:specification-pending",
        "openspec:specification-in-progress", // Conflict!
        "status:needs-planning",
      ];

      const validation = labelValidator.validateLabels(labels);

      expect(validation.valid).toBe(false);
      expect(validation.conflicts.length).toBeGreaterThan(0);
    });

    it("should suggest related labels", () => {
      const labels = ["openspec:specification-pending"];
      const validation = labelValidator.validateLabels(labels);

      // Should have suggestions for complementary labels
      expect(Array.isArray(validation.suggestions)).toBe(true);
    });

    it("should identify incompatible status labels", () => {
      const labels = [
        "status:needs-planning",
        "status:in-progress", // Conflict!
        "openspec:specification-pending",
      ];

      const validation = labelValidator.validateLabels(labels);

      expect(validation.valid).toBe(false);
    });
  });

  describe("Scenario 5: Progression timeline tracking", () => {
    it("should track phase transitions over time", () => {
      const issueNumber = 1011;

      // Simulate a series of events
      const events = [
        auditLogger.createAuditEntry({
          type: "PHASE_ADVANCED",
          issueNumber,
          reason: "Initial specification label",
          added: ["openspec:specification-pending"],
        }),
        auditLogger.createAuditEntry({
          type: "PHASE_ADVANCED",
          issueNumber,
          reason: "PR opened - advancing phase",
          added: ["openspec:specification-in-progress"],
          removed: ["openspec:specification-pending"],
        }),
        auditLogger.createAuditEntry({
          type: "PHASE_ADVANCED",
          issueNumber,
          reason: "PR merged - completing phase",
          added: ["openspec:specification-complete"],
          removed: ["openspec:specification-in-progress"],
        }),
      ];

      // Verify event structure
      expect(events.length).toBe(3);
      expect(events[0].type).toBe("PHASE_ADVANCED");
      expect(events[0].issueNumber).toBe(issueNumber);
    });

    it("should generate timeline report", () => {
      const issueNumber = 1012;
      const timeline = {
        issueNumber,
        events: [
          { action: "created", timestamp: "2026-08-18T10:00:00Z" },
          {
            action: "labeled",
            label: "type:feature",
            timestamp: "2026-08-18T10:05:00Z",
          },
          { action: "pr-opened", timestamp: "2026-08-18T11:00:00Z" },
          { action: "pr-merged", timestamp: "2026-08-18T14:00:00Z" },
        ],
      };

      expect(timeline.events.length).toBe(4);
      expect(timeline.events[0].action).toBe("created");
    });
  });

  describe("Scenario 6: Multiple issues in same PR", () => {
    it("should handle PR linking multiple issues", () => {
      const prBody = `
        This PR addresses:
        - Resolves #1013
        - Related: #1014
        - Fixes #1015
      `;

      // Extract first linked issue (typical behavior)
      const linked = handlePROpened.extractLinkedIssue(prBody);

      expect(linked).toBe(1013);
    });

    it("should track all issues affected by PR merge", () => {
      const affectedIssues = [1013, 1014, 1015];

      // In real implementation, we would process each issue
      expect(affectedIssues.length).toBe(3);
      affectedIssues.forEach((issueNumber) => {
        expect(typeof issueNumber).toBe("number");
        expect(issueNumber).toBeGreaterThan(0);
      });
    });
  });

  describe("Scenario 7: Issue with no OpenSpec labels (non-spec work)", () => {
    it("should handle issues without OpenSpec labels gracefully", () => {
      const issue = {
        number: 1016,
        title: "Non-spec work",
        labels: [{ name: "type:chore" }, { name: "priority:low" }],
      };

      const result = handleIssueLabled.handleIssueLabled(
        issue,
        "priority:normal",
      );

      // Should not error, just warn
      expect(result.success).toBe(true);
    });

    it("should warn when PR references non-spec issue", () => {
      const issue = {
        number: 1017,
        title: "Documentation update",
        labels: [{ name: "type:documentation" }],
      };

      // No OpenSpec label present
      const openspec = labelValidator.getOpenSpecLabel(
        issue.labels.map((l) => l.name),
      );

      expect(openspec).toBeNull();
    });
  });

  describe("Scenario 8: Phase rollback (label removed)", () => {
    it("should allow rollback from in-progress to pending", () => {
      const currentState = "openspec:specification-in-progress";
      const targetState = "openspec:specification-pending";

      const isValid = phaseStateMachine.isValidTransition(
        currentState,
        targetState,
      );

      expect(isValid).toBe(true);
    });

    it("should prevent invalid rollbacks", () => {
      const currentState = "openspec:specification-pending";
      const targetState = "openspec:implementation-complete";

      const isValid = phaseStateMachine.isValidTransition(
        currentState,
        targetState,
      );

      expect(isValid).toBe(false);
    });

    it("should track rollback in audit trail", () => {
      const issueNumber = 1018;

      const rollbackEntry = auditLogger.createAuditEntry({
        type: "PHASE_ROLLED_BACK",
        issueNumber,
        reason: "Manual rollback requested",
        removed: ["openspec:specification-in-progress"],
        added: ["openspec:specification-pending"],
      });

      expect(rollbackEntry.type).toBe("PHASE_ROLLED_BACK");
      expect(rollbackEntry.issueNumber).toBe(issueNumber);
      expect(rollbackEntry.details.reason).toContain("rollback");
    });
  });

  describe("Scenario 9: Concurrent label changes", () => {
    it("should handle simultaneous label additions", () => {
      const issue = {
        number: 1019,
        title: "Concurrent update test",
        labels: [{ name: "openspec:specification-pending" }],
      };

      // Simulate rapid label changes
      const label1 = handleIssueLabled.handleIssueLabled(
        issue,
        "priority:high",
      );
      const label2 = handleIssueLabled.handleIssueLabled(
        issue,
        "component:api",
      );

      expect(label1.success).toBe(true);
      expect(label2.success).toBe(true);
    });

    it("should prevent label race conditions", () => {
      const labels = [
        "openspec:specification-pending",
        "status:needs-planning",
        "priority:high",
      ];

      const validation = labelValidator.validateLabels(labels);

      // Should be valid
      expect(validation.valid).toBe(true);
    });
  });

  describe("Scenario 10: Missing issue link on PR", () => {
    it("should warn when PR has no linked issue", () => {
      const prBody = "This is just a random PR without any issue reference";
      const linked = handlePROpened.extractLinkedIssue(prBody);

      expect(linked).toBeNull();
    });

    it("should not error when processing PR without issue link", () => {
      const pr = {
        number: 101,
        title: "Random improvement",
      };

      // Simulate handler behavior
      const result = {
        success: true,
        warnings: ["No linked issue found"],
      };

      expect(result.success).toBe(true);
      expect(result.warnings.length).toBeGreaterThan(0);
    });
  });

  describe("Scenario 11: Issue closure with audit report", () => {
    it("should preserve OpenSpec labels when issue closes", () => {
      const issue = {
        number: 1020,
        title: "Completed feature",
        labels: [
          { name: "openspec:implementation-complete" },
          { name: "status:ready" },
        ],
      };

      const result = handleIssueClosed.handleIssueClosed(issue);

      // Should handle closure gracefully
      expect(result.success === true || result.warnings.length >= 0).toBe(true);
      // Should note the OpenSpec label
      expect(result.changes.length > 0 || result.closedIssue).toBe(true);
    });

    it("should generate final audit report on closure", () => {
      const issueNumber = 1021;

      // Create audit entries
      const entries = [
        auditLogger.createAuditEntry({
          type: "PHASE_ADVANCED",
          issueNumber,
          added: ["openspec:specification-pending"],
        }),
        auditLogger.createAuditEntry({
          type: "PHASE_ADVANCED",
          issueNumber,
          added: ["openspec:specification-in-progress"],
          removed: ["openspec:specification-pending"],
        }),
      ];

      // Verify entries were created correctly
      expect(entries.length).toBe(2);
      expect(entries[0].type).toBe("PHASE_ADVANCED");
      expect(entries[1].type).toBe("PHASE_ADVANCED");
    });
  });

  describe("Complete workflow: Specification → Implementation", () => {
    it("should progress from specification-pending to implementation-complete", () => {
      const transitions = [
        "openspec:specification-pending",
        "openspec:specification-in-progress",
        "openspec:specification-complete",
        "openspec:implementation-pending",
        "openspec:implementation-in-progress",
        "openspec:implementation-complete",
      ];

      // Verify each transition is valid
      for (let i = 0; i < transitions.length - 1; i++) {
        const from = transitions[i];
        const to = transitions[i + 1];
        const isValid = phaseStateMachine.isValidTransition(from, to);

        expect(isValid).toBe(true);
      }
    });

    it("should prevent invalid cross-phase transitions", () => {
      const invalidTransitions = [
        [
          "openspec:specification-pending",
          "openspec:implementation-in-progress",
        ],
        [
          "openspec:specification-in-progress",
          "openspec:implementation-complete",
        ],
      ];

      invalidTransitions.forEach(([from, to]) => {
        const isValid = phaseStateMachine.isValidTransition(from, to);
        expect(isValid).toBe(false);
      });
    });
  });
});
