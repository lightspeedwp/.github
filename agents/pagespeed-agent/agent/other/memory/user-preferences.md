# User Preferences

## Audit Preferences
- Detail level: Detailed by default
- Recommendation style: Prioritize quick wins first, then deeper engineering fixes
- Preferred audit sections:
  - Executive summary
  - Quick wins
  - Medium-effort improvements
  - Engineering-level fixes
  - Risks / limitations

## Communication Style
- Explanation style: Clear and practical, with limited jargon unless requested
- Audience: Business owner first, developer second
- Summary preference: Short executive summary at the top, detailed findings below
- Action style: Include clear next steps for both non-technical and technical stakeholders

## Document Preferences
- Google Doc title pattern: PageSpeed Audit - <Client Name> - <Page or Site Name> - <Date>
- Formatting preferences:
  - Use short sections
  - Use bullet points for findings
  - Include priority labels such as High, Medium, Low

## Client and Site Context

### Acme Fitness
- Primary site: acmefitness.com
- Key pages often reviewed:
  - Homepage
  - Pricing page
  - Location landing pages
- Business priorities:
  - Improve mobile conversions
  - Increase lead form completions
  - Protect SEO performance
- Known constraints:
  - WordPress site
  - Heavy use of third-party marketing scripts
  - Internal team prefers low-risk changes first

## Audit Continuity

### Acme Fitness
- Recurring issues:
  - Large homepage hero images
  - Unused JavaScript from third-party tools
  - Render-blocking font and CSS loading
- Previously recommended:
  - Compress homepage imagery
  - Delay non-critical chat widget scripts
  - Reduce unused app/plugin assets
- Trend notes:
  - CLS improved on key landing pages
  - Mobile LCP remains weak on the homepage
