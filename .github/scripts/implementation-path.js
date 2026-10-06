/**
 * How an agent spec's `implementation` value points at its folder.
 *
 * The rule the spec validator and the index generator share, so they cannot
 * disagree about it: a value that contains a "/" or starts with "." is relative
 * to the repository root (for example `agents/changelog-agent/`).
 *
 * A bare name is a legacy form that no current spec uses. The validator reads it
 * relative to `agents/` (`resolveImplementationDir`); the generator keeps its
 * older meaning of relative to the spec's own folder.
 */
import path from "path";

/**
 * Tells whether an `implementation` value is relative to the repository root.
 * @param {string} implementation The frontmatter value.
 * @returns {boolean} True for a root-relative value, false for a bare legacy name.
 */
export function isRootRelativeImplementation(implementation) {
  const value = String(implementation);
  return value.includes("/") || value === "." || value.startsWith(".");
}

/**
 * Resolves an `implementation` value to a folder on disk.
 * @param {string} implementation The frontmatter value.
 * @param {string} repoRoot Absolute path of the repository root.
 * @returns {string} Absolute folder path.
 */
export function resolveImplementationDir(implementation, repoRoot) {
  const value = String(implementation);
  return isRootRelativeImplementation(value)
    ? path.resolve(repoRoot, value)
    : path.join(repoRoot, "agents", value);
}
