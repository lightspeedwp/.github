/**
 * Git Operations
 * Handles git-level operations: commits, branches, tags, pushes
 */

const { execFileSync } = require('child_process');
const fs = require('fs');

/**
 * Validate directory exists and is readable/writable
 * @param {string} directory
 * @throws {Error} If directory is invalid
 */
function validateDirectory(directory) {
  if (!directory || typeof directory !== 'string') {
    throw new Error('Directory must be a non-empty string');
  }

  try {
    const stat = fs.statSync(directory);
    if (!stat.isDirectory()) {
      throw new Error(`Path is not a directory: ${directory}`);
    }
  } catch (error) {
    throw new Error(`Invalid directory: ${directory}\n${error.message}`);
  }
}

/**
 * Execute git command and return output
 * @param {string[]} args - Git arguments array (e.g., ["branch", "main"])
 * @param {string} workDir - Working directory for git operations
 * @returns {string} Command output
 * @throws {Error} If command fails
 */
function executeGit(args, workDir = process.cwd()) {
  validateDirectory(workDir);

  try {
    return execFileSync('git', args, {
      cwd: workDir,
      encoding: 'utf8',
    }).trim();
  } catch (error) {
    throw new Error(`Git command failed: ${error.message}`);
  }
}

/**
 * Create a new branch
 * @param {string} branchName
 * @param {string} workDir - Working directory for git operations
 * @returns {boolean}
 */
function createBranch(branchName, workDir = process.cwd()) {
  try {
    executeGit(['branch', branchName], workDir);
    return true;
  } catch {
    return false;
  }
}

/**
 * Checkout a branch
 * @param {string} branchName
 * @param {string} workDir - Working directory for git operations
 * @returns {boolean}
 */
function checkoutBranch(branchName, workDir = process.cwd()) {
  try {
    executeGit(['checkout', branchName], workDir);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get current branch name
 * @param {string} workDir - Working directory for git operations
 * @returns {string}
 */
function getCurrentBranch(workDir = process.cwd()) {
  try {
    return executeGit(['rev-parse', '--abbrev-ref', 'HEAD'], workDir);
  } catch {
    return null;
  }
}

/**
 * Check if working tree is clean
 * @param {string} workDir - Working directory for git operations
 * @returns {boolean}
 */
function isWorkingTreeClean(workDir = process.cwd()) {
  try {
    const status = executeGit(['status', '--porcelain'], workDir);
    return status.length === 0;
  } catch {
    return false;
  }
}

/**
 * Stage files for commit
 * @param {string[]} files - Array of file paths
 * @param {string} workDir - Working directory for git operations
 * @returns {boolean}
 */
function stageFiles(files, workDir = process.cwd()) {
  try {
    for (const file of files) {
      executeGit(['add', '--', file], workDir);
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Commit changes
 * @param {string} message - Commit message
 * @param {Object} options - Author info {name, email} and workDir
 * @returns {Object} { commit: sha, message: string } or null
 */
function commitChanges(message, options = {}) {
  try {
    const { name = 'Release Bot', email = 'bot@lightspeedwp.agency', workDir = process.cwd() } = options;

    executeGit(['commit', '-m', message, `--author=${name} <${email}>`], workDir);

    const sha = executeGit(['rev-parse', 'HEAD'], workDir);
    return {
      commit: sha,
      message,
    };
  } catch (error) {
    return null;
  }
}

/**
 * Create an annotated tag
 * @param {string} tagName
 * @param {string} message - Tag message
 * @param {string} workDir - Working directory for git operations
 * @returns {boolean}
 */
function createTag(tagName, message = '', workDir = process.cwd()) {
  try {
    const args = message
      ? ['tag', '-a', tagName, '-m', message]
      : ['tag', tagName];
    executeGit(args, workDir);
    return true;
  } catch {
    return false;
  }
}

/**
 * Delete a local tag
 * @param {string} tagName
 * @param {string} workDir - Working directory for git operations
 * @returns {boolean}
 */
function deleteTag(tagName, workDir = process.cwd()) {
  try {
    executeGit(['tag', '-d', tagName], workDir);
    return true;
  } catch {
    return false;
  }
}

/**
 * Delete a remote tag
 * @param {string} tagName
 * @param {string} remote - Default: 'origin'
 * @param {string} workDir - Working directory for git operations
 * @returns {boolean}
 */
function deleteRemoteTag(tagName, remote = 'origin', workDir = process.cwd()) {
  try {
    executeGit(['push', remote, '--delete', `refs/tags/${tagName}`], workDir);
    return true;
  } catch {
    return false;
  }
}

/**
 * Push branch to remote
 * @param {string} branch
 * @param {string} remote - Default: 'origin'
 * @param {string} workDir - Working directory for git operations
 * @returns {boolean}
 */
function push(branch, remote = 'origin', workDir = process.cwd()) {
  try {
    executeGit(['push', '-u', remote, branch], workDir);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get latest tag
 * @param {string} workDir - Working directory for git operations
 * @returns {string|null}
 */
function getLatestTag(workDir = process.cwd()) {
  try {
    const tag = executeGit(['describe', '--tags', '--abbrev=0'], workDir);
    return tag || null;
  } catch {
    return null;
  }
}

/**
 * Get commits since tag
 * @param {string} tag
 * @param {string} workDir - Working directory for git operations
 * @returns {Array} Array of commits { sha, message }
 */
function getCommitsSince(tag, workDir = process.cwd()) {
  try {
    const output = executeGit(
      ['log', `${tag}..HEAD`, '--pretty=format:%H|%s'],
      workDir
    );

    if (!output) return [];

    return output.split('\n').map((line) => {
      const [sha, message] = line.split('|');
      return { sha, message };
    });
  } catch {
    return [];
  }
}

/**
 * Get commit count
 * @param {string} workDir - Working directory for git operations
 * @returns {number}
 */
function getCommitCount(workDir = process.cwd()) {
  try {
    const count = executeGit(['rev-list', '--count', 'HEAD'], workDir);
    return parseInt(count, 10);
  } catch {
    return 0;
  }
}

/**
 * Check if branch exists
 * @param {string} branchName
 * @param {string} workDir - Working directory for git operations
 * @returns {boolean}
 */
function branchExists(branchName, workDir = process.cwd()) {
  try {
    executeGit(['rev-parse', '--verify', branchName], workDir);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if tag exists
 * @param {string} tagName
 * @param {string} workDir - Working directory for git operations
 * @returns {boolean}
 */
function tagExists(tagName, workDir = process.cwd()) {
  try {
    executeGit(['rev-parse', '--verify', `refs/tags/${tagName}`], workDir);
    return true;
  } catch {
    return false;
  }
}

module.exports = {
  executeGit,
  createBranch,
  checkoutBranch,
  getCurrentBranch,
  isWorkingTreeClean,
  stageFiles,
  commitChanges,
  createTag,
  deleteTag,
  deleteRemoteTag,
  push,
  getLatestTag,
  getCommitsSince,
  getCommitCount,
  branchExists,
  tagExists,
};
