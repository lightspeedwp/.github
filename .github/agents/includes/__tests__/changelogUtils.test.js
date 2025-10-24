const fs = require('fs');
const { validateChangelogLinks } = require('../changelogUtils');

jest.mock('fs');

describe('changelogUtils', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    test('validateChangelogLinks returns lines missing links', () => {
        fs.existsSync.mockReturnValue(true);
        fs.readFileSync.mockReturnValue(`
## [Unreleased]
### Added
- New feature
- Fixed bug (#123)
## [1.0.0]
- Old entry
`);
        const result = validateChangelogLinks('CHANGELOG.md');
        expect(result).toEqual(expect.arrayContaining(['- New feature']));
        expect(result).not.toContain('- Fixed bug (#123)');
    });

    test('validateChangelogLinks returns [] if no unreleased section', () => {
        fs.existsSync.mockReturnValue(true);
        fs.readFileSync.mockReturnValue('## [1.0.0]\n- Old entry');
        expect(validateChangelogLinks('CHANGELOG.md')).toEqual([]);
    });
});
