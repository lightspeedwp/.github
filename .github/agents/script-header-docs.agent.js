#!/usr/bin/env node
/**
 * Script Header and Inline Documentation Agent
 *
 * You are a documentation specialist. Follow our LightSpeed WP script documentation standards
 * to ensure comprehensive script headers and inline documentation. Avoid abbreviated or
 * incomplete documentation unless specified.
 *
 * This agent automatically validates and suggests improvements for shell script documentation:
 * 1. Validates script headers follow LightSpeed WP standards
 * 2. Checks for proper inline documentation and comments
 * 3. Ensures function documentation and usage examples
 * 4. Validates parameter and variable documentation
 *
 * Usage:
 * - Automatically triggered on script file changes via GitHub Actions
 * - Can be run manually for documentation reviews
 *
 * Environment Variables:
 * - GITHUB_TOKEN: Required for API access
 * - DRY_RUN: Set to "true" to preview without making changes
 * - VERBOSE: Set to "true" for detailed logs
 */

// ...existing code...
const actionsCore = require('@actions/core');
const actionsGithub = require('@actions/github');

// Required header components per LightSpeed standards
const REQUIRED_HEADER_COMPONENTS = [
    { name: 'shebang', pattern: /^#!\/bin\/bash/, required: true },
    { name: 'script_name', pattern: /^#\s*Script Name:\s*.+/, required: true },
    { name: 'description', pattern: /^#\s*Description:\s*.+/, required: true },
    { name: 'usage', pattern: /^#\s*Usage:\s*.+/, required: true },
    { name: 'author', pattern: /^#\s*Author:\s*.+/, required: true },
    { name: 'date', pattern: /^#\s*Date:\s*\d{4}-\d{2}-\d{2}/, required: true },
];

// Best practices for inline documentation
const DOCUMENTATION_PATTERNS = {
    function_docs: /^#\s*@description|^#\s*@param|^#\s*@return|^#\s*Function:/i,
    variable_docs: /^#\s*@var|^#\s*Variable:|^#\s*Set\s/i,
    error_handling: /set\s+-euo\s+pipefail/,
    logging_usage: /log_(info|error|warn|success|debug)/,
};

// Config
const config = {
    dryRun: process.env.DRY_RUN === 'true',
    verbose: process.env.VERBOSE === 'true',
    token: process.env.GITHUB_TOKEN,
};

/**
 * Main function
 */
async function run() {
    try {
        if (!config.token) {
            throw new Error('GITHUB_TOKEN is required');
        }

        const octokit = new Octokit({ auth: config.token });
        const context = actionsGithub.context;

        // Get changed files from pull request
        const changedFiles = await getChangedScriptFiles(octokit, context);
        log(`Found ${changedFiles.length} script files to analyze`);

        let allIssuesFixed = true;
        const documentationReport = [];

        // Analyze each script file
        for (const file of changedFiles) {
            const analysis = await analyzeScriptDocumentation(
                octokit,
                context,
                file
            );
            documentationReport.push(analysis);

            if (analysis.issues.length > 0) {
                allIssuesFixed = false;
                await reportDocumentationIssues(
                    octokit,
                    context,
                    file,
                    analysis
                );
            }
        }

        // Generate summary report
        await generateDocumentationSummary(
            octokit,
            context,
            documentationReport
        );

        if (!allIssuesFixed && !config.dryRun) {
            actionsCore.setFailed(
                'Documentation issues found. See comments for details.'
            );
        }

        log('Script documentation analysis completed');
    } catch (error) {
        actionsCore.setFailed(`Error: ${error.message}`);
    }
}

/**
 * Get changed script files from pull request
 */
async function getChangedScriptFiles(octokit, context) {
    if (context.eventName !== 'pull_request') {
        return [];
    }

    const { data: files } = await octokit.pulls.listFiles({
        owner: context.repo.owner,
        repo: context.repo.repo,
        pull_number: context.payload.pull_request.number,
    });

    // Filter for shell script files
    return files.filter(
        (file) =>
            file.filename.endsWith('.sh') &&
            (file.status === 'added' || file.status === 'modified')
    );
}

/**
 * Analyze a script file for documentation compliance
 */
async function analyzeScriptDocumentation(octokit, context, file) {
    const { data: content } = await octokit.repos.getContent({
        owner: context.repo.owner,
        repo: context.repo.repo,
        path: file.filename,
        ref: context.payload.pull_request.head.sha,
    });

    const scriptContent = Buffer.from(content.content, 'base64').toString(
        'utf8'
    );
    const lines = scriptContent.split('\n');

    const analysis = {
        filename: file.filename,
        issues: [],
        suggestions: [],
        score: 0,
        maxScore: 0,
    };

    // Check header components
    analysis.maxScore += REQUIRED_HEADER_COMPONENTS.length;
    for (const component of REQUIRED_HEADER_COMPONENTS) {
        const found = lines.some((line) => component.pattern.test(line));
        if (found) {
            analysis.score++;
        } else {
            analysis.issues.push({
                type: 'missing_header',
                component: component.name,
                message: `Missing required header component: ${component.name}`,
                line: 1,
            });
        }
    }

    // Check for error handling
    analysis.maxScore++;
    if (DOCUMENTATION_PATTERNS.error_handling.test(scriptContent)) {
        analysis.score++;
    } else {
        analysis.issues.push({
            type: 'missing_error_handling',
            message: 'Missing proper error handling (set -euo pipefail)',
            line: findLineNumber(lines, /set.*pipefail/) || 2,
        });
    }

    // Check function documentation
    const functions = findFunctions(lines);
    analysis.maxScore += functions.length;
    for (const func of functions) {
        const hasDocumentation = checkFunctionDocumentation(lines, func);
        if (hasDocumentation) {
            analysis.score++;
        } else {
            analysis.issues.push({
                type: 'missing_function_docs',
                message: `Function '${func.name}' lacks proper documentation`,
                line: func.line,
            });
        }
    }

    // Check variable documentation for important variables
    const variables = findImportantVariables(lines);
    analysis.maxScore += variables.length;
    for (const variable of variables) {
        const hasDocumentation = checkVariableDocumentation(lines, variable);
        if (hasDocumentation) {
            analysis.score++;
        } else {
            analysis.suggestions.push({
                type: 'variable_docs',
                message: `Consider documenting variable '${variable.name}'`,
                line: variable.line,
            });
        }
    }

    // Generate improvement suggestions
    generateDocumentationSuggestions(analysis, scriptContent);

    return analysis;
}

/**
 * Find functions in script
 */
function findFunctions(lines) {
    const functions = [];
    for (let i = 0; i < lines.length; i++) {
        const match = lines[i].match(
            /^(?:function\s+)?([a-zA-Z_][a-zA-Z0-9_]*)\s*\(\)/
        );
        if (match) {
            functions.push({
                name: match[1],
                line: i + 1,
            });
        }
    }
    return functions;
}

/**
 * Check if function has proper documentation
 */
function checkFunctionDocumentation(lines, func) {
    // Look for documentation in the lines before the function
    for (let i = Math.max(0, func.line - 10); i < func.line - 1; i++) {
        if (DOCUMENTATION_PATTERNS.function_docs.test(lines[i])) {
            return true;
        }
    }
    return false;
}

/**
 * Find important variables that should be documented
 */
function findImportantVariables(lines) {
    const variables = [];
    for (let i = 0; i < lines.length; i++) {
        // Look for configuration variables, environment variables, etc.
        const match =
            lines[i].match(/^([A-Z_]+)=.*$/) ||
            lines[i].match(/^readonly\s+([A-Z_]+)=.*$/) ||
            lines[i].match(/^declare\s+(?:-[a-z]+\s+)?([A-Z_]+)=.*$/);
        if (match) {
            variables.push({
                name: match[1],
                line: i + 1,
            });
        }
    }
    return variables;
}

/**
 * Check if variable has documentation
 */
function checkVariableDocumentation(lines, variable) {
    // Look for documentation in the lines before or after the variable
    for (
        let i = Math.max(0, variable.line - 3);
        i < Math.min(lines.length, variable.line + 2);
        i++
    ) {
        if (DOCUMENTATION_PATTERNS.variable_docs.test(lines[i])) {
            return true;
        }
    }
    return false;
}

/**
 * Find line number of pattern
 */
function findLineNumber(lines, pattern) {
    for (let i = 0; i < lines.length; i++) {
        if (pattern.test(lines[i])) {
            return i + 1;
        }
    }
    return null;
}

/**
 * Generate documentation improvement suggestions
 */
function generateDocumentationSuggestions(analysis, scriptContent) {
    // Suggest usage examples if missing
    if (
        !scriptContent.includes('Example:') &&
        !scriptContent.includes('Examples:')
    ) {
        analysis.suggestions.push({
            type: 'usage_examples',
            message: 'Consider adding usage examples in the header or README',
            line: 1,
        });
    }

    // Suggest dependency documentation
    if (
        scriptContent.includes('command -v') ||
        scriptContent.includes('which ')
    ) {
        analysis.suggestions.push({
            type: 'dependencies',
            message:
                'Consider documenting script dependencies and prerequisites',
            line: 1,
        });
    }

    // Suggest exit code documentation
    if (scriptContent.includes('exit ')) {
        analysis.suggestions.push({
            type: 'exit_codes',
            message: 'Consider documenting exit codes and their meanings',
            line: 1,
        });
    }
}

/**
 * Report documentation issues as PR comments
 */
async function reportDocumentationIssues(octokit, context, file, analysis) {
    if (!context.payload.pull_request || config.dryRun) {
        log(
            `[${config.dryRun ? 'DRY RUN' : 'INFO'}] Would report ${analysis.issues.length} issues for ${file.filename}`
        );
        return;
    }

    const issuesSummary = analysis.issues
        .map(
            (issue) =>
                `- **${issue.type}** (line ${issue.line}): ${issue.message}`
        )
        .join('\n');

    const suggestionsSummary = analysis.suggestions
        .map(
            (suggestion) => `- ${suggestion.message} (line ${suggestion.line})`
        )
        .join('\n');

    const score =
        analysis.maxScore > 0
            ? Math.round((analysis.score / analysis.maxScore) * 100)
            : 0;

    const comment = `## 📝 Script Documentation Analysis: ${file.filename}

**Documentation Score: ${score}% (${analysis.score}/${analysis.maxScore})**

### Issues Found:
${issuesSummary || '✅ No issues found!'}

${
    analysis.suggestions.length > 0
        ? `### Suggestions:
${suggestionsSummary}`
        : ''
}

### Required Header Format:
\`\`\`bash
#!/bin/bash
#
# Script Name: ${file.filename}
# Description: Brief description of what this script does
# Usage: ./${file.filename} [options] [arguments]
# Author: Your Name
# Date: ${new Date().toISOString().split('T')[0]}
#
\`\`\`

Please update the script documentation according to [LightSpeed WP standards](/.github/instructions/shell-script-copilot.md).`;

    try {
        await octokit.issues.createComment({
            owner: context.repo.owner,
            repo: context.repo.repo,
            issue_number: context.payload.pull_request.number,
            body: comment,
        });
        log(`Posted documentation review for ${file.filename}`);
    } catch (error) {
        log(`Error posting comment: ${error.message}`, 'error');
    }
}

/**
 * Generate summary report for all analyzed files
 */
async function generateDocumentationSummary(octokit, context, reports) {
    if (!context.payload.pull_request || reports.length === 0) {
        return;
    }

    const totalIssues = reports.reduce(
        (sum, report) => sum + report.issues.length,
        0
    );
    const avgScore = Math.round(
        reports.reduce((sum, report) => {
            const score =
                report.maxScore > 0
                    ? (report.score / report.maxScore) * 100
                    : 100;
            return sum + score;
        }, 0) / reports.length
    );

    const filesSummary = reports
        .map((report) => {
            const score =
                report.maxScore > 0
                    ? Math.round((report.score / report.maxScore) * 100)
                    : 100;
            const status = report.issues.length === 0 ? '✅' : '⚠️';
            return `${status} **${report.filename}**: ${score}% (${report.issues.length} issues)`;
        })
        .join('\n');

    const summaryComment = `## 📊 Script Documentation Summary

**Overall Documentation Score: ${avgScore}%**
**Total Issues Found: ${totalIssues}**

### Files Analyzed:
${filesSummary}

${
    totalIssues > 0
        ? `### Next Steps:
1. Review individual file comments for detailed issues
2. Update script headers according to LightSpeed standards
3. Add missing inline documentation for functions and variables
4. Ensure proper error handling with \`set -euo pipefail\`

See our [Shell Script Standards](/.github/instructions/shell-script-copilot.md) for complete guidelines.`
        : '🎉 All script documentation meets LightSpeed standards!'
}`;

    if (!config.dryRun) {
        try {
            await octokit.issues.createComment({
                owner: context.repo.owner,
                repo: context.repo.repo,
                issue_number: context.payload.pull_request.number,
                body: summaryComment,
            });
            log('Posted documentation summary report');
        } catch (error) {
            log(`Error posting summary: ${error.message}`, 'error');
        }
    } else {
        log('[DRY RUN] Would post documentation summary');
    }
}

/**
 * Logging helper
 */
function log(message, level = 'info') {
    if (level === 'info') {
        if (config.verbose || !message.startsWith('[DRY RUN]')) {
            console.log(message);
            if (actionsCore.info) {
                actionsCore.info(message);
            }
        }
    } else if (level === 'error') {
        console.error(message);
        if (actionsCore.error) {
            actionsCore.error(message);
        }
    } else if (level === 'warning') {
        console.warn(message);
        if (actionsCore.warning) {
            actionsCore.warning(message);
        }
    }
}

// Execute if run directly
if (require.main === module) {
    run();
}

module.exports = {
    run,
    analyzeScriptDocumentation,
    REQUIRED_HEADER_COMPONENTS,
};
