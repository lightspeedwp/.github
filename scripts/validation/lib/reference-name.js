/**
 * Reference name helpers (#3460)
 * Agent and skill indexes store bare names (`issue-agent`), but references
 * carry paths (`agents/issue-agent`, `./skills/foo.js`). These helpers
 * convert between the two so lookups and fuzzy matching compare like with
 * like.
 */

const CONTAINER = /(?:^|\/)(agents|skills)\/([^/]+)/g;

/**
 * Locate the agent/skill name in a reference.
 *
 * The name is the segment after the last `agents/` or `skills/`; without
 * either, it is the last path segment. A file extension is dropped when the
 * name segment is the last segment (`skills/foo.js` -> `foo`).
 *
 * @param {string} value - Reference value, e.g. `agents/pr-agent/run.sh`.
 * @returns {{container: ('agents'|'skills'|null), name: string, start: number, end: number}}
 *   `start`/`end` are offsets of the name in `value`, so the same segment can
 *   be replaced.
 */
export function parseReference(value) {
  const trimmed = value.replace(/\/+$/, '');
  const matches = [...trimmed.matchAll(CONTAINER)];

  let container = null;
  let segment;
  let start;
  if (matches.length) {
    const last = matches[matches.length - 1];
    container = last[1];
    segment = last[2];
    start = last.index + last[0].length - segment.length;
  } else {
    start = trimmed.lastIndexOf('/') + 1;
    segment = trimmed.slice(start);
  }

  const isLastSegment = start + segment.length === trimmed.length;
  const name = isLastSegment ? segment.replace(/\.\w+$/, '') : segment;
  return { container, name, start, end: start + name.length };
}

/**
 * Bare agent/skill name a reference points at.
 *
 * @param {string} value - Reference value.
 * @returns {string} The bare name, e.g. `issue-agent`.
 */
export function referenceName(value) {
  return parseReference(value).name;
}

/**
 * Replace the name in a reference while keeping its path and extension, so
 * `agents/issue-agent` renamed to `issue-triage-agent` becomes
 * `agents/issue-triage-agent`. The segment replaced is the one
 * referenceName() reads, so referenceName(result) === newName.
 *
 * @param {string} value - Reference value.
 * @param {string} newName - Replacement bare name.
 * @returns {string} The reference with its name replaced.
 */
export function replaceReferenceName(value, newName) {
  const { start, end } = parseReference(value);
  return value.slice(0, start) + newName + value.slice(end);
}
