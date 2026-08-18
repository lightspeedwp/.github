const { ReviewerAgentV2 } = require('../reviewer-agent-v2');
const path = require('path');
const fs = require('fs');
const os = require('os');

describe('ReviewerAgentV2', () => {
  let agent;
  let tempDir;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-test-'));
    agent = new ReviewerAgentV2({ baseDir: tempDir, verbose: false });
  });

  afterEach(() => {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
    agent.reset();
  });

  describe('initialization', () => {
    test('should create agent with options', () => {
      expect(agent.options.baseDir).toBe(tempDir);
      expect(agent.feedbackProcessor).toBeDefined();
      expect(agent.commentGenerator).toBeDefined();
      expect(agent.configSystem).toBeDefined();
    });

    test('should initialize without config', () => {
      expect(agent.config).toBeNull();
      expect(agent.decisionEngine).toBeNull();
    });
  });

  describe('process', () => {
    test('should return success with valid tool results', async () => {
      const toolResults = {
        coderabbit: [
          {
            file: 'src/app.js',
            line: 10,
            title: 'Issue',
            severity: 'warning',
          },
        ],
      };

      const result = await agent.process(toolResults);

      expect(result.success).toBe(true);
      expect(result.decisions).toBeDefined();
      expect(result.comment).toBeDefined();
      expect(result.stats).toBeDefined();
      expect(result.metadata).toBeDefined();
    });

    test('should return error for empty tool results', async () => {
      const result = await agent.process({});

      expect(result.success).toBe(true);
      expect(result.decisions).toBeDefined();
    });

    test('should detect repo type', async () => {
      const result = await agent.process({
        coderabbit: [],
      });

      expect(result.metadata.repoType).toBeDefined();
      expect(result.metadata.repoType).toMatch(/github|wordpress/);
    });

    test('should count findings correctly', async () => {
      const toolResults = {
        coderabbit: [
          { file: 'a.js', line: 1, title: 'Issue 1', severity: 'error' },
          { file: 'b.js', line: 2, title: 'Issue 2', severity: 'warning' },
        ],
      };

      const result = await agent.process(toolResults);

      expect(result.metadata.totalFindings).toBeGreaterThanOrEqual(2);
    });

    test('should handle processing errors gracefully', async () => {
      const toolResults = {
        coderabbit: 'invalid',
      };

      const result = await agent.process(toolResults);

      expect(result.success).toBe(true);
    });

    test('should return errors for invalid results', async () => {
      const result = await agent.process(null);

      expect(result.success).toBe(true);
      expect(result.decisions).toBeDefined();
    });
  });

  describe('validateConfig', () => {
    test('should validate configuration', () => {
      agent.config = {
        excludedFiles: [],
        excludedCategories: [],
        autoResolvePatterns: [],
        escalatePatterns: [],
        suppressFalsePositives: [],
        commentOptions: {},
      };

      expect(() => agent.validateConfig()).not.toThrow();
    });

    test('should throw for invalid configuration', () => {
      agent.config = {
        excludedFiles: 'not an array',
      };

      expect(() => agent.validateConfig()).toThrow();
    });
  });

  describe('postCommentToPR', () => {
    test('should throw for missing context', async () => {
      await expect(agent.postCommentToPR(null, 'comment')).rejects.toThrow(
        'Invalid GitHub context'
      );
    });

    test('should throw for missing PR number', async () => {
      const context = {
        github: { rest: { issues: {} } },
        payload: { repository: {} },
      };

      await expect(agent.postCommentToPR(context, 'comment')).rejects.toThrow(
        'PR number'
      );
    });

    test('should post comment successfully', async () => {
      const mockGithub = {
        rest: {
          issues: {
            createComment: jest.fn().mockResolvedValue({
              data: { id: 123 },
            }),
          },
        },
      };

      const context = {
        github: mockGithub,
        payload: {
          pull_request: { number: 42 },
          repository: {
            owner: { login: 'user' },
            name: 'repo',
          },
        },
      };

      const result = await agent.postCommentToPR(context, 'Test comment');

      expect(mockGithub.rest.issues.createComment).toHaveBeenCalledWith(
        expect.objectContaining({
          issue_number: 42,
          body: 'Test comment',
        })
      );
      expect(result.id).toBe(123);
    });
  });

  describe('postInlineComments', () => {
    test('should throw for missing context', async () => {
      await expect(agent.postInlineComments(null, [])).rejects.toThrow(
        'Invalid GitHub context'
      );
    });

    test('should throw for missing PR metadata', async () => {
      const context = {
        github: { rest: { pulls: {} } },
        payload: { repository: {} },
      };

      await expect(agent.postInlineComments(context, [])).rejects.toThrow();
    });

    test('should post inline comments successfully', async () => {
      const mockGithub = {
        rest: {
          pulls: {
            createReviewComment: jest.fn().mockResolvedValue({
              data: { id: 456 },
            }),
          },
        },
      };

      const context = {
        github: mockGithub,
        payload: {
          pull_request: {
            number: 42,
            head: { sha: 'abc123' },
          },
          repository: {
            owner: { login: 'user' },
            name: 'repo',
          },
        },
      };

      const inlineComments = [
        {
          path: 'src/app.js',
          line: 10,
          body: 'Issue found',
        },
      ];

      const results = await agent.postInlineComments(context, inlineComments);

      expect(mockGithub.rest.pulls.createReviewComment).toHaveBeenCalled();
      expect(results).toHaveLength(1);
      expect(results[0].success).toBe(true);
    });

    test('should handle comment posting failures', async () => {
      const mockGithub = {
        rest: {
          pulls: {
            createReviewComment: jest.fn().mockRejectedValue(
              new Error('API error')
            ),
          },
        },
      };

      const context = {
        github: mockGithub,
        payload: {
          pull_request: {
            number: 42,
            head: { sha: 'abc123' },
          },
          repository: {
            owner: { login: 'user' },
            name: 'repo',
          },
        },
      };

      const inlineComments = [
        {
          path: 'src/app.js',
          line: 10,
          body: 'Issue',
        },
      ];

      const results = await agent.postInlineComments(context, inlineComments);

      expect(results[0].success).toBe(false);
    });
  });

  describe('reset', () => {
    test('should reset all components', async () => {
      await agent.process({ coderabbit: [] });

      agent.reset();

      expect(agent.config).toBeNull();
      expect(agent.feedbackProcessor.findings).toEqual([]);
    });
  });

  describe('logging', () => {
    test('should log only errors when not verbose', () => {
      agent.options.verbose = false;
      const logSpy = jest.spyOn(console, 'log').mockImplementation();

      agent.log('info message', 'info');
      agent.log('error message', 'error');

      expect(logSpy).toHaveBeenCalledTimes(1);
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('error message'));

      logSpy.mockRestore();
    });

    test('should log all messages when verbose', () => {
      agent.options.verbose = true;
      const logSpy = jest.spyOn(console, 'log').mockImplementation();

      agent.log('info message', 'info');
      agent.log('error message', 'error');

      expect(logSpy).toHaveBeenCalledTimes(2);

      logSpy.mockRestore();
    });
  });

  describe('integration', () => {
    test('should process findings end-to-end', async () => {
      const toolResults = {
        coderabbit: [
          {
            file: 'src/security.js',
            line: 50,
            title: 'SQL injection vulnerability',
            severity: 'error',
          },
        ],
        codeQuality: [
          {
            path: 'src/utils.js',
            line: 20,
            message: 'Unused variable',
            severity: 'warning',
          },
        ],
      };

      const result = await agent.process(toolResults);

      expect(result.success).toBe(true);
      expect(result.decisions.requires_review.length).toBeGreaterThanOrEqual(1);
      expect(result.comment).toContain('Code Review Summary');
      expect(result.inlineComments.length).toBeGreaterThanOrEqual(1);
    });

    test('should include stats in result', async () => {
      const toolResults = {
        coderabbit: [
          { file: 'a.js', line: 1, title: 'Critical issue', severity: 'error' },
          { file: 'b.js', line: 2, title: 'Major issue', severity: 'warning' },
          { file: 'c.js', line: 3, title: 'Minor issue', severity: 'note' },
        ],
      };

      const result = await agent.process(toolResults);

      expect(result.stats.total).toBeGreaterThanOrEqual(3);
      expect(result.stats.by_severity).toBeDefined();
      expect(result.stats.by_category).toBeDefined();
      expect(result.stats.by_tool).toBeDefined();
    });
  });
});
