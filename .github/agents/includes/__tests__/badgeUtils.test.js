const fs = require('fs');
// ...existing code...
const { generateWorkflowBadges, updateReadmeBadges } = require('../badgeUtils');

jest.mock('fs');

describe('badgeUtils', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    test('generateWorkflowBadges returns badge markdown', () => {
        fs.existsSync.mockReturnValue(true);
        fs.readdirSync.mockReturnValue(['ci.yml', 'deploy.yaml']);
        const badges = generateWorkflowBadges(
            'lightspeedwp/testrepo',
            'main',
            'stacked'
        );
        expect(
            badges.some(
                (b) =>
                    b.includes('ci') &&
                    b.includes('github.com/lightspeedwp/testrepo')
            )
        ).toBe(true);
        expect(badges.some((b) => b.includes('deploy'))).toBe(true);
    });

    test('updateReadmeBadges inserts badge block', () => {
        fs.readFileSync.mockReturnValue('# Title\n');
        fs.writeFileSync.mockImplementation(() => {});
        updateReadmeBadges('README.md', ['[![Test](url)](link)']);
        expect(fs.writeFileSync).toHaveBeenCalledWith(
            expect.anything(),
            expect.stringContaining('BADGES-START')
        );
    });
});
