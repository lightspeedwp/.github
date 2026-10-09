const fs = require('fs');
const path = require('path');
const { buildDefinition, generateAll } = require('../generate-agent-defs.cjs');

const ROOT = path.join(__dirname, '..', '..', '..');
const GENERATED = '.claude/agents/changelog-agent.md';
const CANONICAL = 'agents/changelog-agent/AGENT.md';

describe('generate-agent-defs', () => {
  test('thin definition carries valid Claude frontmatter', () => {
    const text = buildDefinition(CANONICAL);
    const match = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    expect(match).not.toBeNull();
    expect(match[1]).toMatch(/^name: changelog-agent$/m);
    expect(match[1]).toMatch(/^description: .+/m);
    expect(match[2]).toContain(CANONICAL);
  });

  test('checked-in definition matches generated output (no drift)', () => {
    const text = buildDefinition(CANONICAL);
    const current = fs.readFileSync(path.join(ROOT, GENERATED), 'utf8');
    expect(current).toBe(text);
  });

  test('generateAll reports no drift on a clean tree', () => {
    const results = generateAll({ write: false });
    expect(results).toHaveLength(1);
    expect(results[0].drifted).toBe(false);
  });
});
