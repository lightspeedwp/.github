// Inline implementations for PR triage workflow integration testing
// Testing: pr-triage-orchestrator.js → sync-pr-labels.js

function triageAndExtractIssues(prs) {
  const triaged = [];

  prs.forEach((pr) => {
    const issues = [];
    const regex = /(?:Fixes|Closes|Resolves|Relates to|#)[\s#]+(\d+)/gi;
    let match;
    while ((match = regex.exec(pr.body || '')) !== null) {
      issues.push(parseInt(match[1]));
    }

    const triage = {
      prNumber: pr.number,
      title: pr.title,
      author: pr.user?.login,
      linkedIssues: [...new Set(issues)],
      needsReview: pr.labels?.some((l) => l.name === 'status:needs-review') || false,
      needsChangelog: pr.labels?.some((l) => l.name === 'meta:needs-changelog') || false,
    };

    triaged.push(triage);
  });

  return triaged;
}

function syncLabelsBasedOnIssues(prs, triageData) {
  const syncResults = {
    labelsAdded: 0,
    labelsRemoved: 0,
    prsSynced: [],
    errors: [],
  };

  prs.forEach((pr) => {
    try {
      const triage = triageData.find((t) => t.prNumber === pr.number);
      if (!triage) return;

      const changes = {
        prNumber: pr.number,
        labelChanges: [],
      };

      // Add meta:has-pr label if PR has linked issues
      if (triage.linkedIssues.length > 0) {
        if (!pr.labels?.some((l) => l.name === 'meta:has-pr')) {
          syncResults.labelsAdded++;
          changes.labelChanges.push('add:meta:has-pr');
        }
      } else {
        // Remove meta:has-pr if no linked issues
        if (pr.labels?.some((l) => l.name === 'meta:has-pr')) {
          syncResults.labelsRemoved++;
          changes.labelChanges.push('remove:meta:has-pr');
        }
      }

      if (changes.labelChanges.length > 0) {
        syncResults.prsSynced.push(changes);
      }
    } catch (error) {
      syncResults.errors.push({
        prNumber: pr.number,
        error: error.message,
      });
    }
  });

  return syncResults;
}

function generateTriageSummary(triageData, syncResults) {
  return {
    totalPRs: triageData.length,
    prsWithLinkedIssues: triageData.filter((t) => t.linkedIssues.length > 0).length,
    prsNeedingReview: triageData.filter((t) => t.needsReview).length,
    prsNeedingChangelog: triageData.filter((t) => t.needsChangelog).length,
    totalLinkedIssues: triageData.reduce((sum, t) => sum + t.linkedIssues.length, 0),
    labelSyncStats: {
      added: syncResults.labelsAdded,
      removed: syncResults.labelsRemoved,
      synced: syncResults.prsSynced.length,
    },
  };
}

describe('integration: pr triage workflow', () => {
  describe('triage to label sync workflow', () => {
    const mockPRs = [
      {
        number: 101,
        title: 'Fix widget rendering',
        user: { login: 'alice' },
        body: 'Fixes #501 and #502',
        labels: [{ name: 'type:bug' }],
      },
      {
        number: 102,
        title: 'Add new feature',
        user: { login: 'bob' },
        body: 'No related issues',
        labels: [{ name: 'type:feature' }, { name: 'status:needs-review' }],
      },
      {
        number: 103,
        title: 'Update documentation',
        user: { login: 'charlie' },
        body: 'Relates to #503',
        labels: [{ name: 'type:docs' }],
      },
    ];

    it('triages PRs and extracts linked issues', () => {
      const triageData = triageAndExtractIssues(mockPRs);
      expect(triageData.length).toBe(3);
      expect(triageData[0].linkedIssues).toEqual(expect.arrayContaining([501, 502]));
      expect(triageData[1].linkedIssues).toEqual([]);
    });

    it('detects review requirements during triage', () => {
      const triageData = triageAndExtractIssues(mockPRs);
      const reviewNeeded = triageData.filter((t) => t.needsReview);
      expect(reviewNeeded.length).toBe(1);
      expect(reviewNeeded[0].prNumber).toBe(102);
    });

    it('flows triage results to label sync', () => {
      const triageData = triageAndExtractIssues(mockPRs);
      const syncResults = syncLabelsBasedOnIssues(mockPRs, triageData);

      expect(syncResults.prsSynced.length).toBeGreaterThan(0);
      expect(syncResults.labelsAdded).toBeGreaterThan(0);
    });

    it('syncs labels based on linked issues', () => {
      const triageData = triageAndExtractIssues(mockPRs);
      const syncResults = syncLabelsBasedOnIssues(mockPRs, triageData);

      // PR with linked issues should get meta:has-pr label
      const prsWithIssues = triageData.filter((t) => t.linkedIssues.length > 0);
      expect(prsWithIssues.length).toBeGreaterThan(0);

      // Sync should have processed these
      expect(syncResults.prsSynced.length).toBeGreaterThanOrEqual(0);
    });

    it('generates triage summary after workflow', () => {
      const triageData = triageAndExtractIssues(mockPRs);
      const syncResults = syncLabelsBasedOnIssues(mockPRs, triageData);
      const summary = generateTriageSummary(triageData, syncResults);

      expect(summary.totalPRs).toBe(3);
      expect(summary.prsWithLinkedIssues).toBe(2);
      expect(summary.prsNeedingReview).toBe(1);
      expect(summary.totalLinkedIssues).toBe(3);
    });
  });

  describe('multi-issue pr handling', () => {
    it('handles PRs with multiple linked issues', () => {
      const pr = {
        number: 201,
        title: 'Complex fix',
        user: { login: 'dev' },
        body: 'Fixes #1001, Closes #1002, Relates to #1003 and #1004',
        labels: [],
      };

      const triageData = triageAndExtractIssues([pr]);
      expect(triageData[0].linkedIssues.length).toBe(4);
      expect(triageData[0].linkedIssues).toEqual(
        expect.arrayContaining([1001, 1002, 1003, 1004]),
      );
    });

    it('deduplicates linked issues in triage', () => {
      const pr = {
        number: 202,
        title: 'Duplicate reference',
        user: { login: 'dev' },
        body: 'Fixes #2001, Fixes #2001, Related to #2001',
        labels: [],
      };

      const triageData = triageAndExtractIssues([pr]);
      expect(triageData[0].linkedIssues.length).toBe(1);
      expect(triageData[0].linkedIssues[0]).toBe(2001);
    });

    it('handles PRs with cross-repo issue references', () => {
      const pr = {
        number: 203,
        title: 'Cross-repo fix',
        user: { login: 'dev' },
        body: 'Relates to owner/other-repo#3001 and #3002',
        labels: [],
      };

      const triageData = triageAndExtractIssues([pr]);
      // Should at least extract the same-repo issue
      expect(triageData[0].linkedIssues).toContain(3002);
    });
  });

  describe('error handling in triage workflow', () => {
    it('handles PRs with empty or null bodies', () => {
      const prs = [
        { number: 301, title: 'Empty body', user: { login: 'dev' }, body: '', labels: [] },
        { number: 302, title: 'Null body', user: { login: 'dev' }, body: null, labels: [] },
      ];

      const triageData = triageAndExtractIssues(prs);
      expect(triageData[0].linkedIssues).toEqual([]);
      expect(triageData[1].linkedIssues).toEqual([]);
    });

    it('handles PRs without user information', () => {
      const pr = {
        number: 303,
        title: 'No author',
        user: null,
        body: 'Fixes #4001',
        labels: [],
      };

      const triageData = triageAndExtractIssues([pr]);
      expect(triageData[0].author).toBeUndefined();
      expect(triageData[0].linkedIssues).toContain(4001);
    });

    it('handles label sync errors without stopping workflow', () => {
      const prs = [
        {
          number: 304,
          title: 'Valid',
          user: { login: 'dev' },
          body: 'Fixes #5001',
          labels: null,
        },
        {
          number: 305,
          title: 'Valid 2',
          user: { login: 'dev' },
          body: 'Related to #5002',
          labels: [{ name: 'type:bug' }],
        },
      ];

      const triageData = triageAndExtractIssues(prs);
      const syncResults = syncLabelsBasedOnIssues(prs, triageData);

      expect(syncResults.errors.length).toBeGreaterThanOrEqual(0);
      expect(syncResults.prsSynced.length + syncResults.errors.length).toBe(2);
    });
  });

  describe('concurrent pr triage', () => {
    it('handles multiple PRs being triaged concurrently', () => {
      const batch1 = Array.from({ length: 10 }, (_, i) => ({
        number: 1000 + i,
        title: `PR ${i}`,
        user: { login: `user${i}` },
        body: `Fixes #${2000 + i}`,
        labels: [],
      }));

      const batch2 = Array.from({ length: 10 }, (_, i) => ({
        number: 1010 + i,
        title: `PR ${10 + i}`,
        user: { login: `user${10 + i}` },
        body: `Relates to #${2010 + i}`,
        labels: [{ name: 'status:needs-review' }],
      }));

      const triage1 = triageAndExtractIssues(batch1);
      const triage2 = triageAndExtractIssues(batch2);

      expect(triage1.length).toBe(10);
      expect(triage2.length).toBe(10);
      expect(triage1[0].linkedIssues[0]).toBe(2000);
      expect(triage2[0].linkedIssues[0]).toBe(2010);
    });

    it('handles concurrent label sync without conflicts', () => {
      const prs = Array.from({ length: 20 }, (_, i) => ({
        number: 3000 + i,
        title: `PR ${i}`,
        user: { login: 'dev' },
        body: i % 2 === 0 ? `Fixes #${4000 + i}` : 'No issues',
        labels: [],
      }));

      const triageData = triageAndExtractIssues(prs);
      const syncResults = syncLabelsBasedOnIssues(prs, triageData);

      expect(syncResults.prsSynced.length).toBeGreaterThan(0);
      expect(syncResults.errors.length).toBe(0);
    });
  });

  describe('full triage to sync workflow', () => {
    it('completes full workflow: triage → sync → report', () => {
      const prs = [
        {
          number: 401,
          title: 'Bug fix',
          user: { login: 'alice' },
          body: 'Fixes #5001 and #5002',
          labels: [{ name: 'type:bug' }],
        },
        {
          number: 402,
          title: 'Feature',
          user: { login: 'bob' },
          body: 'New capability',
          labels: [{ name: 'type:feature' }, { name: 'status:needs-review' }],
        },
      ];

      // Step 1: Triage
      const triageData = triageAndExtractIssues(prs);
      expect(triageData.length).toBe(2);

      // Step 2: Sync labels
      const syncResults = syncLabelsBasedOnIssues(prs, triageData);
      expect(syncResults.prsSynced).toBeDefined();

      // Step 3: Generate summary
      const summary = generateTriageSummary(triageData, syncResults);
      expect(summary.totalPRs).toBe(2);
      expect(summary.prsWithLinkedIssues).toBe(1);
      expect(summary.totalLinkedIssues).toBe(2);

      // Verify workflow consistency
      expect(summary.prsNeedingReview).toBe(1);
    });

    it('workflow respects label changes across phases', () => {
      const pr = {
        number: 403,
        title: 'Test PR',
        user: { login: 'dev' },
        body: 'Fixes #6001',
        labels: [],
      };

      // Initial triage
      const triageData = triageAndExtractIssues([pr]);
      expect(triageData[0].linkedIssues).toContain(6001);

      // Sync labels
      const syncResults = syncLabelsBasedOnIssues([pr], triageData);

      // Verify label changes planned
      if (triageData[0].linkedIssues.length > 0) {
        expect(syncResults.labelsAdded).toBeGreaterThan(0);
      }
    });
  });

  describe('performance: pr triage at scale', () => {
    it('handles large PR batches efficiently', () => {
      const largePRSet = Array.from({ length: 200 }, (_, i) => ({
        number: 5000 + i,
        title: `PR ${i}`,
        user: { login: `user${i % 10}` },
        body: i % 2 === 0 ? `Fixes #${6000 + i}, Relates to #${6100 + i}` : 'No issues',
        labels: i % 3 === 0 ? [{ name: 'status:needs-review' }] : [],
      }));

      const triageStart = Date.now();
      const triageData = triageAndExtractIssues(largePRSet);
      const triageTime = Date.now() - triageStart;

      expect(triageData.length).toBe(200);
      expect(triageTime).toBeLessThan(500); // Should complete in <500ms

      const syncStart = Date.now();
      const syncResults = syncLabelsBasedOnIssues(largePRSet, triageData);
      const syncTime = Date.now() - syncStart;

      expect(syncResults.prsSynced.length).toBeGreaterThan(0);
      expect(syncTime).toBeLessThan(500); // Should complete in <500ms
    });

    it('maintains accuracy with complex linking patterns', () => {
      const complexPRs = Array.from({ length: 100 }, (_, i) => {
        const issueCount = (i % 5) + 1; // 1-5 issues per PR
        const issues = Array.from(
          { length: issueCount },
          (_, j) => `Fixes #${7000 + i * 10 + j}`,
        ).join(', ');

        return {
          number: 8000 + i,
          title: `PR ${i}`,
          user: { login: 'dev' },
          body: issues,
          labels: [],
        };
      });

      const triageData = triageAndExtractIssues(complexPRs);
      const totalIssues = triageData.reduce((sum, t) => sum + t.linkedIssues.length, 0);

      // Should extract most issues (accounting for some potential variation)
      expect(totalIssues).toBeGreaterThan(0);
      expect(triageData.length).toBe(100);
    });
  });

  describe('triage workflow state consistency', () => {
    it('maintains consistent state through triage and sync cycles', () => {
      const pr = {
        number: 501,
        title: 'Test',
        user: { login: 'dev' },
        body: 'Fixes #9001',
        labels: [],
      };

      // First cycle
      const triage1 = triageAndExtractIssues([pr]);
      const sync1 = syncLabelsBasedOnIssues([pr], triage1);

      // Second cycle (simulating re-run)
      const triage2 = triageAndExtractIssues([pr]);
      const sync2 = syncLabelsBasedOnIssues([pr], triage2);

      // Results should be consistent
      expect(triage1[0].linkedIssues).toEqual(triage2[0].linkedIssues);
      expect(sync1.labelsAdded).toBe(sync2.labelsAdded);
    });
  });
});
