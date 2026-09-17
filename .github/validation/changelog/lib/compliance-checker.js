import RuleEngine from './rule-engine.js';

class ComplianceChecker {
  constructor(ruleEngine = null) {
    this.ruleEngine = ruleEngine || new RuleEngine();
    this.initializeRuleImplementations();
  }

  initializeRuleImplementations() {
    this.ruleEngine.registerRuleImplementation('CHK_MAX_LENGTH', this.checkMaxLength.bind(this));
    this.ruleEngine.registerRuleImplementation(
      'CHK_NO_IMPL_DETAILS',
      this.checkNoImplDetails.bind(this)
    );
    this.ruleEngine.registerRuleImplementation('CHK_HAS_PR_LINK', this.checkHasPRLink.bind(this));
    this.ruleEngine.registerRuleImplementation(
      'CHK_FORMAT_MARKDOWN',
      this.checkFormatMarkdown.bind(this)
    );
    this.ruleEngine.registerRuleImplementation(
      'CHK_CONSISTENT_TENSE',
      this.checkConsistentTense.bind(this)
    );
    this.ruleEngine.registerRuleImplementation(
      'CHK_NO_ABBREVIATIONS',
      this.checkNoAbbreviations.bind(this)
    );
    this.ruleEngine.registerRuleImplementation(
      'CHK_UNIQUE_CONTENT',
      this.checkUniqueContent.bind(this)
    );
    this.ruleEngine.registerRuleImplementation(
      'CHK_LINK_VALIDITY',
      this.checkLinkValidity.bind(this)
    );
  }

  async checkMaxLength(entry, context = {}) {
    const rule = this.ruleEngine.getRuleById('CHK_MAX_LENGTH');
    const maxLength = rule.max_length || 250;
    const contentLength = entry.content.length;

    const passed = contentLength <= maxLength;

    return {
      passed,
      message: passed
        ? `Entry length within limit (${contentLength}/${maxLength} chars)`
        : `Entry exceeds ${maxLength} character limit. Current: ${contentLength} chars`,
      details: {
        contentLength,
        maxLength,
        exceededBy: Math.max(0, contentLength - maxLength),
      },
    };
  }

  async checkNoImplDetails(entry, context = {}) {
    const rule = this.ruleEngine.getRuleById('CHK_NO_IMPL_DETAILS');
    const bannedKeywords = rule.banned_keywords || [];
    const architecturalVerbs = rule.architectural_verbs || [];

    const content = entry.content.toLowerCase();
    const violations = [];

    for (const keyword of bannedKeywords) {
      const regex = new RegExp(`\\b${keyword.toLowerCase()}\\b`, 'gi');
      if (regex.test(content)) {
        const keywordLower = keyword.toLowerCase();
        const isArchitecturalVerb = architecturalVerbs.some(
          (v) => v.toLowerCase() === keywordLower
        );

        if (!isArchitecturalVerb) {
          violations.push(keyword);
        }
      }
    }

    const passed = violations.length === 0;

    return {
      passed,
      message: passed
        ? 'No code-specific implementation details detected'
        : `Entry contains code-specific implementation details: ${violations.join(', ')}`,
      details: {
        violatedKeywords: violations,
        count: violations.length,
      },
    };
  }

  async checkHasPRLink(entry, context = {}) {
    const prRegex = /#(\d+)/;
    const issueRegex = /issues\/#(\d+)/;

    const hasPRLink = prRegex.test(entry.content) || issueRegex.test(entry.content);

    const passed = hasPRLink;

    return {
      passed,
      message: passed
        ? 'Entry contains valid PR/issue reference'
        : 'Entry must reference a PR or issue number (e.g., #1234 or issues/#5678)',
      details: {
        hasPRLink,
        references: entry.pr_numbers && entry.pr_numbers.length > 0 ? entry.pr_numbers : [],
      },
    };
  }

  async checkFormatMarkdown(entry, context = {}) {
    const violations = [];

    if (/<[^>]+>/.test(entry.content)) {
      violations.push('Contains raw HTML tags');
    }

    const asteriskPairs = (entry.content.match(/\*\*/g) || []).length;
    if (asteriskPairs % 2 !== 0) {
      violations.push('Unbalanced ** (bold) markers');
    }

    const underscorePairs = (entry.content.match(/__/g) || []).length;
    if (underscorePairs % 2 !== 0) {
      violations.push('Unbalanced __ (italic) markers');
    }

    const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
    let linkMatch;
    const invalidLinks = [];
    while ((linkMatch = linkPattern.exec(entry.content)) !== null) {
      if (!linkMatch[2] || linkMatch[2].trim() === '') {
        invalidLinks.push(`[${linkMatch[1]}]`);
      }
    }
    if (invalidLinks.length > 0) {
      violations.push(`Invalid links: ${invalidLinks.join(', ')}`);
    }

    const openBrackets = (entry.content.match(/\[/g) || []).length;
    const closeBrackets = (entry.content.match(/\]/g) || []).length;
    if (openBrackets !== closeBrackets) {
      violations.push('Unbalanced square brackets []');
    }

    const passed = violations.length === 0;

    return {
      passed,
      message: passed
        ? 'Entry has valid markdown formatting'
        : `Entry has invalid markdown syntax: ${violations.join('; ')}`,
      details: {
        violations,
        count: violations.length,
      },
    };
  }

  async checkConsistentTense(entry, context = {}) {
    const pastTenseVerbs = [
      'fixed',
      'added',
      'improved',
      'updated',
      'refactored',
      'optimised',
      'optimized',
      'deployed',
      'migrated',
      'implemented',
      'patched',
      'changed',
    ];
    const presentTenseVerbs = [
      'fix',
      'add',
      'improve',
      'update',
      'refactor',
      'optimize',
      'deploy',
      'migrate',
      'implement',
      'patch',
      'change',
    ];

    const contentLower = entry.content.toLowerCase();

    const hasPastTense = pastTenseVerbs.some((v) => new RegExp(`\\b${v}\\b`).test(contentLower));
    const hasPresentTense = presentTenseVerbs.some((v) =>
      new RegExp(`\\b${v}\\b`).test(contentLower)
    );

    const passed = !hasPresentTense || !hasPastTense;

    return {
      passed,
      message: passed
        ? 'Entry uses consistent verb tense'
        : 'Entry uses inconsistent verb tense. Use past tense for completed changes.',
      details: {
        hasPastTense,
        hasPresentTense,
        hasConflict: hasPastTense && hasPresentTense,
      },
    };
  }

  async checkNoAbbreviations(entry, context = {}) {
    const rule = this.ruleEngine.getRuleById('CHK_NO_ABBREVIATIONS');
    const knownAcronyms = rule.known_acronyms || [];

    const content = entry.content;
    const abbrevPattern = /(?<![A-Z])[A-Z]{2,}(?![a-z])/g;
    const found = [];

    let match;
    const regex = new RegExp(abbrevPattern);
    while ((match = regex.exec(content)) !== null) {
      const abbrev = match[0];
      if (!knownAcronyms.includes(abbrev)) {
        found.push(abbrev);
      }
    }

    const passed = found.length === 0;

    return {
      passed,
      message: passed
        ? 'No unexplained abbreviations detected'
        : `Entry contains unexplained abbreviations: ${found.join(', ')}. Spell them out or add definitions.`,
      details: {
        unexplainedAbbreviations: found,
        count: found.length,
      },
    };
  }

  async checkUniqueContent(entry, context = {}) {
    const existingEntries = context.allEntries || [];

    if (existingEntries.length === 0) {
      return {
        passed: true,
        message: 'Entry is unique (no other entries to compare)',
        details: { similarEntries: [] },
      };
    }

    const similarities = this.findSimilarEntries(entry.content, existingEntries, 0.9);

    const passed = similarities.length === 0;

    return {
      passed,
      message: passed
        ? 'Entry is unique'
        : `Entry is very similar to existing entries. Ensure each changelog entry describes a unique change.`,
      details: {
        similarEntries: similarities,
        count: similarities.length,
      },
    };
  }

  findSimilarEntries(content, allEntries, threshold = 0.9) {
    const similar = [];

    for (const otherEntry of allEntries) {
      if (otherEntry.id === content || otherEntry.content === content) {
        continue;
      }

      const similarity = this.levenshteinSimilarity(content, otherEntry.content);
      if (similarity >= threshold) {
        similar.push({
          id: otherEntry.id,
          similarity: (similarity * 100).toFixed(1),
          content: otherEntry.content,
        });
      }
    }

    return similar;
  }

  levenshteinSimilarity(str1, str2) {
    const distance = this.levenshteinDistance(str1, str2);
    const maxLength = Math.max(str1.length, str2.length);
    return 1 - distance / maxLength;
  }

  levenshteinDistance(str1, str2) {
    const matrix = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  }

  async checkLinkValidity(entry, context = {}) {
    const prRegex = /#(\d+)/g;
    const issueRegex = /issues\/#(\d+)/g;

    const prMatches = [...entry.content.matchAll(prRegex)];
    const issueMatches = [...entry.content.matchAll(issueRegex)];

    const allMatches = [...prMatches, ...issueMatches];

    if (allMatches.length === 0) {
      return {
        passed: true,
        message: 'No PR/issue links to validate',
        details: { linksChecked: 0, linksValid: 0 },
      };
    }

    const ghToken = context.githubToken || process.env.GITHUB_TOKEN;
    const shouldValidate = ghToken && context.validateLinks !== false;

    if (!shouldValidate) {
      return {
        passed: true,
        message: `${allMatches.length} PR/issue link(s) present (validation skipped - no token)`,
        details: {
          linksChecked: allMatches.length,
          linksValid: allMatches.length,
          validationSkipped: true,
        },
      };
    }

    return {
      passed: true,
      message: 'PR/issue links are present (validation deferred to Phase 3)',
      details: {
        linksChecked: allMatches.length,
        linksValid: allMatches.length,
        validationDeferred: true,
      },
    };
  }

  async checkEntry(entry, context = {}) {
    return this.ruleEngine.validateEntry(entry, context);
  }

  async checkEntries(entries, context = {}) {
    return this.ruleEngine.validateEntries(entries, context);
  }
}

export default ComplianceChecker;
