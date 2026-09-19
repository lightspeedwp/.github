/**
 * GovernanceFile Parser (T004)
 * Reads and parses governance files (YAML, Markdown, JSON)
 * Returns structured representation with metadata and content
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

class GovernanceFile {
	constructor(filePath, content, metadata = {}) {
		this.id = this._generateId(filePath);
		this.path = filePath;
		this.type = this._detectType(filePath);
		this.format = this._detectFormat(filePath);
		this.content = content;
		this.locked = metadata.locked !== false; // Default to locked
		this.metadata = metadata;
	}

	/**
	 * Generate unique identifier from file path
	 */
	_generateId(filePath) {
		return path.basename(filePath).replace(/\.[^/.]+$/, '').replace(/[^a-z0-9-]/gi, '-').toLowerCase();
	}

	/**
	 * Detect governance file type
	 */
	_detectType(filePath) {
		const filename = path.basename(filePath);

		if (filename === 'labels.yml' || filename === 'labels.yaml') {
			return 'labels';
		}
		if (filename === 'issue-types.yml' || filename === 'issue-types.yaml') {
			return 'issue-types';
		}
		if (filename.endsWith('.md') && filePath.includes('TEMPLATE')) {
			return 'template';
		}
		if (filename.includes('workflow') && (filename.endsWith('.yml') || filename.endsWith('.yaml'))) {
			return 'workflow';
		}
		if (filename.endsWith('.json')) {
			return 'json-config';
		}
		return 'unknown';
	}

	/**
	 * Detect file format
	 */
	_detectFormat(filePath) {
		const ext = path.extname(filePath).toLowerCase();
		if (ext === '.yml' || ext === '.yaml') return 'yaml';
		if (ext === '.md' || ext === '.markdown') return 'markdown';
		if (ext === '.json') return 'json';
		return 'text';
	}

	/**
	 * Parse YAML content
	 */
	static parseYaml(content) {
		try {
			return yaml.load(content);
		} catch (error) {
			throw new Error(`YAML parse error: ${error.message}`);
		}
	}

	/**
	 * Parse JSON content
	 */
	static parseJson(content) {
		try {
			return JSON.parse(content);
		} catch (error) {
			throw new Error(`JSON parse error: ${error.message}`);
		}
	}

	/**
	 * Parse Markdown frontmatter
	 */
	static parseMarkdownFrontmatter(content) {
		const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
		const match = content.match(frontmatterRegex);

		if (!match) {
			return { metadata: {}, body: content };
		}

		try {
			const metadata = yaml.load(match[1]) || {};
			return { metadata, body: match[2] };
		} catch (error) {
			throw new Error(`Frontmatter parse error: ${error.message}`);
		}
	}

	/**
	 * Get parsed content based on format
	 */
	getParsedContent() {
		switch (this.format) {
			case 'yaml':
				return GovernanceFile.parseYaml(this.content);
			case 'json':
				return GovernanceFile.parseJson(this.content);
			case 'markdown': {
				const { metadata, body } = GovernanceFile.parseMarkdownFrontmatter(this.content);
				return { metadata, body };
			}
			default:
				return { raw: this.content };
		}
	}

	/**
	 * Serialize to JSON
	 */
	toJSON() {
		return {
			id: this.id,
			path: this.path,
			type: this.type,
			format: this.format,
			locked: this.locked,
			metadata: this.metadata,
			contentLength: this.content.length,
		};
	}
}

/**
 * Load governance file from disk
 */
async function loadGovernanceFile(filePath, options = {}) {
	try {
		const resolvedPath = path.resolve(filePath);
		const content = fs.readFileSync(resolvedPath, 'utf8');

		return new GovernanceFile(filePath, content, {
			locked: options.locked !== false,
			...options.metadata,
		});
	} catch (error) {
		throw new Error(`Failed to load governance file ${filePath}: ${error.message}`);
	}
}

/**
 * Load multiple governance files
 */
async function loadGovernanceFiles(filePaths, options = {}) {
	const files = [];
	const errors = [];

	for (const filePath of filePaths) {
		try {
			const file = await loadGovernanceFile(filePath, options);
			files.push(file);
		} catch (error) {
			errors.push({ filePath, error: error.message });
		}
	}

	return { files, errors };
}

module.exports = {
	GovernanceFile,
	loadGovernanceFile,
	loadGovernanceFiles,
};
