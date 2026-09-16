const logger = require('./logger.cjs');
const ruleLoader = require('./ruleLoader.cjs');
const patternEngine = require('./patternEngine.cjs');
const scoreCalculator = require('./scoreCalculator.cjs');
const validationResultBuilder = require('./validationResultBuilder.cjs');
const { ValidationError } = require('./errors.cjs');
const config = require('./config.cjs');

class ChangelogValidator {
  constructor() {
    this.rulesCache = null;
    this.layerOrder = ['format', 'structure', 'content', 'reference'];
  }

  validate(entry, rulesFilePath, options = {}) {
    const { stopOnError = false, context = {} } = options;

    try {
      const rulesData = ruleLoader.loadRules(rulesFilePath);
      const enabledRules = rulesData.rules.filter(r => r.enabled);

      logger.info(`Starting validation with ${enabledRules.length} enabled rules`);

      const ruleResults = [];
      const executedRules = [];

      for (const layerType of this.layerOrder) {
        logger.debug(`Executing validation layer: ${layerType}`);

        const layerRules = enabledRules.filter(r => r.rule_type === layerType);
        const layerResults = this.validateLayer(entry, layerRules, layerType);

        ruleResults.push(...layerResults);
        executedRules.push(...layerRules);

        if (layerType === 'format') {
          const hasErrors = layerResults.some(
            r => r.status === 'failed' && r.severity === 'error'
          );
          if (hasErrors && stopOnError) {
            logger.warn('Format errors detected, stopping validation');
            break;
          }
        }
      }

      const scoreResult = scoreCalculator.calculateScore(ruleResults);

      const result = validationResultBuilder.buildResult({
        entryId: context.entryId || '',
        filename: context.filename || '',
        ruleResults,
        complianceScore: scoreResult.score,
        complianceStatus: scoreResult.status,
        executedRules
      });

      logger.info(
        `Validation complete: score=${scoreResult.score}, status=${scoreResult.status}`
      );

      return result;
    } catch (error) {
      logger.error(`Validation failed: ${error.message}`);
      throw new ValidationError(`Validation failed: ${error.message}`);
    }
  }

  validateLayer(entry, rules, layerType) {
    const results = [];

    for (const rule of rules) {
      try {
        let result;

        switch (rule.id) {
          case 'R001':
            result = this.validateNoImplementationDetails(entry, rule);
            break;
          case 'R002':
            result = this.validateHasCategory(entry, rule);
            break;
          case 'R003':
            result = this.validateHasTitle(entry, rule);
            break;
          case 'R004':
            result = this.validateHasDescription(entry, rule);
            break;
          case 'R005':
            result = this.validateClearLanguage(entry, rule);
            break;
          case 'R006':
            result = this.validateProperFormatting(entry, rule);
            break;
          case 'R007':
            result = this.validateNoBackticks(entry, rule);
            break;
          case 'R008':
            result = this.validateNoInternalTerminology(entry, rule);
            break;
          case 'R009':
            result = this.validateHasPRReference(entry, rule);
            break;
          case 'R010':
            result = this.validateValidPRReference(entry, rule);
            break;
          case 'R011':
            result = this.validateMeaningfulDescription(entry, rule);
            break;
          case 'R012':
            result = this.validateUserFocused(entry, rule);
            break;
          case 'R013':
            result = this.validateNoEmoji(entry, rule);
            break;
          case 'R014':
            result = this.validateConsistentTense(entry, rule);
            break;
          case 'R015':
            result = this.validateProperDates(entry, rule);
            break;
          case 'R016':
            result = this.validateNoTodos(entry, rule);
            break;
          case 'R017':
            result = this.validateAppropriateLength(entry, rule);
            break;
          case 'R018':
            result = this.validateNoPersonalPronouns(entry, rule);
            break;
          case 'R019':
            result = this.validateNoMarketingHype(entry, rule);
            break;
          case 'R020':
            result = this.validateValidCategory(entry, rule);
            break;
          default:
            result = validationResultBuilder.createSkippedResult({
              ruleId: rule.id,
              ruleName: rule.name,
              reason: 'Rule not implemented'
            });
        }

        results.push(result);
      } catch (error) {
        logger.error(`Error executing rule ${rule.id}: ${error.message}`);
        results.push(
          validationResultBuilder.createSkippedResult({
            ruleId: rule.id,
            ruleName: rule.name,
            reason: `Execution error: ${error.message}`
          })
        );
      }
    }

    return results;
  }

  validateNoImplementationDetails(entry, rule) {
    const text = `${entry.title || ''} ${entry.description || ''}`;
    const compiled = patternEngine.compilePatterns(rule.patterns || []);
    const matches = patternEngine.applyPatterns(text, compiled);

    if (matches.length > 0) {
      return validationResultBuilder.createFailedResult({
        ruleId: rule.id,
        ruleName: rule.name,
        severity: rule.severity,
        message: 'Entry contains implementation details or code patterns',
        matches,
        remediationGuidance: rule.remediation_guidance
      });
    }

    return validationResultBuilder.createPassedResult({
      ruleId: rule.id,
      ruleName: rule.name
    });
  }

  validateHasCategory(entry, rule) {
    if (!entry.category) {
      return validationResultBuilder.createFailedResult({
        ruleId: rule.id,
        ruleName: rule.name,
        severity: rule.severity,
        message: 'Entry is missing required "category" field',
        remediationGuidance: rule.remediation_guidance
      });
    }

    return validationResultBuilder.createPassedResult({
      ruleId: rule.id,
      ruleName: rule.name
    });
  }

  validateHasTitle(entry, rule) {
    if (!entry.title) {
      return validationResultBuilder.createFailedResult({
        ruleId: rule.id,
        ruleName: rule.name,
        severity: rule.severity,
        message: 'Entry is missing required "title" field',
        remediationGuidance: rule.remediation_guidance
      });
    }

    return validationResultBuilder.createPassedResult({
      ruleId: rule.id,
      ruleName: rule.name
    });
  }

  validateHasDescription(entry, rule) {
    if (!entry.description) {
      return validationResultBuilder.createFailedResult({
        ruleId: rule.id,
        ruleName: rule.name,
        severity: rule.severity,
        message: 'Entry is missing required "description" field',
        remediationGuidance: rule.remediation_guidance
      });
    }

    return validationResultBuilder.createPassedResult({
      ruleId: rule.id,
      ruleName: rule.name
    });
  }

  validateClearLanguage(entry, rule) {
    const text = entry.description || '';
    const compiled = patternEngine.compilePatterns(rule.patterns || []);
    const matches = patternEngine.applyPatterns(text, compiled);

    if (matches.length > 0) {
      return validationResultBuilder.createFailedResult({
        ruleId: rule.id,
        ruleName: rule.name,
        severity: rule.severity,
        message: 'Entry uses unclear language or jargon',
        matches,
        remediationGuidance: rule.remediation_guidance
      });
    }

    return validationResultBuilder.createPassedResult({
      ruleId: rule.id,
      ruleName: rule.name
    });
  }

  validateProperFormatting(entry, rule) {
    if (!entry || typeof entry !== 'object') {
      return validationResultBuilder.createFailedResult({
        ruleId: rule.id,
        ruleName: rule.name,
        severity: rule.severity,
        message: 'Entry is not a valid object',
        remediationGuidance: rule.remediation_guidance
      });
    }

    return validationResultBuilder.createPassedResult({
      ruleId: rule.id,
      ruleName: rule.name
    });
  }

  validateNoBackticks(entry, rule) {
    const text = `${entry.title || ''} ${entry.description || ''}`;
    const compiled = patternEngine.compilePatterns(rule.patterns || []);
    const matches = patternEngine.applyPatterns(text, compiled);

    if (matches.length > 0) {
      return validationResultBuilder.createFailedResult({
        ruleId: rule.id,
        ruleName: rule.name,
        severity: rule.severity,
        message: 'Entry contains code blocks or inline code (backticks)',
        matches,
        remediationGuidance: rule.remediation_guidance
      });
    }

    return validationResultBuilder.createPassedResult({
      ruleId: rule.id,
      ruleName: rule.name
    });
  }

  validateNoInternalTerminology(entry, rule) {
    const text = `${entry.title || ''} ${entry.description || ''}`;
    const compiled = patternEngine.compilePatterns(rule.patterns || []);
    const matches = patternEngine.applyPatterns(text, compiled);

    if (matches.length > 0) {
      return validationResultBuilder.createFailedResult({
        ruleId: rule.id,
        ruleName: rule.name,
        severity: rule.severity,
        message: 'Entry contains internal terminology or acronyms',
        matches,
        remediationGuidance: rule.remediation_guidance
      });
    }

    return validationResultBuilder.createPassedResult({
      ruleId: rule.id,
      ruleName: rule.name
    });
  }

  validateHasPRReference(entry, rule) {
    // Check for structured pr_references field first
    if (entry.pr_references && Array.isArray(entry.pr_references) && entry.pr_references.length > 0) {
      return validationResultBuilder.createPassedResult({
        ruleId: rule.id,
        ruleName: rule.name,
        message: `PR references found: ${entry.pr_references.join(', ')}`
      });
    }

    // Fall back to checking text for PR pattern
    const text = `${entry.title || ''} ${entry.description || ''}`;
    const referencePattern = /#\d+/;

    if (!referencePattern.test(text)) {
      return validationResultBuilder.createFailedResult({
        ruleId: rule.id,
        ruleName: rule.name,
        severity: rule.severity,
        message: 'Entry should reference a PR or issue (e.g., #1234)',
        remediationGuidance: rule.remediation_guidance
      });
    }

    return validationResultBuilder.createPassedResult({
      ruleId: rule.id,
      ruleName: rule.name
    });
  }

  validateValidPRReference(entry, rule) {
    const text = `${entry.title || ''} ${entry.description || ''}`;
    const matches = (text.match(/#(\d+)/g) || []).map(m => m.substring(1));

    if (matches.length > 0) {
      return validationResultBuilder.createPassedResult({
        ruleId: rule.id,
        ruleName: rule.name,
        message: `Found ${matches.length} PR reference(s)`
      });
    }

    return validationResultBuilder.createPassedResult({
      ruleId: rule.id,
      ruleName: rule.name,
      message: 'No PR references found (optional)'
    });
  }

  validateMeaningfulDescription(entry, rule) {
    const description = entry.description || '';

    if (description.length < 20) {
      return validationResultBuilder.createFailedResult({
        ruleId: rule.id,
        ruleName: rule.name,
        severity: rule.severity,
        message: `Description too short (${description.length} characters, needs at least 20)`,
        remediationGuidance: rule.remediation_guidance
      });
    }

    return validationResultBuilder.createPassedResult({
      ruleId: rule.id,
      ruleName: rule.name
    });
  }

  validateUserFocused(entry, rule) {
    const text = `${entry.title || ''} ${entry.description || ''}`;
    const compiled = patternEngine.compilePatterns(rule.patterns || []);
    const matches = patternEngine.applyPatterns(text, compiled);

    if (matches.length > 0) {
      return validationResultBuilder.createFailedResult({
        ruleId: rule.id,
        ruleName: rule.name,
        severity: rule.severity,
        message: 'Entry appears to focus on implementation rather than user benefit',
        matches,
        remediationGuidance: rule.remediation_guidance
      });
    }

    return validationResultBuilder.createPassedResult({
      ruleId: rule.id,
      ruleName: rule.name
    });
  }

  validateNoEmoji(entry, rule) {
    const text = `${entry.title || ''} ${entry.description || ''}`;
    const compiled = patternEngine.compilePatterns(rule.patterns || []);
    const matches = patternEngine.applyPatterns(text, compiled);

    if (matches.length > 0) {
      return validationResultBuilder.createFailedResult({
        ruleId: rule.id,
        ruleName: rule.name,
        severity: rule.severity,
        message: 'Entry contains emoji',
        matches,
        remediationGuidance: rule.remediation_guidance
      });
    }

    return validationResultBuilder.createPassedResult({
      ruleId: rule.id,
      ruleName: rule.name
    });
  }

  validateConsistentTense(entry, rule) {
    const text = `${entry.title || ''} ${entry.description || ''}`;
    const compiled = patternEngine.compilePatterns(rule.patterns || []);
    const matches = patternEngine.applyPatterns(text, compiled);

    if (matches.length > 1) {
      return validationResultBuilder.createFailedResult({
        ruleId: rule.id,
        ruleName: rule.name,
        severity: rule.severity,
        message: 'Entry may have inconsistent tense usage',
        matches: matches.slice(0, 2),
        remediationGuidance: rule.remediation_guidance
      });
    }

    return validationResultBuilder.createPassedResult({
      ruleId: rule.id,
      ruleName: rule.name
    });
  }

  validateProperDates(entry, rule) {
    if (!entry.date) {
      return validationResultBuilder.createPassedResult({
        ruleId: rule.id,
        ruleName: rule.name,
        message: 'No date field to validate'
      });
    }

    let dateString = entry.date;

    // If date was parsed as a Date object, convert back to ISO string
    if (entry.date instanceof Date) {
      dateString = entry.date.toISOString().split('T')[0];
    }

    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!datePattern.test(String(dateString))) {
      return validationResultBuilder.createFailedResult({
        ruleId: rule.id,
        ruleName: rule.name,
        severity: rule.severity,
        message: `Date "${entry.date}" is not in ISO 8601 format (YYYY-MM-DD)`,
        remediationGuidance: rule.remediation_guidance
      });
    }

    return validationResultBuilder.createPassedResult({
      ruleId: rule.id,
      ruleName: rule.name
    });
  }

  validateNoTodos(entry, rule) {
    const text = `${entry.title || ''} ${entry.description || ''}`;
    const compiled = patternEngine.compilePatterns(rule.patterns || []);
    const matches = patternEngine.applyPatterns(text, compiled);

    if (matches.length > 0) {
      return validationResultBuilder.createFailedResult({
        ruleId: rule.id,
        ruleName: rule.name,
        severity: rule.severity,
        message: 'Entry contains TODO or FIXME comments',
        matches,
        remediationGuidance: rule.remediation_guidance
      });
    }

    return validationResultBuilder.createPassedResult({
      ruleId: rule.id,
      ruleName: rule.name
    });
  }

  validateAppropriateLength(entry, rule) {
    const description = entry.description || '';
    const sentenceCount = (description.match(/\./g) || []).length;

    if (sentenceCount < 1 || sentenceCount > 3) {
      return validationResultBuilder.createFailedResult({
        ruleId: rule.id,
        ruleName: rule.name,
        severity: rule.severity,
        message: `Description has ${sentenceCount} sentence(s), should be 1-3 sentences`,
        remediationGuidance: rule.remediation_guidance
      });
    }

    return validationResultBuilder.createPassedResult({
      ruleId: rule.id,
      ruleName: rule.name
    });
  }

  validateNoPersonalPronouns(entry, rule) {
    const text = `${entry.title || ''} ${entry.description || ''}`;
    const compiled = patternEngine.compilePatterns(rule.patterns || []);
    const matches = patternEngine.applyPatterns(text, compiled);

    if (matches.length > 0) {
      return validationResultBuilder.createFailedResult({
        ruleId: rule.id,
        ruleName: rule.name,
        severity: rule.severity,
        message: 'Entry contains personal pronouns (I, we, you, etc.)',
        matches,
        remediationGuidance: rule.remediation_guidance
      });
    }

    return validationResultBuilder.createPassedResult({
      ruleId: rule.id,
      ruleName: rule.name
    });
  }

  validateNoMarketingHype(entry, rule) {
    const text = `${entry.title || ''} ${entry.description || ''}`;
    const compiled = patternEngine.compilePatterns(rule.patterns || []);
    const matches = patternEngine.applyPatterns(text, compiled);

    if (matches.length > 0) {
      return validationResultBuilder.createFailedResult({
        ruleId: rule.id,
        ruleName: rule.name,
        severity: rule.severity,
        message: 'Entry contains marketing language or superlatives',
        matches,
        remediationGuidance: rule.remediation_guidance
      });
    }

    return validationResultBuilder.createPassedResult({
      ruleId: rule.id,
      ruleName: rule.name
    });
  }

  validateValidCategory(entry, rule) {
    const validCategories = config.VALID_CATEGORIES;

    if (!entry.category) {
      return validationResultBuilder.createSkippedResult({
        ruleId: rule.id,
        ruleName: rule.name,
        reason: 'Category not present (checked by R002)'
      });
    }

    if (!validCategories.includes(entry.category)) {
      return validationResultBuilder.createFailedResult({
        ruleId: rule.id,
        ruleName: rule.name,
        severity: rule.severity,
        message: `Category "${entry.category}" is not valid. Must be one of: ${validCategories.join(', ')}`,
        remediationGuidance: rule.remediation_guidance
      });
    }

    return validationResultBuilder.createPassedResult({
      ruleId: rule.id,
      ruleName: rule.name
    });
  }
}

module.exports = new ChangelogValidator();
