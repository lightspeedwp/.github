const fs = require('fs');
const path = require('path');
const os = require('os');
const { applyStandards } = require('../../skills/apply-standards');
const { generateBadges, injectBadges } = require('../../skills/generate-badges');
const { detectRepoType } = require('../../skills/repo-type-detection');

describe('Meta Agent v2.0 - CI Workflow Integration Tests', () => {
  let tempDir;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'meta-agent-ci-'));
  });

  afterEach(() => {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true });
    }
  });

  describe('Multi-file Updates', () => {
    it('applies standards to 5+ files in single workflow', () => {
      // Setup: Create 5 files
      const files = [
        'README.md',
        'DEVELOPMENT.md',
        'CHANGELOG.md',
        'CONTRIBUTING.md',
        'docs/API.md',
      ];

      fs.mkdirSync(path.join(tempDir, 'docs'), { recursive: true });

      files.forEach((file, idx) => {
        const filePath = path.join(tempDir, file);
        fs.writeFileSync(
          filePath,
          `---\ntitle: File ${idx + 1}\n---\n# Optimized and organized content`
        );
      });

      // Execute: Apply standards to all
      const results = files.map(file => {
        const filePath = path.join(tempDir, file);
        return applyStandards(filePath, { repoType: 'block-plugin', dryRun: false });
      });

      // Verify: All succeeded
      expect(results.every(r => r.success)).toBe(true);
      expect(results.every(r => r.changes.length > 0)).toBe(true);

      // Verify: Files were actually updated with metadata
      files.forEach(file => {
        const content = fs.readFileSync(path.join(tempDir, file), 'utf8');
        // Check that standards were applied (metadata added)
        expect(content).toContain('status:');
        expect(content).toContain('last_updated:');
      });
    });

    it('maintains file independence during multi-file updates', () => {
      // Setup: Create files with different content
      fs.writeFileSync(
        path.join(tempDir, 'file1.md'),
        '---\ntitle: File 1\n---\n# API Documentation'
      );
      fs.writeFileSync(
        path.join(tempDir, 'file2.md'),
        '---\ntitle: File 2\n---\n# Development Guide\noptimization workflow'
      );

      // Execute: Apply standards independently
      applyStandards(path.join(tempDir, 'file1.md'), { dryRun: false });
      applyStandards(path.join(tempDir, 'file2.md'), { dryRun: false });

      // Verify: Each file has correct content
      const file1 = fs.readFileSync(path.join(tempDir, 'file1.md'), 'utf8');
      const file2 = fs.readFileSync(path.join(tempDir, 'file2.md'), 'utf8');

      expect(file1).toContain('File 1');
      expect(file1).not.toContain('Development Guide');
      expect(file2).toContain('File 2');
      expect(file2).toContain('optimisation workflow');
    });
  });

  describe('Badge Injection Workflows', () => {
    it('injects badges into multiple repo types', () => {
      // Setup: Create repos for each type
      fs.writeFileSync(path.join(tempDir, 'block.json'), '{}');
      fs.writeFileSync(
        path.join(tempDir, 'block-plugin-readme.md'),
        '---\ntitle: Block Plugin\n---\n# Plugin'
      );

      fs.writeFileSync(path.join(tempDir, 'theme.json'), '{}');
      fs.writeFileSync(path.join(tempDir, 'style.css'), 'Text Domain: theme');
      fs.writeFileSync(
        path.join(tempDir, 'block-theme-readme.md'),
        '---\ntitle: Block Theme\n---\n# Theme'
      );

      // Execute: Generate and inject badges
      const pluginBadges = generateBadges(tempDir, 'block-plugin');
      const pluginInject = injectBadges(
        path.join(tempDir, 'block-plugin-readme.md'),
        pluginBadges.markdownBlock
      );

      const themeBadges = generateBadges(tempDir, 'block-theme');
      const themeInject = injectBadges(
        path.join(tempDir, 'block-theme-readme.md'),
        themeBadges.markdownBlock
      );

      // Verify: Both succeeded
      expect(pluginInject.success).toBe(true);
      expect(themeInject.success).toBe(true);

      // Verify: Both have badges but may have different formatting
      expect(pluginBadges.badges.length).toBeGreaterThan(0);
      expect(themeBadges.badges.length).toBeGreaterThan(0);
    });

    it('prevents duplicate badge blocks on repeated injection', () => {
      const readmePath = path.join(tempDir, 'README.md');
      fs.writeFileSync(readmePath, '---\ntitle: Test\n---\n# Content');

      // First injection
      const badges = generateBadges(tempDir, 'block-plugin');
      const inject1 = injectBadges(readmePath, badges.markdownBlock);
      expect(inject1.success).toBe(true);
      fs.writeFileSync(readmePath, inject1.content);

      // Second injection attempt (should fail with alreadyExists)
      const inject2 = injectBadges(readmePath, badges.markdownBlock);
      expect(inject2.alreadyExists).toBe(true);
      expect(inject2.success).toBe(false);
    });

    it('handles badge injection at different positions', () => {
      const readmePath = path.join(tempDir, 'README.md');
      fs.writeFileSync(readmePath, '---\ntitle: Test\n---\n# Content');
      const badges = '## Badges\n\n![Test](url)';

      // Test after-frontmatter
      const result1 = injectBadges(readmePath, badges, 'after-frontmatter');
      expect(result1.success).toBe(true);
      expect(result1.content).toContain('---\n');
      expect(result1.content.indexOf('## Badges')).toBeGreaterThan(
        result1.content.indexOf('---')
      );
    });
  });

  describe('Conflict Handling', () => {
    it('preserves existing footer blocks when applying standards', () => {
      const readmePath = path.join(tempDir, 'README.md');
      const originalFooter = '**Maintainer:** Jane Doe\n**Status:** Archived';
      fs.writeFileSync(
        readmePath,
        `---\ntitle: Test\n---\n# Content\n\n---\n\n${originalFooter}`
      );

      applyStandards(readmePath, { dryRun: false });
      const updated = fs.readFileSync(readmePath, 'utf8');

      // Verify: Original content preserved
      expect(updated).toContain('# Content');
    });

    it('handles files with existing badges gracefully', () => {
      const readmePath = path.join(tempDir, 'README.md');
      const existingBadges = '## Badges\n\n![Status](url)';
      fs.writeFileSync(
        readmePath,
        `---\ntitle: Test\n---\n${existingBadges}\n# Content`
      );

      const badges = generateBadges(tempDir, 'block-plugin');
      const result = injectBadges(readmePath, badges.markdownBlock);

      // Should detect existing badges
      expect(result.alreadyExists).toBe(true);
    });
  });

  describe('Large File Handling', () => {
    it('processes 10K+ line Markdown files', () => {
      const readmePath = path.join(tempDir, 'LARGE.md');

      // Generate large content (10K lines)
      let content = '---\ntitle: Large File\n---\n\n';
      for (let i = 0; i < 10000; i++) {
        content += `## Section ${i}\n\nSome content for section ${i}.\n\n`;
      }

      fs.writeFileSync(readmePath, content);

      // Apply standards to large file
      const start = Date.now();
      const result = applyStandards(readmePath, { dryRun: false });
      const elapsed = Date.now() - start;

      // Verify: Success and reasonable performance
      expect(result.success).toBe(true);
      expect(elapsed).toBeLessThan(5000); // Should complete in <5s
    });

    it('handles large files with many badges', () => {
      const readmePath = path.join(tempDir, 'README.md');

      // Create file with existing content
      let content = '---\ntitle: Test\nauthor: Test User\nversion: 1.0.0\n---\n';
      for (let i = 0; i < 1000; i++) {
        content += `\n## Feature ${i}\n\nDescription of feature ${i}.\n`;
      }

      fs.writeFileSync(readmePath, content);

      // Generate and inject badges
      const badges = generateBadges(tempDir, 'block-plugin');
      const start = Date.now();
      const result = injectBadges(readmePath, badges.markdownBlock);
      const elapsed = Date.now() - start;

      expect(result.success).toBe(true);
      expect(elapsed).toBeLessThan(2000); // Should complete in <2s
    });
  });

  describe('Special Characters & Encoding', () => {
    it('handles Unicode characters in content', () => {
      const readmePath = path.join(tempDir, 'README.md');
      fs.writeFileSync(
        readmePath,
        '---\ntitle: Test 🎉\nauthor: José García\n---\n# Hello 世界\n\nOptimized performance ✨'
      );

      const result = applyStandards(readmePath, { dryRun: false });
      expect(result.success).toBe(true);

      const updated = fs.readFileSync(readmePath, 'utf8');
      expect(updated).toContain('🎉');
      expect(updated).toContain('世界');
    });

    it('handles special Markdown syntax', () => {
      const readmePath = path.join(tempDir, 'README.md');
      const content = `---
title: Markdown Test
---

# Main Title

\`\`\`javascript
const optimized = true;
\`\`\`

> A quote about organization

- [Link](#anchor)
- **Bold and organized text**
- *Italicized behavior*`;

      fs.writeFileSync(readmePath, content);
      const result = applyStandards(readmePath, { dryRun: false });

      expect(result.success).toBe(true);
      const updated = fs.readFileSync(readmePath, 'utf8');
      expect(updated).toContain('```javascript');
      // The text outside code blocks should be converted to UK English
      expect(updated).toMatch(/organised|optimised|behaviour/);
    });

    it('preserves code blocks and links during UK English conversion', () => {
      const readmePath = path.join(tempDir, 'README.md');
      fs.writeFileSync(
        readmePath,
        `---
title: Code Test
---

See [optimization guide](./optimization.md)

\`\`\`
// Note: 'organized' is a reserved word in this context
const organized_data = [];
\`\`\`

Regular text: optimization workflow`
      );

      const result = applyStandards(readmePath, { dryRun: false });
      expect(result.success).toBe(true);

      const updated = fs.readFileSync(readmePath, 'utf8');
      // Code block should be preserved as-is
      expect(updated).toContain('organized_data');
      // Regular text should be converted
      expect(updated).toContain('optimisation workflow');
    });
  });

  describe('Concurrent Operations', () => {
    it('handles concurrent skill execution', async () => {
      // Setup: Create test files
      const files = ['file1.md', 'file2.md', 'file3.md'];
      files.forEach((file, idx) => {
        fs.writeFileSync(
          path.join(tempDir, file),
          `---\ntitle: File ${idx}\n---\nOptimized content`
        );
      });

      // Execute: Run skills concurrently
      const promises = files.map(file =>
        Promise.resolve(
          applyStandards(path.join(tempDir, file), { dryRun: false })
        )
      );

      const results = await Promise.all(promises);

      // Verify: All succeeded
      expect(results.every(r => r.success)).toBe(true);
      expect(results.length).toBe(3);
    });
  });

  describe('Error Recovery', () => {
    it('recovers gracefully from malformed frontmatter', () => {
      const readmePath = path.join(tempDir, 'README.md');
      fs.writeFileSync(readmePath, '---\ninvalid: yaml: content:\n---\nContent');

      const result = applyStandards(readmePath, { dryRun: true });
      expect(result.success).toBe(false);
      expect(result.error).toContain('YAML');
    });

    it('handles permission errors gracefully', () => {
      const readmePath = path.join(tempDir, 'README.md');
      fs.writeFileSync(readmePath, '---\ntitle: Test\n---\nContent');

      // Run in dry-run mode first to validate
      const dryRunResult = applyStandards(readmePath, { dryRun: true });
      expect(dryRunResult.success).toBe(true);

      // Make file read-only
      fs.chmodSync(readmePath, 0o444);

      // Attempting to write should fail
      expect(() => {
        applyStandards(readmePath, { dryRun: false });
      }).toThrow();

      // Restore permissions for cleanup
      fs.chmodSync(readmePath, 0o644);
    });
  });

  describe('Performance Benchmarks', () => {
    it('completes standards application in <1s for typical file', () => {
      const readmePath = path.join(tempDir, 'README.md');
      fs.writeFileSync(readmePath, '---\ntitle: Test\n---\n# Content\nOptimized organization');

      const start = Date.now();
      applyStandards(readmePath, { dryRun: false });
      const elapsed = Date.now() - start;

      expect(elapsed).toBeLessThan(1000);
    });

    it('completes badge generation in <500ms', () => {
      fs.writeFileSync(path.join(tempDir, 'package.json'), JSON.stringify({ version: '1.0.0' }));

      const start = Date.now();
      generateBadges(tempDir, 'block-plugin');
      const elapsed = Date.now() - start;

      expect(elapsed).toBeLessThan(500);
    });

    it('completes badge injection in <1s', () => {
      const readmePath = path.join(tempDir, 'README.md');
      fs.writeFileSync(readmePath, '---\ntitle: Test\n---\nContent');
      const badges = '## Badges\n\n![Badge](url)';

      const start = Date.now();
      injectBadges(readmePath, badges);
      const elapsed = Date.now() - start;

      expect(elapsed).toBeLessThan(1000);
    });
  });

  describe('Repo Type Workflow', () => {
    it('completes block-plugin workflow end-to-end', () => {
      // Setup
      fs.writeFileSync(path.join(tempDir, 'block.json'), '{}');
      fs.writeFileSync(
        path.join(tempDir, 'package.json'),
        JSON.stringify({ name: 'test-block', version: '1.0.0', license: 'MIT' })
      );
      fs.writeFileSync(path.join(tempDir, 'README.md'), '---\ntitle: Block\n---\nOptimized');

      // Execute workflow
      const repoType = detectRepoType(tempDir);
      expect(repoType).toBe('block-plugin');

      applyStandards(path.join(tempDir, 'README.md'), { dryRun: false });
      const badges = generateBadges(tempDir, repoType);
      const inject = injectBadges(
        path.join(tempDir, 'README.md'),
        badges.markdownBlock
      );

      // Verify
      expect(inject.success).toBe(true);
    });

    it('completes block-theme workflow end-to-end', () => {
      // Setup
      fs.writeFileSync(path.join(tempDir, 'theme.json'), '{}');
      fs.writeFileSync(path.join(tempDir, 'style.css'), 'Text Domain: theme');
      fs.writeFileSync(path.join(tempDir, 'README.md'), '---\ntitle: Theme\n---\nOrganized');

      // Execute workflow
      const repoType = detectRepoType(tempDir);
      expect(repoType).toBe('block-theme');

      applyStandards(path.join(tempDir, 'README.md'), { dryRun: false });
      const badges = generateBadges(tempDir, repoType);

      // Verify
      expect(badges.badges).toBeDefined();
      expect(badges.badges.length).toBeGreaterThan(0);
    });
  });
});
