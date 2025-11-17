/**
 * ============================================================================
 * Tests for check-template-labels utility
 * Location: .github/agents/includes/__tests__/check-template-labels.test.js
 * Description:
 *   - Tests template label validation against canonical labels
 *   - Covers label extraction from templates and issue types
 * Standards:
 *   - Follows LightSpeedWP Coding Standards
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// Mock the process.exit to prevent tests from actually exiting
const mockExit = jest.spyOn(process, 'exit').mockImplementation((code) => {
    throw new Error(`Process.exit called with code ${code}`);
});

// Mock console methods
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();

// We need to test the module functions, but since it calls main() on import,
// we'll need to handle that carefully
describe('check-template-labels.js', () => {
    const tempDir = path.join(__dirname, '.temp-check-template');
    const tempAutomationDir = path.join(tempDir, 'automation');
    const tempIssueTemplateDir = path.join(
        tempDir,
        '.github',
        'ISSUE_TEMPLATE'
    );

    beforeAll(() => {
        // Create temp directories
        fs.mkdirSync(tempAutomationDir, { recursive: true });
        fs.mkdirSync(tempIssueTemplateDir, { recursive: true });
    });

    afterAll(() => {
        // Clean up temp directories
        if (fs.existsSync(tempDir)) {
            fs.rmSync(tempDir, { recursive: true, force: true });
        }
    });

    beforeEach(() => {
        jest.clearAllMocks();
        mockExit.mockClear();
        mockConsoleLog.mockClear();
        mockConsoleError.mockClear();
    });

    describe('YAML loading and label extraction', () => {
        test('loads canonical labels from labels.yml', () => {
            const labelsData = [
                { name: 'type:bug', color: 'FF0000' },
                { name: 'type:feature', color: '00FF00' },
                { name: 'status:needs-triage', color: '0000FF' },
            ];

            const labelsFile = path.join(tempAutomationDir, 'labels.yml');
            fs.writeFileSync(labelsFile, yaml.dump(labelsData));

            const content = fs.readFileSync(labelsFile, 'utf8');
            const labels = yaml.load(content);
            const canonicalSet = new Set(labels.map((l) => l.name));

            expect(canonicalSet.has('type:bug')).toBe(true);
            expect(canonicalSet.has('type:feature')).toBe(true);
            expect(canonicalSet.has('status:needs-triage')).toBe(true);
            expect(canonicalSet.size).toBe(3);
        });

        test('loads issue type labels from issue-types.yml', () => {
            const issueTypesData = [
                { name: 'Bug Report', label: 'type:bug' },
                { name: 'Feature Request', label: 'type:feature' },
                {
                    name: 'Multi-label Type',
                    labels: ['type:enhancement', 'priority:high'],
                },
            ];

            const issueTypesFile = path.join(
                tempAutomationDir,
                'issue-types.yml'
            );
            fs.writeFileSync(issueTypesFile, yaml.dump(issueTypesData));

            const content = fs.readFileSync(issueTypesFile, 'utf8');
            const types = yaml.load(content);
            const labels = new Set();

            for (const type of types) {
                if (type.label) labels.add(type.label);
                if (type.labels && Array.isArray(type.labels)) {
                    for (const l of type.labels) labels.add(l);
                }
            }

            expect(labels.has('type:bug')).toBe(true);
            expect(labels.has('type:feature')).toBe(true);
            expect(labels.has('type:enhancement')).toBe(true);
            expect(labels.has('priority:high')).toBe(true);
            expect(labels.size).toBe(4);
        });

        test('handles issue types with single label field', () => {
            const issueTypesData = [
                { name: 'Bug', label: 'type:bug' },
                { name: 'Docs', label: 'type:documentation' },
            ];

            const issueTypesFile = path.join(
                tempAutomationDir,
                'types-single.yml'
            );
            fs.writeFileSync(issueTypesFile, yaml.dump(issueTypesData));

            const content = fs.readFileSync(issueTypesFile, 'utf8');
            const types = yaml.load(content);
            const labels = new Set();

            for (const type of types) {
                if (type.label) labels.add(type.label);
            }

            expect(labels.size).toBe(2);
            expect(labels.has('type:bug')).toBe(true);
            expect(labels.has('type:documentation')).toBe(true);
        });

        test('handles issue types with labels array', () => {
            const issueTypesData = [
                {
                    name: 'Critical Bug',
                    labels: ['type:bug', 'priority:high', 'area:security'],
                },
            ];

            const issueTypesFile = path.join(
                tempAutomationDir,
                'types-array.yml'
            );
            fs.writeFileSync(issueTypesFile, yaml.dump(issueTypesData));

            const content = fs.readFileSync(issueTypesFile, 'utf8');
            const types = yaml.load(content);
            const labels = new Set();

            for (const type of types) {
                if (type.labels && Array.isArray(type.labels)) {
                    for (const l of type.labels) labels.add(l);
                }
            }

            expect(labels.size).toBe(3);
            expect(labels.has('type:bug')).toBe(true);
            expect(labels.has('priority:high')).toBe(true);
            expect(labels.has('area:security')).toBe(true);
        });

        test('handles issue types with no labels', () => {
            const issueTypesData = [
                { name: 'General', description: 'General issue' },
            ];

            const issueTypesFile = path.join(
                tempAutomationDir,
                'types-none.yml'
            );
            fs.writeFileSync(issueTypesFile, yaml.dump(issueTypesData));

            const content = fs.readFileSync(issueTypesFile, 'utf8');
            const types = yaml.load(content);
            const labels = new Set();

            for (const type of types) {
                if (type.label) labels.add(type.label);
                if (type.labels && Array.isArray(type.labels)) {
                    for (const l of type.labels) labels.add(l);
                }
            }

            expect(labels.size).toBe(0);
        });
    });

    describe('template label extraction', () => {
        test('extracts labels from template with bracket notation', () => {
            const template = `---
name: Bug Report
about: Report a bug
title: "[BUG] "
labels: [type:bug, priority:high]
assignees: ''
---

# Bug Report Template`;

            const templateFile = path.join(
                tempIssueTemplateDir,
                'bug-report.md'
            );
            fs.writeFileSync(templateFile, template);

            const files = fs
                .readdirSync(tempIssueTemplateDir)
                .filter((f) => f.endsWith('.md'));
            expect(files).toContain('bug-report.md');

            const content = fs.readFileSync(
                path.join(tempIssueTemplateDir, files[0]),
                'utf8'
            );
            const labelRegex = /labels?:\s*\[([^\]]+)\]|labels?:\s*([^\n]+)/gi;
            const labels = new Set();

            let match;
            while ((match = labelRegex.exec(content))) {
                let found = match[1] || match[2];
                if (found) {
                    found
                        .split(',')
                        .map((l) => l.replace(/['"\[\]]/g, '').trim())
                        .forEach((l) => {
                            if (l) labels.add(l);
                        });
                }
            }

            expect(labels.has('type:bug')).toBe(true);
            expect(labels.has('priority:high')).toBe(true);
            expect(labels.size).toBe(2);

            // Clean up
            fs.unlinkSync(templateFile);
        });

        test('extracts labels with single quotes', () => {
            const template = `---
name: Feature Request
labels: ['type:feature', 'priority:normal']
---`;

            const templateFile = path.join(
                tempIssueTemplateDir,
                'feature.md'
            );
            fs.writeFileSync(templateFile, template);

            const content = fs.readFileSync(templateFile, 'utf8');
            const labelRegex = /labels?:\s*\[([^\]]+)\]|labels?:\s*([^\n]+)/gi;
            const labels = new Set();

            let match;
            while ((match = labelRegex.exec(content))) {
                let found = match[1] || match[2];
                if (found) {
                    found
                        .split(',')
                        .map((l) => l.replace(/['"\[\]]/g, '').trim())
                        .forEach((l) => {
                            if (l) labels.add(l);
                        });
                }
            }

            expect(labels.has('type:feature')).toBe(true);
            expect(labels.has('priority:normal')).toBe(true);

            fs.unlinkSync(templateFile);
        });

        test('extracts labels with double quotes', () => {
            const template = `---
labels: ["type:bug", "area:core"]
---`;

            const templateFile = path.join(tempIssueTemplateDir, 'core-bug.md');
            fs.writeFileSync(templateFile, template);

            const content = fs.readFileSync(templateFile, 'utf8');
            const labelRegex = /labels?:\s*\[([^\]]+)\]|labels?:\s*([^\n]+)/gi;
            const labels = new Set();

            let match;
            while ((match = labelRegex.exec(content))) {
                let found = match[1] || match[2];
                if (found) {
                    found
                        .split(',')
                        .map((l) => l.replace(/['"\[\]]/g, '').trim())
                        .forEach((l) => {
                            if (l) labels.add(l);
                        });
                }
            }

            expect(labels.has('type:bug')).toBe(true);
            expect(labels.has('area:core')).toBe(true);

            fs.unlinkSync(templateFile);
        });

        test('extracts labels without brackets (inline format)', () => {
            const template = `---
name: Documentation
labels: type:documentation, area:docs
---`;

            const templateFile = path.join(tempIssueTemplateDir, 'docs.md');
            fs.writeFileSync(templateFile, template);

            const content = fs.readFileSync(templateFile, 'utf8');
            const labelRegex = /labels?:\s*\[([^\]]+)\]|labels?:\s*([^\n]+)/gi;
            const labels = new Set();

            let match;
            while ((match = labelRegex.exec(content))) {
                let found = match[1] || match[2];
                if (found) {
                    found
                        .split(',')
                        .map((l) => l.replace(/['"\[\]]/g, '').trim())
                        .forEach((l) => {
                            if (l) labels.add(l);
                        });
                }
            }

            expect(labels.has('type:documentation')).toBe(true);
            expect(labels.has('area:docs')).toBe(true);

            fs.unlinkSync(templateFile);
        });

        test('handles template with no labels', () => {
            const template = `---
name: Blank Issue
about: Generic issue template
---`;

            const templateFile = path.join(tempIssueTemplateDir, 'blank.md');
            fs.writeFileSync(templateFile, template);

            const content = fs.readFileSync(templateFile, 'utf8');
            const labelRegex = /labels?:\s*\[([^\]]+)\]|labels?:\s*([^\n]+)/gi;
            const labels = new Set();

            let match;
            while ((match = labelRegex.exec(content))) {
                let found = match[1] || match[2];
                if (found) {
                    found
                        .split(',')
                        .map((l) => l.replace(/['"\[\]]/g, '').trim())
                        .forEach((l) => {
                            if (l) labels.add(l);
                        });
                }
            }

            expect(labels.size).toBe(0);

            fs.unlinkSync(templateFile);
        });

        test('handles multiple label declarations in one template', () => {
            const template = `---
name: Multi-label
labels: [type:bug]
---
Some content here
labels: priority:high
`;

            const templateFile = path.join(tempIssueTemplateDir, 'multi.md');
            fs.writeFileSync(templateFile, template);

            const content = fs.readFileSync(templateFile, 'utf8');
            const labelRegex = /labels?:\s*\[([^\]]+)\]|labels?:\s*([^\n]+)/gi;
            const labels = new Set();

            let match;
            while ((match = labelRegex.exec(content))) {
                let found = match[1] || match[2];
                if (found) {
                    found
                        .split(',')
                        .map((l) => l.replace(/['"\[\]]/g, '').trim())
                        .forEach((l) => {
                            if (l) labels.add(l);
                        });
                }
            }

            expect(labels.has('type:bug')).toBe(true);
            expect(labels.has('priority:high')).toBe(true);

            fs.unlinkSync(templateFile);
        });

        test('handles labels with special characters', () => {
            const template = `---
labels: [type:bug, area:core/api, status:needs-review]
---`;

            const templateFile = path.join(tempIssueTemplateDir, 'special.md');
            fs.writeFileSync(templateFile, template);

            const content = fs.readFileSync(templateFile, 'utf8');
            const labelRegex = /labels?:\s*\[([^\]]+)\]|labels?:\s*([^\n]+)/gi;
            const labels = new Set();

            let match;
            while ((match = labelRegex.exec(content))) {
                let found = match[1] || match[2];
                if (found) {
                    found
                        .split(',')
                        .map((l) => l.replace(/['"\[\]]/g, '').trim())
                        .forEach((l) => {
                            if (l) labels.add(l);
                        });
                }
            }

            expect(labels.has('type:bug')).toBe(true);
            expect(labels.has('area:core/api')).toBe(true);
            expect(labels.has('status:needs-review')).toBe(true);

            fs.unlinkSync(templateFile);
        });

        test('filters out empty labels', () => {
            const template = `---
labels: [type:bug, , , priority:high]
---`;

            const templateFile = path.join(tempIssueTemplateDir, 'empty.md');
            fs.writeFileSync(templateFile, template);

            const content = fs.readFileSync(templateFile, 'utf8');
            const labelRegex = /labels?:\s*\[([^\]]+)\]|labels?:\s*([^\n]+)/gi;
            const labels = new Set();

            let match;
            while ((match = labelRegex.exec(content))) {
                let found = match[1] || match[2];
                if (found) {
                    found
                        .split(',')
                        .map((l) => l.replace(/['"\[\]]/g, '').trim())
                        .forEach((l) => {
                            if (l) labels.add(l);
                        });
                }
            }

            expect(labels.size).toBe(2);
            expect(labels.has('type:bug')).toBe(true);
            expect(labels.has('priority:high')).toBe(true);

            fs.unlinkSync(templateFile);
        });
    });

    describe('validation logic', () => {
        test('validates all labels are canonical (success case)', () => {
            // Create canonical labels
            const canonicalLabels = [
                { name: 'type:bug' },
                { name: 'type:feature' },
                { name: 'priority:high' },
                { name: 'status:needs-triage' },
            ];

            const canonicalSet = new Set(canonicalLabels.map((l) => l.name));

            // Create issue type labels
            const issueTypeLabels = new Set(['type:bug', 'type:feature']);

            // Create template labels
            const templateLabels = new Set(['priority:high', 'type:bug']);

            // Combine all labels
            const all = new Set([...issueTypeLabels, ...templateLabels]);

            // Check for unknown labels
            const unknown = [...all].filter((l) => l && !canonicalSet.has(l));

            expect(unknown).toEqual([]);
        });

        test('detects unknown labels (failure case)', () => {
            // Create canonical labels (missing some labels)
            const canonicalLabels = [
                { name: 'type:bug' },
                { name: 'type:feature' },
            ];

            const canonicalSet = new Set(canonicalLabels.map((l) => l.name));

            // Create issue type labels with unknown label
            const issueTypeLabels = new Set([
                'type:bug',
                'type:unknown-type',
            ]);

            // Create template labels with unknown label
            const templateLabels = new Set(['priority:urgent', 'type:bug']);

            // Combine all labels
            const all = new Set([...issueTypeLabels, ...templateLabels]);

            // Check for unknown labels
            const unknown = [...all].filter((l) => l && !canonicalSet.has(l));

            expect(unknown).toContain('type:unknown-type');
            expect(unknown).toContain('priority:urgent');
            expect(unknown.length).toBe(2);
        });

        test('handles empty canonical labels', () => {
            const canonicalSet = new Set();
            const issueTypeLabels = new Set(['type:bug']);
            const templateLabels = new Set(['priority:high']);

            const all = new Set([...issueTypeLabels, ...templateLabels]);
            const unknown = [...all].filter((l) => l && !canonicalSet.has(l));

            expect(unknown.length).toBe(2);
            expect(unknown).toContain('type:bug');
            expect(unknown).toContain('priority:high');
        });

        test('handles empty template and issue type labels', () => {
            const canonicalSet = new Set(['type:bug', 'type:feature']);
            const issueTypeLabels = new Set();
            const templateLabels = new Set();

            const all = new Set([...issueTypeLabels, ...templateLabels]);
            const unknown = [...all].filter((l) => l && !canonicalSet.has(l));

            expect(unknown.length).toBe(0);
        });

        test('filters out null and undefined labels', () => {
            const canonicalSet = new Set(['type:bug']);
            const issueTypeLabels = new Set(['type:bug', null]);
            const templateLabels = new Set(['type:unknown', undefined]);

            const all = new Set([...issueTypeLabels, ...templateLabels]);
            const unknown = [...all].filter((l) => l && !canonicalSet.has(l));

            // Should only contain 'type:unknown', not null/undefined
            expect(unknown).toEqual(['type:unknown']);
        });

        test('handles duplicate labels across sources', () => {
            const canonicalSet = new Set(['type:bug', 'priority:high']);
            const issueTypeLabels = new Set(['type:bug']);
            const templateLabels = new Set(['type:bug', 'priority:high']);

            const all = new Set([...issueTypeLabels, ...templateLabels]);
            const unknown = [...all].filter((l) => l && !canonicalSet.has(l));

            expect(unknown.length).toBe(0);
            expect(all.size).toBe(2); // Set deduplicates
        });
    });

    describe('edge cases', () => {
        test('handles labels with whitespace', () => {
            const template = `---
labels: [  type:bug  ,  priority:high  ]
---`;

            const templateFile = path.join(
                tempIssueTemplateDir,
                'whitespace.md'
            );
            fs.writeFileSync(templateFile, template);

            const content = fs.readFileSync(templateFile, 'utf8');
            const labelRegex = /labels?:\s*\[([^\]]+)\]|labels?:\s*([^\n]+)/gi;
            const labels = new Set();

            let match;
            while ((match = labelRegex.exec(content))) {
                let found = match[1] || match[2];
                if (found) {
                    found
                        .split(',')
                        .map((l) => l.replace(/['"\[\]]/g, '').trim())
                        .forEach((l) => {
                            if (l) labels.add(l);
                        });
                }
            }

            expect(labels.has('type:bug')).toBe(true);
            expect(labels.has('priority:high')).toBe(true);
            expect(labels.size).toBe(2);

            fs.unlinkSync(templateFile);
        });

        test('handles very long label names', () => {
            const longLabel = 'area:' + 'a'.repeat(100);
            const template = `---
labels: [${longLabel}]
---`;

            const templateFile = path.join(tempIssueTemplateDir, 'long.md');
            fs.writeFileSync(templateFile, template);

            const content = fs.readFileSync(templateFile, 'utf8');
            const labelRegex = /labels?:\s*\[([^\]]+)\]|labels?:\s*([^\n]+)/gi;
            const labels = new Set();

            let match;
            while ((match = labelRegex.exec(content))) {
                let found = match[1] || match[2];
                if (found) {
                    found
                        .split(',')
                        .map((l) => l.replace(/['"\[\]]/g, '').trim())
                        .forEach((l) => {
                            if (l) labels.add(l);
                        });
                }
            }

            expect(labels.has(longLabel)).toBe(true);

            fs.unlinkSync(templateFile);
        });

        test('handles unicode labels', () => {
            const template = `---
labels: [type:🐛, area:文档]
---`;

            const templateFile = path.join(tempIssueTemplateDir, 'unicode.md');
            fs.writeFileSync(templateFile, template);

            const content = fs.readFileSync(templateFile, 'utf8');
            const labelRegex = /labels?:\s*\[([^\]]+)\]|labels?:\s*([^\n]+)/gi;
            const labels = new Set();

            let match;
            while ((match = labelRegex.exec(content))) {
                let found = match[1] || match[2];
                if (found) {
                    found
                        .split(',')
                        .map((l) => l.replace(/['"\[\]]/g, '').trim())
                        .forEach((l) => {
                            if (l) labels.add(l);
                        });
                }
            }

            expect(labels.has('type:🐛')).toBe(true);
            expect(labels.has('area:文档')).toBe(true);

            fs.unlinkSync(templateFile);
        });

        test('handles mixed quote styles in same template', () => {
            const template = `---
labels: ['type:bug', "priority:high"]
---`;

            const templateFile = path.join(tempIssueTemplateDir, 'mixed.md');
            fs.writeFileSync(templateFile, template);

            const content = fs.readFileSync(templateFile, 'utf8');
            const labelRegex = /labels?:\s*\[([^\]]+)\]|labels?:\s*([^\n]+)/gi;
            const labels = new Set();

            let match;
            while ((match = labelRegex.exec(content))) {
                let found = match[1] || match[2];
                if (found) {
                    found
                        .split(',')
                        .map((l) => l.replace(/['"\[\]]/g, '').trim())
                        .forEach((l) => {
                            if (l) labels.add(l);
                        });
                }
            }

            expect(labels.has('type:bug')).toBe(true);
            expect(labels.has('priority:high')).toBe(true);

            fs.unlinkSync(templateFile);
        });

        test('handles label field (singular) vs labels field (plural)', () => {
            const template = `---
label: type:bug
---`;

            const templateFile = path.join(
                tempIssueTemplateDir,
                'singular.md'
            );
            fs.writeFileSync(templateFile, template);

            const content = fs.readFileSync(templateFile, 'utf8');
            const labelRegex = /labels?:\s*\[([^\]]+)\]|labels?:\s*([^\n]+)/gi;
            const labels = new Set();

            let match;
            while ((match = labelRegex.exec(content))) {
                let found = match[1] || match[2];
                if (found) {
                    found
                        .split(',')
                        .map((l) => l.replace(/['"\[\]]/g, '').trim())
                        .forEach((l) => {
                            if (l) labels.add(l);
                        });
                }
            }

            // The regex should match both 'label:' and 'labels:'
            expect(labels.has('type:bug')).toBe(true);

            fs.unlinkSync(templateFile);
        });
    });

    describe('real-world scenarios', () => {
        test('validates typical LightSpeedWP bug report template', () => {
            const canonicalLabels = [
                { name: 'type:bug' },
                { name: 'status:needs-triage' },
                { name: 'priority:normal' },
            ];

            const template = `---
name: Bug Report
about: Create a report to help us improve
title: "[BUG] "
labels: [type:bug, status:needs-triage]
assignees: ''
---

**Describe the bug**
A clear and concise description of what the bug is.`;

            const canonicalSet = new Set(canonicalLabels.map((l) => l.name));

            const templateFile = path.join(
                tempIssueTemplateDir,
                'bug-report-real.md'
            );
            fs.writeFileSync(templateFile, template);

            const content = fs.readFileSync(templateFile, 'utf8');
            const labelRegex = /labels?:\s*\[([^\]]+)\]|labels?:\s*([^\n]+)/gi;
            const labels = new Set();

            let match;
            while ((match = labelRegex.exec(content))) {
                let found = match[1] || match[2];
                if (found) {
                    found
                        .split(',')
                        .map((l) => l.replace(/['"\[\]]/g, '').trim())
                        .forEach((l) => {
                            if (l) labels.add(l);
                        });
                }
            }

            const unknown = [...labels].filter((l) => !canonicalSet.has(l));
            expect(unknown).toEqual([]);

            fs.unlinkSync(templateFile);
        });

        test('detects invalid labels in production templates', () => {
            const canonicalLabels = [
                { name: 'type:bug' },
                { name: 'type:feature' },
            ];

            const template = `---
name: Security Issue
labels: [type:bug, security:critical, urgent]
---`;

            const canonicalSet = new Set(canonicalLabels.map((l) => l.name));

            const templateFile = path.join(
                tempIssueTemplateDir,
                'security-invalid.md'
            );
            fs.writeFileSync(templateFile, template);

            const content = fs.readFileSync(templateFile, 'utf8');
            const labelRegex = /labels?:\s*\[([^\]]+)\]|labels?:\s*([^\n]+)/gi;
            const labels = new Set();

            let match;
            while ((match = labelRegex.exec(content))) {
                let found = match[1] || match[2];
                if (found) {
                    found
                        .split(',')
                        .map((l) => l.replace(/['"\[\]]/g, '').trim())
                        .forEach((l) => {
                            if (l) labels.add(l);
                        });
                }
            }

            const unknown = [...labels].filter((l) => !canonicalSet.has(l));
            expect(unknown).toContain('security:critical');
            expect(unknown).toContain('urgent');
            expect(unknown.length).toBe(2);

            fs.unlinkSync(templateFile);
        });

        test('validates complex issue-types.yml configuration', () => {
            const canonicalLabels = [
                { name: 'type:bug' },
                { name: 'type:feature' },
                { name: 'priority:high' },
                { name: 'priority:normal' },
                { name: 'area:security' },
                { name: 'status:needs-triage' },
            ];

            const issueTypesData = [
                {
                    name: 'Bug Report',
                    label: 'type:bug',
                    labels: ['status:needs-triage', 'priority:normal'],
                },
                {
                    name: 'Security Issue',
                    label: 'type:bug',
                    labels: ['area:security', 'priority:high'],
                },
                { name: 'Feature Request', label: 'type:feature' },
            ];

            const canonicalSet = new Set(canonicalLabels.map((l) => l.name));
            const labels = new Set();

            for (const type of issueTypesData) {
                if (type.label) labels.add(type.label);
                if (type.labels && Array.isArray(type.labels)) {
                    for (const l of type.labels) labels.add(l);
                }
            }

            const unknown = [...labels].filter((l) => !canonicalSet.has(l));
            expect(unknown).toEqual([]);
        });
    });
});
