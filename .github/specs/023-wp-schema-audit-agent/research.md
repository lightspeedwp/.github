# Research: WordPress Schema Audit Agent

Decisions taken while building the agent, with the evidence behind each.

## R1. Vocabulary source

- **Decision**: Use `data/releases/<version>/schemaorg-all-https.jsonld` from
  <https://github.com/schemaorg/schemaorg>, default to the highest release directory, cache per
  release.
- **Rationale**: It is the canonical machine-readable vocabulary, versioned, and includes the
  pending and attic sections (`schema:isPartOf`), `schema:supersededBy`, domains, ranges and
  enumeration members. Release 30.1 (checked 2026-10-14) has 1,017 types and 1,696 properties.
- **Alternatives considered**: The Schema Markup Validator (validator.schema.org) has no supported
  API; scraping it is fragile. Google's Rich Results Test needs public URLs and cannot reach local
  sites.

## R2. Node.js instead of Python and curl

- **Decision**: Write the tool in Node.js with `node:https`.
- **Rationale**: The first manual round used Python's `urllib`, which failed against the
  development site with `TLSV1_ALERT_PROTOCOL_VERSION` because the system Python linked an old
  OpenSSL. Node.js bundles its own OpenSSL, the repository already requires Node 20, and the
  sibling agent's tool is Node. No shelling out to `curl` is needed.

## R3. Self-signed certificates on local sites

- **Decision**: Set `rejectUnauthorized: false` only for local development hosts.
- **Rationale**: Local by Flywheel and WordPress Studio serve `*.local` sites with self-signed
  certificates (`curl` exit 60 without `-k`, 2026-10-08). Relaxing the check everywhere would hide
  real certificate faults on staging and live, so the tool decides from the hostname and offers no
  switch to relax it elsewhere.

## R4. Finding archives

- **Decision**: Request `/?post_type=<slug>` and treat the result as an archive when WordPress
  redirects to a different URL, or when the body carries `post-type-archive-<slug>`; prefer the
  page's canonical link for the URL.
- **Rationale**: On the development and local sites (2026-10-14) WordPress rendered the archive in
  place with HTTP 200 and no redirect, so a redirect-only check found no archives. The REST API's
  types endpoint does not expose `has_archive` to anonymous visitors.

## R5. Excluding non-public post types

- **Decision**: Exclude a fixed list of WordPress internal types, then keep a type only if its
  newest item answers HTTP 200.
- **Rationale**: The REST API lists plugin types such as Popup Maker's `popup` and `pum_cta` that
  have links but are not publicly viewable; `viewable` is only in the `edit` context, which needs
  authentication.

## R6. Rich-result rules

- **Decision**: Keep a short, dated rules table in the tool (review, rating, breadcrumb, article,
  local business, event, product, offer, organisation), apply full-listing rules only to standalone
  nodes, and exempt a review nested in the item it reviews from `itemReviewed`.
- **Rationale**: A summary of Google Search Central's structured data feature guides, written on
  2026-10-14 without re-reading each guide; each rule must be verified against its guide before it
  is relied on or changed (see Assumptions in spec.md). Without the standalone scope, every nested reference such as
  `itemReviewed: { "@type": "LodgingBusiness", "name": … }` was held to the requirements of a full
  business listing.

## R7. Known false alarms from the manual rounds

- `query-input` on `SearchAction` was reported as an unknown property on every page. It is the
  schema.org Actions annotation (`<property>-input`), so the tool accepts it when the base
  property exists.
- Breadcrumb `item` values given as URL strings were noted on every page. Google reads them as
  references, so URL strings are accepted where an object is expected.
- `availability: "https://schema.org/LimitedAvailability"` was noted as a plain string. The tool now
  checks such values against the enumeration's members instead.

## R8. Agent layout

- **Decision**: Agent-local skills and tool, registered with `scripts/agents/generate-agent-defs.cjs`.
- **Rationale**: Same layout as the WordPress DB Migration Agent (spec 022), so both WordPress
  operations agents are found and maintained the same way.
