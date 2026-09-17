/**
 * Checklist Generator
 * T049: Generate checklists from base template and apply variants
 */

const baseTemplate = {
  items: [
    {
      id: 'CHK-001-Completeness',
      question: 'Are all requirements documented?',
      dimension: 'Completeness',
      guidance: 'Include all acceptance criteria',
    },
    {
      id: 'CHK-002-Completeness',
      question: 'Are error scenarios covered?',
      dimension: 'Completeness',
      guidance: 'Document error cases and handling',
    },
    {
      id: 'CHK-003-Completeness',
      question: 'Are edge cases identified?',
      dimension: 'Completeness',
      guidance: 'List known edge cases',
    },
    {
      id: 'CHK-004-Clarity',
      question: 'Are vague terms defined?',
      dimension: 'Clarity',
      guidance: 'Replace ambiguous wording',
    },
    {
      id: 'CHK-005-Clarity',
      question: 'Is terminology consistent?',
      dimension: 'Clarity',
      guidance: 'Use same terms throughout',
    },
    {
      id: 'CHK-006-Clarity',
      question: 'Are examples provided?',
      dimension: 'Clarity',
      guidance: 'Include concrete examples',
    },
    {
      id: 'CHK-007-Consistency',
      question: 'Are naming conventions followed?',
      dimension: 'Consistency',
      guidance: 'Follow team standards',
    },
    {
      id: 'CHK-008-Consistency',
      question: 'Is formatting consistent?',
      dimension: 'Consistency',
      guidance: 'Use consistent structure',
    },
    {
      id: 'CHK-009-Consistency',
      question: 'Are APIs consistent?',
      dimension: 'Consistency',
      guidance: 'Follow API patterns',
    },
    {
      id: 'CHK-010-Measurability',
      question: 'Are acceptance criteria quantified?',
      dimension: 'Measurability',
      guidance: 'Use measurable metrics',
    },
    {
      id: 'CHK-011-Measurability',
      question: 'Are success metrics defined?',
      dimension: 'Measurability',
      guidance: 'Define what "done" means',
    },
    {
      id: 'CHK-012-Measurability',
      question: 'Are performance targets specified?',
      dimension: 'Measurability',
      guidance: 'Include performance SLOs',
    },
    {
      id: 'CHK-013-Scenario Coverage',
      question: 'Are happy path scenarios covered?',
      dimension: 'Scenario Coverage',
      guidance: 'Document normal flows',
    },
    {
      id: 'CHK-014-Scenario Coverage',
      question: 'Are failure scenarios included?',
      dimension: 'Scenario Coverage',
      guidance: 'Document error flows',
    },
    {
      id: 'CHK-015-Scenario Coverage',
      question: 'Are boundary conditions tested?',
      dimension: 'Scenario Coverage',
      guidance: 'Test min/max values',
    },
    {
      id: 'CHK-016-Edge Cases',
      question: 'Are null/empty values handled?',
      dimension: 'Edge Cases',
      guidance: 'Handle edge values',
    },
    {
      id: 'CHK-017-Edge Cases',
      question: 'Are race conditions considered?',
      dimension: 'Edge Cases',
      guidance: 'Address concurrency',
    },
    {
      id: 'CHK-018-Edge Cases',
      question: 'Are resource limits documented?',
      dimension: 'Edge Cases',
      guidance: 'Specify limits',
    },
    {
      id: 'CHK-019-Dependencies',
      question: 'Are external dependencies listed?',
      dimension: 'Dependencies',
      guidance: 'Document all deps',
    },
    {
      id: 'CHK-020-Dependencies',
      question: 'Are version constraints specified?',
      dimension: 'Dependencies',
      guidance: 'Pin compatible versions',
    },
    {
      id: 'CHK-021-Dependencies',
      question: 'Are circular dependencies avoided?',
      dimension: 'Dependencies',
      guidance: 'Check dependency graph',
    },
    {
      id: 'CHK-022-Ambiguities',
      question: 'Are unclear requirements flagged?',
      dimension: 'Ambiguities',
      guidance: 'Mark ambiguous items',
    },
    {
      id: 'CHK-023-Ambiguities',
      question: 'Is ownership clear?',
      dimension: 'Ambiguities',
      guidance: 'Assign responsibility',
    },
    {
      id: 'CHK-024-Ambiguities',
      question: 'Are timeline assumptions stated?',
      dimension: 'Ambiguities',
      guidance: 'Document timeline',
    },
  ],
  metadata: {
    title: 'Requirements Quality Checklist',
    version: '1.0',
  },
};

const generateChecklist = (input = {}) => {
  const items = input.items || [];
  const metadata = input.metadata || {};

  return {
    items: items.map((item) => ({
      ...item,
      id: item.id || '',
      question: item.question || '',
      dimension: item.dimension || '',
      guidance: item.guidance || '',
    })),
    metadata: {
      ...metadata,
      generatedAt: new Date(),
    },
  };
};

const generateFromBase = () => {
  return generateChecklist(baseTemplate);
};

const applyVariant = (base, variant) => {
  if (!base || !variant) return base;

  const baseItemIds = new Set(base.items.map((item) => item.id));
  const newItems = variant.items.filter((item) => !baseItemIds.has(item.id));

  return {
    items: [...base.items, ...newItems],
    metadata: {
      ...base.metadata,
      ...variant.metadata,
    },
  };
};

module.exports.generateChecklist = generateChecklist;
module.exports.generateFromBase = generateFromBase;
module.exports.applyVariant = applyVariant;
