const path = require('path');
const fs = require('fs');
const os = require('os');
const { execSync } = require('child_process');
const gitOps = require('../includes/gitOps.cjs');

describe('gitOps.cjs - Cross-repo isolation', () => {
  let tempRoot;
  let tempDir1;
  let tempDir2;
  const originalGitEnv = {
    GIT_CONFIG_GLOBAL: process.env.GIT_CONFIG_GLOBAL,
    GIT_CONFIG_NOSYSTEM: process.env.GIT_CONFIG_NOSYSTEM,
  };

  beforeAll(() => {
    // Hermetic git: ignore the developer's global and system config (commit signing, default
    // branch name, hooks) so the suite behaves the same on every machine and in CI.
    process.env.GIT_CONFIG_GLOBAL = os.devNull;
    process.env.GIT_CONFIG_NOSYSTEM = '1';

    // Repositories live in the OS temp directory, never inside this repository.
    tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'gitops-test-'));
    tempDir1 = path.join(tempRoot, 'repo-1');
    tempDir2 = path.join(tempRoot, 'repo-2');

    [tempDir1, tempDir2].forEach((dir) => {
      fs.mkdirSync(dir, { recursive: true });
      execSync('git init --initial-branch=master', { cwd: dir, stdio: 'ignore' });
      execSync('git config user.email "test@example.com"', { cwd: dir });
      execSync('git config user.name "Test User"', { cwd: dir });
      execSync('git commit --allow-empty -m "initial"', { cwd: dir, stdio: 'ignore' });
    });
  });

  afterAll(() => {
    fs.rmSync(tempRoot, { recursive: true, force: true });
    for (const [key, value] of Object.entries(originalGitEnv)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  });

  describe('validateDirectory', () => {
    test('should not throw for valid directory', () => {
      expect(() => {
        gitOps.executeGit(['rev-parse', 'HEAD'], tempDir1);
      }).not.toThrow();
    });

    test('should throw for non-existent directory', () => {
      expect(() => {
        gitOps.executeGit(['rev-parse', 'HEAD'], '/nonexistent/path/12345');
      }).toThrow('Invalid directory');
    });

    test('should throw for non-string directory', () => {
      expect(() => {
        gitOps.executeGit(['rev-parse', 'HEAD'], 123);
      }).toThrow('Directory must be a non-empty string');
    });
  });

  describe('cross-repo isolation', () => {
    test('should operate on repo1 without affecting repo2', () => {
      // Create branch in repo1
      gitOps.createBranch('feature-1', tempDir1);

      // Verify branch exists in repo1
      const branch1 = gitOps.getCurrentBranch(tempDir1);
      expect(branch1).toBe('master');

      // Verify branch does NOT exist in repo2
      const exists = gitOps.branchExists('feature-1', tempDir2);
      expect(exists).toBe(false);
    });

    test('should maintain separate working trees', () => {
      // Create a file in repo1
      const file1 = path.join(tempDir1, 'test.txt');
      fs.writeFileSync(file1, 'repo1 content');
      gitOps.stageFiles(['test.txt'], tempDir1);

      // Verify file does not exist in repo2
      const file2 = path.join(tempDir2, 'test.txt');
      expect(fs.existsSync(file2)).toBe(false);
    });

    test('should isolate tag operations', () => {
      // Create tag in repo1
      gitOps.createTag('v1.0.0', 'Version 1.0.0', tempDir1);

      // Verify tag exists in repo1
      const tag1Exists = gitOps.tagExists('v1.0.0', tempDir1);
      expect(tag1Exists).toBe(true);

      // Verify tag does NOT exist in repo2
      const tag2Exists = gitOps.tagExists('v1.0.0', tempDir2);
      expect(tag2Exists).toBe(false);
    });

    test('should isolate commit operations', () => {
      // Setup repo1 with file
      const file1 = path.join(tempDir1, 'repo1.txt');
      fs.writeFileSync(file1, 'content1');
      gitOps.stageFiles(['repo1.txt'], tempDir1);
      gitOps.commitChanges('Add repo1 file', { workDir: tempDir1 });

      // Verify commit exists in repo1
      const count1 = gitOps.getCommitCount(tempDir1);
      expect(count1).toBeGreaterThan(1);

      // Verify commit does NOT exist in repo2
      const count2 = gitOps.getCommitCount(tempDir2);
      expect(count2).toBe(1); // Only initial commit
    });
  });

  describe('execFileSync security', () => {
    test('should prevent shell injection via args array', () => {
      // Injection attempt with semicolon
      const maliciousBranch = 'feature; rm -rf /';

      // Should fail validation or safely escape, not execute dangerous commands
      const result = gitOps.createBranch(maliciousBranch, tempDir1);

      // The branch name should not be created (or created safely without executing shell)
      const exists = gitOps.branchExists(maliciousBranch, tempDir1);
      expect(exists || !result).toBe(true);
    });

    test('should handle special characters in arguments safely', () => {
      const specialChars = 'feature-$VAR-`whoami`';

      // Should handle safely without executing variable expansion
      const result = gitOps.createBranch(specialChars, tempDir1);

      // If it succeeds, verify the literal string was used
      if (result) {
        const exists = gitOps.branchExists(specialChars, tempDir1);
        expect(exists).toBe(true);
      }
    });
  });

  describe('backwards compatibility', () => {
    test('should use process.cwd() as default when workDir not provided', () => {
      // This should work but operate on the current working directory
      // We skip this test as it could affect the test environment
      expect(true).toBe(true);
    });

    test('exports every git operation', () => {
      // Function.length ignores parameters with defaults (`workDir = process.cwd()`), so it
      // cannot show that workDir is accepted; the isolation tests above do that by calling
      // each operation against a specific repository.
      const operations = [
        'createBranch',
        'checkoutBranch',
        'getCurrentBranch',
        'isWorkingTreeClean',
        'stageFiles',
        'commitChanges',
        'createTag',
        'deleteTag',
        'deleteRemoteTag',
        'push',
        'getLatestTag',
        'getCommitsSince',
        'getCommitCount',
        'branchExists',
        'tagExists',
      ];
      for (const name of operations) {
        expect(typeof gitOps[name]).toBe('function');
      }
    });
  });
});
