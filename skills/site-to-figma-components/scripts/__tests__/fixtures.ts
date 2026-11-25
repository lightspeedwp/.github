import type { PageStructure, SiteStructure, StructureNode } from '../crawl-site-structure';
import type { VariablesExport } from '../lib/tokens';

const SITE = 'https://www.example.com';

let seq = 0;

export function node(over: Partial<StructureNode>): StructureNode {
  return {
    selector: `body > div:nth-child(${++seq})`,
    label: 'div',
    hint: 'section',
    region: 'main',
    tag: 'div',
    rect: { x: 0, y: 0, w: 1440, h: 400 },
    shape: 'div(h2,p)',
    columns: 1,
    style: {},
    headings: [],
    buttons: [],
    images: [],
    ...over,
  };
}

export function page(
  path: string,
  viewport: number,
  bodyClasses: string[],
  nodes: StructureNode[],
  over: Partial<PageStructure> = {}
): PageStructure {
  return {
    url: `${SITE}${path}`,
    viewport,
    finalUrl: `${SITE}${path}`,
    title: path,
    bodyClasses,
    docHeight: 3000,
    nodes,
    ...over,
  };
}

const header = (y = 0) =>
  node({
    selector: 'body > header',
    label: 'header.site-header',
    hint: 'header',
    region: 'header',
    rect: { x: 0, y, w: 1440, h: 80 },
    shape: 'header(nav(ul(li*)))',
    style: { background: 'rgb(255, 255, 255)' },
  });
const footer = () =>
  node({
    selector: 'body > footer',
    label: 'footer',
    hint: 'footer',
    region: 'footer',
    rect: { x: 0, y: 2800, w: 1440, h: 200 },
    shape: 'footer(div)',
    style: { background: 'rgb(38, 36, 35)', paddingBlock: 40 },
  });
const hero = (selector: string, heading: string) =>
  node({
    selector,
    label: 'div.wp-block-cover.hero',
    rect: { x: 0, y: 80, w: 1440, h: 600 },
    shape: 'div(img,div(h1,div(a)))',
    columns: 1,
    style: { backgroundImage: true, paddingBlock: 80 },
    headings: [heading],
    buttons: ['Enquire'],
    images: [{ src: `${SITE}/hero.jpg`, alt: 'Hero' }],
  });
const button = (selector: string, over: Partial<StructureNode> = {}) =>
  node({
    selector,
    label: 'a.wp-block-button__link',
    hint: 'button',
    tag: 'a',
    rect: { x: 0, y: 300, w: 160, h: 50 },
    shape: 'a',
    style: {
      background: 'rgb(163, 23, 0)',
      color: 'rgb(255, 255, 255)',
      fontFamily: 'Moret',
      fontSize: 16,
      paddingBlock: 10,
      paddingInline: 20,
      radius: 8,
    },
    text: 'Enquire',
    states: { hover: { background: 'rgb(128, 16, 0)' } },
    stateSource: 'browser',
    ...over,
  });
const cards = (prefix: string, cls: string, y: number, shape = 'article(div(a),div(h4))') =>
  [0, 1, 2].map((n) =>
    node({
      selector: `${prefix} > article:nth-child(${n + 1})`,
      label: `article.lsx-to-widget-item-wrap.${cls}`,
      hint: 'card',
      tag: 'article',
      rect: { x: n * 400, y, w: 380, h: 400 },
      shape,
      style: { background: 'rgb(255, 255, 255)', radius: 8 },
      headings: [`${cls} ${n}`],
      images: [{ src: `${SITE}/${cls}-${n}.jpg`, alt: '' }],
    })
  );

/** A small site: home, two tours, a destination that redirects to home, a page and a 404. */
export function site(): SiteStructure {
  const homeCards = cards('body > main > section:nth-child(2)', 'lsx-tour', 800);
  const homeD = [
    header(),
    hero('body > main > section:nth-child(1)', 'Plan your safari'),
    node({
      selector: 'body > main > section:nth-child(2)',
      label: 'div.tours-posts',
      rect: { x: 0, y: 700, w: 1440, h: 600 },
      shape: 'div(h2,div(article*))',
      headings: ['Top tours'],
    }),
    ...homeCards,
    node({
      selector: 'body > main > section:nth-child(3)',
      label: 'div.wp-block-columns.whyus',
      rect: { x: 0, y: 1300, w: 1440, h: 300 },
      shape: 'div(div(figure(img),h4,p)*)',
      columns: 4,
      headings: ['Why us'],
      images: [{ src: `${SITE}/icon.png`, alt: '' }],
    }),
    node({
      selector: 'body > main > section:nth-child(4)',
      label: 'div.cta-home',
      rect: { x: 0, y: 1600, w: 1440, h: 200 },
      shape: 'div(h2,a)',
      style: { background: 'rgb(86, 91, 61)', paddingBlock: 40 },
      buttons: ['Call us'],
    }),
    button('body > main > section:nth-child(1) a'),
    button('body > header a.btn', {
      region: 'header',
      style: {
        color: 'rgb(141, 98, 31)',
        border: 'rgb(141, 98, 31)',
        paddingBlock: 13,
        radius: 50,
      },
      rect: { x: 0, y: 0, w: 120, h: 30 },
      icon: true,
      states: undefined,
      stateSource: undefined,
    }),
    node({
      selector: 'body > header nav a:nth-child(1)',
      label: 'a',
      hint: 'nav-item',
      region: 'header',
      tag: 'a',
      shape: 'a',
      style: { color: 'rgb(38, 36, 35)' },
      states: { hover: { color: 'rgb(141, 98, 31)' }, focus: { textDecoration: 'underline' } },
    }),
    node({
      selector: 'body > footer nav a:nth-child(1)',
      label: 'a',
      hint: 'nav-item',
      region: 'footer',
      tag: 'a',
      shape: 'a',
      style: { color: 'rgb(255, 255, 255)' },
    }),
    node({
      selector: 'body > main p a',
      label: 'a',
      hint: 'link',
      tag: 'a',
      shape: 'a',
      style: { color: 'rgb(141, 98, 31)' },
    }),
    node({
      selector: 'body > main form',
      label: 'form.search-form',
      hint: 'form',
      tag: 'form',
      shape: 'form(input,button)',
    }),
    node({
      selector: 'body > main form input',
      label: 'input',
      hint: 'input',
      tag: 'input',
      shape: 'input',
      style: { border: 'rgb(138, 133, 128)', paddingInline: 14 },
      states: { focus: { border: 'rgb(141, 98, 31)' } },
    }),
    node({
      selector: 'body > main select',
      label: 'select',
      hint: 'input',
      tag: 'select',
      shape: 'select',
      style: {},
    }),
    node({
      selector: 'body > main .badge',
      label: 'span.badge',
      hint: 'badge',
      tag: 'span',
      shape: 'span',
      style: { background: 'rgb(245, 246, 240)', radius: 4 },
      text: 'New',
    }),
    node({
      selector: 'body > main details',
      label: 'details',
      hint: 'accordion',
      tag: 'details',
      shape: 'details(summary)',
      open: true,
    }),
    footer(),
  ];
  const byLabel = (label: string) => homeD.find((n) => n.label === label)!;
  const mainButton = homeD.find((n) => n.hint === 'button' && n.region === 'main')!;
  const homeM = [
    { ...header(), shape: 'header(div(button))' },
    byLabel('div.wp-block-cover.hero'),
    { ...byLabel('div.wp-block-columns.whyus'), columns: 1 },
    { ...mainButton, style: { ...mainButton.style, fontSize: 14, paddingBlock: 6 } },
    footer(),
  ];
  const tour = (path: string, name: string) => [
    header(),
    hero(`body > main > section:nth-child(1)`, name),
    node({
      selector: 'body > main > section:nth-child(2)',
      label: 'section.gallery',
      rect: { x: 0, y: 700, w: 1440, h: 500 },
      shape: 'section(img*)',
      images: [1, 2, 3].map((n) => ({ src: `${SITE}${path}${n}.jpg`, alt: '' })),
    }),
    node({
      selector: 'body > main > section:nth-child(3)',
      label: 'section.reviews',
      rect: { x: 0, y: 1200, w: 1440, h: 400 },
      shape: 'section(blockquote*)',
      headings: ['Reviews'],
    }),
    node({
      selector: 'body > main > section:nth-child(4)',
      label: 'section.styles',
      rect: { x: 0, y: 1650, w: 1440, h: 500 },
      shape: 'section(h2,div(article*))',
      headings: ['Safari styles'],
    }),
    ...cards(
      'body > main > section:nth-child(4)',
      'lsx-travel-style',
      1700,
      'article(div(a),div(h4,p))'
    ),
    node({
      selector: 'body > main > section:nth-child(5)',
      label: 'section.more',
      rect: { x: 0, y: 2150, w: 1440, h: 500 },
      shape: 'section(h3,div(article*))',
      headings: ['More styles'],
    }),
    ...cards('body > main > section:nth-child(5)', 'lsx-travel-style', 2200),
    footer(),
  ];
  const contact = [
    header(),
    node({
      selector: 'body > main > div:nth-child(1)',
      label: 'h2.wp-block-heading',
      rect: { x: 0, y: 80, w: 1440, h: 80 },
      shape: 'h2',
    }),
    node({
      selector: 'body > main > div:nth-child(2)',
      label: 'div.wp-block-media-text',
      rect: { x: 0, y: 160, w: 1440, h: 400 },
      shape: 'div(figure(img),div(h3,p))',
      columns: 2,
      images: [{ src: `${SITE}/team.jpg`, alt: 'Team' }],
      headings: ['Our history'],
    }),
    node({
      selector: 'body > main > div:nth-child(3)',
      label: 'div.contact-form',
      rect: { x: 0, y: 600, w: 1440, h: 400 },
      shape: 'div(div(form))',
    }),
    node({
      selector: 'body > main > div:nth-child(3) form',
      label: 'form.gform',
      hint: 'form',
      tag: 'form',
      rect: { x: 0, y: 620, w: 600, h: 300 },
      shape: 'form(input*,button)',
    }),
    node({
      selector: 'body > main > div:nth-child(4)',
      label: 'div.plain',
      rect: { x: 0, y: 1000, w: 1440, h: 600 },
      shape: 'div(p*)',
    }),
    footer(),
  ];
  const contactM = contact.map((n) =>
    n.label === 'div.wp-block-media-text' ? { ...n, columns: 1 } : n
  );
  const notFound = [
    header(),
    node({
      selector: 'body > main > div',
      label: 'div',
      rect: { x: 0, y: 80, w: 1440, h: 300 },
      shape: 'div(h1,p)',
      headings: ['Not found'],
    }),
    footer(),
  ];

  return {
    site: SITE,
    capturedAt: '2026-11-05T10:00:00.000Z',
    viewports: [390, 1440],
    pages: [
      page('/', 1440, ['home', 'page'], homeD, { screenshot: 'home-1440.png' }),
      page('/', 390, ['home', 'page'], homeM),
      page(
        '/tour/a/',
        1440,
        ['tour-template-default', 'single', 'single-lsx-to-tour'],
        tour('/tour/a/', 'Tour A')
      ),
      page(
        '/tour/b/',
        1440,
        ['tour-template-default', 'single', 'single-lsx-to-tour'],
        tour('/tour/b/', 'Tour B')
      ),
      page('/destinations/', 1440, ['home', 'page'], homeD, { finalUrl: `${SITE}/` }),
      page('/contact/', 1440, ['page-template-default', 'page'], contact),
      page('/contact/', 390, ['page-template-default', 'page'], contactM),
      page('/missing/', 1440, ['error404'], notFound),
    ],
  };
}

export function variables(): VariablesExport {
  const rgb = (r: number, g: number, b: number, a = 1) => ({
    r: r / 255,
    g: g / 255,
    b: b / 255,
    a,
  });
  const v = (id: string, name: string, type: string, value: unknown, web?: string) => ({
    id,
    name,
    type,
    codeSyntax: web ? { WEB: web } : undefined,
    valuesByMode: { m: value },
  });
  const sized = (id: string, name: string, max: number, web: string) => ({
    id,
    name,
    type: 'FLOAT',
    codeSyntax: { WEB: web },
    valuesByMode: { max, min: max / 2 },
  });
  return {
    collections: [
      {
        name: 'Theme - Colour',
        modes: [{ id: 'm', name: 'Value' }],
        variables: [
          v('c1', 'Theme/base', 'COLOR', rgb(255, 255, 255), 'var(--wp--preset--color--base)'),
          v('c2', 'Theme/contrast', 'COLOR', rgb(38, 36, 35), 'var(--wp--preset--color--contrast)'),
          v('c3', 'brand/600', 'COLOR', rgb(141, 98, 31), 'var(--wp--preset--color--brand-600)'),
          v('c4', 'cta/500', 'COLOR', rgb(163, 23, 0), 'var(--wp--preset--color--cta-500)'),
          v('c5', 'primary/500', 'COLOR', rgb(86, 91, 61), 'var(--wp--preset--color--primary-500)'),
          v(
            'c6',
            'neutral/500',
            'COLOR',
            rgb(138, 133, 128),
            'var(--wp--preset--color--neutral-500)'
          ),
          v(
            'c7',
            'primary/100',
            'COLOR',
            rgb(245, 246, 240),
            'var(--wp--preset--color--primary-100)'
          ),
        ],
      },
      {
        name: 'Theme - Semantic',
        modes: [{ id: 'm', name: 'Value' }],
        variables: [
          v('s1', 'text/default', 'COLOR', { type: 'VARIABLE_ALIAS', id: 'c2' }),
          v(
            's2',
            'text/link',
            'COLOR',
            { type: 'VARIABLE_ALIAS', id: 'c3' },
            'var(--wp--custom--color--text--link)'
          ),
          v('s3', 'surface/default', 'COLOR', { type: 'VARIABLE_ALIAS', id: 'c1' }),
          v('s4', 'action/cta/background', 'COLOR', { type: 'VARIABLE_ALIAS', id: 'c4' }),
          v('s5', 'action/cta/text', 'COLOR', { type: 'VARIABLE_ALIAS', id: 'c1' }),
          v('s6', 'action/primary/background', 'COLOR', { type: 'VARIABLE_ALIAS', id: 'c5' }),
          v('s7', 'border/default', 'COLOR', { type: 'VARIABLE_ALIAS', id: 'c6' }),
          v('s8', 'surface/inverse', 'COLOR', { type: 'VARIABLE_ALIAS', id: 'c2' }),
          v('s9', 'text/inverse', 'COLOR', { type: 'VARIABLE_ALIAS', id: 'c1' }),
          v('s10', 'broken/alias', 'COLOR', { type: 'VARIABLE_ALIAS', id: 'nope' }),
        ],
      },
      {
        name: 'Theme - Spacing',
        modes: [
          { id: 'min', name: 'Min' },
          { id: 'max', name: 'Max' },
        ],
        variables: [10, 20, 40, 80].map((n) =>
          sized(`p${n}`, `Padding/${n}`, n, `var(--wp--preset--spacing--${n})`)
        ),
      },
      {
        name: 'Theme - Radius',
        modes: [{ id: 'm', name: 'Mode 1' }],
        variables: [v('r1', 'Radius Base', 'FLOAT', 8, 'var(--wp--preset--border-radius--200)')],
      },
      {
        name: 'Theme - Typography',
        modes: [
          { id: 'max', name: 'Max' },
          { id: 'min', name: 'Min' },
        ],
        variables: [
          sized('t1', 'Sizes/xSmall', 16, 'var(--wp--preset--font-size--200)'),
          {
            id: 't2',
            name: 'Font-Families/Primary',
            type: 'STRING',
            codeSyntax: { WEB: 'var(--wp--preset--font-family--heading)' },
            valuesByMode: { max: 'Moret', min: 'Moret' },
          },
          {
            id: 't3',
            name: 'Weights/H1',
            type: 'STRING',
            valuesByMode: { max: 'Bold', min: 'Bold' },
          },
          {
            id: 't4',
            name: 'Line-Heights/Body',
            type: 'FLOAT',
            valuesByMode: { max: 24, min: 20 },
          },
        ],
      },
      {
        name: 'Proto - Cards',
        modes: [{ id: 'm', name: 'Mode 1' }],
        variables: [v('x1', 'card/bg', 'COLOR', rgb(1, 2, 3))],
      },
      { name: 'Library (aliases only)', modes: [], variables: [] },
    ],
    effectStyles: [
      {
        name: 'LSX/xSmall',
        effects: [{ type: 'DROP_SHADOW', offset: { x: 0, y: 2 }, radius: 4, spread: 0 }],
      },
      { name: 'Blur/4', effects: [{ type: 'LAYER_BLUR', radius: 4 }] },
    ],
  };
}
