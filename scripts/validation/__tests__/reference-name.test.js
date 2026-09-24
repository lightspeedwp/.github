/**
 * Tests for scripts/validation/lib/reference-name.js (#3460).
 */

import { describe, it, expect } from '@jest/globals';
import { parseReference, referenceName, replaceReferenceName } from '../lib/reference-name.js';

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
    // The name segment is replaced, not a later occurrence of the same text.
    ['skills/js/js.js', 'bar', 'skills/bar/js.js'],
    ['agents/js/skills/js/js.js', 'bar', 'agents/js/skills/bar/js.js'],
    ['agents/foo/foo.js', 'bar', 'agents/bar/foo.js'],
    ['./skills/foo.js', 'bar', './skills/bar.js'],
    ['./skills/foo.mjs/', 'bar', './skills/bar.mjs/'],
    ['lib/other/thing.js', 'item', 'lib/other/item.js'],
  ])('%s with %s -> %s', (value, name, expected) => {
    const result = replaceReferenceName(value, name);
    expect(result).toBe(expected);
    // Invariant: the replacement is what referenceName() now reads.
    expect(referenceName(result)).toBe(name);
  });
});

describe('parseReference', () => {
  it.each([
    ['agents/issue-agent/run.sh', 'agents', 'issue-agent'],
    ['agents/pr-agent/skills/submit-pr', 'skills', 'submit-pr'],
    ['./skills/foo.js', 'skills', 'foo'],
    ['lib/other/thing.js', null, 'thing'],
  ])('%s -> %s container, %s', (value, container, name) => {
    expect(parseReference(value)).toMatchObject({ container, name });
  });
});
