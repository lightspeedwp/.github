const fs = require('fs');
const path = require('path');
const os = require('os');
const { detectRepoType } = require('../../skills/repo-type-detection');
const { validateFrontmatter } = require('../../skills/frontmatter-validation');
const { extractMetadata } = require('../../skills/metadata-extraction');
const { applyStandards } = require('../../skills/apply-standards');
const { generateBadges, injectBadges } = require('../../skills/generate-badges');

describe('Meta Agent v2.0 - Full Workflow Integration', () => {
  let tempDir;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'meta-agent-integration-'));
  });

  afterEach(() => {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true });
    }
  });

  describe('Block Plugin Workflow', () => {
    beforeEach(() => {
      // Create a block plugin repo structure
      fs.writeFileSync(
        path.join(tempDir, 'block.json'),
        JSON.stringify({ name: 'test/block', title: 'Test Block' })
      );
      fs.writeFileSync(
        path.join(tempDir, 'package.json'),
        JSON.stringify({ name: 'test-block', version: '1.0.0', license: 'MIT' })
      );
      fs.writeFileSync(
        path.join(tempDir, 'README.md'),
        '---\ntitle: Test Block Plugin\n---\n# Test Block\noptimized component'
      );
    });

    it('detects repo type correctly', () => {
      const repoType = detectRepoType(tempDir);
      expect(repoType).toBe('block-plugin');
    });

    it('extracts metadata for block-plugin', () => {
      const repoType = detectRepoType(tempDir);
      const metadata = extractMetadata(tempDir, repoType);
      expect(metadata.blockMetadata).toBeDefined();
      expect(metadata.foundMarkers.blockJson).toBe(true);
    });

    it('applies standards to README', () => {
      const readmePath = path.join(tempDir, 'README.md');
      const result = applyStandards(readmePath, { repoType: 'block-plugin', dryRun: false });
      expect(result.success).toBe(true);
      expect(result.changes.length).toBeGreaterThan(0);
    });

    it('generates badges for block-plugin', () => {
      const result = generateBadges(tempDir, 'block-plugin');
      expect(result.badges.some(b => b.name === 'License')).toBe(true);
      expect(result.badges.some(b => b.name === 'Version')).toBe(true);
    });

    it('injects badges into README', () => {
      const readmePath = path.join(tempDir, 'README.md');
      const badges = generateBadges(tempDir, 'block-plugin');
      const injection = injectBadges(readmePath, badges.markdownBlock);
      expect(injection.success).toBe(true);
      fs.writeFileSync(readmePath, injection.content);
      const updated = fs.readFileSync(readmePath, 'utf8');
      expect(updated).toContain('Badges');
    });

    it('completes full workflow without errors', () => {
      const repoType = detectRepoType(tempDir);
      const readmePath = path.join(tempDir, 'README.md');

      // Step 1: Apply standards
      const standardsResult = applyStandards(readmePath, { repoType, dryRun: false });
      expect(standardsResult.success).toBe(true);

      // Step 2: Generate badges
      const badgesResult = generateBadges(tempDir, repoType);
      expect(badgesResult.badges).toBeDefined();

      // Step 3: Inject badges
      const injectionResult = injectBadges(readmePath, badgesResult.markdownBlock);
      expect(injectionResult.success).toBe(true);

      // Verify final state
      const finalContent = fs.readFileSync(readmePath, 'utf8');
      expect(finalContent).toContain('---');
      expect(finalContent).toContain('title:');
      expect(finalContent).toContain('optimised'); // UK English applied
    });
  });

  describe('Control-Plane Workflow', () => {
    beforeEach(() => {
      // Create a control-plane repo structure
      fs.mkdirSync(path.join(tempDir, '.github', 'agents'), { recursive: true });
      fs.mkdirSync(path.join(tempDir, '.github', 'workflows'));
      fs.writeFileSync(
        path.join(tempDir, 'CLAUDE.md'),
        '---\ntitle: CLAUDE.md\ncategory: governance\n---\n# Organization Standards'
      );
    });

    it('detects control-plane repo type', () => {
      const repoType = detectRepoType(tempDir);
      expect(repoType).toBe('control-plane');
    });

    it('extracts control-plane metadata', () => {
      const repoType = detectRepoType(tempDir);
      const metadata = extractMetadata(tempDir, repoType);
      expect(metadata.foundMarkers.agents).toBe(true);
      expect(metadata.foundMarkers.workflows).toBe(true);
    });

    it('applies standards to governance file', () => {
      const claudePath = path.join(tempDir, 'CLAUDE.md');
      const result = applyStandards(claudePath, { repoType: 'control-plane', dryRun: false });
      expect(result.success).toBe(true);
    });

    it('generates badges for control-plane', () => {
      const result = generateBadges(tempDir, 'control-plane');
      expect(result.badges.some(b => b.name.includes('Governance'))).toBe(true);
    });

    it('completes control-plane workflow', () => {
      const repoType = detectRepoType(tempDir);
      const claudePath = path.join(tempDir, 'CLAUDE.md');

      // Apply standards
      applyStandards(claudePath, { repoType, dryRun: false });

      // Generate badges
      const badgesResult = generateBadges(tempDir, repoType);
      expect(badgesResult.badges.length).toBeGreaterThan(0);
    });
  });

  describe('Block Theme Workflow', () => {
    beforeEach(() => {
      fs.writeFileSync(path.join(tempDir, 'theme.json'), '{"name": "Test Theme"}');
      fs.writeFileSync(path.join(tempDir, 'style.css'), 'Text Domain: test-theme\nVersion: 2.0.0');
      fs.writeFileSync(
        path.join(tempDir, 'README.md'),
        '---\ntitle: Block Theme\n---\n# My Theme\nCustomizable and organised.'
      );
    });

    it('detects block-theme repo type', () => {
      const repoType = detectRepoType(tempDir);
      expect(repoType).toBe('block-theme');
    });

    it('extracts theme metadata', () => {
      const repoType = detectRepoType(tempDir);
      const metadata = extractMetadata(tempDir, repoType);
      expect(metadata.themeMetadata).toBeDefined();
    });

    it('applies UK English to theme README', () => {
      const readmePath = path.join(tempDir, 'README.md');
      applyStandards(readmePath, { repoType: 'block-theme', dryRun: false });
      const updated = fs.readFileSync(readmePath, 'utf8');
      expect(updated).toContain('organised');
    });

    it('completes theme workflow', () => {
      const repoType = detectRepoType(tempDir);
      const readmePath = path.join(tempDir, 'README.md');

      // All steps
      applyStandards(readmePath, { repoType, dryRun: false });
      const badges = generateBadges(tempDir, repoType);
      expect(badges.repoType).toBe('block-theme');
    });
  });

  describe('Multi-file Workflow', () => {
    beforeEach(() => {
      // Create plugin structure with multiple files
      fs.writeFileSync(path.join(tempDir, 'block.json'), '{}');
      fs.writeFileSync(path.join(tempDir, 'README.md'), '---\ntitle: README\n---\n# Plugin');
      fs.writeFileSync(
        path.join(tempDir, 'DEVELOPMENT.md'),
        '---\ntitle: Development\n---\n# Contributing\norganized workflow'
      );
      fs.writeFileSync(
        path.join(tempDir, 'CHANGELOG.md'),
        '---\ntitle: Changelog\n---\n# Changes\noptimization improvements'
      );
    });

    it('applies standards to multiple files', () => {
      const files = ['README.md', 'DEVELOPMENT.md', 'CHANGELOG.md'].map(f => path.join(tempDir, f));
      const results = files.map(f => applyStandards(f, { repoType: 'block-plugin', dryRun: false }));
      expect(results.every(r => r.success)).toBe(true);
    });

    it('preserves file independence', () => {
      const readmePath = path.join(tempDir, 'README.md');
      const devPath = path.join(tempDir, 'DEVELOPMENT.md');

      applyStandards(readmePath, { dryRun: false });
      applyStandards(devPath, { dryRun: false });

      const readme = fs.readFileSync(readmePath, 'utf8');
      const dev = fs.readFileSync(devPath, 'utf8');

      expect(readme).toContain('README');
      expect(dev).toContain('Development');
      expect(readme).not.toContain('Development');
    });

    it('applies UK English consistently across files', () => {
      const devPath = path.join(tempDir, 'DEVELOPMENT.md');
      const changelogPath = path.join(tempDir, 'CHANGELOG.md');

      applyStandards(devPath, { dryRun: false });
      applyStandards(changelogPath, { dryRun: false });

      const devContent = fs.readFileSync(devPath, 'utf8');
      const changelogContent = fs.readFileSync(changelogPath, 'utf8');

      // Check that UK English corrections were applied
      expect(devContent).toContain('organised');
      expect(changelogContent).toContain('optimisation');
    });
  });

  describe('Error Handling & Edge Cases', () => {
    it('handles missing files gracefully', () => {
      const result = applyStandards(path.join(tempDir, 'nonexistent.md'));
      expect(result.success).toBe(false);
    });

    it('respects opt-out markers', () => {
      const filePath = path.join(tempDir, 'test.md');
      fs.writeFileSync(
        filePath,
        '<!-- meta:ignore -->\n---\ntitle: Test\n---\noptimized'
      );
      const result = applyStandards(filePath);
      expect(result.skipped).toBe(true);
    });

    it('handles dry-run mode consistently', () => {
      const filePath = path.join(tempDir, 'test.md');
      fs.writeFileSync(filePath, '---\ntitle: Test\n---\noptimized content');
      const originalContent = fs.readFileSync(filePath, 'utf8');

      const dryRunResult = applyStandards(filePath, { dryRun: true });
      const afterDryRun = fs.readFileSync(filePath, 'utf8');

      expect(afterDryRun).toBe(originalContent); // File unchanged
      expect(dryRunResult.changes.length).toBeGreaterThan(0); // But changes detected
    });
  });
});
