#!/usr/bin/env node
/**
 * schema-tool: audit the JSON-LD structured data a WordPress site publishes.
 *
 *   urls <site-url>     Pick one test URL per post type, taxonomy, key page,
 *                       archive, author and search, using the WordPress REST API.
 *   validate <url...>   Fetch each page, extract its JSON-LD and check it
 *                       against the schema.org vocabulary and rich-result rules.
 *   vocab               Download (or reuse the cached) schema.org vocabulary
 *                       and report its release and term counts.
 *
 * Contract: .github/specs/023-wp-schema-audit-agent/contracts/schema-tool-cli.md
 *
 * The vocabulary is the release file published in
 * https://github.com/schemaorg/schemaorg (data/releases/<version>/
 * schemaorg-all-https.jsonld). It is cached per release so repeat runs work
 * offline.
 *
 * The tool only sends GET requests, never sends cookies or credentials, and
 * relaxes TLS certificate checks only for local development hosts
 * (localhost, 127.0.0.1, [::1], *.local, *.test, *.localhost), whose
 * certificates are self-signed.
 *
 * @module agents/wp-schema-audit-agent/lib/schema-tool
 */

'use strict';

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const http = require('node:http');
const https = require('node:https');

const { renderClientReport, renderCsv } = require('./report-formats.cjs');

const EXIT_OK = 0;
const EXIT_FINDINGS = 1;
const EXIT_ERROR = 2;

const USER_AGENT = 'LightSpeed-schema-tool/1.0 (+https://github.com/lightspeedwp/.github)';
const MAX_BODY_BYTES = 20 * 1024 * 1024;
const MAX_REDIRECTS = 5;
const TIMEOUT_MS = 30000;

const VOCAB_FILE = 'schemaorg-all-https.jsonld';
const VOCAB_RELEASES_API =
  'https://api.github.com/repos/schemaorg/schemaorg/contents/data/releases';
const VOCAB_RAW = 'https://raw.githubusercontent.com/schemaorg/schemaorg/main/data/releases';

const SEVERITY_ORDER = { error: 0, warn: 1, info: 2 };

/** Post types that are WordPress plumbing rather than public content. */
const INTERNAL_TYPES = new Set([
  'attachment',
  'nav_menu_item',
  'wp_block',
  'wp_template',
  'wp_template_part',
  'wp_global_styles',
  'wp_navigation',
  'wp_font_family',
  'wp_font_face',
  'page',
]);

/** Taxonomies that are WordPress plumbing rather than public archives. */
const INTERNAL_TAXONOMIES = new Set([
  'nav_menu',
  'wp_pattern_category',
  'wp_theme',
  'wp_template_part_area',
  'link_category',
  'post_format',
]);

/** Page slugs worth testing because their schema type usually differs. */
const KEY_PAGE_PATTERN =
  /^(about|about-us|contact|contact-us|privacy|privacy-policy|terms|terms-conditions|terms-and-conditions|faq|faqs|team|our-team|blog|news|careers|book|booking|enquire|enquiry)$/;

/**
 * Rich-result rules, a summary of Google Search Central's structured data
 * feature guides (https://developers.google.com/search/docs/appearance/structured-data/search-gallery),
 * written 2026-10-14 without re-reading each guide. Verify a rule against
 * its guide before changing it, and record the check in CHANGELOG.md. They
 * describe what Google needs to show a rich result, not what schema.org
 * allows, so a miss is a warning, never an error.
 *
 * scope 'entity' applies the rule only to nodes that stand on their own (a
 * top-level @graph node or one with its own @id), so a nested reference such
 * as `itemReviewed: { "@type": "LodgingBusiness", "name": ... }` is not held
 * to the requirements of a full listing.
 */
const RICH_RESULT_RULES = [
  {
    type: 'Review',
    scope: 'any',
    required: ['author', 'reviewRating', 'itemReviewed'],
    recommended: ['datePublished'],
    // A review nested in the item it reviews does not repeat itemReviewed.
    exemptWhenNestedUnder: { itemReviewed: ['review', 'reviews'] },
  },
  {
    type: 'AggregateRating',
    scope: 'any',
    required: ['ratingValue'],
    oneOf: [['ratingCount', 'reviewCount']],
  },
  { type: 'Rating', scope: 'any', required: ['ratingValue'] },
  { type: 'ListItem', scope: 'any', required: ['position', 'name'], requiredUnlessLast: ['item'] },
  {
    type: 'Article',
    scope: 'entity',
    recommended: ['headline', 'image', 'datePublished', 'author'],
  },
  {
    type: 'LocalBusiness',
    scope: 'entity',
    required: ['name', 'address'],
    recommended: ['geo', 'telephone', 'url', 'image'],
  },
  { type: 'Event', scope: 'entity', required: ['name', 'startDate', 'location'] },
  {
    type: 'Product',
    scope: 'entity',
    required: ['name'],
    oneOf: [['offers', 'review', 'aggregateRating']],
  },
  {
    type: 'Offer',
    scope: 'any',
    oneOf: [['price', 'priceSpecification']],
    recommended: ['priceCurrency', 'availability', 'url'],
  },
  // A LocalBusiness is an Organization too, but has its own rule above.
  {
    type: 'Organization',
    scope: 'entity',
    exceptTypes: ['LocalBusiness'],
    recommended: ['name', 'url', 'logo'],
  },
];

/** Offer availability values that already say an offer can no longer be taken. */
const ENDED_AVAILABILITY = new Set(['Discontinued', 'SoldOut', 'OutOfStock']);

/** Start/end property pairs that must not be reversed. */
const DATE_PAIRS = [
  ['startDate', 'endDate'],
  ['availabilityStarts', 'availabilityEnds'],
  ['validFrom', 'validThrough'],
];

const ISO_DATE = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:?\d{2})?)?$/;
const HTML_ENTITY = /&(#\d+|#x[0-9a-f]+|amp|quot|lt|gt|nbsp|apos);/i;
const SCHEMA_URL = /^https?:\/\/schema\.org\//i;

// ---------------------------------------------------------------------------
// HTTP
// ---------------------------------------------------------------------------

/** Local development hosts, whose certificates are expected to be self-signed. */
function isLocalHost(hostname) {
  const host = String(hostname).toLowerCase();
  return (
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host === '[::1]' ||
    host === '::1' ||
    /\.(local|test|localhost)$/.test(host)
  );
}

/** One GET request, without following redirects. */
function request(url, { timeoutMs = TIMEOUT_MS } = {}) {
  return new Promise((resolve, reject) => {
    const target = new URL(url);
    if (target.protocol !== 'https:' && target.protocol !== 'http:') {
      reject(new Error(`Only http and https URLs are supported: ${url}`));
      return;
    }
    const lib = target.protocol === 'https:' ? https : http;
    const req = lib.get(
      target,
      {
        headers: { 'User-Agent': USER_AGENT, Accept: 'text/html,application/json;q=0.9,*/*;q=0.5' },
        rejectUnauthorized: !isLocalHost(target.hostname),
        timeout: timeoutMs,
      },
      (res) => {
        const chunks = [];
        let size = 0;
        res.on('data', (chunk) => {
          size += chunk.length;
          if (size > MAX_BODY_BYTES) {
            req.destroy(new Error(`Response larger than ${MAX_BODY_BYTES} bytes: ${url}`));
            return;
          }
          chunks.push(chunk);
        });
        res.on('error', reject);
        res.on('end', () =>
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: Buffer.concat(chunks).toString('utf8'),
          })
        );
        // A connection dropped mid-body closes the response without 'end'.
        res.on('close', () => {
          if (!res.complete) reject(new Error(`Response closed before it completed: ${url}`));
        });
      }
    );
    req.on('timeout', () => req.destroy(new Error(`Timed out after ${timeoutMs} ms: ${url}`)));
    req.on('error', reject);
  });
}

/**
 * GET a URL, following up to MAX_REDIRECTS redirects and recording each hop.
 *
 * @returns {Promise<{status:number, url:string, redirects:Array, body:string}>}
 */
async function fetchUrl(url, options = {}) {
  let current = url;
  const redirects = [];
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const res = await request(current, options);
    if ([301, 302, 303, 307, 308].includes(res.status) && res.headers.location) {
      const next = new URL(res.headers.location, current).href;
      redirects.push({ status: res.status, from: current, to: next });
      current = next;
      continue;
    }
    return { status: res.status, url: current, redirects, body: res.body };
  }
  throw new Error(`More than ${MAX_REDIRECTS} redirects: ${url}`);
}

async function fetchJson(url, fetch) {
  const res = await fetch(url);
  if (res.status !== 200) return { status: res.status, data: null };
  try {
    return { status: res.status, data: JSON.parse(res.body) };
  } catch {
    return { status: res.status, data: null };
  }
}

// ---------------------------------------------------------------------------
// Vocabulary
// ---------------------------------------------------------------------------

function asList(value) {
  if (value === undefined || value === null) return [];
  return Array.isArray(value) ? value : [value];
}

/** `schema:Thing`, `https://schema.org/Thing` or `{ "@id": ... }` → `Thing`. */
function shortName(value) {
  const id = value && typeof value === 'object' ? value['@id'] || '' : String(value);
  return id.replace(/^schema:/, '').replace(/^https?:\/\/schema\.org\//, '');
}

/**
 * Build lookup tables from a schema.org release file (JSON-LD).
 *
 * @param {object} jsonld Parsed schemaorg-all-https.jsonld.
 * @param {string} [version] Release the file came from, for reports.
 */
function buildVocabulary(jsonld, version = 'unknown') {
  const graph = asList(jsonld && jsonld['@graph']);
  if (graph.length === 0) throw new Error('Vocabulary file has no @graph.');

  const classes = new Set();
  const properties = new Set();
  const directDataTypes = new Set(['DataType']);
  const parents = new Map();
  const domains = new Map();
  const ranges = new Map();
  const superseded = new Map();
  const section = new Map();
  const instanceOf = new Map();

  for (const node of graph) {
    const id = shortName(node['@id']);
    const kinds = asList(node['@type']).map(shortName);
    if (kinds.includes('rdfs:Class')) classes.add(id);
    if (kinds.includes('rdf:Property')) properties.add(id);
    if (kinds.includes('DataType')) directDataTypes.add(id);
    const typed = kinds.filter((k) => !k.includes(':'));
    if (!kinds.includes('rdfs:Class') && !kinds.includes('rdf:Property') && typed.length) {
      instanceOf.set(id, typed);
    }
    parents.set(id, asList(node['rdfs:subClassOf']).map(shortName));
    domains.set(id, new Set(asList(node['schema:domainIncludes']).map(shortName)));
    ranges.set(id, new Set(asList(node['schema:rangeIncludes']).map(shortName)));
    const by = asList(node['schema:supersededBy'])[0];
    if (by) superseded.set(id, shortName(by));
    const part = asList(node['schema:isPartOf'])[0];
    if (part) {
      const host = shortName(part)
        .replace(/^https?:\/\//, '')
        .split('.')[0];
      section.set(id, host);
    }
  }

  const ancestorCache = new Map();
  function ancestors(type) {
    if (ancestorCache.has(type)) return ancestorCache.get(type);
    const seen = new Set();
    const stack = [type];
    while (stack.length) {
      const t = stack.pop();
      if (seen.has(t)) continue;
      seen.add(t);
      for (const p of parents.get(t) || []) stack.push(p);
    }
    ancestorCache.set(type, seen);
    return seen;
  }

  function isDataType(type) {
    for (const a of ancestors(type)) if (directDataTypes.has(a)) return true;
    return false;
  }

  // Enumeration members are instances of a class that descends from Enumeration.
  const enumMembers = new Map();
  for (const [id, types] of instanceOf) {
    const enums = types.filter((t) => ancestors(t).has('Enumeration'));
    if (enums.length) enumMembers.set(id, enums);
  }

  return {
    version,
    classes,
    properties,
    domains,
    ranges,
    superseded,
    section,
    enumMembers,
    ancestors,
    isDataType,
    isType: (t) => classes.has(t),
    isProperty: (p) => properties.has(p),
  };
}

function compareVersions(a, b) {
  const pa = String(a)
    .split('.')
    .map((n) => parseInt(n, 10) || 0);
  const pb = String(b)
    .split('.')
    .map((n) => parseInt(n, 10) || 0);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    if ((pa[i] || 0) !== (pb[i] || 0)) return (pa[i] || 0) - (pb[i] || 0);
  }
  return 0;
}

function defaultCacheDir() {
  return (
    process.env.SCHEMA_TOOL_CACHE || path.join(os.homedir(), '.cache', 'lightspeedwp', 'schemaorg')
  );
}

function cachedVersions(cacheDir) {
  if (!fs.existsSync(cacheDir)) return [];
  return fs
    .readdirSync(cacheDir)
    .filter((v) => fs.existsSync(path.join(cacheDir, v, VOCAB_FILE)))
    .sort(compareVersions);
}

/**
 * Load the vocabulary from a file, the cache, or GitHub (then cache it).
 *
 * @param {object} opts
 * @param {string} [opts.vocabPath] Use this file and skip the cache.
 * @param {string} [opts.version] Release to use; defaults to the latest.
 * @param {string} [opts.cacheDir]
 * @param {Function} [opts.fetch]
 * @returns {Promise<{vocab:object, source:string, notes:string[]}>}
 */
async function resolveVocabulary({
  vocabPath,
  version,
  cacheDir = defaultCacheDir(),
  fetch = fetchUrl,
} = {}) {
  const notes = [];
  if (vocabPath) {
    const vocab = buildVocabulary(
      JSON.parse(fs.readFileSync(vocabPath, 'utf8')),
      version || path.basename(vocabPath)
    );
    return { vocab, source: vocabPath, notes };
  }

  let release = version;
  if (!release) {
    try {
      const { data } = await fetchJson(VOCAB_RELEASES_API, fetch);
      const names = asList(data)
        .filter((entry) => entry && entry.type === 'dir' && /^\d+(\.\d+)*$/.test(entry.name))
        .map((entry) => entry.name)
        .sort(compareVersions);
      release = names[names.length - 1];
    } catch (error) {
      notes.push(`Could not look up the latest schema.org release: ${error.message}`);
    }
    if (!release) {
      const cached = cachedVersions(cacheDir);
      release = cached[cached.length - 1];
      if (!release)
        throw new Error('No schema.org release found online or in the cache. Pass --vocab <file>.');
      notes.push(`Using cached release ${release}; the latest release could not be checked.`);
    }
  }

  const file = path.join(cacheDir, release, VOCAB_FILE);
  if (!fs.existsSync(file)) {
    const res = await fetch(`${VOCAB_RAW}/${release}/${VOCAB_FILE}`);
    if (res.status !== 200)
      throw new Error(`schema.org release ${release} not found (HTTP ${res.status}).`);
    JSON.parse(res.body); // refuse to cache anything that is not JSON
    fs.mkdirSync(path.dirname(file), { recursive: true });
    const partial = `${file}.${process.pid}.partial`;
    fs.writeFileSync(partial, res.body, { flag: 'wx' });
    fs.renameSync(partial, file);
    notes.push(`Downloaded schema.org release ${release}.`);
  }
  const vocab = buildVocabulary(JSON.parse(fs.readFileSync(file, 'utf8')), release);
  return { vocab, source: file, notes };
}

// ---------------------------------------------------------------------------
// Extraction
// ---------------------------------------------------------------------------

const LD_JSON_TAG =
  /<script\b([^>]*\btype\s*=\s*["']application\/ld\+json["'][^>]*)>([\s\S]*?)<\/script>/gi;

/** Every `<script type="application/ld+json">` block, parsed where possible. */
function extractJsonLd(html) {
  const blocks = [];
  let match;
  LD_JSON_TAG.lastIndex = 0;
  while ((match = LD_JSON_TAG.exec(html)) !== null) {
    const attrs = match[1];
    const raw = match[2].trim();
    const classMatch = attrs.match(/\bclass\s*=\s*["']([^"']*)["']/i);
    const block = {
      index: blocks.length,
      className: classMatch ? classMatch[1] : '',
      data: null,
      error: null,
    };
    try {
      block.data = JSON.parse(raw);
    } catch (error) {
      block.error = error.message;
    }
    blocks.push(block);
  }
  return blocks;
}

/** Which plugin most likely produced each block, from the markers they print. */
function detectGenerators(html, blocks) {
  const found = new Set();
  for (const block of blocks) {
    if (/yoast-schema-graph/.test(block.className)) found.add('Yoast SEO');
    else if (/rank-math-schema/.test(block.className)) found.add('Rank Math');
    else if (/aioseo-schema/.test(block.className)) found.add('All in One SEO');
    else found.add('unattributed');
  }
  const yoastActive = /This site is optimized with the Yoast SEO/i.test(html);
  return { generators: [...found], yoastActive };
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

function nodeTypes(node) {
  return asList(node && node['@type']).map(shortName);
}

function isReferenceOnly(node) {
  return (
    node &&
    typeof node === 'object' &&
    !Array.isArray(node) &&
    Object.keys(node).length === 1 &&
    '@id' in node
  );
}

function isEmptyValue(value) {
  return value === '' || (Array.isArray(value) && value.length === 0);
}

function datePart(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value) ? value.slice(0, 10) : null;
}

/**
 * Check the JSON-LD blocks of one page.
 *
 * @param {Array} blocks From extractJsonLd().
 * @param {object} vocab From buildVocabulary().
 * @param {object} [opts]
 * @param {string} [opts.today] YYYY-MM-DD, for expired offers.
 * @returns {{types:Object<string,number>, findings:Array}}
 */
function validateBlocks(blocks, vocab, { today = new Date().toISOString().slice(0, 10) } = {}) {
  const findings = [];
  const types = {};
  const add = (severity, check, where, detail) =>
    findings.push({ severity, check, path: where, detail });

  // Index every node that carries an @id and more than the @id itself.
  const byId = new Map();
  const index = (value) => {
    if (Array.isArray(value)) return value.forEach(index);
    if (!value || typeof value !== 'object') return;
    if (value['@id'] && !isReferenceOnly(value)) {
      const existing = byId.get(value['@id']);
      const t = nodeTypes(value).sort().join('/');
      if (existing && t && existing.types && existing.types !== t) {
        add('warn', 'duplicate-id', value['@id'], `Defined as ${existing.types} and as ${t}.`);
      }
      if (!existing || !existing.types) byId.set(value['@id'], { node: value, types: t });
    }
    Object.values(value).forEach(index);
  };
  blocks.forEach((b) => b.data && index(b.data));

  const resolveTypes = (value) => {
    if (isReferenceOnly(value)) {
      const target = byId.get(value['@id']);
      return target ? nodeTypes(target.node) : null;
    }
    return nodeTypes(value);
  };

  const entities = [];

  const checkValue = (prop, item, where) => {
    const range = vocab.ranges.get(prop) || new Set();
    const rangeList = [...range];
    const rangeHasDataType = rangeList.some((r) => vocab.isDataType(r));

    if (isEmptyValue(item)) {
      add('warn', 'empty-value', where, `'${prop}' is empty.`);
      return;
    }
    if (item && typeof item === 'object' && !Array.isArray(item)) {
      if (isReferenceOnly(item)) {
        if (!byId.has(item['@id'])) {
          add(
            'warn',
            'unresolved-reference',
            where,
            `'${prop}' points to ${item['@id']}, which no block on the page defines.`
          );
          return;
        }
      }
      const its = resolveTypes(item) || [];
      const known = its.filter((t) => vocab.isType(t));
      if (
        known.length &&
        range.size &&
        !known.some((t) => [...vocab.ancestors(t)].some((a) => range.has(a)))
      ) {
        add(
          'warn',
          'property-range',
          where,
          `'${prop}' holds ${known.join('/')}; expected ${rangeList.sort().join(', ')}.`
        );
      }
      return;
    }
    if (typeof item === 'string') {
      if (SCHEMA_URL.test(item) && rangeList.some((r) => vocab.ancestors(r).has('Enumeration'))) {
        const member = shortName(item);
        const memberOf = vocab.enumMembers.get(member) || [];
        if (!memberOf.some((e) => [...vocab.ancestors(e)].some((a) => range.has(a)))) {
          add(
            'warn',
            'enum-value',
            where,
            `'${prop}' value ${item} is not a member of ${rangeList.sort().join(', ')}.`
          );
        }
        return;
      }
      if (
        rangeList.length &&
        rangeList.every((r) => ['Date', 'DateTime'].includes(r)) &&
        !ISO_DATE.test(item)
      ) {
        add(
          'warn',
          'date-format',
          where,
          `'${prop}' is not an ISO 8601 date: ${item.slice(0, 40)}`
        );
      }
      if (range.size && !rangeHasDataType && !/^https?:\/\//i.test(item)) {
        add(
          'info',
          'text-for-thing',
          where,
          `'${prop}' is plain text; schema.org expects ${rangeList.sort().join(', ')}.`
        );
      }
      if (HTML_ENTITY.test(item)) {
        add(
          'info',
          'html-entity',
          where,
          `'${prop}' contains an HTML entity (for example &#8211;) instead of the character.`
        );
      }
    }
  };

  const walk = (value, where, ctx) => {
    if (Array.isArray(value)) {
      value.forEach((v, i) =>
        walk(v, `${where}[${i}]`, { ...ctx, index: i, last: i === value.length - 1 })
      );
      return;
    }
    if (!value || typeof value !== 'object') return;
    if ('@graph' in value) walk(value['@graph'], `${where}.@graph`, { depth: 0, parentProp: null });

    const ts = nodeTypes(value);
    const label = ts.length ? `${where}<${ts.join('/')}>` : where;
    const ancestors = new Set();
    for (const t of ts) {
      types[t] = (types[t] || 0) + 1;
      if (!vocab.isType(t)) {
        add('error', 'unknown-type', label, `'${t}' is not a schema.org type.`);
        continue;
      }
      for (const a of vocab.ancestors(t)) ancestors.add(a);
      if (vocab.superseded.has(t))
        add(
          'warn',
          'superseded-type',
          label,
          `'${t}' is superseded by '${vocab.superseded.get(t)}'.`
        );
      const part = vocab.section.get(t);
      if (part === 'pending')
        add('info', 'pending-type', label, `'${t}' is still in schema.org's pending section.`);
      if (part === 'attic')
        add('warn', 'retired-type', label, `'${t}' has been retired to schema.org's attic.`);
    }
    if (ts.length) {
      const standalone = ctx.depth === 0 || (value['@id'] && !isReferenceOnly(value));
      // A value that is not in an array is the only, and so the last, item.
      entities.push({
        node: value,
        label,
        ancestors,
        standalone,
        parentProp: ctx.parentProp,
        last: ctx.last !== false,
      });
    }

    for (const [key, v] of Object.entries(value)) {
      if (key.startsWith('@')) continue;
      let prop = shortName(key);
      // schema.org Actions annotate inputs and outputs as `<property>-input`.
      const action = prop.match(/^(.+)-(input|output)$/);
      if (action && vocab.isProperty(action[1])) continue;
      if (!vocab.isProperty(prop)) {
        add('error', 'unknown-property', label, `'${prop}' is not a schema.org property.`);
        continue;
      }
      if (vocab.superseded.has(prop))
        add(
          'warn',
          'superseded-property',
          label,
          `'${prop}' is superseded by '${vocab.superseded.get(prop)}'.`
        );
      const part = vocab.section.get(prop);
      if (part === 'pending')
        add(
          'info',
          'pending-property',
          label,
          `'${prop}' is still in schema.org's pending section.`
        );
      if (part === 'attic')
        add('warn', 'retired-property', label, `'${prop}' has been retired to schema.org's attic.`);
      const domain = vocab.domains.get(prop) || new Set();
      if (
        ts.length &&
        ancestors.size &&
        domain.size &&
        ![...domain].some((d) => ancestors.has(d))
      ) {
        add(
          'warn',
          'property-domain',
          label,
          `'${prop}' is not expected on ${ts.join('/')} (valid on ${[...domain].sort().join(', ')}).`
        );
      }
      for (const item of Array.isArray(v) && v.length ? v : [v])
        checkValue(prop, item, `${label}.${prop}`);
      walk(v, `${label}.${prop}`, { depth: (ctx.depth || 0) + 1, parentProp: prop });
    }
  };

  blocks.forEach((block) => {
    if (block.error)
      add(
        'error',
        'invalid-json',
        `block${block.index}`,
        `JSON-LD block does not parse: ${block.error}`
      );
    else walk(block.data, `block${block.index}`, { depth: 0, parentProp: null });
  });

  // Rich-result and consistency checks on each typed node.
  for (const { node, label, ancestors, standalone, parentProp, last } of entities) {
    const has = (p) => node[p] !== undefined && !isEmptyValue(node[p]);
    for (const rule of RICH_RESULT_RULES) {
      if (!ancestors.has(rule.type)) continue;
      if (rule.scope === 'entity' && !standalone) continue;
      if ((rule.exceptTypes || []).some((t) => ancestors.has(t))) continue;
      for (const p of rule.required || []) {
        const exempt =
          rule.exemptWhenNestedUnder && (rule.exemptWhenNestedUnder[p] || []).includes(parentProp);
        if (!has(p) && !exempt)
          add(
            'warn',
            'rich-result-required',
            label,
            `${rule.type} needs '${p}' for a Google rich result.`
          );
      }
      for (const p of rule.requiredUnlessLast || []) {
        if (!has(p) && !last)
          add(
            'warn',
            'rich-result-required',
            label,
            `${rule.type} needs '${p}' unless it is the last item.`
          );
      }
      for (const group of rule.oneOf || []) {
        if (!group.some(has))
          add(
            'warn',
            'rich-result-required',
            label,
            `${rule.type} needs one of ${group.map((p) => `'${p}'`).join(', ')}.`
          );
      }
      for (const p of rule.recommended || []) {
        if (!has(p))
          add('info', 'rich-result-recommended', label, `${rule.type} should have '${p}'.`);
      }
    }

    if (ancestors.has('LocalBusiness') && standalone && typeof node.address === 'string') {
      add(
        'info',
        'address-text',
        label,
        "'address' is plain text; Google expects a PostalAddress."
      );
    }

    if (ancestors.has('Offer')) {
      const end = datePart(node.availabilityEnds) || datePart(node.priceValidUntil);
      const availability = shortName(node.availability || '');
      if (end && end < today && !ENDED_AVAILABILITY.has(availability)) {
        add(
          'warn',
          'expired-offer',
          label,
          `Offer ended on ${end} but still says ${availability || 'nothing about availability'}.`
        );
      }
    }

    for (const [start, end] of DATE_PAIRS) {
      const a = datePart(node[start]);
      const b = datePart(node[end]);
      if (a && b && a > b)
        add('warn', 'date-order', label, `'${start}' (${a}) is after '${end}' (${b}).`);
    }
  }

  findings.sort((x, y) => SEVERITY_ORDER[x.severity] - SEVERITY_ORDER[y.severity]);
  return { types, findings };
}

/**
 * Fetch one page and audit its structured data.
 *
 * @returns {Promise<object>} Page result (see data-model.md).
 */
async function auditPage(url, { vocab, fetch = fetchUrl, today } = {}) {
  const result = {
    url,
    finalUrl: url,
    status: null,
    redirects: [],
    generators: [],
    yoastActive: false,
    blocks: 0,
    types: {},
    findings: [],
  };
  let res;
  try {
    res = await fetch(url);
  } catch (error) {
    result.findings.push({
      severity: 'error',
      check: 'fetch-failed',
      path: url,
      detail: error.message,
    });
    return result;
  }
  Object.assign(result, { finalUrl: res.url, status: res.status, redirects: res.redirects || [] });
  if (result.redirects.length && stripSlash(res.url) !== stripSlash(url)) {
    result.findings.push({
      severity: 'warn',
      check: 'redirected',
      path: url,
      detail: `Redirects to ${res.url}; its structured data is what crawlers see.`,
    });
  }
  if (res.status < 200 || res.status >= 300) {
    result.findings.push({
      severity: 'error',
      check: 'http-status',
      path: url,
      detail: `HTTP ${res.status}.`,
    });
    return result;
  }
  const blocks = extractJsonLd(res.body);
  const { generators, yoastActive } = detectGenerators(res.body, blocks);
  Object.assign(result, { blocks: blocks.length, generators, yoastActive });
  if (blocks.length === 0) {
    result.findings.push({
      severity: 'warn',
      check: 'no-structured-data',
      path: url,
      detail: 'The page has no JSON-LD.',
    });
    return result;
  }
  const { types, findings } = validateBlocks(blocks, vocab, { today });
  result.types = types;
  result.findings.push(...findings);
  result.findings.sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]);
  return result;
}

function stripSlash(url) {
  return String(url).replace(/\/+$/, '');
}

function escapeRegExp(text) {
  return String(text).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** The page's `<link rel="canonical">` URL, if it prints one. */
function canonicalUrl(html) {
  const tag = String(html).match(/<link\b[^>]*\brel=["']canonical["'][^>]*>/i);
  const href = tag && tag[0].match(/\bhref=["']([^"']+)["']/i);
  return href ? href[1] : null;
}

// ---------------------------------------------------------------------------
// URL discovery
// ---------------------------------------------------------------------------

/**
 * Pick one representative URL per post type, taxonomy, key page, archive,
 * author and search, using the WordPress REST API.
 *
 * @param {string} site Site home URL.
 * @returns {Promise<{site:string, urls:Array, skipped:Array, notes:string[]}>}
 */
async function discoverUrls(site, { fetch = fetchUrl, search = 'a' } = {}) {
  const base = stripSlash(site);
  const urls = [];
  const skipped = [];
  const notes = [];
  const seen = new Set();

  const push = (kind, label, url, note = '') => {
    if (!url || seen.has(stripSlash(url))) return;
    seen.add(stripSlash(url));
    urls.push({ kind, label, url, note });
  };

  // Pretty REST URLs first, then the ?rest_route= form for sites without them.
  let restMode = 'pretty';
  const rest = (route, query = '') => {
    const q = query ? (restMode === 'pretty' ? `?${query}` : `&${query}`) : '';
    return restMode === 'pretty'
      ? `${base}/wp-json/${route}${q}`
      : `${base}/?rest_route=/${route}${q}`;
  };
  let typesRes = await fetchJson(rest('wp/v2/types'), fetch);
  if (!typesRes.data) {
    restMode = 'query';
    typesRes = await fetchJson(rest('wp/v2/types'), fetch);
  }
  if (!typesRes.data) {
    throw new Error(
      `The WordPress REST API is not reachable at ${base} (HTTP ${typesRes.status}).`
    );
  }

  push('home', 'Home page', `${base}/`);

  /** Keep a candidate only if it answers 200; note where it redirects. */
  const probe = async (kind, label, url) => {
    try {
      const res = await fetch(url);
      if (res.status !== 200) {
        skipped.push({ kind, label, url, reason: `HTTP ${res.status}` });
        return;
      }
      const moved = (res.redirects || []).length && stripSlash(res.url) !== stripSlash(url);
      push(kind, label, url, moved ? `redirects to ${res.url}` : '');
    } catch (error) {
      skipped.push({ kind, label, url, reason: error.message });
    }
  };

  for (const [slug, type] of Object.entries(typesRes.data)) {
    if (INTERNAL_TYPES.has(slug) || !type || !type.rest_base) continue;
    const ns = type.rest_namespace || 'wp/v2';
    const label = type.name || slug;
    const { data } = await fetchJson(
      rest(`${ns}/${type.rest_base}`, 'per_page=1&_fields=link'),
      fetch
    );
    const link = asList(data)[0] && asList(data)[0].link;
    if (link) await probe('single', label, link);
    else skipped.push({ kind: 'single', label, url: '', reason: 'no published items' });

    if (slug === 'post') continue; // the posts page is found among the pages
    try {
      // WordPress either redirects ?post_type=<slug> to the archive or renders
      // the archive in place, marked by its body class. Without an archive it
      // falls back to the home page, so neither signal appears.
      const query = `${base}/?post_type=${encodeURIComponent(slug)}`;
      const res = await fetch(query);
      const moved = (res.redirects || []).length && stripSlash(res.url) !== base;
      const bodyClass = new RegExp(
        `<body[^>]*class=["'][^"']*\\bpost-type-archive-${escapeRegExp(slug)}\\b`,
        'i'
      );
      if (res.status === 200 && (moved || bodyClass.test(res.body))) {
        push('archive', `${label} archive`, moved ? res.url : canonicalUrl(res.body) || query);
      }
    } catch {
      // No archive; nothing to test.
    }
  }

  const taxRes = await fetchJson(rest('wp/v2/taxonomies'), fetch);
  for (const [slug, tax] of Object.entries(taxRes.data || {})) {
    if (INTERNAL_TAXONOMIES.has(slug) || !tax || !tax.rest_base) continue;
    const ns = tax.rest_namespace || 'wp/v2';
    const label = tax.name || slug;
    const { data } = await fetchJson(
      rest(
        `${ns}/${tax.rest_base}`,
        'per_page=1&hide_empty=true&orderby=count&order=desc&_fields=link'
      ),
      fetch
    );
    const link = asList(data)[0] && asList(data)[0].link;
    if (link) await probe('term', label, link);
    else skipped.push({ kind: 'term', label, url: '', reason: 'no terms in use' });
  }

  const pagesRes = await fetchJson(rest('wp/v2/pages', 'per_page=100&_fields=link,slug'), fetch);
  for (const page of asList(pagesRes.data)) {
    if (page && KEY_PAGE_PATTERN.test(page.slug)) push('page', page.slug, page.link);
  }
  if (Array.isArray(pagesRes.data) && pagesRes.data.length === 100) {
    notes.push('The site has 100 or more pages; only the first 100 were checked for key pages.');
  }

  const usersRes = await fetchJson(rest('wp/v2/users', 'per_page=1&_fields=link'), fetch);
  const author = asList(usersRes.data)[0];
  if (author && author.link) await probe('author', 'Author archive', author.link);
  else
    skipped.push({
      kind: 'author',
      label: 'Author archive',
      url: '',
      reason: 'users endpoint not public',
    });

  push('search', 'Search results', `${base}/?s=${encodeURIComponent(search)}`);

  return { site: base, urls, skipped, notes };
}

// ---------------------------------------------------------------------------
// Reports
// ---------------------------------------------------------------------------

function cell(text) {
  return String(text ?? '')
    .replace(/\|/g, '\\|')
    .replace(/\r?\n/g, ' ');
}

function summarise(pages) {
  const counts = { error: 0, warn: 0, info: 0 };
  for (const page of pages) for (const f of page.findings) counts[f.severity]++;
  return counts;
}

function renderUrls(result) {
  const lines = [
    `# Schema test URLs for ${result.site}`,
    '',
    '| Kind | Label | URL | Note |',
    '| --- | --- | --- | --- |',
  ];
  for (const u of result.urls)
    lines.push(`| ${cell(u.kind)} | ${cell(u.label)} | ${cell(u.url)} | ${cell(u.note)} |`);
  if (result.skipped.length) {
    lines.push(
      '',
      '## Skipped',
      '',
      '| Kind | Label | URL | Reason |',
      '| --- | --- | --- | --- |'
    );
    for (const s of result.skipped)
      lines.push(`| ${cell(s.kind)} | ${cell(s.label)} | ${cell(s.url)} | ${cell(s.reason)} |`);
  }
  for (const note of result.notes) lines.push('', `> ${note}`);
  return `${lines.join('\n')}\n`;
}

function renderReport(report, { details = false } = {}) {
  const { pages, vocabulary } = report;
  const totals = summarise(pages);
  const lines = [
    '# Structured data audit',
    '',
    `schema.org release ${vocabulary.version}; ${pages.length} page(s); ${totals.error} error(s), ${totals.warn} warning(s), ${totals.info} note(s).`,
    '',
    '| Page | HTTP | Generators | Types | Errors | Warnings | Notes |',
    '| --- | --- | --- | --- | --- | --- | --- |',
  ];
  for (const page of pages) {
    const c = summarise([page]);
    const typeList = Object.keys(page.types).sort().join(', ');
    lines.push(
      `| ${cell(page.url)} | ${cell(page.status ?? '-')} | ${cell(page.generators.join(', ') || '-')} | ${cell(typeList || '-')} | ${c.error} | ${c.warn} | ${c.info} |`
    );
  }

  const groups = new Map();
  for (const page of pages) {
    for (const f of page.findings) {
      const key = `${f.severity}|${f.check}|${f.detail}`;
      if (!groups.has(key)) groups.set(key, { ...f, pages: new Set() });
      groups.get(key).pages.add(page.url);
    }
  }
  if (groups.size) {
    lines.push(
      '',
      '## Findings',
      '',
      '| Severity | Check | Detail | Pages |',
      '| --- | --- | --- | --- |'
    );
    const sorted = [...groups.values()].sort(
      (a, b) =>
        SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity] || b.pages.size - a.pages.size
    );
    for (const g of sorted) {
      const list = [...g.pages];
      const shown =
        list.length > 3
          ? `${list.slice(0, 3).join(', ')} and ${list.length - 3} more`
          : list.join(', ');
      lines.push(
        `| ${g.severity} | ${cell(g.check)} | ${cell(g.detail)} | ${cell(`${list.length}: ${shown}`)} |`
      );
    }
  }

  if (details) {
    for (const page of pages) {
      if (!page.findings.length) continue;
      lines.push(
        '',
        `## ${page.url}`,
        '',
        '| Severity | Check | Where | Detail |',
        '| --- | --- | --- | --- |'
      );
      for (const f of page.findings)
        lines.push(`| ${f.severity} | ${cell(f.check)} | ${cell(f.path)} | ${cell(f.detail)} |`);
    }
  }
  for (const note of report.notes || []) lines.push('', `> ${note}`);
  return `${lines.join('\n')}\n`;
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const args = { _: [], flags: {} };
  const valued = new Set([
    '--urls-file',
    '--vocab',
    '--vocab-version',
    '--today',
    '--search',
    '--cache-dir',
    '--format',
    '--out',
    '--csv',
    '--client',
  ]);
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (valued.has(a)) {
      if (i + 1 >= argv.length) throw new Error(`${a} needs a value.`);
      args.flags[a.slice(2)] = argv[++i];
    } else if (a.startsWith('--')) args.flags[a.slice(2)] = true;
    else args._.push(a);
  }
  return args;
}

function readUrlsFile(file) {
  return fs
    .readFileSync(file, 'utf8')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => line.split(/\s+/)[0]);
}

const FORMATS = new Set(['summary', 'report', 'csv', 'json']);

/** Write to a file, refusing to replace one unless --force was given. */
function writeFile(file, text, force) {
  try {
    fs.writeFileSync(file, text, { flag: force ? 'w' : 'wx' });
  } catch (error) {
    if (error.code === 'EEXIST')
      throw new Error(`${file} already exists; pass --force to replace it.`, { cause: error });
    throw error;
  }
}

/** Fetch and check each target ({ url, kind, label }) and build the report envelope. */
async function runValidation(targets, { flags, cacheDir, fetch }) {
  const { vocab, notes } = await resolveVocabulary({
    vocabPath: flags.vocab,
    version: flags['vocab-version'],
    cacheDir,
    fetch,
  });
  const pages = [];
  for (const target of targets) {
    const page = await auditPage(target.url, { vocab, fetch, today: flags.today });
    pages.push({ kind: target.kind || '', label: target.label || '', ...page });
  }
  return { vocabulary: { version: vocab.version }, pages, totals: summarise(pages), notes };
}

/** Render the report in the chosen format, write it and any CSV, and pick the exit code. */
function emitReport(report, { flags, stdout, site }) {
  const format = flags.json ? 'json' : flags.format || 'summary';
  if (!FORMATS.has(format)) throw new Error(`--format must be one of ${[...FORMATS].join(', ')}.`);
  const date = flags.today || new Date().toISOString().slice(0, 10);
  const render = {
    summary: () => renderReport(report, { details: !!flags.details }),
    report: () => renderClientReport(report, { client: flags.client, site, date }),
    csv: () => renderCsv(report),
    json: () => `${JSON.stringify(report, null, 2)}\n`,
  }[format];

  const written = [];
  if (flags.out) {
    writeFile(flags.out, render(), flags.force);
    written.push(flags.out);
  }
  if (flags.csv) {
    writeFile(flags.csv, renderCsv(report), flags.force);
    written.push(flags.csv);
  }
  if (written.length) {
    const t = report.totals;
    stdout.write(
      `Checked ${report.pages.length} page(s): ${t.error} error(s), ${t.warn} warning(s), ${t.info} note(s).\n` +
        written.map((file) => `Wrote ${file}\n`).join('')
    );
  } else {
    stdout.write(render());
  }
  return report.totals.error || report.totals.warn ? EXIT_FINDINGS : EXIT_OK;
}

const USAGE = `Usage:
  schema-tool urls <site-url> [--list | --json] [--search <term>]
  schema-tool validate <url...> [--urls-file <file>] [report options]
  schema-tool audit <site-url> [--urls-file <file>] [--search <term>] [report options]
  schema-tool vocab [--vocab-version <v>] [--json]

Report options:
  --format summary|report|csv|json   summary (default) for developers; report for clients
  --out <file>   write the report to a file     --csv <file>   also write a CSV of findings
  --client <name>   report title                --force   replace existing files
  --vocab <file> | --vocab-version <v>          --today YYYY-MM-DD   --details   --json
`;

async function main(
  argv = process.argv.slice(2),
  { stdout = process.stdout, stderr = process.stderr, fetch = fetchUrl } = {}
) {
  let args;
  try {
    args = parseArgs(argv);
  } catch (error) {
    stderr.write(`${error.message}\n${USAGE}`);
    return EXIT_ERROR;
  }
  const [command, ...rest] = args._;
  const { flags } = args;
  const cacheDir = flags['cache-dir'] || defaultCacheDir();

  try {
    if (command === 'urls') {
      if (rest.length !== 1) throw new Error('urls needs exactly one site URL.');
      const result = await discoverUrls(rest[0], { fetch, search: flags.search || 'a' });
      if (flags.json) stdout.write(`${JSON.stringify(result, null, 2)}\n`);
      else if (flags.list) stdout.write(`${result.urls.map((u) => u.url).join('\n')}\n`);
      else stdout.write(renderUrls(result));
      return EXIT_OK;
    }

    if (command === 'vocab') {
      const { vocab, source, notes } = await resolveVocabulary({
        version: flags['vocab-version'],
        cacheDir,
        fetch,
      });
      const summary = {
        version: vocab.version,
        source,
        types: vocab.classes.size,
        properties: vocab.properties.size,
        notes,
      };
      stdout.write(
        flags.json
          ? `${JSON.stringify(summary, null, 2)}\n`
          : `schema.org ${summary.version}: ${summary.types} types, ${summary.properties} properties (${source})\n${notes.map((n) => `> ${n}\n`).join('')}`
      );
      return EXIT_OK;
    }

    if (command === 'validate') {
      const urls = [...rest, ...(flags['urls-file'] ? readUrlsFile(flags['urls-file']) : [])];
      if (!urls.length) throw new Error('validate needs at least one URL or --urls-file.');
      const report = await runValidation(
        urls.map((url) => ({ url })),
        { flags, cacheDir, fetch }
      );
      return emitReport(report, { flags, stdout });
    }

    if (command === 'audit') {
      if (rest.length !== 1) throw new Error('audit needs exactly one site URL.');
      const discovery = await discoverUrls(rest[0], { fetch, search: flags.search || 'a' });
      const known = new Set(discovery.urls.map((u) => stripSlash(u.url)));
      const extra = (flags['urls-file'] ? readUrlsFile(flags['urls-file']) : [])
        .filter((url) => !known.has(stripSlash(url)))
        .map((url) => ({ url, kind: 'extra' }));
      const report = await runValidation([...discovery.urls, ...extra], { flags, cacheDir, fetch });
      report.site = discovery.site;
      report.skipped = discovery.skipped;
      report.notes = [...discovery.notes, ...report.notes];
      return emitReport(report, { flags, stdout, site: discovery.site });
    }

    stderr.write(USAGE);
    return command ? EXIT_ERROR : EXIT_OK;
  } catch (error) {
    stderr.write(`schema-tool: ${error.message}\n`);
    return EXIT_ERROR;
  }
}

if (require.main === module) {
  main().then((code) => {
    process.exitCode = code;
  });
}

module.exports = {
  EXIT_OK,
  EXIT_FINDINGS,
  EXIT_ERROR,
  RICH_RESULT_RULES,
  isLocalHost,
  fetchUrl,
  buildVocabulary,
  resolveVocabulary,
  compareVersions,
  extractJsonLd,
  detectGenerators,
  validateBlocks,
  auditPage,
  discoverUrls,
  renderReport,
  renderUrls,
  renderClientReport,
  renderCsv,
  parseArgs,
  main,
};
