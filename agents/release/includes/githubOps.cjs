/**
 * GitHub Operations
 * Handles GitHub API interactions: PRs, releases, etc.
 */

const { execSync, execFileSync } = require('child_process');

/**
 * Execute gh (GitHub CLI) command with arguments array
 * Prevents command injection by using execFileSync with array args
 * @param {string[]} args - Array of arguments to pass to gh
 * @returns {string} Command output
 * @throws {Error} If command fails
 */
function executeGhSafe(args) {
  try {
    return execFileSync('gh', args, {
      encoding: 'utf8',
    }).trim();
  } catch (error) {
    throw new Error(`GitHub CLI command failed: ${args.join(' ')}\n${error.message}`);
  }
}

/**
 * Execute gh (GitHub CLI) command (legacy, deprecated)
 * @param {string} command
 * @returns {string} Command output
 * @throws {Error} If command fails
 */
function executeGh(command) {
  try {
    return execSync(`gh ${command}`, {
      encoding: 'utf8',
    }).trim();
  } catch (error) {
    throw new Error(`GitHub CLI command failed: ${command}\n${error.message}`);
  }
}

/**
 * Create a pull request
 * @param {Object} options - { title, body, base, head, draft }
 * @returns {Object} { number, url, id } or null
 */
function createPullRequest(options = {}) {
  try {
    const {
      title = '',
      body = '',
      base = 'develop',
      head = '',
      draft = false,
    } = options;

    const args = ['pr', 'create', '--title', title, '--base', base, '--head', head];

    if (body) {
      args.push('--body', body);
    }

    if (draft) {
      args.push('--draft');
    }

    const output = executeGhSafe(args);

    // Parse output to extract PR number and URL
    // GitHub CLI outputs the PR URL
    const urlMatch = output.match(/https:\/\/github\.com\/[^/]+\/[^/]+\/pull\/(\d+)/);
    const number = urlMatch ? parseInt(urlMatch[1], 10) : null;

    return {
      number,
      url: output,
      id: number,
    };
  } catch (error) {
    return null;
  }
}

/**
 * Merge a pull request
 * @param {number|string} prNumber
 * @param {Object} options - { method, squash, delete }
 * @returns {boolean}
 */
function mergePullRequest(prNumber, options = {}) {
  try {
    const { method = 'squash', deleteAfter = true } = options;

    const args = ['pr', 'merge', String(prNumber), `--${method}`];

    if (deleteAfter) {
      args.push('--delete-branch');
    }

    executeGhSafe(args);
    return true;
  } catch {
    return false;
  }
}

/**
 * Create a GitHub release
 * @param {Object} options - { tag, title, body, draft, prerelease }
 * @returns {Object} { id, url } or null
 */
function createGitHubRelease(options = {}) {
  try {
    const {
      tag = '',
      title = '',
      body = '',
      draft = false,
      prerelease = false,
    } = options;

    const args = ['release', 'create', tag];

    if (title) {
      args.push('--title', title);
    }

    if (body) {
      args.push('--notes', body);
    }

    if (draft) {
      args.push('--draft');
    }

    if (prerelease) {
      args.push('--prerelease');
    }

    const output = executeGhSafe(args);

    // Parse release URL from output
    const urlMatch = output.match(
      /https:\/\/github\.com\/[^/]+\/[^/]+\/releases\/tag\/[^\s]+/
    );

    return {
      id: tag,
      url: urlMatch ? urlMatch[0] : output,
    };
  } catch (error) {
    return null;
  }
}

/**
 * Delete a GitHub release
 * @param {string} releaseId - Tag name or release ID
 * @returns {boolean}
 */
function deleteGitHubRelease(releaseId) {
  try {
    executeGhSafe(['release', 'delete', releaseId, '--yes']);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get authenticated GitHub user
 * @returns {Object} { login, name, email } or null
 */
function getGitHubUser() {
  try {
    const login = executeGh('api user -q .login');
    const name = executeGh('api user -q .name');
    const email = executeGh('api user -q .email');

    return { login, name, email };
  } catch {
    return null;
  }
}

/**
 * List pull requests
 * @param {Object} options - { state, limit, base }
 * @returns {Array} Array of { number, title, state, url }
 */
function listPullRequests(options = {}) {
  try {
    const { state = 'open', limit = 10, base = 'develop' } = options;

    const args = ['pr', 'list', '--state', state, '--limit', String(limit)];

    if (base) {
      args.push('--base', base);
    }

    const output = executeGhSafe(args);

    // Parse PR list output
    if (!output) return [];

    return output.split('\n').map((line) => {
      const parts = line.split('\t');
      return {
        number: parseInt(parts[0], 10),
        title: parts[1],
        state: parts[2],
        url: parts[3],
      };
    });
  } catch {
    return [];
  }
}

/**
 * Get PR details
 * @param {number} prNumber
 * @returns {Object} PR details or null
 */
function getPullRequest(prNumber) {
  try {
    const output = executeGhSafe([
      'pr',
      'view',
      String(prNumber),
      '--json',
      'number,title,state,body,baseRefName,headRefName',
    ]);
    return JSON.parse(output);
  } catch {
    return null;
  }
}

/**
 * Add comment to PR
 * @param {number} prNumber
 * @param {string} comment
 * @returns {boolean}
 */
function addPRComment(prNumber, comment) {
  try {
    executeGhSafe(['pr', 'comment', String(prNumber), '--body', comment]);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if authenticated
 * @returns {boolean}
 */
function isAuthenticated() {
  try {
    executeGh('auth status');
    return true;
  } catch {
    return false;
  }
}

module.exports = {
  executeGhSafe,
  executeGh,
  createPullRequest,
  mergePullRequest,
  createGitHubRelease,
  deleteGitHubRelease,
  getGitHubUser,
  listPullRequests,
  getPullRequest,
  addPRComment,
  isAuthenticated,
};
