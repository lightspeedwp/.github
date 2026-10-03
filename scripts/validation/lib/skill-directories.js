/**
 * Directory-aware skill discovery shared by the skills catalog (Phase 5) and
 * the skills registry generator (Phase 6).
 *
 * A skill is a directory carrying a definition file, normally `SKILL.md`. Its
 * logical name is the directory's own name (the Agent Skills specification
 * requires `name` to equal the parent directory), never the entry file's name.
 * Grouping directories, possibly nested by provider
 * (`skills/<category>/<provider>/<skill>/SKILL.md`), are descended until
 * directories that carry a definition are found.
 */

import fs from 'fs';
import path from 'path';

const PREFERRED_DEFINITIONS = ['SKILL.md', 'metadata.yml', 'metadata.yaml', 'index.md'];
const MAX_DEPTH = 5;

/**
 * Select the entrypoint or metadata file that defines a directory-based skill.
 * @param {string} skillDirectory - Directory to inspect
 * @returns {string | null} Path of the definition file (`SKILL.md`, `metadata.yml`,
 *   `metadata.yaml` or `index.md`), or null when there is none
 */
export function findSkillDefinition(skillDirectory) {
  let entries;
  try {
    entries = fs.readdirSync(skillDirectory, { withFileTypes: true });
  } catch {
    return null;
  }
  const files = entries.filter((entry) => entry.isFile() && !entry.name.startsWith('.'));

  for (const preferredName of PREFERRED_DEFINITIONS) {
    const match = files.find((entry) => entry.name === preferredName);
    if (match) return path.join(skillDirectory, match.name);
  }

  // Only a recognised definition filename makes a directory a skill. An
  // arbitrary Markdown file does not: a content pack such as
  // `skills/accessibility-auditor/` holds ordinary documents and no SKILL.md,
  // and must be walked as a grouping directory, not classified as a skill.
  return null;
}

/**
 * Whether a directory is itself a skill (carries a skill definition).
 * @param {string} skillDirectory - Directory to inspect
 * @returns {boolean}
 */
export function hasSkillDefinition(skillDirectory) {
  return findSkillDefinition(skillDirectory) !== null;
}

/**
 * Recursively collect skill directories beneath a grouping directory.
 *
 * The outermost grouping segment becomes the category and the discovered
 * directory's own name becomes the skill name. Deeper segments are treated as
 * provider groupings, not categories.
 * @param {string} directory - Directory to walk
 * @param {string[]} groupSegments - Grouping directory names walked so far
 * @param {number} [depth] - Current depth, for the recursion limit
 * @returns {{ directory: string, category: string, name: string }[]}
 */
export function collectSkillDirectories(directory, groupSegments, depth = 0) {
  if (depth > MAX_DEPTH) return [];

  if (hasSkillDefinition(directory)) {
    const category = groupSegments[0] || 'uncategorised';
    return [{ directory, category, name: path.basename(directory) }];
  }

  let entries;
  try {
    entries = fs.readdirSync(directory, { withFileTypes: true });
  } catch {
    return [];
  }

  // The directory the walk starts from, when it is a grouping directory rather
  // than a skill, is itself the outermost grouping segment.
  const segments = groupSegments.length === 0 ? [path.basename(directory)] : groupSegments;

  const collected = [];
  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name.startsWith('.')) continue;
    const childPath = path.join(directory, entry.name);

    // A directory that is itself a skill is discovered here rather than
    // deeper, so seed the segments with this grouping directory's own name.
    // Without this the category would be the skill name itself.
    const childSegments = hasSkillDefinition(childPath)
      ? [segments[0], entry.name]
      : [...segments, entry.name];

    collected.push(...collectSkillDirectories(childPath, childSegments, depth + 1));
  }

  return collected;
}
