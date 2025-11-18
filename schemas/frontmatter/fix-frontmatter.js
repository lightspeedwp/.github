#!/usr/bin/env node
/**
 * Fix common frontmatter issues:
 * 1. Convert markdown-style references to schema-compliant format
 * 2. Add missing file_type fields based on directory/filename
 */

const fs = require('fs');
const path = require('path');
const yaml = require('yaml');

function extractFrontmatter(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---/;
    const match = content.match(frontmatterRegex);

    if (!match) {
        return null;
    }

    return {
        raw: match[0],
        yaml: match[1],
        content: content.substring(match[0].length)
    };
}

function inferFileType(filePath) {
    const relativePath = path.relative(process.cwd(), filePath);

    if (relativePath === 'AGENTS.md') return 'agents-index';
    if (relativePath === 'CLAUDE.md') return 'claude-instructions';
    if (relativePath === 'GEMINI.md') return 'gemini-instructions';
    if (relativePath.match(/\.github\/agents\/.*\.agent\.md$/)) return 'agent';
    if (relativePath.match(/\.github\/agents\/agent\.md$/)) return 'agent-index';
    if (relativePath.match(/\.github\/chatmodes\/.*\.chatmode\.md$/)) return 'chatmode';
    if (relativePath.match(/\.github\/chatmodes\/chatmodes\.md$/)) return 'chatmode-index';
    if (relativePath.match(/\.github\/prompts\/.*\.prompt\.md$/)) return 'prompt';
    if (relativePath.match(/\.github\/prompts\/prompts\.md$/)) return 'prompt-index';
    if (relativePath.match(/\.github\/instructions\/.*\.instructions\.md$/)) return 'instructions';
    if (relativePath.match(/\.github\/custom-instructions\.md$/)) return 'custom-instructions';
    if (relativePath.match(/\.github\/ISSUE_TEMPLATE\//)) return 'issue-template';
    if (relativePath.match(/\.github\/PULL_REQUEST_TEMPLATE\//)) return 'pr-template';
    if (relativePath.match(/\.github\/SAVED_REPLIES\//)) return 'saved-reply';
    if (relativePath.match(/docs\//)) return 'documentation';

    return null;
}

function fixReferences(yamlContent) {
    // Fix markdown-style references to schema-compliant format
    const lines = yamlContent.split('\n');
    const result = [];
    let inReferences = false;
    let referencesIndent = '';

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Check if we're starting references section
        if (line.match(/^(\s*)references:\s*$/)) {
            inReferences = true;
            referencesIndent = RegExp.$1;
            result.push(line);
            continue;
        }

        // Check if we've left references section
        if (inReferences && line.match(/^(\S)/)) {
            inReferences = false;
        }

        // Fix markdown-style reference
        if (inReferences && line.match(/^\s*-\s*\[([^\]]+)\]\(([^)]+)\)\s*$/)) {
            const description = RegExp.$1;
            const url = RegExp.$2;

            // Extract path from URL if it's a GitHub URL
            let pathMatch = url.match(/github\.com\/[^\/]+\/[^\/]+\/blob\/[^\/]+\/(.+)$/);
            const filePath = pathMatch ? pathMatch[1] : url;

            result.push(`${referencesIndent}  - path: "${filePath}"`);
            result.push(`${referencesIndent}    description: "${description}"`);
            continue;
        }

        result.push(line);
    }

    return result.join('\n');
}

function fixFrontmatter(filePath) {
    try {
        const fm = extractFrontmatter(filePath);
        if (!fm) {
            return { fixed: false, reason: 'no-frontmatter' };
        }

        // Try to parse original YAML
        let data;
        let needsFix = false;

        try {
            data = yaml.parse(fm.yaml);
        } catch (e) {
            // If parsing fails, try fixing references first
            const fixedYaml = fixReferences(fm.yaml);
            try {
                data = yaml.parse(fixedYaml);
                needsFix = true;
            } catch (e2) {
                return { fixed: false, reason: 'yaml-parse-error', error: e2.message };
            }
        }

        // Check if file_type is missing
        if (!data.file_type) {
            const inferredType = inferFileType(filePath);
            if (inferredType) {
                data.file_type = inferredType;
                needsFix = true;
            } else {
                return { fixed: false, reason: 'cannot-infer-file-type' };
            }
        }

        // Check if file_type is not a string
        if (typeof data.file_type !== 'string') {
            return { fixed: false, reason: 'file-type-not-string', fileType: typeof data.file_type };
        }

        // If agent file, check for 'name' field (required by schema)
        if (data.file_type === 'agent' && !data.name && data.title) {
            data.name = data.title;
            needsFix = true;
        }

        if (needsFix) {
            // Reconstruct the file
            const newYaml = yaml.stringify(data, {
                lineWidth: 0,
                defaultStringType: 'QUOTE_DOUBLE'
            });
            const newContent = `---\n${newYaml}---${fm.content}`;
            fs.writeFileSync(filePath, newContent, 'utf8');
            return { fixed: true, changes: Object.keys({file_type: !data.file_type}) };
        }

        return { fixed: false, reason: 'no-changes-needed' };

    } catch (error) {
        return { fixed: false, reason: 'error', error: error.message };
    }
}

// Main
if (require.main === module) {
    const args = process.argv.slice(2);
    const file = args[0];

    if (file) {
        const result = fixFrontmatter(path.resolve(file));
        console.log(JSON.stringify(result, null, 2));
        process.exit(result.fixed ? 0 : 1);
    } else {
        console.error('Usage: node fix-frontmatter.js <file>');
        process.exit(1);
    }
}

module.exports = { fixFrontmatter, inferFileType, fixReferences };
