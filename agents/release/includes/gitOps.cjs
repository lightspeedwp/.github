/**
 * Git Operations
 * Handles git-level operations: commits, branches, tags, pushes
 */

const { execSync } = require('child_process');
const fs = require('fs');

/**
 * Execute git command and return output
 * @param {string} command
 * @returns {string} Command output
 * @throws {Error} If command fails
 */
function executeGit(command) {
  try {
    return execSync(`git ${command}`, {
      encoding: 'utf8',
    }).trim();
  } catch (error) {
    throw new Error(`Git command failed: ${command}\n${error.message}`);
  }
}

/**
 * Create a new branch
 * @param {string} branchName
 * @returns {boolean}
 */
function createBranch(branchName) {
  try {
    executeGit(`branch ${branchName}`);
    return true;
  } catch {
    return false;
  }
}

/**
 * Checkout a branch
 * @param {string} branchName
 * @returns {boolean}
 */
function checkoutBranch(branchName) {
  try {
    executeGit(`checkout ${branchName}`);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get current branch name
 * @returns {string}
 */
function getCurrentBranch() {
  try {
    return executeGit('rev-parse --abbrev-ref HEAD');
  } catch {
    return null;
  }
}

/**
 * Check if working tree is clean
 * @returns {boolean}
 */
function isWorkingTreeClean() {
  try {
    const status = executeGit('status --porcelain');
    return status.length === 0;
  } catch {
    return false;
  }
}

/**
 * Stage files for commit
 * @param {string[]} files - Array of file paths
 * @returns {boolean}
 */
function stageFiles(files) {
  try {
    for (const file of files) {
      executeGit(`add "${file}"`);
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Commit changes
 * @param {string} message - Commit message
 * @param {Object} options - Author info {name, email}
 * @returns {Object} { commit: sha, message: string } or null
 */
function commitChanges(message, options = {}) {
  try {
    const { name = 'Release Bot', email = 'bot@lightspeedwp.agency' } = options;

    const commitCmd = `commit -m "${message}" --author="${name} <${email}>"`;
    executeGit(commitCmd);

    const sha = executeGit('rev-parse HEAD');
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
 * @returns {boolean}
 */
function createTag(tagName, message = '') {
  try {
    const cmd = message
      ? `tag -a ${tagName} -m "${message}"`
      : `tag ${tagName}`;
    executeGit(cmd);
    return true;
  } catch {
    return false;
  }
}

/**
 * Delete a local tag
 * @param {string} tagName
 * @returns {boolean}
 */
function deleteTag(tagName) {
  try {
    executeGit(`tag -d ${tagName}`);
    return true;
  } catch {
    return false;
  }
}

/**
 * Delete a remote tag
 * @param {string} tagName
 * @param {string} remote - Default: 'origin'
 * @returns {boolean}
 */
function deleteRemoteTag(tagName, remote = 'origin') {
  try {
    executeGit(`push ${remote} --delete tag ${tagName}`);
    return true;
  } catch {
    return false;
  }
}

/**
 * Push branch to remote
 * @param {string} branch
 * @param {string} remote - Default: 'origin'
 * @returns {boolean}
 */
function push(branch, remote = 'origin') {
  try {
    executeGit(`push -u ${remote} ${branch}`);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get latest tag
 * @returns {string|null}
 */
function getLatestTag() {
  try {
    const tag = executeGit('describe --tags --abbrev=0');
    return tag || null;
  } catch {
    return null;
  }
}

/**
 * Get commits since tag
 * @param {string} tag
 * @returns {Array} Array of commits { sha, message }
 */
function getCommitsSince(tag) {
  try {
    const output = executeGit(
      `log ${tag}..HEAD --pretty=format:"%H|%s"`
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
 * @returns {number}
 */
function getCommitCount() {
  try {
    const count = executeGit('rev-list --count HEAD');
    return parseInt(count, 10);
  } catch {
    return 0;
  }
}

/**
 * Check if branch exists
 * @param {string} branchName
 * @returns {boolean}
 */
function branchExists(branchName) {
  try {
    executeGit(`rev-parse --verify ${branchName}`);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if tag exists
 * @param {string} tagName
 * @returns {boolean}
 */
function tagExists(tagName) {
  try {
    executeGit(`rev-parse --verify refs/tags/${tagName}`);
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
