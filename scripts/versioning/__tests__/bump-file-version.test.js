/**
 * Tests for the single-file version bump tool: top-level and nested (`metadata.version`) frontmatter.
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const yaml = require('js-yaml');
const {
  bumpFileVersion,
  extractFrontmatter,
  getVersionContainer,
} = require('../bump-file-version.cjs');

const REPO_VERSION = '9.9.0';
let dir;

beforeEach(() => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), 'bump-version-'));
  jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
  fs.rmSync(dir, { recursive: true, force: true });
});

const write = (name, frontmatter) => {
  const file = path.join(dir, name);
  fs.writeFileSync(file, `---\n${frontmatter}\n---\n\n# Body\n`, 'utf8');
  return file;
};

const read = (file) => extractFrontmatter(fs.readFileSync(file, 'utf8')).frontmatter;

describe('getVersionContainer', () => {
  it('returns metadata when it holds a version', () => {
    const frontmatter = { name: 'x', metadata: { version: '0.1.1' } };
    expect(getVersionContainer(frontmatter)).toBe(frontmatter.metadata);
  });

  it('returns the frontmatter when metadata has no version or is not an object', () => {
    const noVersion = { version: '1.0.0', metadata: { owner: 'a' } };
    expect(getVersionContainer(noVersion)).toBe(noVersion);
    const scalar = { version: '1.0.0', metadata: 'text' };
    expect(getVersionContainer(scalar)).toBe(scalar);
    const none = { version: '1.0.0' };
    expect(getVersionContainer(none)).toBe(none);
  });
});

describe('bumpFileVersion', () => {
  it('bumps a top-level version and leaves no metadata key', () => {
    const file = write('top.md', 'name: top\nversion: 1.2.3');
    bumpFileVersion(file, 'patch', REPO_VERSION);
    const frontmatter = read(file);
    expect(frontmatter.version).toBe('1.2.4');
    expect(frontmatter.metadata).toBeUndefined();
  });

  it('bumps metadata.version in place and adds no top-level version', () => {
    const file = write('nested.md', 'name: nested\nmetadata:\n  version: "0.1.1"');
    bumpFileVersion(file, 'patch', REPO_VERSION);
    const frontmatter = read(file);
    expect(frontmatter.metadata.version).toBe('0.1.2');
    expect(frontmatter).not.toHaveProperty('version');
  });

  it('keeps other metadata keys when it bumps the nested version', () => {
    const file = write('keys.md', 'name: keys\nmetadata:\n  owner: lightspeed\n  version: "0.1.1"');
    bumpFileVersion(file, 'minor', REPO_VERSION);
    const frontmatter = read(file);
    expect(frontmatter.metadata).toEqual({ owner: 'lightspeed', version: '0.2.0' });
    expect(yaml.dump(frontmatter)).not.toMatch(/^version:/m);
  });
});
