/**
 * In-memory file system and a small, valid fixture theme. Tests copy the theme and break
 * one thing, so every check has a passing fixture (the clean theme) and a failing one.
 */
import type { DirEntry, FileSystem } from '../lib/file-system';
import { ThemeReader } from '../lib/theme-reader';
import type { Theme } from '../lib/types';

export const ROOT = '/themes/demo';

export class MemoryFileSystem implements FileSystem {
  constructor(private readonly files: Record<string, string>) {}

  readText(path: string): string | undefined {
    return this.files[path];
  }

  listDir(path: string): DirEntry[] {
    const prefix = path.endsWith('/') ? path : `${path}/`;
    const names = new Map<string, boolean>();
    for (const file of Object.keys(this.files)) {
      if (file.startsWith(prefix)) {
        const [name, ...rest] = file.slice(prefix.length).split('/');
        names.set(name, rest.length > 0 || names.get(name) === true);
      }
    }
    return [...names].map(([name, isDirectory]) => ({ name, isDirectory }));
  }
}

export const SCHEMA_URL = 'https://schemas.wp.org/wp/7.1/theme.json';

export const themeJson = {
  $schema: SCHEMA_URL,
  version: 3,
  settings: {
    color: {
      palette: [
        { slug: 'base', color: '#ffffff', name: 'Base' },
        { slug: 'contrast', color: '#000000', name: 'Contrast' },
      ],
    },
    typography: {
      fontSizes: [{ slug: 'small', size: '1rem', name: 'Small' }],
      fontFamilies: [{ slug: 'body', fontFamily: 'Inter, sans-serif', name: 'Body' }],
    },
    spacing: { spacingSizes: [{ slug: '20', size: '1rem', name: '20' }] },
    custom: { fontWeight: { bold: 700 } },
  },
  styles: {
    color: { background: 'var:preset|color|base' },
    typography: { fontFamily: 'var:preset|font-family|body' },
    elements: { link: { ':hover': { color: { text: 'var:preset|color|contrast' } } } },
    blocks: {
      'core/button': {
        css: '& .x { padding: var(--wp--preset--spacing--20); font-weight: var(--wp--custom--font-weight--bold); }',
      },
    },
    css: '@media (min-width: 40rem) { body { margin: 0; } }',
  },
  templateParts: [{ name: 'header', title: 'Header', area: 'header' }],
  customTemplates: [{ name: 'page-wide', title: 'Wide', postTypes: ['page'] }],
};

export const buttonStyle = {
  $schema: SCHEMA_URL,
  version: 3,
  title: 'Dark',
  slug: 'button-dark',
  blockTypes: ['core/button'],
  styles: {
    color: { background: 'var:preset|color|contrast' },
    css: '&:hover { color: var(--wp--preset--color--base); }',
  },
};

export const heroPattern = `<?php
/**
 * Title: Hero
 * Slug: demo/hero
 * Categories: demo/sections
 * Viewport Width: 1280
 * Inserter: true
 *
 * @package demo
 */
?>
<!-- wp:group {"style":{"spacing":{"padding":{"top":"var:preset|spacing|20"}}}} -->
<div class="wp-block-group">
	<!-- wp:heading -->
	<h2 class="wp-block-heading"><?php esc_html_e( 'Hello', 'demo' ); ?></h2>
	<!-- /wp:heading -->
	<!-- wp:heading {"level":3} -->
	<h3 class="wp-block-heading"><?php echo esc_html_x( 'World', 'greeting', 'demo' ); ?></h3>
	<!-- /wp:heading -->
	<!-- wp:search {"label":"<?php echo esc_attr__( 'Search', 'demo' ); ?>","buttonText":"<?php echo esc_attr__( 'Go', 'demo' ); ?>"} /-->
</div>
<!-- /wp:group -->
`;

export const pageStarter = `<?php
/**
 * Title: Landing page
 * Slug: demo/page-landing
 * Categories: demo/sections
 * Viewport Width: 1280
 * Block Types: core/post-content
 * Inserter: true
 */
require __DIR__ . '/hero.php';
`;

export const indexTemplate = `<!-- wp:template-part {"slug":"header","tagName":"header"} /-->
<!-- wp:group {"tagName":"main"} -->
<main class="wp-block-group">
	<!-- wp:query-title {"type":"archive"} /-->
	<!-- wp:image {"sizeSlug":"large"} -->
	<figure class="wp-block-image size-large"><img src="/wp-content/uploads/2026/11/a.jpg" alt=""/></figure>
	<!-- /wp:image -->
	<!-- wp:pattern {"slug":"demo/hero"} /-->
	<!-- wp:pattern {"slug":"other/thing"} /-->
</main>
<!-- /wp:group -->
`;

export const headerPart = `<!-- wp:group {"tagName":"div"} -->
<div class="wp-block-group"><!-- wp:site-title {"level":0} /--></div>
<!-- /wp:group -->
`;

export const registerCategories = `<?php
function demo_register_pattern_categories() {
	register_block_pattern_category( 'demo/sections', array( 'label' => __( 'Sections', 'demo' ) ) );
}
add_action( 'init', 'demo_register_pattern_categories', 9 );
`;

export const styleCss = `/*
Theme Name: Demo
Text Domain: demo
*/
`;

/** Theme-relative path → contents of the clean fixture theme. */
export function cleanFiles(): Record<string, string> {
  return {
    'style.css': styleCss,
    'theme.json': JSON.stringify(themeJson, null, '\t'),
    'styles/blocks/button-dark.json': JSON.stringify(buttonStyle, null, '\t'),
    'templates/index.html': indexTemplate,
    'templates/page-wide.html': '<!-- wp:post-content /-->\n',
    'parts/header.html': headerPart,
    'patterns/hero.php': heroPattern,
    'patterns/page-landing.php': pageStarter,
    'functions.php': "<?php\nrequire __DIR__ . '/inc/patterns.php';\n",
    'inc/patterns.php': registerCategories,
    'node_modules/x/patterns/ignored.php': '<?php /* never read */',
  };
}

/** Absolute paths for a MemoryFileSystem, from theme-relative ones. */
export function onDisk(files: Record<string, string>, root = ROOT): Record<string, string> {
  return Object.fromEntries(Object.entries(files).map(([path, text]) => [`${root}/${path}`, text]));
}

/** Reads a fixture theme, applying `change` to the clean files first. */
export function makeTheme(change: (files: Record<string, string>) => void = () => {}): Theme {
  const files = cleanFiles();
  change(files);
  return new ThemeReader(new MemoryFileSystem(onDisk(files))).read(ROOT);
}

/** Edits theme.json as an object. */
export function editThemeJson(
  files: Record<string, string>,
  edit: (json: typeof themeJson) => void
): void {
  const json = JSON.parse(files['theme.json']) as typeof themeJson;
  edit(json);
  files['theme.json'] = JSON.stringify(json, null, '\t');
}

/** A schema that only demands version 3, so tests need no real schema file. */
export const fakeSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: { version: { const: 3 }, title: { type: 'string' } },
  required: ['version'],
  oneOf: [{ required: ['version'] }, { required: ['version'] }],
};
