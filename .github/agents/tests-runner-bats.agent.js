// Bats Tests Runner Agent for LightSpeed WP
// This file was fully rewritten on 2025-10-23 to remove hidden/corrupt characters.

// ...existing code up to the end...


/**
 * Generate comprehensive testing report
 */
async function generateTestingReport(octokit, context, report) {
    if (!context.payload.pull_request && context.eventName !== 'push') {
        return;
    }

    // Calculate overall coverage
    const totalScripts = report.scriptsCovered + report.scriptsUncovered.length;
    report.overallCoverage =
        totalScripts > 0
            ? Math.round((report.scriptsCovered / totalScripts) * 100)
            : 100;

    const coverageEmoji =
        report.overallCoverage >= config.coverageThreshold ? '✅' : '⚠️';
    const qualityEmoji = report.testQualityIssues.length === 0 ? '✅' : '⚠️';
    const runnerEmoji = report.runnerIssues.length === 0 ? '✅' : '⚠️';

    let reportContent = `## 🧪 Bats Test Coverage Report

${coverageEmoji} **Test Coverage: ${report.overallCoverage}%** (${report.scriptsCovered}/${totalScripts} scripts)
${qualityEmoji} **Test Quality:** ${report.testQualityIssues.length} issues found
${runnerEmoji} **Test Runners:** ${report.runnerIssues.length} issues found

### Coverage Details:`;

    // Uncovered scripts
    if (report.scriptsUncovered.length > 0) {
        reportContent += `\n\n#### ⚠️ Scripts Missing Tests:`;
        for (const uncovered of report.scriptsUncovered) {
            const requiredCategories =
                REQUIRED_TEST_CATEGORIES[uncovered.scriptType] || [];
            reportContent += `\n- **${uncovered.script}** → \`${uncovered.expectedTest}\``;
            if (requiredCategories.length > 0) {
                reportContent += `\n  - Required test categories: ${requiredCategories.join(', ')}`;
            }
        }
    }

    // Missing test categories
    if (report.missingTestCategories.length > 0) {
        reportContent += `\n\n#### 📝 Missing Test Categories:`;
        for (const missing of report.missingTestCategories) {
            reportContent += `\n- **${missing.testFile}**: Missing ${missing.missing.join(', ')} tests`;
        }
    }

    // Test quality issues
    if (report.testQualityIssues.length > 0) {
        reportContent += `\n\n#### 🔍 Test Quality Issues:`;
        for (const quality of report.testQualityIssues) {
            reportContent += `\n- **${quality.file}** (${quality.testCount} tests):`;
            for (const issue of quality.issues) {
                reportContent += `\n  - ${issue.message}`;
            }
        }
    }

    // Test runner issues
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

    // Next steps
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

    // Post report
    if (context.payload.pull_request && !config.dryRun) {
        try {
            await octokit.issues.createComment({
                owner: context.repo.owner,
                repo: context.repo.repo,
                issue_number: context.payload.pull_request.number,
                body: reportContent,
            });
            log('Posted test coverage report');
        } catch (error) {
            log(`Error posting report: ${error.message}`, 'error');
        }
    } else if (config.dryRun) {
        log('[DRY RUN] Would post test coverage report');
        log(reportContent);
    }
}



/**
 * Analyze test coverage for a script file
 */
async function analyzeScriptTestCoverage(octokit, context, scriptFile, report) {
    const scriptName = path.basename(scriptFile.filename, '.sh');
    const expectedTestFile = `tests/test-${scriptName}.bats`;

    // Check if corresponding test file exists

    try {
        await octokit.repos.getContent({
            owner: context.repo.owner,
            repo: context.repo.repo,
            path: expectedTestFile,
        });
        // Test file exists, analyze its quality
        report.scriptsCovered++;
        await analyzeTestFileForScript(
            octokit,
            context,
            scriptFile,
            expectedTestFile,
            report
        );
    } catch {
        // Test file doesn't exist
        report.scriptsUncovered.push({
            script: scriptFile.filename
        });
    }

    // Get tests directory
    try {
        const { data: testsContent } = await octokit.repos.getContent({
            owner: context.repo.owner,
            repo: context.repo.repo,
            path: 'tests',
        });

        for (const item of testsContent) {
            if (item.type === 'file' && item.name.endsWith('.bats')) {
                files.push({ filename: item.path, status: 'existing' });
            }
        }
    } catch {
        log('Tests directory not found or inaccessible', 'warning');
    }

    return files;
}

/**
 * Analyze test coverage for a script file
 */
async function analyzeScriptTestCoverage(octokit, context, scriptFile, report) {

/**
 * Analyze test file for a specific script
 */
async function analyzeTestFileForScript(
    octokit,
    context,
    scriptFile,
    testFile,
    report
) {
    const { data: testContent } = await octokit.repos.getContent({
        owner: context.repo.owner,
        repo: context.repo.repo,
        path: testFile,
    });

    const testFileContent = Buffer.from(testContent.content, 'base64').toString(
        'utf8'
    );
    const scriptType = determineScriptType(scriptFile.filename);
    const requiredCategories =
        REQUIRED_TEST_CATEGORIES[scriptType] ||
        REQUIRED_TEST_CATEGORIES.general ||
        [];

    // Check for required test categories
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
}

/**
 * Check if test file contains tests for a specific category
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
 * Analyze quality of test files
 */
async function analyzeTestFileQuality(octokit, context, testFile, report) {
    const { data: content } = await octokit.repos.getContent({
        owner: context.repo.owner,
        repo: context.repo.repo,
        path: testFile.filename,
    });

    const testContent = Buffer.from(content.content, 'base64').toString('utf8');
    const lines = testContent.split('\n');

    const qualityIssues = [];

    // Example: check for setup/teardown and test-helper usage
    const hasSetup = /setup\s*\(\)/.test(testContent);
    const hasTeardown = /teardown\s*\(\)/.test(testContent);
    const testFunctions = lines.filter(l => l.trim().startsWith('@test')).map(l => l.trim());

    if (!hasSetup && testFunctions.length > 5) {
        qualityIssues.push({
            type: 'missing_setup',
            message: 'Consider adding setup() function for test initialization',
        });
    }

    if (
        !hasTeardown &&
        testContent.includes('cleanup') &&
        testFunctions.length > 5
    ) {
        qualityIssues.push({
            type: 'missing_teardown',
            message: 'Consider adding teardown() function for test cleanup',
        });
    }

    // Check for test helper usage
    if (
        !testContent.includes('load test-helper') &&
        !testContent.includes('source ')
    ) {
        qualityIssues.push({
            type: 'no_test_helper',
            message:
                'Consider using test-helper.bash for common test utilities',
        });
    }

    if (qualityIssues.length > 0) {
        report.testQualityIssues.push({
            file: testFile.filename,
            issues: qualityIssues,
            testCount: testFunctions.length,
        });
    }
}

/**
 * Analyze test runner scripts
 */
async function analyzeTestRunners(octokit, context, report) {
    const runnerFiles = [
        'tests/run-tests.sh',
        'tests/run-all-tests.sh',
        'scripts/testing/run-tests.sh',
    ];

    for (const runnerFile of runnerFiles) {
        try {
            const { data: content } = await octokit.repos.getContent({
                owner: context.repo.owner,
                repo: context.repo.repo,
                path: runnerFile,
            });

            const runnerContent = Buffer.from(
                content.content,
                'base64'
            ).toString('utf8');
            await analyzeRunnerScript(runnerFile, runnerContent, report);
        } catch {
            // Runner file doesn't exist - suggest creation
            if (runnerFile === 'tests/run-tests.sh') {
                report.runnerIssues.push({
                    type: 'missing_main_runner',
                    message:
                        'Missing main test runner script: tests/run-tests.sh',
                    suggestion:
                        'Create a main test runner for CI/CD integration',
                });
            }
        }
    }
}

/**
 * Analyze a test runner script
 */
async function analyzeRunnerScript(filename, content, report) {
    const issues = [];

    // Check for proper error handling
    if (!content.includes('set -e')) {
        issues.push({
            type: 'missing_error_handling',
            message:
                'Test runner should include "set -e" for proper error handling',
        });
    }

    // Check for bats execution
    if (!content.includes('bats')) {
        issues.push({
            type: 'no_bats_execution',
            message: 'Test runner should execute bats test files',
        });
    }

    // Check for test discovery
    if (!content.includes('find') && !content.includes('*.bats')) {
        issues.push({
            type: 'static_test_list',
            message:
                'Consider dynamic test discovery instead of hardcoded test files',
        });
    }

    // Check for parallel execution support
    if (
        content.includes('bats') &&
        !content.includes('-j') &&
        !content.includes('--jobs')
    ) {
        issues.push({
            type: 'no_parallel_execution',
            message:
                'Consider adding parallel test execution with bats -j option',
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
 * Generate comprehensive testing report
 */
async function generateTestingReport(octokit, context, report) {
    if (!context.payload.pull_request && context.eventName !== 'push') {
        return;
    }

    // Calculate overall coverage
    const totalScripts = report.scriptsCovered + report.scriptsUncovered.length;
    report.overallCoverage =
        totalScripts > 0
            ? Math.round((report.scriptsCovered / totalScripts) * 100)
            : 100;

    const coverageEmoji =
        report.overallCoverage >= config.coverageThreshold ? '✅' : '⚠️';
    const qualityEmoji = report.testQualityIssues.length === 0 ? '✅' : '⚠️';
    const runnerEmoji = report.runnerIssues.length === 0 ? '✅' : '⚠️';

    let reportContent = `## 🧪 Bats Test Coverage Report

${coverageEmoji} **Test Coverage: ${report.overallCoverage}%** (${report.scriptsCovered}/${totalScripts} scripts)
${qualityEmoji} **Test Quality:** ${report.testQualityIssues.length} issues found
${runnerEmoji} **Test Runners:** ${report.runnerIssues.length} issues found

### Coverage Details:`;

    // Uncovered scripts
    if (report.scriptsUncovered.length > 0) {
        reportContent += `\n\n#### ⚠️ Scripts Missing Tests:`;
        for (const uncovered of report.scriptsUncovered) {
            const requiredCategories =
                REQUIRED_TEST_CATEGORIES[uncovered.scriptType] || [];
            reportContent += `\n- **${uncovered.script}** → \`${uncovered.expectedTest}\``;
            if (requiredCategories.length > 0) {
                reportContent += `\n  - Required test categories: ${requiredCategories.join(', ')}`;
            }
        }
    }

    // Missing test categories
    if (report.missingTestCategories.length > 0) {
        reportContent += `\n\n#### 📝 Missing Test Categories:`;
        for (const missing of report.missingTestCategories) {
            reportContent += `\n- **${missing.testFile}**: Missing ${missing.missing.join(', ')} tests`;
        }
    }

    // Test quality issues
    if (report.testQualityIssues.length > 0) {
        reportContent += `\n\n#### 🔍 Test Quality Issues:`;
        for (const quality of report.testQualityIssues) {
            reportContent += `\n- **${quality.file}** (${quality.testCount} tests):`;
            for (const issue of quality.issues) {
                reportContent += `\n  - ${issue.message}`;
            }
        }
    }

    // Test runner issues
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

    // Next steps
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

    // Post report
    if (context.payload.pull_request && !config.dryRun) {
        try {
            await octokit.issues.createComment({
                owner: context.repo.owner,
                repo: context.repo.repo,
                issue_number: context.payload.pull_request.number,
                body: reportContent,
            });
            log('Posted test coverage report');
        } catch (error) {
            log(`Error posting report: ${error.message}`, 'error');
        }
    } else if (config.dryRun) {
        log('[DRY RUN] Would post test coverage report');
        log(reportContent);
    }
}

/**
 * Logging helper
 */
function log(message, level = 'info') {
    }

    module.exports = {
        analyzeScriptTestCoverage,
        analyzeTestFileForScript,
        analyzeTestFileQuality,
        analyzeTestRunners,
        analyzeRunnerScript,
        generateTestingReport,
        TEST_PATTERNS,
        REQUIRED_TEST_CATEGORIES
    };
    if (level === 'info') {
        if (config.verbose || !message.startsWith('[DRY RUN]')) {
            console.log(message);
            if (core.info) {
                core.info(message);
            }
        }
    } else if (level === 'error') {
        console.error(message);
        if (core.error) {
            core.error(message);
        }
    } else if (level === 'warning') {
        console.warn(message);
        if (core.warning) {
            core.warning(message);
        }
    }
    }
