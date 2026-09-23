/**
 * Integration Tests for Reference Detection and Fixing (T028)
 * Phase 3: Broken Reference Remediation
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import ReferenceDetector from '../lib/reference-detector.js';
import BrokenRefsFinder from '../lib/broken-refs-finder.js';
import FixSuggester from '../lib/fix-suggester.js';
import AutoFixer from '../lib/auto-fixer.js';

describe('Phase 3: Broken Reference Detection & Remediation', () => {
  let detector;
  let finder;
  let suggester;
  let fixer;

  beforeEach(() => {
    detector = new ReferenceDetector();
    finder = new BrokenRefsFinder();
    suggester = new FixSuggester();
    fixer = new AutoFixer({ dryRun: true });
  });

  describe('Reference Detector', () => {
    it('should detect JavaScript imports', () => {
      const content = "const agent = require('agents/my-agent')";
      const refs = detector.detectJSImports(content);
      expect(refs).toHaveLength(1);
      expect(refs[0].value).toBe('agents/my-agent');
      expect(refs[0].type).toBe('js-import');
    });

    it('should detect ES module imports', () => {
      const content = "import Agent from 'agents/my-agent'";
      const refs = detector.detectJSImports(content);
      expect(refs).toHaveLength(1);
      expect(refs[0].value).toBe('agents/my-agent');
    });

    it.each([
      ["import { run } from 'agents/my-agent'", 'agents/my-agent'],
      ["import Agent, { run } from 'agents/my-agent'", 'agents/my-agent'],
      ["import * as Agent from 'agents/my-agent'", 'agents/my-agent'],
      ["import 'agents/my-agent'", 'agents/my-agent'],
    ])('should detect the import form %s', (content, value) => {
      const refs = detector.detectJSImports(content);
      expect(refs.map((r) => r.value)).toEqual([value]);
    });

    it('should not treat a dynamic import() as a static import twice', () => {
      const refs = detector.detectJSImports("await import('agents/my-agent')");
      expect(refs).toHaveLength(1);
    });

    it('should detect shell paths', () => {
      const content = 'bash agents/my-agent/run.sh';
      const refs = detector.detectShellPaths(content);
      expect(refs).toHaveLength(1);
      expect(refs[0].value).toContain('agents/my-agent');
    });

    it('should detect workflow uses references', () => {
      const content = 'uses: lightspeedwp/.github/agents/my-agent@main';
      const refs = detector.detectWorkflowUses(content);
      expect(refs).toHaveLength(1);
      expect(refs[0].value).toBe('my-agent');
    });

    it('should detect workflow run commands', () => {
      const content = 'run: npm run agent:my-agent';
      const refs = detector.detectWorkflowRuns(content);
      expect(refs).toHaveLength(1);
      expect(refs[0].value).toBe('agent:my-agent');
    });
  });

  describe('Broken Reference Finder', () => {
    beforeEach(() => {
      finder.buildAgentIndex(['agent-one', 'agent-two', 'new-agent']);
      finder.buildSkillIndex(['skill-one', 'skill-two']);
    });

    it('should identify broken references', () => {
      const refs = {
        jsImports: [{ value: 'agents/old-agent', type: 'js-import' }],
      };
      const results = finder.analyzeReferences(refs, { path: 'test.js' });
      expect(results[0].isBroken).toBe(true);
      expect(results[0].severity).toBe('CRITICAL');
    });

    it('should verify valid references', () => {
      const refs = {
        jsImports: [{ value: 'agents/agent-one', type: 'js-import' }],
      };
      const results = finder.analyzeReferences(refs, { path: 'test.js' });
      expect(results[0].isBroken).toBe(false);
      expect(results[0].severity).toBe('OK');
    });

    it('should use the injected index, not the real agents/ directory', () => {
      const results = finder.analyzeReferences(
        { jsImports: [{ value: 'agents/pr-agent', type: 'js-import' }] },
        { path: 'test.js' }
      );
      // pr-agent exists on disk but not in the injected index.
      expect(results[0].isBroken).toBe(true);
    });

    it('should set correct severity levels', () => {
      const criticalRef = {
        jsImports: [{ value: 'agents/missing', type: 'js-import' }],
      };
      const results = finder.analyzeReferences(criticalRef, { path: 'test.js' });
      expect(results[0].severity).toBe('CRITICAL');
    });
  });

  describe('Fix Suggester', () => {
    beforeEach(() => {
      suggester.buildIndex(['agent-one', 'agent-two', 'new-agent'], 'agent');
      suggester.buildIndex(['skill-one', 'skill-two'], 'skill');
    });

    it('should suggest fixes with high confidence', () => {
      const suggestion = suggester.suggestFix('agent-on', 'js-import', 'agent');
      expect(suggestion.suggestion).toBe('agent-one');
      expect(suggestion.confidence).toBe('high');
    });

    it('should suggest multiple candidates', () => {
      const suggestion = suggester.suggestFix('agent-onx', 'js-import', 'agent');
      expect(suggestion.suggestion).toBe('agent-one');
      expect(suggestion.alternativeCandidates.map((c) => c.suggestion)).toContain('agent-two');
    });

    it('should return the same shape when nothing matches', () => {
      const suggestion = suggester.suggestFix('agent', 'js-import', 'agent');
      expect(suggestion.alternativeCandidates).toEqual([]);
      expect(suggestion.replacement).toBeNull();
    });

    it('should match on the name, not the path', () => {
      const suggestion = suggester.suggestFix('agents/agent-on', 'js-import', 'agent');
      expect(suggestion.suggestion).toBe('agent-one');
      expect(suggestion.replacement).toBe('agents/agent-one');
    });

    it('should handle no matches gracefully', () => {
      const suggestion = suggester.suggestFix('xyz123', 'js-import', 'agent');
      expect(suggestion.suggestion).toBeNull();
      expect(suggestion.reason).toContain('No similar');
    });
  });

  describe('Auto-Fixer', () => {
    it('should fix JavaScript imports', () => {
      const content = "const agent = require('agents/old-agent')";
      const result = fixer.fixJSImports(content, 'agents/old-agent', 'agents/new-agent');
      expect(result.changed).toBe(true);
      expect(result.content).toContain('agents/new-agent');
      expect(result.content).not.toContain('agents/old-agent');
    });

    it('should fix shell paths', () => {
      const content = 'bash agents/old-agent/run.sh';
      const result = fixer.fixShellPaths(content, 'agents/old-agent', 'agents/new-agent');
      expect(result.changed).toBe(true);
      expect(result.content).toContain('agents/new-agent');
    });

    it('should fix workflow references', () => {
      const content = 'uses: lightspeedwp/.github/agents/old@main';
      const result = fixer.fixWorkflowReferences(content, 'old', 'new');
      expect(result.changed).toBe(true);
      expect(result.content).toContain('agents/new');
    });

    it('should handle multiple fixes in one file', () => {
      const content = `
        const a = require('agents/old')
        const b = require('agents/old')
      `;
      const result = fixer.fixJSImports(content, 'agents/old', 'agents/new');
      expect(result.content.split('agents/new').length - 1).toBe(2);
    });
  });

  describe('End-to-End Integration', () => {
    beforeEach(() => {
      suggester.buildIndex(['issue-agent', 'pr-agent', 'release-agent'], 'agent');
    });

    it('should detect, suggest, and apply fixes', () => {
      // 1. Detect
      const jsContent = "require('agents/issue-agent')";
      const detected = detector.detectJSImports(jsContent);
      expect(detected).toHaveLength(1);

      // 2. Suggest
      const suggestion = suggester.suggestFix(detected[0].value, 'js-import', 'agent');
      expect(suggestion.suggestion).toBe('issue-agent');

      // 3. Apply: the replacement keeps the agents/ path (#3460)
      expect(suggestion.replacement).toBe('agents/issue-agent');
      const fixed = fixer.fixJSImports(jsContent, detected[0].value, suggestion.replacement);
      expect(fixed.changed).toBe(false); // Already correct
    });

    it('should handle rename scenario correctly', () => {
      // Scenario: issue-agent was renamed to issue-triage-agent. Uses its
      // own FixSuggester instance rather than the shared `suggester` from
      // the outer beforeEach: that beforeEach seeds 'issue-agent' into the
      // index for every test in this describe block (needed by the
      // preceding test), and buildIndex()/addToIndex() only ever add
      // entries, never clear them. Reusing `suggester` here would leave
      // the old 'issue-agent' name in the index alongside the new
      // 'issue-triage-agent' one, and the whole point of this test is
      // that the old name is gone -- suggestFix() would then fuzzy-match
      // the leaked old name (closer to the broken reference) instead of
      // exercising the rename path this test is meant to cover.
      const renameSuggester = new FixSuggester();
      renameSuggester.buildIndex(['issue-triage-agent', 'pr-agent', 'release-agent'], 'agent');

      // 1. Old reference
      const oldRef = "require('agents/issue-agent')";

      // 2. Detect
      const detected = detector.detectJSImports(oldRef);
      expect(detected[0].value).toBe('agents/issue-agent');

      // 3. Suggest fix
      const suggestion = renameSuggester.suggestFix('agents/issue-agent', 'js-import', 'agent');
      expect(suggestion.suggestion).toBe('issue-triage-agent');

      // 4. Apply fix
      expect(suggestion.replacement).toBe('agents/issue-triage-agent');
      const fixed = fixer.fixJSImports(oldRef, 'agents/issue-agent', suggestion.replacement);
      expect(fixed.content).toContain('issue-triage-agent');
      expect(fixed.content).not.toContain('issue-agent');
    });
  });
});
