#!/usr/bin/env node
/**
 * ============================================================================
 * Module: commitParser.js
 * Location: scripts/agents/includes/commitParser.js
 * Description:
 *   - Parses conventional commits format
 *   - Extracts type, scope, description, body, and footers
 *   - Identifies breaking changes in footers
 * Standards:
 *   - Follows LightSpeed Coding Standards
 *   - Follows Conventional Commits v1.0.0
 * ============================================================================
 */

/**
 * Parse a conventional commit message
 * @param {string} message - Full commit message
 * @returns {Object} Parsed commit with type, scope, description, body, footers, isBreaking
 */
function parseConventionalCommit(message) {
	const lines = message.split('\n');
	const headerLine = lines[0];

	// Parse header: type(scope): description
	const headerRegex = /^(\w+)(?:\(([^\)]*)\))?\s*:\s*(.+)$/;
	const headerMatch = headerRegex.exec(headerLine);

	if (!headerMatch) {
		return {
			type: null,
			scope: null,
			description: headerLine,
			body: null,
			footers: {},
			isBreaking: false,
			valid: false,
		};
	}

	const type = headerMatch[1];
	const scope = headerMatch[2] || null;
	const description = headerMatch[3];

	// Separate body and footers
	let body = '';
	const footers = {};
	let isBreaking = false;

	// Find blank line separating header from body
	let bodyStartIndex = 1;
	while (bodyStartIndex < lines.length && lines[bodyStartIndex].trim() === '') {
		bodyStartIndex++;
	}

	if (bodyStartIndex < lines.length) {
		// Find blank line separating body from footers
		let footerStartIndex = bodyStartIndex;
		while (footerStartIndex < lines.length && lines[footerStartIndex].trim() !== '') {
			footerStartIndex++;
		}

		body = lines.slice(bodyStartIndex, footerStartIndex).join('\n').trim();

		// Parse footers
		for (let i = footerStartIndex + 1; i < lines.length; i++) {
			const line = lines[i].trim();
			if (!line) continue;

			const footerRegex = /^([^\s:]+)(?:\s+#)?:\s*(.+)$/;
			const footerMatch = footerRegex.exec(line);

			if (footerMatch) {
				const token = footerMatch[1];
				const value = footerMatch[2];
				footers[token] = value;

				if (token === 'BREAKING CHANGE' || token === 'BREAKING-CHANGE') {
					isBreaking = true;
				}
			}
		}
	}

	// Check for breaking change indicator in description
	if (description.includes('!:') || headerLine.includes('!:')) {
		isBreaking = true;
	}

	// Validate type is conventional commit type
	const validTypes = ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'chore'];
	const valid = validTypes.includes(type);

	return {
		type,
		scope,
		description,
		body,
		footers,
		isBreaking,
		valid,
	};
}

/**
 * Batch parse multiple commit messages
 * @param {string[]} messages - Array of commit messages
 * @returns {Object[]} Array of parsed commits
 */
function parseCommits(messages) {
	return messages.map(message => parseConventionalCommit(message));
}

/**
 * Filter commits by type
 * @param {Object[]} commits - Parsed commits
 * @param {string} type - Commit type to filter by
 * @returns {Object[]} Filtered commits
 */
function filterCommitsByType(commits, type) {
	return commits.filter(commit => commit.type === type && commit.valid);
}

/**
 * Extract breaking change descriptions
 * @param {Object[]} commits - Parsed commits
 * @returns {string[]} Breaking change descriptions
 */
function extractBreakingChanges(commits) {
	const breakingChanges = [];

	commits.forEach(commit => {
		if (commit.isBreaking) {
			if (commit.footers['BREAKING CHANGE']) {
				breakingChanges.push(commit.footers['BREAKING CHANGE']);
			} else if (commit.footers['BREAKING-CHANGE']) {
				breakingChanges.push(commit.footers['BREAKING-CHANGE']);
			} else {
				breakingChanges.push(`${commit.type}: ${commit.description}`);
			}
		}
	});

	return breakingChanges;
}

module.exports = {
	parseConventionalCommit,
	parseCommits,
	filterCommitsByType,
	extractBreakingChanges,
};
