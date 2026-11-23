import { ThemeTokens } from '../lib/theme-tokens';
import { TokenMatcher } from '../lib/token-matcher';
import { themeJson } from './fixtures';

describe('TokenMatcher', () => {
  const matcher = new TokenMatcher(ThemeTokens.fromThemeJson([themeJson]));

  it('maps properties to token families', () => {
    expect(TokenMatcher.familyFor('background-color')).toBe('color');
    expect(TokenMatcher.familyFor('padding-inline-start')).toBe('spacing');
    expect(TokenMatcher.familyFor('row-gap')).toBe('spacing');
    expect(TokenMatcher.familyFor('border-top-left-radius')).toBe('radius');
    expect(TokenMatcher.familyFor('border-top-width')).toBe('border-width');
    expect(TokenMatcher.familyFor('display')).toBeUndefined();
  });

  it('skips keywords, zero and unmapped properties', () => {
    expect(matcher.match('display', 'flex', 1440).status).toBe('skip');
    expect(matcher.match('margin-top', 'auto', 1440).status).toBe('skip');
    expect(matcher.match('padding-top', '0px', 1440).status).toBe('skip');
    expect(matcher.match('background-color', 'rgba(0, 0, 0, 0)', 1440).status).toBe('skip');
    expect(matcher.match('color', 'currentcolor', 1440).status).toBe('skip');
    expect(matcher.match('padding-top', '50%', 1440).status).toBe('skip');
  });

  it('lists every exact colour token, semantic first', () => {
    const match = matcher.match('color', 'rgb(10, 10, 10)', 1440);
    expect(match.status).toBe('exact');
    expect(match.tokens[0]).toEqual({
      cssVar: '--wp--custom--color--text--default',
      semantic: true,
    });
    expect(match.tokens.map((t) => t.preset)).toContain('var:preset|color|contrast');
  });

  it('reports the nearest colour when nothing matches', () => {
    expect(matcher.match('color', 'rgb(200, 145, 80)', 1440)).toMatchObject({ status: 'near' });
    const none = matcher.match('color', 'rgb(0, 200, 0)', 1440);
    expect(none.status).toBe('none');
    expect(none.delta).toMatch(/^distance \d+$/);
  });

  it('matches fluid spacing per viewport', () => {
    expect(matcher.match('padding-top', '18px', 390).tokens[0].preset).toBe(
      'var:preset|spacing|20'
    );
    expect(matcher.match('padding-top', '20px', 1440).tokens[0].preset).toBe(
      'var:preset|spacing|20'
    );
    const near = matcher.match('padding-top', '21px', 1440);
    expect(near).toMatchObject({ status: 'near', delta: '-1px' });
    expect(matcher.match('padding-top', '300px', 1440).status).toBe('none');
  });

  it('matches each part of a shorthand', () => {
    const match = matcher.match('padding', '10px 0px 40px 11px', 1440);
    expect(match.status).toBe('near');
    expect(match.parts!.map((p) => p.status)).toEqual(['exact', 'skip', 'exact', 'near']);
    expect(matcher.match('padding', '10px 40px', 1440).status).toBe('exact');
  });

  it('matches fluid font sizes', () => {
    expect(matcher.match('font-size', '32px', 1440).tokens[0].preset).toBe(
      'var:preset|font-size|500'
    );
    expect(matcher.match('font-size', '20px', 320).tokens[0].preset).toBe(
      'var:preset|font-size|500'
    );
  });

  it('matches font families on the first family', () => {
    expect(matcher.match('font-family', 'Moret, serif', 1440).tokens[0].preset).toBe(
      'var:preset|font-family|heading'
    );
    expect(matcher.match('font-family', '"Argesta Display", serif', 1440).status).toBe('exact');
    expect(matcher.match('font-family', 'Arial', 1440)).toMatchObject({ status: 'none' });
  });

  it('matches shadows whatever the order the browser writes them in', () => {
    expect(matcher.match('box-shadow', 'rgba(9, 9, 9, 0.2) 0px 2px 4px 0px', 1440).status).toBe(
      'exact'
    );
    expect(
      matcher.match(
        'box-shadow',
        'rgba(0, 0, 0, 0.2) 0px 1px 2px 0px inset, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px',
        1440
      ).status
    ).toBe('exact');
    expect(matcher.match('box-shadow', 'rgb(0, 0, 0) 0px 9px 9px 0px', 1440).status).toBe('none');
    expect(matcher.normaliseShadow('2px 2px')).toBe('2 2 0 0 ?');
  });

  it('matches web-font aliases to the family', () => {
    expect(TokenMatcher.fontKey('argesta_displayregular, serif')).toBe('argestadisplay');
    expect(matcher.match('font-family', 'argesta_displayregular, serif', 1440).status).toBe(
      'exact'
    );
  });

  it('skips the colour of a border or outline that cannot be seen', () => {
    const black = 'rgb(10, 10, 10)';
    expect(
      matcher.match('border-top-color', black, 1440, { 'border-top-width': '0px' }).status
    ).toBe('skip');
    expect(matcher.match('outline-color', black, 1440, { 'outline-style': 'none' }).status).toBe(
      'skip'
    );
    expect(
      matcher.match('border-top-color', black, 1440, { 'border-top-width': '1px' }).status
    ).toBe('exact');
  });

  it('matches weights, line heights and letter spacing', () => {
    expect(matcher.match('font-weight', '700', 1440).tokens[0].cssVar).toBe(
      '--wp--custom--font-weight--bold'
    );
    expect(matcher.match('font-weight', '600', 1440)).toMatchObject({
      status: 'near',
      delta: '+100',
    });
    expect(matcher.match('font-weight', 'bold', 1440).status).toBe('skip');
    const styles = { 'font-size': '16px' };
    expect(matcher.match('line-height', '24px', 1440, styles).tokens[0].cssVar).toBe(
      '--wp--custom--line-height--normal'
    );
    expect(matcher.match('line-height', '32px', 1440, styles).tokens[0].cssVar).toBe(
      '--wp--custom--line-height--loose'
    );
    expect(matcher.match('line-height', '1.1', 1440).status).toBe('exact');
    expect(matcher.match('line-height', 'abc', 1440).status).toBe('skip');
    expect(matcher.match('letter-spacing', '1px', 1440, { 'font-size': '20px' }).status).toBe(
      'exact'
    );
    expect(matcher.match('border-top-width', '1px', 1440).status).toBe('exact');
    expect(matcher.match('border-top-left-radius', '8px', 1440).tokens[0].preset).toBe(
      'var:preset|border-radius|200'
    );
  });

  it('says when a family has no tokens', () => {
    const empty = new TokenMatcher(ThemeTokens.fromThemeJson([{ settings: {} }]));
    expect(empty.match('padding-top', '10px', 1440)).toMatchObject({ status: 'none' });
    expect(empty.match('font-weight', '400', 1440)).toMatchObject({ status: 'none' });
  });

  it('evaluates shadow lengths at the element font size and viewport', () => {
    const em = new TokenMatcher(
      ThemeTokens.fromThemeJson([
        { settings: { shadow: { presets: [{ slug: 'a', shadow: '0 1em 0 #000' }] } } },
      ])
    );
    expect(
      em.match('box-shadow', 'rgb(0, 0, 0) 0px 20px 0px 0px', 390, { 'font-size': '20px' }).status
    ).toBe('exact');
    expect(
      em.match('box-shadow', 'rgb(0, 0, 0) 0px 20px 0px 0px', 390, { 'font-size': '16px' }).status
    ).toBe('none');
  });

  it('splits on top-level commas only', () => {
    expect(TokenMatcher.splitTopLevel('a(1, 2), b')).toEqual(['a(1, 2)', ' b']);
  });
});
