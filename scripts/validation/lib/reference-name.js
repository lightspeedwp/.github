/**
 * Reference name helpers (#3460)
 * Agent and skill indexes store bare names (`issue-agent`), but references
 * carry paths (`agents/issue-agent`, `./skills/foo.js`). These helpers
 * convert between the two so lookups and fuzzy matching compare like with
 * like.
 */

const CONTAINER = /(?:^|\/)(?:agents|skills)\/([^/]+)/g;

/**
 * Remove relative-path notation, trailing slashes, and file extensions.
 *
 * @param {string} value - Reference value to normalise.
 * @returns {string} Normalised reference path.
 */
function clean(value) {
  return value
    .replace(/^\.\//, '')
    .replace(/\/+$/, '')
    .replace(/\.\w+$/, '');
}

/**
 * Bare agent/skill name a reference points at: the segment after the last
 * `agents/` or `skills/`, otherwise the last path segment.
 */
export function referenceName(value) {
  const cleaned = clean(value);
  const matches = [...cleaned.matchAll(CONTAINER)];
  if (matches.length) return matches[matches.length - 1][1];
  return cleaned.split('/').pop();
}

/**
 * Replace the name in a reference while keeping its path, so
 * `agents/issue-agent` renamed to `issue-triage-agent` becomes
 * `agents/issue-triage-agent`.
 */
export function replaceReferenceName(value, newName) {
  const name = referenceName(value);
  // Search before any extension, so `skills/js/js.js` never matches `.js`.
  const extension = value.match(/\.\w+$/)?.[0] ?? '';
  const index = value.slice(0, value.length - extension.length).lastIndexOf(name);
  if (index === -1) return newName;
  return value.slice(0, index) + newName + value.slice(index + name.length);
}
