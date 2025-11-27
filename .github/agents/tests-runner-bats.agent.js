/**
 * Bats Tests Runner Agent for LightSpeed WP
 * Validates and monitors Bats shell script tests across the repository.
 *
 * @file .github/agents/tests-runner-bats.agent.js
 */

const path = require("path");

/**
 * Configuration for the Bats test runner agent
 */
const config = {
  coverageThreshold: 80,
  dryRun: process.env.DRY_RUN === "true",
  verbose: process.env.VERBOSE === "true",
};

/**
 * Test patterns for Bats test files
 */
const TEST_PATTERNS = {
  batsFile: /\.bats$/,
  testFunction: /@test\s+['"](.+)['"]\s*{/g,
  loadHelper: /load\s+['"]?test-helper['"]?/,
  setup: /setup\s*\(\)/,
  teardown: /teardown\s*\(\)/,
};

/**
 * Required test categories by script type
 */
const REQUIRED_TEST_CATEGORIES = {
  deployment: [
    "basic_functionality",
    "error_handling",
    "dry_run",
    "safety_checks",
  ],
  setup: ["basic_functionality", "parameter_validation", "error_handling"],
  api: ["api_integration", "data_validation", "error_handling"],
  general: ["basic_functionality", "error_handling"],
};

/**
 * Logging helper
 * @param {string} message - Message to log
 * @param {string} level - Log level (info, error, warning)
 */
function log(message, level = "info") {
  if (level === "error") {
    console.error(message);
  } else if (level === "warning") {
    console.warn(message);
  } else if (config.verbose || !message.startsWith("[DRY RUN]")) {
    console.log(message);
  }
}

/**
 * Determine the type of script based on filename
 * @param {string} filename - Script filename
 * @returns {string} Script type
 */
function determineScriptType(filename) {
  if (filename.includes("deploy")) {
    return "deployment";
  }
  if (filename.includes("setup") || filename.includes("install")) {
    return "setup";
  }
  if (filename.includes("api") || filename.includes("github")) {
    return "api";
  }
  return "general";
}

/**
 * Check if test file contains tests for a specific category
 * @param {string} testContent - Content of the test file
 * @param {string} category - Test category to check
 * @returns {boolean} Whether the category is present
 */
function checkTestCategory(testContent, category) {
  const categoryPatterns = {
    basic_functionality: /test.*basic|test.*function|test.*execute/i,
    error_handling: /test.*error|test.*fail|test.*invalid/i,
    dry_run: /test.*dry.?run/i,
    parameter_validation: /test.*param|test.*arg|test.*option/i,
    safety_checks: /test.*safe|test.*backup|test.*protect/i,
    api_integration: /test.*api|test.*github|test.*http/i,
    data_validation: /test.*data|test.*valid|test.*format/i,
    integration: /test.*integrat|test.*end.?to.?end/i,
  };

  const pattern = categoryPatterns[category];
  return pattern ? pattern.test(testContent) : false;
}

/**
 * Analyze test file for a specific script
 * @param {object} octokit - GitHub API client
 * @param {object} context - GitHub context
 * @param {object} scriptFile - Script file info
 * @param {string} testFile - Test file path
 * @param {object} report - Report object to update
 */
async function analyzeTestFileForScript(
  octokit,
  context,
  scriptFile,
  testFile,
  report,
) {
  try {
    const { data: testContent } = await octokit.repos.getContent({
      owner: context.repo.owner,
      repo: context.repo.repo,
      path: testFile,
    });

    const testFileContent = Buffer.from(testContent.content, "base64").toString(
      "utf8",
    );
    const scriptType = determineScriptType(scriptFile.filename);
    const requiredCategories =
      REQUIRED_TEST_CATEGORIES[scriptType] ||
      REQUIRED_TEST_CATEGORIES.general ||
      [];

    const missingCategories = [];
    for (const category of requiredCategories) {
      const hasCategory = checkTestCategory(testFileContent, category);
      if (!hasCategory) {
        missingCategories.push(category);
      }
    }

    if (missingCategories.length > 0) {
      report.missingTestCategories.push({
        script: scriptFile.filename,
        testFile: testFile,
        missing: missingCategories,
        scriptType: scriptType,
      });
    }
  } catch (error) {
    log(`Error analyzing test file ${testFile}: ${error.message}`, "error");
  }
}

/**
 * Analyze test coverage for a script file
 * @param {object} octokit - GitHub API client
 * @param {object} context - GitHub context
 * @param {object} scriptFile - Script file info
 * @param {object} report - Report object to update
 */
async function analyzeScriptTestCoverage(octokit, context, scriptFile, report) {
  const scriptName = path.basename(scriptFile.filename, ".sh");
  const expectedTestFile = `tests/test-${scriptName}.bats`;

  try {
    await octokit.repos.getContent({
      owner: context.repo.owner,
      repo: context.repo.repo,
      path: expectedTestFile,
    });
    report.scriptsCovered++;
    await analyzeTestFileForScript(
      octokit,
      context,
      scriptFile,
      expectedTestFile,
      report,
    );
  } catch {
    report.scriptsUncovered.push({
      script: scriptFile.filename,
      expectedTest: expectedTestFile,
      scriptType: determineScriptType(scriptFile.filename),
    });
  }
}

/**
 * Analyze quality of test files
 * @param {object} octokit - GitHub API client
 * @param {object} context - GitHub context
 * @param {object} testFile - Test file info
 * @param {object} report - Report object to update
 */
async function analyzeTestFileQuality(octokit, context, testFile, report) {
  try {
    const { data: content } = await octokit.repos.getContent({
      owner: context.repo.owner,
      repo: context.repo.repo,
      path: testFile.filename,
    });

    const testContent = Buffer.from(content.content, "base64").toString("utf8");
    const lines = testContent.split("\n");
    const qualityIssues = [];

    const hasSetup = TEST_PATTERNS.setup.test(testContent);
    const hasTeardown = TEST_PATTERNS.teardown.test(testContent);
    const testFunctions = lines
      .filter((l) => l.trim().startsWith("@test"))
      .map((l) => l.trim());

    if (!hasSetup && testFunctions.length > 5) {
      qualityIssues.push({
        type: "missing_setup",
        message: "Consider adding setup() function for test initialization",
      });
    }

    if (
      !hasTeardown &&
      testContent.includes("cleanup") &&
      testFunctions.length > 5
    ) {
      qualityIssues.push({
        type: "missing_teardown",
        message: "Consider adding teardown() function for test cleanup",
      });
    }

    if (
      !TEST_PATTERNS.loadHelper.test(testContent) &&
      !testContent.includes("source ")
    ) {
      qualityIssues.push({
        type: "no_test_helper",
        message: "Consider using test-helper.bash for common test utilities",
      });
    }

    if (qualityIssues.length > 0) {
      report.testQualityIssues.push({
        file: testFile.filename,
        issues: qualityIssues,
        testCount: testFunctions.length,
      });
    }
  } catch (error) {
    log(
      `Error analyzing test quality for ${testFile.filename}: ${error.message}`,
      "error",
    );
  }
}

/**
 * Analyze a test runner script
 * @param {string} filename - Runner filename
 * @param {string} content - Runner content
 * @param {object} report - Report object to update
 */
function analyzeRunnerScript(filename, content, report) {
  const issues = [];

  if (!content.includes("set -e")) {
    issues.push({
      type: "missing_error_handling",
      message: 'Test runner should include "set -e" for proper error handling',
    });
  }

  if (!content.includes("bats")) {
    issues.push({
      type: "no_bats_execution",
      message: "Test runner should execute bats test files",
    });
  }

  if (!content.includes("find") && !content.includes("*.bats")) {
    issues.push({
      type: "static_test_list",
      message:
        "Consider dynamic test discovery instead of hardcoded test files",
    });
  }

  if (
    content.includes("bats") &&
    !content.includes("-j") &&
    !content.includes("--jobs")
  ) {
    issues.push({
      type: "no_parallel_execution",
      message: "Consider adding parallel test execution with bats -j option",
    });
  }

  if (issues.length > 0) {
    report.runnerIssues.push({
      file: filename,
      issues: issues,
    });
  }
}

/**
 * Analyze test runner scripts
 * @param {object} octokit - GitHub API client
 * @param {object} context - GitHub context
 * @param {object} report - Report object to update
 */
async function analyzeTestRunners(octokit, context, report) {
  const runnerFiles = [
    "tests/run-tests.sh",
    "tests/run-all-tests.sh",
    "scripts/testing/run-tests.sh",
  ];

  for (const runnerFile of runnerFiles) {
    try {
      const { data: content } = await octokit.repos.getContent({
        owner: context.repo.owner,
        repo: context.repo.repo,
        path: runnerFile,
      });

      const runnerContent = Buffer.from(content.content, "base64").toString(
        "utf8",
      );
      analyzeRunnerScript(runnerFile, runnerContent, report);
    } catch {
      if (runnerFile === "tests/run-tests.sh") {
        report.runnerIssues.push({
          type: "missing_main_runner",
          message: "Missing main test runner script: tests/run-tests.sh",
          suggestion: "Create a main test runner for CI/CD integration",
        });
      }
    }
  }
}

/**
 * Generate comprehensive testing report
 * @param {object} octokit - GitHub API client
 * @param {object} context - GitHub context
 * @param {object} report - Report data
 */
async function generateTestingReport(octokit, context, report) {
  if (!context.payload.pull_request && context.eventName !== "push") {
    return;
  }

  const totalScripts = report.scriptsCovered + report.scriptsUncovered.length;
  report.overallCoverage =
    totalScripts > 0
      ? Math.round((report.scriptsCovered / totalScripts) * 100)
      : 100;

  const coverageEmoji =
    report.overallCoverage >= config.coverageThreshold ? "✅" : "⚠️";
  const qualityEmoji = report.testQualityIssues.length === 0 ? "✅" : "⚠️";
  const runnerEmoji = report.runnerIssues.length === 0 ? "✅" : "⚠️";

  let reportContent = `## 🧪 Bats Test Coverage Report

${coverageEmoji} **Test Coverage: ${report.overallCoverage}%** (${report.scriptsCovered}/${totalScripts} scripts)
${qualityEmoji} **Test Quality:** ${report.testQualityIssues.length} issues found
${runnerEmoji} **Test Runners:** ${report.runnerIssues.length} issues found

### Coverage Details:`;

  if (report.scriptsUncovered.length > 0) {
    reportContent += `\n\n#### ⚠️ Scripts Missing Tests:`;
    for (const uncovered of report.scriptsUncovered) {
      const requiredCategories =
        REQUIRED_TEST_CATEGORIES[uncovered.scriptType] || [];
      reportContent += `\n- **${uncovered.script}** → \`${uncovered.expectedTest}\``;
      if (requiredCategories.length > 0) {
        reportContent += `\n  - Required test categories: ${requiredCategories.join(", ")}`;
      }
    }
  }

  if (report.missingTestCategories.length > 0) {
    reportContent += `\n\n#### 📝 Missing Test Categories:`;
    for (const missing of report.missingTestCategories) {
      reportContent += `\n- **${missing.testFile}**: Missing ${missing.missing.join(", ")} tests`;
    }
  }

  if (report.testQualityIssues.length > 0) {
    reportContent += `\n\n#### 🔍 Test Quality Issues:`;
    for (const quality of report.testQualityIssues) {
      reportContent += `\n- **${quality.file}** (${quality.testCount} tests):`;
      for (const issue of quality.issues) {
        reportContent += `\n  - ${issue.message}`;
      }
    }
  }

  if (report.runnerIssues.length > 0) {
    reportContent += `\n\n#### 🏃‍♂️ Test Runner Issues:`;
    for (const runner of report.runnerIssues) {
      if (runner.file) {
        reportContent += `\n- **${runner.file}**:`;
        for (const issue of runner.issues) {
          reportContent += `\n  - ${issue.message}`;
        }
      } else {
        reportContent += `\n- ${runner.message}`;
        if (runner.suggestion) {
          reportContent += `\n  - ${runner.suggestion}`;
        }
      }
    }
  }

  reportContent += `\n\n### Next Steps:`;
  if (report.scriptsUncovered.length > 0) {
    reportContent += `\n1. Create Bats test files for uncovered scripts`;
  }
  if (report.missingTestCategories.length > 0) {
    reportContent += `\n2. Add missing test categories per script type requirements`;
  }
  if (report.testQualityIssues.length > 0) {
    reportContent += `\n3. Improve test quality and structure`;
  }
  if (report.runnerIssues.length > 0) {
    reportContent += `\n4. Fix test runner script issues`;
  }

  reportContent += `\n\nSee our [Bats Testing Standards](/.github/instructions/bats-tests-and-runner-scripts.md) for complete guidelines.`;

  if (context.payload.pull_request && !config.dryRun) {
    try {
      await octokit.issues.createComment({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: context.payload.pull_request.number,
        body: reportContent,
      });
      log("Posted test coverage report");
    } catch (error) {
      log(`Error posting report: ${error.message}`, "error");
    }
  } else if (config.dryRun) {
    log("[DRY RUN] Would post test coverage report");
    log(reportContent);
  }
}

module.exports = {
  analyzeScriptTestCoverage,
  analyzeTestFileForScript,
  analyzeTestFileQuality,
  analyzeTestRunners,
  analyzeRunnerScript,
  generateTestingReport,
  checkTestCategory,
  determineScriptType,
  TEST_PATTERNS,
  REQUIRED_TEST_CATEGORIES,
};
