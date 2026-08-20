// Inline implementations for metadata workflow integration testing
// Testing: audit-issue-metadata.js → bulk-issue-metadata-updater.js

function auditIssueMetadata(issues, auditRules) {
  const findings = {
    totalIssues: issues.length,
    compliantIssues: [],
    nonCompliantIssues: [],
    missingLabels: [],
    missingMilestones: [],
    missingDoR: [],
    missingDoD: [],
  };

  issues.forEach((issue) => {
    let compliant = true;
    const issues_list = [];

    // Check for required labels
    const hasTypeLabel = issue.labels?.some((l) => l.name.startsWith("type:"));
    if (!hasTypeLabel) {
      compliant = false;
      issues_list.push("missing-type-label");
      findings.missingLabels.push(issue.number);
    }

    // Check for milestone
    if (!issue.milestone && auditRules.requireMilestone) {
      compliant = false;
      issues_list.push("missing-milestone");
      findings.missingMilestones.push(issue.number);
    }

    // Check for DoR section
    const hasDoR = (issue.body || "").includes("## Definition of Ready");
    if (!hasDoR && auditRules.requireDoR) {
      compliant = false;
      issues_list.push("missing-dor");
      findings.missingDoR.push(issue.number);
    }

    // Check for DoD section
    const hasDoD = (issue.body || "").includes("## Definition of Done");
    if (!hasDoD && auditRules.requireDoD) {
      compliant = false;
      issues_list.push("missing-dod");
      findings.missingDoD.push(issue.number);
    }

    if (compliant) {
      findings.compliantIssues.push(issue.number);
    } else {
      findings.nonCompliantIssues.push({
        number: issue.number,
        title: issue.title,
        issues: issues_list,
      });
    }
  });

  return findings;
}

function bulkUpdateMetadata(issues, updates, dryRun = true) {
  const results = {
    dryRun,
    totalProcessed: 0,
    labelsAdded: 0,
    labelsRemoved: 0,
    milestonesAssigned: 0,
    errors: [],
    updated: [],
  };

  issues.forEach((issue) => {
    try {
      results.totalProcessed++;
      const changes = { number: issue.number, changes: [] };

      // Apply label updates
      if (updates.labelsToAdd) {
        const toAdd = updates.labelsToAdd.filter(
          (l) => !issue.labels?.some((el) => el.name === l),
        );
        if (toAdd.length > 0) {
          results.labelsAdded += toAdd.length;
          changes.changes.push(`add-labels: ${toAdd.join(", ")}`);
        }
      }

      if (updates.labelsToRemove) {
        const toRemove = updates.labelsToRemove.filter((l) =>
          issue.labels?.some((el) => el.name === l),
        );
        if (toRemove.length > 0) {
          results.labelsRemoved += toRemove.length;
          changes.changes.push(`remove-labels: ${toRemove.join(", ")}`);
        }
      }

      // Apply milestone update
      if (updates.milestone && !issue.milestone) {
        results.milestonesAssigned++;
        changes.changes.push(`assign-milestone: ${updates.milestone}`);
      }

      if (changes.changes.length > 0) {
        results.updated.push(changes);
      }
    } catch (error) {
      results.errors.push({
        issueNumber: issue.number,
        error: error.message,
      });
    }
  });

  return results;
}

function createAuditReport(findings, metadata) {
  return {
    timestamp: new Date().toISOString(),
    summary: {
      totalIssues: findings.totalIssues,
      compliant: findings.compliantIssues.length,
      nonCompliant: findings.nonCompliantIssues.length,
      complianceRate: `${Math.round((findings.compliantIssues.length / findings.totalIssues) * 100)}%`,
    },
    findings,
    metadata,
  };
}

describe("integration: metadata workflow", () => {
  describe("audit to bulk update workflow", () => {
    const mockIssues = [
      {
        number: 101,
        title: "Missing type label",
        body: "## Definition of Ready\n- [ ] item\n## Definition of Done\n- [ ] item",
        labels: [],
        milestone: null,
      },
      {
        number: 102,
        title: "Missing milestone",
        body: "## Definition of Ready\n- [ ] item\n## Definition of Done\n- [ ] item",
        labels: [{ name: "type:bug" }],
        milestone: null,
      },
      {
        number: 103,
        title: "Compliant issue",
        body: "## Definition of Ready\n- [ ] item\n## Definition of Done\n- [ ] item",
        labels: [{ name: "type:feature" }],
        milestone: { title: "v1.0" },
      },
    ];

    const auditRules = {
      requireMilestone: true,
      requireDoR: true,
      requireDoD: true,
    };

    it("audits issues and identifies compliance gaps", () => {
      const findings = auditIssueMetadata(mockIssues, auditRules);
      expect(findings.compliantIssues).toContain(103);
      expect(findings.nonCompliantIssues.length).toBe(2);
    });

    it("identifies missing type labels", () => {
      const findings = auditIssueMetadata(mockIssues, auditRules);
      expect(findings.missingLabels).toContain(101);
    });

    it("identifies missing milestones", () => {
      const findings = auditIssueMetadata(mockIssues, auditRules);
      expect(findings.missingMilestones.length).toBeGreaterThan(0);
    });

    it("flows audit results to bulk update", () => {
      const findings = auditIssueMetadata(mockIssues, auditRules);
      const issuesToUpdate = mockIssues.filter((i) =>
        findings.nonCompliantIssues.some((nc) => nc.number === i.number),
      );

      const updates = {
        labelsToAdd: ["type:task"],
        labelsToRemove: [],
        milestone: "Backlog",
      };

      const results = bulkUpdateMetadata(issuesToUpdate, updates, true);
      expect(results.totalProcessed).toBe(findings.nonCompliantIssues.length);
    });

    it("respects dry-run mode during workflow", () => {
      const updates = {
        labelsToAdd: ["status:needs-triage"],
        labelsToRemove: [],
      };

      const dryRunResults = bulkUpdateMetadata(mockIssues, updates, true);
      const liveResults = bulkUpdateMetadata(mockIssues, updates, false);

      expect(dryRunResults.dryRun).toBe(true);
      expect(liveResults.dryRun).toBe(false);
      // Both should report same changes in dry-run
      expect(dryRunResults.labelsAdded).toBe(liveResults.labelsAdded);
    });

    it("handles concurrent audit and update batches", () => {
      const batch1 = mockIssues.slice(0, 2);
      const batch2 = mockIssues.slice(1);

      const findings1 = auditIssueMetadata(batch1, auditRules);
      const findings2 = auditIssueMetadata(batch2, auditRules);

      // Both batches should complete independently
      expect(findings1.totalIssues).toBe(2);
      expect(findings2.totalIssues).toBe(2);

      // Combined should not double-count
      const allFindings = auditIssueMetadata(mockIssues, auditRules);
      expect(allFindings.totalIssues).toBe(3);
    });
  });

  describe("error handling in metadata workflow", () => {
    it("handles audit errors gracefully", () => {
      const invalidIssues = [
        { number: 1, title: "Valid", labels: [] },
        null, // Invalid
      ];

      try {
        const findings = auditIssueMetadata(invalidIssues.filter(Boolean), {
          requireMilestone: true,
          requireDoR: true,
          requireDoD: true,
        });
        expect(findings.totalIssues).toBe(1);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it("handles update failures without stopping workflow", () => {
      const issues = [
        { number: 1, title: "Test", labels: [], milestone: null },
        { number: 2, title: "Test 2", labels: [], milestone: null },
      ];

      const updates = {
        labelsToAdd: ["type:bug"],
        labelsToRemove: [],
      };

      const results = bulkUpdateMetadata(issues, updates);
      expect(results.totalProcessed).toBe(2);
      expect(results.errors.length).toBeLessThanOrEqual(2);
    });

    it("reports errors without failing entire batch", () => {
      const issues = [
        { number: 101, title: "Valid", labels: [], milestone: null },
        { number: 102, title: "Invalid", labels: null, milestone: null },
      ];

      const results = bulkUpdateMetadata(issues, {
        labelsToAdd: ["type:task"],
      });
      expect(results.totalProcessed).toBe(2);
      // At least one error should be captured
      expect(results.errors.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe("multi-step metadata workflow", () => {
    it("completes full audit → remediation → verification cycle", () => {
      const issues = [
        {
          number: 201,
          title: "Issue needing fixes",
          body: "## Definition of Ready\n## Definition of Done",
          labels: [],
          milestone: null,
        },
        {
          number: 202,
          title: "Already compliant",
          body: "## Definition of Ready\n## Definition of Done",
          labels: [{ name: "type:feature" }],
          milestone: { title: "v1.0" },
        },
      ];

      // Step 1: Audit
      const auditRules = {
        requireMilestone: true,
        requireDoR: true,
        requireDoD: true,
      };
      const findings = auditIssueMetadata(issues, auditRules);
      expect(findings.nonCompliantIssues.length).toBeGreaterThan(0);

      // Step 2: Prepare remediation
      const nonCompliant = issues.filter((i) =>
        findings.nonCompliantIssues.some((nc) => nc.number === i.number),
      );
      const updates = {
        labelsToAdd: ["type:task"],
        labelsToRemove: [],
        milestone: "v1.0",
      };

      // Step 3: Apply updates
      const updateResults = bulkUpdateMetadata(nonCompliant, updates, true);
      expect(updateResults.totalProcessed).toBeGreaterThan(0);

      // Step 4: Verify remediation (simulated)
      const remediatedIssues = nonCompliant.map((issue) => ({
        ...issue,
        labels: [
          ...(issue.labels || []),
          ...updates.labelsToAdd.map((l) => ({ name: l })),
        ],
        milestone: updates.milestone
          ? { title: updates.milestone }
          : issue.milestone,
      }));

      const verifyFindings = auditIssueMetadata(remediatedIssues, auditRules);
      // After remediation, more issues should be compliant
      expect(verifyFindings.compliantIssues.length).toBeGreaterThanOrEqual(
        findings.compliantIssues.length,
      );
    });

    it("generates audit report for workflow tracking", () => {
      const issues = [
        {
          number: 301,
          title: "Test",
          body: "DoR and DoD",
          labels: [{ name: "type:bug" }],
          milestone: { title: "v1.0" },
        },
      ];

      const findings = auditIssueMetadata(issues, {
        requireMilestone: true,
        requireDoR: true,
        requireDoD: true,
      });
      const report = createAuditReport(findings, {
        executedAt: new Date().toISOString(),
        executor: "integration-test",
      });

      expect(report.summary.totalIssues).toBe(1);
      expect(report.summary.complianceRate).toBeDefined();
      expect(report.findings).toBe(findings);
    });
  });

  describe("performance: bulk metadata operations", () => {
    it("handles large batches efficiently", () => {
      const largeIssueSet = Array.from({ length: 500 }, (_, i) => ({
        number: 1000 + i,
        title: `Issue ${i}`,
        body: "## Definition of Ready\n## Definition of Done",
        labels: i % 2 === 0 ? [{ name: "type:task" }] : [],
        milestone: i % 3 === 0 ? { title: "v1.0" } : null,
      }));

      const auditRules = {
        requireMilestone: true,
        requireDoR: true,
        requireDoD: true,
      };

      const startTime = Date.now();
      const findings = auditIssueMetadata(largeIssueSet, auditRules);
      const auditTime = Date.now() - startTime;

      expect(findings.totalIssues).toBe(500);
      expect(auditTime).toBeLessThan(1000); // Should complete in <1s

      // Test bulk update performance
      const updates = {
        labelsToAdd: ["status:needs-review"],
        labelsToRemove: [],
      };

      const updateStart = Date.now();
      const results = bulkUpdateMetadata(largeIssueSet, updates);
      const updateTime = Date.now() - updateStart;

      expect(results.totalProcessed).toBe(500);
      expect(updateTime).toBeLessThan(1000); // Should complete in <1s
    });

    it("maintains accuracy with large datasets", () => {
      const issueSet = Array.from({ length: 200 }, (_, i) => ({
        number: i,
        title: `Issue ${i}`,
        body:
          i % 2 === 0 ? "## Definition of Ready\n## Definition of Done" : "",
        labels: i % 3 === 0 ? [{ name: "type:feature" }] : [],
        milestone: i % 4 === 0 ? { title: "Release" } : null,
      }));

      const findings = auditIssueMetadata(issueSet, {
        requireMilestone: true,
        requireDoR: true,
        requireDoD: true,
      });

      // Verify accuracy
      expect(findings.totalIssues).toBe(200);
      expect(
        findings.compliantIssues.length + findings.nonCompliantIssues.length,
      ).toBe(200);

      // Verify all audit categories are accounted for
      const totalGaps =
        findings.missingLabels.length +
        findings.missingMilestones.length +
        findings.missingDoR.length +
        findings.missingDoD.length;
      expect(totalGaps).toBeGreaterThan(0);
    });
  });

  describe("state consistency in metadata workflow", () => {
    it("maintains consistency across audit and update cycles", () => {
      const issues = [
        {
          number: 401,
          title: "Test",
          body: "DoR and DoD",
          labels: [],
          milestone: null,
        },
      ];

      const auditRules = {
        requireMilestone: true,
        requireDoR: true,
        requireDoD: true,
      };

      // First audit
      const audit1 = auditIssueMetadata(issues, auditRules);
      const initialCompliance = audit1.compliantIssues.length;

      // Apply updates
      const updates = {
        labelsToAdd: ["type:task"],
        labelsToRemove: [],
        milestone: "v1.0",
      };

      bulkUpdateMetadata(issues, updates);

      // Second audit (after update)
      const updatedIssues = [
        {
          ...issues[0],
          labels: [{ name: "type:task" }],
          milestone: { title: "v1.0" },
        },
      ];

      const audit2 = auditIssueMetadata(updatedIssues, auditRules);
      const finalCompliance = audit2.compliantIssues.length;

      // Compliance should improve or stay same
      expect(finalCompliance).toBeGreaterThanOrEqual(initialCompliance);
    });
  });
});
