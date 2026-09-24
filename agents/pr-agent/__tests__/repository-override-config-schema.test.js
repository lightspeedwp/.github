/**
 * @jest-environment node
 */
import { readFileSync } from 'node:fs';

import { describe, expect, it } from '@jest/globals';
import Ajv from 'ajv';

const schema = JSON.parse(
  readFileSync(
    new URL(
      '../../../.github/specs/015-pr-agent-consolidation/contracts/repository-override-config.schema.json',
      import.meta.url
    ),
    'utf8'
  )
);
const validate = new Ajv({ allErrors: true, strict: true }).compile(schema);

describe('repository override configuration schema', () => {
  it('accepts an empty configuration because every override is optional', () => {
    expect(validate({})).toBe(true);
  });

  it('accepts a complete configuration at the minimum threshold boundaries', () => {
    const config = {
      reviewBudget: {
        preferredFiles: 1,
        preferredLines: 1,
        hardFlagFiles: 1,
        hardFlagLines: 1,
        maxStackSize: 1,
      },
      approvedPrefixes: ['fix/', 'aiops2/'],
    };

    expect(validate(config)).toBe(true);
  });

  it('accepts a partial review-budget override', () => {
    expect(
      validate({
        reviewBudget: {
          preferredFiles: 10,
        },
      })
    ).toBe(true);
  });

  it.each([
    ['zero', 0],
    ['a negative integer', -1],
    ['a fractional number', 1.5],
    ['a numeric string', '10'],
  ])('rejects %s for a review-budget threshold', (_label, preferredFiles) => {
    expect(validate({ reviewBudget: { preferredFiles } })).toBe(false);
  });

  it.each([
    ['an empty list', []],
    ['a missing trailing slash', ['fix']],
    ['uppercase characters', ['Fix/']],
    ['punctuation', ['feature-flag/']],
    ['a nested path', ['fix/security/']],
    ['a non-string item', ['fix/', 7]],
  ])('rejects approved prefixes containing %s', (_label, approvedPrefixes) => {
    expect(validate({ approvedPrefixes })).toBe(false);
  });

  it.each([
    ['an unknown root field', { assignee: 'octocat' }],
    ['a dynamically resolved base branch', { baseBranch: 'develop' }],
    ['an unknown review-budget field', { reviewBudget: { warningFiles: 10 } }],
  ])('rejects %s', (_label, config) => {
    expect(validate(config)).toBe(false);
    expect(validate.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          keyword: 'additionalProperties',
        }),
      ])
    );
  });
});
