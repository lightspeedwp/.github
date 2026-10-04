/**
 * Pins the agent frontmatter shape the skill and agent validator actually
 * accepts.
 *
 * mode-thinking.agent.md moved its permissions between a top-level
 * `permissions:` list and a `metadata.permissions` string more than once while
 * #3774 was in review, and the two forms are not interchangeable: the
 * validator reads the top-level list. Commit 2c1efe2d56 settled it on the
 * top-level form and 823c4544fe taught the schema to allow it. This asserts
 * the agreed shape so a later "tidy-up" cannot silently break validation
 * again.
 */

const fs = require('node:fs');
const path = require('node:path');
const yaml = require('js-yaml');

const repositoryRoot = path.resolve(__dirname, '../../..');
const AGENT = 'agents/mode-thinking.agent.md';

function frontmatter(relative) {
  const raw = fs.readFileSync(path.join(repositoryRoot, relative), 'utf8');
  const match = /^---\n([\s\S]*?)\n---\n/.exec(raw);

  expect(match).not.toBeNull();

  return yaml.load(match[1]);
}

describe('mode-thinking agent frontmatter', () => {
  it('parses', () => {
    expect(() => frontmatter(AGENT)).not.toThrow();
  });

  it('declares permissions as a top-level list', () => {
    const data = frontmatter(AGENT);

    expect(Array.isArray(data.permissions)).toBe(true);
    expect(data.permissions).toEqual(expect.arrayContaining(['read', 'write', 'github:repo']));
  });

  it('does not move permissions into metadata', () => {
    const data = frontmatter(AGENT);

    expect(data.metadata?.permissions).toBeUndefined();
  });
});
