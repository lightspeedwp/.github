/**
 * Every check: silent on the clean fixture theme, and reports the one thing each test breaks.
 */
import { describe, expect, it } from 'vitest';
import { allChecks } from '../lib/checks';
import { HeadingOrderCheck, ImageAltCheck, SingleH1Check } from '../lib/checks/a11y';
import { DatabaseIdCheck, MarkupParseCheck, UnknownBlockCheck } from '../lib/checks/markup';
import {
  NestedPatternCheck,
  PatternCategoryCheck,
  PatternEscapingCheck,
  PatternHeaderCheck,
  PatternRecommendedHeaderCheck,
  PatternSlugCheck,
  PatternSlugFilenameCheck,
  PatternTextDomainCheck,
} from '../lib/checks/patterns';
import {
  ImportantCheck,
  MediaInCssCheck,
  PseudoStateKeyCheck,
  RawFontFamilyCheck,
  RawHexCheck,
  RawPxCheck,
} from '../lib/checks/styles';
import { PatternRefCheck, TemplateNameCheck, TemplatePartRefCheck } from '../lib/checks/templates';
import {
  DeclaredFilesCheck,
  DuplicateSlugCheck,
  type SchemaSource,
  ThemeJsonSchemaCheck,
  UndeclaredPartCheck,
} from '../lib/checks/theme-json';
import { OrphanedCustomCheck, OrphanedPresetCheck } from '../lib/checks/tokens';
import type { Check } from '../lib/types';
import { buttonStyle, editThemeJson, fakeSchema, heroPattern, makeTheme } from './fixtures';

const schemas: SchemaSource = { load: (url) => (url.includes('/7.1/') ? fakeSchema : undefined) };
const run = (check: Check, change?: Parameters<typeof makeTheme>[0]) =>
  check.run(makeTheme(change));

describe('the clean fixture theme', () => {
  it.each(allChecks(schemas).map((c) => [c.id, c] as const))('passes %s', (_id, check) => {
    expect(check.run(makeTheme())).toEqual([]);
  });

  it('gives every check a unique id and a description', () => {
    const checks = allChecks(schemas);
    expect(new Set(checks.map((c) => c.id)).size).toBe(checks.length);
    expect(checks.every((c) => c.description.length > 10)).toBe(true);
  });
});

describe('theme-json/schema', () => {
  const check = new ThemeJsonSchemaCheck(schemas);

  it('reports schema errors with a path and line', () => {
    const [f] = run(check, (files) =>
      editThemeJson(files, (j) => ((j as { version: number }).version = 2))
    );
    expect(f).toMatchObject({
      check: 'theme-json/schema',
      file: 'theme.json',
      path: 'version',
      severity: 'error',
    });
    expect(f.line).toBe(3);
  });

  it('validates partials too', () => {
    const findings = run(check, (files) => {
      files['styles/blocks/button-dark.json'] = JSON.stringify({ ...buttonStyle, title: 5 });
    });
    expect(findings.map((f) => f.file)).toEqual(['styles/blocks/button-dark.json']);
  });

  it('reports invalid JSON, a missing $schema and a missing theme.json', () => {
    expect(
      run(check, (files) => (files['styles/blocks/button-dark.json'] = '{'))[0].message
    ).toMatch(/Not valid JSON/);
    expect(
      run(check, (files) => editThemeJson(files, (j) => delete (j as Partial<typeof j>).$schema))[0]
        .message
    ).toBe('No $schema.');
    expect(run(check, (files) => delete files['theme.json'])[0].message).toBe(
      'theme.json is missing.'
    );
  });

  it('warns instead of failing when the schema version is not bundled', () => {
    const [f] = run(check, (files) =>
      editThemeJson(files, (j) => (j.$schema = 'https://schemas.wp.org/wp/6.0/theme.json'))
    );
    expect(f).toMatchObject({ severity: 'warning' });
    expect(f.message).toMatch(/No bundled schema/);
  });
});

describe('theme-json checks', () => {
  it('duplicate-slug: a slug defined twice in one list', () => {
    const findings = run(new DuplicateSlugCheck(), (files) =>
      editThemeJson(files, (j) =>
        j.settings.color.palette.push({ slug: 'base', color: '#eee', name: 'Again' })
      )
    );
    expect(findings).toHaveLength(1);
    expect(findings[0].message).toMatch(/"base" more than once/);
  });

  it('declared-files: customTemplates and templateParts without files', () => {
    const findings = run(new DeclaredFilesCheck(), (files) => {
      delete files['templates/page-wide.html'];
      delete files['parts/header.html'];
    });
    expect(findings.map((f) => f.path)).toEqual(['customTemplates', 'templateParts']);
  });

  it('undeclared-part: a parts/ file missing from templateParts', () => {
    const findings = run(
      new UndeclaredPartCheck(),
      (files) => (files['parts/footer.html'] = '<!-- wp:paragraph /-->')
    );
    expect(findings.map((f) => f.file)).toEqual(['parts/footer.html']);
  });
});

describe('tokens', () => {
  it('orphaned-preset: suggests the nearest slug', () => {
    const findings = run(new OrphanedPresetCheck(), (files) => {
      files['patterns/hero.php'] = heroPattern.replace('spacing|20', 'spacing|30');
    });
    expect(findings).toHaveLength(1);
    expect(findings[0]).toMatchObject({ file: 'patterns/hero.php', line: 12 });
    expect(findings[0].hint).toMatch(/"20"/);
  });

  it('orphaned-preset: a CSS reference with no near match, and slugs a variation defines', () => {
    const findings = run(new OrphanedPresetCheck(), (files) => {
      files['templates/index.html'] += '<p style="color:var(--wp--preset--shadow--deep)"></p>';
      files['styles/dark.json'] = JSON.stringify({
        version: 3,
        settings: { color: { palette: [{ slug: 'night', color: '#000', name: 'Night' }] } },
        styles: { color: { text: 'var:preset|color|night' } },
      });
      files['styles/broken.json'] = '{';
    });
    expect(findings.map((f) => f.message)).toEqual([
      '--wp--preset--shadow--deep is not defined in theme.json.',
    ]);
    expect(findings[0].hint).toMatch(/Define the shadow preset/);
  });

  it('orphaned-custom: JSON and CSS forms', () => {
    const findings = run(new OrphanedCustomCheck(), (files) => {
      files['patterns/hero.php'] +=
        '<!-- wp:paragraph {"style":{"typography":{"fontWeight":"var:custom|font-weight|heavy"}}} /-->';
      files['parts/header.html'] += '<p style="gap:var(--wp--custom--gap)"></p>';
    });
    // Files are read templates, parts, then patterns.
    expect(findings.map((f) => f.message)).toEqual([
      '--wp--custom--gap has no matching settings.custom value.',
      'var:custom|font-weight|heavy has no matching settings.custom value.',
    ]);
  });
});

describe('styles', () => {
  const partial = (styles: object) => (files: Record<string, string>) => {
    files['styles/blocks/button-dark.json'] = JSON.stringify(
      { ...buttonStyle, styles },
      null,
      '\t'
    );
  };

  it('pseudo-state-key: a :hover key in a partial', () => {
    const [f] = run(new PseudoStateKeyCheck(), partial({ ':hover': { color: { text: 'red' } } }));
    expect(f).toMatchObject({ path: 'styles.:hover', file: 'styles/blocks/button-dark.json' });
  });

  it('media-in-css: @media in a block css field, not in root css', () => {
    const findings = run(
      new MediaInCssCheck(),
      partial({ css: '@media (min-width: 1px) { & { color: red; } }' })
    );
    expect(findings.map((f) => f.path)).toEqual(['styles.css']);
    expect(findings[0].file).toBe('styles/blocks/button-dark.json');
  });

  it('raw-px, raw-hex, raw-font-family and important', () => {
    const change = partial({
      css: '& { margin: 12px; color: #fff !important; }',
      typography: { fontFamily: 'Arial' },
    });
    expect(run(new RawPxCheck(), change).map((f) => f.message)).toEqual([
      'Raw 12px in a css field.',
    ]);
    expect(run(new RawHexCheck(), change).map((f) => f.message)).toEqual(['Raw colour #fff.']);
    expect(run(new RawFontFamilyCheck(), change).map((f) => f.message)).toEqual([
      'fontFamily is the literal "Arial".',
    ]);
    expect(run(new ImportantCheck(), change)).toHaveLength(1);
  });

  it('skip files that are not valid JSON', () => {
    const broken = (files: Record<string, string>) =>
      (files['styles/blocks/button-dark.json'] = '{');
    expect(run(new RawHexCheck(), broken)).toEqual([]);
    expect(run(new MediaInCssCheck(), broken)).toEqual([]);
  });
});

describe('patterns', () => {
  const hero = (edit: (src: string) => string) => (files: Record<string, string>) => {
    files['patterns/hero.php'] = edit(heroPattern);
  };

  it('header: missing Title and Slug, bad Inserter', () => {
    const findings = run(
      new PatternHeaderCheck(),
      hero((s) =>
        s
          .replace(' * Title: Hero\n', '')
          .replace(' * Slug: demo/hero\n', '')
          .replace('Inserter: true', 'Inserter: maybe')
      )
    );
    expect(findings.map((f) => f.message)).toEqual([
      'The header has no Title.',
      'The header has no Slug.',
      'Inserter is "maybe".',
    ]);
  });

  it('header-recommended: missing fields, but hidden patterns need no categories', () => {
    const findings = run(
      new PatternRecommendedHeaderCheck(),
      hero((s) => s.replace(/ \* (Categories|Viewport Width|Inserter):.*\n/g, ''))
    );
    expect(findings[0].message).toBe('The header has no Inserter, Categories, Viewport Width.');
    const hidden = run(
      new PatternRecommendedHeaderCheck(),
      hero((s) =>
        s
          .replace(/ \* (Categories|Viewport Width):.*\n/g, '')
          .replace('Inserter: true', 'Inserter: false')
      )
    );
    expect(hidden).toEqual([]);
  });

  it('slug: outside the namespace, and duplicated', () => {
    const findings = run(new PatternSlugCheck(), (files) => {
      files['patterns/hero.php'] = heroPattern.replace('demo/hero', 'other/hero');
      files['patterns/hero-copy.php'] = heroPattern.replace('demo/hero', 'other/hero');
      files['patterns/no-slug.php'] = '<?php\n/**\n * Title: No slug\n */\n';
    });
    expect(findings.map((f) => f.message)).toEqual([
      'Slug "other/hero" is outside the "demo/" namespace.',
      'Slug "other/hero" is outside the "demo/" namespace.',
      'Slug "other/hero" is also used by patterns/hero-copy.php.',
    ]);
  });

  it('slug-filename: slug and file name differ', () => {
    const [f] = run(
      new PatternSlugFilenameCheck(),
      hero((s) => s.replace('demo/hero', 'demo/banner'))
    );
    expect(f.hint).toMatch(/banner\.php/);
  });

  it('category: a theme category that is never registered', () => {
    const findings = run(
      new PatternCategoryCheck(),
      hero((s) => s.replace('demo/sections', 'demo/sections, demo/missing, text'))
    );
    expect(findings.map((f) => f.message)).toEqual(['Category "demo/missing" is not registered.']);
  });

  it('nested-pattern: a wp:pattern block inside a pattern', () => {
    const [f] = run(
      new NestedPatternCheck(),
      hero((s) => `${s}<!-- wp:pattern {"slug":"demo/x"} /-->\n`)
    );
    expect(f.line).toBe(23);
  });

  it('escaping: unescaped echo and esc_url inside block JSON', () => {
    const findings = run(
      new PatternEscapingCheck(),
      hero(
        (s) =>
          `${s}<?php echo $title; ?>\n<!-- wp:button {"url":"<?php echo esc_url( home_url() ); ?>"} /-->\n`
      )
    );
    expect(findings.map((f) => f.message)).toEqual([
      'Unescaped output: echo $title;',
      'esc_url() inside block-comment JSON.',
    ]);
  });

  it('text-domain: wrong domain, missing domain, wrong domain with context', () => {
    const findings = run(
      new PatternTextDomainCheck(),
      hero(
        (s) =>
          `${s}<?php esc_html_e( 'A', 'other' ); ?><?php esc_html_e( "B (\\"q\\")" ); ?><?php echo esc_html_x( 'C', 'ctx', "x" ); ?><?php printf( _n( 'one', 'many', 2, 'demo' ) ); ?>\n`
      )
    );
    expect(findings.map((f) => f.message)).toEqual([
      "esc_html_e() uses 'other'.",
      'esc_html_e() has no text domain.',
      'esc_html_x() uses "x".',
    ]);
  });
});

describe('templates', () => {
  it('name: not in the hierarchy and not declared', () => {
    const findings = run(new TemplateNameCheck(), (files) => {
      files['templates/landing.html'] = '';
      files['templates/single-product.html'] = '';
      files['templates/page-about.html'] = '';
    });
    expect(findings.map((f) => f.file)).toEqual(['templates/landing.html']);
  });

  it('part-ref: a missing part, skipping other themes and bad JSON', () => {
    const findings = run(new TemplatePartRefCheck(), (files) => {
      files['templates/index.html'] +=
        '<!-- wp:template-part {"slug":"footer"} /-->\n<!-- wp:template-part {"slug":"footer","theme":"parent"} /-->\n<!-- wp:template-part {bad} /-->\n<!-- wp:template-part /-->\n';
    });
    expect(findings).toHaveLength(1);
    expect(findings[0]).toMatchObject({
      message: 'Template part "footer" does not exist.',
      line: 12,
    });
  });

  it('pattern-ref: a missing pattern in the theme namespace', () => {
    const findings = run(
      new PatternRefCheck(),
      (files) => (files['templates/index.html'] += '<!-- wp:pattern {"slug":"demo/missing"} /-->\n')
    );
    expect(findings.map((f) => f.message)).toEqual(['Pattern "demo/missing" does not exist.']);
  });
});

describe('markup', () => {
  it('parse: unbalanced, mismatched and invalid JSON', () => {
    const findings = run(new MarkupParseCheck(), (files) => {
      files['parts/header.html'] =
        '<!-- /wp:group -->\n<!-- wp:group -->\n<!-- wp:columns -->\n<!-- /wp:group -->\n<!-- wp:paragraph {"a":} /-->\n<!-- wp:list -->\n';
    });
    expect(findings.map((f) => `${f.line} ${f.message}`)).toEqual([
      '1 closing wp:core/group has no opening comment',
      '4 closing wp:core/group does not match wp:core/columns opened on line 3',
      '5 wp:core/paragraph has attributes that are not valid JSON',
      '2 wp:core/group is never closed',
      '6 wp:core/list is never closed',
    ]);
  });

  it('parse: PHP inside JSON values does not break the markup', () => {
    const findings = run(new MarkupParseCheck(), (files) => {
      files['patterns/hero.php'] +=
        '<!-- wp:query {"query":{"taxQuery":{"cat":[<?php echo (int) $id; ?>]}}} /-->\n';
    });
    expect(findings).toEqual([]);
  });

  it('unknown-block: undeclared plugin blocks, declared ones allowed', () => {
    const change = (files: Record<string, string>) => {
      files['templates/index.html'] += '<!-- wp:woocommerce/cart /-->\n<!-- wp:acme/widget /-->\n';
      files['.theme-validation.json'] = JSON.stringify({ blockNamespaces: ['woocommerce'] });
    };
    expect(run(new UnknownBlockCheck(), change).map((f) => f.message)).toEqual([
      'acme/widget is not from core or a declared dependency.',
    ]);
  });

  it('database-id: attachment, wp-image and ref IDs', () => {
    const findings = run(new DatabaseIdCheck(), (files) => {
      files['templates/index.html'] +=
        '<!-- wp:image {"id":42} --><img class="wp-image-42" alt=""/><!-- /wp:image -->\n<!-- wp:navigation {"ref":7} /-->\n';
    });
    expect(findings.map((f) => f.message)).toEqual([
      'attachment ID in block attributes: "id":42',
      'wp-image-{id} class: wp-image-4',
      'navigation or synced-pattern post ID ("ref"): "ref":7',
    ]);
  });
});

describe('a11y', () => {
  it('single-h1: two h1s in a template and in a page starter', () => {
    const findings = run(new SingleH1Check(), (files) => {
      files['templates/index.html'] += '<!-- wp:post-title {"level":1} /-->\n';
      files['patterns/page-landing.php'] +=
        '?>\n<!-- wp:heading {"level":1} --><h1>A</h1><!-- /wp:heading --><!-- wp:heading {"level":1} --><h1>B</h1><!-- /wp:heading -->\n';
    });
    expect(findings.map((f) => f.file)).toEqual([
      'templates/index.html',
      'patterns/page-landing.php',
    ]);
  });

  it('heading-order: h2 then h4', () => {
    const findings = run(new HeadingOrderCheck(), (files) => {
      files['patterns/hero.php'] = heroPattern.replace('{"level":3}', '{"level":4}');
    });
    expect(findings.map((f) => f.message)).toEqual(['h2 is followed by h4.']);
  });

  it('image-alt: an image with no alt', () => {
    const findings = run(new ImageAltCheck(), (files) => {
      files['parts/header.html'] +=
        '<!-- wp:image --><figure><img src="/a.jpg"/></figure><!-- /wp:image -->\n';
    });
    expect(findings).toEqual([expect.objectContaining({ file: 'parts/header.html', line: 4 })]);
  });
});
