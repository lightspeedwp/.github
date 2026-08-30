/**
 * Changelog Finalizer — State verification and idempotent entry management
 * Ensures changelog entries capture finalized issue state without race conditions
 * @module scripts/changelog/changelog-finalizer.js
 */

/**
 * Verify issue state is finalized
 * Polls issue state multiple times to detect in-flight updates
 * @param {Object} octokit - GitHub API client
 * @param {Object} issue - Issue object with owner, repo, number
 * @param {number} maxRetries - Maximum verification attempts
 * @param {number} checkInterval - Delay between checks (ms)
 * @returns {Promise<Object>} Finalized issue data
 */
async function verifyIssueFinalized(
  octokit,
  issue,
  maxRetries = 5,
  checkInterval = 500,
) {
  let lastState = null;
  let stateConsistencyCount = 0;
  const requiredConsistency = 2; // State must be consistent across 2 checks

  for (let i = 0; i < maxRetries; i++) {
    try {
      const current = await octokit.rest.issues.get({
        owner: issue.owner,
        repo: issue.repo,
        issue_number: issue.number,
      });

      // Check if state has stabilized (no changes between checks)
      if (lastState && isStateConsistent(lastState.data, current.data)) {
        stateConsistencyCount += 1;

        if (stateConsistencyCount >= requiredConsistency) {
          return current.data;
        }
      } else {
        stateConsistencyCount = 0; // Reset on state change
      }

      lastState = current;

      if (i < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, checkInterval));
      }
    } catch (error) {
      console.error(`Error fetching issue #${issue.number}:`, error.message);

      if (i === maxRetries - 1) {
        throw error;
      }

      await new Promise((resolve) => setTimeout(resolve, checkInterval));
    }
  }

  throw new Error(
    `Issue #${issue.number} state not finalized after ${maxRetries} attempts`,
  );
}

/**
 * Check if two issue states are consistent
 * Compares labels, status, and other mutable fields
 * @private
 * @param {Object} state1 - First issue state
 * @param {Object} state2 - Second issue state
 * @returns {boolean} True if states are consistent
 */
function isStateConsistent(state1, state2) {
  // Compare label counts
  const labels1 = (state1.labels || []).length;
  const labels2 = (state2.labels || []).length;

  if (labels1 !== labels2) {
    return false;
  }

  // Compare label content
  const labelNames1 = new Set((state1.labels || []).map((l) => l.name));
  const labelNames2 = new Set((state2.labels || []).map((l) => l.name));

  for (const name of labelNames1) {
    if (!labelNames2.has(name)) {
      return false;
    }
  }

  return true;
}

/**
 * Validate that changelog entry matches issue state
 * @param {Object} entry - Changelog entry
 * @param {Object} issueData - Current issue data from GitHub API
 * @returns {Object} Validation result with isValid and warnings
 */
function validateChangelogEntry(entry, issueData) {
  const result = {
    isValid: true,
    warnings: [],
  };

  // Check labels count
  const entryLabelCount = (entry.labels || []).length;
  const issueLabels = issueData.labels || [];

  if (entryLabelCount !== issueLabels.length) {
    result.warnings.push(
      `Label count mismatch: entry has ${entryLabelCount}, issue has ${issueLabels.length}`,
    );
  }

  // Check for missing labels in entry
  const issueLabelsSet = new Set(issueLabels.map((l) => l.name));
  const entryLabelsSet = new Set(entry.labels || []);

  for (const label of issueLabelsSet) {
    if (!entryLabelsSet.has(label)) {
      result.warnings.push(`Missing label in entry: ${label}`);
      result.isValid = false;
    }
  }

  // Check for extra labels in entry
  for (const label of entryLabelsSet) {
    if (!issueLabelsSet.has(label)) {
      result.warnings.push(`Stale label in entry: ${label}`);
      result.isValid = false;
    }
  }

  return result;
}

/**
 * Check if a changelog entry is outdated
 * @param {Object} existingEntry - Existing entry in changelog
 * @param {Object} newEntry - New entry with updated data
 * @returns {boolean} True if existing entry is outdated
 */
function isEntryOutdated(existingEntry, newEntry) {
  // Compare label sets
  const existingLabels = new Set(existingEntry.labels || []);
  const newLabels = new Set(newEntry.labels || []);

  if (existingLabels.size !== newLabels.size) {
    return true;
  }

  for (const label of newLabels) {
    if (!existingLabels.has(label)) {
      return true;
    }
  }

  // Compare title and description
  if (existingEntry.title !== newEntry.title) {
    return true;
  }

  if (existingEntry.description !== newEntry.description) {
    return true;
  }

  return false;
}

/**
 * Find existing changelog entry by issue number
 * @param {Array<Object>} changelog - Changelog entries
 * @param {number} issueNumber - Issue number to search for
 * @returns {Object|null} Existing entry or null
 */
function findExistingEntry(changelog, issueNumber) {
  return changelog.find((entry) => entry.issueNumber === issueNumber) || null;
}

/**
 * Update or add changelog entry (idempotent)
 * Prevents duplicate entries and updates stale metadata
 * @param {Array<Object>} changelog - Current changelog
 * @param {Object} newEntry - Entry to add/update
 * @returns {Array<Object>} Updated changelog
 */
function updateChangelogIdempotent(changelog, newEntry) {
  const existing = findExistingEntry(changelog, newEntry.issueNumber);

  if (existing) {
    if (isEntryOutdated(existing, newEntry)) {
      // Update existing entry with current state
      const index = changelog.indexOf(existing);
      changelog[index] = {
        ...existing,
        ...newEntry,
        updatedAt: new Date().toISOString(),
      };

      console.log(
        `[Changelog] Updated entry for issue #${newEntry.issueNumber}`,
      );
    } else {
      console.log(
        `[Changelog] Entry for issue #${newEntry.issueNumber} is current`,
      );
    }
  } else {
    // Add new entry only if doesn't exist
    changelog.push({
      ...newEntry,
      createdAt: new Date().toISOString(),
    });

    console.log(
      `[Changelog] Added new entry for issue #${newEntry.issueNumber}`,
    );
  }

  return changelog;
}

module.exports = {
  verifyIssueFinalized,
  validateChangelogEntry,
  isEntryOutdated,
  findExistingEntry,
  updateChangelogIdempotent,
  isStateConsistent,
};
