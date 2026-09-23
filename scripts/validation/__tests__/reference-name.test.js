/**
 * Tests for scripts/validation/lib/reference-name.js (#3460).
 */

import { describe, it, expect } from '@jest/globals';
import { referenceName, replaceReferenceName } from '../lib/reference-name.js';

describe('referenceName', () => {
  it.each([
    ['issue-agent', 'issue-agent'],
    ['agents/issue-agent', 'issue-agent'],
    ['./agents/issue-agent/', 'issue-agent'],
    ['agents/issue-agent/run.sh', 'issue-agent'],
    ['agents/issue-agent/index.js', 'issue-agent'],
    ['agents/pr-agent/skills/submit-pr', 'submit-pr'],
    ['agents/pr-agent/skills/submit-pr/run.sh', 'submit-pr'],
    ['skills/foo.js', 'foo'],
    ['./skills/foo.mjs/', 'foo'],
    ['lib/other/thing.js', 'thing'],
  ])('%s -> %s', (value, expected) => {
    expect(referenceName(value)).toBe(expected);
  });
});

describe('replaceReferenceName', () => {
  it.each([
    ['issue-agent', 'issue-triage-agent', 'issue-triage-agent'],
    ['agents/issue-agent', 'issue-triage-agent', 'agents/issue-triage-agent'],
    ['agents/issue-agent/run.sh', 'triage', 'agents/triage/run.sh'],
    ['agents/issue-agent/', 'triage', 'agents/triage/'],
    ['agents/issue-agent/run.test.js', 'triage', 'agents/triage/run.test.js'],
    ['agents/pr-agent/skills/submit-pr', 'open-pr', 'agents/pr-agent/skills/open-pr'],
    ['skills/js/js.js', 'bar', 'skills/js/bar.js'],
    ['agents/js/skills/js/js.js', 'bar', 'agents/js/skills/js/bar.js'],
    ['./skills/foo.js', 'bar', './skills/bar.js'],
  ])('%s with %s -> %s', (value, name, expected) => {
    expect(replaceReferenceName(value, name)).toBe(expected);
  });
});
