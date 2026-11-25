/**
 * Client-facing outputs for schema-tool: a Markdown report written for site
 * owners, and a CSV with one row per finding for tracking fixes in a
 * spreadsheet. Both are built from the same validation report, so they never
 * disagree.
 *
 * Contract: .github/specs/023-wp-schema-audit-agent/contracts/schema-tool-cli.md
 *
 * Neither output repeats values from a page's structured data other than
 * URLs, type and property names and dates; findings carry no personal data.
 *
 * @module agents/wp-schema-audit-agent/lib/report-formats
 */

'use strict';

/** Severity → the priority a client reads. */
const PRIORITY = {
  error: 'Must fix',
  warn: 'Should fix',
  info: 'Could improve',
};

const SEVERITY_ORDER = { error: 0, warn: 1, info: 2 };

/**
 * Plain-English wording for every check: a short title, why it matters to the
 * site owner, and what to do. Keep these free of jargon where a plain word
 * will do; the technical detail is in each finding's `detail`.
 */
const CHECK_GUIDE = {
  'unknown-type': {
    title: 'Uses a type that schema.org does not define',
    why: 'Search engines ignore anything they do not recognise, so this part of the page is not understood at all.',
    fix: 'Correct the type name (it is often a typo) or replace it with the nearest schema.org type.',
  },
  'unknown-property': {
    title: 'Uses a property that schema.org does not define',
    why: 'Search engines ignore properties they do not recognise, so this information is lost.',
    fix: 'Correct the property name or replace it with the schema.org property that means the same thing.',
  },
  'invalid-json': {
    title: 'Structured data block cannot be read',
    why: 'A block that does not parse is ignored completely by search engines.',
    fix: 'Fix the code that prints the block so it outputs valid JSON.',
  },
  'http-status': {
    title: 'Page did not load',
    why: 'Search engines cannot read structured data from a page that returns an error.',
    fix: 'Check the page is published and loads for visitors who are not logged in.',
  },
  'fetch-failed': {
    title: 'Page could not be reached',
    why: 'The page could not be checked, so its structured data is unknown.',
    fix: 'Check the site is online and the address is correct, then run the check again.',
  },
  'property-domain': {
    title: 'Information is attached to the wrong kind of item',
    why: 'Search engines may ignore information placed on a type that does not support it.',
    fix: 'Move the information to a type that supports it, or drop it if nothing equivalent exists.',
  },
  'property-range': {
    title: 'A value is the wrong kind of item',
    why: 'Search engines expect a particular kind of item here and may ignore the value.',
    fix: 'Describe the value with one of the expected types, or wrap it in one (for example a Service provided by the business).',
  },
  'enum-value': {
    title: 'Uses a value that is not on the allowed list',
    why: 'Fields such as availability accept only fixed values; anything else is ignored.',
    fix: 'Use one of the schema.org values listed for this field.',
  },
  'superseded-type': {
    title: 'Uses an outdated type',
    why: 'schema.org has replaced this type; support for it may be dropped.',
    fix: 'Switch to the replacement type named in the finding.',
  },
  'superseded-property': {
    title: 'Uses an outdated property',
    why: 'schema.org has replaced this property; support for it may be dropped.',
    fix: 'Switch to the replacement property named in the finding.',
  },
  'retired-type': {
    title: 'Uses a retired type',
    why: 'schema.org no longer supports this type.',
    fix: 'Replace it with a current schema.org type.',
  },
  'retired-property': {
    title: 'Uses a retired property',
    why: 'schema.org no longer supports this property.',
    fix: 'Replace it with a current schema.org property.',
  },
  'unresolved-reference': {
    title: 'Points to information that is missing from the page',
    why: 'The structured data refers to something the page never describes, so the link between them is broken.',
    fix: 'Make sure the item being referred to is output on the page; this often happens when an SEO plugin is switched off.',
  },
  'duplicate-id': {
    title: 'The same item is described twice in different ways',
    why: 'Two plugins describing one item differently send search engines mixed signals.',
    fix: 'Decide which plugin owns this item and stop the other one from describing it.',
  },
  'rich-result-required': {
    title: 'Missing information Google needs for an enhanced search listing',
    why: 'Without it, Google will not show this page with extras such as review stars, prices or breadcrumbs.',
    fix: 'Add the missing property named in the finding.',
  },
  'rich-result-recommended': {
    title: 'Could give Google more detail',
    why: 'Google recommends this property; adding it can make listings more complete.',
    fix: 'Add the property named in the finding where the information exists.',
  },
  'expired-offer': {
    title: 'An offer that has ended still says it is available',
    why: 'Google treats out-of-date offers as misleading, which can affect how the site is shown.',
    fix: 'Mark ended offers as discontinued, or stop outputting them once they end.',
  },
  'date-order': {
    title: 'A date range ends before it starts',
    why: 'Search engines cannot use a reversed date range.',
    fix: 'Check the start and end dates on the item.',
  },
  'date-format': {
    title: 'A date is not in the standard format',
    why: 'Search engines read dates only in the ISO format (YYYY-MM-DD).',
    fix: 'Output the date as YYYY-MM-DD.',
  },
  'empty-value': {
    title: 'A field is present but empty',
    why: 'Empty fields add nothing and can look like an error to search engines.',
    fix: 'Fill in the value (often a site setting such as the tagline) or stop outputting the field.',
  },
  redirected: {
    title: 'Page redirects elsewhere',
    why: "Search engines see only the destination page, so this page's own structured data is never read.",
    fix: 'Decide whether the page should exist on its own; if not, make sure the destination describes it.',
  },
  'no-structured-data': {
    title: 'Page has no structured data',
    why: 'Search engines have nothing beyond the visible text to understand this page.',
    fix: 'Enable structured data for this kind of page in the SEO plugin, or add it in the plugin that owns the content.',
  },
  'pending-type': {
    title: 'Uses a type schema.org has not finalised',
    why: 'It is valid, but Google does not use it for enhanced listings yet.',
    fix: 'No action needed now; keep it, and review when schema.org finalises it.',
  },
  'pending-property': {
    title: 'Uses a property schema.org has not finalised',
    why: 'It is valid, but Google does not use it for enhanced listings yet.',
    fix: 'No action needed now; keep it, and review when schema.org finalises it.',
  },
  'address-text': {
    title: 'Address is a single line of text',
    why: 'Google reads a business address best when it is split into street, town, region, postcode and country.',
    fix: 'Output the address as a PostalAddress with separate parts.',
  },
  'text-for-thing': {
    title: 'Plain text where a described item is expected',
    why: 'Search engines understand a described item (with a type and name) better than a bare word.',
    fix: 'Describe the value as an item, or give its web address.',
  },
  'html-entity': {
    title: 'Text contains HTML codes instead of characters',
    why: 'Codes such as &#8211; may appear literally in search listings.',
    fix: 'Decode HTML entities before the text is output in structured data.',
  },
};

const FALLBACK_GUIDE = {
  title: 'Other finding',
  why: 'See the detail for what was found.',
  fix: 'Review the detail with your developer.',
};

/**
 * Supporting types every WordPress page carries; left out of the per-page
 * "what this page describes" column so the main subject stands out.
 */
const SUPPORTING_TYPES = new Set([
  'BreadcrumbList',
  'CommentAction',
  'EntryPoint',
  'GeoCoordinates',
  'ImageObject',
  'ListItem',
  'Organization',
  'PostalAddress',
  'PriceSpecification',
  'PropertyValue',
  'Rating',
  'ReadAction',
  'SearchAction',
  'UnitPriceSpecification',
  'WebSite',
]);

function guideFor(check) {
  return CHECK_GUIDE[check] || FALLBACK_GUIDE;
}

function cell(text) {
  return String(text ?? '')
    .replace(/\|/g, '\\|')
    .replace(/\r?\n/g, ' ');
}

/** Plain names for the schema.org types clients meet most often. */
const FRIENDLY_TYPES = {
  AboutPage: 'About page',
  Article: 'Article',
  BlogPosting: 'Blog post',
  CollectionPage: 'Listing page',
  ContactPage: 'Contact page',
  Event: 'Event',
  FAQPage: 'FAQ page',
  Hotel: 'Hotel',
  LocalBusiness: 'Local business',
  LodgingBusiness: 'Accommodation',
  Offer: 'Offer',
  Person: 'Person',
  Place: 'Place',
  Product: 'Product',
  ProfilePage: 'Profile page',
  Review: 'Review',
  SearchResultsPage: 'Search results',
  TouristDestination: 'Destination',
  TouristTrip: 'Tour',
  TravelAgency: 'Travel agency',
  WebPage: 'Web page',
};

/** The page's path, which is how a client recognises it. */
function pageName(page) {
  try {
    const { pathname, search } = new URL(page.url);
    return `${pathname}${search}` || '/';
  } catch {
    return page.url;
  }
}

/** What kind of page this is, from discovery's kind and label. */
function pageKind(page) {
  const label = page.label || '';
  switch (page.kind) {
    case 'single':
      return label ? `${label}: single item` : 'Single item';
    case 'term':
      return label ? `${label}: term page` : 'Term page';
    case 'page':
      return `Page: ${label}`;
    case 'extra':
      return 'Added page';
    default:
      return label || '-';
  }
}

function mainTypes(page) {
  return Object.keys(page.types || {})
    .filter((t) => !SUPPORTING_TYPES.has(t))
    .sort();
}

function friendly(type) {
  const name = FRIENDLY_TYPES[type];
  return name && name !== type ? `${name} (${type})` : type;
}

/** Group findings across pages by check and detail, most severe and widespread first. */
function groupFindings(pages) {
  const groups = new Map();
  for (const page of pages) {
    for (const f of page.findings) {
      const key = `${f.severity}|${f.check}|${f.detail}`;
      if (!groups.has(key)) groups.set(key, { ...f, pages: [] });
      const group = groups.get(key);
      if (!group.pages.includes(page)) group.pages.push(page);
    }
  }
  return [...groups.values()].sort(
    (a, b) =>
      SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity] ||
      b.pages.length - a.pages.length ||
      a.check.localeCompare(b.check)
  );
}

function pageList(pages, limit = 10) {
  const names = pages.map((p) => `[${pageName(p)}](${p.url})`);
  if (names.length <= limit) return names.join(', ');
  return `${names.slice(0, limit).join(', ')} and ${names.length - limit} more`;
}

/**
 * Markdown report for a client: summary, what each page describes, issues
 * in priority order with why they matter and what to do, and how the check
 * was made.
 *
 * @param {object} report Validation report (see data-model.md).
 * @param {object} [opts]
 * @param {string} [opts.client] Client or site name for the title.
 * @param {string} [opts.site] Site URL.
 * @param {string} [opts.date] Report date, YYYY-MM-DD.
 */
function renderClientReport(report, { client, site, date } = {}) {
  const { pages } = report;
  const groups = groupFindings(pages);
  const counts = { error: 0, warn: 0, info: 0 };
  for (const g of groups) counts[g.severity]++;
  const clean = pages.filter((p) => !p.findings.some((f) => f.severity !== 'info'));
  const host = site || (pages[0] ? new URL(pages[0].url).origin : '');
  const title = client || host;

  const lines = [
    `# Structured data report: ${title}`,
    '',
    `- **Site:** ${host}`,
    `- **Date:** ${date || new Date().toISOString().slice(0, 10)}`,
    `- **Pages checked:** ${pages.length}`,
    `- **Checked against:** schema.org release ${report.vocabulary.version}, and Google's requirements for enhanced search listings`,
    '',
    '## Summary',
    '',
    'Structured data is code in each page that tells search engines what the page is about: a tour,',
    'a review, a special offer, a business. It does not change what visitors see. Done well, it helps',
    'search engines understand the site and can earn enhanced listings, such as prices or breadcrumbs.',
    '',
  ];

  if (!counts.error && !counts.warn) {
    lines.push(
      `All ${pages.length} pages have valid structured data with nothing that needs fixing.` +
        (counts.info ? ` There are ${counts.info} suggestions for improvement below.` : '')
    );
  } else {
    lines.push(
      (clean.length
        ? `${clean.length} of ${pages.length} pages have nothing that needs fixing. `
        : `None of the ${pages.length} pages is free of issues yet. `) +
        `We found ${counts.error + counts.warn} issues to fix and ${counts.info} suggestions for improvement.`
    );
    const everywhere = groups.filter(
      (g) => g.severity !== 'info' && g.pages.length === pages.length
    );
    if (everywhere.length && pages.length > 1) {
      lines.push(
        '',
        `${everywhere.length === 1 ? 'One issue affects' : `${everywhere.length} issues affect`} every page, ` +
          'usually because of a single site-wide setting, so fixing it once clears it everywhere: ' +
          `${everywhere.map((g) => `"${guideFor(g.check).title}" (${g.detail})`).join('; ')}.`
      );
    }
  }
  lines.push(
    '',
    '| Priority | Issues | What it means |',
    '| --- | --- | --- |',
    `| Must fix | ${counts.error} | Search engines cannot read this structured data at all. |`,
    `| Should fix | ${counts.warn} | Valid in part, but some information is ignored or a listing enhancement is lost. |`,
    `| Could improve | ${counts.info} | Works today; these would make the information richer. |`,
    '',
    '## What each page describes',
    '',
    '| Page | Kind of page | Describes | Status |',
    '| --- | --- | --- | --- |'
  );
  for (const page of pages) {
    const fixes = page.findings.filter((f) => f.severity !== 'info').length;
    const status =
      page.status === null || page.status === undefined
        ? 'Could not be checked'
        : fixes
          ? `${fixes} to fix`
          : 'OK';
    const describes = mainTypes(page).map(friendly).join(', ') || 'Website information only';
    lines.push(
      `| [${cell(pageName(page))}](${page.url}) | ${cell(pageKind(page))} | ${cell(describes)} | ${status} |`
    );
  }

  const fixGroups = groups.filter((g) => g.severity !== 'info');
  if (fixGroups.length) {
    lines.push('', '## Issues to fix', '');
    fixGroups.forEach((g, i) => {
      const guide = guideFor(g.check);
      lines.push(
        `### ${i + 1}. ${guide.title}`,
        '',
        `- **Priority:** ${PRIORITY[g.severity]}`,
        `- **What we found:** ${g.detail}`,
        `- **Why it matters:** ${guide.why}`,
        `- **What to do:** ${guide.fix}`,
        `- **Pages affected (${g.pages.length}):** ${pageList(g.pages)}`,
        ''
      );
    });
    lines.pop(); // the next section adds its own blank line
  }

  const suggestions = groups.filter((g) => g.severity === 'info');
  if (suggestions.length) {
    lines.push(
      '',
      '## Suggestions for improvement',
      '',
      '| Suggestion | Detail | Pages |',
      '| --- | --- | --- |'
    );
    for (const g of suggestions) {
      lines.push(
        `| ${cell(guideFor(g.check).title)} | ${cell(g.detail)} | ${cell(pageList(g.pages, 3))} |`
      );
    }
  }

  lines.push(
    '',
    '## How this check was made',
    '',
    "- Each page was loaded as a visitor would see it, and its structured data was read from the page's code.",
    `- Every type and property was checked against schema.org release ${report.vocabulary.version}, the shared vocabulary used by Google, Bing and others.`,
    "- Enhanced-listing requirements are a summary of Google's published guidance. Google decides which",
    "  pages get enhanced listings; confirm important pages with Google's Rich Results Test",
    '  (<https://search.google.com/test/rich-results>) once the site is public.',
    '- Pages behind a login, and pages not in the list above, were not checked.',
    '- A spreadsheet version of these findings (CSV) can be provided for tracking fixes.'
  );
  const skipped = (report.skipped || []).map((s) => `${s.label} (${s.reason})`);
  if (skipped.length) lines.push(`- Not checked, with the reason: ${skipped.join(', ')}.`);
  for (const note of report.notes || []) lines.push(`- ${note}`);
  return `${lines.join('\n')}\n`;
}

/**
 * Quote a CSV field (RFC 4180). A field that a spreadsheet would read as a
 * formula (starting with =, +, -, @, tab or carriage return) is prefixed with
 * an apostrophe, so opening the file never runs anything (CSV injection).
 */
function csvField(value) {
  let text = String(value ?? '');
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

const CSV_COLUMNS = [
  'page_url',
  'page_path',
  'page_kind',
  'http_status',
  'priority',
  'severity',
  'check',
  'issue',
  'detail',
  'why_it_matters',
  'what_to_do',
  'location',
];

/**
 * CSV with one row per finding, plus one row for each page without findings
 * so the file lists every page checked. Starts with a UTF-8 byte order mark
 * so spreadsheet programs read accented characters correctly.
 */
function renderCsv(report) {
  const rows = [CSV_COLUMNS];
  for (const page of report.pages) {
    const base = [page.url, pageName(page), page.kind ? pageKind(page) : '', page.status ?? ''];
    if (!page.findings.length) {
      rows.push([...base, 'None', '', '', 'No issues found', '', '', '', '']);
      continue;
    }
    for (const f of page.findings) {
      const guide = guideFor(f.check);
      rows.push([
        ...base,
        PRIORITY[f.severity],
        f.severity,
        f.check,
        guide.title,
        f.detail,
        guide.why,
        guide.fix,
        f.path,
      ]);
    }
  }
  return `\uFEFF${rows.map((row) => row.map(csvField).join(',')).join('\r\n')}\r\n`;
}

module.exports = {
  CHECK_GUIDE,
  CSV_COLUMNS,
  PRIORITY,
  csvField,
  groupFindings,
  renderClientReport,
  renderCsv,
};
