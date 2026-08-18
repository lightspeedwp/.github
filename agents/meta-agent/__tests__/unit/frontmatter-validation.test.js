const fs = require('fs');
const path = require('path');
const os = require('os');
const { validateFrontmatter } = require('../../skills/frontmatter-validation');

describe('frontmatter-validation skill', () => {
  let tempDir;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'meta-agent-test-'));
  });

  afterEach(() => {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true });
    }
  });

  describe('validateFrontmatter', () => {
    it('validates correct frontmatter', () => {
      const filePath = path.join(tempDir, 'test.md');
      fs.writeFileSync(filePath, '---\ntitle: Test\nauthor: John\n---\nContent');
      const result = validateFrontmatter(filePath, { required: ['title', 'author'] });
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('detects missing required fields', () => {
      const filePath = path.join(tempDir, 'test.md');
      fs.writeFileSync(filePath, '---\ntitle: Test\n---\nContent');
      const result = validateFrontmatter(filePath, { required: ['title', 'author'] });
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('author'))).toBe(true);
    });

    it('returns error for non-existent file', () => {
      const result = validateFrontmatter('/nonexistent/file.md', {});
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain('not found');
    });

    it('returns error for file without frontmatter', () => {
      const filePath = path.join(tempDir, 'test.md');
      fs.writeFileSync(filePath, '# No frontmatter\nContent');
      const result = validateFrontmatter(filePath, {});
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain('No frontmatter');
    });

    it('parses and returns frontmatter', () => {
      const filePath = path.join(tempDir, 'test.md');
      fs.writeFileSync(filePath, '---\ntitle: Test Title\nversion: 1.0.0\n---\nContent');
      const result = validateFrontmatter(filePath, {});
      expect(result.frontmatter).toBeDefined();
      expect(result.frontmatter.title).toBe('Test Title');
      expect(result.frontmatter.version).toBe('1.0.0');
    });

    it('handles YAML parsing errors', () => {
      const filePath = path.join(tempDir, 'test.md');
      fs.writeFileSync(filePath, '---\ninvalid: yaml: content:\n---\nContent');
      const result = validateFrontmatter(filePath, {});
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('YAML'))).toBe(true);
    });

    it('handles arrays in schema.required', () => {
      const filePath = path.join(tempDir, 'test.md');
      fs.writeFileSync(filePath, '---\ntitle: Test\nversion: 1.0.0\n---\nContent');
      const schema = { required: ['title', 'version', 'author'] };
      const result = validateFrontmatter(filePath, schema);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBe(1);
      expect(result.errors[0]).toContain('author');
    });

    it('handles complex YAML structures', () => {
      const filePath = path.join(tempDir, 'test.md');
      fs.writeFileSync(filePath, '---\ntitle: Test\nauthor:\n  name: John\n  email: john@example.com\n---\nContent');
      const result = validateFrontmatter(filePath, { required: ['title', 'author'] });
      expect(result.valid).toBe(true);
      expect(result.frontmatter.author.name).toBe('John');
    });
  });

  describe('edge cases', () => {
    it('handles frontmatter with special characters', () => {
      const filePath = path.join(tempDir, 'test.md');
      fs.writeFileSync(filePath, '---\ntitle: "Test: Special & Characters"\n---\nContent');
      const result = validateFrontmatter(filePath, {});
      expect(result.valid).toBe(true);
      expect(result.frontmatter.title).toContain('Special');
    });

    it('handles multiline YAML values', () => {
      const filePath = path.join(tempDir, 'test.md');
      fs.writeFileSync(filePath, '---\ntitle: Test\ndescription: |\n  Line 1\n  Line 2\n---\nContent');
      const result = validateFrontmatter(filePath, { required: ['description'] });
      expect(result.valid).toBe(true);
    });

    it('handles empty frontmatter', () => {
      const filePath = path.join(tempDir, 'test.md');
      fs.writeFileSync(filePath, '---\n\n---\nContent');
      const result = validateFrontmatter(filePath, {});
      expect(result.valid).toBe(true);
    });
  });
});
