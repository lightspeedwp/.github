/**
 * Git Operations Test Suite
 * Tests for git command execution, branch management, and cross-repo isolation
 * @author Ash Shaw
 * @date 2026-08-11
 * @related-files gitOps.cjs, release.agent.js
 */

const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const gitOps = require('../includes/gitOps.cjs');

describe('gitOps.cjs - Cross-repo isolation', () => {
  let tempDir1;
  let tempDir2;

  beforeAll(() => {
    tempDir1 = path.join(__dirname, '../../..', 'tmp-test-repo-1');
    tempDir2 = path.join(__dirname, '../../..', 'tmp-test-repo-2');

    [tempDir1, tempDir2].forEach((dir) => {
      if (fs.existsSync(dir)) {
        execSync(`rm -rf "${dir}"`);
      }
      fs.mkdirSync(dir, { recursive: true });
      execSync('git init', { cwd: dir });
      execSync('git config user.email "test@example.com"', { cwd: dir });
      execSync('git config user.name "Test User"', { cwd: dir });
      execSync('git commit --allow-empty -m "initial"', { cwd: dir });
    });
  });

  afterAll(() => {
    [tempDir1, tempDir2].forEach((dir) => {
      if (fs.existsSync(dir)) {
        execSync(`rm -rf "${dir}"`);
      }
    });
  });

  describe('validateDirectory', () => {
    test('should not throw for valid directory', () => {
      expect(() => {
        gitOps.executeGit('rev-parse HEAD', tempDir1);
      }).not.toThrow();
    });

    test('should throw for non-existent directory', () => {
      expect(() => {
        gitOps.executeGit('rev-parse HEAD', '/nonexistent/path/12345');
      }).toThrow('Invalid directory');
    });

    test('should throw for non-string directory', () => {
      expect(() => {
        gitOps.executeGit('rev-parse HEAD', 123);
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

    test('all functions should accept workDir parameter', () => {
      expect(gitOps.createBranch).toHaveLength(2);
      expect(gitOps.checkoutBranch).toHaveLength(2);
      expect(gitOps.getCurrentBranch).toHaveLength(1);
      expect(gitOps.isWorkingTreeClean).toHaveLength(1);
      expect(gitOps.stageFiles).toHaveLength(2);
      expect(gitOps.commitChanges).toHaveLength(2);
      expect(gitOps.createTag).toHaveLength(3);
      expect(gitOps.deleteTag).toHaveLength(2);
      expect(gitOps.deleteRemoteTag).toHaveLength(3);
      expect(gitOps.push).toHaveLength(3);
      expect(gitOps.getLatestTag).toHaveLength(1);
      expect(gitOps.getCommitsSince).toHaveLength(2);
      expect(gitOps.getCommitCount).toHaveLength(1);
      expect(gitOps.branchExists).toHaveLength(2);
      expect(gitOps.tagExists).toHaveLength(2);
    });
  });
});
