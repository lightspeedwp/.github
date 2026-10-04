import path from 'path';
import runActionlint from '../run-actionlint.cjs';

const { resolveActionlint, IGNORE_PATTERNS } = runActionlint;

describe('run-actionlint', () => {
  it('prefers an actionlint on the PATH on every platform', () => {
    for (const [platform, arch] of [
      ['darwin', 'arm64'],
      ['win32', 'x64'],
      ['linux', 'arm64'],
      ['linux', 'x64'],
    ]) {
      expect(resolveActionlint({ onPath: true, hasLocal: true, platform, arch })).toEqual({
        command: 'actionlint',
      });
    }
  });

  it('uses the checked-in x86-64 Linux binary only where it can run', () => {
    expect(
      resolveActionlint({ onPath: false, hasLocal: true, platform: 'linux', arch: 'x64' })
    ).toEqual({ command: expect.stringMatching(new RegExp(`${path.sep}actionlint$`)) });

    for (const [platform, arch] of [
      ['darwin', 'arm64'],
      ['win32', 'x64'],
      ['linux', 'arm64'],
    ]) {
      const result = resolveActionlint({ onPath: false, hasLocal: true, platform, arch });
      expect(result.command).toBeUndefined();
      expect(result.error).toContain('brew install actionlint');
    }
  });

  it('explains how to install it when nothing can run', () => {
    const result = resolveActionlint({
      onPath: false,
      hasLocal: false,
      platform: 'linux',
      arch: 'x64',
    });

    expect(result.error).toContain('not found on your PATH');
  });

  it('keeps the ignore patterns the CI workflow uses', () => {
    const fs = require('fs');
    const workflow = fs.readFileSync(
      path.join(process.cwd(), '.github', 'workflows', 'workflow-lint.yml'),
      'utf8'
    );
    for (const pattern of IGNORE_PATTERNS) {
      // The workflow writes the regular expression with its own quoting; the
      // distinctive text before any escape must appear in it.
      expect(workflow).toContain(pattern.split('\\')[0]);
    }
  });
});
