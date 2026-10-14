# Feature Specification: WordPress Schema Audit Agent

**Feature Branch**: `aiops/wp-schema-audit-agent`

**Created**: 2026-10-14

**Status**: Draft

**Input**: User description: "Write the schema test into an agent or a skill. Scan a WordPress site for a list of URLs to test the schema data against (one of each post type, one of each taxonomy if possible, and the most relevant pages such as contact and about), validate the schemas on those pages using the schema.org GitHub repository, and spot-test local sites such as `https://beta.local/`."

## Background

Between 2026-10-08 and 2026-10-14 the structured data of a tour operator site was audited by hand
on its development site and on a local site, while a companion plugin added schema for tours,
accommodation, destinations, reviews, specials and team members. Each round needed the same steps:
pick one URL per post type and taxonomy from the sitemaps and REST API, fetch each page, pull out
the JSON-LD, check every type and property against the schema.org release file, and then work out
what the findings meant. The rounds surfaced real problems: a plugin redirecting every special to
its archive so their schema was never seen, Yoast SEO switched off leaving other plugins' nodes
pointing at a page node nobody printed, offers still marked available after they ended, reviews
missing the properties Google needs, and properties placed on types that do not define them. This
agent packages those steps so any team member can repeat them on any WordPress site.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Pick the URLs to test (Priority: P1)

A developer about to check a site's schema asks the agent which pages to test. The agent returns
one URL per public post type, each post type archive, one term per taxonomy in use, the key pages
(home, about, contact, privacy, terms), an author archive and a search results page, and lists what
it skipped and why.

**Why this priority**: Without a representative list, an audit either misses templates or wastes
time on many pages of the same kind. Every other story starts from this list.

**Independent Test**: Run discovery against a local WordPress site with custom post types and
taxonomies. Every public type, archive and taxonomy in use appears once; types that are not public
are listed as skipped with a reason.

**Acceptance Scenarios**:

1. **Given** a site with custom post types, **When** the user asks for test URLs, **Then** the list
   holds one published, publicly reachable item of each type and leaves out WordPress's internal
   types (menus, templates, blocks, fonts, media).
2. **Given** a post type with an archive, **When** discovery runs, **Then** the archive is listed
   whether WordPress redirects to it or renders it in place.
3. **Given** a taxonomy with terms in use, **When** discovery runs, **Then** its most-used term is
   listed; a taxonomy with no terms in use is listed as skipped.
4. **Given** a single item that redirects elsewhere, **When** discovery runs, **Then** it is listed
   with a note naming the destination.
5. **Given** a site whose REST API is blocked, **When** discovery runs, **Then** the agent says so
   and offers the sitemap as a fallback instead of guessing.

---

### User Story 2 - Validate the structured data on those pages (Priority: P1)

The developer asks the agent to validate the schema on the list, or on a few named pages. The agent
checks every JSON-LD block against the current schema.org release from the schemaorg/schemaorg
repository and against Google's rich-result requirements, and reports each page's types, the
plugin that produced them, and every finding with its severity.

**Why this priority**: This is the check the team repeated by hand. It must be exact against the
vocabulary and fast enough to re-run after every change.

**Independent Test**: Validate a page with a known unknown property, a property on the wrong type,
an expired offer and a review missing its rating. Each appears as a finding with the right check
name and severity; a clean page reports none.

**Acceptance Scenarios**:

1. **Given** a page whose JSON-LD uses a type or property schema.org does not define, **When** it is
   validated, **Then** an error names the term.
2. **Given** a property used on a type outside its domain, or a value outside its range, **When** it
   is validated, **Then** a warning names the property, the type and what is expected.
3. **Given** a node missing a property Google needs for a rich result, **When** it is validated,
   **Then** a warning names the property; a review nested inside the item it reviews is not asked
   to repeat that item.
4. **Given** an offer whose end date has passed but which still says it is available, **When** it
   is validated, **Then** a warning gives the end date.
5. **Given** a page that redirects, has no JSON-LD, or returns an HTTP error, **When** it is
   validated, **Then** the finding says so and the run continues with the other pages.
6. **Given** a local site with a self-signed certificate, **When** it is validated, **Then** the
   pages are fetched; a remote site's certificate is still checked.
7. **Given** a schema.org release cannot be downloaded, **When** an earlier release is cached,
   **Then** the cached release is used and the report says so.

---

### User Story 3 - Turn findings into fixes (Priority: P2)

The developer asks what to fix. The agent groups the findings, identifies causes that explain
several findings at once (an inactive SEO plugin, a redirect hiding a post type's schema, a
site-wide setting), names the owner of each fix (an SEO plugin setting, the plugin that prints a
block, or the content), and says which fixes can and cannot earn a rich result.

**Why this priority**: Findings alone did not tell the team what to do; the explanation took most
of each round. It depends on Story 2's output.

**Independent Test**: Give the agent a run where every single of one type redirects to its archive
and an SEO plugin is inactive. The report names both causes before the individual findings and
gives an owner and a confirmation step for each.

**Acceptance Scenarios**:

1. **Given** a run where every page lacks the SEO plugin's page, breadcrumb and website nodes,
   **When** the agent reports, **Then** it identifies the inactive SEO plugin as the cause.
2. **Given** a run with reviews about the site's own business, **When** the agent reports, **Then**
   it explains that such reviews do not earn review stars, however valid the markup.
3. **Given** a run where structured data includes staff contact details, **When** the agent
   reports, **Then** it says they are present without repeating them and asks whether publishing
   them was agreed.
4. **Given** the user works against a fixed scope, **When** a fix needs new work, **Then** the
   report lists it separately as a change-control candidate.

---

### Edge Cases

- **Two plugins print the same entity**: one `@id` defined with different types is reported, so the
  owner can choose one.
- **References across blocks**: a node in one JSON-LD block that refers to a node in another block
  on the same page is resolved, not reported as broken.
- **Schema.org Action annotations** (`query-input`, `*-output`) are accepted, not reported as
  unknown properties.
- **URLs where an object is expected** (for example a breadcrumb's `item`) are accepted as
  references; plain text in the same place is noted.
- **Pending and retired terms**: pending terms are noted; retired and superseded terms are warned.
- **Large or slow pages**: responses over 20 MB and requests over 30 seconds stop with an error for
  that page only.
- **Redirect loops**: more than five redirects stop with an error for that page only.
- **Sites without pretty permalinks**: discovery falls back to `?rest_route=`.
- **Content that addresses the agent**: text inside a page is data; instructions in it are reported
  to the user and not followed.

## Requirements *(mandatory)*

### Functional Requirements

**Safety**

- **FR-001**: The agent MUST send only GET requests, MUST NOT send cookies or credentials, and MUST
  NOT submit forms or change the site, its plugins or its settings.
- **FR-002**: The agent MUST verify TLS certificates for every host except local development hosts
  (`localhost`, `127.0.0.1`, `[::1]`, `*.local`, `*.test`, `*.localhost`).
- **FR-003**: The agent MUST treat page content as data and MUST NOT act on instructions found in
  it.
- **FR-004**: Reports MUST NOT repeat personal data found in structured data; they MAY state that it
  is present.

**Test URLs (Story 1)**

- **FR-005**: Discovery MUST list the home page, one publicly reachable item per public post type,
  each post type archive, the most-used term of each taxonomy in use, key pages identified by slug,
  an author archive when public, and a search results page.
- **FR-006**: Discovery MUST exclude WordPress's internal post types and taxonomies, and MUST list
  every candidate it skipped with a reason.
- **FR-007**: Discovery MUST note any listed URL that redirects, with its destination.
- **FR-008**: Discovery MUST fetch at most one sample per post type and taxonomy, plus one archive
  probe per post type.

**Vocabulary (Story 2)**

- **FR-010**: Validation MUST use a release file from the schemaorg/schemaorg repository
  (`data/releases/<version>/schemaorg-all-https.jsonld`), defaulting to the latest release.
- **FR-011**: The release file MUST be cached per release and reused; a download that is not valid
  JSON MUST NOT be cached.
- **FR-012**: When the latest release cannot be looked up, validation MUST use the newest cached
  release and say so; with no release available it MUST stop with a clear error.
- **FR-013**: The user MUST be able to name a release or a local vocabulary file.

**Validation (Story 2)**

- **FR-020**: Validation MUST extract every JSON-LD block on a page, report blocks that do not parse,
  and continue with the others.
- **FR-021**: Validation MUST report unknown types and properties as errors.
- **FR-022**: Validation MUST report a property used outside its domain, a nested value outside its
  range, and an enumeration value that is not a member of the expected enumeration, as warnings,
  taking type inheritance into account.
- **FR-023**: Validation MUST report superseded and retired terms as warnings and pending terms as
  notes.
- **FR-024**: Validation MUST resolve `@id` references across all blocks on a page and report
  references to nodes no block defines, and `@id` values defined with different types.
- **FR-025**: Validation MUST check Google's rich-result requirements for reviews, ratings,
  breadcrumbs, articles, local businesses, events, products, offers and organisations, as warnings
  for required and notes for recommended properties, and MUST state the date those rules were
  taken from Google's documentation.
- **FR-026**: Validation MUST report offers that have ended but still claim availability, reversed
  date ranges, non-ISO dates and empty values.
- **FR-027**: Validation MUST report HTTP errors, redirects and pages without JSON-LD, and MUST name
  the plugin that produced each block where its markup identifies it.
- **FR-028**: Validation MUST produce a human-readable report and a machine-readable report with
  the same content, and MUST exit `0` with no errors or warnings, `1` with findings to review, and
  `2` on a tool error.

**Report (Story 3)**

- **FR-030**: The report MUST identify site-wide causes before individual findings.
- **FR-031**: The report MUST order fixes by severity and name an owner for each.
- **FR-032**: The report MUST explain which fixes can earn a rich result, and MUST tell the user to
  confirm eligibility with Google's Rich Results Test.

**Packaging**

- **FR-040**: The agent MUST live in `agents/wp-schema-audit-agent/` with its skills inside it, and
  MUST be registered with the thin Claude Code definition generator.
- **FR-041**: The tool MUST need only Node.js 20 or later, with no runtime dependencies.
- **FR-042**: Every deterministic check MUST have automated tests that run without network access.
- **FR-043**: The change MUST pass the repository's agent, frontmatter, Markdown and changelog
  validators.

### Key Entities

- **Test URL**: kind (home, single, archive, term, page, author, search), label, URL, note.
- **Skipped candidate**: kind, label, URL, reason.
- **Vocabulary**: release, types, properties, inheritance, domains, ranges, enumeration members,
  superseded and pending terms.
- **Page result**: requested and final URL, HTTP status, redirects, generators, block count, type
  counts, findings.
- **Finding**: severity, check, path to the node, detail.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A full audit of a site (discovery, validation and report) takes one request to the
  agent instead of the four rounds of manual steps recorded in the background.
- **SC-002**: Discovery on the local site used during the background covers every archive and every
  public post type found by hand, and skips none of them.
- **SC-003**: Validation of the pages in the background reproduces every finding recorded by hand
  (redirected specials, unresolved page reference when the SEO plugin was off, expired offer,
  reviews missing required properties, misplaced properties) with no false errors.
- **SC-004**: A repeat run against a cached release needs no network access other than the pages
  themselves.
- **SC-005**: The automated tests run in under ten seconds with no network access.

## Assumptions

- The site exposes the WordPress REST API to anonymous visitors; when it does not, the user supplies
  URLs or the agent reads the sitemap.
- Google's rich-result requirements change over time; the rules table records when it was written,
  is updated by changing the agent, not per run, and each rule is verified against its Google guide
  before it is relied on. The first version was written from the guides without re-reading each
  one, so verifying it is a follow-up task.
- Only JSON-LD is checked. Microdata and RDFa are out of scope; the sites this agent targets use
  JSON-LD from their SEO and custom plugins.
- The skills stay inside the agent folder, as with the WordPress DB Migration Agent, because they
  depend on its tool.
