'use strict';

/**
 * The label families `labels.yml` may carry, in one place.
 *
 * `validate-labeling-configs.cjs` rejects a label outside these families, and the spec 008 label
 * mapping (`scripts/automation/label-mapping.cjs`) must not import a label the validator would
 * then reject, so both read this list instead of keeping their own.
 */

/** Families `labels.yml` may carry today. */
const LABEL_PREFIXES = [
  'status:',
  'priority:',
  'type:',
  'area:',
  'comp:',
  'lang:',
  'env:',
  'compat:',
  'cpt:',
  'ai-ops:',
  'contrib:',
  'discussion:',
  'release:',
  'meta:',
  'openspec:',
];

/**
 * Families the Stage 2 configuration change introduces (FR-011: `ai-ops:` becomes `aiops:`,
 * `openspec:` becomes `spec:`, and spec numbers move to `spec-id:`). The mapping imports and
 * renames into these, so its check includes them. `labels.yml` itself does not carry them until
 * that change merges, which is when T057a moves them into `LABEL_PREFIXES` and drops the old ones.
 */
const STAGE_2_PREFIXES = ['aiops:', 'spec:', 'spec-id:'];

/**
 * Whether a label name starts with one of the given families.
 *
 * @param {string} name Label name.
 * @param {string[]} [prefixes] Families to accept; defaults to the ones `labels.yml` may carry today.
 * @returns {boolean}
 */
function hasLabelPrefix(name, prefixes = LABEL_PREFIXES) {
  return typeof name === 'string' && prefixes.some((prefix) => name.startsWith(prefix));
}

module.exports = { LABEL_PREFIXES, STAGE_2_PREFIXES, hasLabelPrefix };
