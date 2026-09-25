/**
 * Contract test for the Qodo PR-Agent shared skill and agent/skill integrations.
 *
 * Sources of truth:
 * - .github/specs/017-qodo-pr-agent-integration/contracts/skill-interface.md
 * - .github/specs/017-qodo-pr-agent-integration/contracts/responsibility-matrix.md
 */
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(__dirname, '../..');

function read(relativePath) {
  const full = path.join(repoRoot, relativePath);
  return fs.existsSync(full) ? fs.readFileSync(full, 'utf8') : '';
}

function extractSection(markdown, heading) {
  const start = markdown.indexOf(`\n${heading}\n`);
  if (start === -1) return null;
  const body = markdown.slice(start + heading.length + 2);
  const next = body.search(/^#{1,2} /m);
  return next === -1 ? body : body.slice(0, next);
}

function digestOf(text) {
  const match = text.match(/pragent\/pr-agent@(sha256:[a-f0-9]{64})/);
  return match ? match[1] : null;
}

const SKILL_DIR = 'skills/qodo-pr-agent';
const SCRIPT = `${SKILL_DIR}/scripts/run-qodo-pr-agent.sh`;

const INTEGRATED_ASSETS = [
  'skills/pr-review/SKILL.md',
  'agents/reviewer-agent/AGENT.md',
  'skills/gh-address-comments/SKILL.md',
  'agents/address-comments.agent.md',
  'agents/pr-agent/AGENT.md',
  'agents/labeling-agent/AGENT.md',
  'skills/label-governance/SKILL.md',
  'agents/changelog-agent/AGENT.md',
  'skills/changelog-generator/SKILL.md',
  'agents/document-reviewer-agent/AGENT.md',
  'skills/documentation-writer/SKILL.md',
  'agents/qa-subagent.agent.md',
];

describe('Qodo PR-Agent shared skill', () => {
  const skill = read(`${SKILL_DIR}/SKILL.md`);

  it('has the contracted frontmatter', () => {
    expect(skill).toMatch(/^---\nname: "lightspeed-qodo-pr-agent"\n/);
    expect(skill).toMatch(/^description: ".+"$/m);
  });

  it('documents the result fields and statuses', () => {
    for (const field of ['status', 'reason', 'tool', 'markdown', 'data', 'truncated']) {
      expect(skill).toContain(`\`${field}\``);
    }
    for (const status of ['ok', 'skipped', 'error']) {
      expect(skill).toContain(`\`${status}\``);
    }
  });

  it('has an executable runner that never publishes', () => {
    const full = path.join(repoRoot, SCRIPT);
    expect(fs.existsSync(full)).toBe(true);
    expect(fs.statSync(full).mode & 0o111).not.toBe(0);
    const script = read(SCRIPT);
    expect(script).toContain('publish_output=false');
    expect(script).toContain('propagate_tool_errors=true');
    expect(script).toContain('response_language=en-GB');
  });

  it('pins the same image digest as the reusable workflow', () => {
    const workflowDigest = digestOf(read('.github/workflows/qodo-pr-agent-reusable.yml'));
    expect(workflowDigest).not.toBeNull();
    expect(digestOf(read(SCRIPT))).toBe(workflowDigest);
  });

  it('is registered in the core skill group', () => {
    const registry = JSON.parse(read('skills/SKILL_REGISTRY.json'));
    const core = registry.groups.find((group) => group.id === 'core');
    expect(core.skills).toContain('lightspeed-qodo-pr-agent');
  });
});

describe('Qodo PR-Agent integration sections', () => {
  it.each(INTEGRATED_ASSETS)('%s documents invocation and fallback', (asset) => {
    const section = extractSection(read(asset), '## Qodo PR-Agent integration');
    expect(section).not.toBeNull();
    expect(section).toMatch(/fallback/i);
    expect(section).toMatch(/skipped/);
  });

  it('records similar_issue as deferred for the issue agent', () => {
    const issueAgent = read('agents/issue-agent/AGENT.md');
    expect(issueAgent).toMatch(/similar_issue`?[^\n]*deferred/i);
  });
});

describe('Qodo PR-Agent operations documentation', () => {
  it('documents the response to a secret repeated in a comment (spec edge case)', () => {
    const operations = extractSection(read('docs/QODO_PR_AGENT.md'), '## Operations');
    expect(operations).not.toBeNull();
    const section = extractSection(operations, '### Secrets in Qodo PR-Agent comments');
    expect(section).not.toBeNull();
    expect(section).toMatch(/known limitation/i);
    expect(section).toMatch(/delete the comment/i);
    expect(section).toMatch(/rotate/i);
    expect(section).toContain('QODO_PR_AGENT_ENABLED');
  });
});
