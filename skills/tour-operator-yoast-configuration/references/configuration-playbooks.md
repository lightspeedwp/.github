# Configuration Playbooks

Use this reference when a request needs a standard Yoast setup strategy for a WordPress tour operator website or a related non-commerce WordPress site type.

## Tour operator baseline

Use for sites with destinations, tours, accommodation, travel styles, itineraries, guides, FAQs, enquiry pages or booking lead-generation flows.

Recommended starting posture:

- Keep high-value destination, tour, accommodation, guide and enquiry pages indexable when they have useful unique content.
- Review destination, tour category, travel-style and accommodation archives before changing indexation.
- Treat thin, duplicated, filtered or low-intent archives as decision items rather than automatically excluding them.
- Use metadata templates as a base, then manually review important destinations, tours and enquiry pages.
- Validate breadcrumbs against the intended user journey, not only the WordPress hierarchy.
- Confirm XML sitemap inclusion matches approved indexation decisions.
- QA rendered output after every title, meta, canonical, robots, sitemap, schema, breadcrumb or redirect change.

## Standard WordPress baseline

Use for general business, local, publisher, multilingual or migration/rebuild sites that are not specialist tour operator builds.

Recommended starting posture:

- Keep important public pages indexable unless there is a clear business, legal or duplication reason not to.
- Noindex low-value archives only after checking content quality, internal linking value and sitemap state.
- Avoid broad noindex or sitemap exclusions without a decision record.
- Use client-safe wording and avoid promising ranking, indexing or rich-result outcomes.
- For migration work, separate proposed redirects from live redirect evidence.

## Profile selection

- Tour operator website -> `profiles/tour-operator-website.md` and `intake/tour-operator-intake.md`.
- Business website -> `profiles/business-website.md`.
- Local business -> `profiles/local-business.md`.
- Publisher or blog -> `profiles/publisher-blog.md`.
- Multilingual site -> `profiles/multilingual-site.md`.
- Migration or rebuild -> `profiles/migration-rebuild.md` and `intake/migration-intake.md`.

## Decision points

Create or recommend a decision record when the strategy changes:

- indexation
- canonical targets
- sitemap inclusion
- schema strategy
- breadcrumb logic
- redirect handling
- multilingual alternates
- bulk metadata approval
- AI-assisted metadata approval
- developer customisation

## QA minimum

For any chosen playbook, include at least:

- rendered title and meta sample
- canonical check
- robots directive check
- XML sitemap check
- schema output check
- breadcrumb check
- redirect sample where relevant
- taxonomy archive sample where relevant
- multilingual sample where relevant
- post-change evidence and rollback notes for risky changes
