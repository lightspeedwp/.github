/**
 * Checklist Generator
 *
 * Generates requirement quality checklists from templates and applies domain variants.
 * Produces normalized checklist objects with items, metadata, and summary metrics.
 *
 * Exports:
 * - generateChecklist(input): Generate checklist from input items and metadata
 * - generateFromBase(): Generate checklist from base template
 * - applyVariant(base, variant): Merge variant items into base checklist
 *
 * @requires checklist-schema.json - Validates output against schema
 */

const baseTemplate = {
  items: [
    { id: 'CHK-001-Completeness', question: 'Are all requirements documented?', dimension: 'Completeness', guidance: 'Include all acceptance criteria' },
    { id: 'CHK-002-Completeness', question: 'Are error scenarios covered?', dimension: 'Completeness', guidance: 'Document error cases and handling' },
    { id: 'CHK-003-Completeness', question: 'Are edge cases identified?', dimension: 'Completeness', guidance: 'List known edge cases' },
    { id: 'CHK-004-Clarity', question: 'Are vague terms defined?', dimension: 'Clarity', guidance: 'Replace ambiguous wording' },
    { id: 'CHK-005-Clarity', question: 'Is terminology consistent?', dimension: 'Clarity', guidance: 'Use same terms throughout' },
    { id: 'CHK-006-Clarity', question: 'Are examples provided?', dimension: 'Clarity', guidance: 'Include concrete examples' },
    { id: 'CHK-007-Consistency', question: 'Are naming conventions followed?', dimension: 'Consistency', guidance: 'Follow team standards' },
    { id: 'CHK-008-Consistency', question: 'Is formatting consistent?', dimension: 'Consistency', guidance: 'Use consistent structure' },
    { id: 'CHK-009-Consistency', question: 'Are APIs consistent?', dimension: 'Consistency', guidance: 'Follow API patterns' },
    { id: 'CHK-010-Measurability', question: 'Are acceptance criteria quantified?', dimension: 'Measurability', guidance: 'Use measurable metrics' },
    { id: 'CHK-011-Measurability', question: 'Are success metrics defined?', dimension: 'Measurability', guidance: 'Define what "done" means' },
    { id: 'CHK-012-Measurability', question: 'Are performance targets specified?', dimension: 'Measurability', guidance: 'Include performance SLOs' },
    { id: 'CHK-013-Scenario Coverage', question: 'Are happy path scenarios covered?', dimension: 'Scenario Coverage', guidance: 'Document normal flows' },
    { id: 'CHK-014-Scenario Coverage', question: 'Are failure scenarios included?', dimension: 'Scenario Coverage', guidance: 'Document error flows' },
    { id: 'CHK-015-Scenario Coverage', question: 'Are boundary conditions tested?', dimension: 'Scenario Coverage', guidance: 'Test min/max values' },
    { id: 'CHK-016-Edge Cases', question: 'Are null/empty values handled?', dimension: 'Edge Cases', guidance: 'Handle edge values' },
    { id: 'CHK-017-Edge Cases', question: 'Are race conditions considered?', dimension: 'Edge Cases', guidance: 'Address concurrency' },
    { id: 'CHK-018-Edge Cases', question: 'Are resource limits documented?', dimension: 'Edge Cases', guidance: 'Specify limits' },
    { id: 'CHK-019-Dependencies', question: 'Are external dependencies listed?', dimension: 'Dependencies', guidance: 'Document all deps' },
    { id: 'CHK-020-Dependencies', question: 'Are version constraints specified?', dimension: 'Dependencies', guidance: 'Pin compatible versions' },
    { id: 'CHK-021-Dependencies', question: 'Are circular dependencies avoided?', dimension: 'Dependencies', guidance: 'Check dependency graph' },
    { id: 'CHK-022-Ambiguities', question: 'Are unclear requirements flagged?', dimension: 'Ambiguities', guidance: 'Mark ambiguous items' },
    { id: 'CHK-023-Ambiguities', question: 'Is ownership clear?', dimension: 'Ambiguities', guidance: 'Assign responsibility' },
    { id: 'CHK-024-Ambiguities', question: 'Are timeline assumptions stated?', dimension: 'Ambiguities', guidance: 'Document timeline' },
  ],
  metadata: {
    title: 'Requirements Quality Checklist',
    version: '1.0',
  },
};

/**
 * Generate a checklist from input items and metadata
 *
 * Normalizes items, calculates summary metrics (totals, percentages, markers),
 * and produces a schema-compliant checklist object.
 *
 * @param {Object} input - Input configuration
 * @param {Array} input.items - Checklist items with id, question, dimension, guidance
 * @param {Object} input.metadata - Checklist metadata (title, domain, audience, etc.)
 * @returns {Object} Checklist object { items, metadata, summary }
 */
const generateChecklist = (input = {}) => {
  const items = input.items || [];
  const metadata = input.metadata || {};

  const normalizedItems = items.map(item => ({
    ...item,
    id: item.id || '',
    question: item.question || '',
    dimension: item.dimension || '',
    guidance: item.guidance || '',
    state: item.state || 'unchecked',
  }));

  // Calculate summary metrics
  const checkedItems = normalizedItems.filter(item => item.state === 'checked' || item.state === '[x]').length;
  const totalItems = normalizedItems.length;
  const uncheckedItems = totalItems - checkedItems;
  const completionPercent = totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;

  // Count gap/ambiguity markers in items
  let gaps = 0;
  let ambiguities = 0;
  let criticalAmbiguities = 0;
  normalizedItems.forEach(item => {
    const text = `${item.question} ${item.guidance}`;
    if (text.match(/\[Gap:/i)) gaps += 1;
    if (text.match(/\[Ambiguity-Critical:/i)) criticalAmbiguities += 1;
    else if (text.match(/\[Ambiguity:/i)) ambiguities += 1;
  });

  // Determine status based on critical ambiguities and completion
  let status = 'in-progress';
  if (criticalAmbiguities > 0) {
    status = 'fail';
  } else if (uncheckedItems === 0 && gaps === 0 && ambiguities === 0) {
    status = 'pass';
  }

  return {
    items: normalizedItems,
    metadata: {
      ...metadata,
      generatedAt: new Date(),
    },
    summary: {
      totalItems,
      checkedItems,
      uncheckedItems,
      completionPercent,
      gaps,
      ambiguities,
      criticalAmbiguities,
      status,
    },
  };
};

/**
 * Generate checklist from hardcoded base template
 *
 * Convenience function that generates a standard checklist with all 24 base items
 * across 8 dimensions (Completeness, Clarity, Consistency, Measurability,
 * Scenario Coverage, Edge Cases, Dependencies, Ambiguities).
 *
 * @returns {Object} Checklist object with base items, metadata, and summary
 */
const generateFromBase = () => {
  return generateChecklist(baseTemplate);
};

/**
 * Apply a domain variant to a base checklist
 *
 * Merges domain-specific items (UX, API, Security, Performance) into a base checklist,
 * avoiding duplicates by ID. Recalculates summary metrics for the merged result.
 *
 * @param {Object} base - Base checklist object from generateFromBase()
 * @param {Object} variant - Variant checklist with domain-specific items
 * @returns {Object} Merged checklist with base items + variant items and updated summary
 */
const applyVariant = (base, variant) => {
  if (!base || !variant) return base;

  const baseItemIds = new Set(base.items.map(item => item.id));
  const newItems = variant.items.filter(item => !baseItemIds.has(item.id));

  const mergedItems = [...base.items, ...newItems];
  const checkedItems = mergedItems.filter(item => item.state === 'checked' || item.state === '[x]').length;
  const totalItems = mergedItems.length;
  const uncheckedItems = totalItems - checkedItems;
  const completionPercent = totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;

  // Count gap/ambiguity markers
  let gaps = 0;
  let ambiguities = 0;
  let criticalAmbiguities = 0;
  mergedItems.forEach(item => {
    const text = `${item.question} ${item.guidance}`;
    if (text.match(/\[Gap:/i)) gaps += 1;
    if (text.match(/\[Ambiguity-Critical:/i)) criticalAmbiguities += 1;
    else if (text.match(/\[Ambiguity:/i)) ambiguities += 1;
  });

  let status = 'in-progress';
  if (criticalAmbiguities > 0) {
    status = 'fail';
  } else if (uncheckedItems === 0 && gaps === 0 && ambiguities === 0) {
    status = 'pass';
  }

  return {
    items: mergedItems,
    metadata: {
      ...base.metadata,
      ...variant.metadata,
    },
    summary: {
      totalItems,
      checkedItems,
      uncheckedItems,
      completionPercent,
      gaps,
      ambiguities,
      criticalAmbiguities,
      status,
    },
  };
};

module.exports.generateChecklist = generateChecklist;
module.exports.generateFromBase = generateFromBase;
module.exports.applyVariant = applyVariant;
