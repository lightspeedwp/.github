---
name: technical-seo-audit
description: audit technical SEO readiness for lightspeed website projects using website
  urls, crawl exports, sitemap lists, redirect maps, metadata samples, launch checklists,
  staging or live observations, and developer notes. use when the user asks for a
  technical SEO audit, crawlability or indexation review, canonicals review, metadata
  QA, migration SEO risk review, internal linking risk review, sitemap and robots
  checks, structured-data validation notes, or a prioritised technical SEO fix list
  before or after launch.
---

# LightSpeed Technical SEO Auditor

## Overview

Use this skill when the work is specifically about technical SEO health rather than broader content strategy, schema planning, or general launch QA.

This skill is for audits such as:

- crawlability and indexation review
- robots.txt and XML sitemap review
- canonical and duplicate-content risk review
- pagination, faceted navigation, or parameter risk notes
- metadata consistency review at template or sample-page level
- internal linking depth, orphan-page and crawl-path risks
- relaunch, migration and redirect SEO risks
- structured-data implementation observations
- prioritised developer and content-team fix lists

Use this skill when the user wants diagnosis, prioritisation, and implementation-ready recommendations.

Do not use this skill as the primary workflow for:

- writing final website copy
- general schema strategy when no technical audit is requested
- redirect mapping itself when the task is mainly URL mapping
- final launch sign-off across all QA areas

In those cases, coordinate with the more specific attached workflow instead.

## Required Inputs

Use whatever evidence the user provides. Typical inputs include:

- live or staging website URL
- crawl export or page inventory
- XML sitemap URLs or sitemap exports
- robots.txt content
- redirect map or migration notes
- metadata samples or template outputs
- page-type list or information architecture
- analytics, Search Console, or indexation observations when available
- notes from developers, SEO consultants, or launch managers

If evidence is incomplete, do not block unnecessarily. Run the strongest audit possible from available material and label assumptions clearly.

## Audit Workflow

1. Determine the audit context.
   - Is this pre-launch, relaunch, migration, post-launch diagnosis, or baseline health review?
   - Is the site WordPress, WooCommerce, publishing, tourism, lead generation, or another site type with indexation or duplication patterns that matter?

2. Identify the evidence set.
   - List what sources are available.
   - Note what is missing but materially important.
   - Distinguish observed issues from inferred risks.

3. Review the core technical SEO areas that are relevant to the request.
   - Crawlability and render access
   - Indexation controls
   - Canonicals and duplication
   - Metadata consistency
   - Sitemap quality
   - Robots directives
   - Internal linking and orphan risks
   - Redirect and migration controls
   - Structured data implementation notes
   - Performance or Core Web Vitals observations when those affect discoverability or launch risk

4. Classify findings by severity.
   - Critical: likely to block crawling, indexing, or major launch visibility
   - High: likely to create material discoverability, duplication, or migration risk
   - Medium: meaningful issue but not usually launch-blocking on its own
   - Low: useful improvement, hygiene item, or watchlist issue

5. Translate findings into fix-ready guidance.
   - Say what is wrong
   - Why it matters
   - What team should act on it
   - What the recommended fix is
   - What should be checked after the fix

6. End with a prioritised action plan.
   - Immediate launch blockers
   - Short-term fixes
   - Post-launch improvements

## Audit Areas

### Crawlability and indexation

Check for issues such as:

- pages blocked unintentionally by robots.txt
- noindex usage on pages that should rank
- staging protections or accidental carryover to live
- canonicalised or redirected pages that conflict with index goals
- weak crawl-path access to important templates or deep pages
- JavaScript or rendering dependence that may hide critical content or links

### Canonicals and duplication

Check for issues such as:

- self-referencing canonicals missing where expected
- canonicals pointing to the wrong destination
- cross-template duplication risks
- duplicate category, tag, archive or filtered pages
- mixed trailing slash, HTTP/HTTPS, www/non-www, or parameter variants
- pagination or faceted navigation patterns that create unnecessary duplicate URLs

### Metadata and template consistency

Check for issues such as:

- duplicate title tags or meta descriptions
- missing or weak page titles on important templates
- titles or descriptions that are too generic for key commercial pages
- inconsistent heading hierarchy where it signals template or publishing issues
- template fields that are likely to produce widespread metadata problems at scale

Do not turn this into a copywriting exercise. Focus on technical consistency and scale risk.

### Sitemaps and robots

Check for issues such as:

- sitemaps containing non-canonical, redirected, noindex, or broken URLs
- missing important content types from sitemaps
- poor sitemap segmentation for large sites
- robots rules that conflict with sitemap or indexation intent

### Internal linking and crawl depth

Check for issues such as:

- orphan or weakly linked high-value pages
- important pages too deep in the architecture
- navigation or contextual linking gaps
- internal links pointing to redirected URLs
- weak connection between core commercial pages, FAQs, supporting content, and conversion pages

### Redirect and migration risk

When the request involves a redesign, rebuild, migration, or restructure, review:

- redirect coverage quality
- redirect-chain risk
- missing mappings for valuable legacy URLs
- mismatch between old IA and new IA
- likely 404 clusters
- launch-day validation steps needed for SEO continuity

### Structured data observations

Review implementation quality at a practical level.

Focus on:

- missing schema on templates that clearly need it
- schema-output mismatch with page content
- duplicated or conflicting structured data sources
- likely validation or maintenance issues

Do not duplicate broad schema strategy work that belongs in the dedicated schema planning workflow. Here, keep the focus on technical implementation quality and risk.

## Output Contract

Default to Markdown.

Use this structure unless the user asks for a lighter format:

### 1. Executive summary

- audit context
- overall risk level
- top 3 technical SEO concerns

### 2. Evidence reviewed

- source list
- coverage limitations
- assumptions

### 3. Findings table

Use columns:

- Area
- Issue
- Severity
- Why it matters
- Recommended fix
- Owner
- Verification step

### 4. Priority actions

Group into:

- Launch blockers
- Pre-launch fixes
- Post-launch improvements

### 5. Additional notes

Use for:

- migration warnings
- WordPress-specific implementation notes
- tooling caveats
- unclear evidence that needs confirmation

### 6. Internal LightSpeed notes

Include:

- delivery risk
- likely specialist involvement needed
- whether the issue is developer-led, SEO-led, content-led, or mixed
- any dependencies on redirects, launch QA, analytics, or schema workflows

## Decision Rules

- If evidence is weak, say so clearly. Do not invent crawl findings.
- If the issue is only a suspected risk, label it as a risk or likely issue, not a confirmed defect.
- If the user asks for a technical SEO audit during a redesign or relaunch, include migration and redirect risk even if the redirect map is incomplete.
- If the user asks for a launch review and technical SEO is only one part, keep this skill focused on the technical SEO section and let broader launch work stay elsewhere.
- If the request overlaps heavily with redirect mapping, schema planning, or full launch QA, provide the technical SEO component and explicitly note the adjacent workflow that should also run.

## LightSpeed Standards

Prioritise recommendations that are:

- practical for WordPress and block-theme delivery teams
- maintainable after launch
- understandable by developers, content editors, and project leads
- commercially relevant, not just theoretically ideal

Prefer fix-ready wording over generic SEO commentary.

Good example:

- "XML sitemap includes redirected legacy URLs from the pre-migration structure. Remove redirected URLs, keep only canonical 200-status destinations, then resubmit the cleaned sitemap after launch."

Weak example:

- "Improve the sitemap for SEO."

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
