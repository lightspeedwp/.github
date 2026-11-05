/* global HTMLImageElement */
/**
 * Crawls pages of a live site and records its repeated building blocks at the
 * mobile (390px) and desktop (1440px) frame widths: site-wide regions,
 * page sections and single UI elements, each with its DOM shape, computed
 * style, interactive states and real content.
 *
 * Reads public pages only, one at a time, with a pause between requests. It
 * hovers and focuses elements to read their states, but never clicks, types
 * or submits. The output feeds propose-inventory.ts.
 *
 * Usage:
 *   npx tsx crawl-site-structure.ts --url https://www.example.com \
 *     --pages /,/tours/,/tours/example/ --out site-structure.json --shots shots
 *   npx tsx crawl-site-structure.ts --url https://www.example.com \
 *     --shoot inventory.json --shots shots
 */

/* global Element, HTMLElement, CSSRuleList, CSSStyleRule, CSSGroupingRule -- collectors run in the browser */

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

export type Hint =
  | 'header'
  | 'footer'
  | 'sidebar'
  | 'section'
  | 'button'
  | 'link'
  | 'input'
  | 'card'
  | 'badge'
  | 'nav-item'
  | 'breadcrumbs'
  | 'pagination'
  | 'accordion'
  | 'tabs'
  | 'slider'
  | 'form';

export type Region = 'header' | 'footer' | 'sidebar' | 'main';
export type State = 'hover' | 'focus' | 'active' | 'disabled';

export interface StyleSig {
  background?: string;
  backgroundImage?: boolean;
  color?: string;
  border?: string;
  borderWidth?: number;
  radius?: number;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: number;
  lineHeight?: number;
  paddingBlock?: number;
  paddingInline?: number;
  gap?: number;
  shadow?: string;
  textDecoration?: string;
  textTransform?: string;
  opacity?: number;
}

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface ImageRef {
  src: string;
  alt: string;
}

export interface StructureNode {
  /** Unique CSS selector from the body, also used to pair the node across viewports. */
  selector: string;
  /** Short human label, such as `a.wp-block-button__link`. */
  label: string;
  hint: Hint;
  region: Region;
  tag: string;
  rect: Rect;
  /** DOM shape signature to depth 3, with repeated siblings collapsed: `ul(li*)`. */
  shape: string;
  /** Distinct x positions of the direct children: 1 means stacked. */
  columns: number;
  style: StyleSig;
  states?: Partial<Record<State, StyleSig>>;
  /** `browser` when hover and focus were triggered on this element; otherwise read from CSS. */
  stateSource?: 'css' | 'browser';
  text?: string;
  headings: string[];
  buttons: string[];
  images: ImageRef[];
  icon?: boolean;
  open?: boolean;
}

export interface CollectedStructure {
  /** Where the page ended up after redirects. */
  finalUrl: string;
  title: string;
  bodyClasses: string[];
  docHeight: number;
  nodes: StructureNode[];
}

export interface PageStructure extends CollectedStructure {
  url: string;
  viewport: number;
  screenshot?: string;
}

export interface SiteStructure {
  site: string;
  capturedAt: string;
  viewports: number[];
  pages: PageStructure[];
  /** Page views that could not be captured, such as timeouts. The rest of the crawl continues. */
  failures?: { url: string; viewport: number; error: string }[];
}

export interface CollectOptions {
  maxNodes?: number;
  maxRules?: number;
}

/**
 * Runs inside the page. Must stay self-contained: no imports or outer
 * variables, because the browser receives only this function's source.
 */
export function collectPageStructure(options: CollectOptions = {}): CollectedStructure {
  const maxNodes = options.maxNodes ?? 800;
  const maxRules = options.maxRules ?? 4000;
  const vw = window.innerWidth;
  const nodes: StructureNode[] = [];
  const hinted = new Map<Element, Hint>();

  const px = (value: string) => {
    const n = parseFloat(value);
    return Number.isFinite(n) ? n : undefined;
  };
  const transparent = (value: string) =>
    !value || value === 'transparent' || /rgba\([^)]*,\s*0\)$/.test(value.replace(/\s+/g, ''));
  const classText = (el: Element) => (typeof el.className === 'string' ? el.className : '');
  const visible = (el: Element) => {
    const s = window.getComputedStyle(el);
    return s.display !== 'none' && s.visibility !== 'hidden';
  };
  const rectOf = (el: Element): Rect => {
    const r = el.getBoundingClientRect();
    return {
      x: Math.round(r.left + window.scrollX),
      y: Math.round(r.top + window.scrollY),
      w: Math.round(r.width),
      h: Math.round(r.height),
    };
  };
  const selectorOf = (el: Element) => {
    const parts: string[] = [];
    let node: Element | null = el;
    while (node && node !== document.body) {
      const parent: Element | null = node.parentElement;
      const index = parent ? Array.prototype.indexOf.call(parent.children, node) + 1 : 1;
      parts.unshift(`${node.tagName.toLowerCase()}:nth-child(${index})`);
      node = parent;
    }
    return ['body', ...parts].join(' > ');
  };
  const noise =
    /^(wp-container-|wp-elements-|is-layout-|wp-block-group-is-layout|has-[a-z0-9-]+-(color|background-color|font-size)$|elementor-element-[0-9a-f]+|css-|jsx-|js-)|[0-9a-f]{6,}/;
  const labelOf = (el: Element) => {
    const classes = classText(el)
      .split(/\s+/)
      .filter((c) => c && !noise.test(c))
      .slice(0, 2);
    const id = el.id && !noise.test(el.id) ? `#${el.id}` : '';
    return [el.tagName.toLowerCase() + id, ...classes].join('.');
  };
  const textOf = (el: Element, max = 80) =>
    (el.textContent ?? '').replace(/\s+/g, ' ').trim().slice(0, max);
  const shapeOf = (el: Element, depth: number): string => {
    const tag = el.tagName.toLowerCase();
    if (depth === 0 || tag === 'svg') {
      return tag;
    }
    const kids: string[] = [];
    for (let i = 0; i < el.children.length; i++) {
      const child = el.children[i];
      if (['SCRIPT', 'STYLE', 'TEMPLATE', 'NOSCRIPT', 'BR'].includes(child.tagName)) {
        continue;
      }
      const shape = shapeOf(child, depth - 1);
      const last = kids[kids.length - 1];
      if (last === shape || last === `${shape}*`) {
        kids[kids.length - 1] = `${shape}*`;
      } else {
        kids.push(shape);
      }
    }
    return kids.length ? `${tag}(${kids.join(',')})` : tag;
  };
  const columnsOf = (el: Element) => {
    const xs = new Set<number>();
    for (let i = 0; i < el.children.length; i++) {
      const r = el.children[i].getBoundingClientRect();
      if (r.width > 0 && r.height > 0) {
        xs.add(Math.round(r.left / 8));
      }
    }
    return Math.max(1, xs.size);
  };
  const styleOf = (el: Element): StyleSig => {
    const s = window.getComputedStyle(el);
    const sig: StyleSig = {};
    if (!transparent(s.backgroundColor)) {
      sig.background = s.backgroundColor;
    }
    if (s.backgroundImage && s.backgroundImage !== 'none' && s.backgroundImage.includes('url(')) {
      sig.backgroundImage = true;
    }
    sig.color = s.color;
    const borderWidth = px(s.borderTopWidth) ?? 0;
    if (borderWidth > 0 && s.borderTopStyle !== 'none' && !transparent(s.borderTopColor)) {
      sig.border = s.borderTopColor;
      sig.borderWidth = borderWidth;
    }
    const radius = px(s.borderTopLeftRadius) ?? px(s.borderRadius);
    if (radius) {
      sig.radius = radius;
    }
    sig.fontFamily = s.fontFamily.split(',')[0].replace(/["']/g, '').trim() || undefined;
    sig.fontSize = px(s.fontSize);
    sig.fontWeight = Number(s.fontWeight) || undefined;
    sig.lineHeight = px(s.lineHeight);
    sig.paddingBlock = px(s.paddingTop) || undefined;
    sig.paddingInline = px(s.paddingLeft) || undefined;
    if (s.display.includes('flex') || s.display.includes('grid')) {
      sig.gap = px(s.rowGap || s.gap) || px(s.columnGap) || undefined;
    }
    if (s.boxShadow && s.boxShadow !== 'none') {
      sig.shadow = s.boxShadow;
    }
    const decoration = s.textDecorationLine || (s.textDecoration ?? '').split(' ')[0];
    if (decoration && decoration !== 'none') {
      sig.textDecoration = decoration;
    }
    if (s.textTransform && s.textTransform !== 'none') {
      sig.textTransform = s.textTransform;
    }
    return sig;
  };
  const imagesOf = (el: Element) => {
    const out: ImageRef[] = [];
    const imgs = el.tagName === 'IMG' ? [el] : Array.from(el.querySelectorAll('img'));
    for (const img of imgs.slice(0, 3)) {
      const src = (img as HTMLImageElement).currentSrc || img.getAttribute('src') || '';
      if (src && !src.startsWith('data:')) {
        out.push({ src, alt: img.getAttribute('alt') ?? '' });
      }
    }
    const withBg = [el, ...Array.from(el.querySelectorAll('*')).slice(0, 30)];
    for (const node of withBg) {
      if (out.length >= 3) {
        break;
      }
      const match = window
        .getComputedStyle(node)
        .backgroundImage.match(/url\(["']?([^"')]+)["']?\)/);
      if (match && !match[1].startsWith('data:')) {
        out.push({ src: match[1], alt: '' });
      }
    }
    return out;
  };

  const matchesClass = (el: Element, pattern: RegExp) => pattern.test(classText(el));
  const outermost = (el: Element, hint: Hint) => {
    for (let up = el.parentElement; up && up !== document.body; up = up.parentElement) {
      if (hinted.get(up) === hint) {
        return false;
      }
    }
    return true;
  };
  const hasRepeatedSiblings = (el: Element) => {
    const parent = el.parentElement;
    if (!parent) {
      return false;
    }
    const shape = shapeOf(el, 2);
    let same = 0;
    for (let i = 0; i < parent.children.length; i++) {
      if (shapeOf(parent.children[i], 2) === shape) {
        same++;
      }
    }
    return same >= 2;
  };
  const regionOf = (el: Element): Region => {
    for (let up: Element | null = el; up && up !== document.body; up = up.parentElement) {
      const hint = hinted.get(up);
      if (hint === 'header' || hint === 'footer' || hint === 'sidebar') {
        return hint;
      }
    }
    return 'main';
  };

  const buttonClass = /(^|\s|-)(btn|button)(\s|-|_|$)|wp-block-button__link|wp-element-button/i;

  const hintOf = (el: Element, rect: Rect): Hint | undefined => {
    const tag = el.tagName;
    const s = window.getComputedStyle(el);
    const label = (el.getAttribute('aria-label') ?? '').toLowerCase();
    const type = (el.getAttribute('type') ?? '').toLowerCase();
    const ident = `${el.id} ${classText(el)}`;
    const outside = !el.closest('main, article') && rect.w >= vw * 0.9;
    if (
      outside &&
      (tag === 'HEADER' ||
        /(^|\s)(site-header|header-wrapper|masthead|top-bar|topbar)(\s|$)/.test(ident))
    ) {
      return 'header';
    }
    if (
      outside &&
      (tag === 'FOOTER' ||
        /(^|\s)(site-footer|footer-widgets|footer-wrapper|footer-cta|colophon)(\s|$)/.test(ident))
    ) {
      return 'footer';
    }
    if (
      rect.w < vw * 0.45 &&
      rect.h >= 150 &&
      !['header', 'footer'].includes(regionOf(el)) &&
      (/(^|\s)(sidebar|secondary|widget-area)(\s|$)/.test(ident) ||
        (tag === 'ASIDE' && !!el.querySelector('.widget')))
    ) {
      return 'sidebar';
    }
    if (label.includes('breadcrumb') || matchesClass(el, /breadcrumb/i)) {
      return 'breadcrumbs';
    }
    if (
      label.includes('pagination') ||
      matchesClass(el, /(^|\s)(pagination|nav-links|page-numbers|wp-block-query-pagination)(\s|$)/)
    ) {
      return tag === 'A' || tag === 'SPAN' ? undefined : 'pagination';
    }
    if (
      el.getAttribute('aria-roledescription') === 'carousel' ||
      matchesClass(el, /(^|\s|-)(swiper|slick|splide|glide|carousel|slider)(\s|$)/i)
    ) {
      return 'slider';
    }
    if (
      el.getAttribute('role') === 'tablist' ||
      matchesClass(el, /(^|\s)([a-z-]*tabs|tablist)(\s|$)/i)
    ) {
      return 'tabs';
    }
    if (tag === 'DETAILS' || matchesClass(el, /(^|\s)([a-z-]*accordion)(\s|$)/i)) {
      return 'accordion';
    }
    if (tag === 'FORM') {
      return 'form';
    }
    if (tag === 'BUTTON' || (tag === 'INPUT' && ['submit', 'button'].includes(type))) {
      return 'button';
    }
    if (buttonClass.test(classText(el)) && !el.querySelector('a, button')) {
      return 'button'; // A wrapper such as div.wp-block-button holds the real button.
    }
    if (tag === 'SELECT' || tag === 'TEXTAREA' || tag === 'INPUT') {
      return ['checkbox', 'radio', 'hidden', 'image', 'submit', 'button'].includes(type)
        ? undefined
        : 'input';
    }
    if (tag === 'A') {
      const filled = !transparent(s.backgroundColor) || (px(s.borderTopWidth) ?? 0) > 0;
      if (filled && (px(s.paddingLeft) ?? 0) >= 8) {
        return 'button';
      }
      if (
        el.closest('nav') &&
        !el.closest('[aria-label*="readcrumb"], [class*="breadcrumb"], [class*="pagination"]')
      ) {
        return 'nav-item';
      }
      if (el.closest('p, td, dd, blockquote, figcaption')) {
        return 'link';
      }
    }
    const ownText = textOf(el, 40);
    const childTags = Array.from(el.children).map((c) => c.tagName);
    if (
      ['SPAN', 'DIV', 'A', 'LI'].includes(tag) &&
      ownText.length > 0 &&
      ownText.length <= 30 &&
      rect.h > 0 &&
      rect.h <= 40 &&
      childTags.every((t) => ['SVG', 'I', 'IMG', 'SPAN'].includes(t)) &&
      (!transparent(s.backgroundColor) || (px(s.borderTopWidth) ?? 0) > 0) &&
      (px(s.borderTopLeftRadius) ?? px(s.borderRadius) ?? 0) > 0
    ) {
      return 'badge';
    }
    if (
      rect.w >= 160 &&
      rect.w <= (vw < 600 ? vw : vw * 0.6) &&
      rect.h >= 120 &&
      imagesOf(el).length > 0 &&
      el.querySelector('h2, h3, h4, h5, h6, strong, .title') &&
      (tag === 'A' || el.querySelector('a')) &&
      hasRepeatedSiblings(el)
    ) {
      return 'card';
    }
    return undefined;
  };

  // States declared in same-origin CSS, keyed by the selector they apply to.
  const stateRules: { state: State; base: string; style: StyleSig }[] = [];
  const statePattern = /:(hover|focus-visible|focus-within|focus|active|disabled)\b/g;
  const readRules = (rules: CSSRuleList) => {
    for (let r = 0; r < rules.length && stateRules.length < maxRules; r++) {
      const rule = rules[r] as CSSStyleRule & CSSGroupingRule;
      if (!rule.selectorText) {
        if (rule.cssRules) {
          readRules(rule.cssRules);
        }
        continue;
      }
      for (const selector of rule.selectorText.split(',')) {
        const found = selector.match(statePattern);
        if (!found) {
          continue;
        }
        const name = found[0].slice(1);
        const state: State = name.startsWith('focus') ? 'focus' : (name as State);
        const base = selector.replace(statePattern, '').trim();
        if (!/[.#[]/.test(base)) {
          continue; // Bare element rules such as a:hover apply everywhere and add only noise.
        }
        const decl = rule.style;
        const style: StyleSig = {};
        const bg = decl.getPropertyValue('background-color') || decl.getPropertyValue('background');
        if (bg) {
          style.background = bg.trim();
        }
        if (decl.getPropertyValue('color')) {
          style.color = decl.getPropertyValue('color').trim();
        }
        if (decl.getPropertyValue('border-color')) {
          style.border = decl.getPropertyValue('border-color').trim();
        }
        if (decl.getPropertyValue('box-shadow')) {
          style.shadow = decl.getPropertyValue('box-shadow').trim();
        }
        const decoration =
          decl.getPropertyValue('text-decoration-line') || decl.getPropertyValue('text-decoration');
        if (decoration) {
          style.textDecoration = decoration.trim();
        }
        if (decl.getPropertyValue('opacity')) {
          style.opacity = Number(decl.getPropertyValue('opacity'));
        }
        if (Object.keys(style).length) {
          stateRules.push({ state, base, style });
        }
      }
    }
  };
  for (let s = 0; s < document.styleSheets.length; s++) {
    try {
      readRules(document.styleSheets[s].cssRules);
    } catch {
      continue; // Cross-origin stylesheet.
    }
  }
  const cssStatesOf = (el: Element) => {
    const states: Partial<Record<State, StyleSig>> = {};
    for (const rule of stateRules) {
      try {
        if (el.matches(rule.base)) {
          states[rule.state] = { ...states[rule.state], ...rule.style };
        }
      } catch {
        // Selector the browser can't match on its own, such as a bare pseudo-element.
      }
    }
    if (el.hasAttribute('disabled') || el.getAttribute('aria-disabled') === 'true') {
      states.disabled = { ...states.disabled };
    }
    return Object.keys(states).length ? states : undefined;
  };

  const record = (el: Element, hint: Hint, rect: Rect) => {
    hinted.set(el, hint);
    if (nodes.length >= maxNodes) {
      return;
    }
    const node: StructureNode = {
      selector: selectorOf(el),
      label: labelOf(el),
      hint,
      region: regionOf(el),
      tag: el.tagName.toLowerCase(),
      rect,
      shape: shapeOf(el, 3),
      columns: columnsOf(el),
      style: styleOf(el),
      headings: Array.from(el.querySelectorAll('h1, h2, h3, h4, h5, h6'))
        .slice(0, 3)
        .map((h) => textOf(h)),
      buttons: Array.from(
        el.querySelectorAll('button, a[class*="button"], a[class*="btn"], .wp-block-button__link')
      )
        .slice(0, 3)
        .map((b) => textOf(b, 40)),
      images: imagesOf(el),
    };
    const text = textOf(el);
    if (text) {
      node.text = text;
    }
    if (el.querySelector('svg, i[class*="icon"], i[class*="fa-"], [class*="dashicons"]')) {
      node.icon = true;
    }
    if (el.hasAttribute('open') || el.querySelector('[aria-expanded="true"]')) {
      node.open = true;
    }
    if (
      [
        'button',
        'link',
        'nav-item',
        'input',
        'badge',
        'pagination',
        'breadcrumbs',
        'tabs',
        'accordion',
      ].includes(hint)
    ) {
      const states = cssStatesOf(el);
      if (states) {
        node.states = states;
      }
    }
    nodes.push(node);
  };

  // Pass 1: regions and single UI elements, in document order.
  const all = document.body ? Array.from(document.body.querySelectorAll('*')) : [];
  for (const el of all) {
    if (!visible(el) || el.closest('[hidden], [aria-hidden="true"]')) {
      continue;
    }
    const rect = rectOf(el);
    if (rect.w < 1 || rect.h < 1) {
      continue;
    }
    const hint = hintOf(el, rect);
    if (!hint) {
      continue;
    }
    const singular = [
      'header',
      'footer',
      'sidebar',
      'card',
      'slider',
      'tabs',
      'accordion',
      'breadcrumbs',
      'pagination',
      'form',
    ];
    if (singular.includes(hint) && !outermost(el, hint)) {
      continue;
    }
    record(el, hint, rect);
  }

  // Pass 2: page sections. Descend from main (or the body) through single
  // wrappers; the stacked children found there are the sections. Widths are
  // measured against the content column, so sections inside a narrow main
  // with a sidebar still count. Tall sections that are stacks of substantial
  // rows are opened up; long articles made of short rows are not.
  const significant = (el: Element) =>
    Array.from(el.children).filter((c) => {
      if (!visible(c) || ['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE'].includes(c.tagName)) {
        return false;
      }
      const r = c.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    });
  const isPart = (el: Element) => ['header', 'footer', 'sidebar'].includes(hinted.get(el) ?? '');
  const main = document.querySelector('main');
  const column = main ? main.getBoundingClientRect().width || vw : vw;
  const qualifies = (el: Element) => {
    const r = el.getBoundingClientRect();
    return r.width >= column * 0.6 && r.height >= 80;
  };
  let root: Element | null = main ?? document.body;
  while (root) {
    const kids: Element[] = significant(root).filter((c) => !isPart(c));
    // Stop at a single child that is itself the section rather than a wrapper of sections.
    if (kids.length !== 1 || !significant(kids[0]).some(qualifies)) {
      break;
    }
    root = kids[0];
  }
  const viewportHeight = window.innerHeight || 900;
  const addSections = (parent: Element, level: number) => {
    for (const child of significant(parent)) {
      if (isPart(child)) {
        continue;
      }
      const rect = rectOf(child);
      if (rect.w < column * 0.6 || rect.h < 80) {
        continue;
      }
      const rows = significant(child).filter((c) => {
        const r = c.getBoundingClientRect();
        return r.width >= column * 0.6 && r.height >= 150;
      });
      if (
        level < 2 &&
        rect.h > viewportHeight * 2.5 &&
        rows.length >= 2 &&
        columnsOf(child) === 1
      ) {
        addSections(child, level + 1);
        continue;
      }
      record(child, 'section', rect);
    }
  };
  if (root) {
    addSections(root, 0);
  }

  // Full-width bands outside main, such as a page banner between the header and the content.
  if (main) {
    const mainRect = rectOf(main);
    for (
      let path: Element = main;
      path.parentElement && path.parentElement !== document.body;
      path = path.parentElement
    ) {
      for (const sibling of significant(path.parentElement)) {
        if (
          sibling === path ||
          isPart(sibling) ||
          Array.from(hinted.keys()).some((h) => isPart(h) && sibling.contains(h))
        ) {
          continue;
        }
        const rect = rectOf(sibling);
        const outside = rect.y + rect.h <= mainRect.y + 1 || rect.y >= mainRect.y + mainRect.h - 1;
        if (outside && rect.w >= vw * 0.6 && rect.h >= 80) {
          record(sibling, 'section', rect);
        }
      }
    }
  }

  return {
    finalUrl: window.location.href,
    title: document.title,
    bodyClasses: document.body ? Array.from(document.body.classList) : [],
    docHeight: document.documentElement.scrollHeight,
    nodes,
  };
}

/**
 * Runs inside the page: hides fixed overlays such as cookie banners, chat
 * widgets and pop-ups, so they don't count as site components or cover
 * screenshots. A fixed header (or a full-width bar at the top) is kept.
 * Returns how many elements were hidden.
 */
export function hideOverlays(): number {
  const vw = window.innerWidth;
  let hidden = 0;
  for (const el of Array.from(document.body ? document.body.querySelectorAll('*') : [])) {
    const style = window.getComputedStyle(el);
    if (style.position !== 'fixed' || style.display === 'none') {
      continue;
    }
    const rect = el.getBoundingClientRect();
    const header =
      el.closest('header') ||
      el.querySelector('header, nav') ||
      (rect.top <= 1 && rect.width >= vw * 0.9 && rect.height <= 200);
    if (!header) {
      (el as HTMLElement).style.setProperty('display', 'none', 'important');
      hidden++;
    }
  }
  return hidden;
}

/** Runs inside the page: the computed style of one element, for state diffs. */
export function readElementStyle(selector: string): StyleSig | null {
  const el = document.querySelector(selector);
  if (!el) {
    return null;
  }
  const s = window.getComputedStyle(el);
  const sig: StyleSig = { color: s.color };
  if (s.backgroundColor && s.backgroundColor !== 'rgba(0, 0, 0, 0)') {
    sig.background = s.backgroundColor;
  }
  if (parseFloat(s.borderTopWidth) > 0) {
    sig.border = s.borderTopColor;
  }
  if (s.boxShadow && s.boxShadow !== 'none') {
    sig.shadow = s.boxShadow;
  }
  const decoration = s.textDecorationLine || (s.textDecoration ?? '').split(' ')[0];
  if (decoration && decoration !== 'none') {
    sig.textDecoration = decoration;
  }
  const opacity = Number(s.opacity);
  if (Number.isFinite(opacity) && opacity !== 1) {
    sig.opacity = opacity;
  }
  return sig;
}

/** The properties that changed between two styles, or undefined when none did. */
export function styleDiff(before: StyleSig, after: StyleSig): StyleSig | undefined {
  const diff: StyleSig = {};
  const keys = new Set([...Object.keys(before), ...Object.keys(after)]) as Set<keyof StyleSig>;
  for (const key of keys) {
    if (before[key] !== after[key] && after[key] !== undefined) {
      (diff as Record<string, unknown>)[key] = after[key];
    }
  }
  return Object.keys(diff).length ? diff : undefined;
}

export interface PageHandle {
  collect: () => Promise<CollectedStructure>;
  /** Hovers or focuses the element and returns its style; never clicks. */
  styleIn: (selector: string, state: 'hover' | 'focus' | 'none') => Promise<StyleSig | null>;
  screenshot: (path: string, selector?: string) => Promise<boolean>;
  close: () => Promise<void>;
}

export interface BrowserDriver {
  open: (url: string, viewport: number) => Promise<PageHandle>;
  close: () => Promise<void>;
}

export interface CrawlOptions {
  site: string;
  pages: string[];
  viewports?: number[];
  delayMs?: number;
  maxPages?: number;
  /** Folder for full-page screenshots; none are taken when unset. */
  shotsDir?: string;
  /** Distinct components per page whose hover and focus are triggered. 0 turns it off. */
  maxStateSamples?: number;
}

export interface ShootTarget {
  id: string;
  url: string;
  viewport: number;
  selector: string;
}

const FORBIDDEN_PATH =
  /\/(wp-admin|wp-login\.php|login|log-in|signin|sign-in|account|my-account|cart|basket|checkout)(\/|$|\?)/i;
const STATE_HINTS = new Set<Hint>(['button', 'link', 'nav-item', 'input', 'badge']);

export class StructureCrawler {
  constructor(
    private readonly driver: BrowserDriver,
    private readonly sleep: (ms: number) => Promise<void>,
    private readonly now: () => Date = () => new Date()
  ) {}

  async crawl(options: CrawlOptions): Promise<SiteStructure> {
    const site = new URL(options.site);
    const viewports = options.viewports ?? [390, 1440];
    const urls = this.resolvePages(site, options.pages, options.maxPages ?? 15);
    const pages: PageStructure[] = [];
    const failures: { url: string; viewport: number; error: string }[] = [];
    let first = true;

    try {
      for (const url of urls) {
        for (const viewport of viewports) {
          if (!first) {
            await this.sleep(options.delayMs ?? 1500);
          }
          first = false;
          let page: PageHandle | undefined;
          try {
            page = await this.driver.open(url, viewport);
            const collected = await page.collect();
            await this.triggerStates(page, collected, options.maxStateSamples ?? 30);
            const capture: PageStructure = { url, viewport, ...collected };
            if (options.shotsDir) {
              const file = `${StructureCrawler.slugOf(url)}-${viewport}.png`;
              if (await page.screenshot(join(options.shotsDir, file))) {
                capture.screenshot = file;
              }
            }
            pages.push(capture);
          } catch (error) {
            failures.push({ url, viewport, error: (error as Error).message });
          } finally {
            await page?.close();
          }
        }
      }
    } finally {
      await this.driver.close();
    }

    return {
      site: site.origin,
      capturedAt: this.now().toISOString(),
      viewports,
      pages,
      ...(failures.length ? { failures } : {}),
    };
  }

  /** Takes one screenshot per target element, grouped so each page opens once. */
  async shoot(
    site: string,
    targets: ShootTarget[],
    shotsDir: string,
    delayMs = 1500
  ): Promise<string[]> {
    const origin = new URL(site);
    const written: string[] = [];
    const groups = new Map<string, ShootTarget[]>();
    for (const target of targets) {
      this.resolvePages(origin, [target.url], Number.POSITIVE_INFINITY);
      const key = `${target.url}@${target.viewport}`;
      groups.set(key, [...(groups.get(key) ?? []), target]);
    }
    let first = true;
    try {
      for (const group of groups.values()) {
        if (!first) {
          await this.sleep(delayMs);
        }
        first = false;
        const page = await this.driver.open(group[0].url, group[0].viewport);
        try {
          for (const target of group) {
            const file = `${target.id.replace(/[^a-z0-9-]+/gi, '-')}-${target.viewport}.png`;
            if (await page.screenshot(join(shotsDir, file), target.selector)) {
              written.push(file);
            }
          }
        } finally {
          await page.close();
        }
      }
    } finally {
      await this.driver.close();
    }
    return written;
  }

  /** Hovers and focuses one example of each distinct interactive element and records what changes. */
  async triggerStates(
    page: PageHandle,
    collected: CollectedStructure,
    limit: number
  ): Promise<void> {
    const seen = new Set<string>();
    for (const node of collected.nodes) {
      if (seen.size >= limit) {
        break;
      }
      const key = `${node.hint}|${node.label}`;
      if (!STATE_HINTS.has(node.hint) || seen.has(key)) {
        continue;
      }
      seen.add(key);
      const base = await page.styleIn(node.selector, 'none');
      if (!base) {
        continue;
      }
      for (const state of ['hover', 'focus'] as const) {
        if (state === 'focus' && node.hint === 'badge') {
          continue;
        }
        // What the browser shows wins over CSS rules, which ignore specificity.
        const after = await page.styleIn(node.selector, state);
        const diff = after ? styleDiff(base, after) : undefined;
        const states = { ...node.states };
        if (diff) {
          states[state] = diff;
        } else {
          delete states[state];
        }
        node.states = Object.keys(states).length ? states : undefined;
      }
      node.stateSource = 'browser';
    }
  }

  /** Resolves page paths against the site, and refuses other origins and private pages. */
  resolvePages(site: URL, pages: string[], maxPages: number): string[] {
    const urls = [...new Set((pages.length ? pages : ['/']).map((p) => new URL(p, site).href))];
    for (const url of urls) {
      const parsed = new URL(url);
      if (parsed.origin !== site.origin) {
        throw new Error(`${url} is not on ${site.origin}. Crawl one site at a time.`);
      }
      if (FORBIDDEN_PATH.test(parsed.pathname + parsed.search)) {
        throw new Error(
          `${url} looks like a login, account or checkout page. Crawl public pages only.`
        );
      }
    }
    if (urls.length > maxPages) {
      throw new Error(
        `${urls.length} pages requested; the limit is ${maxPages}. Raise --max-pages if needed.`
      );
    }
    return urls;
  }

  static slugOf(url: string): string {
    const parsed = new URL(url);
    const path = (parsed.pathname + parsed.search).replace(/^\/|\/$/g, '');
    return path
      ? path
          .replace(/[^a-z0-9]+/gi, '-')
          .replace(/^-|-$/g, '')
          .toLowerCase()
      : 'home';
  }
}

export interface CrawlCliDeps {
  createDriver: () => Promise<BrowserDriver>;
  sleep: (ms: number) => Promise<void>;
  readFile: (path: string) => string;
  writeFile: (path: string, content: string) => void;
  makeDir: (path: string) => void;
  stdout: (text: string) => void;
  stderr: (text: string) => void;
}

const USAGE =
  'Usage: crawl-site-structure --url https://www.example.com [--pages /,/about] [--out site-structure.json] [--shots shots] [--delay 1500] [--max-pages 15] [--viewports 390,1440] [--states 30]\n' +
  '       crawl-site-structure --url https://www.example.com --shoot inventory.json --shots shots\n';

export async function runCrawlCli(argv: string[], deps: CrawlCliDeps): Promise<number> {
  const values: Record<string, string> = {
    pages: '/',
    out: 'site-structure.json',
    delay: '1500',
    'max-pages': '15',
    viewports: '390,1440',
    states: '30',
  };
  const optional = ['url', 'shots', 'shoot'];

  try {
    for (let i = 0; i < argv.length; i++) {
      const arg = argv[i];
      if (arg === '--help' || arg === '-h') {
        deps.stdout(USAGE);
        return 0;
      }
      const key = arg.replace(/^--/, '');
      if (!arg.startsWith('--') || ![...optional, ...Object.keys(values)].includes(key)) {
        throw new Error(`Unknown argument ${arg}.`);
      }
      const value = argv[++i];
      if (value === undefined) {
        throw new Error(`${arg} needs a value.`);
      }
      values[key] = value;
    }
    if (!values.url) {
      throw new Error('--url is required.');
    }
    if (values.shots) {
      deps.makeDir(values.shots);
    }

    const crawler = new StructureCrawler(await deps.createDriver(), deps.sleep);
    if (values.shoot) {
      if (!values.shots) {
        throw new Error('--shoot needs --shots, the folder to write screenshots to.');
      }
      const inventory = JSON.parse(deps.readFile(values.shoot)) as {
        items: {
          id: string;
          status?: string;
          examples: { url: string; viewport: number; selector: string }[];
        }[];
      };
      const targets: ShootTarget[] = inventory.items
        .filter((item) => item.status !== 'cut')
        .flatMap((item) => item.examples.slice(0, 1).map((e) => ({ id: item.id, ...e })));
      const written = await crawler.shoot(values.url, targets, values.shots, Number(values.delay));
      deps.stdout(
        `Wrote ${written.length} of ${targets.length} example screenshots to ${values.shots}\n`
      );
      return 0;
    }

    const result = await crawler.crawl({
      site: values.url,
      pages: values.pages
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean),
      viewports: values.viewports.split(',').map(Number),
      delayMs: Number(values.delay),
      maxPages: Number(values['max-pages']),
      shotsDir: values.shots,
      maxStateSamples: Number(values.states),
    });
    deps.writeFile(values.out, `${JSON.stringify(result, null, 2)}\n`);
    const count = result.pages.reduce((total, p) => total + p.nodes.length, 0);
    deps.stdout(
      `Captured ${result.pages.length} page views and ${count} building blocks into ${values.out}\n`
    );
    for (const f of result.failures ?? []) {
      deps.stderr(`Skipped ${f.url} at ${f.viewport}px: ${f.error}\n`);
    }
    return 0;
  } catch (error) {
    deps.stderr(`crawl-site-structure: ${(error as Error).message}\n`);
    return 1;
  }
}

/* istanbul ignore next -- Puppeteer driver, exercised by live runs */
export async function createPuppeteerDriver(): Promise<BrowserDriver> {
  const puppeteer = (await import('puppeteer')).default;
  const browser = await puppeteer.launch({ headless: true });
  return {
    open: async (url, viewport) => {
      const page = await browser.newPage();
      await page.setViewport({ width: viewport, height: 900 });
      await page.goto(url, { waitUntil: 'load', timeout: 60000 });
      // Pages with polling or live chat never go idle; give them a short, optional wait.
      await page.waitForNetworkIdle({ idleTime: 500, timeout: 15000 }).catch(() => undefined);
      // tsx (esbuild) can add __name() helpers to function source; define it in the page.
      await page.evaluate('globalThis.__name = (f) => f');
      await page.evaluate(hideOverlays);
      const reset = async () => {
        await page.mouse.move(0, 0);
        await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
      };
      return {
        collect: () => page.evaluate(collectPageStructure, {}),
        styleIn: async (selector, state) => {
          try {
            await reset();
            if (state === 'hover') {
              await page.hover(selector);
            } else if (state === 'focus') {
              await page.focus(selector);
            }
            return await page.evaluate(readElementStyle, selector);
          } catch {
            return null; // Covered, off-screen or detached element.
          }
        },
        screenshot: async (path, selector) => {
          try {
            if (selector) {
              const handle = await page.$(selector);
              if (!handle) {
                return false;
              }
              await handle.screenshot({ path });
            } else {
              await page.screenshot({ path, fullPage: true });
            }
            return true;
          } catch {
            return false;
          }
        },
        close: () => page.close(),
      };
    },
    close: () => browser.close(),
  };
}

/* istanbul ignore next -- thin CLI entry point */
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  runCrawlCli(process.argv.slice(2), {
    createDriver: createPuppeteerDriver,
    sleep: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
    readFile: (path) => readFileSync(path, 'utf8'),
    writeFile: (path, content) => writeFileSync(path, content),
    makeDir: (path) => mkdirSync(path, { recursive: true }),
    stdout: (text) => process.stdout.write(text),
    stderr: (text) => process.stderr.write(text),
  }).then((code) => {
    process.exitCode = code;
  });
}
