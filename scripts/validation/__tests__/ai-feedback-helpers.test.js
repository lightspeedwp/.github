const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const {
  checkInvalidStatuses,
  validateAIFeedback,
  validateFeedbackResponseFile,
} = require('../ai-feedback-helpers.cjs');

const VALID_FEEDBACK = [
  '# AI Feedback Response',
  '',
  '## Feedback',
  '',
  '| Feedback | Status |',
  '|---|---|',
  '| Quote the variable | ✅ Addressed |',
  '',
  'All feedback addressed.',
].join('\n');

describe('validateAIFeedback', () => {
  test('fails when the PR body links no issue', async () => {
    const result = await validateAIFeedback('o', 'r', 1, 'No link here', {
      feedbackContent: null,
    });

    expect(result.passed).toBe(false);
    expect(result.issues.missingIssueLink).toBe(true);
  });

  test('passes with an issue link and no feedback file (missing file is a warning)', async () => {
    const result = await validateAIFeedback('o', 'r', 1, 'Closes #12', {
      feedbackContent: null,
    });

    expect(result.passed).toBe(true);
    expect(result.issues.missingFeedbackResponse).toBe(true);
  });

  test('validates supplied feedback content instead of the working directory', async () => {
    const result = await validateAIFeedback('o', 'r', 1, 'Resolves #12', {
      feedbackContent: VALID_FEEDBACK,
    });

    expect(result.passed).toBe(true);
    expect(result.issues.missingFeedbackResponse).toBe(false);
    expect(result.issues.incompleteFeedbackTracking).toEqual([]);
  });

  test('fails on supplied feedback content with structural errors', async () => {
    const result = await validateAIFeedback('o', 'r', 1, 'Resolves #12', {
      feedbackContent: 'just text',
    });

    expect(result.passed).toBe(false);
    expect(result.issues.incompleteFeedbackTracking.length).toBeGreaterThan(0);
  });

  test('ignores a FEEDBACK_RESPONSE.md on disk when content is supplied', async () => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'ai-feedback-'));
    const previous = process.cwd();
    fs.writeFileSync(path.join(directory, 'FEEDBACK_RESPONSE.md'), 'broken');

    try {
      process.chdir(directory);
      const result = await validateAIFeedback('o', 'r', 1, 'Closes #1', {
        feedbackContent: null,
      });

      expect(result.issues.missingFeedbackResponse).toBe(true);
      expect(result.passed).toBe(true);
    } finally {
      process.chdir(previous);
      fs.rmSync(directory, { force: true, recursive: true });
    }
  });

  test('reads FEEDBACK_RESPONSE.md from the working directory when no content is supplied', async () => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'ai-feedback-'));
    const previous = process.cwd();
    fs.writeFileSync(path.join(directory, 'FEEDBACK_RESPONSE.md'), VALID_FEEDBACK);

    try {
      process.chdir(directory);
      const result = await validateAIFeedback('o', 'r', 1, 'Closes #1');

      expect(result.issues.missingFeedbackResponse).toBe(false);
      expect(result.passed).toBe(true);
    } finally {
      process.chdir(previous);
      fs.rmSync(directory, { force: true, recursive: true });
    }
  });
});

describe('validateFeedbackResponseFile', () => {
  test('accepts a well-formed file', () => {
    expect(validateFeedbackResponseFile(VALID_FEEDBACK).valid).toBe(true);
  });

  test('reports a missing header', () => {
    const result = validateFeedbackResponseFile('## Feedback\n✅ Addressed');

    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Missing "# AI Feedback Response" header');
  });
});

describe('checkInvalidStatuses', () => {
  test.each(['| x | ✅ todo |', '| x | 📋 pending |', '| x | ❌ pending |'])(
    'flags a non-standard status after any marker: %s',
    (line) => {
      expect(checkInvalidStatuses(line)).toHaveLength(1);
    }
  );

  test('accepts the standard statuses, including the 📋 marker', () => {
    expect(checkInvalidStatuses('📋 Deferred\n✅ Addressed\n❌ Rejected')).toEqual([]);
  });
});
