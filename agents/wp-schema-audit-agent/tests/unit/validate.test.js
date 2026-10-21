/**
 * @jest-environment node
 *
 * Unit tests for JSON-LD extraction and validation (spec 023, User Story 2).
 * Each case is modelled on markup found on real WordPress sites.
 */

const { extractJsonLd, detectGenerators, validateBlocks } = require('../../lib/schema-tool.cjs');
const { loadVocab, page, blocksOf, checks } = require('./helpers.cjs');

const vocab = loadVocab();
const TODAY = '2026-10-14';
const run = (...docs) => validateBlocks(blocksOf(...docs), vocab, { today: TODAY });
const graph = (...nodes) => ({ '@context': 'https://schema.org', '@graph': nodes });

describe('extractJsonLd', () => {
  it('finds every block whatever the attribute order, and keeps its class', () => {
    const html =
      '<script class="yoast-schema-graph" type="application/ld+json">{"@type":"Thing"}</script>' +
      '<script type=\'application/ld+json\'>{"@type":"Offer"}</script>' +
      '<script type="text/javascript">var x = 1;</script>';
    const blocks = extractJsonLd(html);
    expect(blocks.map((b) => b.className)).toEqual(['yoast-schema-graph', '']);
    expect(blocks.map((b) => b.data['@type'])).toEqual(['Thing', 'Offer']);
  });

  it('records a block that does not parse instead of throwing', () => {
    const [block] = extractJsonLd(page(['{"@type": "Thing",}']));
    expect(block.data).toBeNull();
    expect(block.error).toBeTruthy();
    expect(checks(validateBlocks([block], vocab).findings)).toEqual(['error invalid-json']);
  });
});

describe('detectGenerators', () => {
  it('names Yoast from its graph class, and notices Yoast is active without a graph', () => {
    const html = page([{ '@type': 'Thing' }], { className: 'yoast-schema-graph' });
    expect(detectGenerators(html, extractJsonLd(html)).generators).toEqual(['Yoast SEO']);
    const other = page([{ '@type': 'Offer' }], {
      extraHead: '<!-- This site is optimized with the Yoast SEO plugin -->',
    });
    expect(detectGenerators(other, extractJsonLd(other))).toEqual({
      generators: ['unattributed'],
      yoastActive: true,
    });
  });
});

describe('validateBlocks: vocabulary', () => {
  it('passes a well-formed graph and counts its types', () => {
    const result = run(
      graph(
        { '@type': 'WebPage', '@id': 'https://x.test/#page', name: 'Home', url: 'https://x.test/' },
        {
          '@type': 'Organization',
          '@id': 'https://x.test/#org',
          name: 'X',
          url: 'https://x.test/',
          logo: 'https://x.test/l.png',
        }
      )
    );
    expect(result.findings).toEqual([]);
    expect(result.types).toEqual({ WebPage: 1, Organization: 1 });
  });

  it('reports unknown types and properties as errors', () => {
    const result = run({ '@type': 'Hotelz', nmae: 'Typo' });
    expect(checks(result.findings)).toEqual(['error unknown-type', 'error unknown-property']);
  });

  it('accepts schema.org Action annotations such as query-input', () => {
    const result = run({
      '@type': 'SearchAction',
      target: 'https://x.test/?s={q}',
      'query-input': 'required name=q',
    });
    expect(result.findings).toEqual([]);
  });

  it('warns when a property is used on a type outside its domain', () => {
    const result = run({
      '@type': 'Review',
      additionalProperty: [{ '@type': 'PropertyValue', value: 'x' }],
    });
    expect(checks(result.findings)).toContain('warn property-domain');
  });

  it('warns when a nested value is outside the property range', () => {
    const result = run({
      '@type': 'Offer',
      price: '1',
      itemOffered: [
        { '@type': 'TouristTrip', name: 'Tour' },
        { '@type': 'LodgingBusiness', name: 'Lodge' },
      ],
    });
    const range = result.findings.filter((f) => f.check === 'property-range');
    expect(range).toHaveLength(1);
    expect(range[0].detail).toMatch(/LodgingBusiness/);
  });

  it('notes pending types and warns on superseded properties', () => {
    const result = run({ '@type': 'TouristTrip', name: 'Tour', reviews: [] });
    expect(checks(result.findings)).toEqual(
      expect.arrayContaining(['info pending-type', 'warn superseded-property', 'warn empty-value'])
    );
  });

  it('checks enumeration values against the property range', () => {
    const ok = run({
      '@type': 'Offer',
      price: '1',
      availability: 'https://schema.org/LimitedAvailability',
    });
    expect(checks(ok.findings)).not.toContain('warn enum-value');
    const bad = run({ '@type': 'Offer', price: '1', availability: 'https://schema.org/InStok' });
    expect(checks(bad.findings)).toContain('warn enum-value');
  });

  it('accepts a URL where a Thing is expected, but notes plain text', () => {
    const list = (item) =>
      run({
        '@type': 'BreadcrumbList',
        itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item }],
      });
    expect(list('https://x.test/').findings).toEqual([]);
    expect(checks(list('Home page').findings)).toEqual(['info text-for-thing']);
  });

  it('warns on a reference to a node no block defines', () => {
    const result = run({
      '@type': 'Offer',
      price: '1',
      mainEntityOfPage: { '@id': 'https://x.test/special/a/' },
    });
    expect(checks(result.findings)).toContain('warn unresolved-reference');
  });

  it('resolves references across blocks on the same page', () => {
    const result = run(
      graph({ '@type': 'WebPage', '@id': 'https://x.test/special/a/', name: 'A' }),
      { '@type': 'Offer', price: '1', mainEntityOfPage: { '@id': 'https://x.test/special/a/' } }
    );
    expect(checks(result.findings)).not.toContain('warn unresolved-reference');
  });

  it('flags malformed dates and HTML entities left in text', () => {
    const result = run({
      '@type': 'Article',
      '@id': 'https://x.test/#a',
      headline: 'Cape Town &#8211; Botswana',
      datePublished: '14/10/2026',
      image: 'https://x.test/a.jpg',
      author: { '@type': 'Person', name: 'A' },
    });
    expect(checks(result.findings)).toEqual(['warn date-format', 'info html-entity']);
  });

  it('warns when one @id is defined with two different types', () => {
    const result = run(graph({ '@type': 'WebPage', '@id': 'https://x.test/a/' }), {
      '@type': 'Offer',
      '@id': 'https://x.test/a/',
      price: '1',
    });
    expect(checks(result.findings)).toContain('warn duplicate-id');
  });
});

describe('validateBlocks: rich-result rules', () => {
  it('requires author, reviewRating and itemReviewed on a standalone Review', () => {
    const result = run({
      '@type': 'Review',
      '@id': 'https://x.test/review/a/#review',
      reviewBody: 'Great.',
      datePublished: '2026-06-15',
    });
    const required = result.findings
      .filter((f) => f.check === 'rich-result-required')
      .map((f) => f.detail);
    expect(required).toEqual([
      expect.stringMatching(/'author'/),
      expect.stringMatching(/'reviewRating'/),
      expect.stringMatching(/'itemReviewed'/),
    ]);
  });

  it('does not require itemReviewed on a review nested in the item it reviews', () => {
    const result = run({
      '@type': 'LodgingBusiness',
      '@id': 'https://x.test/#lodge',
      name: 'Lodge',
      address: { '@type': 'PostalAddress' },
      review: {
        '@type': 'Review',
        author: { '@type': 'Person', name: 'A' },
        reviewRating: { '@type': 'Rating', ratingValue: 5 },
      },
    });
    expect(result.findings.filter((f) => f.check === 'rich-result-required')).toEqual([]);
  });

  it('lets the last breadcrumb omit item, but not the others', () => {
    const result = run({
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home' },
        { '@type': 'ListItem', position: 2, name: 'Tour' },
      ],
    });
    const required = result.findings.filter((f) => f.check === 'rich-result-required');
    expect(required).toHaveLength(1);
    expect(required[0].path).toMatch(/itemListElement\[0\]/);
  });

  it('requires a price or price specification on an Offer', () => {
    expect(checks(run({ '@type': 'Offer', name: 'Empty special' }).findings)).toContain(
      'warn rich-result-required'
    );
    expect(
      checks(
        run({
          '@type': 'Offer',
          priceSpecification: { '@type': 'UnitPriceSpecification', price: '1' },
        }).findings
      )
    ).not.toContain('warn rich-result-required');
  });

  it('holds only standalone businesses to listing requirements, and notes a text address', () => {
    const nested = run({
      '@type': 'Review',
      itemReviewed: { '@type': 'LodgingBusiness', name: 'Lodge' },
    });
    expect(nested.findings.map((f) => f.detail).join(' ')).not.toMatch(
      /LocalBusiness needs 'address'/
    );
    const standalone = run({
      '@type': 'LodgingBusiness',
      '@id': 'https://x.test/#lodge',
      name: 'Lodge',
      address: 'Helshoogte Road',
    });
    expect(checks(standalone.findings)).toContain('info address-text');
    // A business is an Organization too, but is not asked for an organisation logo.
    expect(standalone.findings.map((f) => f.detail).join(' ')).not.toMatch(
      /Organization should have 'logo'/
    );
  });

  it('warns on an offer that has ended but still claims to be available', () => {
    const offer = (availability) =>
      run({
        '@type': 'Offer',
        price: '1',
        availabilityEnds: '2026-09-01',
        availability,
      }).findings.map((f) => f.check);
    expect(offer('https://schema.org/LimitedAvailability')).toContain('expired-offer');
    expect(offer('https://schema.org/Discontinued')).not.toContain('expired-offer');
  });

  it('warns when a date range is reversed', () => {
    const result = run({
      '@type': 'Offer',
      price: '1',
      availabilityStarts: '2026-11-01',
      availabilityEnds: '2026-07-31',
    });
    expect(checks(result.findings)).toContain('warn date-order');
  });
});
