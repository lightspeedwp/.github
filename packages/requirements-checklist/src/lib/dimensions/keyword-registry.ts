/**
 * Keyword registry for detecting issues across dimensions
 */

export const KeywordRegistry = {
  // Clarity: Vague adjectives that lack quantifiable thresholds
  clarity: {
    vague_adjectives: [
      'fast',
      'quick',
      'slow',
      'scalable',
      'efficient',
      'robust',
      'resilient',
      'intuitive',
      'easy',
      'simple',
      'complex',
      'lightweight',
      'powerful',
      'flexible',
      'reliable',
      'stable',
      'responsive',
      'consistent',
      'accurate',
      'seamless',
      'smooth',
      'elegant',
      'clean',
      'minimal',
      'comprehensive',
      'complete',
      'sufficient',
      'adequate',
      'appropriate',
      'suitable',
      'optimal',
      'ideal',
      'minimal',
      'significant',
      'noticeable',
      'substantial',
      'measurable',
      'tangible',
      'good',
      'better',
      'best',
      'worse',
      'worst',
      'large',
      'small',
      'big',
      'tiny',
      'many',
      'few',
      'high',
      'low',
      'long',
      'short',
    ],
  },

  // Consistency: Terminology drift patterns
  consistency: {
    terminology_alternates: [
      { standard: 'user story', variants: ['story', 'use case', 'scenario'] },
      { standard: 'requirement', variants: ['req', 'spec', 'criterion'] },
      { standard: 'success criteria', variants: ['acceptance criteria', 'outcomes', 'goals'] },
      { standard: 'edge case', variants: ['corner case', 'boundary condition', 'special case'] },
      { standard: 'user', variants: ['actor', 'stakeholder', 'persona'] },
      { standard: 'system', variants: ['application', 'software', 'service', 'platform'] },
      { standard: 'API', variants: ['endpoint', 'interface', 'service'] },
      { standard: 'database', variants: ['store', 'persistence', 'data layer'] },
    ],
  },

  // Measurability: Patterns to detect non-quantified criteria
  measurability: {
    non_quantified_patterns: [
      'should be.*faster',
      'must be.*more.*efficient',
      'needs to.*scale',
      'should handle.*large',
      'must be.*reliable',
      'should support.*many',
      'needs.*good.*performance',
      'must be.*secure',
      'should be.*user friendly',
    ],
    required_metrics: [
      '%',
      'ms',
      'seconds',
      'minutes',
      'bytes',
      'KB',
      'MB',
      'GB',
      'requests/sec',
      'ops/sec',
    ],
  },

  // Completeness: Required sections
  completeness: {
    required_sections: [
      'Overview',
      'User Scenarios',
      'Requirements',
      'Success Criteria',
      'Assumptions',
      'Edge Cases',
      'References',
    ],
  },

  // Scenario Coverage: Typical user flow keywords
  scenario_coverage: {
    happy_path_keywords: ['given', 'when', 'then', 'user', 'can', 'shall', 'must'],
    flow_keywords: ['first', 'then', 'next', 'finally', 'after', 'before', 'during'],
  },

  // Edge Cases: Common edge case patterns
  edge_cases: {
    edge_case_keywords: [
      'error',
      'failure',
      'timeout',
      'empty',
      'null',
      'invalid',
      'missing',
      'duplicate',
      'concurrent',
      'race',
      'deadlock',
      'overflow',
      'underflow',
      'boundary',
      'limit',
      'maximum',
      'minimum',
    ],
  },

  // Dependencies: Cross-project and assumption keywords
  dependencies: {
    dependency_keywords: [
      'depends on',
      'requires',
      'assumes',
      'assumes that',
      'given that',
      'provided that',
      'if',
      'when',
      'external',
      'third-party',
      'integration',
      'contract',
      'interface',
      'api',
    ],
  },

  // Ambiguities: Unclear language patterns
  ambiguities: {
    ambiguous_phrases: [
      'might',
      'may',
      'could',
      'perhaps',
      'possibly',
      'probably',
      'somewhat',
      'somewhat',
      'kind of',
      'sort of',
      'etc',
      'and so on',
      'similar',
      'like',
      'such as',
      'for example',
      'as appropriate',
      'if needed',
      'where applicable',
      'in general',
      'typically',
      'usually',
      'often',
      'rarely',
      'sometimes',
      'somehow',
      'anyway',
      'basically',
      'essentially',
      'obviously',
      'clearly',
      'apparently',
      'seems',
      'appears',
      'looks like',
      'presumably',
    ],
  },
};

/**
 * Find registered string keywords present as case-insensitive substrings for a dimension.
 *
 * Object-based registry entries are ignored.
 *
 * @returns Unique matching registry values, or an empty array for an unknown dimension.
 */
export function searchDimensionKeywords(dimension: string, content: string): string[] {
  const keywords = KeywordRegistry[dimension as keyof typeof KeywordRegistry];
  if (!keywords) {
    return [];
  }

  const matches: string[] = [];

  // Flatten all keyword lists and search
  for (const list of Object.values(keywords)) {
    if (Array.isArray(list)) {
      for (const keyword of list) {
        if (typeof keyword === 'string') {
          if (content.toLowerCase().includes(keyword.toLowerCase())) {
            matches.push(keyword);
          }
        }
      }
    }
  }

  return [...new Set(matches)]; // Remove duplicates
}
