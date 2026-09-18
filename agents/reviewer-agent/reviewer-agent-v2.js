const { FeedbackProcessor } = require("./feedback-processor");
const { DecisionEngine } = require("./decision-engine");
const { CommentGenerator } = require("./comment-generator");
const { ConfigurationSystem } = require("./configuration-system");

class ReviewerAgentV2 {
  constructor(options = {}) {
    this.options = {
      baseDir: options.baseDir || process.cwd(),
      verbose: options.verbose || false,
      ...options,
    };

    this.configSystem = new ConfigurationSystem(this.options.baseDir);
    this.feedbackProcessor = new FeedbackProcessor();
    this.decisionEngine = null;
    this.commentGenerator = new CommentGenerator(options.commentOptions);
    this.config = null;
  }

  async process(toolResults, options = {}) {
    try {
      this.log("Starting Reviewer Agent v2 review process");

      const repoType =
        options.repoType ||
        this.configSystem.detectRepoType(this.options.baseDir);
      const overridePath =
        options.overridePath ||
        this.configSystem.getOverrideConfigPath(this.options.baseDir);

      this.config = this.configSystem.loadConfiguration(repoType, overridePath);
      this.validateConfig();

      this.log(`Detected repo type: ${repoType}`);
      this.log(
        `Loaded configuration with ${this.config.excludedFiles.length} excluded files`,
      );

      const { findings: normalizedFindings, errors: processingErrors } =
        this.feedbackProcessor.process(toolResults);
      this.log(
        `Processed findings: ${normalizedFindings.length} normalized, ${processingErrors.length} errors`,
      );

      if (processingErrors.length > 0) {
        processingErrors.forEach((err) =>
          this.log(`Warning: ${err.tool} - ${err.error}`, "warn"),
        );
      }

      this.decisionEngine = new DecisionEngine(this.config);
      const decisions = this.decisionEngine.process(normalizedFindings);

      this.log(
        `Decisions made: ${decisions.auto_resolved.length} resolved, ${decisions.suppressed.length} suppressed, ${decisions.requires_review.length} require review`,
      );

      const comment = this.commentGenerator.generate(decisions);
      const inlineComments = this.commentGenerator.generateInlineComments(
        decisions.requires_review,
      );
      const stats =
        this.commentGenerator.generateSummaryStats(normalizedFindings);

      this.log("Review process completed successfully");

      return {
        success: true,
        decisions,
        comment,
        inlineComments,
        stats,
        config: this.config,
        metadata: {
          repoType,
          totalFindings: normalizedFindings.length,
          processingErrors: processingErrors.length,
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      this.log(`Error during review process: ${error.message}`, "error");
      return {
        success: false,
        error: error.message,
        metadata: {
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  validateConfig() {
    const errors = this.configSystem.validateConfiguration(this.config);

    if (errors.length > 0) {
      const errorMessage = `Configuration validation failed:\n${errors.join("\n")}`;
      throw new Error(errorMessage);
    }

    this.log("Configuration validated successfully");
  }

  async postCommentToPR(context, comment) {
    if (!context || !context.github || !context.payload) {
      throw new Error("Invalid GitHub context provided");
    }

    const { github, payload } = context;
    const prNumber = payload.pull_request?.number;

    if (!prNumber) {
      throw new Error("Unable to determine PR number from context");
    }

    this.log(`Posting comment to PR #${prNumber}`);

    try {
      const response = await github.rest.issues.createComment({
        owner: payload.repository.owner.login,
        repo: payload.repository.name,
        issue_number: prNumber,
        body: comment,
      });

      this.log(`Comment posted successfully (ID: ${response.data.id})`);
      return response.data;
    } catch (error) {
      this.log(`Failed to post comment: ${error.message}`, "error");
      throw error;
    }
  }

  async postInlineComments(context, inlineComments) {
    if (!context || !context.github || !context.payload) {
      throw new Error("Invalid GitHub context provided");
    }

    const { github, payload } = context;
    const prNumber = payload.pull_request?.number;
    const commitSha = payload.pull_request?.head?.sha;

    if (!prNumber || !commitSha) {
      throw new Error(
        "Unable to determine PR number or commit SHA from context",
      );
    }

    this.log(
      `Posting ${inlineComments.length} inline comments to PR #${prNumber}`,
    );

    const results = [];

    for (const inlineComment of inlineComments) {
      try {
        const response = await github.rest.pulls.createReviewComment({
          owner: payload.repository.owner.login,
          repo: payload.repository.name,
          pull_number: prNumber,
          commit_id: commitSha,
          path: inlineComment.path,
          line: inlineComment.line,
          body: inlineComment.body,
        });

        results.push({ success: true, id: response.data.id });
      } catch (error) {
        this.log(
          `Failed to post inline comment on ${inlineComment.path}:${inlineComment.line}: ${error.message}`,
          "warn",
        );
        results.push({ success: false, error: error.message });
      }
    }

    this.log(
      `Posted ${results.filter((r) => r.success).length}/${inlineComments.length} inline comments`,
    );
    return results;
  }

  reset() {
    this.feedbackProcessor.reset();
    if (this.decisionEngine) {
      this.decisionEngine.reset();
    }
    this.commentGenerator.reset();
    this.configSystem.clearCache();
    this.config = null;
  }

  log(message, level = "info") {
    if (!this.options.verbose && level !== "error") {
      return;
    }

    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
    console.log(`${prefix} ${message}`);
  }
}

module.exports = {
  ReviewerAgentV2,
};
