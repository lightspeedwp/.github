/**
 * Tests for the shared `implementation` path rule used by the agent spec
 * validator and the agent index generator.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { describe, it, expect } from '@jest/globals';
import {
  isRootRelativeImplementation,
  resolveImplementationDir,
} from '../../../.github/scripts/implementation-path.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, '../../..');

describe('implementation path rule', () => {
  it.each([
    ['agents/changelog-agent/', true],
    ['./agents/x/', true],
    ['.', true],
    ['discovery-agent/', true],
    ['discovery-agent', false],
  ])('%s is root-relative: %s', (value, expected) => {
    expect(isRootRelativeImplementation(value)).toBe(expected);
  });

  it('resolves a root-relative value from the repository root, never under agents/agents', () => {
    expect(resolveImplementationDir('agents/changelog-agent/', '/repo')).toBe(
      path.resolve('/repo', 'agents/changelog-agent/')
    );
    expect(resolveImplementationDir('agents/changelog-agent/', '/repo')).not.toContain(
      path.join('agents', 'agents')
    );
  });

  it('resolves a bare legacy name relative to agents/', () => {
    expect(resolveImplementationDir('changelog-agent', '/repo')).toBe(
      path.join('/repo', 'agents', 'changelog-agent')
    );
  });

  it('resolves to an existing folder for every spec that declares one', () => {
    const specs = [];
    const walk = (dir) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(full);
        else if (entry.name.endsWith('.agent.md')) specs.push(full);
      }
    };
    walk(path.join(repoRoot, 'agents'));
    const missing = [];
    for (const spec of specs) {
      const match = fs
        .readFileSync(spec, 'utf8')
        .match(/^implementation:\s*["']?([^"'\n]+?)["']?\s*$/m);
      if (!match) continue;
      if (!fs.existsSync(resolveImplementationDir(match[1], repoRoot))) {
        missing.push(`${path.relative(repoRoot, spec)} -> ${match[1]}`);
      }
    }
    expect(missing).toEqual([]);
  });
});
