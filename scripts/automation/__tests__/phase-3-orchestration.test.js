/**
 * Phase 3 Orchestration Tests
 * Tests for workflow orchestration and phase progression
 */

const phaseStateMachine = require("../includes/phase-state-machine");
const labelValidator = require("../includes/label-validator");
const auditLogger = require("../includes/audit-logger");

describe("Phase 3: Workflow Orchestration", () => {
  describe("Phase State Machine", () => {
    describe("State Transitions", () => {
      it("should allow specification:pending → specification:in-progress", () => {
        expect(
          phaseStateMachine.isValidTransition(
            phaseStateMachine.STATES.SPECIFICATION_PENDING,
            phaseStateMachine.STATES.SPECIFICATION_IN_PROGRESS,
          ),
        ).toBe(true);
      });

      it("should allow specification:in-progress → specification:complete", () => {
        expect(
          phaseStateMachine.isValidTransition(
            phaseStateMachine.STATES.SPECIFICATION_IN_PROGRESS,
            phaseStateMachine.STATES.SPECIFICATION_COMPLETE,
          ),
        ).toBe(true);
      });

      it("should allow specification:complete → implementation:pending", () => {
        expect(
          phaseStateMachine.isValidTransition(
            phaseStateMachine.STATES.SPECIFICATION_COMPLETE,
            phaseStateMachine.STATES.IMPLEMENTATION_PENDING,
          ),
        ).toBe(true);
      });

      it("should allow implementation:pending → implementation:in-progress", () => {
        expect(
          phaseStateMachine.isValidTransition(
            phaseStateMachine.STATES.IMPLEMENTATION_PENDING,
            phaseStateMachine.STATES.IMPLEMENTATION_IN_PROGRESS,
          ),
        ).toBe(true);
      });

      it("should allow implementation:in-progress → implementation:complete", () => {
        expect(
          phaseStateMachine.isValidTransition(
            phaseStateMachine.STATES.IMPLEMENTATION_IN_PROGRESS,
            phaseStateMachine.STATES.IMPLEMENTATION_COMPLETE,
          ),
        ).toBe(true);
      });

      it("should reject invalid transition (specification:pending → implementation:in-progress)", () => {
        expect(
          phaseStateMachine.isValidTransition(
            phaseStateMachine.STATES.SPECIFICATION_PENDING,
            phaseStateMachine.STATES.IMPLEMENTATION_IN_PROGRESS,
          ),
        ).toBe(false);
      });

      it("should allow rollback transitions", () => {
        expect(
          phaseStateMachine.isValidTransition(
            phaseStateMachine.STATES.SPECIFICATION_IN_PROGRESS,
            phaseStateMachine.STATES.SPECIFICATION_PENDING,
          ),
        ).toBe(true);

        expect(
          phaseStateMachine.isValidTransition(
            phaseStateMachine.STATES.IMPLEMENTATION_COMPLETE,
            phaseStateMachine.STATES.IMPLEMENTATION_IN_PROGRESS,
          ),
        ).toBe(true);
      });
    });

    describe("Progression Detection", () => {
      it("should detect forward progression", () => {
        expect(
          phaseStateMachine.isProgression(
            phaseStateMachine.STATES.SPECIFICATION_PENDING,
            phaseStateMachine.STATES.SPECIFICATION_IN_PROGRESS,
          ),
        ).toBe(true);

        expect(
          phaseStateMachine.isProgression(
            phaseStateMachine.STATES.SPECIFICATION_COMPLETE,
            phaseStateMachine.STATES.IMPLEMENTATION_PENDING,
          ),
        ).toBe(true);
      });

      it("should detect rollback", () => {
        expect(
          phaseStateMachine.isRollback(
            phaseStateMachine.STATES.SPECIFICATION_IN_PROGRESS,
            phaseStateMachine.STATES.SPECIFICATION_PENDING,
          ),
        ).toBe(true);

        expect(
          phaseStateMachine.isRollback(
            phaseStateMachine.STATES.IMPLEMENTATION_COMPLETE,
            phaseStateMachine.STATES.SPECIFICATION_COMPLETE,
          ),
        ).toBe(true);
      });
    });

    describe("Phase and Step Detection", () => {
      it("should extract phase from state", () => {
        expect(
          phaseStateMachine.getPhase(
            phaseStateMachine.STATES.SPECIFICATION_PENDING,
          ),
        ).toBe("specification");
        expect(
          phaseStateMachine.getPhase(
            phaseStateMachine.STATES.IMPLEMENTATION_PENDING,
          ),
        ).toBe("implementation");
      });

      it("should extract step from state", () => {
        expect(
          phaseStateMachine.getStep(
            phaseStateMachine.STATES.SPECIFICATION_PENDING,
          ),
        ).toBe("pending");
        expect(
          phaseStateMachine.getStep(
            phaseStateMachine.STATES.SPECIFICATION_IN_PROGRESS,
          ),
        ).toBe("in-progress");
        expect(
          phaseStateMachine.getStep(
            phaseStateMachine.STATES.SPECIFICATION_COMPLETE,
          ),
        ).toBe("complete");
      });
    });

    describe("Progression Triggers", () => {
      it("should return triggers for specification:pending", () => {
        const triggers = phaseStateMachine.getProgressionTriggers(
          phaseStateMachine.STATES.SPECIFICATION_PENDING,
        );
        expect(triggers).toBeDefined();
        expect(Object.keys(triggers).length).toBeGreaterThan(0);
      });

      it("should map PR opened to specification:in-progress", () => {
        const triggers = phaseStateMachine.getProgressionTriggers(
          phaseStateMachine.STATES.SPECIFICATION_PENDING,
        );
        expect(triggers["PR opened"]).toBe(
          phaseStateMachine.STATES.SPECIFICATION_IN_PROGRESS,
        );
      });
    });
  });

  describe("Label Validator", () => {
    describe("Mutex Groups", () => {
      it("should reject multiple OpenSpec labels from same phase", () => {
        const result = labelValidator.validateLabels([
          "openspec:specification-pending",
          "openspec:specification-in-progress",
        ]);
        expect(result.valid).toBe(false);
        expect(result.conflicts.length).toBeGreaterThan(0);
      });

      it("should reject multiple status labels", () => {
        const result = labelValidator.validateLabels([
          "status:in-progress",
          "status:ready",
        ]);
        expect(result.valid).toBe(false);
      });

      it("should allow single labels from different groups", () => {
        const result = labelValidator.validateLabels([
          "openspec:specification-pending",
          "status:needs-planning",
          "priority:important",
        ]);
        expect(result.valid).toBe(true);
      });
    });

    describe("Label Extraction", () => {
      it("should extract OpenSpec label", () => {
        const labels = [
          "openspec:specification-in-progress",
          "status:in-progress",
          "type:bug",
        ];
        expect(labelValidator.getOpenSpecLabel(labels)).toBe(
          "openspec:specification-in-progress",
        );
      });

      it("should return null if no OpenSpec label", () => {
        const labels = ["status:in-progress", "type:bug"];
        expect(labelValidator.getOpenSpecLabel(labels)).toBeNull();
      });

      it("should extract type label", () => {
        const labels = [
          "openspec:specification-pending",
          "type:feature",
          "priority:important",
        ];
        expect(labelValidator.getTypeLabel(labels)).toBe("type:feature");
      });

      it("should extract status labels", () => {
        const labels = [
          "status:in-progress",
          "status:needs-review",
          "type:bug",
        ];
        const statusLabels = labelValidator.getStatusLabels(labels);
        expect(statusLabels).toHaveLength(2);
        expect(statusLabels).toContain("status:in-progress");
      });
    });

    describe("Transition Validation", () => {
      it("should validate valid label transition", () => {
        const current = ["openspec:specification-pending", "type:feature"];
        const next = ["openspec:specification-in-progress", "type:feature"];
        const result = labelValidator.validateTransition(current, next);
        expect(result.valid).toBe(true);
      });

      it("should reject invalid OpenSpec transition", () => {
        const current = ["openspec:specification-pending", "type:feature"];
        const next = ["openspec:implementation-in-progress", "type:feature"];
        const result = labelValidator.validateTransition(current, next);
        expect(result.valid).toBe(false);
        expect(
          result.conflicts.some((c) => c.includes("Invalid OpenSpec")),
        ).toBe(true);
      });

      it("should track added and removed labels", () => {
        const current = [
          "openspec:specification-pending",
          "status:needs-planning",
        ];
        const next = [
          "openspec:specification-in-progress",
          "status:in-progress",
        ];
        const result = labelValidator.validateTransition(current, next);
        expect(result.added).toContain("openspec:specification-in-progress");
        expect(result.removed).toContain("openspec:specification-pending");
      });
    });
  });

  describe("Audit Logger", () => {
    describe("Audit Entry Creation", () => {
      it("should create audit entry with timestamp", () => {
        const entry = auditLogger.createAuditEntry({
          type: auditLogger.EVENT_TYPES.PHASE_ADVANCED,
          issueNumber: 123,
          actor: "github-actions",
        });
        expect(entry.timestamp).toBeDefined();
        expect(entry.type).toBe(auditLogger.EVENT_TYPES.PHASE_ADVANCED);
        expect(entry.issueNumber).toBe(123);
      });

      it("should include label changes in details", () => {
        const entry = auditLogger.createAuditEntry({
          type: auditLogger.EVENT_TYPES.LABEL_ADDED,
          issueNumber: 456,
          added: ["openspec:specification-in-progress"],
          removed: ["openspec:specification-pending"],
        });
        expect(entry.details.added).toContain(
          "openspec:specification-in-progress",
        );
        expect(entry.details.removed).toContain(
          "openspec:specification-pending",
        );
      });
    });

    describe("Audit Summary", () => {
      it("should generate summary with event counts", () => {
        const entries = [
          auditLogger.createAuditEntry({
            type: auditLogger.EVENT_TYPES.PHASE_ADVANCED,
            issueNumber: 1,
          }),
          auditLogger.createAuditEntry({
            type: auditLogger.EVENT_TYPES.PHASE_ADVANCED,
            issueNumber: 2,
          }),
          auditLogger.createAuditEntry({
            type: auditLogger.EVENT_TYPES.LABEL_ADDED,
            issueNumber: 3,
          }),
        ];

        const summary = auditLogger.generateAuditSummary(entries);
        expect(summary.totalEvents).toBe(3);
        expect(summary.byType[auditLogger.EVENT_TYPES.PHASE_ADVANCED]).toBe(2);
        expect(summary.byType[auditLogger.EVENT_TYPES.LABEL_ADDED]).toBe(1);
      });

      it("should track label changes in summary", () => {
        const entries = [
          auditLogger.createAuditEntry({
            type: auditLogger.EVENT_TYPES.LABEL_ADDED,
            added: ["openspec:specification-in-progress"],
          }),
          auditLogger.createAuditEntry({
            type: auditLogger.EVENT_TYPES.LABEL_ADDED,
            added: ["openspec:specification-in-progress"],
          }),
        ];

        const summary = auditLogger.generateAuditSummary(entries);
        expect(
          summary.labelChanges.added["openspec:specification-in-progress"],
        ).toBe(2);
      });
    });

    describe("Audit Filtering", () => {
      it("should filter by type", () => {
        const entries = [
          auditLogger.createAuditEntry({
            type: auditLogger.EVENT_TYPES.PHASE_ADVANCED,
            issueNumber: 1,
          }),
          auditLogger.createAuditEntry({
            type: auditLogger.EVENT_TYPES.LABEL_ADDED,
            issueNumber: 2,
          }),
        ];

        const filtered = auditLogger.filterAuditLog(entries, {
          type: auditLogger.EVENT_TYPES.PHASE_ADVANCED,
        });
        expect(filtered).toHaveLength(1);
        expect(filtered[0].type).toBe(auditLogger.EVENT_TYPES.PHASE_ADVANCED);
      });

      it("should filter by issue number", () => {
        const entries = [
          auditLogger.createAuditEntry({ issueNumber: 123 }),
          auditLogger.createAuditEntry({ issueNumber: 456 }),
        ];

        const filtered = auditLogger.filterAuditLog(entries, {
          issueNumber: 123,
        });
        expect(filtered).toHaveLength(1);
        expect(filtered[0].issueNumber).toBe(123);
      });
    });
  });

  describe("Integration: Full Phase Progression", () => {
    it("should validate complete specification → implementation workflow", () => {
      // Start in pending
      const startLabels = [
        "openspec:specification-pending",
        "type:feature",
        "status:needs-planning",
      ];

      // Advance to in-progress
      const inProgressLabels = [
        "openspec:specification-in-progress",
        "type:feature",
        "status:in-progress",
        "meta:has-pr",
      ];

      const step1 = labelValidator.validateTransition(
        startLabels,
        inProgressLabels,
      );
      expect(step1.valid).toBe(true);

      // Advance to complete
      const completeLabels = [
        "openspec:specification-complete",
        "type:feature",
        "status:ready",
      ];

      const step2 = labelValidator.validateTransition(
        inProgressLabels,
        completeLabels,
      );
      expect(step2.valid).toBe(true);

      // Move to implementation pending
      const implPendingLabels = [
        "openspec:implementation-pending",
        "type:feature",
        "status:needs-planning",
      ];

      const step3 = labelValidator.validateTransition(
        completeLabels,
        implPendingLabels,
      );
      expect(step3.valid).toBe(true);
    });
  });

  describe("Event Scenarios", () => {
    it("scenario: new feature issue created with type label only", () => {
      const labels = ["type:feature"];
      const validation = labelValidator.validateLabels(labels);
      expect(validation.valid).toBe(true);
      expect(validation.suggestions.length).toBe(0);
    });

    it("scenario: user adds openspec:specification-pending to new issue", () => {
      const current = ["type:feature"];
      const next = [
        "type:feature",
        "openspec:specification-pending",
        "status:needs-planning",
      ];
      const result = labelValidator.validateTransition(current, next);
      expect(result.valid).toBe(true);
      expect(result.added).toContain("openspec:specification-pending");
    });

    it("scenario: PR opened, trigger automatic phase advance", () => {
      const current = [
        "openspec:specification-pending",
        "type:feature",
        "status:needs-planning",
      ];
      const next = [
        "openspec:specification-in-progress",
        "type:feature",
        "status:in-progress",
        "meta:has-pr",
      ];
      const result = labelValidator.validateTransition(current, next);
      expect(result.valid).toBe(true);
    });

    it("scenario: user attempts conflicting label combination", () => {
      const labels = [
        "openspec:specification-pending",
        "openspec:implementation-in-progress",
      ];
      const result = labelValidator.validateLabels(labels);
      expect(result.valid).toBe(false);
    });
  });
});
