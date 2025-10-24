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
