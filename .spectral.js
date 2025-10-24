/**
 * Spectral Configuration (Alternative) for LightSpeedWP
 *
 * Alternative Spectral configuration file for YAML/JSON linting.
 * Includes GitHub Actions specific rules and basic validation.
 *
 * @see {@link https://meta.stoplight.io/docs/spectral Spectral Documentation}
 * @author LightSpeedWP Team
 */

/**
 * Spectral configuration object with basic rules
 *
 * @type {import('@stoplight/spectral-core').RulesetDefinition}
 */
module.exports = {
    extends: ['spectral:recommended'],
    rules: {
        'document-defined': true,
        'no-empty-keys': true,
        'no-unused-variables': false,
        'github-action-mandatory-name': {
            description: 'GitHub Action must have a name',
            given: '$',
            then: {
                field: 'name',
                function: 'truthy',
            },
        },
    },
};
